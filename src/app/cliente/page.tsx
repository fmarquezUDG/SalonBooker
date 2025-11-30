// app/cliente/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  User, 
  Clock, 
  Scissors, 
  Bell, 
  Search,
  Plus,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Menu,
  LogOut,
  Sparkles,
  History,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

// Tipos de datos
interface Cita {
  id: number;
  servicio: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  monto: string;
  salon: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion: string;
  precio: string;
}

interface UserInfo {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  salon: {
    id: number;
    nombre: string;
    direccion: string;
    contacto: string;
  };
}

interface Estadisticas {
  citasProximas: number;
  citasCompletadas: number;
  totalGastado: string;
}

export default function ClienteDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    citasProximas: 0,
    citasCompletadas: 0,
    totalGastado: '$0'
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Estados para modal de nueva cita
  const [showCitaModal, setShowCitaModal] = useState(false);
  const [citaForm, setCitaForm] = useState({
    servicio_id: '',
    fecha: '',
    hora: ''
  });

  // PROTECCIÓN DE RUTA - Verificar autenticación
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    console.log('👤 Usuario en cliente:', user);

    if (user.tipo_usuario !== 'usuario') {
      console.log('❌ Acceso denegado - No es cliente');
      
      if (user.tipo_usuario === 'admin_app') {
        router.push('/super-admin');
      } else if (user.tipo_usuario === 'admin_salon') {
        router.push('/admin-salon');
      } else {
        router.push('/login');
      }
      return;
    }

    if (!user.salon || !user.salon.id) {
      console.log('❌ Error - No tiene salón asignado');
      alert('Error: No tienes un salón asignado');
      router.push('/login');
      return;
    }

    console.log('✅ Acceso autorizado a cliente');
    setIsAuthorized(true);
    setUserInfo(user);
    
    if (user.id && user.salon.id) {
      fetchClienteData(user.id, user.salon.id);
    }
  }, [router]);

  const fetchClienteData = async (userId: number, salonId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener servicios del salón
      const serviciosRes = await fetch(`/api/salon/${salonId}/servicios`);
      if (serviciosRes.ok) {
        const serviciosData = await serviciosRes.json();
        setServicios(serviciosData);
      }

      // Obtener citas del cliente
      const citasRes = await fetch(`/api/cliente/${userId}/citas`);
      if (citasRes.ok) {
        const citasData = await citasRes.json();
        setCitas(citasData);
        
        // Calcular estadísticas
        const proximas = citasData.filter((c: Cita) => 
          c.estado === 'confirmada' || c.estado === 'pendiente'
        ).length;
        
        const completadas = citasData.filter((c: Cita) => 
          c.estado === 'completada'
        ).length;
        
        setEstadisticas({
          citasProximas: proximas,
          citasCompletadas: completadas,
          totalGastado: '$0' // Se calculará desde la BD
        });
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAgendarCita = async () => {
    if (!userInfo) return;

    if (!citaForm.servicio_id || !citaForm.fecha || !citaForm.hora) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch(`/api/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: userInfo.id,
          salon_id: userInfo.salon.id,
          servicio_id: parseInt(citaForm.servicio_id),
          fecha: citaForm.fecha,
          hora: citaForm.hora
        })
      });

      if (response.ok) {
        alert('✅ Cita agendada exitosamente');
        setShowCitaModal(false);
        setCitaForm({ servicio_id: '', fecha: '', hora: '' });
        fetchClienteData(userInfo.id, userInfo.salon.id);
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'No se pudo agendar la cita'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  if (!isAuthorized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">{!isAuthorized ? 'Verificando acceso...' : 'Cargando dashboard...'}</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar tu información</p>
          <Link href="/login" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-purple-300 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-pink-300 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Modal Agendar Cita */}
      {showCitaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Agendar Cita</h3>
              <button onClick={() => setShowCitaModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Servicio *</label>
                <select
                  value={citaForm.servicio_id}
                  onChange={(e) => setCitaForm({...citaForm, servicio_id: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-black"
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} - {servicio.precio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
                <input
                  type="date"
                  value={citaForm.fecha}
                  onChange={(e) => setCitaForm({...citaForm, fecha: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
                <select
                  value={citaForm.hora}
                  onChange={(e) => setCitaForm({...citaForm, hora: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-black"
                >
                  <option value="">Selecciona una hora</option>
                  {Array.from({ length: 10 }, (_, i) => i + 9).map((hour) => (
                    <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCitaModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAgendarCita}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg font-semibold"
                >
                  Agendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="px-4 py-3">
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
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {userInfo.salon.nombre}
                </h1>
                <p className="text-sm text-gray-600">Hola, {userInfo.nombre}</p>
              </div>
            </div>

            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-6 h-6 text-pink-500" />
            </button>

            <div className="hidden md:flex items-center space-x-4">
              <button className="relative p-3 text-gray-600 hover:text-purple-600 transition-colors bg-white/70 rounded-full border-2 border-gray-200 hover:border-purple-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {userInfo.nombre.charAt(0)}
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden mt-3 bg-white/95 rounded-xl shadow-lg border border-purple-100">
              <div className="p-3 space-y-1">
                {['inicio', 'citas', 'servicios', 'perfil'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {setActiveTab(tab); setMenuOpen(false);}}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'inicio' && <Calendar className="w-5 h-5" />}
                    {tab === 'citas' && <History className="w-5 h-5" />}
                    {tab === 'servicios' && <Scissors className="w-5 h-5" />}
                    {tab === 'perfil' && <User className="w-5 h-5" />}
                    <span className="font-medium capitalize">{tab}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 p-3">
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 lg:w-80 bg-white/70 backdrop-blur-sm border-r border-purple-100 min-h-screen p-6 relative">
          <nav className="space-y-2">
            {[
              { id: 'inicio', icon: Calendar, label: 'Inicio' },
              { id: 'citas', icon: History, label: 'Mis Citas' },
              { id: 'servicios', icon: Scissors, label: 'Servicios' },
              { id: 'perfil', icon: User, label: 'Mi Perfil' },
            ].map(({id, icon: Icon, label}) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-white/80 hover:shadow-md'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-semibold text-lg">{label}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="w-full flex items-center space-x-3 px-6 py-4 text-red-600 hover:text-white hover:bg-red-600 transition-colors rounded-2xl border border-red-200"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-medium text-lg">Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 relative">
          {/* Inicio Tab */}
          {activeTab === 'inicio' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-purple-100 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  ¡Hola, <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{userInfo.nombre}!</span>
                </h2>
                <p className="text-gray-600">Bienvenido a {userInfo.salon.nombre}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 font-semibold mb-2">Próximas Citas</p>
                      <p className="text-4xl font-bold text-gray-900">{estadisticas.citasProximas}</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 font-semibold mb-2">Completadas</p>
                      <p className="text-4xl font-bold text-gray-900">{estadisticas.citasCompletadas}</p>
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 font-semibold mb-2">Total Gastado</p>
                      <p className="text-4xl font-bold text-gray-900">{estadisticas.totalGastado}</p>
                    </div>
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowCitaModal(true)}
                    className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all"
                  >
                    <Plus className="w-8 h-8" />
                    <div className="text-left">
                      <p className="font-bold text-lg">Agendar Cita</p>
                      <p className="text-sm opacity-90">Reserva tu próximo servicio</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('servicios')}
                    className="flex items-center space-x-4 p-6 bg-white border-2 border-purple-200 text-gray-900 rounded-2xl hover:shadow-lg transition-all"
                  >
                    <Scissors className="w-8 h-8 text-purple-600" />
                    <div className="text-left">
                      <p className="font-bold text-lg">Ver Servicios</p>
                      <p className="text-sm text-gray-600">Explora nuestros servicios</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Próximas Citas */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Próximas Citas</h3>
                  <button 
                    onClick={() => setActiveTab('citas')}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Ver todas
                  </button>
                </div>
                
                {citas.filter(c => c.estado === 'confirmada' || c.estado === 'pendiente').length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes citas próximas</p>
                    <button 
                      onClick={() => setShowCitaModal(true)}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg"
                    >
                      Agendar Cita
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {citas
                      .filter(c => c.estado === 'confirmada' || c.estado === 'pendiente')
                      .slice(0, 3)
                      .map((cita) => (
                      <div key={cita.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{cita.servicio}</p>
                          <p className="text-sm text-gray-600">{cita.salon}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-sm font-medium text-gray-900">{cita.fecha}</p>
                          <p className="text-sm text-gray-600">{cita.hora}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cita.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Citas Tab */}
          {activeTab === 'citas' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Mis Citas</h2>
                <button 
                  onClick={() => setShowCitaModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nueva Cita</span>
                </button>
              </div>

              {citas.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No tienes citas registradas</p>
                  <p className="text-gray-500 text-sm mt-2">Agenda tu primera cita</p>
                  <button 
                    onClick={() => setShowCitaModal(true)}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg"
                  >
                    Agendar Primera Cita
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {citas.map((cita) => (
                    <div key={cita.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                            <Scissors className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{cita.servicio}</h3>
                            <p className="text-sm text-gray-600">{cita.salon}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                          cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          cita.estado === 'completada' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cita.estado}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha</p>
                            <p className="text-sm font-semibold text-gray-900">{cita.fecha}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Hora</p>
                            <p className="text-sm font-semibold text-gray-900">{cita.hora}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-lg font-bold text-green-600">{cita.monto}</p>
                        {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                          <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold">
                            Cancelar Cita
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Servicios Tab */}
          {activeTab === 'servicios' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Servicios Disponibles</h2>

              {servicios.length === 0 ? (
                <div className="text-center py-12">
                  <Scissors className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No hay servicios disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicios.map((servicio) => (
                    <div key={servicio.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow hover:shadow-xl transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-4">
                        <Scissors className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="font-bold text-xl text-gray-900 mb-2">{servicio.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-4">{servicio.descripcion || 'Sin descripción'}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Duración</p>
                          <p className="text-sm font-semibold text-gray-900">{servicio.duracion}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Precio</p>
                          <p className="text-2xl font-bold text-green-600">{servicio.precio}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setCitaForm({...citaForm, servicio_id: servicio.id.toString()});
                          setShowCitaModal(true);
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg font-semibold"
                      >
                        Agendar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Perfil Tab */}
          {activeTab === 'perfil' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h2>

              <div className="space-y-6">
                {/* Información Personal */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="font-semibold text-gray-900">{userInfo.nombre}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900">{userInfo.email}</p>
                      </div>
                    </div>

                    {userInfo.telefono && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="font-semibold text-gray-900">{userInfo.telefono}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del Salón */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Mi Salón</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Scissors className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Salón</p>
                        <p className="font-semibold text-gray-900">{userInfo.salon.nombre}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="font-semibold text-gray-900">{userInfo.salon.direccion}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contacto</p>
                        <p className="font-semibold text-gray-900">{userInfo.salon.contacto}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón Editar Perfil */}
                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg font-semibold">
                  Editar Perfil
                </button>
              </div>
            </div>
          )}
        </main>
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