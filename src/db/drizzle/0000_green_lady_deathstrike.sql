CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`distance_km` real NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`is_completed` integer DEFAULT false,
	`strava_activity_id` text,
	`external_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workouts_external_id_unique` ON `workouts` (`external_id`);