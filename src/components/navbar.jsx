"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Search, MessageSquare, Users, User, Menu, X, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toasts"
import axios from "axios"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState("")
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [lastCheckedLikes, setLastCheckedLikes] = useState(0)
  const [userData, setUserData] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const intervalRef = useRef(null)
  const { toast } = useToast()

  const userId = localStorage.getItem("userId")

  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token || !userId) {
        setIsLoadingUser(false)
        return
      }

      const response = await axios.get(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUserData(response.data)
      setIsLoadingUser(false)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setIsLoadingUser(false)
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token inválido, redirigir al login
        localStorage.removeItem("authToken")
        localStorage.removeItem("userId")
        window.location.href = "/login"
      }
    }
  }

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    // Detectar la ruta actual
    const path = window.location.pathname
    setActiveRoute(path)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  // Función para obtener el conteo actual de likes recibidos
  const getCurrentLikesCount = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token || !userId) return 0

      const response = await axios.get(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Actualizar también los datos del usuario si es necesario
      if (response.data) {
        setUserData(response.data)
      }

      return response.data.likesReceived?.length || 0
    } catch (error) {
      console.error("Error fetching user data:", error)
      return 0
    }
  }

  // Función para chequear nuevos likes
  const checkForNewLikes = async () => {
    try {
      const currentLikesCount = await getCurrentLikesCount()

      if (lastCheckedLikes === 0) {
        // Primera vez que se ejecuta, solo establecer el conteo inicial
        setLastCheckedLikes(currentLikesCount)
        return
      }

      if (currentLikesCount > lastCheckedLikes) {
        const newLikesCount = currentLikesCount - lastCheckedLikes

        // Crear notificaciones para los nuevos likes
        const newNotifications = Array.from({ length: newLikesCount }, (_, index) => ({
          id: Date.now() + index,
          type: "like",
          message: "¡Alguien te ha dado like!",
          timestamp: new Date().toISOString(),
          read: false,
        }))

        setNotifications((prev) => [...newNotifications, ...prev])
        setUnreadNotifications((prev) => prev + newLikesCount)
        setLastCheckedLikes(currentLikesCount)

        // Mostrar toast para el primer like nuevo
        toast({
          title: "¡Nuevo like!",
          description:
            newLikesCount === 1 ? "¡Alguien te ha dado like!" : `¡Has recibido ${newLikesCount} likes nuevos!`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error checking for new likes:", error)
    }
  }

  // Inicializar el conteo de likes y empezar el polling
  useEffect(() => {
    if (!userId) return

    // Obtener conteo inicial
    getCurrentLikesCount().then((count) => {
      setLastCheckedLikes(count)
    })

    // Configurar polling cada 10 segundos
    intervalRef.current = setInterval(checkForNewLikes, 10000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [userId, lastCheckedLikes])

  // Función para manejar cuando se abren las notificaciones
  const handleNotificationsOpen = (open) => {
    setIsNotificationsOpen(open)

    if (open && unreadNotifications > 0) {
      // Marcar todas las notificaciones como leídas después de un pequeño delay
      setTimeout(() => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
        setUnreadNotifications(0)
      }, 500)
    }
  }

  // Función para limpiar notificaciones leídas
  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((notif) => !notif.read))
  }

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    window.location.href = path
    setMobileMenuOpen(false)
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar el intervalo al cerrar sesión
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    window.location.href = "/"
  }

  // Función para obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!userData) return "US"
    const firstName = userData.name || ""
    const lastName = userData.surname || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Función para obtener la foto de perfil
  const getUserPhoto = () => {
    if (!userData || !userData.photos || userData.photos.length === 0) {
      return null
    }
    return userData.photos[0]
  }

  // Función para formatear el nombre completo
  const getFullName = () => {
    if (!userData) return "Cargando..."
    return `${userData.name || ""} ${userData.surname || ""}`.trim() || "Usuario"
  }

  // Rutas de navegación
  const navRoutes = [
    { name: "Descubrir", path: "/descubrir", icon: <Search className="h-5 w-5" /> },
    { name: "Matches", path: "/matches", icon: <Users className="h-5 w-5" /> },
    {
      name: "Mensajes",
      path: "/mensajes",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-md flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-white">HeartSync</span>
          </a>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navRoutes.map((route) => (
              <Button
                key={route.path}
                variant={activeRoute === route.path ? "default" : "ghost"}
                className={`relative ${
                  activeRoute === route.path
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => handleNavigation(route.path)}
              >
                {route.icon}
                <span className="ml-2">{route.name}</span>
                {route.badge && (
                  <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                    {route.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Notificaciones */}
            <DropdownMenu onOpenChange={handleNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full animate-pulse">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 bg-gray-900 border-gray-800 text-white max-h-96 overflow-y-auto"
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm">Notificaciones</h3>
                    {notifications.some((n) => n.read) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-400 hover:text-white h-auto p-1"
                        onClick={clearReadNotifications}
                      >
                        Limpiar leídas
                      </Button>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-md transition-all duration-300 ${
                            notification.read ? "bg-gray-800/30 opacity-60" : "bg-rose-500/10 border border-rose-500/20"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded-full ${notification.read ? "bg-gray-600" : "bg-rose-500"}`}>
                              <Heart className="h-3 w-3 text-white" fill="white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  notification.read ? "text-gray-400" : "text-rose-400"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No hay notificaciones</p>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Perfil de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 overflow-hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getUserPhoto() || "/placeholder.svg"} alt="Tu perfil" />
                    <AvatarFallback className="bg-rose-600 text-white text-sm font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-gray-900 border-gray-800 text-white">
                <div className="flex items-center justify-start p-3 border-b border-gray-800">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={getUserPhoto() || "/placeholder.svg"} alt="Tu perfil" />
                    <AvatarFallback className="bg-rose-600 text-white text-lg font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-base">{getFullName()}</p>
                    <p className="text-sm text-gray-400">{userData?.email || "Cargando..."}</p>
                    {userData?.age && userData?.country && (
                      <p className="text-xs text-gray-500">
                        {userData.age} años • {userData.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 px-3 py-2"
                    onClick={() => handleNavigation("/perfil")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Ver mi perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 px-3 py-2"
                    onClick={() => handleNavigation("/editar-perfil")}
                  >
                    <span>Editar perfil</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gray-800" />
                <div className="py-1">
                  <DropdownMenuItem
                    className="cursor-pointer text-rose-400 hover:bg-gray-800 focus:bg-gray-800 px-3 py-2"
                    onClick={handleLogout}
                  >
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Botón menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {/* Perfil de usuario móvil */}
            <div className="pb-3 border-b border-gray-800">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getUserPhoto() || "/placeholder.svg"} alt="Tu perfil" />
                  <AvatarFallback className="bg-rose-600 text-white font-medium">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium text-white">{getFullName()}</p>
                  <p className="text-sm text-gray-400">{userData?.email || "Cargando..."}</p>
                </div>
              </div>
            </div>

            {/* Notificaciones móvil */}
            <div className="pb-2 border-b border-gray-800">
              <Button
                variant="ghost"
                className="justify-start w-full text-gray-300 hover:text-white hover:bg-gray-800 relative"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5 mr-2" />
                <span>Notificaciones</span>
                {unreadNotifications > 0 && (
                  <Badge className="ml-2 bg-rose-500 text-white animate-pulse">{unreadNotifications}</Badge>
                )}
              </Button>

              {isNotificationsOpen && (
                <div className="mt-2 ml-4 space-y-2 max-h-48 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-2 rounded-md text-sm ${
                          notification.read
                            ? "bg-gray-800/30 text-gray-400"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {notification.message}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 p-2">No hay notificaciones</p>
                  )}
                </div>
              )}
            </div>

            {navRoutes.map((route) => (
              <Button
                key={route.path}
                variant={activeRoute === route.path ? "default" : "ghost"}
                className={`justify-start w-full ${
                  activeRoute === route.path
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => handleNavigation(route.path)}
              >
                {route.icon}
                <span className="ml-2">{route.name}</span>
                {route.badge && <Badge className="ml-2 bg-rose-500 text-white">{route.badge}</Badge>}
              </Button>
            ))}

            <div className="pt-2 border-t border-gray-800">
              <Button
                variant="ghost"
                className="justify-start w-full text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => handleNavigation("/perfil")}
              >
                <User className="h-5 w-5 mr-2" />
                <span>Ver mi perfil</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start w-full text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => handleNavigation("/editar-perfil")}
              >
                <span>Editar perfil</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start w-full text-rose-400 hover:text-rose-300 hover:bg-gray-800"
                onClick={handleLogout}
              >
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de navegación móvil fija en la parte inferior */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-2 px-4 z-50">
        <div className="flex justify-around">
          {navRoutes.map((route) => (
            <Button
              key={route.path}
              variant="ghost"
              size="icon"
              className={`relative ${activeRoute === route.path ? "text-rose-500" : "text-gray-400 hover:text-white"}`}
              onClick={() => handleNavigation(route.path)}
            >
              {route.icon}
              {route.badge && (
                <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                  {route.badge}
                </Badge>
              )}
            </Button>
          ))}

          {/* Botón de notificaciones en barra inferior */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-400 hover:text-white"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full animate-pulse">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
