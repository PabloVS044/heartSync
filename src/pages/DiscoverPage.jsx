"use client"

import { useState, useEffect } from "react"
import { Heart, X, Info, ExternalLink, MapPin, Sparkles, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toasts"
import Navbar from "@/components/navbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Loader } from "@/components/loader"
import { LikeAnimation, DislikeAnimation, MatchAnimation } from "@/components/card-animations"

// Lista de intereses para mostrar nombres en lugar de IDs
const AVAILABLE_INTERESTS = [
  // Arte y Cultura
  { id: "arte", name: "Arte" },
  { id: "museos", name: "Museos" },
  { id: "historia", name: "Historia" },
  { id: "teatro", name: "Teatro" },
  { id: "cine", name: "Cine" },
  { id: "lectura", name: "Lectura" },
  { id: "poesía", name: "Poesía" },
  { id: "escritura", name: "Escritura" },
  { id: "filosofía", name: "Filosofía" },

  // Música y Escena
  { id: "música", name: "Música" },
  { id: "conciertos", name: "Conciertos" },
  { id: "tocar_instrumento", name: "Tocar instrumento" },
  { id: "dj", name: "DJ" },
  { id: "karaoke", name: "Karaoke" },
  { id: "canto", name: "Canto" },

  // Actividades físicas y aire libre
  { id: "deportes", name: "Deportes" },
  { id: "fútbol", name: "Fútbol" },
  { id: "baloncesto", name: "Baloncesto" },
  { id: "tenis", name: "Tenis" },
  { id: "ciclismo", name: "Ciclismo" },
  { id: "natación", name: "Natación" },
  { id: "running", name: "Running" },
  { id: "senderismo", name: "Senderismo" },
  { id: "acampada", name: "Acampada" },
  { id: "escalada", name: "Escalada" },
  { id: "surf", name: "Surf" },
  { id: "skate", name: "Skate" },
  { id: "snowboard", name: "Snowboard" },
  { id: "yoga", name: "Yoga" },
  { id: "pilates", name: "Pilates" },
  { id: "crossfit", name: "Crossfit" },
  { id: "gimnasio", name: "Gimnasio" },

  // Estilo de vida y bienestar
  { id: "meditación", name: "Meditación" },
  { id: "espiritualidad", name: "Espiritualidad" },
  { id: "alimentación_saludable", name: "Alimentación saludable" },
  { id: "vegetariano", name: "Vegetariano" },
  { id: "veganismo", name: "Veganismo" },
  { id: "mascotas", name: "Mascotas" },
  { id: "voluntariado", name: "Voluntariado" },

  // Tecnología y ciencia
  { id: "tecnología", name: "Tecnología" },
  { id: "videojuegos", name: "Videojuegos" },
  { id: "inteligencia_artificial", name: "Inteligencia Artificial" },
  { id: "robótica", name: "Robótica" },
  { id: "astronomía", name: "Astronomía" },
  { id: "programación", name: "Programación" },
  { id: "gadgets", name: "Gadgets" },

  // Entretenimiento y cultura pop
  { id: "anime", name: "Anime" },
  { id: "manga", name: "Manga" },
  { id: "series", name: "Series" },
  { id: "netflix", name: "Netflix" },
  { id: "marvel", name: "Marvel" },
  { id: "starwars", name: "Star Wars" },
  { id: "cosplay", name: "Cosplay" },

  // Hobbies y creativos
  { id: "fotografía", name: "Fotografía" },
  { id: "pintura", name: "Pintura" },
  { id: "manualidades", name: "Manualidades" },
  { id: "diseño_gráfico", name: "Diseño gráfico" },
  { id: "moda", name: "Moda" },
  { id: "dibujo", name: "Dibujo" },
  { id: "baile", name: "Baile" },
  { id: "costura", name: "Costura" },
  { id: "cocina", name: "Cocina" },
  { id: "repostería", name: "Repostería" },
  { id: "jardinería", name: "Jardinería" },
  { id: "coleccionismo", name: "Coleccionismo" },

  // Gastronomía y bebidas
  { id: "gastronomía", name: "Gastronomía" },
  { id: "vino", name: "Vino" },
  { id: "cerveza_artesanal", name: "Cerveza artesanal" },
  { id: "café", name: "Café" },
  { id: "cocteles", name: "Cócteles" },
  { id: "brunch", name: "Brunch" },

  // Viajes y cultura global
  { id: "viajar", name: "Viajar" },
  { id: "mochilero", name: "Mochilero" },
  { id: "idiomas", name: "Idiomas" },
  { id: "culturas", name: "Culturas del mundo" },
  { id: "playa", name: "Playa" },
  { id: "montaña", name: "Montaña" },
  { id: "roadtrips", name: "Roadtrips" },
  { id: "aventura", name: "Aventura" },

  // Juegos de mesa y lógica
  { id: "ajedrez", name: "Ajedrez" },
  { id: "juegos_de_mesa", name: "Juegos de mesa" },
  { id: "póker", name: "Póker" },
  { id: "escape_rooms", name: "Escape rooms" },
  { id: "trivia", name: "Trivia" },

  // Otros
  { id: "autos", name: "Autos" },
  { id: "modificación_vehículos", name: "Modificación de vehículos" },
  { id: "motocicletas", name: "Motocicletas" },
  { id: "invertir", name: "Invertir" },
  { id: "negocios", name: "Negocios" },
  { id: "memes", name: "Memes" },
  { id: "redes_sociales", name: "Redes sociales" },
];

export default function DiscoverPage() {
  const [matches, setMatches] = useState([])
  const [ads, setAds] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const [leftAd, setLeftAd] = useState(null)
  const [rightAd, setRightAd] = useState(null)
  const [adModalOpen, setAdModalOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [dislikeAnimation, setDislikeAnimation] = useState(false)
  const [matchAnimation, setMatchAnimation] = useState(false)
  const [matchData, setMatchData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [partyMode, setPartyMode] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")
  const currentMatch = matches[currentMatchIndex]

  const togglePartyMode = () => {
    setPartyMode(!partyMode)
  }

  const addRandomInterest = (interests) => {
    const randomInterest = AVAILABLE_INTERESTS[Math.floor(Math.random() * AVAILABLE_INTERESTS.length)]
    return [...interests, randomInterest.name]
  }

  // Fetch matches and personalized ads on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token || !userId) {
          toast({
            title: "Sesión expirada",
            description: "Por favor, inicia sesión nuevamente.",
            variant: "destructive",
          })
          navigate("/login")
          return
        }

        // Fetch matches
        const matchesResponse = await axios.get(`https://heartsync-backend-xoba.onrender.com/users/${userId}/matches`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { skip: 0, limit: 10 },
        })
        const transformedMatches = matchesResponse.data.map((match) => ({
          id: match.id,
          name: `${match.name} ${match.surname || ""}`.trim(),
          age: match.age,
          location: match.country,
          bio: match.bio || "Sin biografía",
          distance: "Desconocido",
          compatibility: Math.round(match.matchPercentage * 100) / 100,
          images: match.photos.length > 0 ? match.photos : ["/placeholder.svg?height=500&width=400"],
          interests: addRandomInterest(match.interests.map((id) => AVAILABLE_INTERESTS.find((i) => i.id === id)?.name || id)),
          commonInterests: match.interests.map((id) => AVAILABLE_INTERESTS.find((i) => i.id === id)?.name || id),
          commonAttributes: {
            country: match.country,
            activityLevel:
              match.interests.includes("senderismo") || match.interests.includes("deportes") ? "Activo" : "Moderado",
          },
          matchType: match.matchType,
        }))
        setMatches(transformedMatches)

        // Fetch personalized ads for the user
        const adsResponse = await axios.get(`https://heartsync-backend-xoba.onrender.com/ads/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { skip: 0, limit: 2 },
        })
        const fetchedAds = adsResponse.data.map((ad) => ({
          id: ad.id,
          title: ad.title,
          image: ad.image || "/placeholder.svg?height=600&width=256&text=Anuncio",
          description: ad.description,
          targetedReason: `Basado en tu interés por ${ad.relatedInterests?.join(", ") || "temas relacionados"}.`,
          url: ad.url || "https://example.com",
          relatedInterests: ad.relatedInterests || [],
        }))

        setLeftAd(fetchedAds[0] || null)
        setRightAd(fetchedAds[1] || null)
        setAds(fetchedAds)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Inténtalo de nuevo.",
          variant: "destructive",
        })
        setIsLoading(false)
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login")
        }
      }
    }
    fetchData()
  }, [navigate, toast, userId])

  const nextMatch = () => {
    setCurrentImageIndex(0)
    setDirection(null)
    if (currentMatchIndex + 1 < matches.length) {
      setCurrentMatchIndex((prev) => prev + 1)
    } else {
      setCurrentMatchIndex(-1)
    }
  }

  const handleNextImage = () => {
    if (currentMatch?.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % currentMatch.images.length)
    }
  }

  const handlePrevImage = () => {
    if (currentMatch?.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? currentMatch.images.length - 1 : prev - 1))
    }
  }

  const handleLike = async () => {
    if (!currentMatch) return
    setLikeAnimation(true)
    setDirection("right")
    if (partyMode) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      })
    }
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.post(
        `https://heartsync-backend-xoba.onrender.com/users/${userId}/like/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.isMatched) {
        setMatchData({
          user1Name: "Tú",
          user2Name: currentMatch.name,
        })
        setTimeout(() => {
          setLikeAnimation(false)
          setMatchAnimation(true)
        }, 500)
      } else {
        toast({
          title: "¡Like enviado!",
          description: `Has dado like a ${currentMatch.name}`,
          variant: "default",
        })
        setTimeout(() => {
          setLikeAnimation(false)
          nextMatch()
        }, 500)
      }
    } catch (error) {
      console.error("Error liking user:", error.response?.data || error.message)
      toast({
        title: "Error",
        description: "No se pudo enviar el like. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setLikeAnimation(false)
      setDirection(null)
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login")
      }
    }
  }

  const handleSuperLike = async () => {
    if (!currentMatch) return
    setLikeAnimation(true)
    setDirection("up")
    try {
      const token = localStorage.getItem("authToken")
      await axios.post(
        `https://heartsync-backend-xoba.onrender.com/users/${userId}/superlike/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast({
        title: "¡Super Like enviado! 🌟",
        description: `Has enviado un Super Like a ${currentMatch.name}`,
        variant: "default",
      })
      setTimeout(() => {
        setLikeAnimation(false)
        nextMatch()
      }, 500)
    } catch (error) {
      console.error("Error superliking user:", error.response?.data || error.message)
      toast({
        title: "Error",
        description: "No se pudo enviar el Super Like. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setLikeAnimation(false)
      setDirection(null)
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login")
      }
    }
  }

  const handleDislike = async () => {
    if (!currentMatch) return
    setDislikeAnimation(true)
    setDirection("left")
    try {
      const token = localStorage.getItem("authToken")
      await axios.post(
        `https://heartsync-backend-xoba.onrender.com/users/${userId}/dislike/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      toast({
        description: `Has pasado de ${currentMatch.name}`,
      })
      setTimeout(() => {
        setDislikeAnimation(false)
        nextMatch()
      }, 500)
    } catch (error) {
      console.error("Error disliking user:", error.response?.data || error.message)
      toast({
        title: "Error",
        description: "No se pudo pasar del usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setDislikeAnimation(false)
      setDirection(null)
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login")
      }
    }
  }

  const handleMatchComplete = () => {
    setMatchAnimation(false)
    setMatchData(null)
    nextMatch()
  }

  const openAdModal = (ad) => {
    setSelectedAd(ad)
    setAdModalOpen(true)
  }

  const renderAd = (ad, side) => {
    if (!ad) return null
    return (
      <div className={`hidden md:flex items-center w-64 flex-shrink-0 ${side === "left" ? "mr-4" : "ml-4"}`}>
        <Card
          className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer w-full"
          onClick={() => openAdModal(ad)}
        >
          <CardContent className="p-3">
            <img
              src={ad.image || "/placeholder.svg?height=600&width=256&text=Anuncio"}
              alt={ad.title}
              className="w-full h-80 object-cover rounded-md mb-3"
            />
            <h4 className="text-base font-semibold truncate">{ad.title}</h4>
            <p className="text-sm text-gray-400">{ad.targetedReason}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <Button
        onClick={togglePartyMode}
        className="fixed top-20 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full z-50"
      >
        {partyMode ? "Desactivar Modo Fiesta 🎉" : "Activar Modo Fiesta 🎉"}
      </Button>
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-6">
        {renderAd(leftAd, "left")}
        <div className="flex-1 max-w-2xl mx-auto">
          {isLoading ? (
            <Loader />
          ) : currentMatchIndex === -1 || !currentMatch ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">No hay más personas para descubrir</h2>
              <p className="text-gray-400 mb-6">Vuelve más tarde o ajusta tus preferencias.</p>
              <Button onClick={() => navigate("/perfil")}>Editar preferencias</Button>
            </div>
          ) : (
            <div className="relative">
              <Card
                className={`bg-gray-900/50 border-gray-800 transition-all duration-500 ${
                  direction === "left" ? "card-swipe-left" : direction === "right" ? "card-swipe-right" : direction === "up" ? "card-swipe-up" : ""
                } ${partyMode ? "animate-gradient-bg" : ""}`}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={currentMatch.images[currentImageIndex] || "/placeholder.svg"}
                      alt={currentMatch.name}
                      className="w-full h-[500px] object-cover"
                    />
                    {currentMatch.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h2 className="text-2xl font-bold">
                        {currentMatch.name}, {currentMatch.age}
                      </h2>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {currentMatch.location} • {currentMatch.distance}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-rose-500" />
                        Compatibilidad: {currentMatch.compatibility}%
                      </div>
                    </div>
                    <LikeAnimation visible={likeAnimation} />
                    <DislikeAnimation visible={dislikeAnimation} />
                  </div>
                  <div className="p-4">
                    <p className="text-sm mb-4">{currentMatch.bio}</p>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2">Compatibilidad</h3>
                      <canvas id="compatibility-chart" width="100" height="100"></canvas>
                      ```chartjs
                      {
                        "type": "doughnut",
                        "data": {
                          "labels": ["Compatibilidad", "Resto"],
                          "datasets": [{
                            "data": [${currentMatch?.compatibility || 0}, ${100 - (currentMatch?.compatibility || 0)}],
                            "backgroundColor": ["#f43f5e", "#4b5563"],
                            "borderColor": ["#1f2937", "#1f2937"],
                            "borderWidth": 1
                          }]
                        },
                        "options": {
                          "cutout": "70%",
                          "plugins": {
                            "legend": { "display": false },
                            "tooltip": { "enabled": false },
                            "title": {
                              "display": true,
                              "text": "${currentMatch?.compatibility || 0}%",
                              "position": "center",
                              "color": "#ffffff",
                              "font": { "size": 20 }
                            }
                          }
                        }
                      }
                      ```
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2">Intereses</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.commonInterests.map((interest) => (
                          <Badge key={interest} className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2">Otras coincidencias</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(currentMatch.commonAttributes).map(([key, value]) => (
                          <div key={key} className="flex items-center text-sm">
                            <div className="h-2 w-2 rounded-full bg-rose-500 mr-2"></div>
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}: {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center gap-6">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-16 h-16 rounded-full border-2 border-red-500 hover:bg-red-500/10 transition-all duration-200 ${
                          dislikeAnimation ? "scale-110 bg-red-500/20" : ""
                        }`}
                        onClick={handleDislike}
                        disabled={dislikeAnimation || likeAnimation}
                      >
                        <X className={`h-8 w-8 text-red-500 ${dislikeAnimation ? "animate-pulse" : ""}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-16 h-16 rounded-full border-2 border-yellow-500 hover:bg-yellow-500/10 transition-all duration-200 ${
                          likeAnimation && direction === "up" ? "scale-110 bg-yellow-500/20" : ""
                        }`}
                        onClick={handleSuperLike}
                        disabled={likeAnimation || dislikeAnimation}
                      >
                        <Star className={`h-8 w-8 text-yellow-500 ${likeAnimation && direction === "up" ? "animate-pulse" : ""}`} fill="currentColor" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-16 h-16 rounded-full border-2 border-green-500 hover:bg-green-500/10 transition-all duration-200 ${
                          likeAnimation && direction === "right" ? "scale-110 bg-green-500/20" : ""
                        }`}
                        onClick={handleLike}
                        disabled={likeAnimation || dislikeAnimation}
                      >
                        <Heart className={`h-8 w-8 text-green-500 ${likeAnimation && direction === "right" ? "animate-pulse" : ""}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-16 h-16 rounded-full border-2 border-blue-500 hover:bg-blue-500/10"
                        onClick={() => navigate(`/perfil/${currentMatch.id}`)}
                      >
                        <Info className="h-6 w-6 text-blue-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        {renderAd(rightAd, "right")}
      </div>
      <MatchAnimation
        visible={matchAnimation}
        user1Name={matchData?.user1Name}
        user2Name={matchData?.user2Name}
        onComplete={handleMatchComplete}
      />
      <Dialog open={adModalOpen} onOpenChange={setAdModalOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>{selectedAd?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">{selectedAd?.targetedReason}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={selectedAd?.image || "/placeholder.svg"}
              alt={selectedAd?.title}
              className="w-full h-64 object-cover rounded-md"
            />
            <p>{selectedAd?.description}</p>
            <div className="flex gap-2">
              {selectedAd?.relatedInterests.map((interest) => (
                <Badge key={interest} className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30">
                  {interest}
                </Badge>
              ))}
            </div>
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <a
                href={selectedAd?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                Visitar <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <style jsx global>{`
        @keyframes gradient-bg {
          0% { background: linear-gradient(45deg, #ff6b6b, #4ecdc4); }
          50% { background: linear-gradient(45deg, #4ecdc4, #ff6b6b); }
          100% { background: linear-gradient(45deg, #ff6b6b, #4ecdc4); }
        }
        .animate-gradient-bg {
          animation: gradient-bg 5s ease infinite;
        }
        .card-swipe-up {
          transform: translateY(-100%) rotate(5deg);
          opacity: 0;
        }
      `}</style>
    </div>
  )
}