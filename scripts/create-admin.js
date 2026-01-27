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
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log(`Admin user created: ${user.email}`);
  } catch (e) {
    console.error('Error creating admin user:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
