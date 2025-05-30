"use client"

import { Heart, X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export const LikeAnimation = ({ visible }) => {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        {/* Ondas de expansión */}
        <motion.div
          className="absolute inset-0 border-4 border-green-400 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-green-300 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-green-200 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        />

        {/* Corazón principal */}
        <motion.div
          className="bg-green-500 rounded-full p-8 shadow-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
        >
          <Heart className="h-16 w-16 text-white fill-white" strokeWidth={1.5} />
        </motion.div>

        {/* Partículas flotantes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            initial={{
              scale: 0,
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i * 45 * Math.PI) / 180) * 100,
              y: Math.sin((i * 45 * Math.PI) / 180) * 100,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.3 + i * 0.05,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export const DislikeAnimation = ({ visible }) => {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: -180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        {/* Ondas de expansión */}
        <motion.div
          className="absolute inset-0 border-4 border-red-400 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-red-300 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />

        {/* X principal */}
        <motion.div
          className="bg-red-500 rounded-full p-8 shadow-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
        >
          <X className="h-16 w-16 text-white" strokeWidth={3} />
        </motion.div>

        {/* Partículas flotantes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-8 bg-red-400 rounded-full"
            style={{
              transformOrigin: "center bottom",
            }}
            initial={{
              scale: 0,
              rotate: i * 60,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1, 0],
              y: -80,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 0.3 + i * 0.05,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export const MatchAnimation = ({ visible, user1Name, user2Name, onComplete }) => {
  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Fondo con gradiente animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Overlay con patrón */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        {/* Contenido principal */}
        <div className="relative z-10 text-center text-white px-8">
          {/* Título principal */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              ¡MATCH!
            </h1>
          </motion.div>

          {/* Corazones flotantes */}
          <div className="relative mb-8">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: 0,
                }}
                animate={{
                  scale: [0, 1, 0.8],
                  x: Math.cos((i * 30 * Math.PI) / 180) * (150 + Math.random() * 100),
                  y: Math.sin((i * 30 * Math.PI) / 180) * (150 + Math.random() * 100),
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  repeatDelay: 1,
                }}
                style={{
                  left: "50%",
                  top: "50%",
                }}
              >
                <Heart
                  className={`h-8 w-8 fill-current ${
                    i % 3 === 0 ? "text-pink-300" : i % 3 === 1 ? "text-red-300" : "text-purple-300"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Nombres de usuarios */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 150, damping: 15 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-semibold">
              <span className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">{user1Name}</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Heart className="h-8 w-8 text-pink-300 fill-current" />
              </motion.div>
              <span className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">{user2Name}</span>
            </div>
          </motion.div>

          {/* Mensaje */}
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-xl md:text-2xl mb-8 font-light"
          >
            ¡Ambos se gustaron! Ahora pueden chatear
          </motion.p>

          {/* Sparkles animados */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                scale: 0,
                opacity: 0,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 3,
              }}
            >
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </motion.div>
          ))}

          {/* Botón para continuar */}
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            onClick={onComplete}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ¡Continuar!
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
