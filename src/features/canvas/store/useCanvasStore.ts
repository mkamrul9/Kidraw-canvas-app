import { create } from 'zustand';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
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
    isSketchMode: boolean;
    permissionRole: 'owner' | 'editor' | 'viewer';

    // History State
    history: Layer[][];
    historyStep: number;

    exportCodeContent: string | null;
    exportType: 'react' | 'mermaid' | null;
    setExportCodeContent: (code: string | null, type?: 'react' | 'mermaid' | null) => void;

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
    toggleSketchMode: () => void;
    setPermissionRole: (role: 'owner' | 'editor' | 'viewer') => void;

    addLayer: (layer: Layer, isRemote?: boolean) => void;
    addLayers: (layers: Layer[]) => void;
    updateLayer: (id: string, newAttributes: Partial<Layer>, isRemote?: boolean) => void;

    // Layer Ordering Actions
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;
    bringForward: (id: string) => void;
    sendBackward: (id: string) => void;

    // Grouping
    groupLayers: (ids: string[]) => void;
    ungroupLayers: (groupId: string) => void;

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
    isSketchMode: false,
    permissionRole: 'owner',

    history: [[]], // Start with one empty state
    historyStep: 0,

    exportCodeContent: null,
    exportType: null,
    setExportCodeContent: (code, type = 'react') => set({ exportCodeContent: code, exportType: code ? type : null }),

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
    setSelectedLayerIds: (ids) => set({ selectedLayerIds: ids, selectedLayerId: ids.length > 0 ? ids[0] : null }),
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
    toggleSketchMode: () => set((state) => ({ isSketchMode: !state.isSketchMode })),
    setPermissionRole: (role) => set({ permissionRole: role }),

    addLayer: (layer, isRemote = false) => {
        const { layers } = get();
        if (layer.zIndex === undefined) {
            const maxZ = layers.reduce((max, l) => Math.max(max, l.zIndex || 0), 0);
            layer.zIndex = maxZ + 1;
        }
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

    bringToFront: (id) => {
        const { layers, updateLayer, saveHistory } = get();
        const maxZ = layers.reduce((max, l) => Math.max(max, l.zIndex || 0), 0);
        updateLayer(id, { zIndex: maxZ + 1 });
        saveHistory();
    },

    sendToBack: (id) => {
        const { layers, updateLayer, saveHistory } = get();
        const minZ = layers.reduce((min, l) => Math.min(min, l.zIndex || 0), 0);
        updateLayer(id, { zIndex: minZ - 1 });
        saveHistory();
    },

    bringForward: (id) => {
        const { layers, updateLayer, saveHistory } = get();
        const layer = layers.find(l => l.id === id);
        if (!layer) return;
        const currentZ = layer.zIndex || 0;
        
        const aboveLayers = layers.filter(l => (l.zIndex || 0) > currentZ).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        if (aboveLayers.length === 0) return;
        
        const nextLayer = aboveLayers[0];
        const nextNextLayer = aboveLayers[1];
        
        const newZ = nextNextLayer ? ((nextLayer.zIndex || 0) + (nextNextLayer.zIndex || 0)) / 2 : (nextLayer.zIndex || 0) + 1;
        updateLayer(id, { zIndex: newZ });
        saveHistory();
    },

    sendBackward: (id) => {
        const { layers, updateLayer, saveHistory } = get();
        const layer = layers.find(l => l.id === id);
        if (!layer) return;
        const currentZ = layer.zIndex || 0;
        
        const belowLayers = layers.filter(l => (l.zIndex || 0) < currentZ).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
        if (belowLayers.length === 0) return;
        
        const prevLayer = belowLayers[0];
        const prevPrevLayer = belowLayers[1];
        
        const newZ = prevPrevLayer ? ((prevLayer.zIndex || 0) + (prevPrevLayer.zIndex || 0)) / 2 : (prevLayer.zIndex || 0) - 1;
        updateLayer(id, { zIndex: newZ });
        saveHistory();
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

    groupLayers: (ids) => {
        const { layers } = get();
        const selected = layers.filter(l => ids.includes(l.id));
        if (selected.length < 2) return;

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        selected.forEach(layer => {
            if (layer.type === 'pen' && layer.points) {
                for (let i = 0; i < layer.points.length; i += 2) {
                    minX = Math.min(minX, layer.points[i]);
                    minY = Math.min(minY, layer.points[i+1]);
                    maxX = Math.max(maxX, layer.points[i]);
                    maxY = Math.max(maxY, layer.points[i+1]);
                }
            } else {
                const w = Math.abs(layer.width || 0);
                const h = Math.abs(layer.height || 0);
                minX = Math.min(minX, layer.x);
                minY = Math.min(minY, layer.y);
                maxX = Math.max(maxX, layer.x + w);
                maxY = Math.max(maxY, layer.y + h);
            }
        });

        const groupId = uuidv4();
        const maxZ = layers.reduce((max, l) => Math.max(max, l.zIndex || 0), 0);
        
        const groupLayer = {
            id: groupId,
            type: 'group' as const,
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            fill: 'transparent',
            zIndex: maxZ + 1,
        };

        set(state => ({
            layers: [
                ...state.layers.map(l => ids.includes(l.id) ? { ...l, parentId: groupId } : l),
                groupLayer
            ],
            selectedLayerIds: [groupId],
            selectedLayerId: groupId
        }));
        
        get().saveHistory();
    },

    ungroupLayers: (groupId) => {
        const { layers } = get();
        const groupLayer = layers.find(l => l.id === groupId);
        if (!groupLayer || groupLayer.type !== 'group') return;

        const childrenIds = layers.filter(l => l.parentId === groupId).map(l => l.id);

        set(state => ({
            layers: state.layers.filter(l => l.id !== groupId).map(l => l.parentId === groupId ? { ...l, parentId: undefined } : l),
            selectedLayerIds: childrenIds,
            selectedLayerId: childrenIds[0] || null
        }));
        
        get().saveHistory();
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
