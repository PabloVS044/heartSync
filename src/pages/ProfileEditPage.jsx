"use client"

import { useState, useEffect, useRef } from "react"
import {
  User,
  Camera,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Heart,
  Plus,
  X,
  Edit,
  Save,
  Music,
  Film,
  Book,
  Coffee,
  Plane,
  Palette,
  Mic,
  Utensils,
  Wine,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smile,
  Headphones,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toasts"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import Navbar from "@/components/navbar"

const AVAILABLE_INTERESTS = [
  { id: "viajes", name: "Viajes", icon: <Plane className="h-4 w-4" />, emoji: "✈️" },
  { id: "música", name: "Música", icon: <Music className="h-4 w-4" />, emoji: "🎶" },
  { id: "cine", name: "Cine", icon: <Film className="h-4 w-4" />, emoji: "🎥" },
  { id: "lectura", name: "Lectura", icon: <Book className="h-4 w-4" />, emoji: "📚" },
  { id: "gastronomía", name: "Gastronomía", icon: <Utensils className="h-4 w-4" />, emoji: "🍽️" },
  { id: "yoga", name: "Yoga", icon: <Dumbbell className="h-4 w-4" />, emoji: "🧘" },
  { id: "senderismo", name: "Senderismo", icon: <Dumbbell className="h-4 w-4" />, emoji: "🥾" },
  { id: "arte", name: "Arte", icon: <Palette className="h-4 w-4" />, emoji: "🎨" },
  { id: "teatro", name: "Teatro", icon: <Mic className="h-4 w-4" />, emoji: "🎭" },
  { id: "vino", name: "Vino", icon: <Wine className="h-4 w-4" />, emoji: "🍷" },
  { id: "café", name: "Café", icon: <Coffee className="h-4 w-4" />, emoji: "☕" },
  { id: "cocina", name: "Cocina", icon: <Utensils className="h-4 w-4" />, emoji: "👨‍🍳" },
]

const MOOD_OPTIONS = [
  { id: "happy", name: "Feliz", icon: "😊" },
  { id: "adventurous", name: "Aventurero", icon: "🌍" },
  { id: "relaxed", name: "Relajado", icon: "😌" },
]

export default function ProfileEditPage() {
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(null)
  const [interestDialogOpen, setInterestDialogOpen] = useState(false)
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mood, setMood] = useState("happy")
  const [spotifyTrack, setSpotifyTrack] = useState("")
  const [profilePoints, setProfilePoints] = useState(0)
  const [livePreview, setLivePreview] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("No authentication token found")
        }
        const decoded = jwtDecode(token)
        const userId = decoded.userId

        const response = await axios.get(`https://heartsync-backend-xoba.onrender.com/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const fetchedUser = {
          id: response.data.id,
          firstName: response.data.name || "",
          lastName: response.data.surname || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          age: response.data.age || "",
          gender: response.data.gender || "",
          location: response.data.country || "",
          bio: response.data.bio || "",
          occupation: response.data.occupation || "",
          education: response.data.education || "",
          photos: response.data.photos?.length ? response.data.photos : ["/placeholder.svg"],
          interests: response.data.interests || [],
          preferences: {
            ageRange: [
              response.data.minAgePreference || 18,
              response.data.maxAgePreference || 70,
            ],
            distance: response.data.distance || 50,
            lookingFor: response.data.lookingFor || "relationship",
            showMe: response.data.showMe || "local",
          },
          privacy: {
            showOnlineStatus: response.data.showOnlineStatus ?? true,
            showLastActive: response.data.showLastActive ?? true,
            showDistance: response.data.showDistance ?? true,
            profileVisibility: response.data.profileVisibility || "public",
          },
          mood: response.data.mood || "happy",
          spotifyTrack: response.data.spotifyTrack || "",
        }

        setUserData(fetchedUser)
        setEditedData(fetchedUser)
        setMood(fetchedUser.mood)
        setSpotifyTrack(fetchedUser.spotifyTrack)
        if (!fetchedUser.age || !fetchedUser.location || !fetchedUser.gender) {
          setIsEditing(true)
        }
        calculateProfilePoints(fetchedUser)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        toast({
          title: "Error",
          description: error.message || "Failed to fetch user data",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [toast])

  const calculateProfilePoints = (data) => {
    let points = 0
    if (data.photos.length > 1) points += 20
    if (data.bio) points += 30
    if (data.interests.length > 0) points += 10 * data.interests.length
    if (data.mood) points += 10
    if (data.spotifyTrack) points += 20
    setProfilePoints(points)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
    calculateProfilePoints({ ...editedData, [name]: value })
  }

  const handleNestedInputChange = (category, name, value) => {
    setEditedData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }))
    calculateProfilePoints({ ...editedData, [category]: { ...editedData[category], [name]: value } })
  }

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }
      const decoded = jwtDecode(token)
      const userId = decoded.userId

      const updateData = {
        age: editedData.age || null,
        country: editedData.location || null,
        gender: editedData.gender || null,
        interests: editedData.interests || [],
        photos: editedData.photos || [],
        bio: editedData.bio || "",
        minAgePreference: editedData.preferences.ageRange[0] || 18,
        maxAgePreference: editedData.preferences.ageRange[1] || 70,
        internationalMode: editedData.privacy.profileVisibility === "public",
        mood: mood,
        spotifyTrack: spotifyTrack,
      }

      const response = await axios.put(`https://heartsync-backend-xoba.onrender.com/users/${userId}/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUserData({
        ...editedData,
        id: response.data.id,
        firstName: response.data.name || "",
        lastName: response.data.surname || "",
        email: response.data.email || "",
        mood: response.data.mood || "happy",
        spotifyTrack: response.data.spotifyTrack || "",
      })
      setIsEditing(false)

      toast({
        title: "Cambios guardados",
        description: "Tu perfil ha sido actualizado correctamente.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleAddInterest = (interestId) => {
    if (!editedData.interests.includes(interestId)) {
      setEditedData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestId],
      }))
      calculateProfilePoints({ ...editedData, interests: [...editedData.interests, interestId] })
    }
  }

  const handleRemoveInterest = (interestId) => {
    setEditedData((prev) => ({
      ...prev,
      interests: prev.interests.filter((id) => id !== interestId),
    }))
    calculateProfilePoints({ ...editedData, interests: editedData.interests.filter((id) => id !== interestId) })
  }

  const handlePhotoUpload = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newPhotoUrl = URL.createObjectURL(files[0])

      setEditedData((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl],
      }))
      calculateProfilePoints({ ...editedData, photos: [...editedData.photos, newPhotoUrl] })

      toast({
        title: "Foto añadida",
        description: "Tu nueva foto ha sido añadida a tu perfil.",
        variant: "success",
      })
    }
  }

  const handleRemovePhoto = (index) => {
    if (editedData.photos.length > 1) {
      setEditedData((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }))
      calculateProfilePoints({ ...editedData, photos: editedData.photos.filter((_, i) => i !== index) })

      toast({
        description: "Foto eliminada de tu perfil.",
      })
    } else {
      toast({
        title: "Error",
        description: "Debes mantener al menos una foto en tu perfil.",
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDraggingPhoto(true)
  }

  const handleDragLeave = () => {
    setIsDraggingPhoto(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDraggingPhoto(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const newPhotoUrl = URL.createObjectURL(files[0])

      setEditedData((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl],
      }))
      calculateProfilePoints({ ...editedData, photos: [...editedData.photos, newPhotoUrl] })

      toast({
        title: "Foto añadida",
        description: "Tu nueva foto ha sido añadida a tu perfil.",
        variant: "success",
      })
    }
  }

  const openPhotoPreview = (index) => {
    setSelectedPhotoIndex(index)
    setPhotoPreviewOpen(true)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">Cargando...</div>
  }

  if (!userData || !editedData) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">Error al cargar los datos del usuario</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setLivePreview(!livePreview)}
              className="border-gray-700 hover:bg-gray-800"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {livePreview ? "Desactivar Vista Previa" : "Activar Vista Previa"}
            </Button>
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedData(userData)
                    setIsEditing(false)
                  }}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSaveChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar cambios
                </Button>
              </>
            ) : (
              <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar perfil
              </Button>
            )}
          </div>
        </div>

        {/* Sección de puntos de perfil */}
        <Card className="mb-6 bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Puntos de Perfil</h3>
              <p className="text-sm text-gray-400">Completa tu perfil para ganar más puntos: {profilePoints}/100</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-600 to-purple-600 flex items-center justify-center text-xl font-bold">
              {profilePoints}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-gray-800 bg-gray-900/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-rose-500" />
                  Fotos
                </CardTitle>
                <CardDescription>Gestiona las fotos de tu perfil</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <motion.div
                    className="relative"
                    style={{ perspective: 1000 }}
                  >
                    <motion.div
                      style={{ rotateY: selectedPhotoIndex * -10 }}
                      className="relative"
                    >
                      <Avatar
                        className="w-32 h-32 mx-auto border-4 border-rose-600 cursor-pointer"
                        onClick={() => openPhotoPreview(0)}
                      >
                        <AvatarImage src={editedData.photos[0] || "/placeholder.svg"} alt="Foto de perfil" />
                        <AvatarFallback>{editedData.firstName ? editedData.firstName.charAt(0) : "U"}</AvatarFallback>
                      </Avatar>
                    </motion.div>

                    {isEditing && (
                      <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/3">
                        <Button
                          size="icon"
                          className="rounded-full bg-rose-600 hover:bg-rose-700 h-8 w-8"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </div>
                    )}
                  </motion.div>

                  <div className="relative flex overflow-x-auto space-x-4 p-2">
                    {editedData.photos.map((photo, index) => (
                      <motion.div
                        key={index}
                        style={{ rotateY: index * -5 }}
                        className="relative group shrink-0 w-20 h-20"
                      >
                        <div
                          className="aspect-square rounded-md overflow-hidden cursor-pointer"
                          onClick={() => openPhotoPreview(index)}
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {isEditing && (
                          <button
                            className="absolute top-1 right-1 bg-red-500