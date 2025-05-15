"use client"

import { useState } from "react"
import { Heart, MessageSquare, MapPin, Sparkles, Search, Filter, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"

// Datos simulados - En producción vendrían de Neo4J
const MATCHES = [
  {
    id: 1,
    name: "Elena",
    age: 42,
    location: "Madrid, España",
    lastActive: "Hace 2 horas",
    image: "/placeholder.svg?height=100&width=100&text=Elena",
    compatibility: 92,
    interests: ["yoga", "viajes", "gastronomía", "cine", "senderismo"],
    commonInterests: ["viajes", "cine"],
    commonAttributes: {
      country: "España",
      musicTaste: "Jazz, Clásica",
      activityLevel: "Activo",
    },
    lastMessage: {
      text: "¿Te gustaría ir al cine este fin de semana?",
      timestamp: "12:45",
      unread: true,
    },
  },
  {
    id: 2,
    name: "Sofía",
    age: 45,
    location: "Barcelona, España",
    lastActive: "En línea",
    image: "/placeholder.svg?height=100&width=100&text=Sofia",
    compatibility: 88,
    interests: ["arte", "música", "cocina", "vino", "teatro"],
    commonInterests: ["música", "cocina"],
    commonAttributes: {
      country: "España",
      musicTaste: "Jazz, Rock",
      foodPreference: "Mediterránea",
    },
    lastMessage: {
      text: "Me encantó nuestra conversación de ayer.",
      timestamp: "Ayer",
      unread: false,
    },
  },
  {
    id: 3,
    name: "Carmen",
    age: 39,
    location: "Valencia, España",
    lastActive: "Hace 5 minutos",
    image: "/placeholder.svg?height=100&width=100&text=Carmen",
    compatibility: 95,
    interests: ["arquitectura", "viajes", "fotografía", "lectura", "natación"],
    commonInterests: ["viajes", "fotografía", "lectura"],
    commonAttributes: {
      country: "España",
      bookGenre: "Novela histórica",
      activityLevel: "Activo",
    },
    lastMessage: null,
  },
  {
    id: 4,
    name: "Laura",
    age: 41,
    location: "Sevilla, España",
    lastActive: "Hace 1 día",
    image: "/placeholder.svg?height=100&width=100&text=Laura",
    compatibility: 85,
    interests: ["baile", "cocina", "jardinería", "cine", "yoga"],
    commonInterests: ["cocina", "cine"],
    commonAttributes: {
      country: "España",
      movieGenre: "Comedia romántica",
      foodPreference: "Vegetariana",
    },
    lastMessage: {
      text: "¿Has probado el nuevo restaurante vegetariano?",
      timestamp: "Lun",
      unread: false,
    },
  },
  {
    id: 5,
    name: "Isabel",
    age: 47,
    location: "Málaga, España",
    lastActive: "Hace 3 horas",
    image: "/placeholder.svg?height=100&width=100&text=Isabel",
    compatibility: 90,
    interests: ["playa", "vino", "historia", "música", "meditación"],
    commonInterests: ["música", "historia"],
    commonAttributes: {
      country: "España",
      musicTaste: "Rock clásico",
      activityLevel: "Relajado",
    },
    lastMessage: {
      text: "¿Conoces algún buen concierto para este mes?",
      timestamp: "Dom",
      unread: true,
    },
  },
]

export default function MatchesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrar matches según la pestaña activa y el término de búsqueda
  const filteredMatches = MATCHES.filter((match) => {
    const matchesSearch =
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.location.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "messages") return matchesSearch && match.lastMessage
    if (activeTab === "new") return matchesSearch && !match.lastMessage

    return matchesSearch
  })

  const handleViewProfile = (matchId) => {
    // Navegación simple sin useRouter
    window.location.href = `/profile/${matchId}`
  }

  const handleStartChat = (matchId) => {
    // Navegación simple sin useRouter
    window.location.href = `/messages/${matchId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tus Matches</h1>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1">
              <Filter className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Pestañas */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-rose-600">
              Todos
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-rose-600">
              Con mensajes
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-rose-600">
              Nuevos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Lista de matches */}
        <div className="space-y-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <div key={match.id} className="transition-all duration-300 hover:scale-[1.01]">
                <Card className="border-gray-800 bg-gray-900/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Imagen y datos básicos */}
                      <div className="md:w-1/4 p-4 flex items-center">
                        <Avatar className="h-16 w-16 mr-4 border-2 border-rose-600">
                          <AvatarImage src={match.image || "/placeholder.svg"} alt={match.name} />
                          <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg flex items-center">
                            {match.name}, {match.age}
                            {match.lastActive === "En línea" && (
                              <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                            )}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            {match.location}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{match.lastActive}</div>
                        </div>
                      </div>

                      {/* Compatibilidad y coincidencias */}
                      <div className="md:w-2/4 p-4 border-t md:border-t-0 md:border-l md:border-r border-gray-800">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-4 w-4 text-rose-500 mr-2" />
                          <span className="text-sm font-medium">Compatibilidad: {match.compatibility}%</span>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-xs text-gray-400 mb-1">Intereses en común:</h4>
                          <div className="flex flex-wrap gap-1">
                            {match.commonInterests.map((interest) => (
                              <Badge
                                key={interest}
                                className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-xs"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs text-gray-400 mb-1">Otras coincidencias:</h4>
                          <div className="grid grid-cols-2 gap-1">
                            {Object.entries(match.commonAttributes)
                              .slice(0, 2)
                              .map(([key, value]) => (
                                <div key={key} className="flex items-center text-xs">
                                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5"></div>
                                  <span className="text-gray-300 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}: {value}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Último mensaje y acciones */}
                      <div className="md:w-1/4 p-4 bg-gray-800/30 flex flex-col justify-between">
                        {match.lastMessage ? (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-xs text-gray-400">Último mensaje:</h4>
                              <span className="text-xs text-gray-500">{match.lastMessage.timestamp}</span>
                            </div>
                            <p className="text-sm truncate">
                              {match.lastMessage.unread && (
                                <span className="inline-block h-2 w-2 rounded-full bg-rose-500 mr-2"></span>
                              )}
                              {match.lastMessage.text}
                            </p>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">Nuevo match</Badge>
                            <p className="text-xs text-gray-400 mt-1">¡Inicia una conversación!</p>
                          </div>
                        )}

                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-700 hover:bg-gray-800 w-full justify-between"
                            onClick={() => handleViewProfile(match.id)}
                          >
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Ver perfil
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            className="bg-rose-600 hover:bg-rose-700 w-full justify-between"
                            onClick={() => handleStartChat(match.id)}
                          >
                            <span className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {match.lastMessage ? "Continuar chat" : "Iniciar chat"}
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 rounded-full p-4 inline-flex mb-4">
                <Heart className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">No se encontraron matches</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm
                  ? "No hay matches que coincidan con tu búsqueda."
                  : "Sigue explorando para encontrar nuevos matches."}
              </p>
              <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => (window.location.href = "/discover")}>
                Descubrir personas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
