// src/app/api/auth/verify-reset-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token no proporcionado' },
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
        email: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { valid: false, error: 'El token es inválido o ha expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verificando token:', error);
    return NextResponse.json(
      { valid: false, error: 'Error al verificar el token' },
      { status: 500 }
    );
  }
}