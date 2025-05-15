"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  Info,
  Search,
  Heart,
  Check,
  CheckCheck,
  User,
  Calendar,
  MapPin,
  X,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Navbar from "@/components/navbar";

// Datos simulados - En producción vendrían de Neo4J
const MATCHES = [
  {
    id: 1,
    name: "Elena",
    age: 42,
    location: "Madrid, España",
    lastActive: "Hace 2 horas",
    image: "/placeholder.svg?height=100&width=100&text=Elena",
    compatibility: 92,
    interests: ["yoga", "viajes", "gastronomía", "cine", "senderismo"],
    commonInterests: ["viajes", "cine"],
    unreadCount: 2,
    lastMessage: {
      text: "¿Te gustaría ir al cine este fin de semana?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      isRead: false,
    },
  },
  {
    id: 2,
    name: "Sofía",
    age: 45,
    location: "Barcelona, España",
    lastActive: "En línea",
    image: "/placeholder.svg?height=100&width=100&text=Sofia",
    compatibility: 88,
    interests: ["arte", "música", "cocina", "vino", "teatro"],
    commonInterests: ["música", "cocina"],
    unreadCount: 0,
    lastMessage: {
      text: "Me encantó nuestra conversación de ayer.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
      isRead: true,
    },
  },
  {
    id: 3,
    name: "Carmen",
    age: 39,
    location: "Valencia, España",
    lastActive: "Hace 5 minutos",
    image: "/placeholder.svg?height=100&width=100&text=Carmen",
    compatibility: 95,
    interests: ["arquitectura", "viajes", "fotografía", "lectura", "natación"],
    commonInterests: ["viajes", "fotografía", "lectura"],
    unreadCount: 0,
    lastMessage: null,
  },
]

// Datos simulados de conversaciones - En producción vendrían de Neo4J
const CONVERSATIONS = {
  1: [
    {
      id: 1,
      senderId: 1, // Elena
      text: "¡Hola! Me gustó mucho tu perfil, especialmente que te gusta viajar.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      isRead: true,
    },
    {
      id: 2,
      senderId: "user", // Usuario actual
      text: "¡Gracias Elena! Vi que también te gusta el cine. ¿Qué tipo de películas te gustan?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 horas atrás
      isRead: true,
    },
    {
      id: 3,
      senderId: 1, // Elena
      text: "Me encantan las películas de ciencia ficción y los dramas. ¿Y a ti?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
      isRead: true,
    },
    {
      id: 4,
      senderId: "user", // Usuario actual
      text: "¡Coincidimos! También me gusta la ciencia ficción. ¿Has visto alguna película interesante últimamente?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
      isRead: true,
    },
    {
      id: 5,
      senderId: 1, // Elena
      text: "Vi 'Dune' hace poco y me encantó. La fotografía es impresionante.",
      timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutos atrás
      isRead: true,
    },
    {
      id: 6,
      senderId: 1, // Elena
      text: "¿Te gustaría ir al cine este fin de semana? Hay un festival de cine independiente en la ciudad.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      isRead: false,
    },
  ],
  2: [
    {
      id: 1,
      senderId: 2, // Sofía
      text: "Hola, vi que te gusta la música. ¿Qué géneros escuchas?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 días atrás
      isRead: true,
    },
    {
      id: 2,
      senderId: "user", // Usuario actual
      text: "¡Hola Sofía! Me gusta el rock, jazz y algo de música clásica. ¿Y tú?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47), // 47 horas atrás
      isRead: true,
    },
    {
      id: 3,
      senderId: 2, // Sofía
      text: "¡Qué coincidencia! También me encanta el jazz. ¿Tienes algún artista favorito?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 horas atrás
      isRead: true,
    },
    {
      id: 4,
      senderId: "user", // Usuario actual
      text: "Me gusta mucho Miles Davis y Chet Baker. ¿Conoces algún buen club de jazz en Barcelona?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 horas atrás
      isRead: true,
    },
    {
      id: 5,
      senderId: 2, // Sofía
      text: "¡Claro! Hay un lugar llamado Jamboree que es fantástico. Tienen actuaciones en vivo casi todas las noches.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 horas atrás
      isRead: true,
    },
    {
      id: 6,
      senderId: "user", // Usuario actual
      text: "Suena genial. Me encantaría visitarlo la próxima vez que esté en Barcelona.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 horas atrás
      isRead: true,
    },
    {
      id: 7,
      senderId: 2, // Sofía
      text: "Me encantó nuestra conversación de ayer. Espero que podamos seguir hablando sobre música.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 horas atrás
      isRead: true,
    },
  ],
}

// Emojis para el selector
const EMOJIS = [
  "😊",
  "😍",
  "😘",
  "🥰",
  "😂",
  "😎",
  "👋",
  "❤️",
  "🎉",
  "🔥",
  "👍",
  "🙏",
  "🤔",
  "😅",
  "🌹",
  "✨",
  "🎵",
  "🎬",
  "📚",
  "✈️",
]

export default function MessagesPage() {
  const navigate = useNavigate();
  const [activeMatchId, setActiveMatchId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [matches, setMatches] = useState(MATCHES)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showProfileInfo, setShowProfileInfo] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Filtrar matches según el término de búsqueda
  const filteredMatches = matches.filter((match) => match.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Obtener el match activo
  const activeMatch = matches.find((match) => match.id === activeMatchId)

  // Obtener la conversación activa
  const activeConversation = activeMatchId ? conversations[activeMatchId] || [] : []

  // Efecto para desplazarse al final de los mensajes cuando cambia la conversación
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation])

  // Efecto para marcar los mensajes como leídos cuando se abre una conversación
  useEffect(() => {
    if (activeMatchId) {
      // Actualizar los mensajes como leídos
      setConversations((prev) => {
        const updatedConversation = (prev[activeMatchId] || []).map((msg) => ({
          ...msg,
          isRead: true,
        }))

        return {
          ...prev,
          [activeMatchId]: updatedConversation,
        }
      })

      // Actualizar el contador de no leídos
      setMatches((prev) =>
        prev.map((match) =>
          match.id === activeMatchId
            ? {
                ...match,
                unreadCount: 0,
                lastMessage: match.lastMessage ? { ...match.lastMessage, isRead: true } : null,
              }
            : match,
        ),
      )
    }
  }, [activeMatchId])

  const handleSendMessage = () => {
    if (!message.trim() || !activeMatchId) return

    // Crear nuevo mensaje
    const newMessage = {
      id: Date.now(),
      senderId: "user",
      text: message,
      timestamp: new Date(),
      isRead: false,
    }

    // Actualizar conversación
    setConversations((prev) => ({
      ...prev,
      [activeMatchId]: [...(prev[activeMatchId] || []), newMessage],
    }))

    // Actualizar último mensaje en la lista de matches
    setMatches((prev) =>
      prev.map((match) =>
        match.id === activeMatchId
          ? {
              ...match,
              lastMessage: {
                text: message,
                timestamp: new Date(),
                isRead: false,
              },
            }
          : match,
      ),
    )

    // Limpiar campo de mensaje
    setMessage("")

    // Cerrar selector de emojis si está abierto
    setShowEmojiPicker(false)

    // Simular respuesta después de un tiempo aleatorio (solo para demostración)
    if (Math.random() > 0.3) {
      // 70% de probabilidad de respuesta
      const responseTime = 3000 + Math.random() * 10000 // Entre 3 y 13 segundos

      setTimeout(() => {
        const responses = [
          "¡Me parece genial!",
          "Eso suena interesante. Cuéntame más.",
          "¿En serio? ¡Qué coincidencia!",
          "Me encantaría saber más sobre eso.",
          "Estoy de acuerdo contigo.",
          "¿Y qué más te gusta hacer en tu tiempo libre?",
          "Tenemos muchas cosas en común.",
          "¿Qué te parece si quedamos para tomar algo?",
          "Eso me recuerda a una experiencia que tuve...",
          "¡Jaja! Eres muy divertido/a.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        // Crear respuesta
        const responseMessage = {
          id: Date.now(),
          senderId: activeMatchId,
          text: randomResponse,
          timestamp: new Date(),
          isRead: true,
        }

        // Actualizar conversación
        setConversations((prev) => ({
          ...prev,
          [activeMatchId]: [...(prev[activeMatchId] || []), responseMessage],
        }))

        // Actualizar último mensaje en la lista de matches
        setMatches((prev) =>
          prev.map((match) =>
            match.id === activeMatchId
              ? {
                  ...match,
                  lastMessage: {
                    text: randomResponse,
                    timestamp: new Date(),
                    isRead: true,
                  },
                }
              : match,
          ),
        )
      }, responseTime)
    }
  }

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Aquí se implementaría la lógica para subir archivos
      // Por ahora, solo simulamos un mensaje con la imagen
      const imageUrl = URL.createObjectURL(files[0])

      // Crear nuevo mensaje con imagen
      const newMessage = {
        id: Date.now(),
        senderId: "user",
        text: "📷 Imagen",
        image: imageUrl,
        timestamp: new Date(),
        isRead: false,
      }

      // Actualizar conversación
      setConversations((prev) => ({
        ...prev,
        [activeMatchId]: [...(prev[activeMatchId] || []), newMessage],
      }))

      // Actualizar último mensaje en la lista de matches
      setMatches((prev) =>
        prev.map((match) =>
          match.id === activeMatchId
            ? {
                ...match,
                lastMessage: {
                  text: "📷 Imagen",
                  timestamp: new Date(),
                  isRead: false,
                },
              }
            : match,
        ),
      )
    }
  }

  const formatMessageTime = (date) => {
    const now = new Date()
    const messageDate = new Date(date)

    // Si es hoy
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, "HH:mm")
    }

    // Si es ayer
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Ayer " + format(messageDate, "HH:mm")
    }

    // Si es esta semana
    const daysDiff = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24))
    if (daysDiff < 7) {
      return format(messageDate, "EEEE", { locale: es }) + " " + format(messageDate, "HH:mm")
    }

    // Si es más antiguo
    return format(messageDate, "dd/MM/yyyy HH:mm")
  }

  const handleViewProfile = (matchId) => {
    navigate(`/profile/${matchId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Lista de conversaciones */}
          <div className="w-full md:w-80 lg:w-96 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold mb-4">Mensajes</h1>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="all" className="w-full">
                <div className="px-4 pt-2">
                  <TabsList className="grid grid-cols-2 bg-gray-800/50">
                    <TabsTrigger value="all" className="data-[state=active]:bg-rose-600">
                      Todos
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="data-[state=active]:bg-rose-600">
                      No leídos
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  {filteredMatches.length > 0 ? (
                    <div className="space-y-1 p-2">
                      {filteredMatches.map((match) => (
                        <motion.button
                          key={match.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            activeMatchId === match.id ? "bg-rose-600/20 hover:bg-rose-600/30" : "hover:bg-gray-800/70"
                          }`}
                          onClick={() => setActiveMatchId(match.id)}
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-12 w-12 mr-3">
                                <AvatarImage src={match.image || "/placeholder.svg"} alt={match.name} />
                                <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {match.lastActive === "En línea" && (
                                <span className="absolute bottom-0 right-3 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium truncate">{match.name}</h3>
                                {match.lastMessage && (
                                  <span className="text-xs text-gray-400">
                                    {formatMessageTime(match.lastMessage.timestamp)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center">
                                {match.lastMessage ? (
                                  <p className="text-sm text-gray-400 truncate">{match.lastMessage.text}</p>
                                ) : (
                                  <p className="text-xs text-gray-500">Nuevo match - Inicia una conversación</p>
                                )}

                                {match.unreadCount > 0 && (
                                  <Badge className="ml-2 bg-rose-600 hover:bg-rose-700">{match.unreadCount}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-400">No se encontraron conversaciones</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="unread" className="mt-0">
                  {filteredMatches.filter((match) => match.unreadCount > 0).length > 0 ? (
                    <div className="space-y-1 p-2">
                      {filteredMatches
                        .filter((match) => match.unreadCount > 0)
                        .map((match) => (
                          <motion.button
                            key={match.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              activeMatchId === match.id
                                ? "bg-rose-600/20 hover:bg-rose-600/30"
                                : "hover:bg-gray-800/70"
                            }`}
                            onClick={() => setActiveMatchId(match.id)}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12 mr-3">
                                <AvatarImage src={match.image || "/placeholder.svg"} alt={match.name} />
                                <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium truncate">{match.name}</h3>
                                  <span className="text-xs text-gray-400">
                                    {formatMessageTime(match.lastMessage.timestamp)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <p className="text-sm text-gray-400 truncate">{match.lastMessage.text}</p>
                                  <Badge className="ml-2 bg-rose-600 hover:bg-rose-700">{match.unreadCount}</Badge>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-400">No hay mensajes sin leer</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Área de chat */}
          <div className="hidden md:flex flex-1 flex-col">
            {activeMatch ? (
              <>
                {/* Cabecera del chat */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden mr-2"
                      onClick={() => setActiveMatchId(null)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeMatch.image || "/placeholder.svg"} alt={activeMatch.name} />
                      <AvatarFallback>{activeMatch.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-medium flex items-center">
                        {activeMatch.name}
                        {activeMatch.lastActive === "En línea" && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400">{activeMatch.lastActive}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => setShowProfileInfo(true)}
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 bg-gray-900 border-gray-800 text-white p-0">
                        <div className="p-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-gray-800"
                            onClick={() => handleViewProfile(activeMatch.id)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Ver perfil
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-left hover:bg-gray-800">
                            <Heart className="h-4 w-4 mr-2" />
                            Añadir a favoritos
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-gray-800 text-red-400"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Eliminar conversación
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeConversation.length > 0 ? (
                    activeConversation.map((msg, index) => {
                      const isUser = msg.senderId === "user"
                      const showAvatar =
                        !isUser && (index === 0 || activeConversation[index - 1].senderId !== msg.senderId)

                      return (
                        <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          {!isUser && showAvatar && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src={activeMatch.image || "/placeholder.svg"} alt={activeMatch.name} />
                              <AvatarFallback>{activeMatch.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}

                          {!isUser && !showAvatar && <div className="w-10"></div>}

                          <div className={`max-w-[70%] ${isUser ? "order-1" : "order-2"}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 inline-block ${
                                isUser
                                  ? "bg-rose-600 text-white rounded-br-none"
                                  : "bg-gray-800 text-white rounded-bl-none"
                              }`}
                            >
                              {msg.image ? (
                                <div className="space-y-2">
                                  <img
                                    src={msg.image || "/placeholder.svg"}
                                    alt="Imagen compartida"
                                    className="rounded-lg max-w-full"
                                  />
                                  <p>{msg.text}</p>
                                </div>
                              ) : (
                                <p>{msg.text}</p>
                              )}
                            </div>

                            <div
                              className={`flex items-center mt-1 text-xs text-gray-400 ${isUser ? "justify-end" : "justify-start"}`}
                            >
                              <span>{formatMessageTime(msg.timestamp)}</span>

                              {isUser && (
                                <span className="ml-1">
                                  {msg.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-400" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="bg-gray-800/50 rounded-full p-4 mb-4">
                        <Heart className="h-8 w-8 text-rose-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Nuevo match con {activeMatch.name}</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        Es el momento perfecto para iniciar una conversación. Comparten intereses en{" "}
                        {activeMatch.commonInterests.join(", ")}.
                      </p>
                      <Button
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={() =>
                          setMessage(
                            `¡Hola ${activeMatch.name}! Me gustó mucho tu perfil, especialmente que te gusta ${activeMatch.commonInterests[0]}.`,
                          )
                        }
                      >
                        Iniciar conversación
                      </Button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Entrada de mensaje */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={handleFileUpload}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelected}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 relative">
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 pr-10"
                      />

                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 text-gray-400 hover:text-white hover:bg-transparent"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-gray-900 border-gray-800 text-white p-2">
                          <div className="grid grid-cols-5 gap-2">
                            {EMOJIS.map((emoji, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                className="h-10 hover:bg-gray-800"
                                onClick={() => handleAddEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-gray-800/50 rounded-full p-6 mb-4">
                  <MessageSquare className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-medium mb-2">Tus mensajes</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Selecciona una conversación de la lista o inicia una nueva con tus matches.
                </p>
              </div>
            )}
          </div>

          {/* Vista móvil del chat */}
          <AnimatePresence>
            {activeMatchId && (
              <motion.div
                className="md:hidden absolute inset-0 bg-gray-900 z-10"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {/* Cabecera del chat */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => setActiveMatchId(null)}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeMatch?.image || "/placeholder.svg"} alt={activeMatch?.name} />
                      <AvatarFallback>{activeMatch?.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-medium flex items-center">
                        {activeMatch?.name}
                        {activeMatch?.lastActive === "En línea" && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400">{activeMatch?.lastActive}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => setShowProfileInfo(true)}
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 bg-gray-900 border-gray-800 text-white p-0">
                        <div className="p-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-gray-800"
                            onClick={() => handleViewProfile(activeMatch.id)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Ver perfil
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-left hover:bg-gray-800">
                            <Heart className="h-4 w-4 mr-2" />
                            Añadir a favoritos
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-gray-800 text-red-400"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Eliminar conversación
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: "calc(100vh - 140px)" }}>
                  {activeConversation.length > 0 ? (
                    activeConversation.map((msg, index) => {
                      const isUser = msg.senderId === "user"
                      const showAvatar =
                        !isUser && (index === 0 || activeConversation[index - 1].senderId !== msg.senderId)

                      return (
                        <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          {!isUser && showAvatar && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src={activeMatch.image || "/placeholder.svg"} alt={activeMatch.name} />
                              <AvatarFallback>{activeMatch.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}

                          {!isUser && !showAvatar && <div className="w-10"></div>}

                          <div className={`max-w-[70%] ${isUser ? "order-1" : "order-2"}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 inline-block ${
                                isUser
                                  ? "bg-rose-600 text-white rounded-br-none"
                                  : "bg-gray-800 text-white rounded-bl-none"
                              }`}
                            >
                              {msg.image ? (
                                <div className="space-y-2">
                                  <img
                                    src={msg.image || "/placeholder.svg"}
                                    alt="Imagen compartida"
                                    className="rounded-lg max-w-full"
                                  />
                                  <p>{msg.text}</p>
                                </div>
                              ) : (
                                <p>{msg.text}</p>
                              )}
                            </div>

                            <div
                              className={`flex items-center mt-1 text-xs text-gray-400 ${isUser ? "justify-end" : "justify-start"}`}
                            >
                              <span>{formatMessageTime(msg.timestamp)}</span>

                              {isUser && (
                                <span className="ml-1">
                                  {msg.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-400" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="bg-gray-800/50 rounded-full p-4 mb-4">
                        <Heart className="h-8 w-8 text-rose-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Nuevo match con {activeMatch?.name}</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        Es el momento perfecto para iniciar una conversación. Comparten intereses en{" "}
                        {activeMatch?.commonInterests.join(", ")}.
                      </p>
                      <Button
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={() =>
                          setMessage(
                            `¡Hola ${activeMatch?.name}! Me gustó mucho tu perfil, especialmente que te gusta ${activeMatch?.commonInterests[0]}.`,
                          )
                        }
                      >
                        Iniciar conversación
                      </Button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Entrada de mensaje */}
                <div className="p-4 border-t border-gray-800 absolute bottom-0 left-0 right-0 bg-gray-900">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={handleFileUpload}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelected}
                    />

                    <div className="flex-1 relative">
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 pr-10"
                      />

                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 text-gray-400 hover:text-white hover:bg-transparent"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-gray-900 border-gray-800 text-white p-2">
                          <div className="grid grid-cols-5 gap-2">
                            {EMOJIS.map((emoji, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                className="h-10 hover:bg-gray-800"
                                onClick={() => handleAddEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showProfileInfo && activeMatch && (
            <Dialog open={showProfileInfo} onOpenChange={setShowProfileInfo}>
              <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Información de {activeMatch.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={activeMatch.image || "/placeholder.svg"} alt={activeMatch.name} />
                      <AvatarFallback>{activeMatch.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-medium">
                        {activeMatch.name}, {activeMatch.age}
                      </p>
                      <p className="text-gray-400">{activeMatch.location}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Intereses</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMatch.interests.map((interest) => (
                        <Badge key={interest} className="bg-gray-800 border-gray-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Intereses en común</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMatch.commonInterests.map((interest) => (
                        <Badge key={interest} className="bg-rose-600 hover:bg-rose-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Calendar className="h-5 w-5 text-gray-500 mb-1" />
                      <p className="text-xs text-gray-400">Se unió hace 2 semanas</p>
                    </div>
                    <div>
                      <MapPin className="h-5 w-5 text-gray-500 mb-1" />
                      <p className="text-xs text-gray-400">A 5 km de distancia</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-rose-600 hover:bg-rose-700"
                    onClick={() => handleViewProfile(activeMatch.id)}
                  >
                    Ver perfil completo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
