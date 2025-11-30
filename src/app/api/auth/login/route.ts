// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 Intento de login:', email);

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario con información del salón
    const usuario = await prisma.usuario.findUnique({
      where: { 
        email: email.toLowerCase() 
      },
      include: {
        salon: {
          select: {
            id: true,
            nombre: true,
            direccion: true,
            contacto: true,
            aprobado: true  // ⭐ IMPORTANTE: Incluir campo aprobado
          }
        }
      }
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado:', email);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      console.log('❌ Contraseña incorrecta');
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      console.log('❌ Usuario inactivo');
      return NextResponse.json(
        { error: 'Usuario inactivo' },
        { status: 403 }
      );
    }

    // Preparar datos del usuario
    const userData = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      activo: usuario.activo,
      salon: usuario.salon ? {
        id: usuario.salon.id,
        nombre: usuario.salon.nombre,
        direccion: usuario.salon.direccion,
        contacto: usuario.salon.contacto,
        aprobado: usuario.salon.aprobado  // ⭐ Incluir estado de aprobación
      } : null
    };

    console.log('✅ Login exitoso:', {
      email: usuario.email,
      tipo: usuario.tipo_usuario,
      salon: usuario.salon?.nombre,
      aprobado: usuario.salon?.aprobado
    });

    // Determinar ruta de redirección
    let redirect = '/';
    if (usuario.tipo_usuario === 'admin_app') {
      redirect = '/super-admin';
    } else if (usuario.tipo_usuario === 'admin_salon') {
      redirect = '/admin-salon';
    } else if (usuario.tipo_usuario === 'usuario') {
      redirect = '/cliente';
    }

    return NextResponse.json({
      success: true,
      user: userData,
      redirect
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}