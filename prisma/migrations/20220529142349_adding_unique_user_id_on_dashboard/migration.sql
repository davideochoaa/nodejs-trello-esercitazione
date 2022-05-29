/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Dashboard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_id_userId_key" ON "Dashboard"("id", "userId");
