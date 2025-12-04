import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Singleton DB connection for server runtime
declare global {
  // eslint-disable-next-line no-var
  var __db__: ReturnType<typeof drizzle> | undefined;
}

function createDb() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  return drizzle(turso, { schema });
}

export const db = global.__db__ ?? createDb();
if (process.env.NODE_ENV !== "production") global.__db__ = db;

