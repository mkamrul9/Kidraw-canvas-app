import React, { useState, useEffect, useRef } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

const CanvasSearch = () => {
    const { isSearchOpen, setIsSearchOpen, layers, setCamera, zoom } = useCanvasStore();
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState<{ id: string; x: number; y: number }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen) {
            // setTimeout to ensure it focuses after render
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
            setMatches([]);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setMatches([]);
            setCurrentIndex(0);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const found = layers.filter(layer => layer.text?.toLowerCase().includes(lowerQuery));
        setMatches(found.map(l => ({ id: l.id, x: l.x, y: l.y })));
        setCurrentIndex(0);
    }, [query, layers]);

    const jumpToMatch = (index: number) => {
        if (matches.length === 0) return;
        const match = matches[index];
        if (!match) return;
        
        // Center camera on match
        const centerX = -match.x * zoom + window.innerWidth / 2;
        const centerY = -match.y * zoom + window.innerHeight / 2;
        setCamera({ x: centerX, y: centerY });
    };

    useEffect(() => {
        if (matches.length > 0 && isSearchOpen) {
            jumpToMatch(currentIndex);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, matches, isSearchOpen]);

    if (!isSearchOpen) return null;

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] bg-[#0B0F19]/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl flex items-center p-2 w-[320px] transition-all">
            <Search className="w-4 h-4 text-violet-400 ml-2 mr-2 shrink-0" />
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find text on canvas..."
                className="bg-transparent border-none outline-none text-slate-200 text-sm flex-1 placeholder:text-slate-500 w-full"
                onKeyDown={(e) => {
                    // Prevent canvas tools from triggering
                    e.stopPropagation();
                    if (e.key === 'Escape') setIsSearchOpen(false);
                    if (e.key === 'Enter') {
                        if (e.shiftKey) {
                            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1));
                        } else {
                            setCurrentIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0));
                        }
                    }
                }}
            />
            {query && (
                <span className="text-xs font-mono text-slate-400 mr-2 shrink-0">
                    {matches.length > 0 ? `${currentIndex + 1}/${matches.length}` : '0/0'}
                </span>
            )}
            <div className="flex items-center gap-1 shrink-0 border-l border-slate-700 pl-2 ml-1">
                <button
                    onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1))}
                    disabled={matches.length === 0}
                    className="p-1.5 hover:bg-slate-800 rounded-md disabled:opacity-30 text-slate-300 transition-colors"
                >
                    <ChevronUp className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setCurrentIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0))}
                    disabled={matches.length === 0}
                    className="p-1.5 hover:bg-slate-800 rounded-md disabled:opacity-30 text-slate-300 transition-colors"
                >
                    <ChevronDown className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md ml-1 text-slate-400 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default CanvasSearch;
