// app/login/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📥 Respuesta del servidor:', data);

      if (response.ok && data.success) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Usuario guardado en localStorage');
        console.log('👤 Tipo de usuario:', data.user.tipo_usuario);
        console.log('🏢 Salón:', data.user.salon);
        
        // Redireccionar según tipo de usuario usando window.location
        let redirectUrl = '/';
        
        if (data.user.tipo_usuario === 'admin_app') {
          redirectUrl = '/super-admin';
        } else if (data.user.tipo_usuario === 'admin_salon') {
          redirectUrl = '/admin-salon';
        } else if (data.user.tipo_usuario === 'usuario') {
          redirectUrl = '/cliente';
        }
        
        console.log('🔄 Redirigiendo a:', redirectUrl);
        
        // Usar window.location.href para redirección forzada
        window.location.href = redirectUrl;
        
      } else {
        setError(data.error || 'Credenciales inválidas');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 flex items-center justify-center p-4 lg:p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-purple-300 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-pink-300 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl">
        {/* Back to home link */}
        <Link href="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors mb-6 md:mb-8 lg:mb-12">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          <span className="font-medium text-lg md:text-base lg:text-lg">Volver al inicio</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 lg:p-16 xl:p-24 border border-purple-100">
          {/* Logo and Title */}
          <div className="flex items-center justify-center shadow-lg">
            <Image 
              src="/salonbooker.png" 
              alt="SalonBooker" 
              width={300}
              height={250}
              className="object-contain md:w-[60px] md:h-[60px] lg:w-[120px] lg:h-[120px] xl:w-[150px] xl:h-[150px]"
            />
          </div>
          <div className="text-center mb-6 md:mb-8 lg:mb-16">
            <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 lg:mb-4">
              SalonBooker
            </h1>
            <br/>
            <p className="text-gray-600 text-md md:text-base lg:text-xl xl:text-2xl">Inicia sesión en tu cuenta</p>
            <br/><br/>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm lg:text-base">
              {error}
            </div>
          )}

          {/* Login Form */}
          <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 lg:space-y-8">
              <div>
                <label htmlFor="email" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-2 lg:mb-4">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-sm md:text-base lg:text-lg text-black rounded-xl lg:rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white/70"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 lg:mb-4">
                  <label htmlFor="password" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700">
                    Contraseña
                  </label>
                  <Link href="/forgot-password" className="text-sm md:text-base lg:text-lg text-purple-600 hover:text-purple-700 font-semibold">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-sm md:text-base lg:text-lg text-black rounded-xl lg:rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white/70 pr-10 md:pr-12 lg:pr-16"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 lg:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
                  </button>
                </div>
              </div>

              <br/>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 md:py-3 lg:py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-md md:text-base lg:text-xl rounded-xl lg:rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            <div className="my-4 md:my-6 lg:my-10 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 md:px-4 lg:px-6 text-sm md:text-md lg:text-base text-gray-500">o</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="mt-6 md:mt-8 lg:mt-12 text-center">
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

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