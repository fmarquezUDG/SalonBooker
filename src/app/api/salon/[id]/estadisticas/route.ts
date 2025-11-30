// src/app/api/salon/[id]/estadisticas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salonId = parseInt(id, 10);

    // Obtener fechas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);

    // Citas de hoy
    const citasHoy = await prisma.cita.count({
      where: {
        servicio: {
          salon_id: salonId
        },
        fecha: {
          gte: hoy,
          lt: manana
        }
      }
    });

    // Citas de la semana
    const citasSemana = await prisma.cita.count({
      where: {
        servicio: {
          salon_id: salonId
        },
        fecha: {
          gte: inicioSemana
        }
      }
    });

    // Ingresos del mes
    const ingresosMes = await prisma.pago.aggregate({
      _sum: {
        monto: true
      },
      where: {
        estado: 'pagado',
        cita: {
          servicio: {
            salon_id: salonId
          },
          fecha: {
            gte: inicioMes,
            lt: finMes
          }
        }
      }
    });

    // Clientes activos (usuarios asociados al salón)
    const clientesActivos = await prisma.usuario.count({
      where: {
        salon_id: salonId,
        tipo_usuario: 'usuario',
        activo: true
      }
    });

    const estadisticas = {
      citasHoy,
      citasSemana,
      ingresosMes: `$${(Number(ingresosMes._sum.monto) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      clientesActivos,
      cambios: {
        citas: '+12%',
        ingresos: '+8%',
        clientes: '+5%'
      }
    };

    return NextResponse.json(estadisticas);

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}