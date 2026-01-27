import { sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
  SQLiteTimestamp,
  index,
  uniqueIndex,
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

// TEMPORARILY DISABLED - presupuestoId functionality not in use
// export const presupuestosRelations = relations(presupuestos, ({ one, many }) => ({
//   cliente: one(clientes, {
//     fields: [presupuestos.clienteId],
//     references: [clientes.id],
//   }),
//   areas: many(areas),
// }));

// Tabla de áreas que pertenecen a un presupuesto
// export const areas = sqliteTable("areas", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   presupuestoId: integer("presupuesto_id")
//     .notNull()
//     .references(() => presupuestos.id, { onDelete: "cascade", onUpdate: "cascade" }),
//   nombre: text("nombre").notNull(),
//   ubicacion: text("ubicacion", { enum: ["INTERIOR", "EXTERIOR"] as const }).notNull(),
//   createdAt: integer("created_at", { mode: "timestamp_ms" })
//     .notNull()
//     .default(nowMs),
//   updatedAt: integer("updated_at", { mode: "timestamp_ms" })
//     .notNull()
//     .default(nowMs),
// });

// export const areasRelations = relations(areas, ({ one, many }) => ({
//   presupuesto: one(presupuestos, {
//     fields: [areas.presupuestoId],
//     references: [presupuestos.id],
//   }),
//   servicios: many(servicios),
// }));

// // Tabla de servicios por área
// export const servicios = sqliteTable("servicios", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   areaId: integer("area_id")
//     .notNull()
//     .references(() => areas.id, { onDelete: "cascade", onUpdate: "cascade" }),
//   tipoServicio: text("tipo_servicio", { enum: ["PINTURA"] as const }).notNull(),
//   unidadDeMedida: text("unidad_de_medida", { enum: ["m2", "ml"] as const }).notNull().default("m2"),
//   cantidadM2: real("cantidad_m2").notNull(),
//   tipoSuperficie: text("tipo_superficie", { enum: ["LISO", "RUGOSO", "EXTRARUGOSO"] as const }).notNull(),
//   marcaModelo: text("marca_modelo").notNull(),
//   precioUnitario: real("precio_unitario").notNull().default(0),
//   importe: real("importe").notNull().default(0),
//   createdAt: integer("created_at", { mode: "timestamp_ms" })
//     .notNull()
//     .default(nowMs),
//   updatedAt: integer("updated_at", { mode: "timestamp_ms" })
//     .notNull()
//     .default(nowMs),
// });

// export const serviciosRelations = relations(servicios, ({ one }) => ({
//   area: one(areas, {
//     fields: [servicios.areaId],
//     references: [areas.id],
//   }),
// }));

export const areas = sqliteTable('areas', {
  id: text('id').primaryKey(),
  trabajo_id: text('trabajo_id').notNull().references(() => trabajos.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  notas: text('notas').notNull().default(''),
  ubicacion: text('ubicacion', { enum: ['INTERIOR', 'EXTERIOR'] }).notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
})

export const servicios = sqliteTable('servicios', {
  id: text('id').primaryKey(),
  trabajo_id: text('trabajo_id').notNull().references(() => trabajos.id, { onDelete: 'cascade' }),
  area_id: text('area_id').notNull().references(() => areas.id, { onDelete: 'cascade' }),
  tipo_servicio: text('tipo_servicio', { enum: ['PINTURA', 'ESMALTE', 'SELLO', 'EPOXICO', 'OTROS'] }).notNull(),
  unidad: text('unidad', { enum: ['M2', 'ML'] }).notNull(),
  cantidad: text('cantidad').notNull(), // guardamos como texto para evitar float issues; luego parseas a number
  producto_marca: text('producto_marca').notNull().default(''),
  producto_modelo: text('producto_modelo').notNull().default(''),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
})

export const croquisItems = sqliteTable('croquis_items', {
  id: text('id').primaryKey(),
  croquis_id: text('croquis_id').notNull().references(() => croquis.id, { onDelete: 'cascade' }),
  shape_id: text('shape_id').notNull(), // id de la figura en tu doc.entities
  area_id: text('area_id').notNull().references(() => areas.id, { onDelete: 'cascade' }),
  servicio_id: text('servicio_id').notNull().references(() => servicios.id, { onDelete: 'cascade' }),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
})

// Tipos inferidos útiles
export type Cliente = typeof clientes.$inferSelect;
export type NewCliente = typeof clientes.$inferInsert;

export type Presupuesto = typeof presupuestos.$inferSelect;
export type NewPresupuesto = typeof presupuestos.$inferInsert;

export type Area = typeof areas.$inferSelect;
export type NewArea = typeof areas.$inferInsert;

export type Servicio = typeof servicios.$inferSelect;
export type NewServicio = typeof servicios.$inferInsert;


// Trabajos (objeto padre)
export const trabajos = sqliteTable('trabajos', {
  id: text('id').primaryKey(),

  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),

  clienteNombre: text('cliente_nombre'),
  encargadoNombre: text('encargado_nombre'),

  direccion: text('direccion'),
  contacto: text('contacto'),

  startDate: text('start_date'),
  endDate: text('end_date'),

  status: text('status').notNull().default('BORRADOR'),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const croquis = sqliteTable(
  "croquis",
  {
    id: text("id").primaryKey(),
    trabajoId: text("trabajo_id")
      .notNull()
      .references(() => trabajos.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    docVersion: text("doc_version").notNull(),
    payloadJson: text("payload_json").notNull(),

    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({
    trabajoIdIdx: uniqueIndex("croquis_trabajo_id_idx").on(t.trabajoId),
  })
);

export const bitacoras = sqliteTable(
  'bitacoras',
  {
    id: text('id').primaryKey(),
    trabajoId: text('trabajo_id').notNull().references(() => trabajos.id, { onDelete: 'cascade' }),
    croquisId: text('croquis_id').notNull().references(() => croquis.id, { onDelete: 'restrict' }),
    encargadoNombre: text('encargado_nombre').notNull(),
    fechaInicioEst: text('fecha_inicio_est').notNull(), // ISO date
    fechaFinEst: text('fecha_fin_est').notNull(),       // ISO date
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => ({
    trabajoIdIdx: uniqueIndex('bitacoras_trabajo_id_idx').on(t.trabajoId),
  })
)

export const bitacoraRegistros = sqliteTable('bitacora_registros', {
  id: text('id').primaryKey(),
  bitacoraId: text('bitacora_id').notNull().references(() => bitacoras.id, { onDelete: 'cascade' }),
  fecha: text('fecha').notNull(),        // ISO date (auto)
  horaInicio: text('hora_inicio').notNull(), // "HH:MM"
  horaFin: text('hora_fin').notNull(),       // "HH:MM"
  empleados: integer('empleados').notNull(),
  accidentes: text('accidentes').notNull(), // texto corto o "0"
  notasFinales: text('notas_finales').notNull(),
  snapshotJson: text('snapshot_json').notNull(), // copia de croquis/areas/servicios al cerrar el día
  createdAt: text('created_at').notNull(),
})
