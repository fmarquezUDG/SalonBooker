// src/app/api/salon/[id]/servicios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Obtener servicios del salón
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salonId = parseInt(id, 10);

    const servicios = await prisma.servicioItem.findMany({
      where: { salon_id: salonId },
      orderBy: { id: 'asc' },
    });

    const serviciosFormateados = servicios.map((servicio) => ({
      id: servicio.id,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || 'Sin descripción',
      duracion: `${servicio.duracion || 60} min`,
      precio: `$${(Number(servicio.precio) || 0).toLocaleString('es-MX')}`,
      activo: true,
    }));

    console.log(`📋 Servicios del salón ${salonId}:`, serviciosFormateados.length);
    return NextResponse.json(serviciosFormateados);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

// POST - Crear nuevo servicio
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salonId = parseInt(id, 10);
    const body = await request.json();
    const { nombre, descripcion, duracion, precio } = body;

    console.log('📝 Datos recibidos:', { nombre, descripcion, duracion, precio, salonId });

    // Validaciones
    if (!nombre || !duracion || !precio) {
      return NextResponse.json(
        { error: 'Nombre, duración y precio son requeridos' },
        { status: 400 }
      );
    }

    let subcategoriaId: number | null = null;

    // Intentar encontrar una subcategoría existente
    const subcategoriaExistente = await prisma.servicioSubcategoria.findFirst();

    if (subcategoriaExistente) {
      subcategoriaId = subcategoriaExistente.id;
      console.log('✅ Usando subcategoría existente:', subcategoriaId);
    } else {
      // Si no existe ninguna, crear una por defecto
      console.log('⚠️ No hay subcategorías, creando una por defecto...');

      // Primero crear categoría si no existe
      let categoria = await prisma.servicioCategoria.findFirst();

      if (!categoria) {
        categoria = await prisma.servicioCategoria.create({
          data: { nombre: 'General' },
        });
        console.log('✅ Categoría creada:', categoria.id);
      }

      // Crear subcategoría
      const nuevaSubcategoria = await prisma.servicioSubcategoria.create({
        data: {
          nombre: 'General',
          categoria_id: categoria.id,
        },
      });

      subcategoriaId = nuevaSubcategoria.id;
      console.log('✅ Subcategoría creada:', subcategoriaId);
    }

    // Crear servicio con subcategoria_id
    const nuevoServicio = await prisma.servicioItem.create({
      data: {
        nombre: String(nombre).trim(),
        descripcion: descripcion ? String(descripcion).trim() : null,
        duracion: parseInt(String(duracion), 10),
        precio: parseFloat(String(precio)),
        salon_id: salonId,
        subcategoria_id: subcategoriaId,
      },
    });

    console.log('✅ Servicio creado exitosamente:', nuevoServicio.id, nuevoServicio.nombre);

    return NextResponse.json(
      {
        success: true,
        message: 'Servicio creado exitosamente',
        servicio: {
          id: nuevoServicio.id,
          nombre: nuevoServicio.nombre,
          descripcion: nuevoServicio.descripcion,
          duracion: nuevoServicio.duracion,
          precio: nuevoServicio.precio,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error al crear servicio:', error);
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
      console.error('Stack:', error.stack);
    }
    return NextResponse.json(
      {
        error: 'Error al crear el servicio',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}