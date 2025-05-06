"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Heart, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Calendar, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

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
  { code: "US", name: "Estados Unidos" },
  { code: "CA", name: "Canadá" },
  { code: "GU", name: "Guatemala" },

].sort((a, b) => a.name.localeCompare(b.name))

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    country: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  // Calcular progreso del formulario
  const calculateProgress = () => {
    const fields = Object.entries(formData).filter(([key]) => key !== "confirmPassword")
    const filledFields = fields.filter(([_, value]) => value !== "").length
    return Math.round((filledFields / fields.length) * 100)
  }

  // Actualizar progreso cuando cambia el formulario
  const updateProgress = () => {
    // Calcular el progreso actual
    const progress = calculateProgress()

    // Animar la barra de progreso
    const interval = setInterval(() => {
      setFormProgress((prev) => {
        if (prev < progress) {
          return prev + 1
        } else {
          clearInterval(interval)
          return progress
        }
      })
    }, 20)

    return () => clearInterval(interval)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error específico cuando el usuario corrige el campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Actualizar barra de progreso con un pequeño retraso
    setTimeout(() => {
      const progress = calculateProgress()
      // Animar la barra de progreso
      const interval = setInterval(() => {
        setFormProgress((prev) => {
          if (prev < progress) {
            return prev + 1
          } else {
            clearInterval(interval)
            return progress
          }
        })
      }, 20)
    }, 100)
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error específico
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Actualizar barra de progreso con un pequeño retraso
    setTimeout(() => {
      const progress = calculateProgress()
      // Animar la barra de progreso
      const interval = setInterval(() => {
        setFormProgress((prev) => {
          if (prev < progress) {
            return prev + 1
          } else {
            clearInterval(interval)
            return progress
          }
        })
      }, 20)
    }, 100)
  }

  const validateStep1 = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio"
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio"
    }

    // Validar email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un email válido"
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio"
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Formato de teléfono inválido"
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    // Validar género
    if (!formData.gender) {
      newErrors.gender = "Selecciona tu género"
    }

    // Validar edad
    if (!formData.age) {
      newErrors.age = "Selecciona tu edad"
    }

    // Validar país
    if (!formData.country) {
      newErrors.country = "Selecciona tu país"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (currentStep === 1) {
      handleNextStep()
      return
    }

    if (validateStep2()) {
      setIsSubmitting(true)

      try {
        // Simulación de envío de datos al servidor
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Preparar datos para enviar (sin confirmPassword)
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password, // En producción, la contraseña se hashearía en el backend
          gender: formData.gender,
          age: Number.parseInt(formData.age),
          country: formData.country,
          role: "user",
          createdAt: new Date().toISOString(),
        }

        console.log("Usuario registrado:", userData)

        // Redireccionar al usuario
        navigate("/login", {
          state: {
            registrationSuccess: true,
            email: formData.email,
          },
        })
      } catch (error) {
        console.error("Error al registrar:", error)
        setErrors({ submit: "Ocurrió un error al registrar. Inténtalo de nuevo." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Determinar si un campo tiene error
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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 hidden md:block">
            <div className="sticky top-24">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl blur-xl opacity-30"></div>
                <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Únete a HeartSync</h2>
                  <p className="text-gray-300 mb-6">
                    Crea tu perfil y comienza a conectar con personas afines a ti. Estás a solo unos pasos de encontrar
                    relaciones significativas.
                  </p>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-rose-600" : "bg-gray-700"} mr-3`}
                      >
                        {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : <span>1</span>}
                      </div>
                      <div>
                        <h3 className="font-medium">Información básica</h3>
                        <p className="text-sm text-gray-400">Tus datos personales y credenciales</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-rose-600" : "bg-gray-700"} mr-3`}
                      >
                        <span>2</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Detalles personales</h3>
                        <p className="text-sm text-gray-400">Género, edad y ubicación</p>
                      </div>
                    </div>

                    <div className="flex items-start opacity-50">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 mr-3">
                        <span>3</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Personaliza tu perfil</h3>
                        <p className="text-sm text-gray-400">Fotos e intereses (después del registro)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Tu progreso
                      </h4>
                      <Progress value={formProgress} className="h-2 mb-2" />
                      <p className="text-xs text-gray-400">{formProgress}% completado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Card className="border-gray-800 bg-gray-900/50 shadow-xl">
              {/* Añadir barra de progreso animada en la parte superior */}
              <div className="h-1 bg-gray-800 w-full">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-500 ease-out"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {currentStep === 1 ? "Información Personal" : "Detalles Adicionales"}
                  </CardTitle>
                  <span className="text-sm text-gray-400">Paso {currentStep} de 2</span>
                </div>
                <CardDescription>
                  {currentStep === 1
                    ? "Ingresa tus datos básicos para crear tu cuenta"
                    : "Completa tu perfil con algunos detalles adicionales"}
                </CardDescription>

                {/* Barra de progreso móvil (visible solo en móvil) */}
                <div className="md:hidden mt-2">
                  <Progress value={formProgress} className="h-1" />
                </div>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {errors.submit && (
                    <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300">
                      <AlertDescription>{errors.submit}</AlertDescription>
                    </Alert>
                  )}

                  {currentStep === 1 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className={hasError("firstName") ? "text-red-400" : ""}>
                            Nombre
                            <span className="text-rose-500 ml-1">*</span>
                          </Label>
                          <div className="relative">
                            <User
                              className={`absolute left-3 top-3 h-4 w-4 ${hasError("firstName") ? "text-red-400" : "text-gray-400"}`}
                            />
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="Tu nombre"
                              className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                                hasError("firstName") ? "border-red-400 focus-visible:ring-red-400" : ""
                              }`}
                            />
                          </div>
                          {hasError("firstName") && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className={hasError("lastName") ? "text-red-400" : ""}>
                            Apellido
                            <span className="text-rose-500 ml-1">*</span>
                          </Label>
                          <div className="relative">
                            <User
                              className={`absolute left-3 top-3 h-4 w-4 ${hasError("lastName") ? "text-red-400" : "text-gray-400"}`}
                            />
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Tu apellido"
                              className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                                hasError("lastName") ? "border-red-400 focus-visible:ring-red-400" : ""
                              }`}
                            />
                          </div>
                          {hasError("lastName") && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
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

                      <div className="space-y-2">
                        <Label htmlFor="phone" className={hasError("phone") ? "text-red-400" : ""}>
                          Teléfono
                          <span className="text-rose-500 ml-1">*</span>
                        </Label>
                        <div className="relative">
                          <Phone
                            className={`absolute left-3 top-3 h-4 w-4 ${hasError("phone") ? "text-red-400" : "text-gray-400"}`}
                          />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+34 600 000 000"
                            className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 ${
                              hasError("phone") ? "border-red-400 focus-visible:ring-red-400" : ""
                            }`}
                          />
                        </div>
                        {hasError("phone") && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      <Separator className="my-4 bg-gray-800" />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className={hasError("password") ? "text-red-400" : ""}>
                            Contraseña
                            <span className="text-rose-500 ml-1">*</span>
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs text-gray-400 cursor-help">¿Qué debe incluir?</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mínimo 8 caracteres</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <Lock
                            className={`absolute left-3 top-3 h-4 w-4 ${hasError("password") ? "text-red-400" : "text-gray-400"}`}
                          />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
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
                            className={`absolute left-3 top-3 h-4 w-4 ${hasError("confirmPassword") ? "text-red-400" : "text-gray-400"}`}
                          />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="********"
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
                        {hasError("confirmPassword") && (
                          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="gender" className={hasError("gender") ? "text-red-400" : ""}>
                            Género
                            <span className="text-rose-500 ml-1">*</span>
                          </Label>
                          <RadioGroup
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onValueChange={(value) => handleSelectChange("gender", value)}
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
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="non-binary" id="non-binary" />
                              <Label htmlFor="non-binary">No binario</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Otro</Label>
                            </div>
                          </RadioGroup>
                          {hasError("gender") && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                        </div>

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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country" className={hasError("country") ? "text-red-400" : ""}>
                          País
                          <span className="text-rose-500 ml-1">*</span>
                        </Label>
                        <div className="relative">
                          <MapPin
                            className={`absolute left-3 top-3 h-4 w-4 ${hasError("country") ? "text-red-400" : "text-gray-400"}`}
                          />
                          <Select
                            value={formData.country}
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

                      <Alert className="bg-blue-900/20 border-blue-900 text-blue-300 mt-6">
                        <AlertDescription className="text-sm">
                          Las fotos e intereses se configurarán después del registro en tu perfil personal.
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between border-t border-gray-800 bg-gray-900/30 p-6">
                  {currentStep === 1 ? (
                    <>
                      <Button type="button" variant="outline" asChild className="border-gray-700 hover:bg-gray-800">
                        <Link to="/">Cancelar</Link>
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Registrando..." : "Completar Registro"}
                      </Button>
                    </>
                  )}
                </CardFooter>
              </form>
            </Card>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-400">¿Ya tienes una cuenta? </span>
              <Link to="/login" className="text-sm text-rose-400 hover:underline">
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
