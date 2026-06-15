import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.job.deleteMany();
  await prisma.reporter.deleteMany();
  await prisma.editor.deleteMany();

  const reporters = await Promise.all([
    prisma.reporter.create({
      data: { name: "Alice Johnson", location: "Jakarta", availability: true, ratePerMinute: 2000 },
    }),
    prisma.reporter.create({
      data: { name: "Budi Santoso", location: "Jakarta", availability: true, ratePerMinute: 2500 },
    }),
    prisma.reporter.create({
      data: { name: "Citra Dewi", location: "Surabaya", availability: true, ratePerMinute: 1800 },
    }),
    prisma.reporter.create({
      data: { name: "Dian Pratama", location: "Jakarta", availability: false, ratePerMinute: 2200 },
    }),
  ]);

  const editors = await Promise.all([
    prisma.editor.create({
      data: { name: "Eko Wijaya", flatFee: 50000 },
    }),
    prisma.editor.create({
      data: { name: "Fitri Handayani", flatFee: 75000 },
    }),
  ]);

  await prisma.job.create({
    data: {
      caseName: "State v. Williams",
      durationMinutes: 120,
      location: "Jakarta",
      locationType: "physical",
      status: "ASSIGNED",
      reporterId: reporters[0].id,
    },
  });

  await prisma.job.create({
    data: {
      caseName: "People v. Chen",
      durationMinutes: 90,
      location: "Jakarta",
      locationType: "physical",
      status: "TRANSCRIBED",
      reporterId: reporters[1].id,
      editorId: editors[0].id,
    },
  });

  await prisma.job.create({
    data: {
      caseName: "State v. Garcia",
      durationMinutes: 60,
      location: "Bandung",
      locationType: "remote",
      status: "NEW",
    },
  });

  await prisma.job.create({
    data: {
      caseName: "Comm. v. Turner",
      durationMinutes: 180,
      location: "Surabaya",
      locationType: "physical",
      status: "REVIEWED",
      reporterId: reporters[2].id,
      editorId: editors[1].id,
    },
  });

  await prisma.job.create({
    data: {
      caseName: "In re Thompson",
      durationMinutes: 45,
      location: "Jakarta",
      locationType: "physical",
      status: "COMPLETED",
      reporterId: reporters[0].id,
      editorId: editors[0].id,
    },
  });

  console.log("Seed complete: 4 reporters, 2 editors, 5 jobs");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
