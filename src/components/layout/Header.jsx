"use client"

import { Heart, Search, Bell, Menu, MessageSquare, User, Compass } from "lucide-react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Header({ isLoggedIn = false, onLoginClick }) {
  const location = useLocation()
  const isLandingPage = location.pathname === "/"

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b border-gray-800 bg-black/95 backdrop-blur-sm text-white">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-md flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="ml-2 font-bold text-xl">HeartSync</span>
        </div>
      </Link>

      {isLandingPage && !isLoggedIn && (
        <div className="flex gap-4">
          <Button onClick={onLoginClick} variant="outline" size="sm">
            Iniciar Sesión
          </Button>
          <Button as={Link} to="/registro" variant="rose" size="sm">
            Registrarse
          </Button>
        </div>
      )}

      {isLoggedIn && (
        <>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/inicio"
              className={`text-sm font-medium hover:text-rose-400 transition-colors flex items-center gap-1 ${
                location.pathname === "/inicio" ? "text-rose-400" : "text-gray-300"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </Link>
            <Link
              to="/descubrir"
              className={`text-sm font-medium hover:text-rose-400 transition-colors flex items-center gap-1 ${
                location.pathname === "/descubrir" ? "text-rose-400" : "text-gray-300"
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Descubrir</span>
            </Link>
            <Link
              to="/matches"
              className={`text-sm font-medium hover:text-rose-400 transition-colors flex items-center gap-1 ${
                location.pathname === "/matches" ? "text-rose-400" : "text-gray-300"
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Matches</span>
            </Link>
            <Link
              to="/mensajes"
              className={`text-sm font-medium hover:text-rose-400 transition-colors flex items-center gap-1 ${
                location.pathname === "/mensajes" ? "text-rose-400" : "text-gray-300"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Mensajes</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 border-2 border-rose-500">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Profile" />
              <AvatarFallback className="bg-rose-900 text-rose-100">HS</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full text-gray-400 hover:text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </header>
  )
}
