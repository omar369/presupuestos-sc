CREATE TABLE `bitacora_registros` (
	`id` text PRIMARY KEY NOT NULL,
	`bitacora_id` text NOT NULL,
	`fecha` text NOT NULL,
	`hora_inicio` text NOT NULL,
	`hora_fin` text NOT NULL,
	`empleados` integer NOT NULL,
	`accidentes` text NOT NULL,
	`notas_finales` text NOT NULL,
	`snapshot_json` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`bitacora_id`) REFERENCES `bitacoras`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bitacoras` (
	`id` text PRIMARY KEY NOT NULL,
	`trabajo_id` text NOT NULL,
	`croquis_id` text NOT NULL,
	`encargado_nombre` text NOT NULL,
	`fecha_inicio_est` text NOT NULL,
	`fecha_fin_est` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`trabajo_id`) REFERENCES `trabajos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`croquis_id`) REFERENCES `croquis`(`id`) ON UPDATE no action ON DELETE restrict
);
