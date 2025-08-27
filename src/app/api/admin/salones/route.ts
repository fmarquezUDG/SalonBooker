// src/app/api/admin/salones/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Definir tipos para mayor claridad
interface Usuario {
  id: string;
  email: string;
}

interface ServicioItem {
  id: string;
}

interface SalonWithRelations {
  id: string;
  nombre: string;
  direccion: string | null;
  aprobado: boolean;
  fecha_registro: Date;
  usuarios: Usuario[];
  servicios_items: ServicioItem[];
}

export async function GET() {
  try {
    const salones = await prisma.salon.findMany({
      include: {
        usuarios: {
          select: {
            id: true,
            email: true
          }
        },
        servicios_items: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        fecha_registro: 'desc'
      }
    }) as SalonWithRelations[];

    // Calcular estadísticas para cada salón
    const salonesConEstadisticas = await Promise.all(
      salones.map(async (salon: SalonWithRelations) => {
        // Contar citas del mes actual para este salón
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);

        const citasMes = await prisma.cita.count({
          where: {
            servicio: {
              salon_id: salon.id
            },
            fecha: {
              gte: inicioMes
            }
          }
        });

        // Calcular ingresos del mes para este salón
        const ingresosMes = await prisma.pago.aggregate({
          _sum: {
            monto: true
          },
          where: {
            estado: 'pagado',
            cita: {
              servicio: {
                salon_id: salon.id
              },
              fecha: {
                gte: inicioMes
              }
            }
          }
        });

        // Obtener email del admin del salón
        const adminSalon = salon.usuarios.find((user: Usuario) => user.id);
        const email = adminSalon?.email || 'No disponible';

        return {
          id: salon.id,
          nombre: salon.nombre,
          email: email,
          ciudad: salon.direccion ? salon.direccion.split(',')[0] : 'No especificada',
          estado: salon.aprobado ? 'activo' : 'pendiente',
          fechaRegistro: salon.fecha_registro ? salon.fecha_registro.toISOString().split('T')[0] : '',
          ingresosMes: `${(ingresosMes._sum.monto || 0).toLocaleString()}`,
          citasMes: citasMes
        };
      })
    );

    return NextResponse.json(salonesConEstadisticas);
  } catch (error) {
    console.error('Error fetching salones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}