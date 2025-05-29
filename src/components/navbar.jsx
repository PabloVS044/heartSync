"use client"

import { useState, useEffect } from "react"
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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState("")
  const [unreadMessages, setUnreadMessages] = useState(2) // Simulación de mensajes no leídos
  const [notifications, setNotifications] = useState(1) // Simulación de notificaciones

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

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    window.location.href = path
    setMobileMenuOpen(false)
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión
    window.location.href = "/"
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800 text-white">
                <div className="p-2">
                  <h3 className="font-medium text-sm mb-1">Notificaciones</h3>
                  {notifications > 0 ? (
                    <div className="py-1 px-2 text-sm bg-gray-800/50 rounded-md">
                      <p className="text-rose-400 font-medium">¡Nuevo match!</p>
                      <p className="text-gray-300 text-xs">Elena te ha dado like</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No hay notificaciones nuevas</p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Perfil de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 overflow-hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Tu perfil" />
                    <AvatarFallback>TU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800 text-white">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">Tu Nombre</p>
                    <p className="text-sm text-gray-400">tu@email.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                  onClick={() => handleNavigation("/perfil")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                  onClick={() => handleNavigation("/editar-perfil")}
                >
                  <span>Editar perfil</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer text-rose-400 hover:bg-gray-800 focus:bg-gray-800"
                  onClick={handleLogout}
                >
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
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
                onClick={() => handleNavigation("/settings")}
              >
                <span>Configuración</span>
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
        </div>
      </div>
    </header>
  )
}
