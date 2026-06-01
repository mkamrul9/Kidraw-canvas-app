import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/components/ui/dialog';
import { LogIn, Plus, LayoutDashboard, Sparkles, ArrowRight, User, Settings, CreditCard, Keyboard } from 'lucide-react';
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

/**
 * Logged-in dashboard view — extracted from page.tsx (lines 267-377).
 * Shows the user's workspaces with navigation and board creation dialog.
 */
export default function DashboardView({ session, boards }: DashboardViewProps) {
    return (
        <div className="min-h-screen bg-[#05070B] text-slate-50 flex flex-col font-sans relative overflow-x-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <nav className="h-16 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
                <Link href="/?view=landing" className="flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-lg shadow-violet-500/20"><Sparkles className="w-5 h-5 text-white" /></div>
                    <span className="font-extrabold text-xl text-white tracking-tight">Kidraw</span>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-10 w-10 border-2 border-white/10 shadow-sm ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                            <AvatarImage src={session.user.image || ''} />
                            <AvatarFallback className="bg-slate-800 text-violet-400 font-bold">{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl bg-slate-900 border-white/10 text-slate-50 shadow-2xl">
                        <DropdownMenuLabel className="font-normal pb-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                                <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/?view=landing">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Sparkles className="w-4 h-4 mr-2" /> View Landing Page</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/info/profile">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
                            </Link>
                            <Link href="/info/settings">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
                            </Link>
                            <Link href="/info/billing">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <Link href="/info/keyboard-shortcuts">
                            <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Keyboard className="w-4 h-4 mr-2" /> Keyboard Shortcuts <DropdownMenuShortcut className="text-inherit opacity-70">⌘K</DropdownMenuShortcut></DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <Link href="/api/auth/signout">
                            <DropdownMenuItem className="cursor-pointer focus:bg-red-600 focus:text-white text-red-400 rounded-md transition-colors">
                                <LogIn className="w-4 h-4 mr-2 rotate-180" /> Log out
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 relative z-10 mb-20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 mt-6 gap-6">
                    <div><h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">My Workspaces</h1><p className="text-slate-400 text-lg">Manage your projects and collaborative sessions.</p></div>

                    <Dialog>
                        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-white text-slate-950 hover:bg-slate-200 rounded-full px-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-105 h-12 font-bold text-sm">
                            <Plus className="w-5 h-5 mr-2" /> New Board
                        </DialogTrigger>
                        <DialogContent className="bg-[#0B0F19] border border-white/10 text-slate-50 sm:max-w-[450px] shadow-[0_0_100px_rgba(139,92,246,0.15)] rounded-2xl p-0 overflow-hidden">
                            <form action={createNewBoard}>
                                <DialogHeader className="px-6 pt-6 mb-2">
                                    <DialogTitle className="text-2xl font-bold">Create New Workspace</DialogTitle>
                                    <DialogDescription className="text-slate-400">Give your whiteboard a name and description to keep your team organized.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-5 px-6 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="title" className="text-sm font-semibold text-slate-200">Workspace Title</label>
                                        <input id="title" name="title" required placeholder="e.g. System Architecture Diagram" className="flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="description" className="text-sm font-semibold text-slate-200">Description <span className="text-slate-500 font-normal">(Optional)</span></label>
                                        <textarea id="description" name="description" placeholder="Briefly describe the purpose of this board..." className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none transition-all" />
                                    </div>
                                </div>
                                <DialogFooter className="px-6 py-4 border-t border-white/5 bg-[#0B0F19] sm:justify-center">
                                    <Button type="submit" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 w-full rounded-xl h-12 font-bold shadow-lg">
                                        Initialize Workspace <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {boards.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01] backdrop-blur-sm">
                        <div className="bg-violet-500/10 p-5 rounded-2xl mb-6 border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                            <LayoutDashboard className="w-10 h-10 text-violet-400" />
                        </div>
                        <p className="text-slate-300 font-medium mb-2 text-xl">Your workspace is empty.</p>
                        <p className="text-slate-500 mb-8 max-w-sm text-center">Create a new board to start mapping out your ideas, wireframing, or collaborating with your team.</p>
                    </div>
                ) : (
                    <BoardGrid boards={boards} />
                )}
            </main>
            <Footer />
        </div>
    );
}
