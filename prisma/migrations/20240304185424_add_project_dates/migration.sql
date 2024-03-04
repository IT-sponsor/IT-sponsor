/*
  Warnings:

  - You are about to alter the column `logo` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `project` ADD COLUMN `creation_date` DATE NULL,
    ADD COLUMN `last_updated` DATE NULL,
    MODIFY `logo` VARCHAR(255) NULL,
    MODIFY `id_project` INTEGER NOT NULL;
