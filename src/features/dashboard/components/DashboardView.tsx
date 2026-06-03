'use client';

import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Plus, LayoutDashboard, ArrowRight, LayoutTemplate, Workflow, Component, SquareTerminal } from 'lucide-react';
import BoardGrid from './BoardGrid';
import Footer from '@/shared/components/Footer';
import GlobalNavbar from '@/shared/components/GlobalNavbar';
import { createNewBoard } from '@/features/dashboard/actions/board-actions';
import { useState, useMemo } from 'react';
import { Search, ArrowDownAZ } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardViewProps {
    session: {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boards: any[];
}

const TEMPLATES = [
    { id: 'blank', name: 'Blank Canvas', icon: LayoutDashboard, desc: 'Start from scratch', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { id: 'flowchart', name: 'Flowchart', icon: Workflow, desc: 'Process mapping', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'wireframe', name: 'Wireframe', icon: Component, desc: 'UI/UX design', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
    { id: 'architecture', name: 'Architecture', icon: SquareTerminal, desc: 'System design', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

export default function DashboardView({ session, boards }: DashboardViewProps) {
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [isCreating, setIsCreating] = useState(false);
    
    // Board Management State
    const [localBoards, setLocalBoards] = useState(boards);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'updatedDesc' | 'createdDesc' | 'titleAsc'>('updatedDesc');

    const handleDeleteBoard = async (id: string) => {
        try {
            const res = await fetch(`/api/board/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete board');
            setLocalBoards(prev => prev.filter(b => b.id !== id));
            toast.success('Workspace deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete workspace');
        }
    };

    const filteredAndSortedBoards = useMemo(() => {
        let result = [...localBoards];
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b => b.title.toLowerCase().includes(query) || b.description?.toLowerCase().includes(query));
        }
        result.sort((a, b) => {
            if (sortBy === 'updatedDesc') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            if (sortBy === 'createdDesc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'titleAsc') return a.title.localeCompare(b.title);
            return 0;
        });
        return result;
    }, [localBoards, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden selection:bg-violet-500/30">
            
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Glowing Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full animate-float-delayed"></div>
                
                {/* Masked Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            {/* Global Navbar */}
            <GlobalNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 relative z-10 mb-20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 mt-6 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">My Workspaces</h1>
                        <p className="text-muted-foreground text-lg">Manage your projects and collaborative sessions.</p>
                    </div>

                    <Dialog>
                        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 h-11 font-bold text-sm">
                            <Plus className="w-5 h-5 mr-2" /> New Board
                        </DialogTrigger>
                        <DialogContent className="bg-card border border-border text-foreground sm:max-w-3xl shadow-2xl rounded-3xl p-0 overflow-hidden">
                            <form action={createNewBoard} onSubmit={() => setIsCreating(true)}>
                                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                                    
                                    {/* Left: Templates (3 columns) */}
                                    <div className="md:col-span-2 bg-muted/30 border-r border-border p-8">
                                        <div className="mb-6">
                                            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                                <LayoutTemplate className="w-5 h-5 text-primary" /> Start with a Template
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">Select a foundation for your new workspace.</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {TEMPLATES.map((t) => {
                                                const isSelected = selectedTemplate === t.id;
                                                const Icon = t.icon;
                                                return (
                                                    <button 
                                                        key={t.id} 
                                                        type="button"
                                                        onClick={() => setSelectedTemplate(t.id)}
                                                        className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${isSelected ? 'bg-background border-primary shadow-md scale-[1.02]' : 'bg-transparent border-transparent hover:bg-muted/50 hover:border-border'}`}
                                                    >
                                                        <div className={`p-2 rounded-xl ${isSelected ? t.bg : 'bg-background border border-border'}`}>
                                                            <Icon className={`w-6 h-6 ${isSelected ? t.color : 'text-muted-foreground'}`} />
                                                        </div>
                                                        <div>
                                                            <p className={`font-bold text-sm ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{t.name}</p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Right: Details (2 columns) */}
                                    <div className="md:col-span-3 flex flex-col bg-card">
                                        <DialogHeader className="px-8 pt-8 mb-4">
                                            <DialogTitle className="text-2xl font-bold">Workspace Details</DialogTitle>
                                            <DialogDescription className="text-muted-foreground text-base">Give your board a name and description to keep your team organized.</DialogDescription>
                                        </DialogHeader>
                                        
                                        <div className="flex-1 px-8 pb-4 space-y-6">
                                            <input type="hidden" name="template" value={selectedTemplate} />
                                            <div className="space-y-2">
                                                <label htmlFor="title" className="text-sm font-bold text-foreground">Workspace Title</label>
                                                <input id="title" name="title" required placeholder="e.g. System Architecture Diagram" className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="description" className="text-sm font-bold text-foreground">Description <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                                <textarea id="description" name="description" placeholder="Briefly describe the purpose of this board..." className="flex min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all font-medium shadow-sm" />
                                            </div>
                                        </div>
                                        
                                        <DialogFooter className="px-8 py-6 border-t border-border bg-muted/10 sm:justify-end">
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="ghost" className="rounded-xl h-11 font-bold mr-2 text-muted-foreground hover:text-foreground">Cancel</Button>
                                            </DialogTrigger>
                                            <Button type="submit" disabled={isCreating} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-8 font-bold shadow-lg transition-all hover:scale-105">
                                                {isCreating ? "Initializing..." : "Create Workspace"} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </DialogFooter>
                                    </div>

                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {localBoards.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search workspaces..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="appearance-none block w-full pl-10 pr-10 py-2 border border-border rounded-xl leading-5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all shadow-sm cursor-pointer"
                            >
                                <option value="updatedDesc">Last Updated</option>
                                <option value="createdDesc">Date Created</option>
                                <option value="titleAsc">Alphabetical (A-Z)</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ArrowDownAZ className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                )}

                {filteredAndSortedBoards.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-border rounded-3xl bg-card shadow-xl relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
                        <div className="bg-muted p-4 rounded-2xl mb-6 border border-border shadow-md relative z-10">
                            <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-bold mb-2 text-2xl relative z-10">
                            {localBoards.length === 0 ? "Your workspace is empty." : "No workspaces found."}
                        </p>
                        <p className="text-muted-foreground mb-8 max-w-sm text-center relative z-10">
                            {localBoards.length === 0 ? "Create a new board to start mapping out your ideas, wireframing, or collaborating with your team." : "Try adjusting your search query."}
                        </p>
                    </div>
                ) : (
                    <BoardGrid boards={filteredAndSortedBoards} onDelete={handleDeleteBoard} />
                )}
            </main>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
