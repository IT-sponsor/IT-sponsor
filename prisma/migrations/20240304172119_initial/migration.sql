-- CreateTable
CREATE TABLE `discussion` (
    `name` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `active` BOOLEAN NULL,
    `visibility` INTEGER NULL,
    `id_discussion` INTEGER NOT NULL,
    `fk_userid_user` INTEGER NOT NULL,

    INDEX `fk_userid_user`(`fk_userid_user`),
    INDEX `visibility`(`visibility`),
    PRIMARY KEY (`id_discussion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discussion_comment` (
    `description` VARCHAR(255) NULL,
    `creation_date` DATE NULL,
    `id_discussion_comment` INTEGER NOT NULL,
    `fk_discussionid_discussion` INTEGER NOT NULL,
    `fk_userid_user` INTEGER NOT NULL,

    INDEX `comments`(`fk_userid_user`),
    INDEX `fk_discussionid_discussion`(`fk_discussionid_discussion`),
    PRIMARY KEY (`id_discussion_comment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discussion_visibility` (
    `id_discussion_visibility` INTEGER NOT NULL,
    `name` VARCHAR(7) NOT NULL,

    PRIMARY KEY (`id_discussion_visibility`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `has_technology` (
    `fk_projectid_project` INTEGER NOT NULL,
    `fk_technologyid_technology` INTEGER NOT NULL,

    PRIMARY KEY (`fk_projectid_project`, `fk_technologyid_technology`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `name` VARCHAR(255) NULL,
    `short_description` VARCHAR(255) NULL,
    `long_description` VARCHAR(255) NULL,
    `repository` VARCHAR(255) NULL,
    `logo` BLOB NULL,
    `id_project` INTEGER NOT NULL,

    PRIMARY KEY (`id_project`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_roles` INTEGER NOT NULL,
    `name` VARCHAR(13) NOT NULL,

    PRIMARY KEY (`id_roles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technology` (
    `name` VARCHAR(255) NULL,
    `id_technology` INTEGER NOT NULL,

    PRIMARY KEY (`id_technology`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `name` VARCHAR(255) NULL,
    `surname` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `github` VARCHAR(255) NULL,
    `banned_until` DATE NULL,
    `role` INTEGER NULL,
    `id_user` INTEGER NOT NULL,
    `fk_projectid_project` INTEGER NOT NULL,

    INDEX `controls`(`fk_projectid_project`),
    INDEX `role`(`role`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vote` (
    `is_positive` BOOLEAN NULL,
    `id_vote` INTEGER NOT NULL,
    `fk_discussion_commentid_discussion_comment` INTEGER NOT NULL,
    `fk_userid_user` INTEGER NOT NULL,

    INDEX `fk_discussion_commentid_discussion_comment`(`fk_discussion_commentid_discussion_comment`),
    INDEX `votes`(`fk_userid_user`),
    PRIMARY KEY (`id_vote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `discussion` ADD CONSTRAINT `discussion_ibfk_1` FOREIGN KEY (`visibility`) REFERENCES `discussion_visibility`(`id_discussion_visibility`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `discussion` ADD CONSTRAINT `discussion_ibfk_2` FOREIGN KEY (`fk_userid_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `discussion_comment` ADD CONSTRAINT `comments` FOREIGN KEY (`fk_userid_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `discussion_comment` ADD CONSTRAINT `discussion_comment_ibfk_1` FOREIGN KEY (`fk_discussionid_discussion`) REFERENCES `discussion`(`id_discussion`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `has_technology` ADD CONSTRAINT `has_technology` FOREIGN KEY (`fk_projectid_project`) REFERENCES `project`(`id_project`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `controls` FOREIGN KEY (`fk_projectid_project`) REFERENCES `project`(`id_project`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles`(`id_roles`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`fk_discussion_commentid_discussion_comment`) REFERENCES `discussion_comment`(`id_discussion_comment`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `votes` FOREIGN KEY (`fk_userid_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE RESTRICT;
