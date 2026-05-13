'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Hand, Square, Circle, Pen, Undo, Redo, Trash2, Download, Cloud, LogIn, LogOut, Type, Eraser, XSquare, Triangle, Star, Diamond } from 'lucide-react';
import { useState } from 'react';

export default function Toolbar() {
    const {
        activeTool,
        setActiveTool,
        undo,
        redo,
        clear,
        historyStep,
        history,
        saveToCloud,
        isSaving,
        boardId,
        activeEraserType,
        setActiveEraserType,
        eraserSize,
        setEraserSize,
        activeShape,
        setActiveShape,
        penSize,
        setPenSize,
    } = useCanvasStore();
    const { data: session } = useSession();

    const [activeMenu, setActiveMenu] = useState<'pen' | 'shape' | 'eraser' | null>(null);

    const toggleMenu = (menu: 'pen' | 'shape' | 'eraser') => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const closeMenu = () => setActiveMenu(null);

    const handleToolClick = (tool: 'select' | 'hand' | 'pen' | 'shape' | 'text' | 'eraser' | 'object-eraser') => {
        setActiveTool(tool);
        closeMenu();
    };

    return (
        <div className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 flex items-center gap-1 p-1.5 transition-all">
            <Button variant={activeTool === 'select' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('select')} title="Select (V)" className="w-10 h-10 rounded-lg">
                <MousePointer2 className="w-4 h-4" />
            </Button>

            <Button variant={activeTool === 'hand' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('hand')} title="Pan Canvas (H)" className="w-10 h-10 rounded-lg">
                <Hand className="w-4 h-4" />
            </Button>

            <div className="relative flex items-center">
                <Button variant={activeTool === 'pen' ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool('pen'); toggleMenu('pen'); }} title="Pen (P)" className="w-10 h-10 rounded-lg">
                    <Pen className="w-4 h-4" />
                </Button>
                {activeMenu === 'pen' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex flex-col gap-2 min-w-[120px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Thickness</span>
                        <div className="flex items-center justify-around py-1">
                            {[2, 4, 8].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setPenSize(size)}
                                    title={`${size}px`}
                                    className={`rounded-full transition-all ${penSize === size ? 'bg-indigo-500 ring-2 ring-indigo-200' : 'bg-slate-300 hover:bg-slate-400'}`}
                                    style={{ width: size === 2 ? 10 : size === 4 ? 14 : 20, height: size === 2 ? 10 : size === 4 ? 14 : 20 }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative flex items-center">
                <Button variant={activeTool === 'shape' ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool('shape'); toggleMenu('shape'); }} title="Shapes (S)" className="w-10 h-10 rounded-lg">
                    {activeShape === 'rectangle' ? <Square className="w-4 h-4" /> :
                        activeShape === 'ellipse' ? <Circle className="w-4 h-4" /> :
                            activeShape === 'triangle' ? <Triangle className="w-4 h-4" /> :
                                activeShape === 'diamond' ? <Diamond className="w-4 h-4" /> :
                                    <Star className="w-4 h-4" />}
                </Button>
                {activeMenu === 'shape' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 grid grid-cols-3 gap-1 min-w-[120px]">
                        <Button variant={activeShape === 'rectangle' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('rectangle'); closeMenu(); }}><Square className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'ellipse' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('ellipse'); closeMenu(); }}><Circle className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'triangle' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('triangle'); closeMenu(); }}><Triangle className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'diamond' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('diamond'); closeMenu(); }}><Diamond className="w-4 h-4" /></Button>
                        <Button variant={activeShape === 'star' ? 'secondary' : 'ghost'} size="icon" onClick={() => { setActiveShape('star'); closeMenu(); }}><Star className="w-4 h-4" /></Button>
                    </div>
                )}
            </div>

            <Button variant={activeTool === 'text' ? 'default' : 'ghost'} size="icon" onClick={() => handleToolClick('text')} title="Text (T)" className="w-10 h-10 rounded-lg">
                <Type className="w-4 h-4" />
            </Button>

            <div className="relative flex items-center">
                <Button variant={(activeTool === 'eraser' || activeTool === 'object-eraser') ? 'default' : 'ghost'} size="icon" onClick={() => { setActiveTool(activeEraserType); toggleMenu('eraser'); }} title="Eraser (E)" className="w-10 h-10 rounded-lg">
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

            <Button variant="ghost" size="icon" onClick={undo} disabled={historyStep === 0} title="Undo" className="w-10 h-10 rounded-lg text-slate-600">
                <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyStep === history.length - 1} title="Redo" className="w-10 h-10 rounded-lg text-slate-600">
                <Redo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clear} title="Clear Canvas" className="w-10 h-10 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => window.dispatchEvent(new Event('export-canvas'))} title="Download as PNG" className="w-10 h-10 rounded-lg text-slate-600">
                <Download className="w-4 h-4" />
            </Button>

            <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => boardId && saveToCloud(boardId)} disabled={isSaving || !boardId} title="Save to Cloud" className="w-10 h-10 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Cloud className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            </Button>

            {session ? (
                <Button variant="ghost" onClick={() => signOut()} title="Log out" className="text-slate-600 hover:text-red-600 px-3 h-10 rounded-lg text-xs font-semibold">
                    <LogOut className="w-4 h-4 mr-2" />Logout
                </Button>
            ) : (
                <Button variant="default" onClick={() => signIn()} className="bg-slate-900 text-white hover:bg-slate-800 px-3 h-10 rounded-lg text-xs font-semibold">
                    <LogIn className="w-4 h-4 mr-2" />Login
                </Button>
            )}
        </div>
    );
}