'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteInbox(inboxId: string) {
    try {
        await prisma.inbox.delete({
            where: { id: inboxId },
        });
        revalidatePath('/admin/inboxes');
        revalidatePath('/admin/dashboard');
    } catch (error) {
        console.error('Failed to delete inbox:', error);
        throw new Error('Failed to delete inbox');
    }
}

export async function deleteDomain(domainId: string) {
    try {
        await prisma.domain.delete({
            where: { id: domainId },
        });
        revalidatePath('/admin/domains');
        revalidatePath('/admin/dashboard');
    } catch (error) {
        console.error('Failed to delete domain:', error);
        throw new Error('Failed to delete domain');
    }
}

export async function addDomain(formData: FormData) {
    const domain = formData.get('domain') as string;

    if (!domain) return;

    try {
        await prisma.domain.create({
            data: {
                domain: domain.toLowerCase().trim(),
                isActive: true
            }
        });
        revalidatePath('/admin/domains');
        revalidatePath('/admin/dashboard');
    } catch (error) {
        console.error('Failed to create domain:', error);
        throw new Error('Failed to create domain');
    }
}

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!email || !password) return;

    try {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'USER',
            }
        });
        revalidatePath('/admin/users');
    } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user');
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath('/admin/users');
    } catch (error) {
        console.error('Failed to delete user:', error);
        throw new Error('Failed to delete user');
    }
}
