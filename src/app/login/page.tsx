"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular llamada a API
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login attempt:", { email, password });
    }, 2000);
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
            <div className="flex justify-center mb-4 lg:mb-8">

            </div>
            <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 lg:mb-4">
              SalonBooker
            </h1>
            <br/>
            <p className="text-gray-600 text-md md:text-base lg:text-xl xl:text-2xl">Inicia sesión en tu cuenta</p>
            <br/><br/>
          </div>

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
                    className="w-full px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-sm md:text-base lg:text-lg  text-black rounded-xl lg:rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white/70 pr-10 md:pr-12 lg:pr-16"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 lg:right-3 top-3 transform -translate-y-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-8 h-8 md:w-8 md:h-8 lg:w-8 lg:h-8" /> : <Eye className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <br/><br/><br/>
                  <span className="ml-2 text-sm md:text-md lg:text-base text-gray-600">Recordarme</span>
                </label>
                <Link href="/forgot-password" className="text-sm md:text-md lg:text-base text-purple-600 hover:text-purple-700 font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

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
              <br/><br/>
              <span className="px-3 md:px-4 lg:px-6 text-sm md:text-md lg:text-base text-gray-500">o continúa con</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-2 md:space-y-3 lg:space-y-4">
                <br/>
              <button className="w-full flex items-center justify-center space-x-2 md:space-x-3 lg:space-x-4 py-2.5 md:py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>             
                <span className="font-medium text-gray-700 text-sm md:text-base lg:text-lg">Continuar con Google</span>
              </button>
                <br/>
            </div>

            {/* Register Link */}
            <div className="mt-6 md:mt-8 lg:mt-12 text-center">
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Regístrate aquí
                </Link>
              </p>
              <br/>
            </div>
          </div>
        </div>

        {/* User Type Quick Access */}
        <div className="mt-4 md:mt-6 lg:mt-12 bg-white/70 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-3 md:p-4 lg:p-8 border border-purple-100">
        <br/>
          <h3 className="text-xs md:text-sm lg:text-lg font-semibold text-gray-700 mb-2 md:mb-3 lg:mb-6 text-center">Acceso rápido de prueba</h3>
          <div className="grid grid-cols-3 gap-1 md:gap-2 lg:gap-4 text-xs max-w-2xl mx-auto">
            <button className="px-1.5 py-1.5 md:px-2 md:py-2 lg:px-6 lg:py-4 bg-purple-100 text-purple-700 rounded-lg lg:rounded-xl hover:bg-purple-200 transition-colors text-xs lg:text-base font-medium">
              Super Admin
            </button>
            <button className="px-1.5 py-1.5 md:px-2 md:py-2 lg:px-6 lg:py-4 bg-pink-100 text-pink-700 rounded-lg lg:rounded-xl hover:bg-pink-200 transition-colors text-xs lg:text-base font-medium">
              Admin Salón
            </button>
            <button className="px-4 py-4 md:px-4 md:py-4 lg:px-6 lg:py-4 bg-gray-100 text-gray-700 rounded-lg lg:rounded-xl hover:bg-gray-200 transition-colors text-xs lg:text-base font-medium">
              Cliente
            </button>
            <br/><br/>
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