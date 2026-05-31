import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type SSEClient = {
    userId: string;
    controller: ReadableStreamDefaultController;
};

// Global mapping of boardId -> Set of connected SSE clients
// This persists in the active Node/Next.js dev process
const clientsMap = (globalThis as any).presenceClientsMap || new Map<string, Set<SSEClient>>();
if (process.env.NODE_ENV !== 'production') {
    (globalThis as any).presenceClientsMap = clientsMap;
}

// GET /api/board/[id]/presence — Establish Server-Sent Events stream
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const userId = guestId || `anon-${Math.random()}`;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: boardId } = await params;

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
                } catch (err) {
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
                            } catch (e) {
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
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const userId = guestId || `anon-${Math.random()}`;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: boardId } = await params;
    const body = await request.json();

    const clients = clientsMap.get(boardId);
    if (clients) {
        const payload = JSON.stringify({
            userId,
            ...body,
        });

        const encoder = new TextEncoder();
        clients.forEach((client: SSEClient) => {
            // Do not broadcast to ourselves
            if (client.userId !== userId) {
                try {
                    client.controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                } catch (err) {
                    // Cleanup client if writing to stream fails
                    clients.delete(client);
                }
            }
        });
    }

    return NextResponse.json({ success: true });
}
