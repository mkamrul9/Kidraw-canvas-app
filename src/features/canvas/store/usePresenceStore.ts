import { create } from 'zustand';

export type PresenceUser = {
    userId: string;
    x: number;
    y: number;
    name: string | null;
    image: string | null;
    color: string;
    text: string;
    lastActive: number;
};

type PresenceStore = {
    others: Record<string, PresenceUser>;
    updatePresence: (userId: string, data: Partial<PresenceUser>) => void;
    removePresence: (userId: string) => void;
    clearPresence: () => void;
};

// Selection of sleek, high-visibility Figma-style cursor colors
const CURSOR_COLORS = [
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#a855f7', // Purple
];

const getUserColor = (userId: string) => {
    // Deterministic color selection based on userId hash
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % CURSOR_COLORS.length;
    return CURSOR_COLORS[index];
};

export const usePresenceStore = create<PresenceStore>((set) => ({
    others: {},

    updatePresence: (userId, data) =>
        set((state) => {
            const current = state.others[userId];
            const color = current?.color || data.color || getUserColor(userId);
            
            return {
                others: {
                    ...state.others,
                    [userId]: {
                        userId,
                        x: data.x ?? current?.x ?? 0,
                        y: data.y ?? current?.y ?? 0,
                        name: data.name !== undefined ? data.name : current?.name || null,
                        image: data.image !== undefined ? data.image : current?.image || null,
                        color,
                        text: data.text !== undefined ? data.text : current?.text || '',
                        lastActive: Date.now(),
                    },
                },
            };
        }),

    removePresence: (userId) =>
        set((state) => {
            const next = { ...state.others };
            delete next[userId];
            return { others: next };
        }),

    clearPresence: () => set({ others: {} }),
}));
