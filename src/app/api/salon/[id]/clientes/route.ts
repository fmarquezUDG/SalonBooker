// src/app/api/salon/[id]/clientes/route.ts
// src/app/api/salon/[id]/clientes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const salonId = parseInt(params.id, 10);

    const clientes = await prisma.usuario.findMany({
      where: {
        salon_id: salonId,
        tipo_usuario: 'usuario',
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        citas: {
          select: {
            id: true,
            fecha: true,
            pagos: { select: { monto: true, estado: true } },
          },
          orderBy: { fecha: 'desc' },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    const clientesFormateados = clientes.map((cliente) => {
      const citasRealizadas = cliente.citas.length;
      const ultimaCita = cliente.citas[0]?.fecha;

      const totalGastado = cliente.citas.reduce((total, cita) => {
        const montoPago = cita.pagos?.estado === 'pagado' ? Number(cita.pagos.monto) : 0;
        return total + montoPago;
      }, 0);

      return {
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: 'N/A',
        ultimaVisita: ultimaCita ? ultimaCita.toLocaleDateString('es-MX') : 'Sin visitas',
        totalGastado: `$${totalGastado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        citasRealizadas,
      };
    });

    return NextResponse.json(clientesFormateados);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}