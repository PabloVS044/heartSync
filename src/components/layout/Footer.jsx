import { Home, Search, Heart, MessageSquare, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function Footer() {
  const location = useLocation()

  const getActiveClass = (path) => {
    return location.pathname === path ? "text-rose-600" : "text-gray-400"
  }

  return (
    <footer className="fixed bottom-0 w-full bg-black border-t border-gray-800 py-2">
      <div className="flex justify-around items-center">
        <Link to="/inicio" className="flex flex-col items-center">
          <Home className={`h-6 w-6 ${getActiveClass("/inicio")}`} />
          <span className={`text-xs mt-1 ${getActiveClass("/inicio")}`}>Inicio</span>
        </Link>
        <Link to="/descubrir" className="flex flex-col items-center">
          <Search className={`h-6 w-6 ${getActiveClass("/descubrir")}`} />
          <span className={`text-xs mt-1 ${getActiveClass("/descubrir")}`}>Descubrir</span>
        </Link>
        <Link to="/matches" className="flex flex-col items-center">
          <Heart className={`h-6 w-6 ${getActiveClass("/matches")}`} />
          <span className={`text-xs mt-1 ${getActiveClass("/matches")}`}>Matches</span>
        </Link>
        <Link to="/mensajes" className="flex flex-col items-center">
          <MessageSquare className={`h-6 w-6 ${getActiveClass("/mensajes")}`} />
          <span className={`text-xs mt-1 ${getActiveClass("/mensajes")}`}>Mensajes</span>
        </Link>
        <Link to="/perfil" className="flex flex-col items-center">
          <User className={`h-6 w-6 ${getActiveClass("/perfil")}`} />
          <span className={`text-xs mt-1 ${getActiveClass("/perfil")}`}>Perfil</span>
        </Link>
      </div>
    </footer>
  )
}
