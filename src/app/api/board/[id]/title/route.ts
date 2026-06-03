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
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const { title } = await request.json();

        if (typeof title !== 'string' || title.trim().length === 0) {
            return new NextResponse('Invalid title', { status: 400 });
        }

        // Verify board ownership/access
        const board = await prisma.board.findUnique({
            where: { id },
            select: { authorId: true }
        });

        if (!board) {
            return new NextResponse('Board not found', { status: 404 });
        }

        if (board.authorId !== session.user.id) {
            return new NextResponse('Unauthorized - Only the author can rename', { status: 403 });
        }

        const updatedBoard = await prisma.board.update({
            where: { id },
            data: { title: title.trim() }
        });

        return NextResponse.json({ success: true, title: updatedBoard.title });
    } catch (error) {
        console.error('PATCH /api/board/[id]/title ERROR:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
