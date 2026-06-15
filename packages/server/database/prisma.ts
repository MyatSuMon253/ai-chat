import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
   throw new Error('DATABASE_URL environment variable is required');
}

const adapter = new PrismaMariaDb(databaseUrl);

export const prisma = new PrismaClient({ adapter });

export async function connectDatabase(): Promise<void> {
   await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
   await prisma.$disconnect();
}
