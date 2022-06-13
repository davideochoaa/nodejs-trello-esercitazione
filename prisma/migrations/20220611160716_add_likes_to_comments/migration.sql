/*
  Warnings:

  - Added the required column `like` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "like" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "contentsId" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_contentsId_fkey" FOREIGN KEY ("contentsId") REFERENCES "Content" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("contentsId", "dashboardId", "id", "position", "text", "userId") SELECT "contentsId", "dashboardId", "id", "position", "text", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE UNIQUE INDEX "Comment_id_contentsId_key" ON "Comment"("id", "contentsId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
