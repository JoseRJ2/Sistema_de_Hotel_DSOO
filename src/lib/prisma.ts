import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida en el archivo .env");
}

const parsedUrl = new URL(databaseUrl);

function createAdapter() {
  return new PrismaMariaDb({
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 3306),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace("/", ""),
    allowPublicKeyRetrieval: true,
    connectionLimit: 5,
  });
}

function createPrismaClient() {
  return new PrismaClient({ adapter: createAdapter() });
}

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

function isPoolTimeoutError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error ?? "").toString();
  return message.toLowerCase().includes("pool timeout");
}

export async function withPrismaRetry<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await operation(getPrismaClient());
  } catch (error) {
    if (!isPoolTimeoutError(error)) {
      throw error;
    }

    // Recreate the client after pool starvation (common after DB/container restarts).
    await getPrismaClient()
      .$disconnect()
      .catch(() => undefined);

    globalForPrisma.prisma = createPrismaClient();

    return operation(getPrismaClient());
  }
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
