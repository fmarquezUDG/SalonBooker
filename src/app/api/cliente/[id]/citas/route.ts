// src/app/api/cliente/[id]/citas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clienteId = parseInt(id, 10);

    console.log('📋 Obteniendo citas del cliente:', clienteId);

    // Obtener citas del cliente
    const citas = await prisma.cita.findMany({
      where: {
        usuario_id: clienteId
      },
      include: {
        servicio: {
          select: {
            nombre: true,
            precio: true,
            salon: {
              select: {
                nombre: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    // Formatear citas
    const citasFormateadas = citas.map(cita => ({
      id: cita.id,
      servicio: cita.servicio.nombre,
      salon: cita.servicio.salon.nombre,
      fecha: new Date(cita.fecha).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      hora: cita.hora,
      estado: cita.estado as 'pendiente' | 'confirmada' | 'completada' | 'cancelada',
      monto: `$${Number(cita.servicio.precio).toLocaleString('es-MX')}`
    }));

    console.log(`✅ Citas encontradas: ${citasFormateadas.length}`);

    return NextResponse.json(citasFormateadas);

  } catch (error) {
    console.error('❌ Error al obtener citas del cliente:', error);
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    );
  }
}