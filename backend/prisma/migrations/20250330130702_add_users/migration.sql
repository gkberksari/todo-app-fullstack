-- Önce user tablosunu oluştur
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Email için unique index oluştur
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Default bir kullanıcı oluştur var olan Todolar için
INSERT INTO "User" ("id", "email", "password", "createdAt", "updatedAt")
VALUES ('default-user', 'default@example.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Todo tablosuna userId sütunu ekle ama NOT NULL constraint olmadan
ALTER TABLE "Todo" ADD COLUMN "userId" TEXT;

-- Var olan tüm todolara default kullanıcıyı ata
UPDATE "Todo" SET "userId" = 'default-user';

-- Şimdi userId sütununu NOT NULL yap
ALTER TABLE "Todo" ALTER COLUMN "userId" SET NOT NULL;

-- Foreign key constraint ekle
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;