import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        const { id } = await params;
        let board = await prisma.board.findUnique({ where: { id } });

        if (!board) {
            board = await prisma.board.create({
                data: { id, layers: [], backgroundColor: '#ffffff' }
            });
        }

        let isReadOnly = false;
        if (board.authorId && board.authorId !== userId) {
            let isCollaborator = false;
            let collabRole = 'viewer';
            if (userId && session?.user?.email) {
                const collab = await prisma.boardCollaborator.findUnique({
                    where: { boardId_email: { boardId: id, email: session.user.email } }
                });
                if (collab) {
                    isCollaborator = true;
                    collabRole = collab.role;
                }
            }

            if (isCollaborator) {
                if (collabRole === 'viewer') isReadOnly = true;
            } else {
                if (!board.isPublic) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
                if (board.publicRole === 'viewer') {
                    isReadOnly = true;
                }
            }
        }

        return NextResponse.json({ ...board, isReadOnly });
    } catch (error) {
        console.error('GET ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch board' }, { status: 500 });
    }
}

export async function POST(
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
        const { layers, backgroundColor, thumbnail } = body;

        const board = await prisma.board.findUnique({ where: { id } });
        if (board && board.authorId !== session.user.id) {
            let isEditor = false;
            if (session.user.email) {
                const collab = await prisma.boardCollaborator.findUnique({
                    where: { boardId_email: { boardId: id, email: session.user.email } }
                });
                if (collab && collab.role === 'editor') isEditor = true;
            }
            if (!isEditor) {
                if (!board.isPublic || board.publicRole !== 'editor') {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
            }
        }

        const updatedBoard = await prisma.board.upsert({
            where: { id },
            update: { layers, backgroundColor, thumbnail },
            create: { id, layers, backgroundColor, thumbnail, authorId: session.user.id },
        });

        return NextResponse.json(updatedBoard);
    } catch (error) {
        console.error('POST ERROR:', error);
        return NextResponse.json({ error: 'Failed to save board' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const board = await prisma.board.findUnique({ where: { id } });

        if (!board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        }

        if (board.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.board.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE ERROR:', error);
        return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
    }
}