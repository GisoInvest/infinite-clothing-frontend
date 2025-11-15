CREATE TABLE `discountCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`discountType` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
	`discountValue` decimal(10,2) NOT NULL,
	`minPurchaseAmount` decimal(10,2) NOT NULL DEFAULT '0',
	`maxUses` int NOT NULL DEFAULT 1,
	`usedCount` int NOT NULL DEFAULT 0,
	`userId` int,
	`subscriberEmail` varchar(320),
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `discountCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `discountCodes_code_unique` UNIQUE(`code`)
);
