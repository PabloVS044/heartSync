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
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toasts"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import Navbar from "@/components/navbar"

const AVAILABLE_INTERESTS = [
  { id: "viajes", name: "Viajes", icon: <Plane className="h-4 w-4" /> },
  { id: "música", name: "Música", icon: <Music className="h-4 w-4" /> },
  { id: "cine", name: "Cine", icon: <Film className="h-4 w-4" /> },
  { id: "lectura", name: "Lectura", icon: <Book className="h-4 w-4" /> },
  { id: "gastronomía", name: "Gastronomía", icon: <Utensils className="h-4 w-4" /> },
  { id: "yoga", name: "Yoga", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "senderismo", name: "Senderismo", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "arte", name: "Arte", icon: <Palette className="h-4 w-4" /> },
  { id: "teatro", name: "Teatro", icon: <Mic className="h-4 w-4" /> },
  { id: "vino", name: "Vino", icon: <Wine className="h-4 w-4" /> },
  { id: "café", name: "Café", icon: <Coffee className="h-4 w-4" /> },
  { id: "cocina", name: "Cocina", icon: <Utensils className="h-4 w-4" /> },
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
        }

        setUserData(fetchedUser)
        setEditedData(fetchedUser)
        if (!fetchedUser.age || !fetchedUser.location || !fetchedUser.gender) {
          setIsEditing(true)
        }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNestedInputChange = (category, name, value) => {
    setEditedData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }))
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
    }
  }

  const handleRemoveInterest = (interestId) => {
    setEditedData((prev) => ({
      ...prev,
      interests: prev.interests.filter((id) => id !== interestId),
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newPhotoUrl = URL.createObjectURL(files[0])

      setEditedData((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl],
      }))

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

          {isEditing ? (
            <div className="flex gap-2">
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
            </div>
          ) : (
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar perfil
            </Button>
          )}
        </div>

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
                  <div className="relative">
                    <Avatar
                      className="w-32 h-32 mx-auto border-4 border-rose-600 cursor-pointer"
                      onClick={() => openPhotoPreview(0)}
                    >
                      <AvatarImage src={editedData.photos[0] || "/placeholder.svg"} alt="Foto de perfil" />
                      <AvatarFallback>{editedData.firstName ? editedData.firstName.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>

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
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {editedData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
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
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}

                    {isEditing && editedData.photos.length < 6 && (
                      <div
                        className={`aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
                          isDraggingPhoto
                            ? "border-rose-500 bg-rose-500/10"
                            : "border-gray-700 hover:border-rose-500 hover:bg-gray-800/50"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Arrastra y suelta fotos o haz clic para añadir. Máximo 6 fotos.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50 shadow-xl mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-rose-500" />
                  Intereses
                </CardTitle>
                <CardDescription>Tus pasiones y aficiones</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {editedData.interests.map((interestId) => {
                    const interest = AVAILABLE_INTERESTS.find((i) => i.id === interestId)
                    return (
                      <Badge
                        key={interestId}
                        className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 flex items-center gap-1 pl-2 pr-1 py-1"
                      >
                        {interest?.icon}
                        {interest?.name || interestId}
                        {isEditing && (
                          <button
                            className="ml-1 hover:bg-rose-500/20 rounded-full p-0.5"
                            onClick={() => handleRemoveInterest(interestId)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    )
                  })}

                  {isEditing && (
                    <Badge
                      className="bg-gray-700 hover:bg-gray-600 cursor-pointer"
                      onClick={() => setInterestDialogOpen(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Añadir
                    </Badge>
                  )}
                </div>

                {!isEditing && editedData.interests.length === 0 && (
                  <p className="text-sm text-gray-400 text-center">No has añadido intereses todavía.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-gray-800 bg-gray-900/50 shadow-xl">
              <CardHeader>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 bg-gray-800/50">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-rose-600">
                      Información Personal
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="data-[state=active]:bg-rose-600">
                      Preferencias
                    </TabsTrigger>
                  </TabsList>

                  <CardContent>
                    <TabsContent value="personal" className="mt-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="firstName"
                                name="firstName"
                                value={editedData.firstName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="lastName"
                                name="lastName"
                                value={editedData.lastName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={editedData.email}
                                onChange={handleInputChange}
                                disabled
                                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="age">Edad</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="age"
                                name="age"
                                type="number"
                                value={editedData.age}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          <div className="space-y-2">
                            <Label htmlFor="location">Ubicación</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="location"
                                name="location"
                                value={editedData.location}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Biografía</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={editedData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 text-white min-h-[120px]"
                          />
                          {isEditing && (
                            <p className="text-xs text-gray-400">
                              Describe quién eres, qué te gusta y qué buscas. Máximo 500 caracteres.
                            </p>
                          )}
                        </div>

                        {isEditing && (
                          <div className="space-y-2">
                            <Label htmlFor="gender">Género</Label>
                            <RadioGroup
                              id="gender"
                              name="gender"
                              value={editedData.gender}
                              onValueChange={(value) => handleInputChange({ target: { name: "gender", value } })}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">Hombre</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Mujer</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="preferences" className="mt-6">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Preferencias de búsqueda</h3>

                          <div className="space-y-2">
                            <Label>Rango de edad</Label>
                            <div className="pt-6 px-2">
                              <Slider
                                value={editedData.preferences.ageRange}
                                min={18}
                                max={70}
                                step={1}
                                onValueChange={(value) => handleNestedInputChange("preferences", "ageRange", value)}
                                disabled={!isEditing}
                                className="mb-6"
                              />
                              <div className="flex justify-between text-sm text-gray-400">
                                <span>{editedData.preferences.ageRange[0]} años</span>
                                <span>{editedData.preferences.ageRange[1]} años</span>
                              </div>
                            </div>
                          </div>


                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            

                            <div className="space-y-2">
                              <Label htmlFor="showMe">Modo de búsqueda</Label>
                              <Select
                                value={editedData.preferences.showMe}
                                onValueChange={(value) => handleNestedInputChange("preferences", "showMe", value)}
                                disabled={!isEditing}
                              >
                                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 text-white border-gray-700">
                                  <SelectItem value="internacional">Modo Internacional</SelectItem>
                                  <SelectItem value="local">Modo Local</SelectItem>

                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                  </CardContent>
                </Tabs>
              </CardHeader>

              {isEditing && (
                <CardFooter className="border-t border-gray-800 bg-gray-900/30 p-6">
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full" onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar cambios
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={interestDialogOpen} onOpenChange={setInterestDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Añadir intereses</DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecciona tus intereses para encontrar mejores coincidencias
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
            {AVAILABLE_INTERESTS.map((interest) => {
              const isSelected = editedData.interests.includes(interest.id)
              return (
                <motion.button
                  key={interest.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                    isSelected ? "bg-rose-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => (isSelected ? handleRemoveInterest(interest.id) : handleAddInterest(interest.id))}
                >
                  {interest.icon}
                  <span>{interest.name}</span>
                </motion.button>
              )
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInterestDialogOpen(false)}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={photoPreviewOpen} onOpenChange={setPhotoPreviewOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Foto de perfil</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <img
              src={editedData.photos[selectedPhotoIndex] || "/placeholder.svg"}
              alt="Vista previa"
              className="w-full h-auto rounded-md"
            />

            {editedData.photos.length > 1 && (
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 hover:bg-black/50 rounded-full"
                  onClick={() =>
                    setSelectedPhotoIndex((prev) => (prev === 0 ? editedData.photos.length - 1 : prev - 1))
                  }
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 hover:bg-black/50 rounded-full"
                  onClick={() => setSelectedPhotoIndex((prev) => (prev + 1) % editedData.photos.length)}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-2">
            {editedData.photos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === selectedPhotoIndex ? "bg-rose-600" : "bg-gray-600"}`}
                onClick={() => setSelectedPhotoIndex(index)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}