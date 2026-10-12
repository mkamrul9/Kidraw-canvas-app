import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';
import { getBoardAccess } from '@/features/board/services/board-access';

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

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return NextResponse.json({ error: 'Missing required field: content' }, { status: 400 });
        }

        // Find the parent comment
        const parentComment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!parentComment) {
            return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
        }

        // Validate board capabilities
        const access = await getBoardAccess(parentComment.boardId, session.user);
        if (!access.board || !access.capabilities.canComment) {
            return NextResponse.json({ error: 'Forbidden: Insufficient permissions to reply' }, { status: 403 });
        }

        const reply = await prisma.comment.create({
            data: {
                content: content.trim(),
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

        // Broadcast reply via SSE to active clients on this board
        const clients = (globalThis as any).presenceClientsMap?.get(parentComment.boardId);
        if (clients) {
            const payload = JSON.stringify({ type: 'comment-update', payload: reply, parentId: id });
            const encoder = new TextEncoder();
            clients.forEach((client: any) => {
                try {
                    client.controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                } catch (_e) {
                    // Ignore broken pipes
                }
            });
        }

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

        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        // Validate board capabilities
        const access = await getBoardAccess(comment.boardId, session.user);
        const isCommentAuthor = comment.authorId === session.user.id;

        if (!access.board || (!access.capabilities.canResolveComment && !isCommentAuthor)) {
            return NextResponse.json({ error: 'Forbidden: Insufficient permissions to resolve comment' }, { status: 403 });
        }

        const updatedComment = await prisma.comment.update({
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

        // Broadcast comment update via SSE to active clients on this board
        const clients = (globalThis as any).presenceClientsMap?.get(comment.boardId);
        if (clients) {
            const payload = JSON.stringify({ type: 'comment-update', payload: updatedComment });
            const encoder = new TextEncoder();
            clients.forEach((client: any) => {
                try {
                    client.controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                } catch (_e) {
                    // Ignore broken pipes
                }
            });
        }

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('PATCH COMMENT ERROR:', error);
        return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    }
}
