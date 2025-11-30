"use client";

import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar mensaje de éxito
        setSuccess(true);
        setEmail(""); // Limpiar el campo
      } else {
        // Mostrar error
        setError(data.error || 'Error al enviar el correo de recuperación');
      }
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
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
        {/* Back to login link */}
        <Link href="/login" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors mb-6 md:mb-8 lg:mb-12">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          <span className="font-medium text-lg md:text-base lg:text-lg">Volver al login</span>
        </Link>

        {/* Forgot Password Card */}
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
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-4">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-xl xl:text-2xl">
              No te preocupes, te enviaremos instrucciones para recuperarla
            </p>
            <br/><br/>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800 text-sm md:text-base lg:text-lg">
                    ¡Correo enviado!
                  </h3>
                  <p className="text-green-700 text-xs md:text-sm lg:text-base mt-1">
                    Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.
                  </p>
                  <p className="text-green-600 text-xs md:text-sm lg:text-base mt-2">
                    Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm lg:text-base">
              {error}
            </div>
          )}

          {/* Forgot Password Form */}
          <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 lg:space-y-8">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-2 lg:mb-4">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 lg:pl-5 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 md:pl-12 lg:pl-16 pr-3 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg text-black rounded-xl lg:rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white/70"
                      placeholder="tu@correo.com"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs md:text-sm lg:text-base text-gray-500">
                    Ingresa el correo asociado a tu cuenta
                  </p>
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
                      <span>Enviando correo...</span>
                    </div>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {/* Botón para reenviar */}
                <button
                  onClick={() => setSuccess(false)}
                  className="w-full py-2.5 md:py-3 lg:py-5 bg-white text-purple-600 font-bold text-md md:text-base lg:text-xl rounded-xl lg:rounded-2xl border-2 border-purple-600 hover:bg-purple-50 hover:shadow-lg transition-all duration-300"
                >
                  Enviar de nuevo
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="my-4 md:my-6 lg:my-10 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 md:px-4 lg:px-6 text-sm md:text-md lg:text-base text-gray-500">o</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Back to Login */}
            <div className="mt-6 md:mt-8 lg:mt-12 text-center">
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                ¿Recordaste tu contraseña?{" "}
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            {/* Help section */}
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-purple-50 rounded-xl lg:rounded-2xl border border-purple-100">
              <h3 className="font-semibold text-purple-900 text-sm md:text-base lg:text-lg mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-purple-700 text-xs md:text-sm lg:text-base">
                Si tienes problemas para recuperar tu cuenta, contacta con nuestro equipo de soporte a través de{" "}
                <a href="mailto:soporte@salonbooker.com" className="underline hover:text-purple-900">
                  soporte@salonbooker.com
                </a>
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