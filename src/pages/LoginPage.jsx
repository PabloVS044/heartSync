"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Heart, Mail, Lock, Eye, EyeOff, Facebook } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import axios from "axios"
import Swal from "sweetalert2"
import "animate.css"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Verificar si viene de un registro exitoso
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setEmail(location.state.email || "")

      // Mostrar mensaje de bienvenida
      Swal.fire({
        title: "¡Bienvenido/a a HeartSync!",
        text: "Tu cuenta ha sido creada exitosamente. Inicia sesión para comenzar.",
        icon: "success",
        confirmButtonText: "Continuar",
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
      })
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    setIsLoading(true)

    try {
      // Make POST request to login endpoint
      const response = await axios.post("http://localhost:3000/users/login", {
        email,
        password,
      })

      // Extract token and userId from response
      const { token, userId } = response.data

      // Store token and userId in localStorage
      localStorage.setItem("authToken", token)
      localStorage.setItem("userId", userId)

      // Clear error
      setError("")

      // Mostrar SweetAlert de inicio de sesión exitoso
      await Swal.fire({
        title: "¡Inicio de sesión exitoso!",
        text: "Bienvenido/a de nuevo a HeartSync",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#1f2937",
        color: "#ffffff",
        iconColor: "#f43f5e",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      })

      // Navegar a la página de descubrimiento
      navigate("/descubrir")
    } catch (error) {
      // Handle backend errors (e.g., "User not found", "Incorrect password")
      const errorMessage = error.response?.data?.error || "Error al iniciar sesión. Inténtalo de nuevo."
      setError(errorMessage)

      // Mostrar SweetAlert de error
      Swal.fire({
        title: "Error de inicio de sesión",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#f43f5e",
        background: "#1f2937",
        color: "#ffffff",
        iconColor: "#f43f5e",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      // Simulación de inicio de sesión con redes sociales
      setIsLoading(true)

      // Esperar un poco para simular la carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mostrar SweetAlert de inicio de sesión exitoso
      await Swal.fire({
        title: `Iniciando sesión con ${provider}`,
        text: "Conectando con tu cuenta...",
        icon: "info",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#1f2937",
        color: "#ffffff",
        iconColor: "#f43f5e",
      })

      // Navegar a la página de descubrimiento
      navigate("/descubrir")
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error)

      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo iniciar sesión con ${provider}. Inténtalo de nuevo.`,
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#f43f5e",
        background: "#1f2937",
        color: "#ffffff",
        iconColor: "#f43f5e",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-rose-950 text-white flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,0.1),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,0.05),transparent_50%)] pointer-events-none"></div>

      <header className="p-4 relative z-10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="font-semibold text-xl">HeartSync</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <Card className="w-full max-w-sm bg-gray-900/40 backdrop-blur-sm border-gray-800 shadow-2xl">
          <CardHeader className="space-y-1 pb-4 border-b border-gray-800">
            <CardTitle className="text-xl font-semibold text-center">Inicia Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => handleSocialLogin("Google")}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.34-.98 2.48-2.07 3.24v2.7h3.36c1.97-1.81 3.11-4.48 3.11-7.7z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23.5c2.97 0 5.46-1.01 7.28-2.74l-3.36-2.7c-1.01.68-2.3 1.08-3.92 1.08-3.01 0-5.56-2.03-6.47-4.76H2.07v2.99C3.88 20.76 7.67 23.5 12 23.5z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.53 14.24c-.23-.69-.36-1.43-.36-2.24s.13-1.55.36-2.24V6.77H2.07C1.39 8.09 1 9.62 1 11.5s.39 3.41 1.07 4.73l3.46-2.99z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.42c1.64 0 3.11.56 4.27 1.66l3.2-3.2C17.46 2.11 14.97 1 12 1 7.67 1 3.88 3.74 2.07 7.23l3.46 2.99c.91-2.73 3.46-4.8 6.47-4.8z"
                    fill="#EA4335"
                  />
                </svg>
                Continua con Google
              </Button>
              <Button
                onClick={() => handleSocialLogin("Facebook")}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Continua con Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-900 text-gray-500">o</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-500/20 text-rose-300 px-3 py-2 rounded text-sm text-center">{error}</div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo Electrónico"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="text-center text-sm space-y-2 pt-2">
              <Link to="/recuperar-contrasena" className="text-rose-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
              <div>
                <span className="text-gray-500">¿No tienes una cuenta? </span>
                <Link to="/registro" className="text-rose-400 hover:underline">
                  Regístrate
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Estilos para SweetAlert2 */}
      <style jsx global>{`
        .swal2-popup {
          border-radius: 1rem;
        }
        
        .swal2-title {
          font-weight: 600;
        }
        
        .swal2-confirm {
          font-weight: 500 !important;
          border-radius: 0.375rem !important;
        }
        
        .swal2-icon {
          border-color: #f43f5e !important;
        }
        
        .swal2-timer-progress-bar {
          background: rgba(244, 63, 94, 0.5) !important;
        }
      `}</style>
    </div>
  )
}
