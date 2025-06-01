"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toasts";
import Navbar from "@/components/navbar";
import axios from "axios";
import { Loader } from "@/components/loader";


export default function ProfileViewPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [unmatchDialogOpen, setUnmatchDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [superlikeAnimation, setSuperlikeAnimation] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [commonInterests, setCommonInterests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const currentUserId = localStorage.getItem("userId");
      
      console.log("Fetching data with:", { token: !!token, currentUserId, profileId: id });

      if (!currentUserId || !token) {
        console.error("Missing auth token or user ID");
        toast({ title: "Error", description: "Por favor inicia sesión", variant: "destructive" });
        navigate("/login");
        return;
      }

      // Fetch current user
      console.log(`Fetching current user: https://heartsync-backend-xoba.onrender.com/api/users/miPerfil/${id}`);
      const currentUserResponse = await axios.get(`https://heartsync-backend-xoba.onrender.com/users/miPerfil/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Current user response:", currentUserResponse.data);
      setCurrentUser(currentUserResponse.data);

      // Fetch profile user
      console.log(`Fetching profile: https://heartsync-backend-xoba.onrender.com/users/${id}`);
      const profileResponse = await axios.get(`https://heartsync-backend-xoba.onrender.com/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile response:", profileResponse.data);
      setProfileData({ ...profileResponse.data, matchStatus: "none", conversationStarted: false });

      // Fetch matches
      console.log(`Fetching matches: https://heartsync-backend-xoba.onrender.com/users/${id}/matches`);
      const matchesResponse = await axios.get(`https://heartsync-backend-xoba.onrender.com/users/${id}/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Matches response:", matchesResponse.data);
      const matches = matchesResponse.data;

      const profileMatch = matches.find((match) => match.id === id);
      if (profileMatch) {
        setCommonInterests(
          profileMatch.interests.filter((interest) =>
            currentUserResponse.data.interests.includes(interest)
          )
        );
        const sharedInterestsScore = profileMatch.sharedInterests
          ? Math.min((profileMatch.sharedInterests / (profileResponse.data.interests.length || 1)) * 60, 60)
          : 0;
        const countryScore =
          currentUserResponse.data.internationalMode ||
          currentUserResponse.data.country === profileResponse.data.country
            ? 20
            : 10;
        const ageDifference = Math.abs(
          currentUserResponse.data.minAgePreference - profileResponse.data.age
        );
        const ageScore =
          profileResponse.data.age >= currentUserResponse.data.minAgePreference &&
          profileResponse.data.age <= currentUserResponse.data.maxAgePreference
            ? 20
            : Math.max(20 - ageDifference * 2, 0);
        const totalScore = Math.round(sharedInterestsScore + countryScore + ageScore);
        setMatchPercentage(totalScore);

        if (profileResponse.data.matches.includes(currentUserId)) {
          setProfileData((prev) => ({
            ...prev,
            matchStatus: "matched",
            matchDate: new Date(),
          }));
        }
      }
    } catch (error) {
      console.error("Fetch error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast({
        title: "Error",
        description: error.response?.data?.error || "No se pudo cargar el perfil",
        variant: "destructive",
      });
    }
  };
  fetchData();
}, [id, navigate, toast]);

  const handleNextImage = () => {
    if (profileData?.photos?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % profileData.photos.length);
    }
  };

  const handlePrevImage = () => {
    if (profileData?.photos?.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? profileData.photos.length - 1 : prev - 1));
    }
  };

  const handleLike = async () => {
    setLikeAnimation(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(`https://heartsync-backend-xoba.onrender.com/users/${currentUser.id}/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "¡Like enviado!",
        description: `Has dado like a ${profileData.name}`,
        variant: "success",
      });
      if (response.data.isMatched) {
        setProfileData((prev) => ({
          ...prev,
          matchStatus: "matched",
          matchDate: new Date(),
        }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send like",
        variant: "destructive",
      });
    }
    setTimeout(() => setLikeAnimation(false), 1000);
  };

  const handleSuperlike = async () => {
    setSuperlikeAnimation(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(`https://heartsync-backend-xoba.onrender.com/users/${currentUser.id}/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "¡Super Like!",
        description: `Has enviado un Super Like a ${profileData.name}`,
        variant: "success",
      });
      if (response.data.isMatched) {
        setProfileData((prev) => ({
          ...prev,
          matchStatus: "matched",
          matchDate: new Date(),
        }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send super like",
        variant: "destructive",
      });
    }
    setTimeout(() => setSuperlikeAnimation(false), 1000);
  };

  const handleStartChat = () => {
    navigate(`/messages/${id}`);
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleReport = () => {
    setReportDialogOpen(true);
  };

  const handleUnmatch = () => {
    setUnmatchDialogOpen(true);
  };

  const confirmUnmatch = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`https://heartsync-backend-xoba.onrender.com/users/${currentUser.id}/dislike/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Unmatch confirmado",
        description: `Ya no harás match con ${profileData.name}`,
      });
      setUnmatchDialogOpen(false);
      setTimeout(() => navigate("/matches"), 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to unmatch",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getInterestIcon = useCallback((interest) => {
    switch (interest.toLowerCase()) {
      case "viajes":
        return <Plane className="h-4 w-4" />;
      case "música":
        return <Music className="h-4 w-4" />;
      case "gastronomía":
        return <Coffee className="h-4 w-4" />;
      case "lectura":
        return <Book className="h-4 w-4" />;
      case "cine":
        return <Film className="h-4 w-4" />;
      default:
        return <ThumbsUp className="h-4 w-4" />;
    }
  }, []);

  const formatMatchDate = (date) => {
    const now = new Date();
    const matchDate = new Date(date);
    const diffTime = Math.abs(now - matchDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    const weeks = Math.floor(diffDays / 7);
    if (diffDays < 30) return `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;
  };

  if (!profileData || !currentUser) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-800"
            onClick={handleBack}
            aria-label="Back"
          >
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
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                Compartir perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                onClick={handleReport}
              >
                <Info className="h-4 w-4 mr-2" />
                Reportar perfil
              </DropdownMenuItem>
              {profileData.matchStatus === "matched" && (
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
          {/* Left Column - Photos and Actions */}
          <div className="lg:col-span-2">
            <Card className="border-gray-800 bg-gray-900/50 overflow-hidden shadow-xl">
              <div className="relative">
                {profileData.photos?.length > 1 && (
                  <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-1">
                    {profileData.photos.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full ${
                          index === currentImageIndex ? "bg-rose-500 w-6" : "bg-gray-500/50 w-4"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <div className="relative h-[500px]">
                  <img
                    src={profileData.photos?.[currentImageIndex] || "/placeholder.svg"}
                    alt={`${profileData.name}'s profile photo`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-rose-600/90 text-white rounded-full px-3 py-1 text-sm font-semibold flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    {matchPercentage}% Match
                  </div>
                  {profileData.photos?.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <h2 className="text-3xl font-bold">
                      {profileData.name}, {profileData.age}
                    </h2>
                    <div className="flex items-center mt-1 text-gray-300">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profileData.country}</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-400 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Activa: {formatMatchDate(profileData.lastActive)}</span>
                    </div>
                  </div>
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
                {profileData.matchStatus === "matched" && (
                  <div className="mb-4 bg-rose-600/10 border border-rose-600/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-rose-600/20 p-2 rounded-full mr-3">
                        <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="font-medium">Match con {profileData.name}</h3>
                        <p className="text-sm text-gray-400">
                          {formatMatchDate(profileData.matchDate)}
                          {profileData.conversationStarted
                            ? " • Conversación iniciada"
                            : " • Sin mensajes aún"}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="action-button bg-rose-600 hover:bg-rose-700"
                      onClick={handleStartChat}
                      aria-label={profileData.conversationStarted ? "Continue chat" : "Start chat"}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {profileData.conversationStarted ? "Continuar chat" : "Iniciar chat"}
                    </Button>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Sobre {profileData.name}</h3>
                  <p className="text-gray-300">{profileData.bio || "No bio disponible"}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">Información básica</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-300">
                        <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium text-gray-400">Ciudad:</span>
                        <span className="ml-2">{profileData.city}</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium text-gray-400">Edad:</span>
                        <span className="ml-2">{profileData.age} años</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">Coincidencias</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-400 mb-2">Intereses en común:</h5>
                        <div className="flex flex-wrap gap-2">
                          {commonInterests.map((interest) => (
                            <Badge
                              key={interest}
                              className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 flex items-center gap-1 text-xs"
                            >
                              {getInterestIcon(interest)}
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Intereses</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests?.map((interest) => (
                      <Badge
                        key={interest}
                        className={`${
                          commonInterests.includes(interest)
                            ? "bg-rose-600/20 text-rose-400 hover:bg-rose-600/30"
                            : "bg-gray-700/50 text-gray-400 hover:bg-gray-600"
                        } rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1`}
                      >
                        {getInterestIcon(interest)}
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-1">
            <Card className="border-gray-800 bg-gray-900/50 rounded-xl shadow-lg">
              <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid grid-cols-1 bg-gray-800/50 rounded-t-lg">
                  <TabsTrigger
                    value="photos"
                    className="text-sm font-medium text-gray-400 data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                  >
                    Fotos
                  </TabsTrigger>

                </TabsList>
                <TabsContent value="photos" className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {profileData.photos?.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Foto ${index + 1} de ${profileData.name}`}
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
                <TabsContent value="compatibility" className="p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 mb-4">
                        <div className="bg-gray-900 rounded-full p-3">
                          <Sparkles className="h-8 w-8 text-rose-500" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{matchPercentage}%</h3>
                      <p className="text-sm text-gray-400">Compatibilidad</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-rose-500" />
                          Intereses compartidos
                        </h4>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2">
                            {commonInterests.map((interest) => (
                              <Badge
                                key={interest}
                                className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 flex items-center gap-1 text-xs"
                              >
                                {getInterestIcon(interest)}
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-rose-500" />
                          Atributos compatibles
                        </h4>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <ul className="space-y-2">
                            {[
                              { key: "city", value: profileData.city },
                              {
                                profile: "internationalMode",
                                value: profileData.internationalMode ? "Local" : "Global",
                              },
                            ].map(({ key, value }) => (
                              <li key={key} className="flex items-center text-sm text-gray-300">
                                <div className="h-2 w-2 rounded-full bg-rose-300 mr-2"></div>
                                <span className="font-medium text-gray-400 capitalize">{key}:</span>
                                <span className="ml-2">{value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">¿Por qué hacen match?</h4>
                        <p className="text-sm text-gray-600">
                          Tú y {profileData.name} comparten intereses en{" "}
                          {commonInterests.join(" y ") || "ninguno"},
                          {currentUser.internationalMode || currentUser.city === profileData.city
                            ? "y son compatibles en ubicación."
                            : "aunque están en diferentes ciudades."}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            {profileData.matchStatus === "matched" && (
              <Button
                variant="outline"
                className="w-full mt-4 border-gray-700 bg-gray-800/30 text-red-300 hover:bg-gray-700/50 hover:text-red-200 transition-all duration-200 rounded-full"
                onClick={handleUnmatch}
                aria-label="Deshacer match"
              >
                <X className="h-4 w-4 mr-2" />
                Deshacer match
              </Button>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent className="bg-gray-900 border border-gray-800 rounded-lg text-gray-300">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-300">Reportar perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm">
                Selecciona el motivo por el que quieres reportar a {profileData.name}:
              </p>
              <div className="space-y-2">
                {[
                  "Fotos inapropiadas",
                  "Perfil falso",
                  "Comportamiento ofensivo",
                  "Spam",
                  "Menor de edad",
                  "Otro",
                ].map((reason) => (
                  <Button
                    key={reason}
                    variant="outline"
                    className="w-full justify-start border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-gray-200 text-left text-sm transition-all duration-200"
                    onClick={() => {
                      toast({
                        title: "Perfil reportado",
                        description: "Gracias por ayudarnos a mantener HeartSync segura.",
                        variant: "success",
                      });
                      setReportDialogOpen(false);
                    }}
                  >
                    {reason}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={unmatchDialogOpen} onOpenChange={setUnmatchDialogOpen}>
          <DialogContent className="bg-gray-900 border border-gray-800 rounded-lg text-gray-300">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-300">Deshacer match</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm">
                ¿Estás segura de que quieres deshacer el match con {profileData.name}?
              </p>
              <p className="text-xs text-gray-400">
                Esta acción no se puede deshacer. Se eliminará la conversación y ya no podrán contactarse.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-gray-200 transition-all duration-200"
                onClick={() => setUnmatchDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                onClick={confirmUnmatch}
              >
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="bg-gray-900 border border-gray-800 rounded-lg text-gray-300">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-300">Compartir perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm">
                Comparte el perfil de {profileData.name} con tus amigos:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { name: "Explora", color: "bg-green-500" },
                  { name: "Facebook", color: "bg-blue-600" },
                  { name: "Tweet", color: "bg-sky-500" },
                  { name: "Email", color: "bg-gray-600" },
                ].map((platform) => (
                  <Button
                    key={platform.name}
                    className={`${platform.color} hover:opacity-90 text-white px-4 py-2 text-sm transition-all duration-200 rounded-full`}
                    onClick={() => {
                      toast({
                        description: `Compartiendo perfil vía ${platform.name}`,
                      });
                      setShareDialogOpen(false);
                    }}
                  >
                    {platform.name}
                  </Button>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-2">O copia el enlace:</p>
                <div className="flex">
                  <input
                    value={`https://heartsync.com/profile/${profileData.id}`}
                    readOnly
                    className="bg-gray-800/50 border border-gray-700 text-gray-300 flex-1 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-2"
                    aria-label="Profile URL"
                  />
                  <Button
                    className="ml-2 bg-rose-600 hover:bg-rose-500 text-white rounded-r-md px-4 py-2 text-sm transition-all duration-200"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://heartsync.com/profile/${profileData.id}`);
                      toast({
                        title: "Enlace copiado",
                        description: "El enlace se ha copiado al portapapeles.",
                      });
                      setShareDialogOpen(false);
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
    </div>
  );
}