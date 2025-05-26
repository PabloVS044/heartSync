"use client"

import { useState, useEffect } from "react"
import { Heart, X, Star, Info, ExternalLink, ThumbsUp, Coffee, Music, Book, Film, Plane, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toasts"
import Navbar from "@/components/navbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"

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
  const [superlikeAnimation, setSuperlikeAnimation] = useState(false)
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
            variant: "destructive"
          })
          navigate("/login")
          return
        }

        // Fetch matches
        const matchesResponse = await axios.get(`http://localhost:3000/users/${userId}/matches`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { skip: 0, limit: 10 }
        })
        const transformedMatches = matchesResponse.data.map(match => ({
          id: match.id,
          name: match.name,
          age: match.age,
          location: match.country,
          bio: match.bio || "Sin biografía",
          distance: "Desconocido",
          compatibility: Math.min(80 + match.sharedInterests * 5, 95),
          images: match.photos.length > 0 ? match.photos : ["/placeholder.svg?height=500&width=400"],
          interests: match.interests || [],
          commonInterests: match.interests || [],
          commonAttributes: {
            country: match.country,
            activityLevel: match.interests.includes("senderismo") || match.interests.includes("natación") ? "Activo" : "Moderado"
          },
          matchType: match.matchType
        }))
        setMatches(transformedMatches)

        // Fetch personalized ads for the user
        const adsResponse = await axios.get(`http://localhost:3000/ads/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { skip: 0, limit: 2 }
        })
        const fetchedAds = adsResponse.data.map(ad => ({
          id: ad.id,
          title: ad.title,
          image: ad.image || "/placeholder.svg?height=600&width=160&text=Anuncio",
          description: ad.description,
          targetedReason: `Basado en tu interés por ${ad.relatedInterests?.join(", ") || "temas relacionados"}.`,
          url: ad.url || "https://example.com",
          relatedInterests: ad.relatedInterests || []
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
          variant: "destructive"
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
    setCurrentMatchIndex((prev) => (prev + 1) % (matches.length || 1))
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
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/like/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast({
        title: response.data.isMatched ? "¡Match!" : "¡Like enviado!",
        description: response.data.isMatched
          ? `¡Has hecho match con ${currentMatch.name}!`
          : `Has dado like a ${currentMatch.name}`,
        variant: "success"
      })
      setTimeout(() => {
        setLikeAnimation(false)
        nextMatch()
      }, 1000)
    } catch (error) {
      console.error("Error liking user:", error.response?.data || error.message)
      toast({
        title: "Error",
        description: "No se pudo enviar el like. Inténtalo de nuevo.",
        variant: "destructive"
      })
      setLikeAnimation(false)
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
        `http://localhost:3000/users/${userId}/dislike/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast({
        description: `Has pasado de ${currentMatch.name}`,
      })
      setTimeout(() => {
        setDislikeAnimation(false)
        nextMatch()
      }, 1000)
    } catch (error) {
      console.error("Error disliking user:", error.response?.data || error.message)
      toast({
        title: "Error",
        description: "No se pudo pasar del usuario. Inténtalo de nuevo.",
        variant: "destructive"
      })
      setDislikeAnimation(false)
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login")
      }
    }
  }

  const handleSuperlike = async () => {
    if (!currentMatch) return
    setSuperlikeAnimation(true)
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/like/${currentMatch.id}`,
        { superlike: true },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast({
        title: response.data.isMatched ? "¡Match!" : "¡Super Like enviado!",
        description: response.data.isMatched
          ? `¡Has hecho match con ${currentMatch.name}!`
          : `Has enviado un Super Like a ${currentMatch.name}`,
        variant: "success"
      })
      setTimeout(() => {
        setSuperlikeAnimation(false)
        nextMatch()
      }, 1000)
    } catch (error) {
      console.error("Error superliking user:", error.response?.data || error.message)
      toast({
        title: "Error",
        description: "No se pudo enviar el Super Like. Inténtalo de nuevo.",
        variant: "destructive"
      })
      setSuperlikeAnimation(false)
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login")
      }
    }
  }

  const openAdModal = (ad) => {
    setSelectedAd(ad)
    setAdModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No hay más personas para descubrir</h2>
          <p className="text-gray-400 mb-6">Vuelve más tarde o ajusta tus preferencias.</p>
          <Button onClick={() => navigate("/profile")}>Editar preferencias</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-4">
        {/* Left Ad */}
        {leftAd && (
          <div className="hidden md:block w-40 flex-shrink-0">
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer" onClick={() => openAdModal(leftAd)}>
              <CardContent className="p-2">
                <img src={leftAd.image} alt={leftAd.title} className="w-full h-60 object-cover rounded-md mb-2" />
                <h4 className="text-sm font-semibold truncate">{leftAd.title}</h4>
                <p className="text-xs text-gray-400">{leftAd.targetedReason}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Card
              className={`bg-gray-900/50 border-gray-800 transition-transform duration-500 ${
                direction === "left" ? "-translate-x-full opacity-0" : direction === "right" ? "translate-x-full opacity-0" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={currentMatch.images[currentImageIndex]}
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

                  <div className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full border-2 border-yellow-500 hover:bg-yellow-500/10"
                      onClick={handleSuperlike}
                      disabled={superlikeAnimation}
                    >
                      <Star className={`h-6 w-6 text-yellow-500 ${superlikeAnimation ? "animate-pulse" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full border-2 border-red-500 hover:bg-red-500/10"
                      onClick={handleDislike}
                      disabled={dislikeAnimation}
                    >
                      <X className={`h-8 w-8 text-red-500 ${dislikeAnimation ? "animate-pulse" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full border-2 border-green-500 hover:bg-green-500/10"
                      onClick={handleLike}
                      disabled={likeAnimation}
                    >
                      <Heart className={`h-8 w-8 text-green-500 ${likeAnimation ? "animate-pulse" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full border-2 border-blue-500 hover:bg-blue-500/10"
                      onClick={() => navigate(`/profile/${currentMatch.id}`)}
                    >
                      <Info className="h-6 w-6 text-blue-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Ad */}
        {rightAd && (
          <div className="hidden md:block w-40 flex-shrink-0">
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer" onClick={() => openAdModal(rightAd)}>
              <CardContent className="p-2">
                <img src={rightAd.image} alt={rightAd.title} className="w-full h-60 object-cover rounded-md mb-2" />
                <h4 className="text-sm font-semibold truncate">{rightAd.title}</h4>
                <p className="text-xs text-gray-400">{rightAd.targetedReason}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Ad Modal */}
      <Dialog open={adModalOpen} onOpenChange={setAdModalOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>{selectedAd?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">{selectedAd?.targetedReason}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedAd?.image} alt={selectedAd?.title} className="w-full h-64 object-cover rounded-md" />
            <p>{selectedAd?.description}</p>
            <div className="flex gap-2">
              {selectedAd?.relatedInterests.map((interest) => (
                <Badge key={interest} className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30">
                  {interest}
                </Badge>
              ))}
            </div>
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <a href={selectedAd?.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                Visitar <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}