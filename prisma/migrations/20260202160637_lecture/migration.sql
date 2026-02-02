-- CreateTable
CREATE TABLE "AnnonceLecture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "annonceId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnnonceLecture_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "Annonce" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AnnonceLecture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AnnonceLecture_annonceId_userId_key" ON "AnnonceLecture"("annonceId", "userId");
