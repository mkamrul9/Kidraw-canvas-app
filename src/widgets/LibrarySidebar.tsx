'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { LIBRARY_ITEMS, LibraryItem } from '@/features/canvas/constants/library';
import { Button } from '@/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Shapes, X, Search, Check, FolderKanban, Waypoints, Network, Type, Square, LayoutTemplate, ToggleRight, CheckSquare, Sliders } from 'lucide-react';
import { toast } from 'sonner';

export default function LibrarySidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'Templates' | 'UI Components'>('Templates');
    const [searchQuery, setSearchQuery] = useState('');

    const { addLayers, saveHistory, camera, zoom } = useCanvasStore();

    const handleInsert = (item: LibraryItem) => {
        // Compute current viewport center
        const width = window.innerWidth;
        const height = window.innerHeight;
        const centerX = (-camera.x + width / 2) / zoom;
        const centerY = (-camera.y + height / 2) / zoom;

        // Create the shapes at the center coordinates
        const layers = item.createLayers(centerX, centerY);

        // Add to canvas store as a single batch
        addLayers(layers);
        saveHistory();

        toast.success(`Inserted ${item.name} at center of view.`);
    };

    const filteredItems = LIBRARY_ITEMS.filter((item) => {
        const matchesTab = item.category === activeTab;
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Custom miniature HTML previews to make it look premium
    const renderPreview = (itemId: string) => {
        switch (itemId) {
            // Templates previews
            case 'tmpl-flowchart':
                return (
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20 justify-center">
                        <div className="w-8 h-3.5 bg-violet-600 rounded border border-violet-400"></div>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                        <div className="w-5 h-5 bg-sky-500 rotate-45 border border-sky-400"></div>
                    </div>
                );
            case 'tmpl-kanban':
                return (
                    <div className="flex gap-1 p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20 items-center justify-center">
                        <div className="flex-1 h-full bg-slate-800/60 rounded p-0.5 flex flex-col gap-0.5 border border-white/5">
                            <div className="w-full h-1 bg-violet-500/30 rounded"></div>
                            <div className="w-full h-3 bg-yellow-500/20 rounded"></div>
                        </div>
                        <div className="flex-1 h-full bg-slate-800/60 rounded p-0.5 flex flex-col gap-0.5 border border-white/5">
                            <div className="w-full h-1 bg-sky-500/30 rounded"></div>
                            <div className="w-full h-3 bg-blue-500/20 rounded"></div>
                        </div>
                        <div className="flex-1 h-full bg-slate-800/60 rounded p-0.5 flex flex-col gap-0.5 border border-white/5">
                            <div className="w-full h-1 bg-emerald-500/30 rounded"></div>
                            <div className="w-full h-3 bg-green-500/20 rounded"></div>
                        </div>
                    </div>
                );
            case 'tmpl-mindmap':
                return (
                    <div className="flex items-center justify-center p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20 relative">
                        <div className="w-5 h-5 rounded-full bg-purple-500 border border-purple-400 absolute"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-500 absolute top-3 right-3"></div>
                        <div className="w-3 h-3 rounded-full bg-pink-500 absolute bottom-3 right-3"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 absolute left-3 top-1/2 -translate-y-1/2"></div>
                    </div>
                );

            // UI Components previews
            case 'comp-button':
                return (
                    <div className="flex items-center justify-center p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20">
                        <div className="px-2 py-1 bg-indigo-600 rounded-md border border-indigo-400 text-[8px] text-white font-bold shadow-md">Click Me</div>
                    </div>
                );
            case 'comp-input':
                return (
                    <div className="flex items-center justify-center p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20">
                        <div className="w-full py-1 px-1.5 bg-slate-800 rounded border border-slate-700 text-[7px] text-slate-500 text-left">Enter text...</div>
                    </div>
                );
            case 'comp-card':
                return (
                    <div className="flex items-center justify-center p-1.5 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20">
                        <div className="w-full h-full bg-slate-800 rounded p-1 border border-slate-700 flex flex-col gap-0.5 text-left justify-center">
                            <div className="w-10 h-1 bg-white rounded"></div>
                            <div className="w-14 h-0.5 bg-slate-500 rounded"></div>
                            <div className="w-12 h-0.5 bg-slate-500 rounded"></div>
                        </div>
                    </div>
                );
            case 'comp-toggle':
                return (
                    <div className="flex items-center justify-center p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20">
                        <div className="w-9 h-5 bg-emerald-500 rounded-full p-0.5 flex justify-end items-center border border-emerald-400 shadow-inner">
                            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-md"></div>
                        </div>
                    </div>
                );
            case 'comp-checkbox':
                return (
                    <div className="flex items-center justify-center gap-1 p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20">
                        <div className="w-3.5 h-3.5 bg-indigo-600 rounded flex items-center justify-center text-[8px] text-white">✓</div>
                        <div className="w-8 h-1 bg-slate-500 rounded"></div>
                    </div>
                );
            case 'comp-dropdown':
                return (
                    <div className="flex items-center justify-center p-2 bg-slate-950/40 rounded-lg border border-white/5 w-20 h-20">
                        <div className="w-full py-1 px-1.5 bg-slate-800 rounded border border-slate-700 flex justify-between items-center text-[7px] text-slate-300">
                            <span>Select...</span>
                            <span className="text-[6px] text-slate-500">▼</span>
                        </div>
                    </div>
                );
            default:
                return <Shapes className="w-6 h-6 text-slate-500" />;
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            {/* FLOATING TRIGGER BUTTON */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`absolute top-24 left-6 z-40 p-3.5 bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-slate-400 hover:text-white hover:bg-slate-800/50 hover:scale-105 active:scale-95 transition-all duration-300 ${
                            isOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
                        }`}
                    >
                        <Shapes className="w-5 h-5 text-violet-400" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 border-slate-700 text-white text-xs">
                    Templates & UI Library
                </TooltipContent>
            </Tooltip>

            {/* SIDEBAR PANEL */}
            <div
                className={`absolute top-24 left-6 bottom-6 w-80 bg-[#0B0F19]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0 pointer-events-none'
                }`}
            >
                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shapes className="w-4 h-4 text-violet-400" />
                        <span className="font-extrabold text-white text-sm uppercase tracking-wider">Library & Kit</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="px-4 pt-3 pb-2">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/50 transition-all font-sans"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 py-2">
                    <div className="flex bg-slate-950/40 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => {
                                setActiveTab('Templates');
                                setSearchQuery('');
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'Templates'
                                    ? 'bg-violet-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Templates
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('UI Components');
                                setSearchQuery('');
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'UI Components'
                                    ? 'bg-violet-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            UI Components
                        </button>
                    </div>
                </div>

                {/* Library Items List */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
                            <Shapes className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
                            <span>No items found</span>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleInsert(item)}
                                className="w-full text-left bg-slate-900/40 border border-white/5 rounded-xl p-3 flex gap-3 hover:bg-slate-800/40 hover:border-violet-500/30 hover:shadow-lg transition-all group active:scale-[0.98]"
                            >
                                {/* Miniature Preview Box */}
                                <div className="shrink-0">
                                    {renderPreview(item.id)}
                                </div>

                                {/* Information */}
                                <div className="flex flex-col justify-center min-w-0">
                                    <span className="font-extrabold text-white text-xs tracking-wide group-hover:text-violet-400 transition-colors">
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 leading-normal mt-0.5 font-sans break-words pr-1">
                                        {item.description}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
