import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const board = await prisma.board.findUnique({ where: { id } });
        
        if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        
        // Ensure user is author or has access
        if (board.authorId !== session.user.id) {
            // Collaborators can see other collaborators, or maybe just author?
            // Let's restrict seeing collaborators to Author for now
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const collaborators = await prisma.boardCollaborator.findMany({
            where: { boardId: id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(collaborators);
    } catch (error) {
        console.error('GET COLLABORATORS ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch collaborators' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const { email, role } = await request.json();
        
        if (!email || !role) return NextResponse.json({ error: 'Missing email or role' }, { status: 400 });

        const board = await prisma.board.findUnique({ where: { id } });
        if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        if (board.authorId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Check if already exists
        const existing = await prisma.boardCollaborator.findUnique({
            where: { boardId_email: { boardId: id, email } }
        });

        if (existing) {
            // Update role if exists
            const updated = await prisma.boardCollaborator.update({
                where: { id: existing.id },
                data: { role }
            });
            return NextResponse.json(updated);
        }

        const collaborator = await prisma.boardCollaborator.create({
            data: {
                boardId: id,
                email,
                role
            }
        });

        return NextResponse.json(collaborator);
    } catch (error) {
        console.error('POST COLLABORATORS ERROR:', error);
        return NextResponse.json({ error: 'Failed to invite collaborator' }, { status: 500 });
    }
}
