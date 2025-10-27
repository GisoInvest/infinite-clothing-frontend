ALTER TABLE `products` ADD `colors` json NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `sizes` json NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `discount` int DEFAULT 0 NOT NULL;