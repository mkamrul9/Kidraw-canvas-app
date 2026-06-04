import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await props.params;
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { thumbnail } = body;

        if (!thumbnail) {
            return NextResponse.json({ error: 'Thumbnail data is required' }, { status: 400 });
        }

        const board = await prisma.board.findUnique({
            where: { id },
            include: { collaborators: true }
        });

        if (!board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        }

        // Must be author or editor to save thumbnail
        const isAuthor = board.authorId === session.user.id;
        const isEditor = board.collaborators.some(c => c.email === session.user?.email && c.role === 'EDITOR');
        
        if (!isAuthor && !isEditor) {
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
