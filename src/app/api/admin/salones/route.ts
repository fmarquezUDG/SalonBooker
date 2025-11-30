// src/app/api/admin/salones/[id]/aprobar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    const salonId = Number(params.id);
    if (Number.isNaN(salonId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // 1) Actualizar el estado del salón a aprobado
    const salon = await prisma.salon.update({
      where: { id: salonId },
      data: { aprobado: true },
      include: {
        usuarios: {
          select: {
            id: true,
            email: true,
            nombre: true,
            tipo_usuario: true,
          },
        },
        servicios_items: {
          select: { id: true },
        },
      },
    });

    // 2) Calcular estadísticas del mes para ese salón (igual que en tu GET)
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const citasMes = await prisma.cita.count({
      where: {
        servicio: { salon_id: salon.id },
        fecha: { gte: inicioMes },
      },
    });

    const ingresosMes = await prisma.pago.aggregate({
      _sum: { monto: true },
      where: {
        estado: 'pagado',
        cita: {
          servicio: { salon_id: salon.id },
          fecha: { gte: inicioMes },
        },
      },
    });

    const adminSalon =
      salon.usuarios.find(u => u.tipo_usuario === 'admin_salon') ??
      salon.usuarios[0];

    return NextResponse.json({
      success: true,
      message: 'Salón aprobado',
      salon: {
        id: salon.id,
        nombre: salon.nombre,
        aprobado: salon.aprobado ?? false,
        usuarios: salon.usuarios,
        servicios_items: salon.servicios_items,
        estadisticas: {
          citasMes,
          ingresosMes: Number(ingresosMes._sum.monto ?? 0),
          emailAdmin: adminSalon?.email ?? 'No disponible',
        },
      },
    });
  } catch (error) {
    console.error('Error al aprobar salón:', error);
    return NextResponse.json(
      { error: 'No se pudo aprobar el salón' },
      { status: 500 }
    );
  }
}