/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import { getBoardAccess } from '@/features/board/services/board-access';

export const dynamic = 'force-dynamic';

type SSEClient = {
    userId: string;
    controller: ReadableStreamDefaultController;
};

// Global mapping of boardId -> Set of connected SSE clients
const clientsMap = (globalThis as any).presenceClientsMap || new Map<string, Set<SSEClient>>();
if (process.env.NODE_ENV !== 'production') {
    (globalThis as any).presenceClientsMap = clientsMap;
}

const DRAWING_MUTATION_TYPES = new Set([
    'draw-add',
    'draw-update',
    'draw-update-batch',
    'draw-remove',
]);

// GET /api/board/[id]/presence — Establish Server-Sent Events stream
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: boardId } = await params;
    const session = await getServerSession(authOptions);

    const access = await getBoardAccess(boardId, session?.user || null);
    if (!access.board) {
        return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    if (!access.capabilities.canRead) {
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    // Canonical identity: session userId has highest priority, otherwise sanitize guest ID
    const sanitizedGuestId = guestId ? guestId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) : null;
    const userId = session?.user?.id || (sanitizedGuestId ? `guest-${sanitizedGuestId}` : `anon-${Math.random().toString(36).substring(2, 9)}`);

    const stream = new ReadableStream({
        start(controller) {
            const client: SSEClient = { userId, controller };

            if (!clientsMap.has(boardId)) {
                clientsMap.set(boardId, new Set());
            }
            clientsMap.get(boardId)!.add(client);

            // Periodically ping to keep connection alive
            const pingInterval = setInterval(() => {
                try {
                    controller.enqueue(new TextEncoder().encode(': ping\n\n'));
                } catch (_err) {
                    clearInterval(pingInterval);
                }
            }, 15000);

            // Clean up when client disconnects
            request.signal.addEventListener('abort', () => {
                clearInterval(pingInterval);
                const clients = clientsMap.get(boardId);
                if (clients) {
                    clients.delete(client);
                    
                    // Broadcast disconnection to other users
                    const disconnectPayload = JSON.stringify({ userId, disconnected: true });
                    const encoder = new TextEncoder();
                    clients.forEach((otherClient: SSEClient) => {
                        if (otherClient.userId !== userId) {
                            try {
                                otherClient.controller.enqueue(encoder.encode(`data: ${disconnectPayload}\n\n`));
                            } catch (_e) {
                                // Broken pipe
                            }
                        }
                    });

                    if (clients.size === 0) {
                        clientsMap.delete(boardId);
                    }
                }
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}

// POST /api/board/[id]/presence — Broadcast cursor/drawing updates to other users
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: boardId } = await params;
    const session = await getServerSession(authOptions);

    const access = await getBoardAccess(boardId, session?.user || null);
    if (!access.board) {
        return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    if (!access.capabilities.canRead) {
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Reject oversized payloads
    if (JSON.stringify(body).length > 500000) {
        return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    // Gate drawing mutations behind canEdit capability
    if (body.type && DRAWING_MUTATION_TYPES.has(body.type)) {
        if (!access.capabilities.canEdit) {
            return NextResponse.json({ error: 'Forbidden: Viewers cannot broadcast drawing mutations' }, { status: 403 });
        }
    }

    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const sanitizedGuestId = guestId ? guestId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) : null;
    const userId = session?.user?.id || (sanitizedGuestId ? `guest-${sanitizedGuestId}` : `anon-${Math.random().toString(36).substring(2, 9)}`);

    const clients = clientsMap.get(boardId);
    if (clients) {
        // Enforce server-determined userId (cannot be spoofed by request body)
        const payload = JSON.stringify({
            ...body,
            userId,
        });

        const encoder = new TextEncoder();
        clients.forEach((client: SSEClient) => {
            // Do not broadcast back to self
            if (client.userId !== userId) {
                try {
                    client.controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                } catch (_err) {
                    clients.delete(client);
                }
            }
        });
    }

    return NextResponse.json({ success: true });
}
