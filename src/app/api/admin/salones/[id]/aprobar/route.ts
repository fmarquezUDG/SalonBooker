// src/app/api/admin/salones/[id]/aprobar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const salonId = parseInt(params.id);
    const { aprobado } = await request.json();

    // Validar que aprobado sea booleano
    if (typeof aprobado !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo "aprobado" debe ser true o false' },
        { status: 400 }
      );
    }

    // Verificar que el salón existe
    const salonExistente = await prisma.salon.findUnique({
      where: { id: salonId }
    });

    if (!salonExistente) {
      return NextResponse.json(
        { error: 'Salón no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el estado de aprobación
    const salonActualizado = await prisma.salon.update({
      where: { id: salonId },
      data: { aprobado },
      select: {
        id: true,
        nombre: true,
        aprobado: true,
        usuarios: {
          where: {
            tipo_usuario: 'admin_salon'
          },
          select: {
            email: true,
            nombre: true
          }
        }
      }
    });

    console.log(
      aprobado 
        ? `✅ Salón APROBADO: ${salonActualizado.nombre} (ID: ${salonId})`
        : `❌ Salón RECHAZADO: ${salonActualizado.nombre} (ID: ${salonId})`
    );

    // TODO: Aquí podrías enviar un email al admin del salón notificando la aprobación/rechazo

    return NextResponse.json({
      success: true,
      message: aprobado 
        ? 'Salón aprobado exitosamente'
        : 'Salón rechazado',
      salon: salonActualizado
    });

  } catch (error) {
    console.error('Error al aprobar/rechazar salón:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}