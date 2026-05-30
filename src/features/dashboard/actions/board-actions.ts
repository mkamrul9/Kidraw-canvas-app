'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

/**
 * Server action to create a new board.
 * Extracted from page.tsx to separate server-side logic from UI.
 */
export async function createNewBoard(formData: FormData) {
    const currentSession = await getServerSession(authOptions);
    if (!currentSession?.user?.id) return;

    const title = (formData.get('title') as string) || 'Untitled Whiteboard';
    const description = formData.get('description') as string;
    const newId = uuidv4();

    await prisma.board.create({
        data: {
            id: newId,
            authorId: currentSession.user.id,
            title,
            description,
            layers: [],
            backgroundColor: '#ffffff',
        },
    });

    redirect(`/board/${newId}`);
}
