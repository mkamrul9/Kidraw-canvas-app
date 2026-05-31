import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/board/[id]/comments — Fetch all top-level comments for a board
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const comments = await prisma.comment.findMany({
            where: { boardId: id, parentId: null },
            include: {
                author: { select: { id: true, name: true, image: true } },
                replies: {
                    include: {
                        author: { select: { id: true, name: true, image: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('GET COMMENTS ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST /api/board/[id]/comments — Create a new top-level comment thread
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
        const { content, x, y } = body;

        if (!content || typeof x !== 'number' || typeof y !== 'number') {
            return NextResponse.json({ error: 'Missing required fields: content, x, y' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                x,
                y,
                boardId: id,
                authorId: session.user.id,
            },
            include: {
                author: { select: { id: true, name: true, image: true } },
                replies: {
                    include: {
                        author: { select: { id: true, name: true, image: true } },
                    },
                },
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('POST COMMENT ERROR:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
