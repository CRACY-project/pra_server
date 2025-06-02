const { Prisma, PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function clearDatabase() {
    await prisma.$queryRawUnsafe(`delete from company;`);

    await prisma.$disconnect();
}

clearDatabase();
