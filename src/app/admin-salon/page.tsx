// app/admin-salon/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Scissors, 
  TrendingUp, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Menu,
  LogOut,
  Sparkles,
  BarChart3,
  X
} from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

// Tipos de datos
interface Cita {
  id: number;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  monto: string;
}

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  ultimaVisita: string;
  totalGastado: string;
  citasRealizadas: number;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string; // Opcional
  duracion: string;
  precio: string;
  activo: boolean;
}

interface Estadisticas {
  citasHoy: number;
  citasSemana: number;
  ingresosMes: string;
  clientesActivos: number;
  cambios: {
    citas: string;
    ingresos: string;
    clientes: string;
  };
}

interface SalonInfo {
  id: number;
  nombre: string;
  direccion: string;
  contacto: string;
  aprobado: boolean;
}

export default function AdminSalonDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    citasHoy: 0,
    citasSemana: 0,
    ingresosMes: '$0',
    clientesActivos: 0,
    cambios: {
      citas: '+0%',
      ingresos: '+0%',
      clientes: '+0%'
    }
  });
  const [salonInfo, setSalonInfo] = useState<SalonInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Estados para modales
  const [showServicioModal, setShowServicioModal] = useState(false);
  const [servicioForm, setServicioForm] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: ''
  });

  // PROTECCIÓN DE RUTA - Verificar autenticación
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    console.log('👤 Usuario en admin-salon:', user);

    if (user.tipo_usuario !== 'admin_salon') {
      console.log('❌ Acceso denegado - No es admin_salon');
      
      if (user.tipo_usuario === 'admin_app') {
        router.push('/super-admin');
      } else if (user.tipo_usuario === 'usuario') {
        router.push('/cliente');
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

    console.log('✅ Acceso autorizado a admin-salon');
    setIsAuthorized(true);
    setSalonInfo(user.salon);
    
    if (user.salon.id) {
      fetchDashboardData(user.salon.id);
    }
  }, [router]);

  const fetchDashboardData = async (salonId: number) => {
    try {
      setLoading(true);
      setError(null);

      const [citasRes, clientesRes, serviciosRes, statsRes] = await Promise.all([
        fetch(`/api/salon/${salonId}/citas`),
        fetch(`/api/salon/${salonId}/clientes`),
        fetch(`/api/salon/${salonId}/servicios`),
        fetch(`/api/salon/${salonId}/estadisticas`)
      ]);

      if (citasRes.ok) {
        const citasData = await citasRes.json();
        setCitas(citasData);
      }

      if (clientesRes.ok) {
        const clientesData = await clientesRes.json();
        setClientes(clientesData);
      }

      if (serviciosRes.ok) {
        const serviciosData = await serviciosRes.json();
        setServicios(serviciosData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setEstadisticas(statsData);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarServicio = async () => {
    if (!salonInfo) return;

    try {
      const response = await fetch(`/api/salon/${salonInfo.id}/servicios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...servicioForm,
          salon_id: salonInfo.id
        })
      });

      if (response.ok) {
        alert('✅ Servicio agregado exitosamente');
        setShowServicioModal(false);
        setServicioForm({ nombre: '', descripcion: '', duracion: '', precio: '' });
        fetchDashboardData(salonInfo.id);
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'No se pudo agregar el servicio'));
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

  if (!salonInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la información del salón</p>
          <Link href="/login" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  if (!salonInfo.aprobado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md text-center shadow-2xl border border-purple-100">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Salón Pendiente de Aprobación</h2>
          <p className="text-gray-600 mb-4">
            Tu salón <strong>{salonInfo.nombre}</strong> está siendo revisado por nuestro equipo.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Recibirás una notificación una vez que sea aprobado.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Cerrar Sesión
          </button>
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

      {/* Modal Agregar Servicio */}
      {showServicioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Nuevo Servicio</h3>
              <button onClick={() => setShowServicioModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Servicio *</label>
                <input
                  type="text"
                  value={servicioForm.nombre}
                  onChange={(e) => setServicioForm({...servicioForm, nombre: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-black"
                  placeholder="Ej: Corte de Cabello"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={servicioForm.descripcion}
                  onChange={(e) => setServicioForm({...servicioForm, descripcion: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-black"
                  placeholder="Descripción del servicio"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duración (min) *</label>
                  <input
                    type="number"
                    value={servicioForm.duracion}
                    onChange={(e) => setServicioForm({...servicioForm, duracion: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-black"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio ($) *</label>
                  <input
                    type="number"
                    value={servicioForm.precio}
                    onChange={(e) => setServicioForm({...servicioForm, precio: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-black"
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowServicioModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAgregarServicio}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg font-semibold"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header y Sidebar igual que antes... */}
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
                  {salonInfo.nombre}
                </h1>
                <p className="text-sm text-gray-600">Panel de Administración</p>
              </div>
            </div>

            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-6 h-6 text-pink-500" />
            </button>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-purple-500 bg-white/70"
                />
              </div>
              <button className="relative p-3 text-gray-600 hover:text-purple-600 transition-colors bg-white/70 rounded-full border-2 border-gray-200 hover:border-purple-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {salonInfo.nombre.charAt(0)}
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden mt-3 bg-white/95 rounded-xl shadow-lg border border-purple-100">
              <div className="p-3 space-y-1">
                {['overview', 'citas', 'clientes', 'servicios'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {setActiveTab(tab); setMenuOpen(false);}}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'overview' && <BarChart3 className="w-5 h-5" />}
                    {tab === 'citas' && <Calendar className="w-5 h-5" />}
                    {tab === 'clientes' && <Users className="w-5 h-5" />}
                    {tab === 'servicios' && <Scissors className="w-5 h-5" />}
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
              { id: 'overview', icon: BarChart3, label: 'Dashboard' },
              { id: 'citas', icon: Calendar, label: 'Citas' },
              { id: 'clientes', icon: Users, label: 'Clientes' },
              { id: 'servicios', icon: Scissors, label: 'Servicios' },
              { id: 'reportes', icon: TrendingUp, label: 'Reportes' },
              { id: 'configuracion', icon: Settings, label: 'Configuración' },
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
          {/* Overview Tab - mantener igual... */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-purple-100 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Bienvenido, <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{salonInfo.nombre}</span>
                </h2>
                <p className="text-gray-600">Aquí está el resumen de tu salón</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Citas Hoy', value: estadisticas.citasHoy, change: estadisticas.cambios.citas, icon: Calendar, color: 'blue' },
                  { label: 'Ingresos Mes', value: estadisticas.ingresosMes, change: estadisticas.cambios.ingresos, icon: DollarSign, color: 'green' },
                  { label: 'Clientes Activos', value: estadisticas.clientesActivos, change: estadisticas.cambios.clientes, icon: Users, color: 'purple' },
                  { label: 'Citas Semana', value: estadisticas.citasSemana, change: 'Esta semana', icon: Scissors, color: 'pink' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 font-semibold mb-2">{stat.label}</p>
                        <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-green-600 text-sm font-semibold mt-2">
                          {stat.change.includes('%') && <TrendingUp className="w-4 h-4 inline mr-1" />}
                          {stat.change}
                        </p>
                      </div>
                      <div className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center`}>
                        <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Próximas Citas */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Próximas Citas</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all">
                    <Plus className="w-5 h-5 inline mr-2" />
                    Nueva Cita
                  </button>
                </div>
                
                {citas.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay citas programadas</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {citas.slice(0, 5).map((cita) => (
                      <div key={cita.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{cita.cliente}</p>
                          <p className="text-sm text-gray-600">{cita.servicio}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-sm font-medium text-gray-900">{cita.fecha}</p>
                          <p className="text-sm text-gray-600">{cita.hora}</p>
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
                <h2 className="text-3xl font-bold text-gray-900">Gestión de Citas</h2>
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all">
                  <Plus className="w-5 h-5" />
                  <span>Nueva Cita</span>
                </button>
              </div>

              {citas.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No hay citas registradas</p>
                  <p className="text-gray-500 text-sm mt-2">Agrega tu primera cita para comenzar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Servicio</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hora</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {citas.map((cita) => (
                        <tr key={cita.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{cita.cliente}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{cita.servicio}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{cita.fecha}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{cita.hora}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                              cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              cita.estado === 'completada' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {cita.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{cita.monto}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Clientes Tab */}
          {activeTab === 'clientes' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h2>
                  <p className="text-gray-600 mt-1">Clientes de {salonInfo.nombre} ({clientes.length} total)</p>
                </div>
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all">
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Cliente</span>
                </button>
              </div>

              {clientes.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No hay clientes registrados</p>
                  <p className="text-gray-500 text-sm mt-2">Los clientes aparecerán aquí cuando se registren en tu salón</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clientes.map((cliente) => (
                    <div key={cliente.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {cliente.nombre.charAt(0)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 mb-1">{cliente.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-1">{cliente.email}</p>
                      <p className="text-sm text-gray-600 mb-4">{cliente.telefono}</p>

                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Última Visita</p>
                          <p className="text-sm font-semibold text-gray-900">{cliente.ultimaVisita}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Gastado</p>
                          <p className="text-sm font-semibold text-green-600">{cliente.totalGastado}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Citas Realizadas</p>
                        <p className="text-lg font-bold text-purple-600">{cliente.citasRealizadas}</p>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h2>
                <button 
                  onClick={() => setShowServicioModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Servicio</span>
                </button>
              </div>

              {servicios.length === 0 ? (
                <div className="text-center py-12">
                  <Scissors className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No hay servicios registrados</p>
                  <p className="text-gray-500 text-sm mt-2">Agrega tu primer servicio para comenzar</p>
                  <button 
                    onClick={() => setShowServicioModal(true)}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Agregar Primer Servicio</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicios.map((servicio) => (
                    <div key={servicio.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                          <Scissors className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-xl text-gray-900 mb-2">{servicio.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-4">{servicio.descripcion || 'Sin descripción'}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Duración</p>
                          <p className="text-sm font-semibold text-gray-900">{servicio.duracion}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Precio</p>
                          <p className="text-2xl font-bold text-green-600">{servicio.precio}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reportes' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-lg text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Reportes y Análisis</h3>
              <p className="text-gray-600">Dashboard de reportes en desarrollo</p>
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-lg text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Configuración del Salón</h3>
              <p className="text-gray-600">Panel de configuración en desarrollo</p>
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