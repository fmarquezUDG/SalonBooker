"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, BarChart3, Shield, Clock, Star, Sparkles, Scissors, Heart, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import Image from 'next/image';
import { Menu } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-pink-200">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="items-center justify-center relative">
              <Image 
                src="/salonbooker.png" 
                alt="SalonBooker" 
                width={500}
                height={500}
                className="object-contain"
                onError={() => {
                  // Fallback handled by Next.js
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-8 h-8 bg-white rounded-full animate-bounce"></div>
            <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="bg-pink-200 text-gray-900 min-h-screen overflow-x-hidden">
      {/* Navigation */}
      
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-pink-200' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-[70px] h-[70px] md:w-24 md:h-24 flex items-center justify-center relative">
                  <Image 
                    src="/salonbooker.png" 
                    alt="SalonBooker" 
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                  <Scissors className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <h1 className="hidden md:block text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                SalonBooker
              </h1>
            </div>
                        
            {/* Botón hamburguesa solo en móvil */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              <Menu className="w-8 h-8 text-pink-500" />
            </button>

            {/* Menú horizontal en desktop */}
            <ul className="hidden md:flex menu menu-horizontal bg-white/80 rounded-box shadow-lg px-4 py-2 items-center space-x-10 lg:space-x-20">
              <li>
                <a
                  href="#features"
                  className="px-8 py-3 rounded-full font-extrabold text-xl text-pink-500 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 transition-all duration-300 border border-transparent hover:border-purple-200"
                >
                  Características
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="px-8 py-3 rounded-full font-extrabold text-xl text-pink-500 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 hover:text-purple-700 transition-all duration-300 border border-transparent hover:border-pink-200"
                >
                  Testimonios
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="px-8 py-3 rounded-full font-extrabold text-xl text-pink-500 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 transition-all duration-300 border border-transparent hover:border-purple-200"
                >
                  Precios
                </a>
              </li>
            </ul>

            {/* Menú vertical hamburguesa en móvil */}
            {menuOpen && (
              <ul className="absolute top-20 left-0 w-full flex flex-col items-center bg-white/95 rounded-b-2xl shadow-lg z-50 md:hidden">
                <li>
                  <a
                    href="#features"
                    className="block w-full text-center px-6 py-4 font-bold text-base text-pink-500 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 border-b border-pink-100 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Características
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="block w-full text-center px-6 py-4 font-bold text-base text-pink-500 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 hover:text-purple-700 border-b border-pink-100 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Testimonios
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="block w-full text-center px-6 py-4 font-bold text-base text-pink-500 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Precios
                  </a>
                </li>
              </ul>
            )}
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="px-4 py-2 text-base text-purple-600 border-2 border-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold md:px-8 md:py-3 md:text-xl">
                Iniciar Sesión
              </button>
              <button className="px-4 py-2 text-base bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold md:px-8 md:py-3 md:text-xl">
                Prueba Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 text-center z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xl font-semibold border border-purple-200">
                <span className="block md:hidden">
                  <br /><br /><br /><br />
                </span>
                ✨ La evolución de los salones de belleza
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="block text-gray-900 mb-2">Transforma tu</span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-purple-800 bg-clip-text text-transparent">
                Salón de Belleza
              </span>
              <span className="block text-gray-900 text-5xl md:text-6xl lg:text-7xl">con IA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Gestiona citas, clientes y pagos de forma inteligente. 
              <span className="text-purple-600 font-semibold"> Aumenta tus ventas hasta un 40%</span> con 
              nuestro sistema de gestión todo-en-uno.
            </p>
            <br></br><br></br>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-bold flex items-center space-x-2">
                <span>Comenzar Gratis - 14 días</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            <br></br><br></br>
              
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Salones Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-500 mb-2">50K+</div>
                <div className="text-gray-600">Citas Gestionadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">4.9★</div>
                <div className="text-gray-600">Valoración Media</div>
              </div>
              <br></br><br></br>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-purple-600 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-purple-600 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Funcionalidades que
              <br></br><br></br>
              <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Enamoran
              </span>
              <br></br>
            </h2>
            <br></br>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diseñado por expertos en belleza, potenciado por inteligencia artificial
            </p>
            <br></br><br></br>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Agenda Inteligente",
                description: "IA que optimiza horarios y maximiza ocupación automáticamente",
                color: "from-purple-600 to-pink-500",
                bgColor: "from-purple-50 to-pink-50"
              },
              {
                icon: Users,
                title: "CRM Personalizado",
                description: "Historial completo, preferencias y recomendaciones automáticas",
                color: "from-pink-500 to-purple-600",
                bgColor: "from-pink-50 to-purple-50"
              },
              {
                icon: Sparkles,
                title: "Experiencia Premium",
                description: "Interfaz que refleja la elegancia de tu salón",
                color: "from-pink-500 to-purple-600",
                bgColor: "from-pink-50 to-purple-50"
              }
            ].map((feature, index) => (
              <div key={index} className={`group p-8 rounded-3xl bg-gradient-to-br ${feature.bgColor} border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300`}>
                  <feature.icon className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <br></br><br></br><br></br><br></br>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-white">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl font-bold mb-8">¿Por qué elegir SalonBooker?</h3>
                <div className="space-y-4">
                  {[
                    "Aumenta ingresos hasta 40%",
                    "Reduce no-shows en 60%",
                    "Ahorra 2 horas diarias",
                    "Mejora satisfacción del cliente"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-yellow-300" />
                      <span className="text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">14</div>
                <div className="text-xl">Días de prueba gratuita</div>
                <div className="text-lg opacity-90">Sin tarjeta de crédito</div>
                <button className="mt-6 px-8 py-4 bg-white text-purple-600 rounded-2xl hover:bg-gray-100 transition-colors font-bold">
                  Empezar Ahora
                </button>
                <br></br><br></br><br></br><br></br>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="items-center justify-center relative">
                  <Image 
                    src="/salonbooker.png" 
                    alt="SalonBooker" 
                    width={70}
                    height={70}
                    className="object-contain"
                    onError={() => {
                      // Fallback handled by Next.js
                    }}
                  />
                </div>
                <span className="text-2xl font-bold">SalonBooker</span>
              </div>
              <p className="text-gray-400 text-lg mb-6">
                La plataforma líder en gestión de salones de belleza. 
                Transformamos la forma en que los salones operan y crecen.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 SalonBooker. Todos los derechos reservados.
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Producto</h4>
              <div className="space-y-2 text-gray-400">
                <div>Características</div>
                <div>Precios</div>
                <div>Integraciones</div>
                <div>API</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <div className="space-y-2 text-gray-400">
                <div>Centro de Ayuda</div>
                <div>Contacto</div>
                <div>Estado del Sistema</div>
                <div>Privacidad</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}