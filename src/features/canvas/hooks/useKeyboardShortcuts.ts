import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Layer } from '@/features/canvas/types';

export const useKeyboardShortcuts = () => {
    const clipboardRef = useRef<Layer[]>([]);

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

            // Search (Ctrl+F)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                state.setIsSearchOpen(!state.isSearchOpen);
                return;
            }

            // Copy
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
                const targetIds = state.selectedLayerIds.length > 0 ? state.selectedLayerIds : (state.selectedLayerId ? [state.selectedLayerId] : []);
                if (targetIds.length > 0) {
                    const layersToCopy = state.layers.filter(l => targetIds.includes(l.id));
                    if (layersToCopy.length > 0) {
                        clipboardRef.current = JSON.parse(JSON.stringify(layersToCopy));
                        toast.success(`Copied ${layersToCopy.length} item(s)`);
                    }
                }
                return;
            }

            // Paste
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                if (clipboardRef.current && clipboardRef.current.length > 0) {
                    const idMap = new Map<string, string>();
                    const newLayers = clipboardRef.current.map(layer => {
                        const newId = uuidv4();
                        idMap.set(layer.id, newId);
                        return {
                            ...layer,
                            id: newId,
                            x: (layer.x || 0) + 20,
                            y: (layer.y || 0) + 20,
                        };
                    });

                    // Update parentIds if the parent was also copied
                    newLayers.forEach(layer => {
                        if (layer.parentId && idMap.has(layer.parentId)) {
                            layer.parentId = idMap.get(layer.parentId);
                        }
                    });

                    newLayers.forEach(layer => state.addLayer(layer));
                    
                    if (newLayers.length === 1) {
                        state.setSelectedLayerId(newLayers[0].id);
                        state.setSelectedLayerIds([]);
                    } else {
                        state.setSelectedLayerId(null);
                        state.setSelectedLayerIds(newLayers.map(l => l.id));
                    }
                    state.saveHistory();
                    
                    // Update clipboard so multiple pastes keep offsetting
                    clipboardRef.current = newLayers;
                }
                return;
            }

            // Duplicate (Ctrl+D)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                const targetIds = state.selectedLayerIds.length > 0 ? state.selectedLayerIds : (state.selectedLayerId ? [state.selectedLayerId] : []);
                if (targetIds.length > 0) {
                    const layersToDuplicate = state.layers.filter(l => targetIds.includes(l.id));
                    const idMap = new Map<string, string>();
                    
                    const newLayers = JSON.parse(JSON.stringify(layersToDuplicate)).map((layer: Layer) => {
                        const newId = uuidv4();
                        idMap.set(layer.id, newId);
                        return {
                            ...layer,
                            id: newId,
                            x: (layer.x || 0) + 20,
                            y: (layer.y || 0) + 20,
                        };
                    });

                    // Update parentIds if the parent was also duplicated
                    newLayers.forEach((layer: Layer) => {
                        if (layer.parentId && idMap.has(layer.parentId)) {
                            layer.parentId = idMap.get(layer.parentId);
                        }
                    });

                    newLayers.forEach((layer: Layer) => state.addLayer(layer));
                    
                    if (newLayers.length === 1) {
                        state.setSelectedLayerId(newLayers[0].id);
                        state.setSelectedLayerIds([]);
                    } else {
                        state.setSelectedLayerId(null);
                        state.setSelectedLayerIds(newLayers.map((l: Layer) => l.id));
                    }
                    state.saveHistory();
                }
                return;
            }

            // Delete
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const targetIds = state.selectedLayerIds.length > 0 ? state.selectedLayerIds : (state.selectedLayerId ? [state.selectedLayerId] : []);
                if (targetIds.length > 0) {
                    let deletedAny = false;
                    targetIds.forEach(id => {
                        const layer = state.layers.find(l => l.id === id);
                        if (layer && !layer.isLocked) {
                            state.removeLayer(id);
                            deletedAny = true;
                        }
                    });
                    if (deletedAny) {
                        state.setSelectedLayerId(null);
                        state.setSelectedLayerIds([]);
                        state.saveHistory();
                    }
                }
                return;
            }

            // Grouping
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
                e.preventDefault();
                if (e.shiftKey) {
                    const idToUngroup = state.selectedLayerId || (state.selectedLayerIds.length > 0 ? state.selectedLayerIds[0] : null);
                    if (idToUngroup) {
                        state.ungroupLayers(idToUngroup);
                    }
                } else {
                    if (state.selectedLayerIds.length > 1) {
                        state.groupLayers(state.selectedLayerIds);
                    }
                }
                return;
            }

        // Layer Ordering
        if ((e.ctrlKey || e.metaKey) && (e.key === '[' || e.key === ']')) {
            const targetIds = state.selectedLayerIds.length > 0 ? state.selectedLayerIds : (state.selectedLayerId ? [state.selectedLayerId] : []);
            if (targetIds.length > 0) {
                e.preventDefault();
                targetIds.forEach(id => {
                    if (e.key === '[') {
                        if (e.shiftKey) state.sendToBack(id);
                        else state.sendBackward(id);
                    } else if (e.key === ']') {
                        if (e.shiftKey) state.bringToFront(id);
                        else state.bringForward(id);
                    }
                });
                state.saveHistory();
            }
            return;
        }

        // Nudging
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            if (state.selectedLayerIds.length > 0) {
                e.preventDefault();
                const amount = e.shiftKey ? 10 : 1;
                let dx = 0;
                let dy = 0;
                if (e.key === 'ArrowUp') dy = -amount;
                if (e.key === 'ArrowDown') dy = amount;
                if (e.key === 'ArrowLeft') dx = -amount;
                if (e.key === 'ArrowRight') dx = amount;

                state.selectedLayerIds.forEach(id => {
                    const layer = state.layers.find(l => l.id === id);
                    if (layer && !layer.isLocked) {
                        state.updateLayer(id, { x: layer.x + dx, y: layer.y + dy });
                    }
                });
                
                // Debounce history save
                if ((window as any).nudgeTimeout) clearTimeout((window as any).nudgeTimeout);
                (window as any).nudgeTimeout = setTimeout(() => {
                    state.saveHistory();
                }, 500);
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
