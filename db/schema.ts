import { sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Tipos usados en formularios actuales
export type TipoLugar =
  | "CASA"
  | "DEPARTAMENTO"
  | "BODEGA"
  | "LOCAL"
  | "OFICINA"
  | "OTRO";

export type UbicacionArea = "INTERIOR" | "EXTERIOR";

export type TipoServicio = "PINTURA"; // Por ahora solo PINTURA, ampliable

export type TipoSuperficie = "LISO" | "RUGOSO" | "EXTRARUGOSO";

// Utilidades para timestamps en ms
const nowMs = sql`(strftime('%s','now') * 1000)`; // epoch segundos * 1000

// Tabla de clientes: entidad reutilizable para múltiples presupuestos
export const clientes = sqliteTable("clientes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  direccion: text("direccion").notNull(),
  tipoLugar: text("tipo_lugar", {
    enum: [
      "CASA",
      "DEPARTAMENTO",
      "BODEGA",
      "LOCAL",
      "OFICINA",
      "OTRO",
    ] as const
  }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
});

export const clientesRelations = relations(clientes, ({ many }) => ({
  presupuestos: many(presupuestos),
}));

// Tabla de presupuestos: uno por flujo de cotización
export const presupuestos = sqliteTable("presupuestos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clienteId: integer("cliente_id")
    .notNull()
    .references(() => clientes.id, { onDelete: "restrict", onUpdate: "cascade" }),
  subtotal: real("subtotal").notNull().default(0),
  impuestos: real("impuestos").notNull().default(0),
  total: real("total").notNull().default(0),
  // En futuro podríamos añadir: estado, código, notas, etc.
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
});

export const presupuestosRelations = relations(presupuestos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [presupuestos.clienteId],
    references: [clientes.id],
  }),
  areas: many(areas),
}));

// Tabla de áreas que pertenecen a un presupuesto
export const areas = sqliteTable("areas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  presupuestoId: integer("presupuesto_id")
    .notNull()
    .references(() => presupuestos.id, { onDelete: "cascade", onUpdate: "cascade" }),
  nombre: text("nombre").notNull(),
  ubicacion: text("ubicacion", { enum: ["INTERIOR", "EXTERIOR"] as const }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
});

export const areasRelations = relations(areas, ({ one, many }) => ({
  presupuesto: one(presupuestos, {
    fields: [areas.presupuestoId],
    references: [presupuestos.id],
  }),
  servicios: many(servicios),
}));

// Tabla de servicios por área
export const servicios = sqliteTable("servicios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  areaId: integer("area_id")
    .notNull()
    .references(() => areas.id, { onDelete: "cascade", onUpdate: "cascade" }),
  tipoServicio: text("tipo_servicio", { enum: ["PINTURA"] as const }).notNull(),
  cantidadM2: real("cantidad_m2").notNull(),
  tipoSuperficie: text("tipo_superficie", { enum: ["LISO", "RUGOSO", "EXTRARUGOSO"] as const }).notNull(),
  marcaModelo: text("marca_modelo").notNull(),
  precioUnitario: real("precio_unitario").notNull().default(0),
  importe: real("importe").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(nowMs),
});

export const serviciosRelations = relations(servicios, ({ one }) => ({
  area: one(areas, {
    fields: [servicios.areaId],
    references: [areas.id],
  }),
}));

// Tipos inferidos útiles
export type Cliente = typeof clientes.$inferSelect;
export type NewCliente = typeof clientes.$inferInsert;

export type Presupuesto = typeof presupuestos.$inferSelect;
export type NewPresupuesto = typeof presupuestos.$inferInsert;

export type Area = typeof areas.$inferSelect;
export type NewArea = typeof areas.$inferInsert;

export type Servicio = typeof servicios.$inferSelect;
export type NewServicio = typeof servicios.$inferInsert;

