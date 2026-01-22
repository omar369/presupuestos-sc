CREATE TABLE `croquis` (
	`id` text PRIMARY KEY NOT NULL,
	`trabajo_id` text NOT NULL,
	`name` text NOT NULL,
	`doc_version` text NOT NULL,
	`payload_json` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`trabajo_id`) REFERENCES `trabajos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `croquis_trabajo_id_idx` ON `croquis` (`trabajo_id`);