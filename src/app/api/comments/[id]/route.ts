import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/comments/[id] — Add a reply to an existing comment thread
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
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Missing required field: content' }, { status: 400 });
        }

        // Find the parent comment to get board coordinates
        const parentComment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!parentComment) {
            return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
        }

        const reply = await prisma.comment.create({
            data: {
                content,
                x: parentComment.x,
                y: parentComment.y,
                boardId: parentComment.boardId,
                authorId: session.user.id,
                parentId: id,
            },
            include: {
                author: { select: { id: true, name: true, image: true } },
            },
        });

        return NextResponse.json(reply);
    } catch (error) {
        console.error('POST REPLY ERROR:', error);
        return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
    }
}

// PATCH /api/comments/[id] — Toggle resolved status on a comment thread
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
        const { resolved } = body;

        if (typeof resolved !== 'boolean') {
            return NextResponse.json({ error: 'Missing required field: resolved (boolean)' }, { status: 400 });
        }

        const comment = await prisma.comment.update({
            where: { id },
            data: { resolved },
            include: {
                author: { select: { id: true, name: true, image: true } },
                replies: {
                    include: {
                        author: { select: { id: true, name: true, image: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('PATCH COMMENT ERROR:', error);
        return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    }
}
