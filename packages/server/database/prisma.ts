import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
   throw new Error('DATABASE_URL environment variable is required');
}

const url = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
   host: url.hostname === 'localhost' ? '127.0.0.1' : url.hostname,
   port: Number(url.port || 3306),
   user: decodeURIComponent(url.username),
   password: decodeURIComponent(url.password),
   database: url.pathname.slice(1),
   connectionLimit: 10,
   connectTimeout: 5_000,
   acquireTimeout: 10_000,
   allowPublicKeyRetrieval: true,
});

export const prisma = new PrismaClient({ adapter });

export async function connectDatabase(): Promise<void> {
   await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
   await prisma.$disconnect();
}
