/*
  Warnings:

  - You are about to drop the `has_technology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `technology` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `has_technology` DROP FOREIGN KEY `has_technology`;

-- AlterTable
ALTER TABLE `discussion_visibility` MODIFY `name` CHAR(7) NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `technology` VARCHAR(255) NULL,
    MODIFY `id_project` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `roles` MODIFY `name` CHAR(13) NOT NULL;

-- DropTable
DROP TABLE `has_technology`;

-- DropTable
DROP TABLE `technology`;
