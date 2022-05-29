-- CreateTable
CREATE TABLE "JwtKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL
);
