"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  ArrowRight,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Swal from "sweetalert2"

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

const AVAILABLE_INTERESTS = [
  { id: "arte", name: "Arte" },
  { id: "museos", name: "Museos" },
  { id: "historia", name: "Historia" },
  { id: "teatro", name: "Teatro" },
  { id: "cine", name: "Cine" },
  { id: "lectura", name: "Lectura" },
  { id: "poesía", name: "Poesía" },
  { id: "escritura", name: "Escritura" },
  { id: "filosofía", name: "Filosofía" },
  { id: "música", name: "Música" },
  { id: "conciertos", name: "Conciertos" },
  { id: "tocar_instrumento", name: "Tocar instrumento" },
  { id: "dj", name: "DJ" },
  { id: "karaoke", name: "Karaoke" },
  { id: "canto", name: "Canto" },
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
  { id: "meditación", name: "Meditación" },
  { id: "espiritualidad", name: "Espiritualidad" },
  { id: "alimentación_saludable", name: "Alimentación saludable" },
  { id: "vegetariano", name: "Vegetariano" },
  { id: "veganismo", name: "Veganismo" },
  { id: "mascotas", name: "Mascotas" },
  { id: "voluntariado", name: "Voluntariado" },
  { id: "tecnología", name: "Tecnología" },
  { id: "videojuegos", name: "Videojuegos" },
  { id: "inteligencia_artificial", name: "Inteligencia Artificial" },
  { id: "robótica", name: "Robótica" },
  { id: "astronomía", name: "Astronomía" },
  { id: "programación", name: "Programación" },
  { id: "gadgets", name: "Gadgets" },
  { id: "anime", name: "Anime" },
  { id: "manga", name: "Manga" },
  { id: "series", name: "Series" },
  { id: "netflix", name: "Netflix" },
  { id: "marvel", name: "Marvel" },
  { id: "starwars", name: "Star Wars" },
  { id: "cosplay", name: "Cosplay" },
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
  { id: "gastronomía", name: "Gastronomía" },
  { id: "vino", name: "Vino" },
  { id: "cerveza_artesanal", name: "Cerveza artesanal" },
  { id: "café", name: "Café" },
  { id: "cocteles", name: "Cócteles" },
  { id: "brunch", name: "Brunch" },
  { id: "viajar", name: "Viajar" },
  { id: "mochilero", name: "Mochilero" },
  { id: "idiomas", name: "Idiomas" },
  { id: "culturas", name: "Culturas del mundolattes" },
  { id: "playa", name: "Playa" },
  { id: "montaña", name: "Montaña" },
  { id: "roadtrips", name: "Roadtrips" },
  { id: "aventura", name: "Aventura" },
  { id: "ajedrez", name: "Ajedrez" },
  { id: "juegos_de_mesa", name: "Juegos de mesa" },
  { id: "póker", name: "Póker" },
  { id: "escape_rooms", name: "Escape rooms" },
  { id: "trivia", name: "Trivia" },
  { id: "autos", name: "Autos" },
  { id: "modificación_vehículos", name: "Modificación de vehículos" },
  { id: "motocicletas", name: "Motocicletas" },
  { id: "invertir", name: "Invertir" },
  { id: "negocios", name: "Negocios" },
  { id: "memes", name: "Memes" },
  { id: "redes_sociales", name: "Redes sociales" },
];

const CustomSlider = ({ value, onValueChange, min, max, step = 1 }) => {
  const [localValues, setLocalValues] = useState(value)
  const [dragIndex, setDragIndex] = useState(-1)
  const sliderRef = useRef(null)

  useEffect(() => {
    setLocalValues(value)
  }, [value])

  const calculatePosition = (val) => {
    return ((val - min) / (max - min)) * 100
  }

  const calculateValueFromPosition = (position, rect) => {
    const percentage = Math.max(0, Math.min(1, position / rect.width))
    const rawValue = min + percentage * (max - min)
    return Math.round(rawValue / step) * step
  }

  const handleMouseDown = (index) => (e) => {
    e.preventDefault()
    setDragIndex(index)
  }

  const handleMouseMove = useCallback((e) => {
    if (dragIndex === -1 || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const newValue = calculateValueFromPosition(e.clientX - rect.left, rect)
    
    setLocalValues(prev => {
      let newValues = [...prev]
      
      if (dragIndex === 0) {
        newValues[0] = Math.max(min, Math.min(newValue, newValues[1] - step))
      } else {
        newValues[1] = Math.min(max, Math.max(newValue, newValues[0] + step))
      }
      
      if (newValues[0] !== prev[0] || newValues[1] !== prev[1]) {
        onValueChange(newValues)
      }
      
      return newValues
    })
  }, [dragIndex, min, max, step, onValueChange])

  const handleMouseUp = useCallback(() => {
    setDragIndex(-1)
  }, [])

  useEffect(() => {
    if (dragIndex !== -1) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
      }
    }
  }, [dragIndex, handleMouseMove, handleMouseUp])

  const handleTrackClick = (e) => {
    if (dragIndex !== -1) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickValue = calculateValueFromPosition(e.clientX - rect.left, rect)
    
    const distanceToMin = Math.abs(clickValue - localValues[0])
    const distanceToMax = Math.abs(clickValue - localValues[1])
    
    let newValues
    if (distanceToMin < distanceToMax) {
      newValues = [Math.max(min, Math.min(clickValue, localValues[1] - step)), localValues[1]]
    } else {
      newValues = [localValues[0], Math.min(max, Math.max(clickValue, localValues[0] + step))]
    }
    
    setLocalValues(newValues)
    onValueChange(newValues)
  }

  return (
    <div className="relative h-8 mb-4">
      <div 
        ref={sliderRef}
        className="absolute top-1/2 w-full h-2 bg-gray-600 rounded-full cursor-pointer transform -translate-y-1/2"
        onClick={handleTrackClick}
      >
        <div 
          className="absolute h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-200"
          style={{
            left: `${calculatePosition(localValues[0])}%`,
            width: `${calculatePosition(localValues[1]) - calculatePosition(localValues[0])}%`
          }}
        />
      </div>
      
      <div 
        className={`absolute top-1/2 w-6 h-6 bg-white border-3 border-rose-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 shadow-lg ${
          dragIndex === 0 ? 'scale-125 cursor-grabbing shadow-xl' : ''
        }`}
        style={{ left: `${calculatePosition(localValues[0])}%` }}
        onMouseDown={handleMouseDown(0)}
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg border border-gray-700">
            Desde {localValues[0]} años
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      
      <div 
        className={`absolute top-1/2 w-6 h-6 bg-white border-3 border-rose-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 shadow-lg ${
          dragIndex === 1 ? 'scale-125 cursor-grabbing shadow-xl' : ''
        }`}
        style={{ left: `${calculatePosition(localValues[1])}%` }}
        onMouseDown={handleMouseDown(1)}
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg border border-gray-700">
            Hasta {localValues[1]} años
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
        {min}
      </div>
      <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
        {max}
      </div>
    </div>
  )
}

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
    maxAgePreference: 29,
    internationalMode: false,
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState([])
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: "personal", title: "Personal", icon: <User className="h-4 w-4" /> },
    { id: "photos", title: "Fotos", icon: <Camera className="h-4 w-4" /> },
    { id: "interests", title: "Intereses", icon: <Heart className="h-4 w-4" /> },
  ]

  const getSliderLimits = () => {
    if (formData.gender === "male") {
      return { min: 30, max: 70 }
    } else if (formData.gender === "female") {
      return { min: 18, max: 29 }
    } else {
      return { min: 18, max: 70 }
    }
  }

  useEffect(() => {
    const { min, max } = getSliderLimits()
    setFormData((prev) => {
      let newMinAge = prev.minAgePreference
      let newMaxAge = prev.maxAgePreference

      if (prev.gender === "male") {
        newMinAge = Math.max(30, prev.minAgePreference)
        newMaxAge = Math.min(70, Math.max(newMinAge + 1, prev.maxAgePreference))
      } else if (prev.gender === "female") {
        newMinAge = Math.max(18, prev.minAgePreference)
        newMaxAge = Math.min(29, Math.max(newMinAge + 1, prev.maxAgePreference))
      }

      return {
        ...prev,
        minAgePreference: newMinAge,
        maxAgePreference: newMaxAge,
      }
    })
  }, [formData.gender])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name, value) => {
    if (name === "country") {
      const selectedCountry = COUNTRIES.find((country) => country.code === value)
      setFormData((prev) => ({ ...prev, [name]: selectedCountry ? selectedCountry.name : "" }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
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
    if (errors.agePreference) {
      setErrors((prev) => ({ ...prev, agePreference: "" }))
    }
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

        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file))

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

        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file))

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

  const validateCurrentStep = () => {
    const newErrors = {}

    if (currentStep === 0) {
      if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio"
      if (!formData.surname.trim()) newErrors.surname = "El apellido es obligatorio"

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
    } else if (currentStep === 1) {
      if (formData.photos.length === 0) {
        newErrors.photos = "Sube al menos una foto"
      }
    } else if (currentStep === 2) {
      if (formData.interests.length === 0) {
        newErrors.interests = "Selecciona al menos un interés"
      }

      if (!formData.bio.trim()) {
        newErrors.bio = "La biografía es obligatoria"
      } else if (formData.bio.length < 10) {
        newErrors.bio = "La biografía debe tener al menos 10 caracteres"
      }
    } else if (currentStep === 3) {
      const { min, max } = getSliderLimits()
      if (formData.minAgePreference < min || formData.maxAgePreference > max) {
        newErrors.agePreference = `El rango de edad debe estar entre ${min} y ${max} años`
      }
      if (formData.minAgePreference >= formData.maxAgePreference) {
        newErrors.agePreference = "La edad mínima debe ser menor que la máxima"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio"
    if (!formData.surname.trim()) newErrors.surname = "El apellido es obligatorio"

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

    if (formData.photos.length === 0) {
      newErrors.photos = "Sube al menos una foto"
    }

    if (formData.interests.length === 0) {
      newErrors.interests = "Selecciona al menos un interés"
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "La biografía es obligatoria"
    } else if (formData.bio.length < 10) {
      newErrors.bio = "La biografía debe tener al menos 10 caracteres"
    }

    const { min, max } = getSliderLimits()
    if (formData.minAgePreference < min || formData.maxAgePreference > max) {
      newErrors.agePreference = `El rango de edad debe estar entre ${min} y ${max} años`
    }
    if (formData.minAgePreference >= formData.maxAgePreference) {
      newErrors.agePreference = "La edad mínima debe ser menor que la máxima"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (currentStep < steps.length - 1) {
      handleNextStep()
      return
    }

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
          internationalMode: formData.internationalMode,
        }

        const response = await fetch("https://heartsync-backend-xoba.onrender.com/users", {
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

        await Swal.fire({
          title: "¡Registro Exitoso!",
          text: `¡Bienvenido/a a HeartSync, ${formData.name}!`,
          icon: "success",
          confirmButtonText: "Iniciar Sesión",
          confirmButtonColor: "#f43f5e",
          background: "#1f2937",
          color: "#ffffff",
          iconColor: "#f43f5e",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        })

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

        await Swal.fire({
          title: "Error",
          text: error.message || "Ocurrió un error al registrar. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
          confirmButtonColor: "#f43f5e",
          background: "#1f2937",
          color: "#ffffff",
          iconColor: "#f43f5e",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const hasError = (field) => Boolean(errors[field])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={hasError("name") ? "text-red-400" : ""}>
                  Nombre
                  <span className="text-rose-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-3 h-4 w-4 ${hasError("name") ? "text-red-400" : "text-gray-400"}`}
                  />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                      hasError("name") ? "border-red-400 focus-visible:ring-red-400" : ""
                    }`}
                  />
                </div>
                {hasError("name") && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname" className={hasError("surname") ? "text-red-400" : ""}>
                  Apellido
                  <span className="text-rose-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-3 h-4 w-4 ${
                      hasError("surname") ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                  <Input
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                      hasError("surname") ? "border-red-400 focus-visible:ring-red-400" : ""
                    }`}
                  />
                </div>
                {hasError("surname") && <p className="text-red-400 text-xs mt-1">{errors.surname}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={hasError("email") ? "text-red-400" : ""}>
                Correo Electrónico
                <span className="text-rose-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-3 h-4 w-4 ${hasError("email") ? "text-red-400" : "text-gray-400"}`}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                    hasError("email") ? "border-red-400 focus-visible:ring-red-400" : ""
                  }`}
                />
              </div>
              {hasError("email") && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={hasError("password") ? "text-red-400" : ""}>
                    Contraseña
                    <span className="text-rose-500 ml-1">*</span>
                  </Label>
                </div>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-3 h-4 w-4 ${
                      hasError("password") ? "text-red-400" : "text-gray-400"
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
                      hasError("password") ? "border-red-400 focus-visible:ring-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {hasError("password") && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={hasError("confirmPassword") ? "text-red-400" : ""}>
                  Confirmar Contraseña
                  <span className="text-rose-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-3 h-4 w-4 ${
                      hasError("confirmPassword") ? "text-red-400" : "text-gray-400"
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
                      hasError("confirmPassword") ? "border-red-400 focus-visible:ring-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {hasError("confirmPassword") && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className={hasError("age") ? "text-red-400" : ""}>
                  Edad
                  <span className="text-rose-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-3 h-4 w-4 ${hasError("age") ? "text-red-400" : "text-gray-400"}`}
                  />
                  <Select value={formData.age} onValueChange={(value) => handleSelectChange("age", value)}>
                    <SelectTrigger
                      className={`bg-gray-800/50 border-gray-700 text-white pl-10 ${
                        hasError("age") ? "border-red-400 focus:ring-red-400" : ""
                      }`}
                    >
                      <SelectValue placeholder="Selecciona tu edad" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900">
                      {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age} años
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {hasError("age") && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className={hasError("country") ? "text-red-400" : ""}>
                  País
                  <span className="text-rose-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-3 top-3 h-4 w-4 ${
                      hasError("country") ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                  <Select
                    value={COUNTRIES.find((c) => c.name === formData.country)?.code || ""}
                    onValueChange={(value) => handleSelectChange("country", value)}
                  >
                    <SelectTrigger
                      className={`bg-gray-800/50 border-gray-700 text-white pl-10 ${
                        hasError("country") ? "border-red-400 focus:ring-red-400" : ""
                      }`}
                    >
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {hasError("country") && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className={hasError("gender") ? "text-red-400" : ""}>
                  Género
                  <span className="text-rose-500 ml-1">*</span>
                </Label>
                <RadioGroup
                  id="gender"
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
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
                {hasError("gender") && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {photoPreview.length > 0 ? (
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {photoPreview.map((photo, index) => (
                        <CarouselItem key={index} className="basis-full">
                          <div className="relative aspect-square rounded-xl overflow-hidden">
                            <img
                              src={photo || "/placeholder.svg"}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                              onClick={() => handleRemovePhoto(index)}
                            >
                              <X className="h-4 w-4 text-white" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                              <span className="text-white text-sm font-medium">
                                Foto {index + 1} {index === 0 && "(Principal)"}
                              </span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>

                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {photoPreview.map((photo, index) => (
                      <div
                        key={index}
                        className={`w-12 h-12 rounded-md overflow-hidden cursor-pointer border-2 ${
                          index === 0 ? "border-rose-500" : "border-transparent"
                        }`}
                        onClick={() => {}}
                      >
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Añade tus mejores fotos</h3>
                  <p className="text-gray-400 mb-4 max-w-md">
                    Las fotos que muestren claramente tu rostro tienen 50% más probabilidades de recibir matches
                  </p>
                </div>
              )}

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDraggingPhoto
                    ? "border-rose-500 bg-rose-500/10"
                    : "border-gray-700 hover:border-rose-500 hover:bg-gray-800/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-rose-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Arrastra y suelta tus fotos aquí</h3>
                <p className="text-gray-400 text-sm mb-4 text-center">
                  O haz clic para seleccionar desde tu dispositivo
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Seleccionar fotos
                </Button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />

              <div className="flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400">
                  Sube entre 2 y 6 fotos. La primera foto será tu foto principal y aparecerá primero en tu perfil.
                </p>
              </div>

              {hasError("photos") && <p className="text-red-400 text-sm">{errors.photos}</p>}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-rose-500" />
                  Intereses
                  <span className="text-rose-500 ml-1">*</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_INTERESTS.map((interest) => {
                      const isSelected = formData.interests.includes(interest.id)
                      return (
                        <Badge
                          key={interest.id}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? "bg-rose-600 hover:bg-rose-700 text-white"
                              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          }`}
                          onClick={() =>
                            isSelected ? handleRemoveInterest(interest.id) : handleAddInterest(interest.id)
                          }
                        >
                          {isSelected ? <Check className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                          {interest.name}
                        </Badge>
                      )
                    })}
                  </div>

                  <p className="text-xs text-gray-400">
                    Selecciona los intereses que te definen. Esto nos ayudará a encontrar mejores coincidencias.
                  </p>

                  {hasError("interests") && <p className="text-red-400 text-xs">{errors.interests}</p>}
                </div>
              </div>

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
                      hasError("bio") ? "border-red-400 focus-visible:ring-red-400" : ""
                    }`}
                  />

                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400">Mínimo 10 caracteres</p>
                    <p className="text-xs text-gray-400">{formData.bio.length} / 500 caracteres</p>
                  </div>

                  {hasError("bio") && <p className="text-red-400 text-xs">{errors.bio}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-rose-500" />
                  Rango de edad que buscas
                </Label>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <CustomSlider
                    value={[formData.minAgePreference, formData.maxAgePreference]}
                    onValueChange={handleAgeRangeChange}
                    min={getSliderLimits().min}
                    max={getSliderLimits().max}
                    step={1}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Selecciona el rango de edad para tus posibles coincidencias.
                </p>
                {hasError("agePreference") && <p className="text-red-400 text-sm">{errors.agePreference}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="internationalMode" className={hasError("internationalMode") ? "text-red-400" : ""}>
                    Modo Internacional
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-gray-400 cursor-help">¿Qué es esto?</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Habilita esta opción para buscar coincidencias en otros países además del tuyo.</p>
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
                  <Label htmlFor="internationalMode" className="flex items-center text-gray-300">
                    <Globe className="h-4 w-4 mr-2" />
                    {formData.internationalMode ? "Buscar globalmente" : "Buscar en mi país"}
                  </Label>
                </div>
                {hasError("internationalMode") && (
                  <p className="text-red-400 text-xs mt-1">{errors.internationalMode}</p>
                )}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,0.1),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,0.05),transparent_50%)] pointer-events-none"></div>

      <header className="p-4 flex items-center relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="ml-2 font-bold text-xl tracking-tight">HeartSync</span>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="space-y-1 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Heart className="h-5 w-5 mr-2 text-rose-500" fill="rgba(244, 63, 94, 0.2)" />
              Crear tu perfil
            </CardTitle>
            <CardDescription>Completa tu perfil para encontrar conexiones auténticas</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <div className="px-6 pt-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-medium">
                      {currentStep + 1}
                    </div>
                    <span className="font-medium">{steps[currentStep].title}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Paso {currentStep + 1} de {steps.length}
                  </div>
                </div>

                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {errors.submit && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300 mb-6">
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}
            </div>

            <CardContent className="p-6">{renderStepContent()}</CardContent>

            <CardFooter className="flex justify-between border-t border-gray-800 bg-gray-900/30 p-6">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  Anterior
                </Button>
              ) : (
                <Button type="button" variant="outline" asChild className="border-gray-700 hover:bg-gray-800">
                  <Link to="/">Cancelar</Link>
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNextStep} className="bg-rose-600 hover:bg-rose-700 text-white">
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Registrando..." : "Completar Registro"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-400">¿Ya tienes una cuenta? </span>
          <Link to="/login" className="text-sm text-rose-400 hover:text-rose-300 hover:underline transition-colors">
            Inicia sesión
          </Link>
        </div>
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
  )
}