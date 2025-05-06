"use client"

import { useState } from "react"
import { X, Heart, MapPin, Info, Star, MessageSquare, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import Header from "../components/layout/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function DiscoverPage() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Perfiles de ejemplo
  const profiles = [
    {
      id: "1",
      name: "Laura",
      age: 42,
      distance: "5 km",
      bio: "Me encanta viajar, la fotografía y disfrutar de un buen vino. Busco a alguien con quien compartir nuevas experiencias.",
      image: "/images/profile-laura.png",
      interests: ["Viajes", "Fotografía", "Vino", "Arte", "Música"],
      location: "Madrid",
      occupation: "Diseñadora de Interiores",
      photos: [
        "/images/profile-laura.png",
        "/placeholder.svg?height=400&width=300&text=Foto 2",
        "/placeholder.svg?height=400&width=300&text=Foto 3",
      ],
    },
    {
      id: "2",
      name: "Sofía",
      age: 38,
      distance: "12 km",
      bio: "Profesora de yoga y amante de la naturaleza. Busco conexiones auténticas y significativas.",
      image: "/placeholder.svg?height=400&width=300&text=Sofía",
      interests: ["Yoga", "Meditación", "Naturaleza", "Lectura", "Cocina vegetariana"],
      location: "Barcelona",
      occupation: "Profesora de Yoga",
      photos: [
        "/placeholder.svg?height=400&width=300&text=Sofía",
        "/placeholder.svg?height=400&width=300&text=Foto 2",
        "/placeholder.svg?height=400&width=300&text=Foto 3",
      ],
    },
    {
      id: "3",
      name: "Elena",
      age: 45,
      distance: "8 km",
      bio: "Ejecutiva de marketing, apasionada por el arte y los viajes. Busco a alguien con quien compartir conversaciones interesantes.",
      image: "/placeholder.svg?height=400&width=300&text=Elena",
      interests: ["Arte", "Viajes", "Gastronomía", "Cine", "Música clásica"],
      location: "Valencia",
      occupation: "Directora de Marketing",
      photos: [
        "/placeholder.svg?height=400&width=300&text=Elena",
        "/placeholder.svg?height=400&width=300&text=Foto 2",
        "/placeholder.svg?height=400&width=300&text=Foto 3",
      ],
    },
  ]

  const currentProfile = profiles[currentProfileIndex]

  const handleLike = () => {
    console.log("Liked profile:", currentProfile)
    goToNextProfile()
  }

  const handleDislike = () => {
    console.log("Disliked profile:", currentProfile)
    goToNextProfile()
  }

  const handleSuperLike = () => {
    console.log("Super liked profile:", currentProfile)
    goToNextProfile()
  }

  const goToNextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length)
  }

  const goToPrevProfile = () => {
    setCurrentProfileIndex((prev) => (prev - 1 + profiles.length) % profiles.length)
  }

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const nextPhoto = (e) => {
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev + 1) % currentProfile.photos.length)
  }

  const prevPhoto = (e) => {
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev - 1 + currentProfile.photos.length) % currentProfile.photos.length)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header isLoggedIn={true} />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Descubrir</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Panel de filtros (oculto por defecto en móvil) */}
          {showFilters && (
            <div className="w-full md:w-64 bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h2 className="font-semibold mb-4">Filtros</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Rango de edad</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">25</span>
                    <span className="text-sm">55</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full mt-1 relative">
                    <div className="absolute h-full w-1/2 bg-rose-600 rounded-full"></div>
                    <div className="absolute h-4 w-4 bg-rose-600 rounded-full -top-1 left-1/4 border-2 border-white"></div>
                    <div className="absolute h-4 w-4 bg-rose-600 rounded-full -top-1 left-1/2 border-2 border-white"></div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Distancia máxima</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">5 km</span>
                    <span className="text-sm">50 km</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full mt-1 relative">
                    <div className="absolute h-full w-1/3 bg-rose-600 rounded-full"></div>
                    <div className="absolute h-4 w-4 bg-rose-600 rounded-full -top-1 left-1/3 border-2 border-white"></div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Intereses</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-rose-600">Viajes</Badge>
                    <Badge className="bg-gray-700">Arte</Badge>
                    <Badge className="bg-gray-700">Música</Badge>
                    <Badge className="bg-rose-600">Vino</Badge>
                    <Badge className="bg-gray-700">Yoga</Badge>
                  </div>
                </div>

                <Button variant="rose" size="sm" className="w-full mt-4">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          )}

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Tarjeta de perfil principal */}
              <Card className="lg:col-span-3 bg-gray-900/50 border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <div className="relative h-[500px]">
                  <img
                    src={currentProfile.photos[currentPhotoIndex] || "/placeholder.svg"}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Controles de navegación de fotos */}
                  {currentProfile.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Indicadores de fotos */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {currentProfile.photos.map((_, index) => (
                          <div
                            key={index}
                            className={`h-1 w-8 rounded-full ${index === currentPhotoIndex ? "bg-white" : "bg-white/50"}`}
                          ></div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-4 px-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-bold">
                          {currentProfile.name}, {currentProfile.age}
                        </h2>
                        <div className="flex items-center text-gray-300 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <p className="text-sm">{currentProfile.distance}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/80 hover:bg-gray-700/80">
                        <Info className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentProfile.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-gray-300 mb-6">{currentProfile.bio}</p>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={handleDislike}
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </Button>

                    <Button
                      onClick={handleSuperLike}
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full border-blue-700 bg-blue-900/50 hover:bg-blue-800/50"
                    >
                      <Star className="w-6 h-6 text-blue-400" />
                    </Button>

                    <Button onClick={handleLike} variant="rose" size="icon" className="w-14 h-14 rounded-full">
                      <Heart className="w-6 h-6 text-white" fill="white" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Panel lateral con perfiles sugeridos */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Perfiles Sugeridos</h3>

                    <div className="space-y-3">
                      {profiles
                        .filter((p) => p.id !== currentProfile.id)
                        .map((profile) => (
                          <div
                            key={profile.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={profile.image} alt={profile.name} />
                              <AvatarFallback>{profile.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">
                                  {profile.name}, {profile.age}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-400">{profile.distance}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Tus Matches Recientes</h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48&text=M" alt="María" />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">María, 39</h4>
                          </div>
                          <p className="text-sm text-gray-400">Match hace 2 días</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48&text=C" alt="Carmen" />
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">Carmen, 42</h4>
                          </div>
                          <p className="text-sm text-gray-400">Match hace 5 días</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Ver todos los matches
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
