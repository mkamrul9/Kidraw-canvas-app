import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string, collabId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, collabId } = await params;
        
        const board = await prisma.board.findUnique({ where: { id } });
        if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        if (board.authorId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await prisma.boardCollaborator.delete({
            where: { id: collabId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE COLLABORATOR ERROR:', error);
        return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
    }
}
