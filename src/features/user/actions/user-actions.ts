'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/config";
import prisma from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileName(name: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    if (!name || name.trim() === "") {
        throw new Error("Name cannot be empty");
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name: name.trim() }
        });
        revalidatePath('/info/profile');
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile name:", error);
        throw new Error("Failed to update profile name");
    }
}

export async function updateNotificationSettings(receiveEmails: boolean) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { receiveEmails }
        });
        revalidatePath('/info/settings');
        return { success: true };
    } catch (error) {
        console.error("Failed to update notification settings:", error);
        throw new Error("Failed to update settings");
    }
}

export async function deleteAccount() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.user.delete({
            where: { id: session.user.id }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete account:", error);
        throw new Error("Failed to delete account");
    }
}

export async function getUserSettings() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return null;
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { receiveEmails: true }
        });
        return user;
    } catch (error) {
        console.error("Failed to fetch user settings:", error);
        return null;
    }
}
