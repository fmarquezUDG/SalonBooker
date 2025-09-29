"use client";
import React from "react";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      if (response.ok) {
        // Login exitoso - redirigir según tipo de usuario
        console.log('Login exitoso:', data);
        
        // Opcional: Guardar datos del usuario en localStorage o contexto
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirigir a la página correspondiente
        router.push(data.redirectUrl);
      } else {
        // Mostrar error
        setError(data.error || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para login rápido de prueba
  const handleQuickLogin = async (tipoUsuario: string) => {
    setIsLoading(true);
    setError("");
    
    // Credenciales de prueba según el tipo de usuario
    const credencialesPrueba = {
      'admin_app': { email: 'super@admin.com', password: 'admin123' },
      'admin_salon': { email: 'admin@salon.com', password: 'salon123' },
      'usuario': { email: 'cliente@test.com', password: 'cliente123' }
    };

    const credenciales = credencialesPrueba[tipoUsuario as keyof typeof credencialesPrueba];
    
    if (credenciales) {
      setEmail(credenciales.email);
      setPassword(credenciales.password);
      
      // Ejecutar el login automáticamente
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credenciales),
        });

        const data = await response.json();

        if (response.ok) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          router.push(data.redirectUrl);
        } else {
          setError(data.error || 'Error en el login de prueba');
        }
      } catch (error) {
        setError('Error de conexión. Inténtalo de nuevo.');
      }
    }
    
    setIsLoading(false);
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
              {/* Email Field */}
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

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-2 lg:mb-4">
                  Contraseña
                </label>
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
                    {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" />}
                  </button>
                </div>
              </div>
              <br/>
              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm md:text-md lg:text-base text-gray-600">Recordarme</span>
                </label>
                <Link href="/forgot-password" className="text-sm md:text-md lg:text-base text-purple-600 hover:text-purple-700 font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <br/>
              {/* Submit Button */}
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

            {/* Divider */}
            <div className="my-4 md:my-6 lg:my-10 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 md:px-4 lg:px-6 text-sm md:text-md lg:text-base text-gray-500">o continúa con</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Register Link */}
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