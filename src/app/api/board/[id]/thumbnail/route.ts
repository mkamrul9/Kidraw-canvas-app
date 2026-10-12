import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';
import { getBoardAccess } from '@/features/board/services/board-access';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await props.params;
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { thumbnail } = body;

        if (!thumbnail) {
            return NextResponse.json({ error: 'Thumbnail data is required' }, { status: 400 });
        }

        const access = await getBoardAccess(id, session.user);

        if (!access.board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        }

        // Must have canEdit capability (owner or editor)
        if (!access.capabilities.canEdit) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.board.update({
            where: { id },
            data: { thumbnail }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update board thumbnail:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
