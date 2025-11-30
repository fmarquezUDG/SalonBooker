// src/app/api/citas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usuario_id, servicio_id, fecha, hora, notas } = body;

    console.log('📅 Creando cita:', { usuario_id, servicio_id, fecha, hora });

    // Validaciones
    if (!usuario_id || !servicio_id || !fecha || !hora) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuario_id) }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el servicio existe
    const servicio = await prisma.servicioItem.findUnique({
      where: { id: Number(servicio_id) },
      include: { salon: true }
    });

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Convertir fecha a Date
    const fechaCita = new Date(fecha);

    // Crear DateTime para hora (solo hora y minutos)
    const [horas, minutos] = hora.split(':');
    const horaCita = new Date();
    horaCita.setHours(Number(horas), Number(minutos), 0, 0);

    // Verificar que la fecha no sea en el pasado
    const ahora = new Date();
    const fechaHoraCompleta = new Date(fecha);
    fechaHoraCompleta.setHours(Number(horas), Number(minutos), 0, 0);
    
    if (fechaHoraCompleta < ahora) {
      return NextResponse.json(
        { error: 'No se pueden agendar citas en el pasado' },
        { status: 400 }
      );
    }

    // Verificar disponibilidad (opcional: que no haya otra cita a la misma hora)
    const citaExistente = await prisma.cita.findFirst({
      where: {
        servicio_id: Number(servicio_id),
        fecha: fechaCita,
        hora: horaCita,
        estado: {
          not: 'cancelada'
        }
      }
    });

    if (citaExistente) {
      return NextResponse.json(
        { error: 'Ya existe una cita agendada para este horario' },
        { status: 409 }
      );
    }

    // Crear la cita con salon_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nuevaCita = await (prisma.cita.create as any)({
    data: {
        usuario_id: Number(usuario_id),
        servicio_id: Number(servicio_id),
        salon_id: servicio.salon_id,
        fecha: fechaCita,
        hora: horaCita,
        estado: 'pendiente',
        notas: notas || null
    }
    });

    console.log('✅ Cita creada exitosamente:', nuevaCita.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Cita agendada exitosamente',
        cita: nuevaCita
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    return NextResponse.json(
      { error: 'Error al agendar la cita' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario_id = searchParams.get('usuario_id');
    const salon_id = searchParams.get('salon_id');

    let whereClause = {};

    if (usuario_id) {
      whereClause = { usuario_id: Number(usuario_id) };
    } else if (salon_id) {
      whereClause = { salon_id: Number(salon_id) };
    }

    const citas = await prisma.cita.findMany({
      where: whereClause,
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true
          }
        },
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

    return NextResponse.json(citas);

  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    return NextResponse.json(
      { error: 'Error al obtener citas' },
      { status: 500 }
    );
  }
}