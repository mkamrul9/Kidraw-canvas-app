'use client';

import { usePresenceStore } from '../store/usePresenceStore';
import { useCanvasStore } from '../store/useCanvasStore';
import { useEffect, useState } from 'react';

// Heartbeat to clean up idle/stale cursors every second
function useCursorCleanup() {
    const { others, removePresence } = usePresenceStore();
    const [, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const IDLE_TIMEOUT_MS = 6000; // 6 seconds auto-fadeout

            Object.values(others).forEach((user) => {
                if (now - user.lastActive > IDLE_TIMEOUT_MS) {
                    removePresence(user.userId);
                }
            });
            setTick((t) => t + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [others, removePresence]);
}

export default function LiveCursors() {
    const { others } = usePresenceStore();
    const { camera, zoom } = useCanvasStore();

    useCursorCleanup();

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[75]">
            {Object.values(others).map((user) => {
                const screenX = user.x * zoom + camera.x;
                const screenY = user.y * zoom + camera.y;

                return (
                    <div
                        key={user.userId}
                        className="absolute flex items-start select-none will-change-[left,top]"
                        style={{
                            left: `${screenX}px`,
                            top: `${screenY}px`,
                            transition: 'left 80ms linear, top 80ms linear',
                        }}
                    >
                        {/* Custom Pointer Icon (SVG) */}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="drop-shadow-lg"
                        >
                            <path
                                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                                fill={user.color}
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinejoin="miter"
                            />
                        </svg>

                        {/* User Tag & Chat Bubble */}
                        <div className="ml-3 mt-3 flex flex-col items-start gap-1">
                            {/* Username label */}
                            <div
                                className="text-[10px] text-white font-bold px-2 py-0.5 rounded-lg shadow-md border border-white/10"
                                style={{ backgroundColor: user.color }}
                            >
                                {user.name || 'Anonymous'}
                            </div>

                            {/* Chat bubble if they are currently typing cursor chat */}
                            {user.text && (
                                <div className="flex items-center bg-[#0B0F19]/90 border border-white/10 text-white text-xs px-3 py-1.5 shadow-2xl rounded-r-xl rounded-bl-xl rounded-tl-none max-w-[200px] min-h-[28px] break-words animate-cursor-chat-pop">
                                    <span className="font-medium pr-1 select-text">
                                        {user.text}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
