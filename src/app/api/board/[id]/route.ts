import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';
import { getBoardAccess } from '@/features/board/services/board-access';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        const access = await getBoardAccess(id, session?.user || null);

        if (!access.board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        }

        if (!access.capabilities.canRead) {
            if (!session?.user?.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({
            ...access.board,
            isReadOnly: !access.capabilities.canEdit,
            role: access.role,
            capabilities: access.capabilities,
        });
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

        const access = await getBoardAccess(id, session.user);

        if (access.board) {
            if (!access.capabilities.canEdit) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            const updatedBoard = await prisma.board.update({
                where: { id },
                data: {
                    ...(layers !== undefined ? { layers } : {}),
                    ...(backgroundColor !== undefined ? { backgroundColor } : {}),
                    ...(thumbnail !== undefined ? { thumbnail } : {}),
                },
            });

            return NextResponse.json(updatedBoard);
        } else {
            // First save by authenticated creator
            const newBoard = await prisma.board.create({
                data: {
                    id,
                    layers: layers || [],
                    backgroundColor: backgroundColor || '#ffffff',
                    thumbnail: thumbnail || null,
                    authorId: session.user.id,
                },
            });

            return NextResponse.json(newBoard);
        }
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
        const access = await getBoardAccess(id, session.user);

        if (!access.board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        }

        if (!access.capabilities.canDelete) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.board.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE ERROR:', error);
        return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
    }
}