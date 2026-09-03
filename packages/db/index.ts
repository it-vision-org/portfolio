/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client";
import { softDeleteExtension } from "./extensions";

// Plain Prisma over a standard Postgres (TCP) connection — DATABASE_URL points at
// Neon's pooler with sslmode=require. This works in every Node context (dev, `next
// start`, build-time rendering, non-edge serverless). No WebSocket driver adapter,
// which was flaky outside the Edge runtime.
const extendedPrisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
}).$extends(softDeleteExtension);

declare global {
  var db: typeof extendedPrisma | undefined;
}

export const db = global.db ?? extendedPrisma;

export * from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
