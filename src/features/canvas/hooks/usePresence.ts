'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePresenceStore } from '../store/usePresenceStore';
import { useCanvasStore } from '../store/useCanvasStore';
import { useSession } from 'next-auth/react';

const getOrCreateGuestId = () => {
    if (typeof window === 'undefined') return 'guest-ssr';
    let id = sessionStorage.getItem('kidraw_guest_id');
    if (!id) {
        id = `guest-${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem('kidraw_guest_id', id);
    }
    return id;
};

export function usePresence(boardId: string | null) {
    const { data: session } = useSession();
    const { updatePresence, removePresence, clearPresence } = usePresenceStore();
    const eventSourceRef = useRef<EventSource | null>(null);
    const lastSentRef = useRef<number>(0);
    const pendingUpdateRef = useRef<{ x: number; y: number; text: string } | null>(null);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const guestId = getOrCreateGuestId();
    const effectiveUserId = session?.user?.id || guestId;

    // 1. Establish SSE Connection
    useEffect(() => {
        if (!boardId || !effectiveUserId) {
            clearPresence();
            return;
        }

        const eventSource = new EventSource(`/api/board/${boardId}/presence?guestId=${guestId}`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('[DEBUG] SSE received message:', data.type || 'presence', data);
                if (data.disconnected) {
                    removePresence(data.userId);
                    return;
                }

                if (data.type === 'draw-add') {
                    useCanvasStore.getState().addLayer(data.layer, true);
                } else if (data.type === 'draw-update') {
                    useCanvasStore.getState().updateLayer(data.id, data.attributes, true);
                } else if (data.type === 'draw-update-batch') {
                    const store = useCanvasStore.getState();
                    data.updates.forEach((item: any) => {
                        store.updateLayer(item.id, item.attributes, true);
                    });
                } else if (data.type === 'draw-remove') {
                    useCanvasStore.getState().removeLayer(data.id, true);
                } else {
                    updatePresence(data.userId, data);
                }
            } catch (err) {
                // Ignore ping or malformed JSON
            }
        };

        eventSource.onerror = () => {
            // Auto-reconnect will be handled by EventSource automatically
        };

        return () => {
            eventSource.close();
            eventSourceRef.current = null;
            clearPresence();
        };
    }, [boardId, effectiveUserId, guestId, updatePresence, removePresence, clearPresence]);

    // 2. Broadcast Function (Throttled POST requests)
    const sendUpdate = useCallback(async (x: number, y: number, text: string) => {
        if (!boardId || !effectiveUserId) return;

        try {
            await fetch(`/api/board/${boardId}/presence?guestId=${guestId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    x,
                    y,
                    text,
                    name: session?.user?.name || 'Guest',
                    image: session?.user?.image || null,
                }),
            });
        } catch (err) {
            console.error('Failed to send presence update:', err);
        }
    }, [boardId, effectiveUserId, guestId, session?.user?.name, session?.user?.image]);

    const updateMyPresence = useCallback((x: number, y: number, text: string) => {
        const now = Date.now();
        const THROTTLE_MS = 250; // Throttled to 4 updates per second to avoid crashing the server

        pendingUpdateRef.current = { x, y, text };

        if (now - lastSentRef.current >= THROTTLE_MS) {
            // Send immediately
            lastSentRef.current = now;
            sendUpdate(x, y, text);
            if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current);
                throttleTimeoutRef.current = null;
            }
        } else if (!throttleTimeoutRef.current) {
            // Queue for execution after throttle window
            throttleTimeoutRef.current = setTimeout(() => {
                const pending = pendingUpdateRef.current;
                if (pending) {
                    lastSentRef.current = Date.now();
                    sendUpdate(pending.x, pending.y, pending.text);
                }
                throttleTimeoutRef.current = null;
            }, THROTTLE_MS - (now - lastSentRef.current));
        }
    }, [sendUpdate]);

    // Clean up timeouts
    useEffect(() => {
        return () => {
            if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current);
            }
        };
    }, []);

    return { updateMyPresence };
}
