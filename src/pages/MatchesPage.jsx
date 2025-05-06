"use client"

import { useState } from "react"
import Header from "../components/layout/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Heart, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")

  const matches = [
    {
      id: "1",
      name: "Michele",
      age: 48,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: "Ahora mismo",
      status: "online",
      bio: "Fotógrafa profesional, amante de los viajes y el buen vino.",
      interests: ["Fotografía", "Viajes", "Vino"],
      location: "Madrid",
    },
    {
      id: "2",
      name: "Alexa",
      age: 38,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: "2 días atrás",
      status: "recent",
      bio: "Profesora de yoga y meditación. Me encanta la naturaleza y los animales.",
      interests: ["Yoga", "Meditación", "Naturaleza"],
      location: "Barcelona",
    },
    {
      id: "3",
      name: "Cynthia",
      age: 45,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: "4 días atrás",
      status: "offline",
      bio: "Ejecutiva de marketing, apasionada por el arte y la música clásica.",
      interests: ["Arte", "Música", "Cine"],
      location: "Valencia",
    },
    {
      id: "4",
      name: "Michelle",
      age: 50,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: "1 semana atrás",
      status: "offline",
      bio: "Chef profesional, me encanta cocinar y descubrir nuevos sabores.",
      interests: ["Gastronomía", "Vino", "Viajes"],
      location: "Sevilla",
    },
    {
      id: "5",
      name: "Samantha",
      age: 35,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: "1 mes atrás",
      status: "offline",
      bio: "Arquitecta y diseñadora de interiores. Amante del minimalismo.",
      interests: ["Diseño", "Arte", "Arquitectura"],
      location: "Bilbao",
    },
  ]

  const filteredMatches = () => {
    let filtered = matches

    // Filtrar por estado
    switch (activeTab) {
      case "cercanos":
        filtered = filtered.filter((match) => match.status === "online" || match.status === "recent")
        break
      case "en-linea":
        filtered = filtered.filter((match) => match.status === "online")
        break
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (match) =>
          match.name.toLowerCase().includes(query) ||
          match.bio.toLowerCase().includes(query) ||
          match.interests.some((interest) => interest.toLowerCase().includes(query)) ||
          match.location.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header isLoggedIn={true} />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Matches</h1>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <Tabs defaultValue="todos" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="todos" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
              Todos
            </TabsTrigger>
            <TabsTrigger value="cercanos" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
              Cercanos
            </TabsTrigger>
            <TabsTrigger value="en-linea" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
              En línea
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="mt-4">
            <MatchGrid matches={filteredMatches()} />
          </TabsContent>
          <TabsContent value="cercanos" className="mt-4">
            <MatchGrid matches={filteredMatches()} />
          </TabsContent>
          <TabsContent value="en-linea" className="mt-4">
            <MatchGrid matches={filteredMatches()} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function MatchGrid({ matches }) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No se encontraron matches</h3>
        <p className="text-gray-400">Intenta con otros filtros o sigue descubriendo perfiles</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match) => (
        <Card
          key={match.id}
          className="bg-gray-900/50 border-gray-800 hover:border-rose-500/50 transition-colors overflow-hidden"
        >
          <div className="relative">
            <img src={match.image || "/placeholder.svg"} alt={match.name} className="w-full h-48 object-cover" />
            {match.status === "online" && (
              <Badge variant="success" className="absolute top-2 right-2 bg-green-500">
                Online
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {match.name}, {match.age}
                </h3>
                <p className="text-sm text-gray-400">
                  {match.location} • {match.lastActive}
                </p>
              </div>
              <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
            </div>

            <p className="text-sm text-gray-300 mb-3 line-clamp-2">{match.bio}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {match.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-gray-800 text-gray-300">
                  {interest}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                Ver Perfil
              </Button>
              <Button variant="rose" size="sm" className="flex-1 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>Chatear</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
