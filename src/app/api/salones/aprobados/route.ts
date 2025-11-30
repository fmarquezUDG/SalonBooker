// src/app/api/salones/aprobados/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Obtener solo los salones aprobados
    const salones = await prisma.salon.findMany({
      where: {
        aprobado: true
      },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        contacto: true,
        aprobado: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    console.log(`📋 Salones aprobados encontrados: ${salones.length}`);

    return NextResponse.json(salones);

  } catch (error) {
    console.error('Error al obtener salones aprobados:', error);
    return NextResponse.json(
      { error: 'Error al obtener los salones' },
      { status: 500 }
    );
  }
}