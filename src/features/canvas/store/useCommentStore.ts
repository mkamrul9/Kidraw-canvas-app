import { create } from 'zustand';

const broadcastCommentUpdate = (boardId: string) => {
    fetch(`/api/board/${boardId}/presence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'comment-update' }),
    }).catch(console.error);
};

export type CommentAuthor = {
    id: string;
    name: string | null;
    image: string | null;
};

export type CommentReply = {
    id: string;
    content: string;
    author: CommentAuthor;
    createdAt: string;
};

export type CanvasComment = {
    id: string;
    content: string;
    x: number;
    y: number;
    resolved: boolean;
    elementId: string | null;
    boardId: string;
    author: CommentAuthor;
    replies: CommentReply[];
    createdAt: string;
    updatedAt: string;
};

type CommentStore = {
    comments: CanvasComment[];
    isLoading: boolean;
    activeThreadId: string | null;
    isSidebarOpen: boolean;

    setActiveThreadId: (id: string | null) => void;
    setSidebarOpen: (open: boolean) => void;

    fetchComments: (boardId: string) => Promise<void>;
    addComment: (boardId: string, content: string, x: number, y: number, elementId?: string | null) => Promise<CanvasComment | null>;
    addReply: (commentId: string, content: string) => Promise<void>;
    toggleResolved: (commentId: string, resolved: boolean) => Promise<void>;
};

export const useCommentStore = create<CommentStore>((set, get) => ({
    comments: [],
    isLoading: false,
    activeThreadId: null,
    isSidebarOpen: false,

    setActiveThreadId: (id) => set({ activeThreadId: id }),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),

    fetchComments: async (boardId: string) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`/api/board/${boardId}/comments`);
            if (!res.ok) throw new Error('Failed to fetch comments');
            const data = await res.json();
            set({ comments: data });
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addComment: async (boardId, content, x, y, elementId = null) => {
        try {
            const res = await fetch(`/api/board/${boardId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, x, y, elementId }),
            });
            if (!res.ok) throw new Error('Failed to create comment');
            const newComment = await res.json();
            set((state) => ({
                comments: [newComment, ...state.comments],
            }));
            broadcastCommentUpdate(boardId);
            return newComment;
        } catch (error) {
            console.error('Failed to create comment:', error);
            return null;
        }
    },

    addReply: async (commentId, content) => {
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            if (!res.ok) throw new Error('Failed to add reply');
            const newReply = await res.json();
            const state = get();
            const boardId = state.comments.find((c) => c.id === commentId)?.boardId;
            set((state) => ({
                comments: state.comments.map((c) =>
                    c.id === commentId
                        ? { ...c, replies: [...c.replies, newReply] }
                        : c
                ),
            }));
            if (boardId) broadcastCommentUpdate(boardId);
        } catch (error) {
            console.error('Failed to add reply:', error);
        }
    },

    toggleResolved: async (commentId, resolved) => {
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resolved }),
            });
            if (!res.ok) throw new Error('Failed to toggle resolved');
            const updated = await res.json();
            const state = get();
            const boardId = state.comments.find((c) => c.id === commentId)?.boardId;
            set((state) => ({
                comments: state.comments.map((c) =>
                    c.id === commentId ? { ...c, ...updated } : c
                ),
            }));
            if (boardId) broadcastCommentUpdate(boardId);
        } catch (error) {
            console.error('Failed to toggle resolved:', error);
        }
    },
}));
