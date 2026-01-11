CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`date_created` text NOT NULL,
	`distance_km` real NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`notes` text,
	`type` text NOT NULL,
	`is_completed` integer DEFAULT false,
	`strava_activity_id` text,
	`external_id` text
);
