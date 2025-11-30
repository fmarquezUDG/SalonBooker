// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validar campos requeridos
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar fortaleza de la contraseña
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Hashear el token para compararlo
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuario con el token válido y no expirado
    const usuario = await prisma.usuario.findFirst({
      where: {
        reset_password_token: resetTokenHash,
        reset_password_expires: {
          gt: new Date() // Mayor que la fecha actual
        },
        activo: true
      },
      select: {
        id: true,
        email: true,
        nombre: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'El token es inválido o ha expirado' },
        { status: 400 }
      );
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña y limpiar los campos del token
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null
      }
    });

    // Log para auditoría
    console.log(`Contraseña restablecida para usuario: ${usuario.email}`);

    return NextResponse.json(
      { 
        success: true,
        message: 'Contraseña restablecida exitosamente'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en reset-password:', error);
    return NextResponse.json(
      { error: 'Error al restablecer la contraseña' },
      { status: 500 }
    );
  }
}