'use client';

import { Copy, Trash2, ArrowUpToLine, ArrowDownToLine, Group, Ungroup, Code2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface CanvasContextMenuProps {
    isOpen: boolean;
    x: number;
    y: number;
    isGroupSelected: boolean;
    canGroup: boolean;
    hasSelection: boolean;
    onClose: () => void;
    onBringToFront: () => void;
    onSendToBack: () => void;
    onGroup: () => void;
    onUngroup: () => void;
    onCopyMermaid: () => void;
    onDelete: () => void;
}

export default function CanvasContextMenu({
    isOpen, x, y, isGroupSelected, canGroup, hasSelection, onClose,
    onBringToFront, onSendToBack, onGroup, onUngroup, onCopyMermaid, onDelete
}: CanvasContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('mousedown', handleClickOutside);
        }
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen || !hasSelection) return null;

    return (
        <div 
            ref={menuRef}
            className="absolute z-[200] bg-[#0B0F19]/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-xl py-1.5 w-52 flex flex-col animate-in zoom-in-95 duration-100 origin-top-left"
            style={{ left: Math.min(x, window.innerWidth - 220), top: Math.min(y, window.innerHeight - 250) }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <button onClick={() => { onBringToFront(); onClose(); }} className="w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 flex items-center gap-2 transition-colors">
                <ArrowUpToLine className="w-4 h-4 text-slate-400" /> Bring to Front
            </button>
            <button onClick={() => { onSendToBack(); onClose(); }} className="w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 flex items-center gap-2 transition-colors">
                <ArrowDownToLine className="w-4 h-4 text-slate-400" /> Send to Back
            </button>
            
            <div className="w-full h-px bg-slate-800 my-1"></div>
            
            {canGroup && (
                <button onClick={() => { onGroup(); onClose(); }} className="w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 flex items-center gap-2 transition-colors">
                    <Group className="w-4 h-4 text-slate-400" /> Group Items
                </button>
            )}
            {isGroupSelected && (
                <button onClick={() => { onUngroup(); onClose(); }} className="w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 flex items-center gap-2 transition-colors">
                    <Ungroup className="w-4 h-4 text-slate-400" /> Ungroup
                </button>
            )}

            <button onClick={() => { onCopyMermaid(); onClose(); }} className="w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 flex items-center gap-2 transition-colors">
                <Code2 className="w-4 h-4 text-slate-400" /> Copy as Mermaid
            </button>
            
            <div className="w-full h-px bg-slate-800 my-1"></div>

            <button onClick={() => { onDelete(); onClose(); }} className="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 flex items-center gap-2 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
            </button>
        </div>
    );
}
