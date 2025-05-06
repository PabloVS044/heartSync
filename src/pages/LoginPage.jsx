"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Heart, Mail, Lock, Eye, EyeOff, Facebook, Apple } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }
    console.log("Logging in with:", { email, password })
    navigate("/descubrir")
  }

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`)
    navigate("/descubrir")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-rose-950 text-white flex flex-col">
      <header className="p-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="font-semibold text-lg">HeartSync</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm bg-gray-900/40 backdrop-blur-sm border-none shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center">Inicia Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => handleSocialLogin("Google")}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
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
                <div className="bg-rose-500/20 text-rose-300 px-3 py-2 rounded text-sm text-center">
                  {error}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo Electrónico"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-rose-500 focus:border-rose-500 transition-all"
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Iniciar Sesión
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
    </div>
  )
}