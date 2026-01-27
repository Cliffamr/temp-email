// Test script to check Prisma connection
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

async function main() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

    const prisma = new PrismaClient();

    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connected successfully!');

        // Test query
        const domains = await prisma.domain.findMany();
        console.log('Domains:', domains);

        // Try to create a test domain
        const testDomain = await prisma.domain.upsert({
            where: { domain: 'test.example.com' },
            update: {},
            create: { domain: 'test.example.com', isActive: true }
        });
        console.log('Created domain:', testDomain);

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
