'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Hand, Square, Circle, Pen, Undo, Redo, Type, Eraser, XSquare, Triangle, Star, Diamond, ArrowUpRight, Minus, Hexagon, Shapes, Wand2, ImagePlus, Lasso } from 'lucide-react';
import { useState } from 'react';

export default function Toolbar() {
    const {
        activeTool,
        setActiveTool,
        undo,
        redo,
        historyStep,
        history,
        activeEraserType,
        setActiveEraserType,
        eraserSize,
        setEraserSize,
        activeShape,
        setActiveShape,
        penSize,
        setPenSize,
        isLocked,
    } = useCanvasStore();

    const [activeMenu, setActiveMenu] = useState<'select' | 'pen' | 'shape' | 'eraser' | null>(null);

    const toggleMenu = (menu: 'select' | 'pen' | 'shape' | 'eraser') => setActiveMenu(activeMenu === menu ? null : menu);
    const closeMenu = () => setActiveMenu(null);
    const handleToolClick = (tool: 'select' | 'lasso' | 'hand' | 'pen' | 'shape' | 'text' | 'image' | 'eraser' | 'object-eraser' | 'comment' | 'laser') => {
        setActiveTool(tool);
        if (tool !== 'shape' && tool !== 'pen' && tool !== 'eraser' && tool !== 'select') {
            closeMenu();
        }
    };

    const handleEraserClick = () => {
        if (activeTool === 'eraser' || activeTool === 'object-eraser') {
            setActiveMenu(activeMenu === 'eraser' ? null : 'eraser');
        } else {
            setActiveTool(activeEraserType);
            setActiveMenu('eraser');
        }
    };

    return (
        <div className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-[#0B0F19]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex items-center gap-1 p-1.5 transition-all">
            <div className="relative flex items-center">
                <Button variant={activeTool === 'select' || activeTool === 'lasso' ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool('select'); toggleMenu('select'); }} title="Select (V)" className={`w-10 h-10 rounded-lg ${activeTool === 'select' || activeTool === 'lasso' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                    {activeTool === 'lasso' ? <Lasso className="w-4 h-4" /> : <MousePointer2 className="w-4 h-4" />}
                </Button>
                {activeMenu === 'select' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 flex gap-1 min-w-[100px]">
                        <Button variant={activeTool === 'select' ? 'default' : 'ghost'} size="sm" className={`flex-1 text-xs ${activeTool === 'select' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveTool('select'); closeMenu(); }}>
                            <MousePointer2 className="w-3 h-3 mr-1" /> Box
                        </Button>
                        <Button variant={activeTool === 'lasso' ? 'default' : 'ghost'} size="sm" className={`flex-1 text-xs ${activeTool === 'lasso' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveTool('lasso'); closeMenu(); }}>
                            <Lasso className="w-3 h-3 mr-1" /> Lasso
                        </Button>
                    </div>
                )}
            </div>
            <Button variant={activeTool === 'hand' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('hand')} title="Pan Canvas (H)" className={`w-10 h-10 rounded-lg ${activeTool === 'hand' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <Hand className="w-4 h-4" />
            </Button>

            <div className="relative flex items-center">
                <Button variant={activeTool === 'pen' ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool('pen'); toggleMenu('pen'); }} className={`w-10 h-10 rounded-lg ${activeTool === 'pen' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                    <Pen className="w-4 h-4" />
                </Button>
                {activeMenu === 'pen' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 flex items-center justify-around w-[120px]">
                        {[2, 4, 8].map((size) => (
                            <button key={size} onClick={() => setPenSize(size)} className={`rounded-full transition-all ${penSize === size ? 'bg-violet-500 ring-2 ring-violet-300/40' : 'bg-white/20 hover:bg-white/30'}`} style={{ width: size === 2 ? 10 : size === 4 ? 14 : 20, height: size === 2 ? 10 : size === 4 ? 14 : 20 }} />
                        ))}
                    </div>
                )}
            </div>

            <div className="relative flex items-center">
                <Button variant={activeTool === 'shape' ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool('shape'); toggleMenu('shape'); }} className={`w-10 h-10 rounded-lg ${activeTool === 'shape' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                    {activeShape === 'rectangle' ? <Square className="w-4 h-4" /> : activeShape === 'ellipse' ? <Circle className="w-4 h-4" /> : activeShape === 'arrow' ? <ArrowUpRight className="w-4 h-4" /> : activeShape === 'straight-line' ? <Minus className="w-4 h-4" /> : <Shapes className="w-4 h-4" />}
                </Button>
                {activeMenu === 'shape' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 grid grid-cols-4 gap-1 min-w-[160px]">
                        <Button variant={activeShape === 'rectangle' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'rectangle' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('rectangle'); closeMenu(); }}><Square className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'ellipse' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'ellipse' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('ellipse'); closeMenu(); }}><Circle className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'triangle' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'triangle' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('triangle'); closeMenu(); }}><Triangle className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'diamond' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'diamond' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('diamond'); closeMenu(); }}><Diamond className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'star' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'star' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('star'); closeMenu(); }}><Star className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'hexagon' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'hexagon' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('hexagon'); closeMenu(); }}><Hexagon className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'arrow' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'arrow' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('arrow'); closeMenu(); }}><ArrowUpRight className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'straight-line' ? 'default' : 'ghost'} size="icon" className={`${activeShape === 'straight-line' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => { setActiveShape('straight-line'); closeMenu(); }}><Minus className="w-4 h-4" /></Button>
                    </div>
                )}
            </div>

            <Button variant={activeTool === 'text' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('text')} className={`w-10 h-10 rounded-lg ${activeTool === 'text' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <Type className="w-4 h-4" />
            </Button>

            <Button
                variant={activeTool === 'image' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (event) => {
                        const file = (event.target as HTMLInputElement).files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (loadEvent) => {
                            const src = loadEvent.target?.result;
                            if (typeof src === 'string') {
                                window.dispatchEvent(new CustomEvent('insert-image', { detail: src }));
                                setActiveTool('image');
                            }
                        };
                        reader.readAsDataURL(file);
                    };
                    input.click();
                }}
                title="Insert Image"
                className={`w-10 h-10 rounded-lg ${activeTool === 'image' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
                <ImagePlus className="w-4 h-4" />
            </Button>

            <Button variant={activeTool === 'laser' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('laser')} title="Laser Pointer (L)" className={`w-10 h-10 rounded-lg ${activeTool === 'laser' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <Wand2 className="w-4 h-4" />
            </Button>

            <div className="relative flex items-center">
                <Button variant={(activeTool === 'eraser' || activeTool === 'object-eraser') ? 'default' : 'ghost'} size="icon" onClick={handleEraserClick} className={`w-10 h-10 rounded-lg ${(activeTool === 'eraser' || activeTool === 'object-eraser') ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                    {activeEraserType === 'object-eraser' ? <XSquare className="w-4 h-4" /> : <Eraser className="w-4 h-4" />}
                </Button>
                {activeMenu === 'eraser' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 flex flex-col gap-2 min-w-[140px]">
                        <div className="flex gap-1">
                            <Button variant={activeEraserType === 'eraser' ? 'default' : 'ghost'} size="sm" className={`flex-1 text-xs ${activeEraserType === 'eraser' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => setActiveEraserType('eraser')}>
                                Normal
                            </Button>
                            <Button variant={activeEraserType === 'object-eraser' ? 'default' : 'ghost'} size="sm" className={`flex-1 text-xs ${activeEraserType === 'object-eraser' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} onClick={() => setActiveEraserType('object-eraser')}>
                                Object
                            </Button>
                        </div>
                        {activeEraserType === 'eraser' && (
                            <div className="flex items-center justify-around py-1 mt-1">
                                {[10, 20, 50].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setEraserSize(size)}
                                        className={`rounded-full transition-all ${eraserSize === size ? 'bg-violet-500 ring-2 ring-violet-300/40' : 'bg-white/20 hover:bg-white/30'}`}
                                        style={{ width: size === 10 ? 12 : size === 20 ? 18 : 24, height: size === 10 ? 12 : size === 20 ? 18 : 24 }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
            <Button variant="ghost" size="icon" onClick={undo} disabled={historyStep === 0 || isLocked} className="w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><Undo className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyStep === history.length - 1 || isLocked} className="w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><Redo className="w-4 h-4" /></Button>
        </div>
    );
}