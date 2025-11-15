CREATE TABLE `abandonedCarts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerName` varchar(255),
	`cartData` json NOT NULL,
	`cartTotal` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`reminderSent` boolean NOT NULL DEFAULT false,
	`reminderSentAt` timestamp,
	`recovered` boolean NOT NULL DEFAULT false,
	`recoveredAt` timestamp,
	CONSTRAINT `abandonedCarts_id` PRIMARY KEY(`id`),
	CONSTRAINT `abandonedCarts_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `outfits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`image` varchar(500),
	`productIds` json NOT NULL,
	`totalPrice` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `outfits_id` PRIMARY KEY(`id`)
);
