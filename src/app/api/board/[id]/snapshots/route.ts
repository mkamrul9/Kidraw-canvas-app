import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/config";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const boardId = params.id;
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
        const boardId = params.id;
        
        const { name, layers } = await req.json();

        if (!layers) {
            return NextResponse.json({ error: "Missing layers data" }, { status: 400 });
        }

        const snapshot = await prisma.boardSnapshot.create({
            data: {
                boardId,
                name: name || "Manual Snapshot",
                layers: layers,
                authorId: session?.user?.id || null,
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                }
            }
        });

        // Omit the massive layers payload from the response to save bandwidth
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
