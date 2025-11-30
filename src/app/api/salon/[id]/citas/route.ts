// src/app/api/salon/[id]/citas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salonId = parseInt(id, 10);

    const citas = await prisma.cita.findMany({
      where: { servicio: { salon_id: salonId } },
      include: {
        usuario: { select: { nombre: true, email: true } },
        servicio: { select: { nombre: true, precio: true } },
        pagos: { select: { monto: true, estado: true } },
      },
      orderBy: { fecha: 'asc' },
      take: 50,
    });

    const citasFormateadas = citas.map((cita) => ({
      id: cita.id,
      cliente: cita.usuario?.nombre || 'Cliente',
      servicio: cita.servicio?.nombre || 'Servicio',
      fecha: cita.fecha.toLocaleDateString('es-MX'),
      hora: cita.fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      estado: cita.estado as 'pendiente' | 'confirmada' | 'completada' | 'cancelada',
      monto: `$${(Number(cita.servicio?.precio) || 0).toLocaleString('es-MX')}`,
    }));

    return NextResponse.json(citasFormateadas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
  }
}