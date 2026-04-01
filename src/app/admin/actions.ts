'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteInbox(inboxId: string) {
    try {
        await prisma.$transaction(async (tx) => {
            // Delete associated messages first
            await tx.message.deleteMany({
                where: { inboxId }
            });
            
            // Delete the inbox
            await tx.inbox.delete({
                where: { id: inboxId },
            });
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
        // Find associated inboxes
        const inboxes = await prisma.inbox.findMany({
            where: { domainId },
            select: { id: true }
        });
        
        const inboxIds = inboxes.map(i => i.id);

        // Delete all dependent records in a transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            if (inboxIds.length > 0) {
                // Delete messages for these inboxes
                await tx.message.deleteMany({
                    where: { inboxId: { in: inboxIds } }
                });
                
                // Delete the inboxes themselves
                await tx.inbox.deleteMany({
                    where: { domainId }
                });
            }
            
            // Finally delete the domain
            await tx.domain.delete({
                where: { id: domainId },
            });
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

export async function updateUser(formData: FormData) {
    const id = formData.get('id') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!id || !email) return;

    try {
        const data: any = {
            email,
            role: role || 'USER',
        };

        if (password && password.trim() !== '') {
            const bcrypt = require('bcrypt');
            data.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id },
            data,
        });

        revalidatePath('/admin/users');
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user');
    }
}
