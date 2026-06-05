/**
 * Seed de la base de datos de Proxi.
 *
 * Carga:
 *  1. Categorías iniciales de servicios.
 *  2. Cuentas demo (admin, cliente, proveedor) con sus perfiles.
 *  3. Tareas demo publicadas por el cliente.
 *  4. Ofertas demo enviadas por el proveedor (SENT, ACCEPTED, REJECTED).
 *
 * Es idempotente: usa `upsert` por claves naturales (slug, email, unique),
 * de modo que puede ejecutarse múltiples veces sin duplicar datos.
 *
 * Credenciales demo (documentadas también en docs/development/local-start.md):
 *  - Admin:     admin@proxi.local     / ProxiAdmin123!
 *  - Cliente:   cliente@proxi.local   / ProxiCliente123!
 *  - Proveedor: proveedor@proxi.local / ProxiProveedor123!
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

/** Categorías iniciales de servicios de la plataforma. */
const categories: Array<{ name: string; slug: string; description: string }> = [
  {
    name: 'Electricidad básica',
    slug: 'electricidad-basica',
    description: 'Instalaciones y reparaciones eléctricas sencillas del hogar.',
  },
  {
    name: 'Fontanería',
    slug: 'fontaneria',
    description: 'Reparación de fugas, grifos, tuberías y desagües.',
  },
  {
    name: 'Reparaciones del hogar',
    slug: 'reparaciones-del-hogar',
    description: 'Pequeñas reparaciones y arreglos generales en el hogar.',
  },
  {
    name: 'Mantenimiento',
    slug: 'mantenimiento',
    description: 'Mantenimiento preventivo y correctivo de espacios e instalaciones.',
  },
  {
    name: 'Limpieza',
    slug: 'limpieza',
    description: 'Servicios de limpieza para hogares y oficinas.',
  },
  {
    name: 'Clases particulares',
    slug: 'clases-particulares',
    description: 'Apoyo educativo y clases personalizadas por materia.',
  },
  {
    name: 'Mandados',
    slug: 'mandados',
    description: 'Gestiones, compras y diligencias por encargo.',
  },
  {
    name: 'Transporte ligero',
    slug: 'transporte-ligero',
    description: 'Traslado de objetos y mudanzas pequeñas.',
  },
  {
    name: 'Instalaciones',
    slug: 'instalaciones',
    description: 'Montaje e instalación de muebles, electrodomésticos y equipos.',
  },
  {
    name: 'Oficios por día',
    slug: 'oficios-por-dia',
    description: 'Contratación de proveedores independientes por jornada.',
  },
];

async function seedCategories(): Promise<void> {
  console.log('🌱 Seed de categorías...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }
  console.log(`  ✔ ${categories.length} categorías aseguradas.`);
}

/**
 * Crea (o actualiza) un usuario demo de forma idempotente, junto a su perfil.
 * Devuelve el usuario.
 */
async function upsertDemoUser(params: {
  email: string;
  password: string;
  role: 'ADMIN' | 'CLIENT' | 'PROVIDER';
  displayName: string;
}) {
  const passwordHash = await bcrypt.hash(params.password, SALT_ROUNDS);
  return prisma.user.upsert({
    where: { email: params.email },
    update: {
      role: params.role,
      status: 'ACTIVE',
      displayName: params.displayName,
      passwordHash,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: params.email,
      passwordHash,
      role: params.role,
      status: 'ACTIVE',
      displayName: params.displayName,
      emailVerifiedAt: new Date(),
    },
  });
}

async function seedDemoAccounts() {
  console.log('🌱 Seed de cuentas demo...');

  // 1. Admin demo
  const admin = await upsertDemoUser({
    email: 'admin@proxi.local',
    password: 'ProxiAdmin123!',
    role: 'ADMIN',
    displayName: 'Admin Proxi',
  });

  // 2. Cliente demo (con perfil)
  const client = await upsertDemoUser({
    email: 'cliente@proxi.local',
    password: 'ProxiCliente123!',
    role: 'CLIENT',
    displayName: 'Cliente Demo',
  });
  await prisma.clientProfile.upsert({
    where: { userId: client.id },
    update: { displayName: 'Cliente Demo' },
    create: { userId: client.id, displayName: 'Cliente Demo' },
  });

  // 3. Proveedor demo (con perfil): Nivel 1-2, rating/jobs mock, verificación APPROVED.
  const provider = await upsertDemoUser({
    email: 'proveedor@proxi.local',
    password: 'ProxiProveedor123!',
    role: 'PROVIDER',
    displayName: 'Proveedor Demo',
  });
  const providerProfile = await prisma.providerProfile.upsert({
    where: { userId: provider.id },
    update: {
      displayName: 'Proveedor Demo',
      bio: 'Proveedor independiente con experiencia en instalaciones y reparaciones del hogar.',
      level: 'LEVEL_2',
      ratingAverage: 4.7,
      ratingCount: 23,
      completedJobs: 31,
      verificationStatus: 'APPROVED',
    },
    create: {
      userId: provider.id,
      displayName: 'Proveedor Demo',
      bio: 'Proveedor independiente con experiencia en instalaciones y reparaciones del hogar.',
      level: 'LEVEL_2',
      ratingAverage: 4.7,
      ratingCount: 23,
      completedJobs: 31,
      verificationStatus: 'APPROVED',
    },
  });

  console.log('  ✔ Cuentas demo aseguradas (admin, cliente, proveedor).');
  return { admin, client, provider, providerProfile };
}

/**
 * Crea una ubicación demo idempotente para el cliente.
 * Como Location no tiene clave natural única, buscamos por label + ownerUserId.
 */
async function ensureClientLocation(clientId: string) {
  const existing = await prisma.location.findFirst({
    where: { ownerUserId: clientId, label: 'Casa (demo)' },
  });
  if (existing) return existing;
  return prisma.location.create({
    data: {
      ownerUserId: clientId,
      label: 'Casa (demo)',
      country: 'Nicaragua',
      department: 'Managua',
      city: 'Managua',
      zone: 'Carretera a Masaya, zona aproximada',
      addressLine1: 'Dirección exacta protegida (demo)',
      latitude: 12.114,
      longitude: -86.236,
      accuracyMeters: 30,
      isExact: true,
      visibility: 'BOOKING_ONLY',
    },
  });
}

/**
 * Crea (o reutiliza) una tarea demo de forma idempotente buscando por
 * clientId + título exacto.
 */
async function ensureTask(params: {
  clientId: string;
  title: string;
  description: string;
  categoryName: string;
  locationId: string;
  budgetMin: number;
  budgetMax: number;
}) {
  const existing = await prisma.task.findFirst({
    where: { clientId: params.clientId, title: params.title },
  });
  if (existing) return existing;
  return prisma.task.create({
    data: {
      clientId: params.clientId,
      title: params.title,
      description: params.description,
      categoryName: params.categoryName,
      locationId: params.locationId,
      status: 'RECEIVING_OFFERS',
      budgetMin: params.budgetMin,
      budgetMax: params.budgetMax,
      budget: params.budgetMax,
      pricingType: 'OPEN_TO_OFFERS',
    },
  });
}

async function seedTasksAndOffers(clientId: string, providerId: string) {
  console.log('🌱 Seed de tareas y ofertas demo...');
  const location = await ensureClientLocation(clientId);

  const fan = await ensureTask({
    clientId,
    title: 'Instalar abanico de techo',
    description:
      'Necesito instalar un abanico de techo en la sala. Ya tengo el abanico comprado, solo falta montarlo y conectarlo al punto eléctrico existente.',
    categoryName: 'Instalaciones',
    locationId: location.id,
    budgetMin: 700,
    budgetMax: 950,
  });

  const leak = await ensureTask({
    clientId,
    title: 'Reparar fuga en lavamanos',
    description:
      'Hay una fuga constante debajo del lavamanos del baño principal. Necesito que un proveedor independiente la revise y repare.',
    categoryName: 'Fontanería',
    locationId: location.id,
    budgetMin: 500,
    budgetMax: 800,
  });

  const mathClass = await ensureTask({
    clientId,
    title: 'Clase de matemática para secundaria',
    description:
      'Busco apoyo en matemática para estudiante de secundaria (álgebra y geometría). Clases una o dos veces por semana.',
    categoryName: 'Clases particulares',
    locationId: location.id,
    budgetMin: 300,
    budgetMax: 500,
  });

  // Ofertas demo del proveedor con estados SENT, ACCEPTED, REJECTED.
  // upsert por la clave única compuesta (taskId, providerId).
  await prisma.offer.upsert({
    where: { taskId_providerId: { taskId: fan.id, providerId } },
    update: {},
    create: {
      taskId: fan.id,
      providerId,
      price: 850,
      amount: 850,
      estimatedDuration: '1-2 horas',
      includesMaterials: false,
      requiresTechnicalVisit: false,
      message: 'Puedo instalarlo hoy y revisar el punto eléctrico antes de fijarlo.',
      status: 'SENT',
    },
  });

  await prisma.offer.upsert({
    where: { taskId_providerId: { taskId: leak.id, providerId } },
    update: {},
    create: {
      taskId: leak.id,
      providerId,
      price: 650,
      amount: 650,
      estimatedDuration: '2 horas',
      includesMaterials: true,
      requiresTechnicalVisit: false,
      message: 'Reviso la fuga, cambio el sifón si hace falta. Incluye materiales básicos.',
      status: 'ACCEPTED',
    },
  });

  await prisma.offer.upsert({
    where: { taskId_providerId: { taskId: mathClass.id, providerId } },
    update: {},
    create: {
      taskId: mathClass.id,
      providerId,
      price: 400,
      amount: 400,
      estimatedDuration: '1 hora por sesión',
      includesMaterials: false,
      requiresTechnicalVisit: false,
      message: 'Tengo experiencia dando clases de matemática a secundaria.',
      status: 'REJECTED',
    },
  });

  console.log('  ✔ 3 tareas demo y 3 ofertas demo (SENT, ACCEPTED, REJECTED).');
}

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed de Proxi...');
  await seedCategories();
  const { client, provider } = await seedDemoAccounts();
  await seedTasksAndOffers(client.id, provider.id);
  console.log('✅ Seed completado correctamente.');
  console.log('   Credenciales demo:');
  console.log('     Admin:     admin@proxi.local     / ProxiAdmin123!');
  console.log('     Cliente:   cliente@proxi.local   / ProxiCliente123!');
  console.log('     Proveedor: proveedor@proxi.local / ProxiProveedor123!');
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
