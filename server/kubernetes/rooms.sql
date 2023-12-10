CREATE TABLE `rooms` (
	`id` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`players` VARCHAR(200) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`maxUsers` INT(11) NOT NULL DEFAULT '2',
	`isActive` BIT(1) NOT NULL,
	`isEnded` BIT(1) NOT NULL,
	`endedAt` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=MyISAM
AUTO_INCREMENT=9
;
