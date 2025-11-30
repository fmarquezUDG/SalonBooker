// src/app/api/cliente/[id]/citas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

type CitaWith = Prisma.CitaGetPayload<{
  include: {
    servicio: {
      select: {
        nombre: true;
        precio: true;
        salon: { select: { nombre: true } };
      };
    };
  };
}>;

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clienteId = parseInt(params.id, 10);
    if (Number.isNaN(clienteId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const citas: CitaWith[] = await prisma.cita.findMany({
      where: { usuario_id: clienteId },
      include: {
        servicio: {
          select: {
            nombre: true,
            precio: true,
            salon: { select: { nombre: true } },
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    const citasFormateadas = citas.map((cita) => ({
      id: cita.id,
      servicio: cita.servicio.nombre,
      salon: cita.servicio.salon?.nombre ?? 'No disponible',
      fecha: new Date(cita.fecha).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      hora: cita.hora,
      estado:
        (cita.estado as 'pendiente' | 'confirmada' | 'completada' | 'cancelada') ??
        'pendiente',
      monto: `$${Number(cita.servicio.precio).toLocaleString('es-MX')}`,
    }));

    return NextResponse.json(citasFormateadas);
  } catch (error) {
    console.error('❌ Error al obtener citas del cliente:', error);
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    );
  }
}