'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Layer } from '@/features/canvas/types';
import { Globe2 } from 'lucide-react';
import { useState } from 'react';

export default function IframeEmbedOverlay() {
    const { layers, zoom, camera, updateLayer, activeTool, isDrawing, isLocked, selectedLayerId, saveHistory } = useCanvasStore();

    const embedLayers = layers.filter(l => l.type === 'embed');

    if (embedLayers.length === 0) return null;

    // When panning or dragging, we need to disable pointer events on the iframe
    // so that it doesn't swallow mouse events from the canvas.
    const disableIframeEvents = activeTool === 'hand' || isDrawing;

    return (
        <div className="absolute inset-0 pointer-events-none z-[50]">
            {embedLayers.map(layer => (
                <EmbedCard
                    key={layer.id}
                    layer={layer}
                    zoom={zoom}
                    camera={camera}
                    isLocked={isLocked}
                    isSelected={selectedLayerId === layer.id}
                    updateLayer={updateLayer}
                    saveHistory={saveHistory}
                    disableEvents={disableIframeEvents}
                />
            ))}
        </div>
    );
}

function EmbedCard({ layer, zoom, camera, isLocked, isSelected, updateLayer, saveHistory, disableEvents }: { 
    layer: Layer; zoom: number; camera: {x: number; y: number}; isLocked: boolean; isSelected: boolean;
    updateLayer: any; saveHistory: any; disableEvents: boolean;
}) {
    const screenX = layer.x * zoom + camera.x;
    const screenY = layer.y * zoom + camera.y;
    const screenW = layer.width * zoom;
    const screenH = layer.height * zoom;

    const [isEditingUrl, setIsEditingUrl] = useState(layer.embedUrl === '');
    const [tempUrl, setTempUrl] = useState(layer.embedUrl || '');

    const handleSaveUrl = () => {
        let finalUrl = tempUrl;
        
        // Auto-convert YouTube links to embed links
        if (finalUrl.includes('youtube.com/watch?v=')) {
            const videoId = finalUrl.split('v=')[1]?.split('&')[0];
            finalUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (finalUrl.includes('youtu.be/')) {
            const videoId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
            finalUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        updateLayer(layer.id, { embedUrl: finalUrl });
        saveHistory();
        setIsEditingUrl(false);
    };

    return (
        <div
            className={`absolute flex flex-col overflow-hidden transition-shadow ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-md'} pointer-events-auto`}
            style={{
                left: `${screenX}px`,
                top: `${screenY}px`,
                width: `${screenW}px`,
                height: `${screenH}px`,
                backgroundColor: layer.fill || '#ffffff',
                borderRadius: `${8 * zoom}px`,
                opacity: layer.opacity || 1
            }}
        >
            {/* Header bar */}
            <div 
                className="flex items-center px-3 py-2 bg-slate-100 border-b border-slate-200 shrink-0 cursor-pointer"
                style={{ height: `${32 * zoom}px` }}
                onDoubleClick={() => !isLocked && setIsEditingUrl(true)}
            >
                <Globe2 className="text-slate-400 mr-2" style={{ width: `${14 * zoom}px`, height: `${14 * zoom}px` }} />
                <div 
                    className="truncate text-slate-500 font-medium select-none"
                    style={{ fontSize: `${12 * zoom}px` }}
                >
                    {layer.embedUrl || 'New Embed'}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative w-full h-full bg-slate-50 flex items-center justify-center">
                {disableEvents && <div className="absolute inset-0 z-10 bg-transparent" />}

                {isEditingUrl ? (
                    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-sm" style={{ transform: `scale(${Math.min(1, zoom)})` }}>
                        <Globe2 className="w-8 h-8 text-slate-300" />
                        <input
                            type="text"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder="Paste YouTube or Website URL..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveUrl();
                                if (e.key === 'Escape') setIsEditingUrl(false);
                            }}
                            autoFocus
                        />
                        <button
                            onClick={handleSaveUrl}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm w-full"
                        >
                            Embed Link
                        </button>
                    </div>
                ) : layer.embedUrl ? (
                    <iframe
                        src={layer.embedUrl}
                        className="w-full h-full border-none"
                        title="Embed"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div 
                        className="text-slate-400 font-medium select-none"
                        style={{ fontSize: `${14 * zoom}px` }}
                        onClick={() => !isLocked && setIsEditingUrl(true)}
                    >
                        Double-click header to add URL
                    </div>
                )}
            </div>
        </div>
    );
}
