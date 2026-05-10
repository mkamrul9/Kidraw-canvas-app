import { create } from 'zustand';
import { Layer, Color } from '../types/canvas';

// Tool types for the canvas application with union type
export type Tool = 'select' | 'rectangle' | 'ellipse' | 'pen';

// Blueprint for the canvas state management 
interface CanvasState {
    activeTool: Tool;
    activeColor: Color;
    layers: Layer[];
    setActiveTool: (tool: Tool) => void;
    setActiveColor: (color: Color) => void;
    addLayer: (layer: Layer) => void;
}

// Zustand store for managing the canvas state, including active tool, color, and layers where, set is used to update the state based on user interactions
export const useCanvasStore = create<CanvasState>((set) => ({
    activeTool: 'select',
    activeColor: '#000000', // Default to black
    layers: [],
    setActiveTool: (tool) => set({ activeTool: tool }),
    setActiveColor: (color) => set({ activeColor: color }),
    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
}));