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
  const [matches, setMatches] = useState([]);
  const [ads, setAds] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [leftAds, setLeftAds] = useState([]);
  const [rightAds, setRightAds] = useState([]);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);
  const [superlikeAnimation, setSuperlikeAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const currentMatch = matches[currentMatchIndex];

  // Fetch matches and ads on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token || !userId) {
          toast({
            title: "Sesión expirada",
            description: "Por favor, inicia sesión nuevamente.",
            variant: "destructive"
          });
          navigate("/login");
          return;
        }

        // Fetch matches
        const matchesResponse = await axios.get(`http://localhost:3000/users/${userId}/matches`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { skip: 0, limit: 10 }
        });
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
        }));
        setMatches(transformedMatches);

        // Fetch ads (fallback to static if /ads fails)
        try {
          const adsResponse = await axios.get("http://localhost:3000/ads", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAds(adsResponse.data);
        } catch (adError) {
          console.warn("Failed to fetch ads, using static ads:", adError.message);
          setAds([
            {
              id: 1,
              title: "Escapada romántica a Santorini",
              image: "/placeholder.svg?height=600&width=160&text=Viajes",
              description: "Descubre el paraíso griego con ofertas exclusivas para parejas.",
              targetedReason: "Basado en tu interés por los viajes y experiencias románticas.",
              url: "https://example.com/santorini",
              relatedInterests: ["viajes", "romance"]
            },
            // Add more static ads if needed
          ]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error.response?.data || error.message);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Inténtalo de nuevo.",
          variant: "destructive"
        });
        setIsLoading(false);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate, toast, userId]);

  // Filter ads based on current match interests
  useEffect(() => {
    if (currentMatch && ads.length > 0) {
      const relevantAds = ads.filter((ad) =>
        ad.relatedInterests.some(
          (interest) => currentMatch.interests.includes(interest.toLowerCase()) || currentMatch.commonInterests.includes(interest.toLowerCase())
        )
      );
      const shuffled = [...relevantAds].sort(() => 0.5 - Math.random());
      setLeftAds(shuffled.slice(0, 2));
      setRightAds(shuffled.slice(2, 4));
    }
  }, [currentMatch, ads]);

  const handleNextImage = () => {
    if (currentMatch?.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % currentMatch.images.length);
    }
  };

  const handlePrevImage = () => {
    if (currentMatch?.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? currentMatch.images.length - 1 : prev - 1));
    }
  };

  const handleLike = async () => {
    if (!currentMatch) return;
    setLikeAnimation(true);
    setDirection("right");
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/like/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: response.data.isMatched ? "¡Match!" : "¡Like enviado!",
        description: response.data.isMatched
          ? `¡Has hecho match con ${currentMatch.name}!`
          : `Has dado like a ${currentMatch.name}`,
        variant: "success"
      });
      setTimeout(() => {
        setLikeAnimation(false);
        nextMatch();
      }, 1000);
    } catch (error) {
      console.error("Error liking user:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "No se pudo enviar el like. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setLikeAnimation(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleDislike = async () => {
    if (!currentMatch) return;
    setDislikeAnimation(true);
    setDirection("left");
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:3000/users/${userId}/dislike/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        description: `Has pasado de ${currentMatch.name}`,
      });
      setTimeout(() => {
        setDislikeAnimation(false);
        nextMatch();
      }, 1000);
    } catch (error) {
      console.error("Error disliking user:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "No se pudo pasar del usuario. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setDislikeAnimation(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleSuperlike = async () => {
    if (!currentMatch) return;
    setSuperlikeAnimation(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/like/${currentMatch.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: response.data.isMatched ? "¡Match!" : "¡Super Like enviado!",
        description: response.data.isMatched
          ? `¡Has hecho match con ${currentMatch.name}!`
          : `Has enviado un Super Like a ${currentMatch.name}`,
        variant: "success"
      });
      setTimeout(() => {
        setSuperlikeAnimation(false);
        nextMatch();
      }, 1000);
    } catch (error) {
      console.error("Error superliking user:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "No se pudo enviar el Super Like. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setSuperlikeAnimation(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const nextMatch = () => {
    setCurrentImageIndex(0);
    setCurrentMatchIndex((prev) => (prev + 1) % matches.length || 0);
  };

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
    setAdModalOpen(true);
  };

  const getInterestIcon = (interest) => {
    const iconProps = { className: "h-4 w-4" }; // Explicit props to avoid stray attributes
    switch (interest.toLowerCase()) {
      case "viajes": return <Plane {...iconProps} />;
      case "música": return <Music {...iconProps} />;
      case "cocina": return <Coffee {...iconProps} />;
      case "lectura": return <Book {...iconProps} />;
      case "cine": return <Film {...iconProps} />;
      default: return <ThumbsUp {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p>Cargando matches...</p>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p>No hay más matches disponibles.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Descubre tus Matches</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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

                  <div className="relative h-[500px]">
                    <img
                      src={currentMatch.images[currentImageIndex] || "/placeholder.svg"}
                      alt="hola"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute top-4 right-4 bg-rose-600/90 text-white rounded-full px-3 py-1 text-sm font-semibold flex items-center">
                      <Sparkles className="h-4 w-4 mr-1" />
                      {currentMatch.compatibility}% Match
                    </div>

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
                  <p className="text-gray-300 mb-4">{currentMatch.bio}</p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-rose-500" />
                      Coincidencias
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex justify-center mt-6 gap-4">
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-90"
                  onClick={handleDislike}
                >
                  <X className="h-8 w-8" />
                </Button>

                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-90"
                  onClick={handleSuperlike}
                >
                  <Star className="h-8 w-8" />
                </Button>

                <Button
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-90"
                  onClick={handleLike}
                >
                  <Heart className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>

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