// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

type TipoUsuario = 'usuario' | 'admin_salon' | 'admin_app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, password, tipo_usuario, salon } = body;

    // Validaciones básicas
    if (!nombre || !email || !password || !tipo_usuario) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar tipo de usuario
    const tiposValidos: TipoUsuario[] = ['usuario', 'admin_salon', 'admin_app'];
    if (!tiposValidos.includes(tipo_usuario)) {
      return NextResponse.json(
        { error: 'Tipo de usuario inválido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar contraseña
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Este correo electrónico ya está registrado' },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Si es admin_salon, crear el salón primero
    if (tipo_usuario === 'admin_salon') {
      if (!salon || !salon.nombre) {
        return NextResponse.json(
          { error: 'Los datos del salón son requeridos para administradores' },
          { status: 400 }
        );
      }

      // Crear salón y usuario en una transacción
      const result = await prisma.$transaction(async (tx) => {
        // Crear el salón
        const nuevoSalon = await tx.salon.create({
          data: {
            nombre: salon.nombre,
            direccion: salon.direccion || null,
            contacto: salon.contacto || null,
            aprobado: false // Pendiente de aprobación por super admin
          }
        });

        // Crear el usuario admin del salón
        const nuevoUsuario = await tx.usuario.create({
          data: {
            nombre,
            email: email.toLowerCase(),
            password: hashedPassword,
            tipo_usuario: tipo_usuario,
            salon_id: nuevoSalon.id,
            activo: true
          },
          select: {
            id: true,
            nombre: true,
            email: true,
            tipo_usuario: true,
            salon: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        });

        return { usuario: nuevoUsuario, salon: nuevoSalon };
      });

      console.log('✅ Salón y admin creados:', result.salon.nombre);

      return NextResponse.json(
        {
          success: true,
          message: 'Cuenta creada exitosamente. El salón está pendiente de aprobación.',
          user: result.usuario
        },
        { status: 201 }
      );
    } else {
      // Crear usuario regular (cliente)
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          email: email.toLowerCase(),
          password: hashedPassword,
          tipo_usuario: tipo_usuario,
          activo: true
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          tipo_usuario: true
        }
      });

      console.log('✅ Usuario creado:', nuevoUsuario.email);

      return NextResponse.json(
        {
          success: true,
          message: 'Cuenta creada exitosamente',
          user: nuevoUsuario
        },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al crear la cuenta. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}