// src/app/api/admin/usuarios/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Definir tipos para mayor claridad
interface UsuarioConSalon {
  id: number;
  nombre: string;
  email: string;
  tipo_usuario: 'admin_app' | 'admin_salon' | 'usuario';
  activo: boolean | null;
  salon: {
    id: number;
    nombre: string;
  } | null;
}

interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  tipo_usuario: string;
  activo: boolean;
  salon?: {
    id: number;
    nombre: string;
  } | null;
  fecha_registro?: Date;
  ultimaActividad?: string;
}

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        salon: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    }) as UsuarioConSalon[];

    const usuariosFormateados: UsuarioResponse[] = usuarios.map((usuario: UsuarioConSalon) => ({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      activo: usuario.activo || false,
      salon: usuario.salon,
      ultimaActividad: 'Hoy' // Placeholder - podrías calcular esto basado en citas o actividad real
    }));

    return NextResponse.json(usuariosFormateados);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}