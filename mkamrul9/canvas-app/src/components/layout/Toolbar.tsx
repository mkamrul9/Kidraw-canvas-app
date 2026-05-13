'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Square, Circle, Pen, Undo, Redo, Trash2, Download, Cloud, LogIn, LogOut, Type, Eraser, XSquare } from 'lucide-react';
import { Tool } from '../../types/canvas';

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
    } = useCanvasStore();
    const { data: session } = useSession();
    const [showEraserMenu, setShowEraserMenu] = useState(false);

    const drawTools: { id: Tool; icon: React.ReactNode; label: string }[] = [
        { id: 'select', icon: <MousePointer2 className="w-4 h-4" />, label: 'Select' },
        { id: 'pen', icon: <Pen className="w-4 h-4" />, label: 'Draw' },
        { id: 'rectangle', icon: <Square className="w-4 h-4" />, label: 'Rectangle' },
        { id: 'ellipse', icon: <Circle className="w-4 h-4" />, label: 'Ellipse' },
        { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
    ];

    const handleEraserClick = () => {
        if (activeTool === 'eraser' || activeTool === 'object-eraser') {
            setShowEraserMenu(!showEraserMenu);
        } else {
            setActiveTool(activeEraserType);
            setShowEraserMenu(false);
        }
    };

    const handleExport = () => {
        window.dispatchEvent(new Event('export-canvas'));
    };

    return (
        <div className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 flex items-center gap-1 p-1.5 transition-all">
            {drawTools.map((tool) => (
                <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => {
                        setActiveTool(tool.id);
                        setShowEraserMenu(false);
                    }}
                    title={tool.label}
                    className="w-10 h-10 rounded-lg"
                >
                    {tool.icon}
                </Button>
            ))}

            <div className="relative flex items-center">
                <Button
                    variant={(activeTool === 'eraser' || activeTool === 'object-eraser') ? 'default' : 'ghost'}
                    size="icon"
                    onClick={handleEraserClick}
                    title="Eraser Tools (Click again for options)"
                    className="w-10 h-10 rounded-lg"
                >
                    {activeEraserType === 'object-eraser' ? <XSquare className="w-4 h-4" /> : <Eraser className="w-4 h-4" />}
                </Button>

                {showEraserMenu && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex flex-col gap-2 min-w-[140px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Type</span>
                        <div className="flex gap-1">
                            <Button
                                variant={activeEraserType === 'eraser' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => setActiveEraserType('eraser')}
                            >
                                <Eraser className="w-3 h-3 mr-1" /> Normal
                            </Button>
                            <Button
                                variant={activeEraserType === 'object-eraser' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => setActiveEraserType('object-eraser')}
                            >
                                <XSquare className="w-3 h-3 mr-1" /> Object
                            </Button>
                        </div>

                        {activeEraserType === 'eraser' && (
                            <>
                                <div className="h-[1px] bg-slate-100 my-1"></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Thickness</span>
                                <div className="flex items-center justify-around py-1">
                                    {[10, 20, 50].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setEraserSize(size)}
                                            title={`${size}px`}
                                            className={`rounded-full bg-slate-300 transition-all ${eraserSize === size
                                                ? 'bg-indigo-500 scale-110 ring-2 ring-indigo-200'
                                                : 'hover:bg-slate-400'
                                                }`}
                                            style={{
                                                width: size === 10 ? 12 : size === 20 ? 18 : 24,
                                                height: size === 10 ? 12 : size === 20 ? 18 : 24,
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>

            <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={historyStep === 0}
                title="Undo"
                className="w-10 h-10 rounded-lg text-slate-600"
            >
                <Undo className="w-4 h-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={historyStep === history.length - 1}
                title="Redo"
                className="w-10 h-10 rounded-lg text-slate-600"
            >
                <Redo className="w-4 h-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={clear}
                title="Clear Canvas"
                className="w-10 h-10 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                title="Download as PNG"
                className="w-10 h-10 rounded-lg text-slate-600"
            >
                <Download className="w-4 h-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => boardId && saveToCloud(boardId)}
                disabled={isSaving || !boardId}
                title="Save to Cloud"
                className="w-10 h-10 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
                <Cloud className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            </Button>

            <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>

            {session ? (
                <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    title={`Log out (${session.user?.name ?? 'User'})`}
                    className="text-slate-600 hover:text-red-600 px-3 h-10 rounded-lg text-xs font-semibold"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            ) : (
                <Button
                    variant="default"
                    onClick={() => signIn()}
                    title="Log in to save boards"
                    className="bg-slate-900 text-white hover:bg-slate-800 px-3 h-10 rounded-lg text-xs font-semibold"
                >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                </Button>
            )}
        </div>
    );
}