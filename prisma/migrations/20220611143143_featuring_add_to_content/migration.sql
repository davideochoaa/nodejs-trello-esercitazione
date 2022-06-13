/*
  Warnings:

  - Added the required column `title` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "dashboardId" TEXT NOT NULL,
    CONSTRAINT "Content_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Content" ("dashboardId", "id", "position", "text") SELECT "dashboardId", "id", "position", "text" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_id_dashboardId_key" ON "Content"("id", "dashboardId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
