import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Plus, LayoutDashboard, Sparkles, Layers, Zap, Infinity, ArrowRight, Share2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default async function DashboardOrLanding() {
    const session = await getServerSession(authOptions);

    // SERVER ACTION: Accepts form data for title and description
    async function createNewBoard(formData: FormData) {
        'use server';
        const currentSession = await getServerSession(authOptions);
        if (!currentSession?.user?.id) return;

        const title = formData.get('title') as string || "Untitled Whiteboard";
        const description = formData.get('description') as string;
        const newId = uuidv4();

        await prisma.board.create({
            data: {
                id: newId,
                authorId: currentSession.user.id,
                title,
                description,
                layers: [],
                backgroundColor: "#ffffff"
            }
        });
        redirect(`/board/${newId}`);
    }

    // ==========================================
    // VIEW 1: THE LOGGED-OUT SAAS LANDING PAGE
    // ==========================================
    if (!session?.user) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-fuchsia-500/30 overflow-x-hidden">
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 blur-[120px] opacity-20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

                    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-fuchsia-300 mb-8 backdrop-blur-md">
                            <Sparkles className="w-3 h-3" /> Kidraw v2.0 is now live
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            The infinite canvas for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400">
                                limitless engineering.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Visually engineer your next big idea. Map out complex architectures, wireframe user flows, and collaborate in real-time.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/api/auth/signin">
                                <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 text-md px-8 rounded-full shadow-[0_0_40px_rgba(217,70,239,0.3)] transition-all hover:scale-105 font-bold h-14">
                                    Start Drawing Free <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need. <span className="text-slate-500">Nothing you don't.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm hover:border-violet-500/50 transition-colors">
                            <Infinity className="w-10 h-10 text-violet-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Infinite Workspace</h3>
                            <p className="text-slate-400">Pan seamlessly across an unbounded grid. Zoom in for micro-details or zoom out for the macro architecture using our intelligent minimap HUD.</p>
                        </div>
                        <div className="col-span-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm hover:border-fuchsia-500/50 transition-colors">
                            <Layers className="w-10 h-10 text-fuchsia-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Smart Geometry</h3>
                            <p className="text-slate-400">Ray-casted lasso selection, advanced polygons, and responsive text inputs.</p>
                        </div>
                        <div className="col-span-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm hover:border-amber-500/50 transition-colors">
                            <Zap className="w-10 h-10 text-amber-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Laser Pointer</h3>
                            <p className="text-slate-400">Present your architecture with a fading laser trail to guide your team's focus.</p>
                        </div>
                        <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
                            <Share2 className="w-10 h-10 text-emerald-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Vector Export & Sharing</h3>
                            <p className="text-slate-400">Export your whiteboards natively to SVG, PNG, or JPEG. Generate secure share links with View, Comment, or Edit permissions in a single click.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800/50 bg-slate-900/20 py-24 text-center">
                    <h2 className="text-3xl font-bold mb-6">100% Free. Built for Builders.</h2>
                    <Link href="/api/auth/signin">
                        <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 px-8 rounded-full shadow-lg transition-transform hover:scale-105 h-12">
                            <LogIn className="w-4 h-4 mr-2" /> Login to Kidraw
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // VIEW 2: THE LOGGED-IN DARK AURORA DASHBOARD
    // ==========================================
    const boards = await prisma.board.findMany({
        where: { authorId: session.user.id },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans relative overflow-hidden">

            {/* Subtle Background Glow for Dashboard */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-fuchsia-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Top Navigation Bar */}
            <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-sm">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-white tracking-tight">Kidraw</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-10 w-10 border-2 border-slate-800 shadow-sm ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                            <AvatarImage src={session.user.image || ""} />
                            <AvatarFallback className="bg-slate-800 text-violet-400 font-bold">
                                {session.user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl bg-slate-900 border-slate-800 text-slate-50">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                                <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-2 bg-slate-800" />
                        <Link href="/api/auth/signout">
                            <DropdownMenuItem className="text-red-400 font-medium cursor-pointer rounded-md hover:bg-red-950 focus:bg-red-950 focus:text-red-400">
                                Log out
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-8 relative z-10">
                <div className="flex justify-between items-end mb-10 mt-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-2">My Workspaces</h1>
                        <p className="text-slate-400">Manage your projects and collaborative sessions.</p>
                    </div>

                    {/* NEW BOARD DIALOG */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-6 shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all hover:scale-105 h-11 font-bold">
                                <Plus className="w-4 h-4 mr-2" /> New Board
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-slate-50 sm:max-w-[425px]">
                            <form action={createNewBoard}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl">Create New Board</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Give your whiteboard a name and an optional description to keep your workspace organized.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-6">
                                    <div className="grid gap-2">
                                        <label htmlFor="title" className="text-sm font-medium text-slate-200">Title</label>
                                        <input id="title" name="title" required placeholder="e.g. System Architecture Diagram" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="description" className="text-sm font-medium text-slate-200">Description (Optional)</label>
                                        <textarea id="description" name="description" placeholder="Briefly describe the purpose of this board..." className="flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-violet-600 text-white hover:bg-violet-700 w-full rounded-lg">Create Workspace</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {boards.length === 0 ? (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 backdrop-blur-sm">
                            <div className="bg-violet-500/10 p-4 rounded-full mb-4 border border-violet-500/20">
                                <Sparkles className="w-8 h-8 text-violet-400" />
                            </div>
                            <p className="text-slate-300 font-medium mb-6 text-lg">Your workspace is empty.</p>
                        </div>
                    ) : (
                        boards.map((board) => (
                            <Link key={board.id} href={`/board/${board.id}`} className="group block h-full">
                                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 shadow-sm overflow-hidden hover:shadow-xl hover:border-violet-500/50 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1 backdrop-blur-sm">

                                    {/* Thumbnail Area */}
                                    <div className="h-32 bg-slate-950 border-b border-slate-800 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:12px_12px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <LayoutDashboard className="w-8 h-8 text-slate-600 group-hover:text-violet-400 transition-colors z-10" />
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex-1 flex flex-col bg-slate-900/50 relative z-20">
                                        <h3 className="font-bold text-white truncate text-lg">{board.title}</h3>
                                        {board.description && (
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{board.description}</p>
                                        )}
                                        <div className="flex items-center justify-between mt-auto pt-4">
                                            <span className="text-xs font-medium text-slate-500 bg-slate-950 border border-slate-800 px-2 py-1 rounded-md">
                                                {new Date(board.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}