import "dotenv/config";
import { PrismaClient } from './generated-client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Create the raw connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// 2. Wrap it in the Prisma Adapter
const adapter = new PrismaPg(pool);
// 3. Give the adapter to the client
const prisma = new PrismaClient({ adapter });

// prisma/seed.ts

async function main() {
  console.log("🌱 Seeding database...");

  const title = "My Weekly Screen Audit";

  const post = await prisma.post.create({
    data: {
      title: title,
      content: `How I analyze my digital usage to reclaim intention and reduce mindless scrolling. This is the heart of Mindful Tech.

The first step in my process is looking at the raw data. I check my screen time settings every Sunday evening. Usually, I'm shocked by the numbers. But instead of feeling guilty, I ask myself: 'How much of this was intentional?'
      
I've found that by categorizing my apps into 'Tools' vs 'Temptations', I can better manage my energy. Tools stay on the home screen. Temptations get moved to the last page, hidden in folders.
      
By reclaiming just thirty minutes a day from mindless scrolling, I’ve gained back three and a half hours a week. That is time for reading, walking, and being present with the people I love.`,
      authorName: "Najmi Nazar",
      authorEmail: "najmi@example.com",
      tags: {
        connectOrCreate: [
          { where: { name: "Tools" }, create: { name: "Tools" } },
          { where: { name: "Medium Energy" }, create: { name: "Medium Energy" } },
          { where: { name: "Digital Wellness" }, create: { name: "Digital Wellness" } },
        ],
      },
    },
  });

  console.log(`✅ Created post with ID: ${post.id}`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error("Blog post failed to get created:", e);
    await prisma.$disconnect();
    process.exit(1);
  });