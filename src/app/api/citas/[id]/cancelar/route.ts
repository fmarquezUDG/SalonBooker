// src/app/api/citas/[id]/cancelar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const citaId = parseInt(id, 10);

    console.log('❌ Cancelando cita:', citaId);

    // Verificar que la cita existe
    const cita = await prisma.cita.findUnique({
      where: { id: citaId },
    });

    if (!cita) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    // Verificar que la cita no esté completada
    if (cita.estado === 'completada') {
      return NextResponse.json(
        { error: 'No se puede cancelar una cita completada' },
        { status: 400 }
      );
    }

    // Verificar que la cita no esté ya cancelada
    if (cita.estado === 'cancelada') {
      return NextResponse.json(
        { error: 'La cita ya está cancelada' },
        { status: 400 }
      );
    }

    // Cancelar la cita
    const citaCancelada = await prisma.cita.update({
      where: { id: citaId },
      data: { estado: 'cancelada' },
    });

    console.log('✅ Cita cancelada exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Cita cancelada exitosamente',
      cita: citaCancelada,
    });
  } catch (error) {
    console.error('❌ Error al cancelar cita:', error);
    return NextResponse.json(
      { error: 'Error al cancelar la cita' },
      { status: 500 }
    );
  }
}