/**
 * Seed de la base de datos de Proxi.
 *
 * Carga las categorías iniciales de servicios. Es idempotente: usa `upsert`
 * por `slug`, de modo que puede ejecutarse múltiples veces sin duplicar datos.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed de categorías...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
    console.log(`  ✔ Categoría asegurada: ${category.name}`);
  }

  console.log('✅ Seed completado correctamente.');
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
