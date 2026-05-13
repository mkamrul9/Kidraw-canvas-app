'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Hand, Square, Circle, Pen, Undo, Redo, Type, Eraser, XSquare, Triangle, Star, Diamond, ArrowUpRight, Minus, Hexagon, Shapes, Navigation } from 'lucide-react';
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

    const [activeMenu, setActiveMenu] = useState<'pen' | 'shape' | 'eraser' | null>(null);

    const toggleMenu = (menu: 'pen' | 'shape' | 'eraser') => setActiveMenu(activeMenu === menu ? null : menu);
    const closeMenu = () => setActiveMenu(null);
    const handleToolClick = (tool: 'select' | 'hand' | 'pen' | 'shape' | 'text' | 'eraser' | 'object-eraser' | 'comment' | 'laser') => {
        setActiveTool(tool);
        if (tool !== 'shape' && tool !== 'pen' && tool !== 'eraser') {
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
        <div className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 flex items-center gap-1 p-1.5 transition-all">
            <Button variant={activeTool === 'select' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('select')} title="Select (V)" className="w-10 h-10 rounded-lg"><MousePointer2 className="w-4 h-4" /></Button>
            <Button variant={activeTool === 'hand' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('hand')} title="Pan Canvas (H)" className="w-10 h-10 rounded-lg"><Hand className="w-4 h-4" /></Button>

            <div className="relative flex items-center">
                <Button variant={activeTool === 'pen' ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool('pen'); toggleMenu('pen'); }} className="w-10 h-10 rounded-lg"><Pen className="w-4 h-4" /></Button>
                {activeMenu === 'pen' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border p-2 flex items-center justify-around w-[120px]">
                        {[2, 4, 8].map((size) => (
                            <button key={size} onClick={() => setPenSize(size)} className={`rounded-full transition-all ${penSize === size ? 'bg-indigo-500 ring-2 ring-indigo-200' : 'bg-slate-300 hover:bg-slate-400'}`} style={{ width: size === 2 ? 10 : size === 4 ? 14 : 20, height: size === 2 ? 10 : size === 4 ? 14 : 20 }} />
                        ))}
                    </div>
                )}
            </div>

            <Button variant={activeTool === 'laser' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('laser')} title="Laser Pointer (L)" className="w-10 h-10 rounded-lg">
                <Navigation className="w-4 h-4" />
            </Button>

            <div className="relative flex items-center">
                <Button variant={activeTool === 'shape' ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool('shape'); toggleMenu('shape'); }} className="w-10 h-10 rounded-lg">
                    {activeShape === 'rectangle' ? <Square className="w-4 h-4" /> : activeShape === 'ellipse' ? <Circle className="w-4 h-4" /> : activeShape === 'arrow' ? <ArrowUpRight className="w-4 h-4" /> : activeShape === 'straight-line' ? <Minus className="w-4 h-4" /> : <Shapes className="w-4 h-4" />}
                </Button>
                {activeMenu === 'shape' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border p-2 grid grid-cols-4 gap-1 min-w-[160px]">
                        <Button variant={activeShape === 'rectangle' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('rectangle'); closeMenu(); }}><Square className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'ellipse' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('ellipse'); closeMenu(); }}><Circle className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'triangle' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('triangle'); closeMenu(); }}><Triangle className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'diamond' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('diamond'); closeMenu(); }}><Diamond className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'star' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('star'); closeMenu(); }}><Star className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'hexagon' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('hexagon'); closeMenu(); }}><Hexagon className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'arrow' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('arrow'); closeMenu(); }}><ArrowUpRight className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'straight-line' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('straight-line'); closeMenu(); }}><Minus className="w-4 h-4" /></Button>
                    </div>
                )}
            </div>

            <Button variant={activeTool === 'text' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('text')} className="w-10 h-10 rounded-lg"><Type className="w-4 h-4" /></Button>

            <div className="relative flex items-center">
                <Button variant={(activeTool === 'eraser' || activeTool === 'object-eraser') ? 'default' : 'ghost'} size="icon" onClick={handleEraserClick} className="w-10 h-10 rounded-lg">
                    {activeEraserType === 'object-eraser' ? <XSquare className="w-4 h-4" /> : <Eraser className="w-4 h-4" />}
                </Button>
                {activeMenu === 'eraser' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex flex-col gap-2 min-w-[140px]">
                        <div className="flex gap-1">
                            <Button variant={activeEraserType === 'eraser' ? 'secondary' : 'ghost'} size="sm" className="flex-1 text-xs" onClick={() => setActiveEraserType('eraser')}>
                                Normal
                            </Button>
                            <Button variant={activeEraserType === 'object-eraser' ? 'secondary' : 'ghost'} size="sm" className="flex-1 text-xs" onClick={() => setActiveEraserType('object-eraser')}>
                                Object
                            </Button>
                        </div>
                        {activeEraserType === 'eraser' && (
                            <div className="flex items-center justify-around py-1 mt-1">
                                {[10, 20, 50].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setEraserSize(size)}
                                        className={`rounded-full transition-all ${eraserSize === size ? 'bg-indigo-500 ring-2 ring-indigo-200' : 'bg-slate-300 hover:bg-slate-400'}`}
                                        style={{ width: size === 10 ? 12 : size === 20 ? 18 : 24, height: size === 10 ? 12 : size === 20 ? 18 : 24 }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>
            <Button variant="ghost" size="icon" onClick={undo} disabled={historyStep === 0 || isLocked} className="w-10 h-10 rounded-lg text-slate-600"><Undo className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyStep === history.length - 1 || isLocked} className="w-10 h-10 rounded-lg text-slate-600"><Redo className="w-4 h-4" /></Button>
        </div>
    );
}