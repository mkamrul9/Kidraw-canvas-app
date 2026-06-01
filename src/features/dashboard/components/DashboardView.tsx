'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/components/ui/dialog';
import { LogIn, Plus, LayoutDashboard, Sparkles, ArrowRight, User, Settings, CreditCard, Keyboard, Box } from 'lucide-react';
import BoardGrid from './BoardGrid';
import Footer from '@/shared/components/Footer';
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
        <div className="min-h-screen bg-black text-slate-50 flex flex-col font-sans relative overflow-x-hidden selection:bg-violet-500/30">
            
            {/* Custom Keyframes */}
            <style jsx global>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-float-slow {
                    animation: float-slow 15s ease-in-out infinite;
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-30px, 40px) scale(0.9); }
                    66% { transform: translate(20px, -30px) scale(1.1); }
                }
                .animate-float-delayed {
                    animation: float-delayed 18s ease-in-out infinite reverse;
                }
            `}</style>

            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Glowing Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full animate-float-delayed"></div>
                
                {/* Masked Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <nav className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
                <Link href="/?view=landing" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="bg-white p-1.5 rounded-md"><Box className="w-4 h-4 text-black" /></div>
                    <span className="font-bold text-lg text-white tracking-tight">Kidraw</span>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-9 w-9 border-2 border-white/10 shadow-sm ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                            <AvatarImage src={session.user.image || ''} />
                            <AvatarFallback className="bg-zinc-800 text-violet-400 font-bold">{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl bg-zinc-950 border border-white/10 text-slate-50 shadow-2xl">
                        <DropdownMenuLabel className="font-normal pb-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                                <p className="text-xs leading-none text-zinc-400">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/?view=landing">
                                <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md text-zinc-300 transition-colors"><Sparkles className="w-4 h-4 mr-2 text-violet-400" /> View Landing Page</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/info/profile">
                                <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md text-zinc-300 transition-colors"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
                            </Link>
                            <Link href="/info/settings">
                                <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md text-zinc-300 transition-colors"><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
                            </Link>
                            <Link href="/info/billing">
                                <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md text-zinc-300 transition-colors"><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <Link href="/info/keyboard-shortcuts">
                            <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md text-zinc-300 transition-colors"><Keyboard className="w-4 h-4 mr-2" /> Keyboard Shortcuts <DropdownMenuShortcut className="text-inherit opacity-70">⌘K</DropdownMenuShortcut></DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <Link href="/api/auth/signout">
                            <DropdownMenuItem className="cursor-pointer focus:bg-red-500/10 focus:text-red-400 text-red-400 rounded-md transition-colors">
                                <LogIn className="w-4 h-4 mr-2 rotate-180" /> Log out
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 relative z-10 mb-20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 mt-6 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Workspaces</h1>
                        <p className="text-zinc-400 text-lg">Manage your projects and collaborative sessions.</p>
                    </div>

                    <Dialog>
                        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-white text-black hover:bg-zinc-200 rounded-full px-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-105 h-10 font-bold text-sm">
                            <Plus className="w-4 h-4 mr-2" /> New Board
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border border-white/10 text-slate-50 sm:max-w-[450px] shadow-2xl rounded-2xl p-0 overflow-hidden">
                            <form action={createNewBoard}>
                                <DialogHeader className="px-6 pt-6 mb-2">
                                    <DialogTitle className="text-xl font-bold">Create New Workspace</DialogTitle>
                                    <DialogDescription className="text-zinc-400">Give your whiteboard a name and description to keep your team organized.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-5 px-6 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="title" className="text-sm font-semibold text-zinc-200">Workspace Title</label>
                                        <input id="title" name="title" required placeholder="e.g. System Architecture Diagram" className="flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="description" className="text-sm font-semibold text-zinc-200">Description <span className="text-zinc-600 font-normal">(Optional)</span></label>
                                        <textarea id="description" name="description" placeholder="Briefly describe the purpose of this board..." className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30 resize-none transition-all" />
                                    </div>
                                </div>
                                <DialogFooter className="px-6 py-4 border-t border-white/5 bg-zinc-950 sm:justify-center">
                                    <Button type="submit" className="bg-white text-black hover:bg-zinc-200 w-full rounded-xl h-10 font-bold shadow-lg">
                                        Initialize Workspace <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {boards.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm">
                        <div className="bg-white/5 p-4 rounded-2xl mb-6 border border-white/10 shadow-xl">
                            <LayoutDashboard className="w-8 h-8 text-zinc-400" />
                        </div>
                        <p className="text-white font-medium mb-2 text-xl">Your workspace is empty.</p>
                        <p className="text-zinc-500 mb-8 max-w-sm text-center">Create a new board to start mapping out your ideas, wireframing, or collaborating with your team.</p>
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
