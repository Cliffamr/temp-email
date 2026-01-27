// Test script to check Prisma connection
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

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

        console.log('Database connection test PASSED!');

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
