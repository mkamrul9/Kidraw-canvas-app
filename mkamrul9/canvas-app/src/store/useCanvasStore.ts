import { create } from 'zustand';
import { Layer, Color, Tool } from '../types/canvas';


// Blueprint for the canvas state management 
interface CanvasState {
    activeTool: Tool;
    activeColor: Color;
    layers: Layer[];
    isDrawing: boolean;

    setActiveTool: (tool: Tool) => void;
    setActiveColor: (color: Color) => void;
    setIsDrawing: (isDrawing: boolean) => void;
    addLayer: (layer: Layer) => void;
    updateLayer: (id: string, newAttributes: Partial<Layer>) => void;
}

// Zustand store for managing the canvas state, including active tool, color, and layers where, set is used to update the state based on user interactions
export const useCanvasStore = create<CanvasState>((set) => ({
    activeTool: 'rectangle',
    activeColor: '#3b82f6',
    layers: [],
    isDrawing: false,

    setActiveTool: (tool) => set({ activeTool: tool }),
    setActiveColor: (color) => set({ activeColor: color }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),

    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),

    updateLayer: (id, newAttributes) => set((state) => ({
        layers: state.layers.map((layer) =>
            layer.id === id ? { ...layer, ...newAttributes } : layer
        )
    })),
}));