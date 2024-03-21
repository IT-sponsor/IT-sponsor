-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_ibfk_1`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_ibfk_2`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_ibfk_3`;

-- DropForeignKey
ALTER TABLE `fault` DROP FOREIGN KEY `fault_ibfk_1`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_ibfk_1`;

-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `issue_ibfk_1`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `vote_ibfk_1`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `vote_ibfk_2`;

-- DropIndex
DROP INDEX `email` ON `users`;

-- DropIndex
DROP INDEX `github` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `fk_projectid_project`,
    DROP COLUMN `id_user`,
    DROP COLUMN `name`,
    DROP COLUMN `surname`,
    ADD COLUMN `first_name` VARCHAR(255) NULL,
    ADD COLUMN `fk_imagesid_images` INTEGER NULL,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD COLUMN `last_name` VARCHAR(255) NULL,
    MODIFY `email` varchar(255) NULL,
    MODIFY `github` varchar(255) NULL,
    MODIFY `role` enum('volunteer','project_owner','admin') NULL,
    ADD PRIMARY KEY (`id` ASC);

-- DropTable
DROP TABLE `comment`;

-- DropTable
DROP TABLE `fault`;

-- DropTable
DROP TABLE `image`;

-- DropTable
DROP TABLE `issue`;

-- DropTable
DROP TABLE `project`;

-- DropTable
DROP TABLE `vote`;

-- CreateTable
CREATE TABLE `applies` (
    `fk_usersid` INTEGER NOT NULL,
    `fk_issuesid` INTEGER NOT NULL,

    PRIMARY KEY (`fk_usersid` ASC, `fk_issuesid` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `controls` (
    `fk_usersid` INTEGER NOT NULL,
    `fk_projectsid` INTEGER NOT NULL,

    PRIMARY KEY (`fk_usersid` ASC, `fk_projectsid` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faults` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `created_at` DATE NULL,
    `description` VARCHAR(2000) NULL,
    `replication_steps` VARCHAR(2000) NULL,
    `fix_info` VARCHAR(2000) NULL,
    `severity` ENUM('high', 'medium', 'low') NULL,
    `status` ENUM('open', 'closed', 'draft', 'in_progress') NULL,
    `fk_projectsid` INTEGER NOT NULL,
    `fk_usersid` INTEGER NOT NULL,

    INDEX `has3`(`fk_projectsid` ASC),
    INDEX `reports`(`fk_usersid` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gets_assigned` (
    `fk_usersid` INTEGER NOT NULL,
    `fk_issuesid` INTEGER NOT NULL,

    PRIMARY KEY (`fk_usersid` ASC, `fk_issuesid` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `uploaded_at` DATE NULL,
    `file_path` VARCHAR(255) NULL,
    `image` BLOB NULL,
    `id_images` INTEGER NOT NULL,
    `fk_faultsid` INTEGER NULL,
    `fk_issuesid` INTEGER NULL,

    INDEX `has2`(`fk_faultsid` ASC),
    PRIMARY KEY (`id_images` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issues` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `description` VARCHAR(2000) NULL,
    `requirements` VARCHAR(2000) NULL,
    `desired_result` VARCHAR(2000) NULL,
    `status` ENUM('open', 'closed', 'draft', 'in_progress') NULL,
    `visibility` ENUM('public', 'private') NULL,
    `fk_projectsid` INTEGER NOT NULL,

    INDEX `has`(`fk_projectsid` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `short_description` VARCHAR(255) NULL,
    `long_description` VARCHAR(4000) NULL,
    `repository` VARCHAR(255) NULL,
    `technologies` VARCHAR(1000) NULL,
    `created_at` DATE NULL,
    `updated_at` DATE NULL,
    `star_count` INTEGER NULL,
    `contributor_count` INTEGER NULL,
    `codebase_visibility` ENUM('public', 'private') NULL,
    `fk_imagesid_images` INTEGER NULL,

    UNIQUE INDEX `fk_imagesid_images`(`fk_imagesid_images` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `fk_imagesid_images` ON `users`(`fk_imagesid_images` ASC);

-- AddForeignKey
ALTER TABLE `applies` ADD CONSTRAINT `applies` FOREIGN KEY (`fk_usersid`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls` FOREIGN KEY (`fk_usersid`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `faults` ADD CONSTRAINT `has3` FOREIGN KEY (`fk_projectsid`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `faults` ADD CONSTRAINT `reports` FOREIGN KEY (`fk_usersid`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `gets_assigned` ADD CONSTRAINT `gets_assigned` FOREIGN KEY (`fk_usersid`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `has2` FOREIGN KEY (`fk_faultsid`) REFERENCES `faults`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `issues` ADD CONSTRAINT `has` FOREIGN KEY (`fk_projectsid`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `has1` FOREIGN KEY (`fk_imagesid_images`) REFERENCES `images`(`id_images`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `uploads` FOREIGN KEY (`fk_imagesid_images`) REFERENCES `images`(`id_images`) ON DELETE RESTRICT ON UPDATE RESTRICT;

