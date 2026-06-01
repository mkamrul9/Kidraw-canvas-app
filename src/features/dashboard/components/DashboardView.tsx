'use client';

import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Plus, LayoutDashboard, ArrowRight } from 'lucide-react';
import BoardGrid from './BoardGrid';
import Footer from '@/shared/components/Footer';
import GlobalNavbar from '@/shared/components/GlobalNavbar';
import { createNewBoard } from '@/features/dashboard/actions/board-actions';

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

export default function DashboardView({ session, boards }: DashboardViewProps) {
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

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 relative z-10 mb-20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 mt-6 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">My Workspaces</h1>
                        <p className="text-muted-foreground text-lg">Manage your projects and collaborative sessions.</p>
                    </div>

                    <Dialog>
                        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 shadow-md transition-all hover:scale-105 h-10 font-bold text-sm">
                            <Plus className="w-4 h-4 mr-2" /> New Board
                        </DialogTrigger>
                        <DialogContent className="bg-card border border-border text-foreground sm:max-w-[450px] shadow-2xl rounded-2xl p-0 overflow-hidden">
                            <form action={createNewBoard}>
                                <DialogHeader className="px-6 pt-6 mb-2">
                                    <DialogTitle className="text-xl font-bold">Create New Workspace</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">Give your whiteboard a name and description to keep your team organized.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-5 px-6 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="title" className="text-sm font-semibold text-foreground">Workspace Title</label>
                                        <input id="title" name="title" required placeholder="e.g. System Architecture Diagram" className="flex h-10 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="description" className="text-sm font-semibold text-foreground">Description <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                        <textarea id="description" name="description" placeholder="Briefly describe the purpose of this board..." className="flex min-h-[100px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none transition-all" />
                                    </div>
                                </div>
                                <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 sm:justify-center">
                                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl h-10 font-bold shadow-lg">
                                        Initialize Workspace <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {boards.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-border rounded-3xl bg-accent/30 backdrop-blur-sm">
                        <div className="bg-secondary/50 p-4 rounded-2xl mb-6 border border-border shadow-xl">
                            <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-medium mb-2 text-xl">Your workspace is empty.</p>
                        <p className="text-muted-foreground mb-8 max-w-sm text-center">Create a new board to start mapping out your ideas, wireframing, or collaborating with your team.</p>
                    </div>
                ) : (
                    <BoardGrid boards={boards} />
                )}
            </main>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
