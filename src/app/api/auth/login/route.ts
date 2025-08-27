// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs'; // Instalar: npm install bcryptjs @types/bcryptjs

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validar que se enviaron los datos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar el usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nombre: true,
        email: true,
        password: true,
        tipo_usuario: true,
        activo: true,
        salon_id: true,
        salon: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    // Verificar si el usuario existe
    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Usuario inactivo. Contacte al administrador' },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Determinar la ruta de redirección según el tipo de usuario
    let redirectUrl = '/';
    switch (usuario.tipo_usuario) {
      case 'admin_app':
        redirectUrl = '/super-admin';
        break;
      case 'admin_salon':
        redirectUrl = '/admin-salon';
        break;
      case 'usuario':
        redirectUrl = '/cliente';
        break;
      default:
        redirectUrl = '/';
    }

    // Respuesta exitosa (sin incluir la contraseña)
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      redirectUrl,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        salon: usuario.salon
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}