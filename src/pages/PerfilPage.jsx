"use client"

import { useState, useEffect, useRef } from "react"
import { Edit, Settings, Heart, X, Star, Camera, Trash2, LogOut, MapPin, Calendar, Sparkles, ChevronLeft, ChevronRight, Upload, MoreVertical, Eye, Download, RotateCcw, Crop, Maximize2, Grid3X3, ImageIcon, Plus, Check, Crown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Loader } from "@/components/loader"
import { useToast } from "@/hooks/use-toasts"

// Lista de intereses disponibles
const AVAILABLE_INTERESTS = [
  { id: "arte", name: "Arte", icon: "🎨" },
  { id: "museos", name: "Museos", icon: "🏛️" },
  { id: "historia", name: "Historia", icon: "📜" },
  { id: "teatro", name: "Teatro", icon: "🎭" },
  { id: "cine", name: "Cine", icon: "🎬" },
  { id: "lectura", name: "Lectura", icon: "📚" },
  { id: "poesía", name: "Poesía", icon: "📝" },
  { id: "escritura", name: "Escritura", icon: "✍️" },
  { id: "filosofía", name: "Filosofía", icon: "🤔" },

  { id: "música", name: "Música", icon: "🎵" },
  { id: "conciertos", name: "Conciertos", icon: "🎤" },
  { id: "tocar_instrumento", name: "Tocar instrumento", icon: "🎸" },
  { id: "dj", name: "DJ", icon: "🎧" },
  { id: "karaoke", name: "Karaoke", icon: "🎙️" },
  { id: "canto", name: "Canto", icon: "🎶" },

  { id: "deportes", name: "Deportes", icon: "⚽" },
  { id: "fútbol", name: "Fútbol", icon: "⚽" },
  { id: "baloncesto", name: "Baloncesto", icon: "🏀" },
  { id: "tenis", name: "Tenis", icon: "🎾" },
  { id: "ciclismo", name: "Ciclismo", icon: "🚴" },
  { id: "natación", name: "Natación", icon: "🏊" },
  { id: "running", name: "Running", icon: "🏃" },
  { id: "senderismo", name: "Senderismo", icon: "🥾" },
  { id: "acampada", name: "Acampada", icon: "🏕️" },
  { id: "escalada", name: "Escalada", icon: "🧗" },
  { id: "surf", name: "Surf", icon: "🏄" },
  { id: "skate", name: "Skate", icon: "🛹" },
  { id: "snowboard", name: "Snowboard", icon: "🏂" },
  { id: "yoga", name: "Yoga", icon: "🧘" },
  { id: "pilates", name: "Pilates", icon: "🤸" },
  { id: "crossfit", name: "Crossfit", icon: "🏋️" },
  { id: "gimnasio", name: "Gimnasio", icon: "💪" },

  { id: "meditación", name: "Meditación", icon: "🧘‍♂️" },
  { id: "espiritualidad", name: "Espiritualidad", icon: "🕉️" },
  { id: "alimentación_saludable", name: "Alimentación saludable", icon: "🥗" },
  { id: "vegetariano", name: "Vegetariano", icon: "🥦" },
  { id: "veganismo", name: "Veganismo", icon: "🌱" },
  { id: "mascotas", name: "Mascotas", icon: "🐶" },
  { id: "voluntariado", name: "Voluntariado", icon: "🤝" },

  { id: "tecnología", name: "Tecnología", icon: "💻" },
  { id: "videojuegos", name: "Videojuegos", icon: "🎮" },
  { id: "inteligencia_artificial", name: "Inteligencia Artificial", icon: "🧠" },
  { id: "robótica", name: "Robótica", icon: "🤖" },
  { id: "astronomía", name: "Astronomía", icon: "🔭" },
  { id: "programación", name: "Programación", icon: "👨‍💻" },
  { id: "gadgets", name: "Gadgets", icon: "📱" },

  { id: "anime", name: "Anime", icon: "🧑‍🎤" },
  { id: "manga", name: "Manga", icon: "📖" },
  { id: "series", name: "Series", icon: "📺" },
  { id: "netflix", name: "Netflix", icon: "🎞️" },
  { id: "marvel", name: "Marvel", icon: "🦸" },
  { id: "starwars", name: "Star Wars", icon: "🚀" },
  { id: "cosplay", name: "Cosplay", icon: "👗" },

  { id: "fotografía", name: "Fotografía", icon: "📸" },
  { id: "pintura", name: "Pintura", icon: "🖌️" },
  { id: "manualidades", name: "Manualidades", icon: "🧵" },
  { id: "diseño_gráfico", name: "Diseño gráfico", icon: "🖥️" },
  { id: "moda", name: "Moda", icon: "👗" },
  { id: "dibujo", name: "Dibujo", icon: "✏️" },
  { id: "baile", name: "Baile", icon: "💃" },
  { id: "costura", name: "Costura", icon: "🧶" },
  { id: "cocina", name: "Cocina", icon: "👨‍🍳" },
  { id: "repostería", name: "Repostería", icon: "🧁" },
  { id: "jardinería", name: "Jardinería", icon: "🌻" },
  { id: "coleccionismo", name: "Coleccionismo", icon: "📦" },

  { id: "gastronomía", name: "Gastronomía", icon: "🍽️" },
  { id: "vino", name: "Vino", icon: "🍷" },
  { id: "cerveza_artesanal", name: "Cerveza artesanal", icon: "🍺" },
  { id: "café", name: "Café", icon: "☕" },
  { id: "cocteles", name: "Cócteles", icon: "🍸" },
  { id: "brunch", name: "Brunch", icon: "🥞" },

  { id: "viajar", name: "Viajar", icon: "✈️" },
  { id: "mochilero", name: "Mochilero", icon: "🎒" },
  { id: "idiomas", name: "Idiomas", icon: "🗣️" },
  { id: "culturas", name: "Culturas del mundo", icon: "🌍" },
  { id: "playa", name: "Playa", icon: "🏖️" },
  { id: "montaña", name: "Montaña", icon: "🏔️" },
  { id: "roadtrips", name: "Roadtrips", icon: "🚗" },
  { id: "aventura", name: "Aventura", icon: "🧗‍♂️" },

  { id: "ajedrez", name: "Ajedrez", icon: "♟️" },
  { id: "juegos_de_mesa", name: "Juegos de mesa", icon: "🎲" },
  { id: "póker", name: "Póker", icon: "🃏" },
  { id: "escape_rooms", name: "Escape rooms", icon: "🧩" },
  { id: "trivia", name: "Trivia", icon: "❓" },

  { id: "autos", name: "Autos", icon: "🚘" },
  { id: "modificación_vehículos", name: "Modificación de vehículos", icon: "🔧" },
  { id: "motocicletas", name: "Motocicletas", icon: "🏍️" },
  { id: "invertir", name: "Invertir", icon: "📈" },
  { id: "negocios", name: "Negocios", icon: "💼" },
  { id: "memes", name: "Memes", icon: "😂" },
  { id: "redes_sociales", name: "Redes sociales", icon: "📱" }
];


export default function EnhancedProfilePage() {
  const [user, setUser] = useState(null)
  const [statistics, setStatistics] = useState({
    likes: 0,
    dislikes: 0,
    superlikes: 0,
    matches: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draggedPhoto, setDraggedPhoto] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  const [photoToDelete, setPhotoToDelete] = useState(null)
  const fileInputRef = useRef(null)

  const { toast } = useToast()
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")
  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!authToken || !userId) {
          toast({
            title: "Sesión expirada",
            description: "Por favor, inicia sesión nuevamente.",
            variant: "destructive",
          })
          navigate("/login")
          return
        }

        // Fetch user profile
        const userResponse = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        const userData = userResponse.data

        // Transform user data
        const transformedUser = {
          id: userData.id,
          name: userData.name || "",
          surname: userData.surname || "",
          age: userData.age || 0,
          bio: userData.bio || "",
          location: userData.country || "",
          photos: userData.photos?.length > 0 ? userData.photos : [],
          interests: userData.interests || [],
          email: userData.email || "",
          preferences: userData.preferences || {
            ageRange: { min: 18, max: 50 },
            distance: 50,
            showMe: true,
          },
          mainPhotoIndex: userData.mainPhotoIndex || 0,
        }

        setUser(transformedUser)
        setEditedUser(transformedUser)
        setSelectedInterests(transformedUser.interests || [])

        // Fetch user statistics
        const statsResponse = await axios.get(`http://localhost:3000/users/${userId}/statistics`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        if (statsResponse.data) {
          setStatistics({
            likes: statsResponse.data.totalLikes || 0,
            dislikes: statsResponse.data.totalDislikes || 0,
            superlikes: statsResponse.data.totalSuperlikes || 0,
            matches: statsResponse.data.totalMatches || 0,
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del perfil.",
          variant: "destructive",
        })
        setIsLoading(false)
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login")
        }
      }
    }

    fetchUserData()
  }, [navigate, toast, userId, authToken])

  const handleNextImage = () => {
    if (user?.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % user.photos.length)
    }
  }

  const handlePrevImage = () => {
    if (user?.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? user.photos.length - 1 : prev - 1))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePreferencesChange = (key, value) => {
    setEditedUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }))
  }

  const handleToggleInterest = (interestId) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId)
      } else {
        return [...prev, interestId]
      }
    })
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setPhotoPreview(reader.result)
        }
        reader.readAsDataURL(file)
        setPhotoFile(file)
        setPhotoUploadOpen(true)
      }
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handlePhotoUpload({ target: { files } })
    }
  }

  const handlePhotoDragStart = (e, index) => {
    setDraggedPhoto(index)
  }

  const handlePhotoDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handlePhotoDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedPhoto !== null && draggedPhoto !== dropIndex) {
      const newPhotos = [...user.photos]
      const draggedItem = newPhotos[draggedPhoto]
      newPhotos.splice(draggedPhoto, 1)
      newPhotos.splice(dropIndex, 0, draggedItem)

      setUser({ ...user, photos: newPhotos })
      setEditedUser({ ...editedUser, photos: newPhotos })
    }
    setDraggedPhoto(null)
    setDragOverIndex(null)
  }

  const setMainPhoto = async (photoIndex) => {
    try {
      await axios.put(
        `http://localhost:3000/users/${userId}/main-photo`,
        { mainPhotoIndex: photoIndex },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )

      setUser({ ...user, mainPhotoIndex: photoIndex })
      setEditedUser({ ...editedUser, mainPhotoIndex: photoIndex })

      toast({
        title: "Foto principal actualizada",
        description: "Tu foto principal ha sido cambiada correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error setting main photo:", error)
      toast({
        title: "Error",
        description: "No se pudo cambiar la foto principal.",
        variant: "destructive",
      })
    }
  }

  const savePhoto = async () => {
    try {
      if (!photoFile) return

      const formData = new FormData()
      formData.append("photo", photoFile)

      await axios.post(`http://localhost:3000/users/${userId}/photos`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      // Refresh user data to get new photo list
      const userResponse = await axios.get(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      setUser({
        ...user,
        photos: userResponse.data.photos,
      })

      setEditedUser({
        ...editedUser,
        photos: userResponse.data.photos,
      })

      setPhotoUploadOpen(false)
      setPhotoFile(null)
      setPhotoPreview(null)

      toast({
        title: "Foto subida",
        description: "Tu foto ha sido añadida correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        title: "Error",
        description: "No se pudo subir la foto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const deletePhoto = async (photoIndex) => {
    try {
      const photoId = user.photos[photoIndex].split("/").pop()

      await axios.delete(`http://localhost:3000/users/${userId}/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      const updatedPhotos = [...user.photos]
      updatedPhotos.splice(photoIndex, 1)

      setUser({
        ...user,
        photos: updatedPhotos,
      })

      setEditedUser({
        ...editedUser,
        photos: updatedPhotos,
      })

      if (currentImageIndex >= updatedPhotos.length) {
        setCurrentImageIndex(0)
      }

      setPhotoToDelete(null)

      toast({
        title: "Foto eliminada",
        description: "La foto ha sido eliminada correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la foto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const saveProfile = async () => {
    try {
      const updatedUser = {
        ...editedUser,
        interests: selectedInterests,
      }

      await axios.put(
        `http://localhost:3000/users/${userId}`,
        {
          name: updatedUser.name,
          surname: updatedUser.surname,
          age: updatedUser.age,
          bio: updatedUser.bio,
          country: updatedUser.location,
          interests: updatedUser.interests,
          preferences: updatedUser.preferences,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      )

      setUser(updatedUser)
      setEditMode(false)

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      localStorage.removeItem("userId")
      localStorage.removeItem("authToken")

      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada correctamente.",
        variant: "success",
      })

      navigate("/register")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <div className="container mx-auto mt-12 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No se pudo cargar el perfil</h2>
          <p className="text-gray-400 mb-6">Por favor, inténtalo de nuevo o inicia sesión.</p>
          <Button onClick={() => navigate("/login")}>Iniciar sesión</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header con información básica */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
          <Card className="relative bg-gray-900/80 backdrop-blur-sm border-gray-700/50 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-blue-500/5"></div>
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Avatar principal */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gradient-to-r from-rose-500 to-purple-500 p-1">
                    <img
                      src={user.photos[user.mainPhotoIndex || 0] || "/placeholder.svg?height=128&width=128"}
                      alt={`${user.name} avatar`}
                      className="w-full h-full object-cover rounded-full bg-gray-800"
                    />
                  </div>
                  {editMode && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full bg-rose-600 hover:bg-rose-700 shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Información del usuario */}
                <div className="flex-1 space-y-4 mt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {user.name} {user.surname}
                      </h1>
                      <div className="flex items-center gap-4 text-gray-300 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{user.age} años</span>
                        </div>
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      {!editMode ? (
                        <>
                          <Button
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-800/70 hover:border-gray-500"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-800/70 hover:border-gray-500"
                            onClick={() => setSettingsOpen(true)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configuración
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-800/70"
                            onClick={() => {
                              setEditMode(false)
                              setEditedUser(user)
                              setSelectedInterests(user.interests)
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
                            onClick={saveProfile}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Guardar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Estadísticas */}
                 
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sección de fotos mejorada */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de fotos */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-rose-500" />
                    Mis fotos ({user.photos.length}/9)
                  </CardTitle>
                  {editMode && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {user.photos.length > 0 ? (
                  <div className="space-y-6">
                    {/* Foto principal destacada */}
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-2xl bg-gray-800">
                        <img
                          src={user.photos[currentImageIndex] || "/placeholder.svg"}
                          alt={`Foto ${currentImageIndex + 1}`}
                          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Controles de navegación */}
                        {user.photos.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                              onClick={handlePrevImage}
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                              onClick={handleNextImage}
                            >
                              <ChevronRight className="h-6 w-6" />
                            </Button>
                          </>
                        )}

                        {/* Indicador de foto principal */}
                        {currentImageIndex === (user.mainPhotoIndex || 0) && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold">
                              <Crown className="h-3 w-3 mr-1" />
                              Principal
                            </Badge>
                          </div>
                        )}

                        {/* Botón de galería completa */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                          onClick={() => setGalleryOpen(true)}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>

                        {/* Menú de opciones en modo edición */}
                        {editMode && (
                          <div className="absolute bottom-4 right-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-gray-900 border-gray-700">
                                <DropdownMenuItem
                                  onClick={() => setMainPhoto(currentImageIndex)}
                                  className="hover:bg-gray-800"
                                >
                                  <Crown className="h-4 w-4 mr-2" />
                                  Establecer como principal
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800">
                                  <Download className="h-4 w-4 mr-2" />
                                  Descargar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setPhotoToDelete(currentImageIndex)}
                                  className="hover:bg-gray-800 text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>

                      {/* Indicadores de fotos */}
                      {user.photos.length > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                          {user.photos.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex
                                  ? "bg-rose-500 w-8"
                                  : "bg-gray-600 hover:bg-gray-500"
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Grid de miniaturas */}
                    <div className="grid grid-cols-6 gap-3">
                      {user.photos.map((photo, index) => (
                        <div
                          key={index}
                          className={`relative group cursor-pointer rounded-lg overflow-hidden aspect-square ${
                            editMode ? "cursor-move" : ""
                          }`}
                          draggable={editMode}
                          onDragStart={(e) => handlePhotoDragStart(e, index)}
                          onDragOver={(e) => handlePhotoDragOver(e, index)}
                          onDrop={(e) => handlePhotoDrop(e, index)}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Miniatura ${index + 1}`}
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              index === currentImageIndex
                                ? "ring-2 ring-rose-500 opacity-100"
                                : "opacity-70 hover:opacity-100"
                            } ${dragOverIndex === index ? "scale-110" : ""}`}
                          />

                          {/* Indicador de foto principal */}
                          {index === (user.mainPhotoIndex || 0) && (
                            <div className="absolute top-1 left-1">
                              <Crown className="h-3 w-3 text-yellow-500" />
                            </div>
                          )}

                          {/* Overlay en hover */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            {editMode && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-400 hover:text-red-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPhotoToDelete(index)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Slots vacíos para añadir fotos */}
                      {editMode &&
                        user.photos.length < 9 &&
                        Array.from({ length: 9 - user.photos.length }).map((_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors duration-300"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                          >
                            <Plus className="h-6 w-6 text-gray-500" />
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  /* Estado vacío */
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-gray-500 transition-colors duration-300"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Añade tus primeras fotos</h3>
                    <p className="text-gray-500 mb-4">
                      Sube hasta 9 fotos para mostrar tu personalidad y atraer más matches
                    </p>
                    <Button className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir fotos
                    </Button>
                  </div>
                )}

                {/* Input oculto para subir archivos */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </CardContent>
            </Card>

            {/* Información del perfil */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 rounded-2xl">
              <CardContent className="p-6">
                {editMode ? (
                  /* Formulario de edición */
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                          Nombre
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={editedUser.name}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-600 focus:border-rose-500 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surname" className="text-gray-300">
                          Apellido
                        </Label>
                        <Input
                          id="surname"
                          name="surname"
                          value={editedUser.surname}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-600 focus:border-rose-500 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-gray-300">
                          Edad
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          min="18"
                          max="99"
                          value={editedUser.age}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-600 focus:border-rose-500 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-gray-300">
                          Ubicación
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          value={editedUser.location}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-600 focus:border-rose-500 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-gray-300">
                        Biografía
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editedUser.bio}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 focus:border-rose-500 rounded-xl min-h-[120px]"
                        placeholder="Cuéntanos un poco sobre ti..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-300">Intereses</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {AVAILABLE_INTERESTS.map((interest) => (
                          <div
                            key={interest.id}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              selectedInterests.includes(interest.id)
                                ? "border-rose-500 bg-rose-500/20 text-rose-300"
                                : "border-gray-600 bg-gray-800/50 hover:border-gray-500 text-gray-300"
                            }`}
                            onClick={() => handleToggleInterest(interest.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{interest.icon}</span>
                              <span className="text-sm font-medium">{interest.name}</span>
                              {selectedInterests.includes(interest.id) && (
                                <Check className="h-4 w-4 ml-auto text-rose-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Vista de perfil */
                  <div className="space-y-6">
                    {user.bio && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-200">Sobre mí</h3>
                        <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-200">Mis intereses</h3>
                      {user.interests && user.interests.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {user.interests.map((interestId) => {
                            const interest = AVAILABLE_INTERESTS.find((i) => i.id === interestId)
                            return (
                              <div
                                key={interestId}
                                className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-xl border border-gray-700"
                              >
                                <span className="text-lg">{interest?.icon}</span>
                                <span className="text-sm font-medium text-gray-300">{interest?.name || interestId}</span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">No has añadido intereses todavía</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar con preferencias y configuración */}
          <div className="space-y-6">
            {/* Preferencias */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-200">Preferencias de búsqueda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Rango de edad</span>
                    <span className="text-rose-400 font-medium">
                      {user.preferences?.ageRange?.min || 18} - {user.preferences?.ageRange?.max || 50} años
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Distancia máxima</span>
                    <span className="text-rose-400 font-medium">{user.preferences?.distance || 50} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Visibilidad</span>
                    <span className={`font-medium ${user.preferences?.showMe ? "text-green-400" : "text-red-400"}`}>
                      {user.preferences?.showMe ? "Visible" : "Oculto"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-200">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 hover:bg-gray-800/70"
                  onClick={() => navigate("/matches")}
                >
                  <Heart className="h-4 w-4 mr-2 text-rose-400" />
                  Ver mis matches
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 hover:bg-gray-800/70"
                  onClick={() => navigate("/discover")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                  Descubrir personas
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 hover:bg-gray-800/70"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2 text-gray-400" />
                  Cerrar sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de galería completa */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Galería de fotos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
            {user.photos.map((photo, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden aspect-square"
                onClick={() => {
                  setCurrentImageIndex(index)
                  setGalleryOpen(false)
                }}
              >
                <img src={photo || "/placeholder.svg"} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                {index === (user.mainPhotoIndex || 0) && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                      <Crown className="h-3 w-3 mr-1" />
                      Principal
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de subida de foto mejorado */}
      <Dialog open={photoUploadOpen} onOpenChange={setPhotoUploadOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Subir nueva foto</DialogTitle>
            <DialogDescription className="text-gray-400">
              Sube una nueva foto para tu perfil. Asegúrate de que sea clara y represente tu imagen personal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Vista previa"
                  className="w-full h-[300px] object-cover rounded-xl"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={() => {
                    setPhotoPreview(null)
                    setPhotoFile(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] border-2 border-dashed border-gray-600 rounded-xl overflow-hidden">
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-800/50 transition-colors duration-300">
                  <Camera className="h-12 w-12 text-gray-500 mb-3" />
                  <span className="text-gray-400 font-medium">Haz clic para seleccionar una imagen</span>
                  <span className="text-gray-500 text-sm mt-1">o arrastra y suelta aquí</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPhotoUploadOpen(false)
                setPhotoPreview(null)
                setPhotoFile(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
              onClick={savePhoto}
              disabled={!photoFile}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir foto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar foto */}
      <Dialog open={photoToDelete !== null} onOpenChange={() => setPhotoToDelete(null)}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar esta foto?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Esta acción no se puede deshacer. La foto será eliminada permanentemente de tu perfil.
            </DialogDescription>
          </DialogHeader>

          {photoToDelete !== null && (
            <div className="py-4">
              <img
                src={user.photos[photoToDelete] || "/placeholder.svg"}
                alt="Foto a eliminar"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (photoToDelete !== null) {
                  deletePhoto(photoToDelete)
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de configuración (mantenido igual) */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Configuración</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajusta las preferencias de tu cuenta y perfil
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preferences" className="w-full">
            <TabsList className="grid grid-cols-2 bg-gray-800/70">
              <TabsTrigger value="preferences">Preferencias</TabsTrigger>
              <TabsTrigger value="account">Cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rango de edad</Label>
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      value={editedUser.preferences?.ageRange?.min || 18}
                      onChange={(e) =>
                        handlePreferencesChange("ageRange", {
                          ...(editedUser.preferences?.ageRange || {}),
                          min: Number.parseInt(e.target.value),
                        })
                      }
                      min={18}
                      max={(editedUser.preferences?.ageRange?.max || 50) - 1}
                      className="w-20 bg-gray-800/50 border-gray-700"
                    />
                    <span className="mx-2">-</span>
                    <Input
                      type="number"
                      value={editedUser.preferences?.ageRange?.max || 50}
                      onChange={(e) =>
                        handlePreferencesChange("ageRange", {
                          ...(editedUser.preferences?.ageRange || {}),
                          max: Number.parseInt(e.target.value),
                        })
                      }
                      min={(editedUser.preferences?.ageRange?.min || 18) + 1}
                      max={99}
                      className="w-20 bg-gray-800/50 border-gray-700"
                    />
                    <span className="ml-2">años</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Distancia máxima</Label>
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      value={editedUser.preferences?.distance || 50}
                      onChange={(e) => handlePreferencesChange("distance", Number.parseInt(e.target.value))}
                      min={1}
                      max={500}
                      className="w-20 bg-gray-800/50 border-gray-700"
                    />
                    <span className="ml-2">km</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="visibility">Mostrar mi perfil</Label>
                    <p className="text-sm text-gray-400">Permite que otros usuarios te descubran</p>
                  </div>
                  <Switch
                    id="visibility"
                    checked={editedUser.preferences?.showMe !== false}
                    onCheckedChange={(checked) => handlePreferencesChange("showMe", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationSettings">Notificaciones</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-gray-800/50 border-gray-700">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="all">Todas las notificaciones</SelectItem>
                      <SelectItem value="matches">Solo matches</SelectItem>
                      <SelectItem value="messages">Solo mensajes</SelectItem>
                      <SelectItem value="none">Ninguna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Correo electrónico</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={user.email}
                      className="bg-gray-800/50 border-gray-700 focus:border-rose-500"
                    />
                    <Button variant="outline" className="shrink-0 bg-gray-800/70 hover:bg-gray-700/70">
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contraseña</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      readOnly
                      value="••••••••"
                      className="bg-gray-800/50 border-gray-700 focus:border-rose-500"
                    />
                    <Button variant="outline" className="shrink-0 bg-gray-800/70 hover:bg-gray-700/70">
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <Button
                    variant="destructive"
                    className="w-full bg-red-900/70 hover:bg-red-900"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    Eliminar cuenta
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar cuenta */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos tus datos.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4">
            <p className="text-sm text-red-400 mb-4">
              Al eliminar tu cuenta, perderás todos tus matches, mensajes e información del perfil.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="sm:flex-1" onClick={handleDeleteAccount}>
              Eliminar cuenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
