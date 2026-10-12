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
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const access = await getBoardAccess(id, session.user);
        
        if (!access.board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        if (!access.capabilities.canManageCollaborators) {
            return NextResponse.json({ error: 'Forbidden: Only board owners can view collaborator management' }, { status: 403 });
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
        const access = await getBoardAccess(id, session.user);

        if (!access.board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        if (!access.capabilities.canManageCollaborators) {
            return NextResponse.json({ error: 'Forbidden: Only board owners can invite collaborators' }, { status: 403 });
        }

        const { email, role } = await request.json();
        
        if (!email || typeof email !== 'string' || !role || typeof role !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid email or role' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedRole = role.trim().toLowerCase();

        if (normalizedRole !== 'editor' && normalizedRole !== 'viewer') {
            return NextResponse.json({ error: 'Invalid role. Must be "viewer" or "editor"' }, { status: 400 });
        }

        // Prevent inviting the owner as a collaborator
        if (access.board.authorId && session.user.email?.toLowerCase() === normalizedEmail) {
            return NextResponse.json({ error: 'Cannot add board owner as collaborator' }, { status: 400 });
        }

        // Check if already exists
        const existing = await prisma.boardCollaborator.findUnique({
            where: { boardId_email: { boardId: id, email: normalizedEmail } }
        });

        if (existing) {
            const updated = await prisma.boardCollaborator.update({
                where: { id: existing.id },
                data: { role: normalizedRole }
            });
            return NextResponse.json(updated);
        }

        const collaborator = await prisma.boardCollaborator.create({
            data: {
                boardId: id,
                email: normalizedEmail,
                role: normalizedRole
            }
        });

        return NextResponse.json(collaborator);
    } catch (error) {
        console.error('POST COLLABORATORS ERROR:', error);
        return NextResponse.json({ error: 'Failed to invite collaborator' }, { status: 500 });
    }
}
