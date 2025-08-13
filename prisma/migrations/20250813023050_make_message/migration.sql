/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."messages" (
    "id" SERIAL NOT NULL,
    "uuid" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "messages_uuid_key" ON "public"."messages"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_uuid_key" ON "public"."rooms"("uuid");

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
