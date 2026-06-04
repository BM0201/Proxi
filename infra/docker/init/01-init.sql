-- Script de inicialización de PostgreSQL para Proxi.
-- Habilita extensiones útiles. Las tablas las gestiona Prisma vía migraciones.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
