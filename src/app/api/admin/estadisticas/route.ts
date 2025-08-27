// src/app/api/admin/estadisticas/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Obtener fecha del inicio del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    // Obtener fecha del mes anterior
    const inicioMesAnterior = new Date();
    inicioMesAnterior.setMonth(inicioMesAnterior.getMonth() - 1);
    inicioMesAnterior.setDate(1);
    inicioMesAnterior.setHours(0, 0, 0, 0);

    const finMesAnterior = new Date();
    finMesAnterior.setDate(0);
    finMesAnterior.setHours(23, 59, 59, 999);

    // Total de salones
    const totalSalones = await prisma.salon.count();
    const salonesAprobados = await prisma.salon.count({
      where: { aprobado: true }
    });

    // Usuarios activos (admin_salon y usuario)
    const usuariosActivos = await prisma.usuario.count({
      where: { 
        activo: true,
        tipo_usuario: {
          in: ['admin_salon', 'usuario']
        }
      }
    });

    // Citas del mes actual
    const citasMes = await prisma.cita.count({
      where: {
        fecha: {
          gte: inicioMes
        }
      }
    });

    // Citas del mes anterior
    const citasMesAnterior = await prisma.cita.count({
      where: {
        fecha: {
          gte: inicioMesAnterior,
          lt: inicioMes
        }
      }
    });

    // Ingresos totales del mes actual
    const ingresosMes = await prisma.pago.aggregate({
      _sum: {
        monto: true
      },
      where: {
        estado: 'pagado',
        fecha_pago: {
          gte: inicioMes
        }
      }
    });

    // Ingresos del mes anterior
    const ingresosMesAnterior = await prisma.pago.aggregate({
      _sum: {
        monto: true
      },
      where: {
        estado: 'pagado',
        fecha_pago: {
          gte: inicioMesAnterior,
          lt: inicioMes
        }
      }
    });

    // Calcular porcentajes de cambio
    const calcularCambio = (actual: number, anterior: number): string => {
      if (anterior === 0) return actual > 0 ? '+100%' : '0%';
      const cambio = ((actual - anterior) / anterior) * 100;
      return `${cambio >= 0 ? '+' : ''}${cambio.toFixed(1)}%`;
    };

    const montoActual = Number(ingresosMes._sum.monto || 0);
    const montoAnterior = Number(ingresosMesAnterior._sum.monto || 0);

    const estadisticas = {
      totalSalones,
      salonesAprobados,
      ingresosTotales: `$${montoActual.toLocaleString()}`,
      usuariosActivos,
      citasMes,
      cambios: {
        salones: calcularCambio(totalSalones, totalSalones), // Para salones usamos el mismo valor por simplicidad
        ingresos: calcularCambio(montoActual, montoAnterior),
        usuarios: calcularCambio(usuariosActivos, usuariosActivos), // Similarmente para usuarios
        citas: calcularCambio(citasMes, citasMesAnterior)
      }
    };

    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error('Error fetching estadisticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}