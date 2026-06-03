import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string, snapshotId: string }> }) {
    const params = await props.params;
    try {
        const snapshot = await prisma.boardSnapshot.findUnique({
            where: { id: params.snapshotId }
        });
        
        if (!snapshot || snapshot.boardId !== params.id) {
            return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
        }

        return NextResponse.json({ snapshot });
    } catch (error) {
        console.error("GET SNAPSHOT ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch snapshot" }, { status: 500 });
    }
}
