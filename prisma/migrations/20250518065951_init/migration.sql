-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('EMPATHY', 'SUPPORT', 'HUG', 'ANGRY', 'SAD');

-- CreateTable
CREATE TABLE "Rant" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anonymousId" TEXT NOT NULL,

    CONSTRAINT "Rant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anonymousId" TEXT NOT NULL,
    "rantId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anonymousId" TEXT NOT NULL,
    "rantId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rant_createdAt_idx" ON "Rant"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_rantId_createdAt_idx" ON "Comment"("rantId", "createdAt");

-- CreateIndex
CREATE INDEX "Reaction_rantId_type_idx" ON "Reaction"("rantId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_rantId_anonymousId_type_key" ON "Reaction"("rantId", "anonymousId", "type");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_rantId_fkey" FOREIGN KEY ("rantId") REFERENCES "Rant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_rantId_fkey" FOREIGN KEY ("rantId") REFERENCES "Rant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
