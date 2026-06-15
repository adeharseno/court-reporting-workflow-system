import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const reporter = await prisma.reporter.create({
    data: {
      name: "Alice Johnson",
      location: "Jakarta",
      ratePerMinute: 2_000,
    },
  });
  console.log("Reporter created:", reporter.name);

  const editor = await prisma.editor.create({
    data: {
      name: "Bob Smith",
      flatFee: 50_000,
    },
  });
  console.log("Editor created:", editor.name);

  const job = await prisma.job.create({
    data: {
      caseName: "State v. Williams",
      durationMinutes: 120,
      location: "Jakarta",
      locationType: "physical",
    },
  });
  console.log("Job created:", job.caseName, `(status: ${job.status})`);

  const updated = await prisma.job.update({
    where: { id: job.id },
    data: {
      reporterId: reporter.id,
      status: "ASSIGNED",
    },
  });
  console.log("Reporter assigned, status:", updated.status);

  const transcribed = await prisma.job.update({
    where: { id: job.id },
    data: { status: "TRANSCRIBED" },
  });
  console.log("Transcribed, status:", transcribed.status);

  const withEditor = await prisma.job.update({
    where: { id: job.id },
    data: { editorId: editor.id },
  });
  console.log("Editor assigned");

  const reviewed = await prisma.job.update({
    where: { id: job.id },
    data: { status: "REVIEWED" },
  });
  console.log("Reviewed, status:", reviewed.status);

  await prisma.job.update({
    where: { id: job.id },
    data: { status: "COMPLETED" },
  });
  console.log("Completed");

  const payment = await prisma.job.findUnique({
    where: { id: job.id },
    include: { reporter: true, editor: true },
  });

  if (payment) {
    const reporterPay = payment.durationMinutes * (payment.reporter?.ratePerMinute ?? 0);
    const editorPay = payment.editor?.flatFee ?? 0;
    console.log("\n💰 Payment Summary:");
    console.log(`   Reporter: ${reporterPay.toLocaleString()} IDR`);
    console.log(`   Editor:   ${editorPay.toLocaleString()} IDR`);
    console.log(`   Total:    ${(reporterPay + editorPay).toLocaleString()} IDR`);
  }

  await prisma.job.deleteMany();
  await prisma.reporter.deleteMany();
  await prisma.editor.deleteMany();
  console.log("\n🧹 Test data cleaned up.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
