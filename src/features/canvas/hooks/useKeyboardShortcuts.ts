import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Layer } from '@/features/canvas/types';

export const useKeyboardShortcuts = () => {
    const clipboardRef = useRef<Layer | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input field
            const active = document.activeElement;
            if (
                active &&
                (active.tagName === 'INPUT' ||
                    active.tagName === 'TEXTAREA' ||
                    active.getAttribute('contenteditable') === 'true')
            ) {
                return;
            }

            const state = useCanvasStore.getState();

            // Undo / Redo
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    state.redo();
                } else {
                    state.undo();
                }
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                state.redo();
                return;
            }

            // Copy
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
                if (state.selectedLayerId) {
                    const layerToCopy = state.layers.find(l => l.id === state.selectedLayerId);
                    if (layerToCopy) {
                        clipboardRef.current = JSON.parse(JSON.stringify(layerToCopy));
                        toast.success('Copied to clipboard');
                    }
                }
                return;
            }

            // Paste
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                if (clipboardRef.current) {
                    const newLayer = {
                        ...clipboardRef.current,
                        id: uuidv4(),
                        x: (clipboardRef.current.x || 0) + 20,
                        y: (clipboardRef.current.y || 0) + 20,
                    };
                    state.addLayer(newLayer);
                    state.setSelectedLayerId(newLayer.id);
                    state.saveHistory();
                    
                    // Update clipboard so multiple pastes keep offsetting
                    clipboardRef.current = newLayer;
                }
                return;
            }

            // Delete
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (state.selectedLayerId) {
                    state.removeLayer(state.selectedLayerId);
                    state.setSelectedLayerId(null);
                    state.saveHistory();
                }
                return;
            }

            // Layer Ordering
            if (e.key === '[' || e.key === ']') {
                if (state.selectedLayerId) {
                    if (e.key === '[') {
                        if (e.shiftKey) state.sendToBack(state.selectedLayerId);
                        else state.sendBackward(state.selectedLayerId);
                    } else if (e.key === ']') {
                        if (e.shiftKey) state.bringToFront(state.selectedLayerId);
                        else state.bringForward(state.selectedLayerId);
                    }
                }
                return;
            }


            // Single key tools
            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                const key = e.key.toLowerCase();
                console.log('[Shortcut Triggered]', key);
                switch (key) {
                    case 'v': state.setActiveTool('select'); break;
                    case 'l': state.setActiveTool('lasso'); break;
                    case 'h': state.setActiveTool('hand'); break;
                    case 'p': state.setActiveTool('pen'); break;
                    case 's': state.setActiveTool('shape'); break;
                    case 'r': state.setActiveShape('rectangle'); state.setActiveTool('shape'); break;
                    case 'c': state.setActiveShape('ellipse'); state.setActiveTool('shape'); break;
                    case 'a': state.setActiveShape('arrow'); state.setActiveTool('shape'); break;
                    case 't': state.setActiveTool('text'); break;
                    case 'n': state.setActiveTool('sticky'); break;
                    case 'f': state.setActiveTool('frame'); break;
                    case 'k': state.setActiveTool('laser'); break;
                    case 'e': 
                        if (e.shiftKey) state.setActiveEraserType('object-eraser');
                        else state.setActiveEraserType('eraser');
                        break;
                }
            }

        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
};
