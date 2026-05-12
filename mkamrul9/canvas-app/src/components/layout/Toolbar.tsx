'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Square, Circle, Pen, Undo, Redo, Trash2, Download, Cloud, LogIn, LogOut } from 'lucide-react';
import { Tool } from '../../types/canvas';

export default function Toolbar() {
    const { activeTool, setActiveTool, undo, redo, clear, historyStep, history, saveToCloud, isSaving, boardId } = useCanvasStore();
    const { data: session } = useSession();

    const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
        { id: 'select', icon: <MousePointer2 className="w-4 h-4" />, label: 'Select' },
        { id: 'pen', icon: <Pen className="w-4 h-4" />, label: 'Draw' },
        { id: 'rectangle', icon: <Square className="w-4 h-4" />, label: 'Rectangle' },
        { id: 'ellipse', icon: <Circle className="w-4 h-4" />, label: 'Ellipse' },
    ];

    const handleExport = () => {
        window.dispatchEvent(new Event('export-canvas'));
    };

    return (
        <div className="absolute z-50 top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-md border border-slate-200 flex items-center gap-1 p-1">
            {tools.map((tool) => (
                <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool(tool.id)}
                    title={tool.label}
                    className="w-10 h-10 rounded-lg"
                >
                    {tool.icon}
                </Button>
            ))}

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