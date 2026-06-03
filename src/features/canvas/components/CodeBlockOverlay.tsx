'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Layer } from '@/features/canvas/types';
import { Code2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function CodeBlockOverlay() {
    const { layers, zoom, camera, updateLayer, activeTool, isLocked, selectedLayerId, saveHistory } = useCanvasStore();

    const codeLayers = layers.filter(l => l.type === 'code');

    if (codeLayers.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-[60]">
            {codeLayers.map(layer => (
                <CodeBlock
                    key={layer.id}
                    layer={layer}
                    zoom={zoom}
                    camera={camera}
                    isLocked={isLocked}
                    isSelected={selectedLayerId === layer.id}
                    updateLayer={updateLayer}
                    saveHistory={saveHistory}
                />
            ))}
        </div>
    );
}

function CodeBlock({ layer, zoom, camera, isLocked, isSelected, updateLayer, saveHistory }: { 
    layer: Layer; zoom: number; camera: {x: number; y: number}; isLocked: boolean; isSelected: boolean;
    updateLayer: any; saveHistory: any;
}) {
    const screenX = layer.x * zoom + camera.x;
    const screenY = layer.y * zoom + camera.y;
    const screenW = layer.width * zoom;
    const screenH = layer.height * zoom;

    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Stop wheel events from panning the canvas if the textarea has its own scrollbar
    const handleWheel = (e: React.WheelEvent) => {
        if (isFocused) {
            e.stopPropagation();
        }
    };

    return (
        <div
            className={`absolute flex flex-col overflow-hidden transition-shadow ${isSelected ? 'ring-2 ring-violet-500 shadow-xl' : 'shadow-md'} ${layer.codeLanguage === 'preview' ? 'pointer-events-none' : 'pointer-events-auto'}`}
            style={{
                left: `${screenX}px`,
                top: `${screenY}px`,
                width: `${screenW}px`,
                height: `${screenH}px`,
                backgroundColor: layer.fill || '#0f172a',
                borderRadius: `${8 * zoom}px`,
                opacity: layer.opacity || 1
            }}
            onWheel={handleWheel}
        >
            {/* Header bar */}
            <div 
                className="flex items-center px-3 py-2 bg-black/40 border-b border-white/10 shrink-0"
                style={{ height: `${32 * zoom}px` }}
            >
                <div className="flex gap-1.5 mr-auto">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" style={{ transform: `scale(${zoom})`, transformOrigin: 'left center' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" style={{ transform: `scale(${zoom})`, transformOrigin: 'left center' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" style={{ transform: `scale(${zoom})`, transformOrigin: 'left center' }} />
                </div>
                <div 
                    className="flex items-center text-slate-400 font-mono"
                    style={{ fontSize: `${12 * zoom}px` }}
                >
                    <Code2 className="mr-1.5" style={{ width: `${14 * zoom}px`, height: `${14 * zoom}px` }} />
                    {layer.codeLanguage || 'code'}
                </div>
            </div>

            {/* Editor Area */}
            <textarea
                ref={textareaRef}
                value={layer.text || ''}
                readOnly={isLocked}
                onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    saveHistory();
                }}
                className="w-full h-full bg-transparent text-emerald-400 font-mono resize-none focus:outline-none p-4"
                style={{
                    fontSize: `${14 * zoom}px`,
                    lineHeight: 1.5,
                }}
                spellCheck={false}
                placeholder={isLocked ? '' : 'Type your code here...'}
            />
        </div>
    );
}
