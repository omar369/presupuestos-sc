CREATE TABLE `croquis_items` (
	`id` text PRIMARY KEY NOT NULL,
	`croquis_id` text NOT NULL,
	`shape_id` text NOT NULL,
	`area_id` text NOT NULL,
	`servicio_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`croquis_id`) REFERENCES `croquis`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_servicios` (
	`id` text PRIMARY KEY NOT NULL,
	`trabajo_id` text NOT NULL,
	`area_id` text NOT NULL,
	`tipo_servicio` text NOT NULL,
	`unidad` text NOT NULL,
	`cantidad` text NOT NULL,
	`producto_marca` text DEFAULT '' NOT NULL,
	`producto_modelo` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`trabajo_id`) REFERENCES `trabajos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_servicios`("id", "trabajo_id", "area_id", "tipo_servicio", "unidad", "cantidad", "producto_marca", "producto_modelo", "created_at", "updated_at") SELECT "id", "trabajo_id", "area_id", "tipo_servicio", "unidad", "cantidad", "producto_marca", "producto_modelo", "created_at", "updated_at" FROM `servicios`;--> statement-breakpoint
DROP TABLE `servicios`;--> statement-breakpoint
ALTER TABLE `__new_servicios` RENAME TO `servicios`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_areas` (
	`id` text PRIMARY KEY NOT NULL,
	`trabajo_id` text NOT NULL,
	`nombre` text NOT NULL,
	`notas` text DEFAULT '' NOT NULL,
	`ubicacion` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`trabajo_id`) REFERENCES `trabajos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_areas`("id", "trabajo_id", "nombre", "notas", "ubicacion", "created_at", "updated_at") SELECT "id", "trabajo_id", "nombre", "notas", "ubicacion", "created_at", "updated_at" FROM `areas`;--> statement-breakpoint
DROP TABLE `areas`;--> statement-breakpoint
ALTER TABLE `__new_areas` RENAME TO `areas`;