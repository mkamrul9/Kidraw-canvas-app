import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/config";
import { getBoardAccess } from "@/features/board/services/board-access";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        const boardId = params.id;

        const access = await getBoardAccess(boardId, session?.user || null);

        if (!access.board) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        if (!access.capabilities.canRead) {
            if (!session?.user?.id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const snapshots = await prisma.boardSnapshot.findMany({
            where: { boardId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
        });
        
        return NextResponse.json({ snapshots });
    } catch (error) {
        console.error("GET SNAPSHOTS ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch snapshots" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const boardId = params.id;
        const access = await getBoardAccess(boardId, session.user);

        if (!access.board) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        if (!access.capabilities.canSnapshot) {
            return NextResponse.json({ error: "Forbidden: Insufficient permissions to create snapshot" }, { status: 403 });
        }
        
        const { name, layers } = await req.json();

        if (!layers || !Array.isArray(layers)) {
            return NextResponse.json({ error: "Missing or invalid layers data" }, { status: 400 });
        }

        const snapshot = await prisma.boardSnapshot.create({
            data: {
                boardId,
                name: (typeof name === 'string' && name.trim()) ? name.trim() : "Manual Snapshot",
                layers: layers,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                }
            }
        });

        const responseData = {
            id: snapshot.id,
            name: snapshot.name,
            createdAt: snapshot.createdAt,
            author: snapshot.author
        };

        return NextResponse.json({ snapshot: responseData });
    } catch (error) {
        console.error("POST SNAPSHOT ERROR:", error);
        return NextResponse.json({ error: "Failed to create snapshot" }, { status: 500 });
    }
}
