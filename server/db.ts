import { PrismaClient } from "./prisma/generated/prisma/client/index.js";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "prod") {
  globalForPrisma.prisma = prisma;
}
