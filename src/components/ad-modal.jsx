"use client"

import { useState, useEffect } from "react"
import { Info, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function AdModal({ ad, isOpen, onClose, onVisit }) {
  const [showReason, setShowReason] = useState(false)
  const [animateReason, setAnimateReason] = useState(false)

  // Efecto para animar la aparición de la razón
  useEffect(() => {
    if (isOpen && !showReason) {
      const timer = setTimeout(() => {
        setShowReason(true)
        setTimeout(() => setAnimateReason(true), 100)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, showReason])

  // Resetear estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setShowReason(false)
      setAnimateReason(false)
    }
  }, [isOpen])

  if (!ad) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">{ad.title}</DialogTitle>
          <DialogDescription className="text-gray-400">Anuncio personalizado</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden">
            <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="w-full h-48 object-cover" />
          </div>

          <p className="text-gray-300">{ad.description}</p>

          {showReason && (
            <div
              className={`transition-all duration-500 ${
                animateReason ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              } bg-rose-900/20 border border-rose-900/50 rounded-lg p-4`}
            >
              <h4 className="font-medium text-rose-400 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                ¿Por qué veo este anuncio?
              </h4>
              <p className="text-sm text-gray-300">{ad.targetedReason}</p>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={onClose} className="border-gray-700 hover:bg-gray-800">
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>

            <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => onVisit(ad.url)}>
              Visitar sitio
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
