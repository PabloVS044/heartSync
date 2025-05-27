import { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Users,
  Heart,
  ArrowRight,
  Star,
  Shield,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonios
  const testimonials = [
    {
      name: "María",
      age: 45,
      location: "Madrid",
      image: "/placeholder.svg?height=48&width=48",
      text: "Después de mi divorcio, pensé que no encontraría a nadie. HeartSync me conectó con David, y llevamos 2 años juntos. La diferencia de edad nunca ha sido un problema.",
    },
    {
      name: "Carlos",
      age: 32,
      location: "Barcelona",
      image: "/placeholder.svg?height=48&width=48",
      text: "Siempre me han atraído las mujeres maduras. En HeartSync encontré a Sofía, una mujer increíble que comparte mis intereses y me ha enseñado tanto.",
    },
    {
      name: "Elena",
      age: 50,
      location: "Valencia",
      image: "/placeholder.svg?height=48&width=48",
      text: "HeartSync me dio la confianza para volver a salir después de años de estar soltera. Conocí a Miguel, que es 15 años menor que yo, y tenemos una relación maravillosa basada en el respeto mutuo.",
    },
  ];

  // Cambiar testimonio automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Estadísticas
  const stats = [
    { value: "10K+", label: "Usuarios activos" },
    { value: "85%", label: "Tasa de éxito" },
    { value: "4.8", label: "Calificación promedio" },
  ];

  // Función para manejar la navegación
  const handleNavigation = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Función para manejar el registro
  const handleRegister = (e) => {
    e.preventDefault();
    window.location.href = "/registro";
  };

  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-700 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-800/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-md flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-gray-100">HeartSync</span>
          </a>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#como-funciona"
              className="text-sm font-medium text-gray-300 hover:text-rose-400 transition-colors"
              onClick={(e) => handleNavigation(e, "como-funciona")}
            >
              Cómo Funciona
            </a>
            <a
              href="#beneficios"
              className="text-sm font-medium text-gray-300 hover:text-rose-400 transition-colors"
              onClick={(e) => handleNavigation(e, "beneficios")}
            >
              Beneficios
            </a>
            <a
              href="#testimonios"
              className="text-sm font-medium text-gray-300 hover:text-rose-400 transition-colors"
              onClick={(e) => handleNavigation(e, "testimonios")}
            >
              Testimonios
            </a>
            <a
              href="#preguntas"
              className="text-sm font-medium text-gray-300 hover:text-rose-400 transition-colors"
              onClick={(e) => handleNavigation(e, "preguntas")}
            >
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              size="sm"
              className="bg-gray-800 text-rose-400 border border-rose-600 hover:border-rose-400 hover:bg-rose-900/50 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              onClick={handleLogin}
            >
              Iniciar Sesión
            </Button>
            <Button
              size="sm"
              className="bg-gray-800 text-rose-400 border border-rose-600 hover:border-rose-400 hover:bg-rose-900/50 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              onClick={handleRegister}
            >
              Registrarse
            </Button>
          </div>

          {/* Botón menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-100 hover:text-rose-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <a
                href="#como-funciona"
                className="text-sm font-medium py-2 text-gray-300 hover:text-rose-400 transition-colors"
                onClick={(e) => handleNavigation(e, "como-funciona")}
              >
                Cómo Funciona
              </a>
              <a
                href="#beneficios"
                className="text-sm font-medium py-2 text-gray-300 hover:text-rose-400 transition-colors"
                onClick={(e) => handleNavigation(e, "beneficios")}
              >
                Beneficios
              </a>
              <a
                href="#testimonios"
                className="text-sm font-medium py-2 text-gray-300 hover:text-rose-400 transition-colors"
                onClick={(e) => handleNavigation(e, "testimonios")}
              >
                Testimonios
              </a>
              <a
                href="#preguntas"
                className="text-sm font-medium py-2 text-gray-300 hover:text-rose-400 transition-colors"
                onClick={(e) => handleNavigation(e, "preguntas")}
              >
                FAQ
              </a>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-rose-400 border-rose-600 hover:bg-rose-900"
                  onClick={handleLogin}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={handleRegister}
                >
                  Registrarse
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <Badge className="mb-6 bg-rose-900 text-rose-300 hover:bg-rose-800 transition-colors">
                  Nuevo: Algoritmo de compatibilidad mejorado
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-100">
                  Conexiones <span className="text-rose-400">auténticas</span> entre generaciones
                </h1>
                <p className="text-lg text-gray-400 mb-8">
                  HeartSync conecta mujeres mayores con hombres más jóvenes, creando relaciones significativas basadas en intereses comunes, respeto mutuo y química real.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700 rounded-full group text-white"
                    onClick={handleRegister}
                  >
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-rose-600 text-rose-400 hover:bg-rose-900"
                    onClick={(e) => handleNavigation(e, "como-funciona")}
                  >
                    Cómo funciona
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Avatar key={i} className="border-2 border-gray-800 w-9 h-9">
                        <AvatarImage
                          src={`https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png`}
                          alt={`Usuario ${i}`}
                        />
                        <AvatarFallback className="bg-gray-600 text-gray-100">U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="font-semibold text-gray-100">+1,500</span> nuevos usuarios esta semana
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://media.gq.com/photos/5a0c7de8fca80f3fd91bc0b4/16:9/w_2560%2Cc_limit/2017-11_GQ_TinderTypes_3x2.jpg"
                    alt="HeartSync App"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="container mx-auto px-4 mt-16">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-2">
                      {stat.value}
                    </div>
                    <p className="text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Funciona */}
        <section id="como-funciona" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4 bg-rose-900 text-rose-300 hover:bg-rose-800 transition-colors">
                Proceso simple
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
                Cómo funciona HeartSync
              </h2>
              <p className="text-lg text-gray-400">
                Hemos creado una plataforma intuitiva que facilita encontrar conexiones auténticas entre mujeres mayores y hombres más jóvenes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Search className="h-6 w-6 text-rose-400" />,
                  title: "Descubre",
                  description:
                    "Nuestro algoritmo de compatibilidad te muestra perfiles que coinciden con tus preferencias de edad, ubicación e intereses.",
                },
                {
                  icon: <MessageSquare className="h-6 w-6 text-rose-400" />,
                  title: "Conecta",
                  description:
                    "Inicia conversaciones significativas en nuestro chat seguro y privado, diseñado para fomentar conexiones auténticas.",
                },
                {
                  icon: <Users className="h-6 w-6 text-rose-400" />,
                  title: "Reúnete",
                  description:
                    "Cuando estés listo, lleva tu conexión al mundo real con nuestras sugerencias de citas personalizadas.",
                },
              ].map((step, index) => (
                <Card
                  key={index}
                  className="border-none bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-rose-900 rounded-full flex items-center justify-center mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-100">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4 bg-rose-900 text-rose-300 hover:bg-rose-800 transition-colors">
                Por qué elegirnos
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
                Beneficios de HeartSync
              </h2>
              <p className="text-lg text-gray-400">
                Nuestra plataforma está diseñada específicamente para crear conexiones significativas entre mujeres mayores y hombres más jóvenes.
              </p>
            </div>

            <Tabs defaultValue="mujeres" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-700">
                <TabsTrigger
                  value="mujeres"
                  className="data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:font-bold transition text-gray-300"
                >
                  Para Mujeres
                </TabsTrigger>
                <TabsTrigger
                  value="hombres"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold transition text-gray-300"
                >
                  Para Hombres
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mujeres" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Shield className="h-5 w-5 text-rose-400" />,
                      title: "Perfiles verificados",
                      description:
                        "Todos los perfiles masculinos son verificados para garantizar tu seguridad y confianza.",
                    },
                    {
                      icon: <Star className="h-5 w-5 text-rose-400" />,
                      title: "Conexiones de calidad",
                      description:
                        "Nuestro algoritmo prioriza la compatibilidad real, no solo la apariencia física.",
                    },
                    {
                      icon: <Calendar className="h-5 w-5 text-rose-400" />,
                      title: "Sugerencias personalizadas",
                      description:
                        "Recibe recomendaciones de citas basadas en tus intereses compartidos.",
                    },
                    {
                      icon: <Heart className="h-5 w-5 text-rose-400" />,
                      title: "Comunidad respetuosa",
                      description:
                        "Un espacio donde eres valorada por tu experiencia y personalidad.",
                    },
                  ].map((benefit, index) => (
                    <Card key={index} className="border-none bg-gray-800 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="mr-4 mt-1 bg-rose-900 p-2 rounded-full">
                            {benefit.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-gray-100">{benefit.title}</h3>
                            <p className="text-sm text-gray-400">{benefit.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hombres" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Shield className="h-5 w-5 text-rose-400" />,
                      title: "Conexiones auténticas",
                      description:
                        "Conoce mujeres maduras que valoran la autenticidad y la conexión genuina.",
                    },
                    {
                      icon: <Star className="h-5 w-5 text-rose-400" />,
                      title: "Experiencias enriquecedoras",
                      description:
                        "Relaciones basadas en el respeto mutuo y el crecimiento personal.",
                    },
                    {
                      icon: <Calendar className="h-5 w-5 text-rose-400" />,
                      title: "Compatibilidad real",
                      description:
                        "Nuestro algoritmo te conecta con mujeres que comparten tus valores e intereses.",
                    },
                    {
                      icon: <Heart className="h-5 w-5 text-rose-400" />,
                      title: "Orientación y apoyo",
                      description:
                        "Consejos personalizados para crear conexiones significativas.",
                    },
                  ].map((benefit, index) => (
                    <Card key={index} className="border-none bg-gray-800 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="mr-4 mt-1 bg-rose-900 p-2 rounded-full">
                            {benefit.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-gray-100">{benefit.title}</h3>
                            <p className="text-sm text-gray-400">{benefit.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4 bg-rose-900 text-rose-300 hover:bg-rose-800 transition-colors">
                Historias reales
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
                Testimonios de usuarios
              </h2>
              <p className="text-lg text-gray-400">
                Descubre cómo HeartSync ha transformado la vida de nuestros usuarios creando conexiones significativas.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card className="border-none shadow-xl bg-gradient-to-br from-rose-900 to-gray-800">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-1 bg-rose-700 rounded-full blur-sm"></div>
                      <Avatar className="w-20 h-20 border-4 border-gray-800">
                        <AvatarImage
                          src={
                            testimonials[activeTestimonialIndex].image ||
                            "/placeholder.svg"
                          }
                          alt={testimonials[activeTestimonialIndex].name}
                        />
                        <AvatarFallback className="bg-gray-600 text-gray-100">
                          {testimonials[activeTestimonialIndex].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="mb-6">
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <p className="text-xl italic text-gray-300 mb-6">
                        "{testimonials[activeTestimonialIndex].text}"
                      </p>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-100">
                          {testimonials[activeTestimonialIndex].name}, {testimonials[activeTestimonialIndex].age}
                        </h4>
                        <p className="text-gray-400">{testimonials[activeTestimonialIndex].location}</p>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestimonialIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === activeTestimonialIndex
                              ? "bg-rose-400"
                              : "bg-gray-600"
                          }`}
                          aria-label={`Ver testimonio ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4 bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors">
                Preguntas frecuentes
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Resolvemos tus dudas
              </h2>
              <p className="text-lg text-gray-600">
                Encuentra respuestas a las preguntas más comunes sobre
                HeartSync.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "¿Cómo funciona el algoritmo de compatibilidad?",
                    answer:
                      "Nuestro algoritmo analiza tus preferencias, intereses y comportamiento en la plataforma para sugerirte perfiles con alta probabilidad de compatibilidad. Consideramos factores como valores compartidos, intereses comunes y objetivos de relación similares.",
                  },
                  {
                    question: "¿Es seguro usar HeartSync?",
                    answer:
                      "Absolutamente. La seguridad es nuestra prioridad. Verificamos todos los perfiles, utilizamos encriptación de extremo a extremo en nuestros chats y nunca compartimos tu información personal con terceros. Además, ofrecemos herramientas para reportar comportamientos inapropiados.",
                  },
                  {
                    question: "¿Cuál es el rango de edad de los usuarios?",
                    answer:
                      "HeartSync está diseñado para mujeres mayores de 35 años y hombres mayores de 25 años. La mayoría de nuestras usuarias femeninas tienen entre 40-55 años, mientras que nuestros usuarios masculinos suelen tener entre 28-40 años.",
                  },
                  {
                    question: "¿Puedo usar HeartSync gratis?",
                    answer:
                      "Sí, ofrecemos una versión gratuita que te permite crear un perfil, explorar y conectar con otros usuarios. Para funciones premium como filtros avanzados, mensajes ilimitados y ver quién te ha dado like, ofrecemos suscripciones mensuales a precios accesibles.",
                  },
                  {
                    question:
                      "¿Cómo se diferencia HeartSync de otras apps de citas?",
                    answer:
                      "HeartSync es la única plataforma diseñada específicamente para conectar mujeres mayores con hombres más jóvenes. Nuestro enfoque está en crear conexiones significativas basadas en la compatibilidad real, no solo en la apariencia física.",
                  },
                ].map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-lg shadow-md"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <span className="text-left font-medium">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Comienza tu historia hoy
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Únete a miles de personas que ya han encontrado conexiones
                significativas en HeartSync.
              </p>
              <Button
                size="lg"
                className="bg-white text-rose-600 hover:bg-gray-100 rounded-full shadow-lg group"
                onClick={handleRegister}
              >
                Crear cuenta gratis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="mt-4 text-sm opacity-80">
                No se requiere tarjeta de crédito. Cancela cuando quieras.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <a href="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-md flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" fill="white" />
                </div>
                <span className="font-bold text-xl">HeartSync</span>
              </a>
              <p className="text-gray-400 mb-6">
                Conectando corazones, creando historias significativas entre
                generaciones.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href={`#${social}`}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      {/* Aquí irían los iconos de redes sociales */}
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Compañía</h4>
              <ul className="space-y-3">
                {["Sobre Nosotros", "Equipo", "Carreras", "Blog", "Prensa"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  "Términos de Servicio",
                  "Política de Privacidad",
                  "Cookies",
                  "Licencias",
                  "Configuración de Privacidad",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Soporte</h4>
              <ul className="space-y-3">
                {[
                  "Centro de Ayuda",
                  "Contacto",
                  "FAQ",
                  "Comunidad",
                  "Guías de Uso",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} HeartSync. Todos los derechos
              reservados.
            </p>
            <p className="mt-2">Hecho con ❤️ para conexiones auténticas</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
