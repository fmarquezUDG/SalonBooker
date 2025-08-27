"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Bell, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Menu,
  Home,
  Sparkles,
  LogOut
} from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

// Tipos de datos
interface Salon {
  id: string;
  nombre: string;
  email: string;
  ciudad: string;
  estado: 'activo' | 'pendiente' | 'inactivo';
  fechaRegistro: string;
  ingresosMes: string;
  citasMes: number;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipo_usuario: string;
  activo: boolean;
  salon?: {
    id: number;
    nombre: string;
  } | null;
  ultimaActividad?: string;
}

interface Estadisticas {
  totalSalones: number;
  salonesAprobados: number;
  ingresosTotales: string;
  usuariosActivos: number;
  citasMes: number;
  cambios: {
    salones: string;
    ingresos: string;
    usuarios: string;
    citas: string;
  };
}

interface EstadisticaCard {
  titulo: string;
  valor: string;
  cambio: string;
  icono: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [salones, setSalones] = useState<Salon[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalSalones: 0,
    salonesAprobados: 0,
    ingresosTotales: '$0',
    usuariosActivos: 0,
    citasMes: 0,
    cambios: {
      salones: '+0%',
      ingresos: '+0%',
      usuarios: '+0%',
      citas: '+0%'
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch salones, usuarios y estadísticas en paralelo
        const [salonesResponse, usuariosResponse, statsResponse] = await Promise.all([
          fetch('/api/admin/salones'),
          fetch('/api/admin/usuarios'),
          fetch('/api/admin/estadisticas')
        ]);

        if (!salonesResponse.ok || !usuariosResponse.ok || !statsResponse.ok) {
          throw new Error('Error al cargar los datos');
        }

        const salonesData: Salon[] = await salonesResponse.json();
        const usuariosData: Usuario[] = await usuariosResponse.json();
        const statsData: Estadisticas = await statsResponse.json();
        
        setSalones(salonesData);
        setUsuarios(usuariosData);
        setEstadisticas(statsData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Crear array de estadísticas para las cards
  const estadisticasArray: EstadisticaCard[] = [
    {
      titulo: "Total Salones",
      valor: estadisticas.totalSalones.toString(),
      cambio: estadisticas.cambios.salones,
      icono: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      titulo: "Ingresos Totales",
      valor: estadisticas.ingresosTotales,
      cambio: estadisticas.cambios.ingresos,
      icono: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      titulo: "Usuarios Activos",
      valor: estadisticas.usuariosActivos.toString(),
      cambio: estadisticas.cambios.usuarios,
      icono: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      titulo: "Citas Mes",
      valor: estadisticas.citasMes.toString(),
      cambio: estadisticas.cambios.citas,
      icono: BarChart3,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reintentar
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

      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
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
                  
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <h1 className="hidden md:block text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                SalonBooker
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 text-pink-500" />
            </button>

            {/* Header Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar salones, usuarios..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-purple-500 bg-white/70"
                />
              </div>
              <button className="relative p-3 text-gray-600 hover:text-purple-600 transition-colors bg-white/70 rounded-full border-2 border-gray-200 hover:border-purple-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                SA
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
            {menuOpen && (
            <div className="md:hidden mt-3 bg-white/95 rounded-xl shadow-lg border border-purple-100">
                <div className="p-3 space-y-1">
                <button
                    onClick={() => {setActiveTab('overview'); setMenuOpen(false);}}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm md:text-lg transition-colors ${
                    activeTab === 'overview' 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <BarChart3 className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="font-medium">Dashboard</span>
                </button>
                
                <button
                    onClick={() => {setActiveTab('salones'); setMenuOpen(false);}}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm md:text-lg transition-colors ${
                    activeTab === 'salones' 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Building2 className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="font-medium">Salones</span>
                </button>
                
                <button
                    onClick={() => {setActiveTab('usuarios'); setMenuOpen(false);}}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm md:text-lg transition-colors ${
                    activeTab === 'usuarios' 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Users className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="font-medium">Usuarios</span>
                </button>
                </div>
                <br/>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <button 
                  onClick={() => {
                    // Limpiar datos del localStorage
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('user');
                    }
                    // Redirigir al login
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center space-x-3 px-6 py-4 text-red-600 hover:text-white hover:bg-red-600 transition-colors rounded-2xl border border-red-200"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="font-medium text-lg">Cerrar Sesión</span>
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
            <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'overview' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-white/80 hover:shadow-md'
            }`}
            >
            <BarChart3 className="w-7 h-7" />
            <span className="font-semibold text-xl">Dashboard</span>
            </button>
            
            <button
            onClick={() => setActiveTab('salones')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'salones' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-white/80 hover:shadow-md'
            }`}
            >
            <Building2 className="w-7 h-7" />
            <span className="font-semibold text-xl">Salones</span>
            </button>
            
            <button
            onClick={() => setActiveTab('usuarios')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'usuarios' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-white/80 hover:shadow-md'
            }`}
            >
            <Users className="w-7 h-7" />
            <span className="font-semibold text-xl">Usuarios</span>
            </button>
            
            <button
            onClick={() => setActiveTab('reportes')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'reportes' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-white/80 hover:shadow-md'
            }`}
            >
            <TrendingUp className="w-7 h-7" />
            <span className="font-semibold text-xl">Reportes</span>
            </button>
            
            <button
            onClick={() => setActiveTab('configuracion')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'configuracion' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-white/80 hover:shadow-md'
            }`}
            >
            <Settings className="w-7 h-7" />
            <span className="font-semibold text-xl">Configuración</span>
            </button>
        </nav>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button 
            onClick={() => {
              // Limpiar datos del localStorage
              if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
              }
              // Redirigir al login
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
        <main className="flex-1 p-2 md:p-8 relative">
          {activeTab === 'overview' && (
            <div className="space-y-4 md:space-y-8">
              {/* Welcome Header */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-100 shadow-lg">
                <div className="flex items-center justify-center mb-4 md:mb-6">
                  <span className="px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-md md:text-lg font-semibold border border-purple-200">
                    Panel de Control Super Admin
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-center mb-3 md:mb-6 leading-tight">
                  <span className="block text-gray-900 mb-1 md:mb-2">Bienvenido al</span>
                  <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-purple-800 bg-clip-text text-transparent">
                    Centro de Control
                  </span>
                </h2>
                
                    <p className="text-md md:text-lg lg:text-xl text-gray-600 text-center max-w-6xl mx-auto leading-relaxed">
                    Administra toda la plataforma SalonBooker desde un solo lugar. 
                    <span className="text-purple-600 font-semibold"> Supervisa {estadisticas.totalSalones} salones</span> y 
                    gestiona el crecimiento de la red.
                    </p>
                </div>
                <br/><br/>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {estadisticasArray.map((stat, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-3 md:mb-0">
                            <p className="text-gray-600 text-md md:text-lg font-semibold mb-1 md:mb-2">{stat.titulo}</p>
                            <p className="text-lg md:text-5xl lg:text-6xl font-bold text-gray-900 mb-1 md:mb-3">{stat.valor}</p>
                            <p className="text-green-600 text-md md:text-lg font-semibold flex items-center">
                            <TrendingUp className="w-3 h-3 md:w-6 md:h-6 mr-1" />
                            {stat.cambio} vs mes anterior
                            </p>
                        </div>
                        <div className={`w-12 h-12 md:w-20 md:h-20 ${stat.bgColor} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg ml-auto md:ml-0`}>
                            <stat.icono className={`w-6 h-6 md:w-12 md:h-12 ${stat.color}`} />
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}
          {activeTab === 'salones' && (
            <div className="space-y-4 md:space-y-8">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Gestión de Salones</h2>
                  <p className="text-sm md:text-lg text-gray-600">Administra todos los salones ({salones.length} total)</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-3 border-2 border-gray-300 rounded-xl md:rounded-2xl hover:border-purple-500 hover:bg-white/80 transition-all text-sm">
                    <Filter className="w-4 h-4 text-gray-900" />
                    <span className="font-medium text-gray-900">Filtrar</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl md:rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-sm">
                    <Plus className="w-4 h-4" />
                    <span className="font-bold">Agregar</span>
                  </button>
                </div>
              </div>
              <br/><br/><br/>
              {/* Salones Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {salones.map((salon) => (
                    <div key={salon.id} className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <div className="flex items-start justify-between mb-4 md:mb-6">
                        <div className="flex-1 pr-2">
                        <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">{salon.nombre}</h3>
                        <p className="text-gray-600 text-md md:text-sm lg:text-base xl:text-lg mb-1 break-all">{salon.email}</p>
                        <p className="text-gray-500 text-md md:text-sm lg:text-base xl:text-lg">{salon.ciudad}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-md md:text-sm lg:text-base xl:text-lg font-bold whitespace-nowrap ${
                        salon.estado === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : salon.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {salon.estado === 'activo' && <CheckCircle className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 mr-1" />}
                        {salon.estado === 'pendiente' && <Clock className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 mr-1" />}
                        {salon.estado === 'inactivo' && <XCircle className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 mr-1" />}
                        {salon.estado}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 md:p-4 rounded-xl md:rounded-2xl">
                        <p className="text-green-600 text-md md:text-sm lg:text-base xl:text-lg font-semibold mb-1">Ingresos/Mes</p>
                        <p className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-700">{salon.ingresosMes}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 md:p-4 rounded-xl md:rounded-2xl">
                        <p className="text-blue-600 text-md md:text-sm lg:text-base xl:text-lg font-semibold mb-1">Citas/Mes</p>
                        <p className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-700">{salon.citasMes}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-xs md:text-sm lg:text-base xl:text-lg">
                        Registrado: {new Date(salon.fechaRegistro).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-1">
                        <button className="p-1.5 md:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg md:rounded-xl transition-colors">
                            <Eye className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        </button>
                        <button className="p-1.5 md:p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg md:rounded-xl transition-colors">
                            <Edit className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        </button>
                        <button className="p-1.5 md:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg md:rounded-xl transition-colors">
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
          )}

          {/* Usuarios Section */}
          {activeTab === 'usuarios' && (
            <div className="space-y-4 md:space-y-8">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h2>
                  <p className="text-sm md:text-lg text-gray-600">Administra todos los usuarios ({usuarios.length} total)</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-3 border-2 border-gray-300 rounded-xl md:rounded-2xl hover:border-purple-500 hover:bg-white/80 transition-all text-sm">
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filtrar</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl md:rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-sm">
                    <Plus className="w-4 h-4" />
                    <span className="font-bold">Agregar</span>
                  </button>
                </div>
              </div>

              {/* Usuarios Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-purple-100 shadow-lg overflow-hidden">
                <div className="p-4 md:p-8 border-b border-gray-100">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Lista de Usuarios</h3>
                </div>
                
                {/* Vista Desktop - Tabla */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600">Usuario</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600">Tipo</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600">Salón</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600">Última Actividad</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div>
                              <p className="font-semibold text-gray-900">{usuario.nombre}</p>
                              <p className="text-sm text-gray-600">{usuario.email}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              usuario.tipo_usuario === 'admin_app'
                                ? 'bg-purple-100 text-purple-800'
                                : usuario.tipo_usuario === 'admin_salon'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {usuario.tipo_usuario === 'admin_app' && 'Super Admin'}
                              {usuario.tipo_usuario === 'admin_salon' && 'Admin Salón'}
                              {usuario.tipo_usuario === 'usuario' && 'Cliente'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm text-gray-600">
                              {usuario.salon ? usuario.salon.nombre : 'N/A'}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              usuario.activo 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {usuario.activo && <CheckCircle className="w-3 h-3 mr-1" />}
                              {!usuario.activo && <XCircle className="w-3 h-3 mr-1" />}
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm text-gray-600">{usuario.ultimaActividad}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Vista Mobile - Cards */}
                <div className="lg:hidden p-3 md:p-6 space-y-6">
                {usuarios.map((usuario) => (
                    <div key={usuario.id} className="bg-white/50 rounded-xl p-3 border border-gray-200 shadow-sm">
                    {/* Header con nombre y acciones */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-2">
                        <h4 className="font-bold text-purple-800 text-sm leading-tight">{usuario.nombre}</h4>
                        <p className="text-xs text-gray-600 break-all mt-1">{usuario.email}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                        <button className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-3 h-3" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="w-3 h-3" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-3 h-3" />
                        </button>
                        </div>
                    </div>

                    {/* Tags de tipo y estado */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        usuario.tipo_usuario === 'admin_app'
                            ? 'bg-purple-100 text-purple-800'
                            : usuario.tipo_usuario === 'admin_salon'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {usuario.tipo_usuario === 'admin_app' && 'Super Admin'}
                        {usuario.tipo_usuario === 'admin_salon' && 'Admin Salón'}
                        {usuario.tipo_usuario === 'usuario' && 'Cliente'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        usuario.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {usuario.activo && <CheckCircle className="w-2 h-2 mr-1" />}
                        {!usuario.activo && <XCircle className="w-2 h-2 mr-1" />}
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>

                    {/* Info adicional */}
                    <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                        <span className="text-gray-500">Salón:</span>
                        <span className="text-gray-700 font-medium">
                            {usuario.salon ? usuario.salon.nombre : 'N/A'}
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-500">Actividad:</span>
                        <span className="text-gray-700">{usuario.ultimaActividad}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {usuarios.length === 0 && (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No hay usuarios</h3>
                    <p className="text-sm text-gray-600">No se encontraron usuarios en la base de datos.</p>
                  </div>
                )}
              </div>
              
            </div>
          )}

          {activeTab === 'reportes' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-8 md:p-12 border border-purple-100 shadow-lg text-center">
              <TrendingUp className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Reportes y Análisis</h3>
              <p className="text-sm md:text-lg text-gray-600">Dashboard de reportes en desarrollo</p>
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-8 md:p-12 border border-purple-100 shadow-lg text-center">
              <Settings className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Configuración del Sistema</h3>
              <p className="text-sm md:text-lg text-gray-600">Panel de configuración en desarrollo</p>
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