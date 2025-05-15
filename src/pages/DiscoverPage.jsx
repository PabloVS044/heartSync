"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  X,
  Star,
  Info,
  ExternalLink,
  ThumbsUp,
  Coffee,
  Music,
  Book,
  Film,
  Plane,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toasts"
import Navbar from "@/components/navbar"

// Datos simulados - En producción vendrían de Neo4J
const MATCHES = [
  {
    id: 1,
    name: "Elena",
    age: 42,
    location: "Madrid, España",
    bio: "Profesora de yoga y amante de los viajes. Busco a alguien con quien compartir nuevas experiencias.",
    distance: "5 km",
    compatibility: 92,
    images: [
      "/placeholder.svg?height=500&width=400&text=Elena",
      "/placeholder.svg?height=500&width=400&text=Elena+2",
      "/placeholder.svg?height=500&width=400&text=Elena+3",
    ],
    interests: ["yoga", "viajes", "gastronomía", "cine", "senderismo"],
    commonInterests: ["viajes", "cine"],
    commonAttributes: {
      country: "España",
      musicTaste: "Jazz, Clásica",
      activityLevel: "Activo",
    },
  },
  {
    id: 2,
    name: "Sofía",
    age: 45,
    location: "Barcelona, España",
    bio: "Ejecutiva de marketing, apasionada por el arte y la música. Me encanta cocinar y descubrir nuevos restaurantes.",
    distance: "12 km",
    compatibility: 88,
    images: ["/placeholder.svg?height=500&width=400&text=Sofia", "/placeholder.svg?height=500&width=400&text=Sofia+2"],
    interests: ["arte", "música", "cocina", "vino", "teatro"],
    commonInterests: ["música", "cocina"],
    commonAttributes: {
      country: "España",
      musicTaste: "Jazz, Rock",
      foodPreference: "Mediterránea",
    },
  },
  {
    id: 3,
    name: "Carmen",
    age: 39,
    location: "Valencia, España",
    bio: "Arquitecta y viajera incansable. Busco a alguien con quien compartir conversaciones interesantes y aventuras.",
    distance: "8 km",
    compatibility: 95,
    images: [
      "/placeholder.svg?height=500&width=400&text=Carmen",
      "/placeholder.svg?height=500&width=400&text=Carmen+2",
      "/placeholder.svg?height=500&width=400&text=Carmen+3",
    ],
    interests: ["arquitectura", "viajes", "fotografía", "lectura", "natación"],
    commonInterests: ["viajes", "fotografía", "lectura"],
    commonAttributes: {
      country: "España",
      bookGenre: "Novela histórica",
      activityLevel: "Activo",
    },
  },
]

// Datos simulados de publicidad - En producción vendrían de una API
const ADS = [
  {
    id: 1,
    title: "Escapada romántica a Santorini",
    image: "/placeholder.svg?height=600&width=160&text=Viajes",
    description: "Descubre el paraíso griego con ofertas exclusivas para parejas.",
    targetedReason: "Basado en tu interés por los viajes y experiencias románticas.",
    url: "https://example.com/santorini",
    relatedInterests: ["viajes", "romance"],
  },
  {
    id: 2,
    title: "Festival de Jazz en el Parque",
    image: "/placeholder.svg?height=600&width=160&text=Música",
    description: "No te pierdas el evento musical del año con los mejores artistas.",
    targetedReason: "Personalizado según tu gusto por el jazz y eventos culturales.",
    url: "https://example.com/jazzfestival",
    relatedInterests: ["música", "jazz", "eventos"],
  },
  {
    id: 3,
    title: "Clases de cocina mediterránea",
    image: "/placeholder.svg?height=600&width=160&text=Cocina",
    description: "Aprende a preparar platos exquisitos con los mejores chefs.",
    targetedReason: "Seleccionado por tu interés en la gastronomía y cocina mediterránea.",
    url: "https://example.com/cookingclass",
    relatedInterests: ["cocina", "gastronomía"],
  },
  {
    id: 4,
    title: "Club de lectura virtual",
    image: "/placeholder.svg?height=600&width=160&text=Lectura",
    description: "Únete a nuestra comunidad de amantes de los libros.",
    targetedReason: "Recomendado por tu afición a la lectura y novelas históricas.",
    url: "https://example.com/bookclub",
    relatedInterests: ["lectura", "libros"],
  },
]

export default function DiscoverPage() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const [leftAds, setLeftAds] = useState([])
  const [rightAds, setRightAds] = useState([])
  const [adModalOpen, setAdModalOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [dislikeAnimation, setDislikeAnimation] = useState(false)
  const [superlikeAnimation, setSuperlikeAnimation] = useState(false)

  const { toast } = useToast()

  const currentMatch = MATCHES[currentMatchIndex]

  // Efecto para seleccionar anuncios relevantes basados en los intereses del match actual
  useEffect(() => {
    if (currentMatch) {
      // Filtrar anuncios relevantes basados en los intereses del usuario y el match
      const relevantAds = ADS.filter((ad) =>
        ad.relatedInterests.some(
          (interest) => currentMatch.interests.includes(interest) || currentMatch.commonInterests.includes(interest),
        ),
      )

      // Dividir los anuncios entre izquierda y derecha
      const shuffled = [...relevantAds].sort(() => 0.5 - Math.random())
      setLeftAds(shuffled.slice(0, 2))
      setRightAds(shuffled.slice(2, 4))
    }
  }, [currentMatch])

  const handleNextImage = () => {
    if (currentMatch.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % currentMatch.images.length)
    }
  }

  const handlePrevImage = () => {
    if (currentMatch.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? currentMatch.images.length - 1 : prev - 1))
    }
  }

  const handleLike = () => {
    setLikeAnimation(true)
    setDirection("right")

    // Mostrar toast
    toast({
      title: "¡Like enviado!",
      description: `Has dado like a ${currentMatch.name}`,
      variant: "success",
    })

    // Resetear animación después de un tiempo
    setTimeout(() => {
      setLikeAnimation(false)
      nextMatch()
    }, 1000)
  }

  const handleDislike = () => {
    setDislikeAnimation(true)
    setDirection("left")

    // Mostrar toast
    toast({
      description: `Has pasado de ${currentMatch.name}`,
    })

    // Resetear animación después de un tiempo
    setTimeout(() => {
      setDislikeAnimation(false)
      nextMatch()
    }, 1000)
  }

  const handleSuperlike = () => {
    setSuperlikeAnimation(true)

    // Mostrar toast
    toast({
      title: "¡Super Like!",
      description: `Has enviado un Super Like a ${currentMatch.name}`,
      variant: "success",
    })

    // Resetear animación después de un tiempo
    setTimeout(() => {
      setSuperlikeAnimation(false)
      nextMatch()
    }, 1000)
  }

  const nextMatch = () => {
    setCurrentImageIndex(0)
    setCurrentMatchIndex((prev) => (prev + 1) % MATCHES.length)
  }

  const handleAdClick = (ad) => {
    setSelectedAd(ad)
    setAdModalOpen(true)
  }

  // Iconos para intereses
  const getInterestIcon = (interest) => {
    switch (interest.toLowerCase()) {
      case "viajes":
        return <Plane className="h-4 w-4" />
      case "música":
        return <Music className="h-4 w-4" />
      case "cocina":
        return <Coffee className="h-4 w-4" />
      case "lectura":
        return <Book className="h-4 w-4" />
      case "cine":
        return <Film className="h-4 w-4" />
      default:
        return <ThumbsUp className="h-4 w-4" />
    }
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Descubre tus Matches</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Columna izquierda - Anuncios */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="space-y-4">
              {leftAds.map((ad) => (
                <div
                  key={ad.id}
                  className="cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                  onClick={() => handleAdClick(ad)}
                >
                  <Card className="overflow-hidden border-gray-800 bg-gray-900/50 h-[300px]">
                    <div className="relative h-full">
                      <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="h-full w-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                        <p className="text-sm font-medium">{ad.title}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-300">
                          <Info className="h-3 w-3 mr-1" />
                          <span>Anuncio</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Columna central - Match actual */}
          <div className="lg:col-span-8">
            <div
              className={`transition-all duration-500 ${
                direction === "left"
                  ? "translate-x-[-100%] opacity-0"
                  : direction === "right"
                    ? "translate-x-[100%] opacity-0"
                    : "translate-x-0 opacity-100"
              }`}
            >
              <Card className="overflow-hidden border-gray-800 bg-gray-900/50 shadow-xl">
                <div className="relative">
                  {/* Indicadores de imagen */}
                  {currentMatch.images.length > 1 && (
                    <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-1">
                      {currentMatch.images.map((_, index) => (
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
                      src={currentMatch.images[currentImageIndex] || "/placeholder.svg"}
                      alt={currentMatch.name}
                      className="h-full w-full object-cover"
                    />

                    {/* Overlay de compatibilidad */}
                    <div className="absolute top-4 right-4 bg-rose-600/90 text-white rounded-full px-3 py-1 text-sm font-semibold flex items-center">
                      <Sparkles className="h-4 w-4 mr-1" />
                      {currentMatch.compatibility}% Match
                    </div>

                    {/* Navegación de imágenes */}
                    {currentMatch.images.length > 1 && (
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
                      <h2 className="text-2xl font-bold">
                        {currentMatch.name}, {currentMatch.age}
                      </h2>
                      <div className="flex items-center mt-1 text-gray-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>
                          {currentMatch.location} • {currentMatch.distance}
                        </span>
                      </div>
                    </div>

                    {/* Animaciones de like/dislike */}
                    {likeAnimation && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-green-500/30 backdrop-blur-sm rounded-full p-8">
                          <Heart className="h-24 w-24 text-green-500" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {dislikeAnimation && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-500/30 backdrop-blur-sm rounded-full p-8">
                          <X className="h-24 w-24 text-red-500" />
                        </div>
                      </div>
                    )}

                    {superlikeAnimation && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-blue-500/30 backdrop-blur-sm rounded-full p-8">
                          <Star className="h-24 w-24 text-blue-500" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Bio */}
                  <p className="text-gray-300 mb-4">{currentMatch.bio}</p>

                  {/* Sección de coincidencias */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-rose-500" />
                      Coincidencias
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Intereses comunes */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Intereses en común</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentMatch.commonInterests.map((interest) => (
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

                      {/* Atributos comunes */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Otras coincidencias</h4>
                        <ul className="space-y-2 text-sm">
                          {Object.entries(currentMatch.commonAttributes).map(([key, value]) => (
                            <li key={key} className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-rose-500 mr-2"></div>
                              <span className="text-gray-400 capitalize">{key}:</span>
                              <span className="ml-1">{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Todos los intereses */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.interests.map((interest) => (
                        <Badge
                          key={interest}
                          className={`${
                            currentMatch.commonInterests.includes(interest)
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
              <div className="flex justify-center mt-6 gap-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-90"
                  onClick={handleDislike}
                >
                  <X className="h-8 w-8" />
                </button>

                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-90"
                  onClick={handleSuperlike}
                >
                  <Star className="h-8 w-8" />
                </button>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-90"
                  onClick={handleLike}
                >
                  <Heart className="h-8 w-8" />
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha - Anuncios */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="space-y-4">
              {rightAds.map((ad) => (
                <div
                  key={ad.id}
                  className="cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                  onClick={() => handleAdClick(ad)}
                >
                  <Card className="overflow-hidden border-gray-800 bg-gray-900/50 h-[300px]">
                    <div className="relative h-full">
                      <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="h-full w-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                        <p className="text-sm font-medium">{ad.title}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-300">
                          <Info className="h-3 w-3 mr-1" />
                          <span>Anuncio</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de publicidad */}
      <Dialog open={adModalOpen} onOpenChange={setAdModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedAd?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">Anuncio personalizado</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              <img
                src={selectedAd?.image || "/placeholder.svg"}
                alt={selectedAd?.title}
                className="w-full h-48 object-cover"
              />
            </div>

            <p className="text-gray-300">{selectedAd?.description}</p>

            <div className="bg-rose-900/20 border border-rose-900/50 rounded-lg p-4">
              <h4 className="font-medium text-rose-400 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                ¿Por qué veo este anuncio?
              </h4>
              <p className="text-sm text-gray-300">{selectedAd?.targetedReason}</p>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setAdModalOpen(false)}
                className="border-gray-700 hover:bg-gray-800"
              >
                Cerrar
              </Button>

              <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => window.open(selectedAd?.url, "_blank")}>
                Visitar sitio
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
