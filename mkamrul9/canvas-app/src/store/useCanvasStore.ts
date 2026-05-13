import { create } from 'zustand';
import { toast } from 'sonner';
import { Layer, Color, Tool, ShapeType } from '../types/canvas';

interface CanvasState {
    activeTool: Tool;
    activeColor: Color;
    backgroundColor: string;
    layers: Layer[];
    isDrawing: boolean;
    isSaving: boolean;
    boardId: string | null;
    selectedLayerId: string | null;
    bgMode: 'white' | 'dotted' | 'black';
    activeEraserType: 'eraser' | 'object-eraser';
    eraserSize: number;
    customColors: string[];
    camera: { x: number; y: number };
    zoom: number;
    activeShape: ShapeType;
    penSize: number;

    // History State
    history: Layer[][];
    historyStep: number;

    setActiveTool: (tool: Tool) => void;
    setActiveColor: (color: Color) => void;
    setBackgroundColor: (color: string) => void;
    setIsDrawing: (isDrawing: boolean) => void;
    setBoardId: (id: string) => void;
    setSelectedLayerId: (id: string | null) => void;
    setBgMode: (mode: 'white' | 'dotted' | 'black') => void;
    setActiveEraserType: (type: 'eraser' | 'object-eraser') => void;
    setEraserSize: (size: number) => void;
    addCustomColor: (color: string) => void;
    removeLayer: (id: string) => void;
    setCamera: (pos: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
    setActiveShape: (shape: ShapeType) => void;
    setPenSize: (size: number) => void;

    addLayer: (layer: Layer) => void;
    updateLayer: (id: string, newAttributes: Partial<Layer>) => void;

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
    backgroundColor: '#ffffff',
    layers: [],
    isDrawing: false,
    isSaving: false,
    boardId: null,
    selectedLayerId: null,
    bgMode: 'dotted',
    activeEraserType: 'eraser',
    eraserSize: 20,
    customColors: [],
    camera: { x: 0, y: 0 },
    zoom: 1,
    activeShape: 'rectangle',
    penSize: 4,

    history: [[]], // Start with one empty state
    historyStep: 0,

    setActiveTool: (tool) => set({ activeTool: tool }),
    setActiveColor: (color) => set({ activeColor: color }),
    setBackgroundColor: (color) => set({ backgroundColor: color }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    setBoardId: (id) => set({ boardId: id }),
    setSelectedLayerId: (id) => set({ selectedLayerId: id }),
    setBgMode: (mode) => set({
        bgMode: mode,
        backgroundColor: mode === 'white' ? '#ffffff' : mode === 'black' ? '#0f172a' : 'transparent',
    }),
    setActiveEraserType: (type) => set({ activeEraserType: type, activeTool: type }),
    setEraserSize: (size) => set({ eraserSize: size }),
    addCustomColor: (color) => set((state) => {
        const newColors = [color, ...state.customColors.filter((current) => current !== color)].slice(0, 5);
        return { customColors: newColors };
    }),
    removeLayer: (id) => set((state) => ({
        layers: state.layers.filter((layer) => layer.id !== id),
    })),
    setCamera: (pos) => set({ camera: pos }),
    setZoom: (zoom) => set({ zoom }),
    setActiveShape: (shape) => set({ activeShape: shape, activeTool: 'shape' }),
    setPenSize: (size) => set({ penSize: size }),

    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),

    updateLayer: (id, newAttributes) => set((state) => ({
        layers: state.layers.map((layer) =>
            layer.id === id ? { ...layer, ...newAttributes } : layer
        )
    })),

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