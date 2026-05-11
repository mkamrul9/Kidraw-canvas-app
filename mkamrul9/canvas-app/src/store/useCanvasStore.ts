import { create } from 'zustand';
import { Layer, Color, Tool } from '../types/canvas';

interface CanvasState {
    activeTool: Tool;
    activeColor: Color;
    layers: Layer[];
    isDrawing: boolean;

    // History State
    history: Layer[][];
    historyStep: number;

    setActiveTool: (tool: Tool) => void;
    setActiveColor: (color: Color) => void;
    setIsDrawing: (isDrawing: boolean) => void;

    addLayer: (layer: Layer) => void;
    updateLayer: (id: string, newAttributes: Partial<Layer>) => void;

    // Canvas Management Actions
    saveHistory: () => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
    activeTool: 'pen',
    activeColor: '#000000',
    layers: [],
    isDrawing: false,

    history: [[]], // Start with one empty state
    historyStep: 0,

    setActiveTool: (tool) => set({ activeTool: tool }),
    setActiveColor: (color) => set({ activeColor: color }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),

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
}));