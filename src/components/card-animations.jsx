import { Heart, X, Star } from "lucide-react"

export const LikeAnimation = ({ visible }) => {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping-slow"></div>
        <Heart className="h-32 w-32 text-green-500 fill-green-500 animate-scale-fade" strokeWidth={1.5} />
      </div>
    </div>
  )
}

export const DislikeAnimation = ({ visible }) => {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping-slow"></div>
        <X className="h-32 w-32 text-red-500 animate-scale-fade" strokeWidth={2} />
      </div>
    </div>
  )
}

export const SuperlikeAnimation = ({ visible }) => {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-20 animate-ping-slow"></div>
        <Star className="h-32 w-32 text-yellow-500 fill-yellow-500 animate-scale-fade-rotate" strokeWidth={1.5} />
      </div>
    </div>
  )
}
