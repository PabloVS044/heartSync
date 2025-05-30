import { Heart } from "lucide-react";

// Loader Component
export const Loader = () => (
  <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
    <div className="relative flex flex-col items-center">
      {/* Círculos de fondo animados */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-2 border-rose-500/20 animate-ping" />
        <div className="absolute w-24 h-24 rounded-full border-2 border-pink-500/30 animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute w-16 h-16 rounded-full border-2 border-rose-400/40 animate-ping" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Corazón principal */}
      <div className="relative z-10 mb-8">
        <div className="relative">
          {/* Resplandor de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse" 
               style={{ transform: 'scale(1.5)' }} />
          
          {/* Corazón con múltiples animaciones */}
          <Heart
            className="h-20 w-20 text-rose-500 relative z-10 drop-shadow-2xl animate-bounce"
            fill="currentColor"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(244, 63, 94, 0.6))',
              animation: 'heartbeat 1.5s ease-in-out infinite'
            }}
          />
          
          {/* Partículas flotantes */}
          <div className="absolute -top-2 -left-2">
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <div className="absolute -top-1 -right-3">
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
          </div>
          <div className="absolute -bottom-2 -right-1">
            <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '1.2s' }} />
          </div>
          <div className="absolute -bottom-1 -left-3">
            <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }} />
          </div>
        </div>
      </div>
      
      {/* Texto de carga */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-white animate-pulse">
          Encontrando tu conexión perfecta
        </h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
      
      {/* Barra de progreso simulada */}
      <div className="mt-8 w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse"
          style={{
            width: '100%',
            animation: 'loading 2s ease-in-out infinite'
          }}
        />
      </div>
    </div>
    
    <style jsx>{`
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.1); }
        50% { transform: scale(1.05); }
        75% { transform: scale(1.15); }
      }
      
      @keyframes loading {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);