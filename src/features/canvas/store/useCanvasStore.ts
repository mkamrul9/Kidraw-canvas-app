import { create } from 'zustand';
import { toast } from 'sonner';
import { Layer, Color, Tool, ShapeType } from '@/features/canvas/types';

// Throttling mechanism for drawing updates to prevent network spam
let updateTimeout: NodeJS.Timeout | null = null;
let pendingUpdates: Record<string, any> = {};

const getOrCreateGuestId = () => {
    if (typeof window === 'undefined') return 'guest-ssr';
    let id = sessionStorage.getItem('kidraw_guest_id');
    if (!id) {
        id = `guest-${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem('kidraw_guest_id', id);
    }
    return id;
};

const broadcastUpdate = async (boardId: string | null, payload: any) => {
    if (!boardId) return;
    try {
        const guestId = getOrCreateGuestId();
        console.log('[DEBUG] broadcasting drawing update:', payload.type, payload);
        const res = await fetch(`/api/board/${boardId}/presence?guestId=${guestId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            console.error('[DEBUG] broadcast POST returned error status:', res.status);
        }
    } catch (err) {
        console.error('Failed to broadcast canvas update:', err);
    }
};

const throttledBroadcastUpdate = (boardId: string | null, id: string, attributes: any) => {
    if (!boardId) return;
    pendingUpdates[id] = { ...pendingUpdates[id], ...attributes };

    if (updateTimeout) return;

    updateTimeout = setTimeout(() => {
        const payload = {
            type: 'draw-update-batch',
            updates: Object.entries(pendingUpdates).map(([key, val]) => ({ id: key, attributes: val }))
        };
        pendingUpdates = {};
        updateTimeout = null;
        broadcastUpdate(boardId, payload);
    }, 85); // Send updates every ~85ms
};

interface CanvasState {
    activeTool: Tool;
    activeColor: Color;
    backgroundColor: string;
    layers: Layer[];
    isDrawing: boolean;
    isSaving: boolean;
    boardId: string | null;
    selectedLayerId: string | null;
    selectedLayerIds: string[];
    bgPattern: 'solid' | 'dotted' | 'grid';
    activeEraserType: 'eraser' | 'object-eraser';
    eraserSize: number;
    customColors: string[];
    camera: { x: number; y: number };
    zoom: number;
    isLocked: boolean;
    activeShape: ShapeType;
    penSize: number;
    activeOpacity: number;
    permissionRole: 'owner' | 'editor' | 'viewer';

    // History State
    history: Layer[][];
    historyStep: number;

    setActiveTool: (tool: Tool) => void;
    setActiveColor: (color: Color) => void;
    setBackgroundColor: (color: string) => void;
    setIsDrawing: (isDrawing: boolean) => void;
    setBoardId: (id: string) => void;
    setSelectedLayerId: (id: string | null) => void;
    setSelectedLayerIds: (ids: string[]) => void;
    setBgPattern: (pattern: 'solid' | 'dotted' | 'grid') => void;
    setActiveEraserType: (type: 'eraser' | 'object-eraser') => void;
    setEraserSize: (size: number) => void;
    addCustomColor: (color: string) => void;
    removeLayer: (id: string, isRemote?: boolean) => void;
    setCamera: (pos: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
    toggleLock: () => void;
    setActiveShape: (shape: ShapeType) => void;
    setPenSize: (size: number) => void;
    setOpacity: (opacity: number) => void;
    setPermissionRole: (role: 'owner' | 'editor' | 'viewer') => void;

    addLayer: (layer: Layer, isRemote?: boolean) => void;
    addLayers: (layers: Layer[]) => void;
    updateLayer: (id: string, newAttributes: Partial<Layer>, isRemote?: boolean) => void;

    // Canvas Management Actions
    saveHistory: () => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
    saveToCloud: (boardId: string) => Promise<void>;
    loadFromCloud: (boardId: string) => Promise<void>;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
    activeTool: 'pen',
    activeColor: '#000000',
    backgroundColor: '#f8fafc',
    layers: [],
    isDrawing: false,
    isSaving: false,
    boardId: null,
    selectedLayerId: null,
    selectedLayerIds: [],
    bgPattern: 'dotted',
    activeEraserType: 'eraser',
    eraserSize: 20,
    customColors: [],
    camera: { x: 0, y: 0 },
    zoom: 1,
    isLocked: false,
    activeShape: 'rectangle',
    penSize: 4,
    activeOpacity: 1,
    permissionRole: 'owner',

    history: [[]], // Start with one empty state
    historyStep: 0,

    setActiveTool: (tool) => set({ activeTool: tool }),
    setActiveColor: (color) => {
        set({ activeColor: color });
        const { selectedLayerId, layers } = get();
        if (selectedLayerId) {
            const layer = layers.find((l) => l.id === selectedLayerId);
            if (layer) {
                const updates: Partial<Layer> = { fill: color };
                if (layer.type === 'pen' || layer.type === 'straight-line') {
                    updates.stroke = color;
                }
                get().updateLayer(selectedLayerId, updates);
                get().saveHistory();
            }
        }
    },
    setBackgroundColor: (color) => set({ backgroundColor: color }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    setBoardId: (id) => set({ boardId: id }),
    setSelectedLayerId: (id) => set({ selectedLayerIds: id ? [id] : [], selectedLayerId: id }),
    setSelectedLayerIds: (ids) => set({ selectedLayerIds: ids }),
    setBgPattern: (pattern) => set({ bgPattern: pattern }),
    setActiveEraserType: (type) => set({ activeEraserType: type, activeTool: type }),
    setEraserSize: (size) => set({ eraserSize: size }),
    addCustomColor: (color) => set((state) => {
        const newColors = [color, ...state.customColors.filter((current) => current !== color)].slice(0, 5);
        return { customColors: newColors };
    }),
    removeLayer: (id, isRemote = false) => {
        set((state) => ({
            layers: state.layers.filter((layer) => layer.id !== id),
        }));
        if (!isRemote) {
            broadcastUpdate(get().boardId, { type: 'draw-remove', id });
        }
    },
    setCamera: (pos) => set({ camera: pos }),
    setZoom: (zoom) => set({ zoom }),
    toggleLock: () => set((state) => ({ isLocked: !state.isLocked, selectedLayerId: null })),
    setActiveShape: (shape) => set({ activeShape: shape, activeTool: 'shape' }),
    setPenSize: (size) => set({ penSize: size }),
    setOpacity: (opacity) => set({ activeOpacity: opacity }),
    setPermissionRole: (role) => set({ permissionRole: role }),

    addLayer: (layer, isRemote = false) => {
        set((state) => ({ layers: [...state.layers, layer] }));
        if (!isRemote) {
            broadcastUpdate(get().boardId, { type: 'draw-add', layer });
        }
    },

    addLayers: (newLayers) => set((state) => ({ layers: [...state.layers, ...newLayers] })),

    updateLayer: (id, newAttributes, isRemote = false) => {
        set((state) => ({
            layers: state.layers.map((layer) =>
                layer.id === id ? { ...layer, ...newAttributes } : layer
            )
        }));
        if (!isRemote) {
            throttledBroadcastUpdate(get().boardId, id, newAttributes);
        }
    },

    // Called only on MouseUp
    saveHistory: () => {
        const { layers, history, historyStep } = get();
        // Remove any "future" history if we undo it and then drew something new
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push([...layers]);

        set({
            history: newHistory,
            historyStep: newHistory.length - 1,
        });
    },

    undo: () => {
        const { historyStep, history } = get();
        if (historyStep > 0) {
            set({
                historyStep: historyStep - 1,
                layers: history[historyStep - 1],
            });
        }
    },

    redo: () => {
        const { historyStep, history } = get();
        if (historyStep < history.length - 1) {
            set({
                historyStep: historyStep + 1,
                layers: history[historyStep + 1],
            });
        }
    },

    clear: () => {
        set({ layers: [] });
        get().saveHistory(); // Save the cleared state to history so we can undo a clear
    },

    saveToCloud: async (boardId: string) => {
        set({ isSaving: true });
        const loadingToast = toast.loading('Saving to cloud...');
        try {
            const { layers, backgroundColor } = get();
            const res = await fetch(`/api/board/${boardId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ layers, backgroundColor }),
            });

            if (!res.ok) throw new Error('Server rejected save');

            toast.success('Saved successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Failed to save:', error);
            toast.error('Failed to save to cloud.', { id: loadingToast });
        } finally {
            set({ isSaving: false });
        }
    },

    loadFromCloud: async (boardId: string) => {
        try {
            const res = await fetch(`/api/board/${boardId}`);
            const data = await res.json();
            if (data) {
                set({
                    layers: data.layers || [],
                    backgroundColor: data.backgroundColor || '#ffffff',
                    history: [data.layers || []],
                    historyStep: 0,
                });
            }
        } catch (error) {
            console.error('Failed to load:', error);
        }
    },
}));
