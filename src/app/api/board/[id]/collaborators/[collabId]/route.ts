import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';
import { getBoardAccess } from '@/features/board/services/board-access';

export const dynamic = 'force-dynamic';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string, collabId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, collabId } = await params;
        
        const access = await getBoardAccess(id, session.user);
        if (!access.board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        if (!access.capabilities.canManageCollaborators) {
            return NextResponse.json({ error: 'Forbidden: Only board owners can remove collaborators' }, { status: 403 });
        }

        // Must verify that the collaborator belongs to THIS board (prevents cross-board deletion)
        const collaborator = await prisma.boardCollaborator.findFirst({
            where: { id: collabId, boardId: id }
        });

        if (!collaborator) {
            return NextResponse.json({ error: 'Collaborator not found on this board' }, { status: 404 });
        }

        await prisma.boardCollaborator.delete({
            where: { id: collaborator.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE COLLABORATOR ERROR:', error);
        return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
    }
}
