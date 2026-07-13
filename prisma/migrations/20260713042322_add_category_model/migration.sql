-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_categories" (
    "storyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "story_categories_pkey" PRIMARY KEY ("storyId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "story_categories" ADD CONSTRAINT "story_categories_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("storyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_categories" ADD CONSTRAINT "story_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
