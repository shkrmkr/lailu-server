/*
  Warnings:

  - Made the column `votes` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "votes" SET NOT NULL,
ALTER COLUMN "votes" SET DEFAULT 0;
