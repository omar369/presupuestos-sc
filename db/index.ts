import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// 1. Definir la función de creación primero
function createDb() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // Se pasa el esquema al inicializar drizzle
  return drizzle(turso, { schema });
}

// 2. Declarar el tipo global usando el tipo de retorno específico de createDb
declare global {
  // eslint-disable-next-line no-var
  var __db__: ReturnType<typeof createDb> | undefined;
}

// 3. Exportar la instancia de la base de datos
export const db = global.__db__ ?? createDb();

if (process.env.NODE_ENV !== "production") {
  global.__db__ = db;
}

