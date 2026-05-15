import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Plus, LayoutDashboard, FileEdit, Sparkles, Layers, Zap, Infinity, ArrowRight, Share2, MousePointer2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default async function DashboardOrLanding() {
    const session = await getServerSession(authOptions);

    async function createNewBoard() {
        'use server';
        const currentSession = await getServerSession(authOptions);
        if (!currentSession?.user?.id) return;
        const newId = uuidv4();
        await prisma.board.create({
            data: { id: newId, authorId: currentSession.user.id, title: "Untitled Whiteboard", layers: [], backgroundColor: "#ffffff" }
        });
        redirect(`/board/${newId}`);
    }

    // ==========================================
    // VIEW 1: THE LOGGED-OUT SAAS LANDING PAGE
    // ==========================================
    if (!session?.user) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-fuchsia-500/30 overflow-x-hidden">

                {/* HERO SECTION with Mesh Gradient */}
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Animated Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 blur-[120px] opacity-20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

                    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-fuchsia-300 mb-8 backdrop-blur-md">
                            <Sparkles className="w-3 h-3" /> Canvas Pro v2.0 is now live
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            The infinite canvas for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400">
                                limitless engineering.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            From mapping out complex websocket architecture for KanbanSync to wireframing payment flows for Funding Panda, Canvas Pro gives you the tools to visually engineer your next big idea.
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

                {/* BENTO GRID FEATURES SECTION */}
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

                {/* PRICING / FOOTER CTA */}
                <div className="border-t border-slate-800/50 bg-slate-900/20 py-24 text-center">
                    <h2 className="text-3xl font-bold mb-6">100% Free. Built for Builders.</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">No paywalls. No credit cards. Just a pure, high-performance canvas waiting for your ideas.</p>
                    <Link href="/api/auth/signin">
                        <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 px-8 rounded-full shadow-lg transition-transform hover:scale-105 h-12">
                            <LogIn className="w-4 h-4 mr-2" /> Login to Canvas Pro
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // VIEW 2: THE LOGGED-IN DASHBOARD
    // ==========================================
    const boards = await prisma.board.findMany({
        where: { authorId: session.user.id },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <nav className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-sm">
                        <MousePointer2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-slate-900 tracking-tight">Canvas Pro</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-slate-100 hover:ring-violet-500 transition-all cursor-pointer">
                            <AvatarImage src={session.user.image || ""} />
                            <AvatarFallback className="bg-violet-100 text-violet-700 font-bold">
                                {session.user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-slate-900">{session.user.name}</p>
                                <p className="text-xs leading-none text-slate-500">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-2" />
                        <Link href="/api/auth/signout">
                            <DropdownMenuItem className="text-red-600 font-medium cursor-pointer rounded-md hover:bg-red-50 focus:bg-red-50 focus:text-red-700">
                                Log out
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-8">
                <div className="flex justify-between items-end mb-10 mt-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Whiteboards</h1>
                        <p className="text-slate-500">Manage your projects and collaborative sessions.</p>
                    </div>
                    <form action={createNewBoard}>
                        <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 h-11 font-medium">
                            <Plus className="w-4 h-4 mr-2" /> New Board
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {boards.length === 0 ? (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 backdrop-blur-sm">
                            <div className="bg-violet-100 p-4 rounded-full mb-4">
                                <FileEdit className="w-8 h-8 text-violet-600" />
                            </div>
                            <p className="text-slate-600 font-medium mb-6 text-lg">Your workspace is empty.</p>
                            <form action={createNewBoard}>
                                <Button type="submit" className="rounded-full shadow-sm" variant="outline">Create your first board</Button>
                            </form>
                        </div>
                    ) : (
                        boards.map((board) => (
                            <Link key={board.id} href={`/board/${board.id}`} className="group block h-full">
                                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-xl hover:border-violet-300 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">

                                    {/* Thumbnail */}
                                    <div className="h-40 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
                                        {/* Dashboard Mini-Grid */}
                                        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent"></div>
                                        <LayoutDashboard className="w-10 h-10 text-slate-300 group-hover:text-violet-500 transition-colors z-10" />
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between bg-white relative z-20">
                                        <h3 className="font-bold text-slate-900 truncate text-lg">{board.title}</h3>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                                {new Date(board.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
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