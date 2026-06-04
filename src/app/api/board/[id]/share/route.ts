import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { isPublic, publicRole } = body;

        // Check ownership
        const board = await prisma.board.findUnique({ where: { id } });
        if (!board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        }
        if (board.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedBoard = await prisma.board.update({
            where: { id },
            data: { 
                isPublic: isPublic !== undefined ? isPublic : board.isPublic,
                publicRole: publicRole || board.publicRole,
            },
        });

        return NextResponse.json(updatedBoard);
    } catch (error) {
        console.error('PATCH SHARE ERROR:', error);
        return NextResponse.json({ error: 'Failed to update share settings' }, { status: 500 });
    }
}
