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
  const [comicMode, setComicMode] = useState(false);

  const comicPhrases = [
    "¡Lánzate al amor!",
    "¡Dale un corazón épico!",
    "¡Atrévete o quédate forever alone!",
    "¡Cupidazo incoming!",
  ];

  const getRandomPhrase = () => comicPhrases[Math.floor(Math.random() * comicPhrases.length)];

  const toggleComicMode = () => {
    setComicMode(!comicMode);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const stats = [
    { value: "10K+", label: "Usuarios activos" },
    { value: "85%", label: "Tasa de éxito" },
    { value: "4.8", label: "Calificación promedio" },
  ];

  const handleNavigation = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    window.location.href = "/registro";
  };

  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const target = new Date(targetDate);
        const diff = target - now;
        if (diff <= 0) {
          clearInterval(interval);
          return;
        }
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [targetDate]);

    return (
      <div className="flex justify-center gap-4">
        <div>{timeLeft.days}d</div>
        <div>{timeLeft.hours}h</div>
        <div>{timeLeft.minutes}m</div>
        <div>{timeLeft.seconds}s</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
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
            <Button
              onClick={toggleComicMode}
              className="ml-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
            >
              {comicMode ? "Desactivar Modo Cómico 😜" : "Activar Modo Cómico 😜"}
            </Button>
          </div>
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
                  {comicMode ? getRandomPhrase() : "Registrarse"}
                </Button>
                <Button
                  onClick={toggleComicMode}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {comicMode ? "Desactivar Modo Cómico 😜" : "Activar Modo Cómico 😜"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="pt-16">
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
                    {comicMode ? getRandomPhrase() : "Comenzar ahora"}
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
          <div className="container mx-auto px-4 mt-16">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-100">Nuestras Estadísticas</h3>
              <canvas id="stats-chart" height="200"></canvas>
              ```chartjs
              {
                "type": "bar",
                "data": {
                  "labels": ["Usuarios Activos", "Tasa de Éxito", "Calificación"],
                  "datasets": [{
                    "label": "Estadísticas",
                    "data": [10000, 85, 4.8],
                    "backgroundColor": ["#f43f5e", "#f43f5e", "#f43f5e"],
                    "borderColor": ["#1f2937", "#1f2937", "#1f2937"],
                    "borderWidth": 1
                  }]
                },
                "options": {
                  "scales": {
                    "y": { "beginAtZero": true, "ticks": { "color": "#ffffff" } },
                    "x": { "ticks": { "color": "#ffffff" } }
                  },
                  "plugins": { "legend": { "display": false } }
                }
              }
              ```
            </div>
          </div>
        </section>
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
                              : "bg