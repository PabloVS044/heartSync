"use client"

import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  MapPin,
  Calendar,
  Plus,
  X,
  Camera,
  Info,
  Check,
  ChevronDown,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"

// Lista de países para el selector
const COUNTRIES = [
  { code: "ES", name: "España" },
  { code: "MX", name: "México" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "CL", name: "Chile" },
  { code: "PE", name: "Perú" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "GT", name: "Guatemala" },
  { code: "US", name: "Estados Unidos" },
  { code: "CA", name: "Canadá" },
].sort((a, b) => a.name.localeCompare(b.name))

// Lista de intereses disponibles
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
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    country: "",
    gender: "",
    interests: [],
    photos: [],
    bio: "",
    minAgePreference: 18,
    maxAgePreference: 40,
    internationalMode: false, // Added internationalMode
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleInternationalModeChange = (checked) => {
    setFormData((prev) => ({ ...prev, internationalMode: checked }))
    if (errors.internationalMode) {
      setErrors((prev) => ({ ...prev, internationalMode: "" }))
    }
  }

  const handleAgeRangeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      minAgePreference: value[0],
      maxAgePreference: value[1],
    }))
  }

  const handleAddInterest = (interestId) => {
    if (!formData.interests.includes(interestId)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestId],
      }))
    }
  }

  const handleRemoveInterest = (interestId) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((id) => id !== interestId),
    }))
  }

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
      const data = await response.json()
      if (data.secure_url) {
        return data.secure_url
      } else {
        throw new Error("Cloudinary upload failed")
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      throw error
    }
  }

  const handlePhotoUpload = async (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const cloudinaryUrl = await uploadToCloudinary(file)
          return cloudinaryUrl
        })
        const uploadedUrls = await Promise.all(uploadPromises)

        const newPreviews = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        )

        setPhotoPreview((prev) => [...prev, ...newPreviews])
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...uploadedUrls],
        }))

        if (errors.photos) {
          setErrors((prev) => ({ ...prev, photos: "" }))
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          photos: "Error al subir las fotos. Inténtalo de nuevo.",
        }))
      }
    }
  }

  const handleRemovePhoto = (index) => {
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDraggingPhoto(true)
  }

  const handleDragLeave = () => {
    setIsDraggingPhoto(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDraggingPhoto(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const cloudinaryUrl = await uploadToCloudinary(file)
          return cloudinaryUrl
        })
        const uploadedUrls = await Promise.all(uploadPromises)

        const newPreviews = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        )

        setPhotoPreview((prev) => [...prev, ...newPreviews])
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...uploadedUrls],
        }))

        if (errors.photos) {
          setErrors((prev) => ({ ...prev, photos: "" }))
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          photos: "Error al subir las fotos. Inténtalo de nuevo.",
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio"
    if (!formData.surname.trim())
      newErrors.surname = "El apellido es obligatorio"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un email válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!formData.age) {
      newErrors.age = "La edad es obligatoria"
    }

    if (!formData.country) {
      newErrors.country = "Selecciona tu país"
    }

    if (!formData.gender) {
      newErrors.gender = "Selecciona tu género"
    }

    if (formData.interests.length === 0) {
      newErrors.interests = "Selecciona al menos un interés"
    }

    if (formData.photos.length === 0) {
      newErrors.photos = "Sube al menos una foto"
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "La biografía es obligatoria"
    } else if (formData.bio.length < 10) {
      newErrors.bio = "La biografía debe tener al menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        const userData = {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          age: Number.parseInt(formData.age),
          country: formData.country,
          gender: formData.gender,
          interests: formData.interests,
          photos: formData.photos,
          bio: formData.bio,
          minAgePreference: formData.minAgePreference,
          maxAgePreference: formData.maxAgePreference,
          internationalMode: formData.internationalMode, // Added internationalMode
        }

        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || "Error al registrar el usuario")
        }

        navigate("/login", {
          state: {
            registrationSuccess: true,
            email: formData.email,
          },
        })
      } catch (error) {
        console.error("Error al registrar:", error)
        setErrors({
          submit: error.message || "Ocurrió un error al registrar. Inténtalo de nuevo.",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const hasError = (field) => Boolean(errors[field])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="p-4 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-md flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="ml-2 font-bold text-xl">HeartSync</span>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-gray-800 bg-gray-900/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Crear una cuenta
            </CardTitle>
            <CardDescription>
              Completa el formulario para unirte a HeartSync y encontrar
              conexiones auténticas
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {errors.submit && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-900 text-red-300"
                >
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Sección: Información personal */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-rose-500" />
                  Información personal
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className={hasError("name") ? "text-red-400" : ""}
                      >
                        Nombre
                        <span className="text-rose-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <User
                          className={`absolute left-3 top-3 h-4 w-4 ${
                            hasError("name") ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                            hasError("name")
                              ? "border-red-400 focus-visible:ring-red-400"
                              : ""
                          }`}
                        />
                      </div>
                      {hasError("name") && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="surname"
                        className={hasError("surname") ? "text-red-400" : ""}
                      >
                        Apellido
                        <span className="text-rose-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <User
                          className={`absolute left-3 top-3 h-4 w-4 ${
                            hasError("surname")
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        />
                        <Input
                          id="surname"
                          name="surname"
                          value={formData.surname}
                          onChange={handleChange}
                          placeholder="Tu apellido"
                          className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                            hasError("surname")
                              ? "border-red-400 focus-visible:ring-red-400"
                              : ""
                          }`}
                        />
                      </div>
                      {hasError("surname") && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.surname}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className={hasError("email") ? "text-red-400" : ""}
                    >
                      Correo Electrónico
                      <span className="text-rose-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-3 h-4 w-4 ${
                          hasError("email") ? "text-red-400" : "text-gray-400"
                        }`}
                      />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                          hasError("email")
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }`}
                      />
                    </div>
                    {hasError("email") && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className={
                            hasError("password") ? "text-red-400" : ""
                          }
                        >
                          Contraseña
                          <span className="text-rose-500 ml-1">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-gray-400 cursor-help">
                                ¿Qué debe incluir?
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mínimo 6 caracteres</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <Lock
                          className={`absolute left-3 top-3 h-4 w-4 ${
                            hasError("password")
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="******"
                          className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                            hasError("password")
                              ? "border-red-400 focus-visible:ring-red-400"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {hasError("password") && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className={
                          hasError("confirmPassword") ? "text-red-400" : ""
                        }
                      >
                        Confirmar Contraseña
                        <span className="text-rose-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Lock
                          className={`absolute left-3 top-3 h-4 w-4 ${
                            hasError("confirmPassword")
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="******"
                          className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                            hasError("confirmPassword")
                              ? "border-red-400 focus-visible:ring-red-400"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {hasError("confirmPassword") && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="age"
                        className={hasError("age") ? "text-red-400" : ""}
                      >
                        Edad
                        <span className="text-rose-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar
                          className={`absolute left-3 top-3 h-4 w-4 ${
                            hasError("age") ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                        <Select
                          value={formData.age}
                          onValueChange={(value) =>
                            handleSelectChange("age", value)
                          }
                        >
                          <SelectTrigger
                            className={`bg-gray-800/50 border-gray-700 text-white pl-10 ${
                              hasError("age")
                                ? "border-red-400 focus:ring-red-400"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Selecciona tu edad" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900">
                            {Array.from({ length: 83 }, (_, i) => i + 18).map(
                              (age) => (
                                <SelectItem
                                  key={age}
                                  value={age.toString()}
                                >
                                  {age} años
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      {hasError("age") && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.age}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className={hasError("country") ? "text-red-400" : ""}
                      >
                        País
                        <span className="text-rose-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin
                          className={`absolute left-3 top-3 h-4 w-4 ${
                            hasError("country")
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        />
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            handleSelectChange("country", value)
                          }
                        >
                          <SelectTrigger
                            className={`bg-gray-800/50 border-gray-700 text-white pl-10 ${
                              hasError("country")
                                ? "border-red-400 focus:ring-red-400"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Selecciona tu país" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900">
                            {COUNTRIES.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {hasError("country") && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className={hasError("gender") ? "text-red-400" : ""}
                      >
                        Género
                        <span className="text-rose-500 ml-1">*</span>
                      </Label>
                      <RadioGroup
                        id="gender"
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Mujer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Hombre</Label>
                        </div>
                      </RadioGroup>
                      {hasError("gender") && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Fotos */}
              <div>
                <h3 className="text-lg font-medium mb-4 glossy flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-rose-500" />
                  Fotos
                  <span className="text-rose-500 ml-1">*</span>
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {photoPreview.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden group"
                      >
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}

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
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />

                  <p className="text-xs text-gray-400">
                    Arrastra y suelta fotos o haz clic para añadir. La primera
                    foto será tu foto principal.
                  </p>

                  {hasError("photos") && (
                    <p className="text-red-400 text-xs">{errors.photos}</p>
                  )}
                </div>
              </div>

              {/* Sección: Intereses */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-rose-500" />
                  Intereses
                  <span className="text-rose-500 ml-1">*</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_INTERESTS.map((interest) => {
                      const isSelected = formData.interests.includes(
                        interest.id
                      )
                      return (
                        <Badge
                          key={interest.id}
                          className={`cursor-pointer ${
                            isSelected
                              ? "bg-rose-600 hover:bg-rose-700 text-white"
                              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          }`}
                          onClick={() =>
                            isSelected
                              ? handleRemoveInterest(interest.id)
                              : handleAddInterest(interest.id)
                          }
                        >
                          {isSelected ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Plus className="h-3 w-3 mr-1" />
                          )}
                          {interest.name}
                        </Badge>
                      )
                    })}
                  </div>

                  <p className="text-xs text-gray-400">
                    Selecciona los intereses que te definen. Esto nos ayudará a
                    encontrar mejores coincidencias.
                  </p>

                  {hasError("interests") && (
                    <p className="text-red-400 text-xs">{errors.interests}</p>
                  )}
                </div>
              </div>

              {/* Sección: Biografía */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-rose-500" />
                  Biografía
                  <span className="text-rose-500 ml-1">*</span>
                </h3>

                <div className="space-y-2">
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre ti, tus pasiones y qué buscas..."
                    className={`bg-gray-800/50 border-gray-700 text-white min-h-[120px] ${
                      hasError("bio")
                        ? "border-red-400 focus-visible:ring-red-400"
                        : ""
                    }`}
                  />

                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400">
                      Mínimo 10 caracteres
                    </p>
                    <p className="text-xs text-gray-400">
                      {formData.bio.length} / 500 caracteres
                    </p>
                  </div>

                  {hasError("bio") && (
                    <p className="text-red-400 text-xs">{errors.bio}</p>
                  )}
                </div>
              </div>

              {/* Sección: Preferencias */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <ChevronDown className="h-5 w-5 mr-2 text-rose-500" />
                  Preferencias
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Rango de edad que buscas</Label>
                    <div className="pt-6 px-2">
                      <Slider
                        defaultValue={[
                          formData.minAgePreference,
                          formData.maxAgePreference,
                        ]}
                        min={18}
                        max={70}
                        step={1}
                        value={[
                          formData.minAgePreference,
                          formData.maxAgePreference,
                        ]}
                        onValueChange={handleAgeRangeChange}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{formData.minAgePreference} años</span>
                        <span>{formData.maxAgePreference} años</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="internationalMode"
                        className={hasError("internationalMode") ? "text-red-400" : ""}
                      >
                        Modo Internacional
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-gray-400 cursor-help">
                              ¿Qué es esto?
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Habilita esta opción para buscar coincidencias en
                              otros países además del tuyo.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="internationalMode"
                        checked={formData.internationalMode}
                        onCheckedChange={handleInternationalModeChange}
                      />
                      <Label
                        htmlFor="internationalMode"
                        className="flex items-center text-gray-300"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {formData.internationalMode
                          ? "Buscar globalmente"
                          : "Buscar en mi país"}
                      </Label>
                    </div>
                    {hasError("internationalMode") && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.internationalMode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-gray-800 bg-gray-900/30 p-6">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-gray-700 hover:bg-gray-800"
              >
                <Link to="/">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registrando..." : "Completar Registro"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-400">
            ¿Ya tienes una cuenta?{" "}
          </span>
          <Link
            to="/login"
            className="text-sm text-rose-400 hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </main>
    </div>
  )
}