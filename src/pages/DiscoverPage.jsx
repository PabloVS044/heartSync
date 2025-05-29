"use client"

import { useState, useEffect } from "react"
import { Heart, X, Info, ExternalLink, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
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
  const { toast } = useToast()
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")
  const currentMatch = matches[currentMatchIndex]

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
        const matchesResponse = await axios.get(`http://localhost:3000/users/${userId}/matches`, {
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
          interests: match.interests.map((id) => AVAILABLE_INTERESTS.find((i) => i.id === id)?.name || id),
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
        const adsResponse = await axios.get(`http://localhost:3000/ads/user/${userId}`, {
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

  // Modificar la función nextMatch para que maneje correctamente el caso de no tener más usuarios
  const nextMatch = () => {
    setCurrentImageIndex(0)
    setDirection(null)
    if (currentMatchIndex + 1 < matches.length) {
      setCurrentMatchIndex((prev) => prev + 1)
    } else {
      // No hay más usuarios para mostrar
      setCurrentMatchIndex(-1) // Usamos -1 para indicar que no hay más usuarios
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

  // Modificar handleLike para que la tarjeta se deslice antes de cambiar al siguiente usuario
  const handleLike = async () => {
    if (!currentMatch) return
    setLikeAnimation(true)
    setDirection("right")
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/like/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.isMatched) {
        // Configurar datos del match para la animación
        setMatchData({
          user1Name: "Tú",
          user2Name: currentMatch.name,
        })

        // Esperar a que termine la animación de like antes de mostrar el match
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

        // Esperar a que termine la animación de swipe antes de mostrar el siguiente usuario
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

  // Modificar handleDislike para que la tarjeta se deslice antes de cambiar al siguiente usuario
  const handleDislike = async () => {
    if (!currentMatch) return
    setDislikeAnimation(true)
    setDirection("left")
    try {
      const token = localStorage.getItem("authToken")
      await axios.post(
        `http://localhost:3000/users/${userId}/dislike/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      toast({
        description: `Has pasado de ${currentMatch.name}`,
      })

      // Esperar a que termine la animación de swipe antes de mostrar el siguiente usuario
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

  // Render ads independently of matches
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
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-6">
        {/* Left Ad */}
        {renderAd(leftAd, "left")}

        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto">
          {/* Modificar la parte del renderizado para manejar correctamente el caso de currentMatchIndex = -1 */}
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
                  direction === "left" ? "card-swipe-left" : direction === "right" ? "card-swipe-right" : ""
                }`}
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

                    {/* Animaciones de interacción */}
                    <LikeAnimation visible={likeAnimation} />
                    <DislikeAnimation visible={dislikeAnimation} />
                  </div>

                  <div className="p-4">
                    <p className="text-sm mb-4">{currentMatch.bio}</p>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2">Intereses en común</h3>
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
                        className={`w-16 h-16 rounded-full border-2 border-green-500 hover:bg-green-500/10 transition-all duration-200 ${
                          likeAnimation ? "scale-110 bg-green-500/20" : ""
                        }`}
                        onClick={handleLike}
                        disabled={likeAnimation || dislikeAnimation}
                      >
                        <Heart className={`h-8 w-8 text-green-500 ${likeAnimation ? "animate-pulse" : ""}`} />
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

        {/* Right Ad */}
        {renderAd(rightAd, "right")}
      </div>

      {/* Match Animation */}
      <MatchAnimation
        visible={matchAnimation}
        user1Name={matchData?.user1Name}
        user2Name={matchData?.user2Name}
        onComplete={handleMatchComplete}
      />

      {/* Ad Modal */}
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
    </div>
  )
}
