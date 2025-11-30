"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordInner() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Verificar token al cargar la página
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setError("Token de recuperación no encontrado");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setTokenValid(data.valid);

        if (!data.valid) {
          setError(data.error || "El enlace de recuperación es inválido o ha expirado");
        }
      } catch (error) {
        console.error("Error verificando token:", error);
        setTokenValid(false);
        setError("Error al verificar el enlace de recuperación");
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    // Validar fortaleza de la contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Error al restablecer la contraseña");
      }
    } catch (error) {
      console.error("Error en reset password:", error);
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Indicadores de fortaleza de contraseña
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

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
        <Link
          href="/login"
          className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors mb-6 md:mb-8 lg:mb-12"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          <span className="font-medium text-lg md:text-base lg:text-lg">Volver al login</span>
        </Link>

        {/* Reset Password Card */}
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
            <br />
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-4">
              Restablecer contraseña
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-xl xl:text-2xl">
              Crea una nueva contraseña segura para tu cuenta
            </p>
            <br />
            <br />
          </div>

          <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            {/* Verificando token */}
            {tokenValid === null && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Verificando enlace...</span>
              </div>
            )}

            {/* Token inválido */}
            {tokenValid === false && (
              <div className="space-y-6">
                <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 text-sm md:text-base lg:text-lg">
                        Enlace inválido o expirado
                      </h3>
                      <p className="text-red-700 text-xs md:text-sm lg:text-base mt-1">
                        {error || "Este enlace de recuperación ya no es válido. Por favor solicita uno nuevo."}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/forgot-password"
                  className="block w-full py-2.5 md:py-3 lg:py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-md md:text-base lg:text-xl rounded-xl lg:rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                >
                  Solicitar nuevo enlace
                </Link>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800 text-sm md:text-base lg:text-lg">
                      ¡Contraseña restablecida!
                    </h3>
                    <p className="text-green-700 text-xs md:text-sm lg:text-base mt-1">
                      Tu contraseña ha sido actualizada exitosamente. Serás redirigido al login en unos segundos...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && !success && tokenValid !== false && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm lg:text-base">
                {error}
              </div>
            )}

            {/* Reset Password Form */}
            {tokenValid === true && !success && (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 lg:space-y-8">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-2 lg:mb-4">
                    Nueva contraseña
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
                      {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength
                                ? passwordStrength <= 2
                                  ? "bg-red-500"
                                  : passwordStrength <= 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs md:text-sm mt-1 text-gray-600">
                        {passwordStrength <= 2 && "Contraseña débil"}
                        {passwordStrength === 3 && "Contraseña media"}
                        {passwordStrength >= 4 && "Contraseña fuerte"}
                      </p>
                    </div>
                  )}

                  <p className="mt-2 text-xs md:text-sm text-gray-500">
                    Mínimo 8 caracteres, con mayúsculas, minúsculas y números
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-2 lg:mb-4">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-sm md:text-base lg:text-lg text-black rounded-xl lg:rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white/70 pr-10 md:pr-12 lg:pr-16"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 lg:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-xs md:text-sm text-red-600">Las contraseñas no coinciden</p>
                  )}
                </div>

                <br />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || password !== confirmPassword}
                  className="w-full py-2.5 md:py-3 lg:py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-md md:text-base lg:text-xl rounded-xl lg:rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Restableciendo contraseña...</span>
                    </div>
                  ) : (
                    "Restablecer contraseña"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center">Cargando…</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}