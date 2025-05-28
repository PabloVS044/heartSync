"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "@/components/navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
// Emojis para el selector
const EMOJIS = [
  "😊", "😍", "😘", "🥰", "😂", "😎", "👋", "❤️", "🎉", "🔥",
  "👍", "🙏", "🤔", "😅", "🌹", "✨", "🎵", "🎬", "📚", "✈️",
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]);
  const [conversations, setConversations] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const userId = localStorage.getItem("userId") || "default_user_id";

  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMatch = matches.find((match) => match.id === activeMatchId);
  const activeConversation = activeMatchId ? conversations[activeMatchId] || [] : [];

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.secure_url) return data.secure_url;
      throw new Error("Cloudinary upload failed");
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`/api/matches/user/${userId}`);
        const fetchedMatches = response.data.map((item) => {
          const otherUser = item.otherUser;
          const chat = item.chat || { messages: [] };
          return {
            id: item.match.id,
            name: otherUser.name,
            age: otherUser.age || 0,
            location: otherUser.location || "Desconocido",
            lastActive: otherUser.lastActive || "Desconocido",
            image: otherUser.image || "/placeholder.svg",
            compatibility: otherUser.compatibility || 90,
            interests: otherUser.interests || [],
            commonInterests: otherUser.commonInterests || [],
            unreadCount: chat.messages.filter((msg) => msg.senderId !== userId && !msg.isRead).length,
            lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null,
            chatId: chat.id,
          };
        });

        const fetchedConversations = {};
        response.data.forEach((item) => {
          if (item.chat) {
            fetchedConversations[item.match.id] = item.chat.messages.map((msg) => ({
              ...msg,
              isRead: msg.isRead || msg.senderId === userId,
            }));
          }
        });

        setMatches(fetchedMatches);
        setConversations(fetchedConversations);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast.error("Error al cargar las conversaciones.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId !== "default_user_id") {
      fetchMatches();
    } else {
      toast.error("Por favor, inicia sesión para ver tus mensajes.");
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation]);

  useEffect(() => {
    if (activeMatchId) {
      const activeMatch = matches.find((match) => match.id === activeMatchId);
      if (!activeMatch?.chatId) return;

      setConversations((prev) => {
        const updatedConversation = (prev[activeMatchId] || []).map((msg) => ({
          ...msg,
          isRead: true,
        }));
        return { ...prev, [activeMatchId]: updatedConversation };
      });

      setMatches((prev) =>
        prev.map((match) =>
          match.id === activeMatchId
            ? { ...match, unreadCount: 0, lastMessage: match.lastMessage ? { ...match.lastMessage, isRead: true } : null }
            : match
        )
      );

      axios
        .patch(`/api/chats/${activeMatch.chatId}/messages/read`, { userId })
        .catch((error) => console.error("Error marking messages as read:", error));
    }
  }, [activeMatchId, matches, userId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeMatchId) return;

    const activeMatch = matches.find((match) => match.id === activeMatchId);
    if (!activeMatch?.chatId) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: userId,
      content: message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    try {
      await axios.post(`/api/chats/${activeMatch.chatId}/messages`, {
        senderId: userId,
        content: message,
      });

      setConversations((prev) => ({
        ...prev,
        [activeMatchId]: [...(prev[activeMatchId] || []), newMessage],
      }));

      setMatches((prev) =>
        prev.map((match) =>
          match.id === activeMatchId
            ? {
                ...match,
                lastMessage: {
                  content: message,
                  timestamp: new Date().toISOString(),
                  isRead: false,
                },
              }
            : match
        )
      );

      setMessage("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error al enviar el mensaje.");
    }
  };

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && activeMatchId) {
      const activeMatch = matches.find((match) => match.id === activeMatchId);
      if (!activeMatch?.chatId) return;

      try {
        const cloudinaryUrl = await uploadToCloudinary(files[0]);
        const newMessage = {
          id: Date.now().toString(),
          senderId: userId,
          content: "📷 Imagen",
          image: cloudinaryUrl,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        await axios.post(`/api/chats/${activeMatch.chatId}/messages`, {
          senderId: userId,
          content: "📷 Imagen",
          image: cloudinaryUrl,
        });

        setConversations((prev) => ({
          ...prev,
          [activeMatchId]: [...(prev[activeMatchId] || []), newMessage],
        }));

        setMatches((prev) =>
          prev.map((match) =>
            match.id === activeMatchId
              ? {
                  ...match,
                  lastMessage: {
                    content: "📷 Imagen",
                    timestamp: new Date().toISOString(),
                    isRead: false,
                  },
                }
              : match
          )
        );

        toast.success("Imagen enviada con éxito.");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error al subir la imagen.");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingPhoto(true);
  };

  const handleDragLeave = () => {
    setIsDraggingPhoto(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingPhoto(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0 && activeMatchId) {
      const activeMatch = matches.find((match) => match.id === activeMatchId);
      if (!activeMatch?.chatId) return;

      try {
        const cloudinaryUrl = await uploadToCloudinary(files[0]);
        const newMessage = {
          id: Date.now().toString(),
          senderId: userId,
          content: "📷 Imagen",
          image: cloudinaryUrl,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        await axios.post(`/api/chats/${activeMatch.chatId}/messages`, {
          senderId: userId,
          content: "📷 Imagen",
          image: cloudinaryUrl,
        });

        setConversations((prev) => ({
          ...prev,
          [activeMatchId]: [...(prev[activeMatchId] || []), newMessage],
        }));

        setMatches((prev) =>
          prev.map((match) =>
            match.id === activeMatchId
              ? {
                  ...match,
                  lastMessage: {
                    content: "📷 Imagen",
                    timestamp: new Date().toISOString(),
                    isRead: false,
                  },
                }
              : match
          )
        );

        toast.success("Imagen enviada con éxito.");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error al subir la imagen.");
      }
    }
  };

  const formatMessageTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, "HH:mm");
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Ayer ${format(messageDate, "HH:mm")}`;
    }

    const daysDiff = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return `${format(messageDate, "EEEE", { locale: es })} ${format(messageDate, "HH:mm")}`;
    }

    return format(messageDate, "dd/MM/yyyy HH:mm");
  };

  const handleViewProfile = (matchId) => {
    navigate(`/profile/${matchId}`);
  };

  if (isLoading) {
    return <Loader />;
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
                    <TabsTrigger value="all" className="data-[state=active]:bg-rose-600">Todos</TabsTrigger>
                    <TabsTrigger value="unread" className="data-[state=active]:bg-rose-600">No leídos</TabsTrigger>
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
                            activeMatchId === match.id ? "bg-rose-600/20 hover:bg-rose-600/30" : "hover:bg-gray-800"
                          }`}
                          onClick={() => setActiveMatchId(match.id)}
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-12 w-12 mr-3">
                                <AvatarImage src={match.image} alt={match.name} />
                                <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {match.lastActive === "En línea" && (
                                <span className="absolute bottom-0 right-3 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900" />
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
                                  <p className="text-sm text-gray-400 truncate">{match.lastMessage.content}</p>
                                ) : (
                                  <p className="text-sm text-gray-400">Inicia una conversación</p>
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
                      <p className="text-gray-400">No hay conversaciones.</p>
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
                              activeMatchId === match.id ? "bg-rose-600/20 hover:bg-rose-600/30" : "hover:bg-gray-800"
                            }`}
                            onClick={() => setActiveMatchId(match.id)}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12 mr-3">
                                <AvatarImage src={match.image} alt={match.name} />
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
                                  <p className="text-sm text-gray-400 truncate">{match.lastMessage.content}</p>
                                  <Badge className="ml-2 bg-rose-600 hover:bg-rose-700">{match.unreadCount}</Badge>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-400">No hay mensajes sin leer.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Área de mensajes */}
          <div
            className="hidden md:flex flex-1 flex-col"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {activeMatch ? (
              <>
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
                      <AvatarImage src={activeMatch.image} alt={activeMatch.name} />
                      <AvatarFallback>{activeMatch.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium flex items-center">
                        {activeMatch.name}
                        {activeMatch.lastActive === "En línea" && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
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
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
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
                            className="w-full justify-start text-left hover:bg-gray-800 text-red-500"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Eliminar conversación
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div
                  className={`flex-1 overflow-y-auto p-4 space-y-4 relative ${
                    isDraggingPhoto ? "border-2 border-dashed border-rose-600 bg-gray-800/50" : ""
                  }`}
                >
                  {isDraggingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white text-lg">Suelta la imagen aquí</p>
                    </div>
                  )}
                  {activeConversation.length > 0 ? (
                    activeConversation.map((msg, index) => {
                      const isUser = msg.senderId === userId;
                      const showAvatar =
                        !isUser && (index === 0 || activeConversation[index - 1].senderId !== msg.senderId);

                      return (
                        <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          {!isUser && showAvatar && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src={activeMatch.image} alt={activeMatch.name} />
                              <AvatarFallback>{activeMatch.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          {!isUser && !showAvatar && <div className="w-10" />}
                          <div className={`max-w-[70%] ${isUser ? "order-1" : "order-2"}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 inline-block ${
                                isUser ? "bg-rose-600 text-white rounded-br-none" : "bg-gray-800 text-white rounded-bl-none"
                              }`}
                            >
                              {msg.image ? (
                                <div className="space-y-2">
                                  <img src={msg.image} alt="Imagen compartida" className="rounded-lg max-w-full h-auto" />
                                  {msg.content && <p>{msg.content}</p>}
                                </div>
                              ) : (
                                <p>{msg.content}</p>
                              )}
                            </div>
                            <div
                              className={`flex items-center mt-1 text-xs text-gray-400 ${
                                isUser ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span>{formatMessageTime(msg.timestamp)}</span>
                              {isUser && (
                                <span className="ml-1">
                                  {msg.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <Check className="h-3 w-3 text-gray-400" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="bg-gray-800/50 rounded-full p-4 mb-4">
                        <Heart className="h-8 w-8 text-rose-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Nuevo match con {activeMatch.name}</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        Es el momento perfecto para iniciar una conversación. Comparten intereses en{" "}
                        {activeMatch.commonInterests?.join(", ") || "ninguno"}.
                      </p>
                      <Button
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={() =>
                          setMessage(
                            `¡Hola ${activeMatch.name}! Me gustó mucho tu perfil, especialmente que te gusta ${
                              activeMatch.commonInterests?.[0] || "algo especial"
                            }.`
                          )
                        }
                      >
                        Iniciar conversación
                      </Button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={handleFileUpload}
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple={false}
                      onChange={handleFileSelected}
                    />
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 pr-10"
                      />
                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-gray-900 border-gray-800 text-white p-2">
                          <div className="grid grid-cols-5 gap-2">
                            {EMOJIS.map((emoji) => (
                              <Button
                                key={emoji}
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
                      className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-gray-800/50 rounded-full p-6 mb-4">
                  <MessageSquare className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tus mensajes</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Selecciona una conversación de la lista o inicia una nueva con tus matches.
                </p>
              </div>
            )}
          </div>

          {/* Vista móvil para el chat */}
          <AnimatePresence>
            {activeMatchId && (
              <motion.div
                className="md:hidden fixed inset-0 bg-gray-900 z-10 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={() => setActiveMatchId(null)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeMatch?.image} alt={activeMatch?.name} />
                      <AvatarFallback>{activeMatch?.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium flex items-center">
                        {activeMatch?.name || "Usuario"}
                        {activeMatch?.lastActive === "En línea" && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </h3>
                      <p className="text-xs text-gray-400">{activeMatch?.lastActive || "Desconocido"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
                            onClick={() => handleViewProfile(activeMatch?.id)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Ver perfil
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-gray-800"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Añadir a favoritos
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-gray-800 text-red-500"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Eliminar conversación
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div
                  className={`flex-1 overflow-y-auto p-4 space-y-4 relative`}
                  style={{ height: "calc(100vh - 140px)" }}
                >
                  {isDraggingPhoto && (
                    <div className="absolute inset-0 border-2 border-dashed border-rose-600 bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <p className="text-white text-lg">Suelta la imagen aquí</p>
                    </div>
                  )}
                  {activeConversation.length > 0 ? (
                    activeConversation.map((msg, index) => {
                      const isUser = msg.senderId === userId;
                      const showAvatar =
                        !isUser && (index === 0 || activeConversation[index - 1].senderId !== msg.senderId);

                      return (
                        <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          {!isUser && showAvatar && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src={activeMatch?.image} alt={activeMatch?.name} />
                              <AvatarFallback>{activeMatch?.name?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                          )}
                          {!isUser && !showAvatar && <div className="w-10" />}
                          <div className={`max-w-[70%] ${isUser ? "order-1" : "order-2"}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 inline-block ${
                                isUser ? "bg-rose-600 text-white rounded-br-none" : "bg-gray-800 text-white rounded-bl-none"
                              }`}
                            >
                              {msg.image ? (
                                <div className="space-y-2">
                                  <img src={msg.image} alt="Imagen compartida" className="rounded-lg max-w-full h-auto" />
                                  {msg.content && <p>{msg.content}</p>}
                                </div>
                              ) : (
                                <p>{msg.content}</p>
                              )}
                            </div>
                            <div
                              className={`flex items-center mt-1 text-xs text-gray-400 ${
                                isUser ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span>{formatMessageTime(msg.timestamp)}</span>
                              {isUser && (
                                <span className="ml-1">
                                  {msg.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <Check className="h-3 w-3 text-gray-400" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="bg-gray-800/50 rounded-full p-4 mb-4">
                        <Heart className="h-8 w-8 text-rose-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Nuevo match con {activeMatch?.name}</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        Es el momento perfecto para iniciar una conversación. Comparten intereses en{" "}
                        {activeMatch?.commonInterests?.join(", ") || "ninguno"}.
                      </p>
                      <Button
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={() =>
                          setMessage(
                            `¡Hola ${activeMatch?.name}! Me gustó mucho tu perfil, especialmente que te gusta ${
                              activeMatch?.commonInterests?.[0] || "algo especial"
                            }.`
                          )
                        }
                      >
                        Iniciar conversación
                      </Button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-900">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={handleFileUpload}
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple={false}
                      onChange={handleFileSelected}
                    />
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 pr-10"
                      />
                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-gray-900 border-gray-800 text-white p-2">
                          <div className="grid grid-cols-5 gap-2">
                            {EMOJIS.map((emoji) => (
                              <Button
                                key={emoji}
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
                      className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
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

          {/* Diálogo de información del perfil */}
          {showProfileInfo && activeMatch && (
            <Dialog open={showProfileInfo} onOpenChange={setShowProfileInfo}>
              <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Información de {activeMatch.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={activeMatch.image} alt={activeMatch.name} />
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
                    <h4 className="text-sm font-medium mb-2">Intereses</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMatch.interests.length > 0 ? (
                        activeMatch.interests.map((interest) => (
                          <Badge key={interest} className="bg-gray-800 border-gray-700">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No hay intereses especificados.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Intereses en común</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMatch.commonInterests.length > 0 ? (
                        activeMatch.commonInterests.map((interest) => (
                          <Badge key={interest} className="bg-rose-600 hover:bg-rose-700">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No hay intereses en común.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                      <p className="text-xs text-gray-400">Se unió hace 2 semanas</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
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
  );
}