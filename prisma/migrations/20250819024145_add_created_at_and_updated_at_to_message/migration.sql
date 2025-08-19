/*
  Warnings:

  - Added the required column `createdAt` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."messages" ADD COLUMN     "createdAt" TIMESTAMP(0) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
