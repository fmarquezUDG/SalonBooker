// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // 1. Verificar y crear tipos de usuario si no existen
  let tipoSuperAdmin = await prisma.tipoUsuario.findUnique({
    where: { nombre: 'SUPER_ADMIN' }
  })
  
  if (!tipoSuperAdmin) {
    tipoSuperAdmin = await prisma.tipoUsuario.create({
      data: { nombre: 'SUPER_ADMIN' }
    })
  }

  let tipoSalonAdmin = await prisma.tipoUsuario.findUnique({
    where: { nombre: 'SALON_ADMIN' }
  })
  
  if (!tipoSalonAdmin) {
    tipoSalonAdmin = await prisma.tipoUsuario.create({
      data: { nombre: 'SALON_ADMIN' }
    })
  }

  let tipoUser = await prisma.tipoUsuario.findUnique({
    where: { nombre: 'USER' }
  })
  
  if (!tipoUser) {
    tipoUser = await prisma.tipoUsuario.create({
      data: { nombre: 'USER' }
    })
  }

  console.log('✅ Tipos de usuario verificados/creados')

  // 2. Verificar si ya existe un salón, si no, crear uno
  let salon = await prisma.salon.findFirst()
  
  if (!salon) {
    salon = await prisma.salon.create({
      data: {
        nombre: 'Salón de Belleza María',
        direccion: 'Av. Principal 123, Guadalajara, Jalisco',
        contacto: '3312345678',
        aprobado: true,
      },
    })
    console.log('✅ Salón creado:', salon.nombre)
  } else {
    console.log('✅ Salón existente encontrado:', salon.nombre)
  }

  // 3. Crear Super Admin si no existe
  let superAdmin = await prisma.usuario.findUnique({
    where: { email: 'admin@salonbooker.com' }
  })
  
  if (!superAdmin) {
    superAdmin = await prisma.usuario.create({
      data: {
        nombre: 'Super Administrador',
        email: 'admin@salonbooker.com',
        password: await bcrypt.hash('admin123', 10),
        tipo_usuario: 'admin_app', // Campo enum original
        tipo_usuario_id: tipoSuperAdmin.id, // Nueva FK
        salon_id: null,
      },
    })
    console.log('✅ Super Admin creado:', superAdmin.email)
  } else {
    console.log('✅ Super Admin ya existe:', superAdmin.email)
  }

  // 4. Crear Admin del Salón si no existe
  let adminSalon = await prisma.usuario.findUnique({
    where: { email: 'maria@salon.com' }
  })
  
  if (!adminSalon) {
    adminSalon = await prisma.usuario.create({
      data: {
        nombre: 'María García',
        email: 'maria@salon.com',
        password: await bcrypt.hash('salon123', 10),
        tipo_usuario: 'admin_salon', // Campo enum original
        tipo_usuario_id: tipoSalonAdmin.id, // Nueva FK
        salon_id: salon.id,
      },
    })
    console.log('✅ Admin del salón creado:', adminSalon.email)
  } else {
    console.log('✅ Admin del salón ya existe:', adminSalon.email)
  }

  // 5. Crear Usuario Cliente si no existe
  let cliente = await prisma.usuario.findUnique({
    where: { email: 'ana@cliente.com' }
  })
  
  if (!cliente) {
    cliente = await prisma.usuario.create({
      data: {
        nombre: 'Ana López',
        email: 'ana@cliente.com',
        password: await bcrypt.hash('cliente123', 10),
        tipo_usuario: 'usuario', // Campo enum original
        tipo_usuario_id: tipoUser.id, // Nueva FK
        salon_id: salon.id,
      },
    })
    console.log('✅ Cliente creado:', cliente.email)
  } else {
    console.log('✅ Cliente ya existe:', cliente.email)
  }

  // 6. Verificar si hay categorías de servicios (ya las tienes en la BD)
  const categoriasCount = await prisma.servicioCategoria.count()
  console.log(`✅ Categorías de servicios existentes: ${categoriasCount}`)

  // 7. Verificar si hay subcategorías de servicios (ya las tienes en la BD)
  const subcategoriasCount = await prisma.servicioSubcategoria.count()
  console.log(`✅ Subcategorías de servicios existentes: ${subcategoriasCount}`)

  // 8. Crear algunos servicios de ejemplo si no existen
  const serviciosCount = await prisma.servicioItem.count()
  
  if (serviciosCount === 0) {
    // Obtener algunas subcategorías existentes para crear servicios
    const corteSubcat = await prisma.servicioSubcategoria.findFirst({
      where: { nombre: { contains: 'Corte' } }
    })
    
    const manicuraSubcat = await prisma.servicioSubcategoria.findFirst({
      where: { nombre: { contains: 'Manicura' } }
    })
    
    const colorSubcat = await prisma.servicioSubcategoria.findFirst({
      where: { nombre: { contains: 'Coloración' } }
    })

    const serviciosEjemplo = []

    if (corteSubcat) {
      serviciosEjemplo.push({
        nombre: 'Corte Moderno Dama',
        subcategoria_id: corteSubcat.id,
        salon_id: salon.id,
        duracion: 45,
        precio: 350.00,
        descripcion: 'Corte moderno y estilizado para dama',
      })
    }

    if (manicuraSubcat) {
      serviciosEjemplo.push({
        nombre: 'Manicure Clásico',
        subcategoria_id: manicuraSubcat.id,
        salon_id: salon.id,
        duracion: 45,
        precio: 250.00,
        descripcion: 'Manicure tradicional con esmaltado',
      })
    }

    if (colorSubcat) {
      serviciosEjemplo.push({
        nombre: 'Tinte Completo',
        subcategoria_id: colorSubcat.id,
        salon_id: salon.id,
        duracion: 120,
        precio: 800.00,
        descripcion: 'Cambio de color completo con productos premium',
      })
    }

    if (serviciosEjemplo.length > 0) {
      await prisma.servicioItem.createMany({
        data: serviciosEjemplo
      })
      console.log(`✅ ${serviciosEjemplo.length} servicios de ejemplo creados`)
    }
  } else {
    console.log(`✅ Servicios existentes: ${serviciosCount}`)
  }

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📋 Credenciales de prueba:')
  console.log('👨‍💼 Super Admin: admin@salonbooker.com / admin123')
  console.log('🏪 Admin Salón: maria@salon.com / salon123')
  console.log('👤 Cliente: ana@cliente.com / cliente123')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })