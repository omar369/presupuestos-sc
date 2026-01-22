CREATE TABLE `areas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`presupuesto_id` integer NOT NULL,
	`nombre` text NOT NULL,
	`ubicacion` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`direccion` text NOT NULL,
	`tipo_lugar` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `presupuestos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cliente_id` integer NOT NULL,
	`subtotal` real DEFAULT 0 NOT NULL,
	`impuestos` real DEFAULT 0 NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `servicios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`area_id` integer NOT NULL,
	`tipo_servicio` text NOT NULL,
	`unidad_de_medida` text DEFAULT 'm2' NOT NULL,
	`cantidad_m2` real NOT NULL,
	`tipo_superficie` text NOT NULL,
	`marca_modelo` text NOT NULL,
	`precio_unitario` real DEFAULT 0 NOT NULL,
	`importe` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trabajos` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`descripcion` text,
	`cliente_nombre` text,
	`encargado_nombre` text,
	`direccion` text,
	`contacto` text,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'BORRADOR' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
