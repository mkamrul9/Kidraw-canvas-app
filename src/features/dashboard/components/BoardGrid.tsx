'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DASHBOARD_INITIAL_BOARD_COUNT } from '@/shared/constants';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BoardGrid({ boards, onDelete }: { boards: any[], onDelete?: (id: string) => void }) {
    const [showAll, setShowAll] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
    const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const router = useRouter();

    const handleRenameSubmit = async (boardId: string) => {
        if (!editTitle.trim()) {
            setEditingBoardId(null);
            return;
        }
        try {
            const res = await fetch(`/api/board/${boardId}/title`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle.trim() })
            });
            if (res.ok) {
                toast.success('Title updated');
                router.refresh();
            } else {
                toast.error('Failed to update title');
            }
        } catch (e) {
            toast.error('Failed to update title');
        }
        setEditingBoardId(null);
    };

    const visibleBoards = showAll ? boards : boards.slice(0, DASHBOARD_INITIAL_BOARD_COUNT);

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleBoards.map((board, index) => {
                    // Cycle through some subtle accent colors for the hover gradients
                    const gradients = [
                        "from-violet-500/10",
                        "from-blue-500/10",
                        "from-emerald-500/10",
                        "from-fuchsia-500/10"
                    ];
                    const bgGradients = [
                        "group-hover:bg-violet-500/10",
                        "group-hover:bg-blue-500/10",
                        "group-hover:bg-emerald-500/10",
                        "group-hover:bg-fuchsia-500/10"
                    ];
                    const hoverGradient = gradients[index % gradients.length];
                    const hoverBg = bgGradients[index % bgGradients.length];

                    return (
                        <Link key={board.id} href={`/board/${board.id}`} className="group block h-full">
                            <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-1 backdrop-blur-sm relative">
                                
                                {/* Thumbnail Background */}
                                {board.thumbnail && (
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity group-hover:opacity-80 transition-opacity duration-500" 
                                        style={{ backgroundImage: `url(${board.thumbnail})` }} 
                                    />
                                )}

                                {/* Inner Gradient Reveal & Readability Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} to-background/90 ${board.thumbnail ? 'opacity-90' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`}></div>
                                
                                {/* Decorative Blob */}
                                {!board.thumbnail && (
                                    <div className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-[40px] bg-transparent ${hoverBg} transition-colors duration-500`}></div>
                                )}

                                {onDelete && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <button 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                setBoardToDelete(board.id);
                                            }}
                                            className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-colors shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <div className="p-8 flex-1 flex flex-col relative z-10">
                                    <div className="w-12 h-12 bg-muted/50 border border-border rounded-xl flex items-center justify-center mb-6">
                                        <LayoutDashboard className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    </div>
                                    <div className="group/title flex items-center gap-2 mb-2">
                                        {editingBoardId === board.id ? (
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onBlur={() => handleRenameSubmit(board.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRenameSubmit(board.id);
                                                    if (e.key === 'Escape') setEditingBoardId(null);
                                                }}
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                autoFocus
                                                className="font-bold text-foreground text-xl bg-background border border-primary rounded px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        ) : (
                                            <>
                                                <h3 className="font-bold text-foreground text-xl truncate">{board.title}</h3>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setEditTitle(board.title);
                                                        setEditingBoardId(board.id);
                                                    }}
                                                    className="opacity-0 group-hover/title:opacity-100 p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-all"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                        {board.description || <span className="italic text-muted-foreground/50">No description provided.</span>}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-8">
                                        <span className="text-xs font-semibold text-muted-foreground/80 tracking-wide uppercase">
                                            {new Date(board.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <div className="bg-muted p-2.5 rounded-xl border border-border group-hover:bg-primary group-hover:border-primary transition-all shadow-md">
                                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {boards.length > DASHBOARD_INITIAL_BOARD_COUNT && (
                <div className="mt-12 flex justify-center w-full">
                    <Button onClick={() => setShowAll(!showAll)} variant="outline" className="bg-transparent border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground rounded-full px-8 py-6 font-bold shadow-lg transition-all">
                        {showAll ? "Show Less" : `View All Workspaces (${boards.length})`}
                    </Button>
                </div>
            )}

            <Dialog open={!!boardToDelete} onOpenChange={(open: boolean) => !open && setBoardToDelete(null)}>
                <DialogContent className="bg-card border-border rounded-2xl shadow-2xl sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Delete Workspace?</DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-2">
                            This action cannot be undone. This will permanently delete the board and all of its contents.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 flex sm:justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            className="rounded-xl font-bold text-muted-foreground"
                            onClick={() => setBoardToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold"
                            onClick={() => {
                                if (boardToDelete && onDelete) {
                                    onDelete(boardToDelete);
                                    setBoardToDelete(null);
                                }
                            }}
                        >
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
