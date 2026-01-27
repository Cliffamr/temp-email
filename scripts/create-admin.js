const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.log('Usage: node create-admin.js <email> <password>');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const admin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Admin',
            },
        });
        console.log(`Admin created: ${admin.email}`);
    } catch (e) {
        console.error('Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
