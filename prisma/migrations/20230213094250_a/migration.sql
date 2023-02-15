/*
  Warnings:

  - You are about to drop the column `shin_opendate` on the `shinchunghada` table. All the data in the column will be lost.
  - Added the required column `shin_period` to the `Shinchunghada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shinchunghada` DROP COLUMN `shin_opendate`,
    ADD COLUMN `shin_period` INTEGER NOT NULL;
