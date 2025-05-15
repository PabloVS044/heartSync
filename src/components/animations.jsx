"use client"

import { Button } from "@/components/ui/button"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, Star } from "lucide-react"

// Componente para animación de Like
export function LikeAnimation({ isVisible, onComplete }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-green-500/30 backdrop-blur-sm rounded-full p-8">
            <Heart className="h-24 w-24 text-green-500" fill="currentColor" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente para animación de Dislike
export function DislikeAnimation({ isVisible, onComplete }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-red-500/30 backdrop-blur-sm rounded-full p-8">
            <X className="h-24 w-24 text-red-500" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente para animación de SuperLike
export function SuperLikeAnimation({ isVisible, onComplete }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-full p-8">
            <Star className="h-24 w-24 text-blue-500" fill="currentColor" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente para animación de Match
export function MatchAnimation({ isVisible, matchName, matchImage, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-rose-600 to-purple-600 p-1 rounded-2xl max-w-md w-full mx-4"
          >
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, times: [0, 0.7, 1], duration: 0.7 }}
                className="mx-auto mb-6 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                    className="bg-rose-500 rounded-full h-24 w-24 blur-xl"
                  />
                </div>
                <Heart className="h-20 w-20 text-rose-500 mx-auto relative z-10" fill="currentColor" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold mb-2"
              >
                ¡Es un Match!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-300 mb-6"
              >
                Tú y {matchName} se han dado like mutuamente
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex justify-center gap-4 mb-6"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-rose-500">
                    <img
                      src="/placeholder.svg?height=64&width=64&text=Tu"
                      alt="Tu foto"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-rose-500">
                    <img
                      src={matchImage || "/placeholder.svg?height=64&width=64"}
                      alt={matchName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="space-y-3"
              >
                <Button className="w-full bg-rose-600 hover:bg-rose-700" onClick={onClose}>
                  Enviar mensaje
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-700 hover:bg-gray-800 text-gray-300"
                  onClick={onClose}
                >
                  Seguir explorando
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente para animación de swipe de tarjetas
export function SwipeCard({ children, direction, onExitComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        x: direction === "right" ? 300 : direction === "left" ? -300 : 0,
        y: direction === "up" ? -300 : direction === "down" ? 300 : 0,
        opacity: 0,
        rotate: direction === "right" ? 20 : direction === "left" ? -20 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onAnimationComplete={onExitComplete}
      className="absolute w-full"
    >
      {children}
    </motion.div>
  )
}

// Componente para animación de entrada de elementos en lista
export function ListItemAnimation({ children, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

// Componente para animación de botones
export function AnimatedButton({ children, onClick, className }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// Componente para animación de notificaciones
export function NotificationAnimation({ isVisible, message, type = "success", onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
                ? "bg-red-500"
                : type === "info"
                  ? "bg-blue-500"
                  : "bg-gray-800"
          }`}
        >
          <div className="flex items-center">
            <span className="text-white font-medium">{message}</span>
            <button onClick={onClose} className="ml-3 text-white/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
