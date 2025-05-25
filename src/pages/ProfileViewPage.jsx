"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {
  Heart,
  X,
  Star,
  MessageSquare,
  Share,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Sparkles,
  ThumbsUp,
  Coffee,
  Music,
  Book,
  Film,
  Plane,
  Info,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toasts"
import Navbar from "@/components/navbar"

// Datos simulados - En producción vendrían de Neo4J
const PROFILE_DATA = {
  id: 1,
  name: "Elena",
  age: 42,
  location: "Madrid, España",
  distance: "5 km",
  lastActive: "Hace 2 horas",
  bio: "Profesora de yoga y amante de los viajes. Me encanta la naturaleza, los animales y descubrir nuevas culturas. Busco a alguien con quien compartir nuevas experiencias y crear recuerdos inolvidables.",
  occupation: "Profesora de yoga",
  education: "Licenciada en Educación Física",
  compatibility: 92,
  images: [
    "/placeholder.svg?height=500&width=400&text=Elena",
    "/placeholder.svg?height=500&width=400&text=Elena+2",
    "/placeholder.svg?height=500&width=400&text=Elena+3",
  ],
  interests: ["yoga", "viajes", "gastronomía", "cine", "senderismo", "lectura", "música"],
  commonInterests: ["viajes", "cine"],
  commonAttributes: {
    country: "España",
    musicTaste: "Jazz, Clásica",
    activityLevel: "Activo",
  },
  matchStatus: "matched", // "matched", "liked", "none"
  matchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 días atrás
  conversationStarted: true,
}

export default function ProfileViewPage() {
  const router = useRouter();
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [unmatchDialogOpen, setUnmatchDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [superlikeAnimation, setSuperlikeAnimation] = useState(false)

  const handleNextImage = () => {
    if (PROFILE_DATA.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % PROFILE_DATA.images.length)
    }
  }

  const handlePrevImage = () => {
    if (PROFILE_DATA.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? PROFILE_DATA.images.length - 1 : prev - 1))
    }
  }

  const handleLike = () => {
    setLikeAnimation(true)

    toast({
      title: "¡Like enviado!",
      description: `Has dado like a ${PROFILE_DATA.name}`,
      variant: "success",
    })

    setTimeout(() => {
      setLikeAnimation(false)
    }, 1000)
  }

  const handleSuperlike = () => {
    setSuperlikeAnimation(true)

    toast({
      title: "¡Super Like!",
      description: `Has enviado un Super Like a ${PROFILE_DATA.name}`,
      variant: "success",
    })

    setTimeout(() => {
      setSuperlikeAnimation(false)
    }, 1000)
  }

  const handleStartChat = () => {
    router.push(`/messages/${PROFILE_DATA.id}`)
  }

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const handleReport = () => {
    setReportDialogOpen(true)
  }

  const handleUnmatch = () => {
    setUnmatchDialogOpen(true)
  }

  const confirmUnmatch = () => {
    toast({
      title: "Unmatch confirmado",
      description: `Ya no harás match con ${PROFILE_DATA.name}`,
    })

    setUnmatchDialogOpen(false)

    // Redirigir a la página de matches después de un breve retraso
    setTimeout(() => {
      router.push("/matches")
    }, 1500)
  }

  const handleBack = () => {
    router.back()
  }

  // Iconos para intereses
  const getInterestIcon = (interest) => {
    switch (interest.toLowerCase()) {
      case "viajes":
        return <Plane className="h-4 w-4" />
      case "música":
        return <Music className="h-4 w-4" />
      case "gastronomía":
        return <Coffee className="h-4 w-4" />
      case "lectura":
        return <Book className="h-4 w-4" />
      case "cine":
        return <Film className="h-4 w-4" />
      default:
        return <ThumbsUp className="h-4 w-4" />
    }
  }

  // Formatear fecha de match
  const formatMatchDate = () => {
    const now = new Date()
    const matchDate = new Date(PROFILE_DATA.matchDate)

    const diffTime = Math.abs(now - matchDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Hoy"
    } else if (diffDays === 1) {
      return "Ayer"
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`
    } else {
      const months = Math.floor(diffDays / 30)
      return `Hace ${months} ${months === 1 ? "mes" : "meses"}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" className="hover:bg-gray-800" onClick={handleBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <h1 className="text-2xl font-bold">Perfil</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border-gray-800 text-white">
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Compartir perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800" onClick={handleReport}>
                <Info className="h-4 w-4 mr-2" />
                Reportar perfil
              </DropdownMenuItem>
              {PROFILE_DATA.matchStatus === "matched" && (
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 hover:bg-gray-800 focus:bg-gray-800"
                  onClick={handleUnmatch}
                >
                  <X className="h-4 w-4 mr-2" />
                  Deshacer match
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Fotos y acciones */}
          <div className="lg:col-span-2">
            <Card className="border-gray-800 bg-gray-900/50 overflow-hidden shadow-xl">
              <div className="relative">
                {/* Indicadores de imagen */}
                {PROFILE_DATA.images.length > 1 && (
                  <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-1">
                    {PROFILE_DATA.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full ${index === currentImageIndex ? "bg-rose-500 w-6" : "bg-gray-500/50 w-4"}`}
                      />
                    ))}
                  </div>
                )}

                {/* Imagen principal */}
                <div className="relative h-[500px]">
                  <img
                    src={PROFILE_DATA.images[currentImageIndex] || "/placeholder.svg"}
                    alt={PROFILE_DATA.name}
                    className="h-full w-full object-cover"
                  />

                  {/* Overlay de compatibilidad */}
                  <div className="absolute top-4 right-4 bg-rose-600/90 text-white rounded-full px-3 py-1 text-sm font-semibold flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    {PROFILE_DATA.compatibility}% Match
                  </div>

                  {/* Navegación de imágenes */}
                  {PROFILE_DATA.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Overlay de información */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <h2 className="text-3xl font-bold">
                      {PROFILE_DATA.name}, {PROFILE_DATA.age}
                    </h2>
                    <div className="flex items-center mt-1 text-gray-300">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {PROFILE_DATA.location} • {PROFILE_DATA.distance}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-400 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Activa: {PROFILE_DATA.lastActive}</span>
                    </div>
                  </div>

                  {/* Animaciones de like/superlike */}
                  <AnimatePresence>
                    {likeAnimation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-green-500/30 backdrop-blur-sm rounded-full p-8">
                          <Heart className="h-24 w-24 text-green-500" fill="currentColor" />
                        </div>
                      </motion.div>
                    )}

                    {superlikeAnimation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-blue-500/30 backdrop-blur-sm rounded-full p-8">
                          <Star className="h-24 w-24 text-blue-500" fill="currentColor" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Estado del match */}
                {PROFILE_DATA.matchStatus === "matched" && (
                  <div className="mb-4 bg-rose-600/10 border border-rose-600/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-rose-600/20 p-2 rounded-full mr-3">
                        <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="font-medium">Match con {PROFILE_DATA.name}</h3>
                        <p className="text-sm text-gray-400">
                          {formatMatchDate()}
                          {PROFILE_DATA.conversationStarted ? " • Conversación iniciada" : " • Sin mensajes aún"}
                        </p>
                      </div>
                    </div>
                    <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleStartChat}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {PROFILE_DATA.conversationStarted ? "Continuar chat" : "Iniciar chat"}
                    </Button>
                  </div>
                )}

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Sobre {PROFILE_DATA.name}</h3>
                  <p className="text-gray-300">{PROFILE_DATA.bio}</p>
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Información básica</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-400">Ubicación:</span>
                        <span className="ml-1">{PROFILE_DATA.location}</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-400">Edad:</span>
                        <span className="ml-1">{PROFILE_DATA.age} años</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Sparkles className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-400">Ocupación:</span>
                        <span className="ml-1">{PROFILE_DATA.occupation}</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Book className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-400">Educación:</span>
                        <span className="ml-1">{PROFILE_DATA.education}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Coincidencias</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs text-gray-400 mb-1">Intereses en común:</h5>
                        <div className="flex flex-wrap gap-1">
                          {PROFILE_DATA.commonInterests.map((interest) => (
                            <Badge
                              key={interest}
                              className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 flex items-center gap-1"
                            >
                              {getInterestIcon(interest)}
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs text-gray-400 mb-1">Otras coincidencias:</h5>
                        <ul className="space-y-1">
                          {Object.entries(PROFILE_DATA.commonAttributes).map(([key, value]) => (
                            <li key={key} className="flex items-center text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-2"></div>
                              <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                              <span className="ml-1">{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intereses */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Intereses</h3>
                  <div className="flex flex-wrap gap-2">
                    {PROFILE_DATA.interests.map((interest) => (
                      <Badge
                        key={interest}
                        className={`${
                          PROFILE_DATA.commonInterests.includes(interest)
                            ? "bg-rose-600/20 text-rose-400 hover:bg-rose-600/30"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        } flex items-center gap-1`}
                      >
                        {getInterestIcon(interest)}
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            {PROFILE_DATA.matchStatus !== "matched" && (
              <div className="flex justify-center mt-6 gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSuperlike}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
                >
                  <Star className="h-8 w-8" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg"
                >
                  <Heart className="h-8 w-8" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Columna derecha - Pestañas de información adicional */}
          <div className="lg:col-span-1">
            <Card className="border-gray-800 bg-gray-900/50 shadow-xl">
              <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid grid-cols-2 bg-gray-800/50">
                  <TabsTrigger value="photos" className="data-[state=active]:bg-rose-600">
                    Fotos
                  </TabsTrigger>
                  <TabsTrigger value="compatibility" className="data-[state=active]:bg-rose-600">
                    Compatibilidad
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="photos" className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {PROFILE_DATA.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-md overflow-hidden cursor-pointer"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Foto ${index + 1} de ${PROFILE_DATA.name}`}
                          className={`w-full h-full object-cover transition-opacity ${
                            currentImageIndex === index
                              ? "opacity-100 ring-2 ring-rose-500"
                              : "opacity-80 hover:opacity-100"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="compatibility" className="p-4">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 mb-3">
                        <div className="bg-gray-900 rounded-full p-3">
                          <Sparkles className="h-8 w-8 text-rose-500" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{PROFILE_DATA.compatibility}%</h3>
                      <p className="text-gray-400">Compatibilidad</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-rose-500" />
                          Intereses compartidos
                        </h4>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex flex-wrap gap-1">
                            {PROFILE_DATA.commonInterests.map((interest) => (
                              <Badge
                                key={interest}
                                className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 flex items-center gap-1"
                              >
                                {getInterestIcon(interest)}
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-rose-500" />
                          Atributos compatibles
                        </h4>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <ul className="space-y-2">
                            {Object.entries(PROFILE_DATA.commonAttributes).map(([key, value]) => (
                              <li key={key} className="flex items-center text-sm">
                                <div className="h-2 w-2 rounded-full bg-rose-500 mr-2"></div>
                                <span className="text-gray-400 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <span className="ml-1">{value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-rose-600/10 border border-rose-600/20 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">¿Por qué hacen match?</h4>
                        <p className="text-sm text-gray-300">
                          Tú y {PROFILE_DATA.name} comparten intereses en {PROFILE_DATA.commonInterests.join(" y ")},
                          además de tener gustos similares en música y un nivel de actividad compatible.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {PROFILE_DATA.matchStatus === "matched" && (
              <Button
                variant="outline"
                className="w-full mt-4 border-gray-700 hover:bg-gray-800 text-red-400 hover:text-red-300"
                onClick={handleUnmatch}
              >
                <X className="h-4 w-4 mr-2" />
                Deshacer match
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de reporte */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Reportar perfil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-gray-300">Selecciona el motivo por el que quieres reportar a {PROFILE_DATA.name}:</p>

            <div className="space-y-2">
              {["Fotos inapropiadas", "Perfil falso", "Comportamiento ofensivo", "Spam", "Menor de edad", "Otro"].map(
                (reason) => (
                  <Button
                    key={reason}
                    variant="outline"
                    className="w-full justify-start border-gray-700 hover:bg-gray-800 text-left"
                    onClick={() => {
                      toast({
                        title: "Perfil reportado",
                        description: "Gracias por ayudarnos a mantener HeartSync seguro.",
                        variant: "success",
                      })
                      setReportDialogOpen(false)
                    }}
                  >
                    {reason}
                  </Button>
                ),
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de unmatch */}
      <Dialog open={unmatchDialogOpen} onOpenChange={setUnmatchDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Deshacer match</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-gray-300">¿Estás seguro de que quieres deshacer el match con {PROFILE_DATA.name}?</p>
            <p className="text-gray-400 text-sm">
              Esta acción no se puede deshacer. Se eliminará la conversación y ya no podrán contactarse.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
              onClick={() => setUnmatchDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={confirmUnmatch}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de compartir */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Compartir perfil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-gray-300">Comparte el perfil de {PROFILE_DATA.name} con tus amigos:</p>

            <div className="flex justify-center space-x-4">
              {[
                { name: "WhatsApp", color: "bg-green-600" },
                { name: "Facebook", color: "bg-blue-600" },
                { name: "Twitter", color: "bg-sky-500" },
                { name: "Email", color: "bg-gray-600" },
              ].map((platform) => (
                <Button
                  key={platform.name}
                  className={`${platform.color} hover:opacity-90`}
                  onClick={() => {
                    toast({
                      description: `Compartiendo perfil vía ${platform.name}`,
                    })
                    setShareDialogOpen(false)
                  }}
                >
                  {platform.name}
                </Button>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-400 mb-2">O copia el enlace:</p>
              <div className="flex">
                <Input
                  value={`https://heartsync.com/profile/${PROFILE_DATA.id}`}
                  readOnly
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
                <Button
                  className="ml-2 bg-rose-600 hover:bg-rose-700"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://heartsync.com/profile/${PROFILE_DATA.id}`)
                    toast({
                      description: "Enlace copiado al portapapeles",
                    })
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
