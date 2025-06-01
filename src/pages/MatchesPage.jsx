// MatchesPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MapPin,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Loader } from "@/components/loader";
import Swal from "sweetalert2";
import Navbar from "@/components/navbar";

// Lista de intereses para mostrar nombres en lugar de IDs
const AVAILABLE_INTERESTS = [
  { id: "arte", name: "Arte" },
  { id: "música", name: "Música" },
  { id: "cine", name: "Cine" },
  { id: "lectura", name: "Lectura" },
  { id: "gastronomía", name: "Gastronomía" },
  { id: "yoga", name: "Yoga" },
  { id: "senderismo", name: "Senderismo" },
  { id: "viajar", name: "Viajar" },
  { id: "fotografía", name: "Fotografía" },
  { id: "baile", name: "Baile" },
  { id: "teatro", name: "Teatro" },
  { id: "deportes", name: "Deportes" },
];

export default function MatchesPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");
        if (!userId || !token) {
          throw new Error("Usuario no autenticado");
        }

        const response = await axios.get(`http://localhost:3000/users/${userId}/matchesUser`, {
          params: { skip, limit },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Matches response:", response.data);

        setMatches(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data?.error || "Error al cargar los matches");
        setIsLoading(false);
        await Swal.fire({
          title: "Error",
          text: error.response?.data?.error || "Error al cargar los matches",
          icon: "error",
          confirmButtonColor: "#f43f5e",
          background: "#1f2937",
          color: "#ffffff",
        });
      }
    };

    fetchMatches();
  }, [skip, limit]);

  const handleLoadMore = () => {
    setSkip((prev) => prev + limit);
  };

  if (isLoading && skip === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      <Navbar />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,0.1),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,0.05),transparent_50%)] pointer-events-none"></div>

      <header className="p-4 flex items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="ml-2 font-bold text-xl tracking-tight">HeartSync</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Heart className="h-5 w-5 mr-2 text-rose-500" />
              Tus Matches
            </CardTitle>
            <CardDescription>Explora personas que comparten tus intereses</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300 mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {matches.length === 0 && !error && !isLoading && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No se encontraron matches</h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  Ajusta tus preferencias o intenta de nuevo más tarde.
                </p>
                <Button
                  onClick={() => navigate("/perfil")}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Editar Perfil
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map((match, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {match.otherUser?.photos && match.otherUser.photos.length > 0 ? (
                            match.otherUser.photos.map((photo, photoIndex) => (
                              <CarouselItem key={photoIndex} className="basis-full">
                                <div className="relative aspect-square rounded-xl overflow-hidden">
                                  <img
                                    src={photo || "/placeholder.svg"}
                                    alt={`Foto de ${match.otherUser.name || "Usuario"}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <span className="text-white text-sm font-medium">
                                      Foto {photoIndex + 1} {photoIndex === 0 && "(Principal)"}
                                    </span>
                                  </div>
                                </div>
                              </CarouselItem>
                            ))
                          ) : (
                            <CarouselItem className="basis-full">
                              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            </CarouselItem>
                          )}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        {match.otherUser?.name || "Sin nombre"} {match.otherUser?.surname || ""}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{match.otherUser?.age || "N/A"} años</span>
                        <MapPin className="h-4 w-4 ml-2" />
                        <span>{match.otherUser?.country || "N/A"}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-rose-400">
                          {match?.matchPercentage || 0}% de coincidencia
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {match.otherUser?.interests && match.otherUser.interests.length > 0 ? (
                          match.otherUser.interests.map((interestId) => {
                            const interest = AVAILABLE_INTERESTS.find((i) => i.id === interestId);
                            return (
                              <Badge
                                key={interestId}
                                className="bg-rose-600 hover:bg-rose-700 text-white"
                              >
                                {interest ? interest.name : interestId}
                              </Badge>
                            );
                          })
                        ) : (
                          <Badge className="bg-gray-600 text-white">Sin intereses</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                        {match.otherUser?.bio || "Sin biografía"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {matches.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  className={isLoading ? "bg-rose-600 hover:bg-rose-700 text-white": "hidden"}
                  disabled={isLoading}
                >
                  {isLoading ? "Cargando..." : "Cargar más"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <style jsx global>{`
        .swal2-popup {
          border-radius: 1rem;
        }
        .swal2-title {
          font-weight: 600;
        }
        .swal-confirm-button {
          font-weight: 500 !important;
          border-radius: 0.375rem !important;
        }
        .swal2-icon {
          border-color: #f43f5e !important;
        }
      `}</style>
    </div>
  );
}