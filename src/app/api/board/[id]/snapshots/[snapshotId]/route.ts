import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/config";
import { getBoardAccess } from "@/features/board/services/board-access";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string, snapshotId: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        const { id, snapshotId } = params;

        const access = await getBoardAccess(id, session?.user || null);

        if (!access.board) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        if (!access.capabilities.canRead) {
            if (!session?.user?.id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const snapshot = await prisma.boardSnapshot.findUnique({
            where: { id: snapshotId }
        });
        
        if (!snapshot || snapshot.boardId !== id) {
            return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
        }

        return NextResponse.json({ snapshot });
    } catch (error) {
        console.error("GET SNAPSHOT ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch snapshot" }, { status: 500 });
    }
}
