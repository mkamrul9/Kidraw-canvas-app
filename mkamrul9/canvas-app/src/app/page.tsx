import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Plus, LayoutDashboard, Sparkles, Layers, Zap, Infinity, ArrowRight, Share2, MousePointer2, User, Settings, CreditCard, Keyboard, HeartHandshake, ShieldCheck, Zap as FastIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default async function DashboardOrLanding() {
    const session = await getServerSession(authOptions);

    async function createNewBoard(formData: FormData) {
        'use server';
        const currentSession = await getServerSession(authOptions);
        if (!currentSession?.user?.id) return;
        const title = formData.get('title') as string || "Untitled Whiteboard";
        const description = formData.get('description') as string;
        const newId = uuidv4();
        await prisma.board.create({ data: { id: newId, authorId: currentSession.user.id, title, description, layers: [], backgroundColor: "#ffffff" } });
        redirect(`/board/${newId}`);
    }

    // ==========================================
    // SHARED PROFESSIONAL FOOTER
    // ==========================================
    const Footer = () => (
        <footer className="border-t border-white/10 bg-[#06090F] pt-20 pb-10 text-slate-400 relative z-10">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1.5 rounded-lg"><Sparkles className="w-4 h-4 text-white" /></div>
                        <span className="font-extrabold text-xl text-white tracking-tight">Kidraw</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">The visual workspace for modern engineering teams. Map, wireframe, and collaborate in real-time.</p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/info/features" className="hover:text-violet-400 transition-colors">Features</Link></li>
                        <li><Link href="/info/templates" className="hover:text-violet-400 transition-colors">Templates</Link></li>
                        <li><Link href="/info/integrations" className="hover:text-violet-400 transition-colors">Integrations</Link></li>
                        <li><Link href="/info/changelog" className="hover:text-violet-400 transition-colors">Changelog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Resources</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/info/help-center" className="hover:text-violet-400 transition-colors">Help Center</Link></li>
                        <li><Link href="/info/community" className="hover:text-violet-400 transition-colors">Community</Link></li>
                        <li><Link href="/info/blog" className="hover:text-violet-400 transition-colors">Blog</Link></li>
                        <li><Link href="/info/developers-api" className="hover:text-violet-400 transition-colors">Developers API</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Legal</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/info/privacy-policy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/info/terms-of-service" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/info/cookie-policy" className="hover:text-violet-400 transition-colors">Cookie Policy</Link></li>
                        <li><Link href="/info/security" className="hover:text-violet-400 transition-colors">Security</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
                <p>© {new Date().getFullYear()} Kidraw Inc. All rights reserved.</p>
            </div>
        </footer>
    );

    // ==========================================
    // VIEW 1: THE SAAS LANDING PAGE
    // ==========================================
    if (!session?.user) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-slate-50 selection:bg-fuchsia-500/30 overflow-x-hidden flex flex-col">

                {/* HERO SECTION */}
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex-1">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 blur-[150px] opacity-20 rounded-full animate-pulse"></div>
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
                            What is Kidraw? It's your ultimate visual workspace. Map out complex architectures, wireframe user flows, and collaborate in real-time without constraints.
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

                {/* HOW TO USE / STEPS SECTION */}
                <div className="bg-[#06090F] py-24 relative z-10 border-y border-white/5">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to use Kidraw</h2>
                            <p className="text-slate-400 text-lg">Go from idea to execution in three simple steps.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 mx-auto bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                                    <LayoutDashboard className="w-8 h-8 text-violet-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">1. Initialize Workspace</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Create a new boundless canvas. Set your environment to dark mode, dotted grid, or solid colors to match your focus.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 mx-auto bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(217,70,239,0.1)]">
                                    <Layers className="w-8 h-8 text-fuchsia-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">2. Map Architecture</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Utilize our smart geometry, freehand pens, and image uploads to wireframe your databases, UI flows, or logic trees.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                    <Share2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">3. Securely Collaborate</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Generate role-based share links. Let stakeholders view, or invite other engineers to edit and comment in real-time.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WHO IS IT FOR SECTION */}
                <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for builders.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                            <FastIcon className="w-8 h-8 text-amber-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Full-Stack Engineers</h3>
                            <p className="text-slate-400 text-sm">Visualize complex Next.js, Prisma, and PostgreSQL data schemas before writing a single line of code.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">System Architects</h3>
                            <p className="text-slate-400 text-sm">Design load balancers, microservices, and CI/CD pipelines on an infinite grid.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                            <HeartHandshake className="w-8 h-8 text-rose-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Product Managers</h3>
                            <p className="text-slate-400 text-sm">Wireframe user journeys and gather contextual feedback via sticky-note comments.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                            <Layers className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">UI/UX Designers</h3>
                            <p className="text-slate-400 text-sm">Rapidly prototype interface layouts and map out component hierarchies.</p>
                        </div>
                    </div>
                </div>

                {/* TESTIMONIALS SECTION */}
                <div className="bg-[#06090F] py-24 relative z-10 border-y border-white/5">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Wall of Love</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative">
                                <p className="text-lg text-slate-300 italic mb-6">"Kidraw was instrumental when mapping out the real-time websocket infrastructure for KanbanSync. The infinite canvas and smart geometry allowed us to see the entire system at a glance."</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center border border-violet-500/30 text-violet-300 font-bold">AL</div>
                                    <div><p className="font-bold text-white">Alex Larson</p><p className="text-sm text-slate-500">Engineering Lead</p></div>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative">
                                <p className="text-lg text-slate-300 italic mb-6">"Wireframing the Stripe payment flow logic for Funding Panda was effortless. The laser pointer tool made our virtual pitch meetings incredibly seamless and focused."</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-fuchsia-500/20 rounded-full flex items-center justify-center border border-fuchsia-500/30 text-fuchsia-300 font-bold">SM</div>
                                    <div><p className="font-bold text-white">Sarah Mitchell</p><p className="text-sm text-slate-500">Product Manager</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    // ==========================================
    // VIEW 2: THE LOGGED-IN DARK AURORA DASHBOARD
    // ==========================================
    const boards = await prisma.board.findMany({ where: { authorId: session.user.id }, orderBy: { updatedAt: 'desc' } });

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 flex flex-col font-sans relative overflow-x-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <nav className="h-16 border-b border-white/10 bg-[#0B0F19]/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-lg shadow-violet-500/20"><Sparkles className="w-5 h-5 text-white" /></div>
                    <span className="font-extrabold text-xl text-white tracking-tight">Kidraw</span>
                </div>

                {/* ENHANCED AVATAR DROPDOWN */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-10 w-10 border-2 border-white/10 shadow-sm ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                            <AvatarImage src={session.user.image || ""} />
                            <AvatarFallback className="bg-slate-800 text-violet-400 font-bold">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
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
                            <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 rounded-md"><User className="w-4 h-4 mr-2 text-slate-400" /> Profile</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 rounded-md"><Settings className="w-4 h-4 mr-2 text-slate-400" /> Settings</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 rounded-md"><CreditCard className="w-4 h-4 mr-2 text-slate-400" /> Billing</DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 rounded-md"><Keyboard className="w-4 h-4 mr-2 text-slate-400" /> Keyboard Shortcuts <DropdownMenuShortcut>⌘K</DropdownMenuShortcut></DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-white/10" />
                        {/* Custom Sign Out Flow */}
                        <Link href="/api/auth/signout">
                            <DropdownMenuItem className="text-red-400 font-medium cursor-pointer rounded-md hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 transition-colors">
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
                        <DialogContent className="bg-[#0B0F19] border border-white/10 text-slate-50 sm:max-w-[450px] shadow-[0_0_100px_rgba(139,92,246,0.15)] rounded-2xl overflow-hidden p-0">
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
                                {/* FIXED FOOTER: No grey background, border perfectly aligns */}
                                <DialogFooter className="px-6 py-4 border-t border-white/5 bg-transparent sm:justify-center">
                                    <Button type="submit" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 w-full rounded-xl h-12 font-bold shadow-lg">
                                        Initialize Workspace <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* ... glowing cards rendering logic the exact same ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {boards.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01] backdrop-blur-sm">
                            <div className="bg-violet-500/10 p-5 rounded-2xl mb-6 border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                                <LayoutDashboard className="w-10 h-10 text-violet-400" />
                            </div>
                            <p className="text-slate-300 font-medium mb-2 text-xl">Your workspace is empty.</p>
                            <p className="text-slate-500 mb-8 max-w-sm text-center">Create a new board to start mapping out your ideas, wireframing, or collaborating with your team.</p>
                        </div>
                    ) : (
                        boards.map((board) => (
                            <Link key={board.id} href={`/board/${board.id}`} className="group block h-full">
                                <div className="bg-white/[0.02] rounded-3xl border border-white/10 shadow-lg overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.1)] hover:border-violet-500/40 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1.5 backdrop-blur-md">
                                    <div className="h-40 bg-[#06090F] border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-violet-500/20 blur-2xl rounded-full group-hover:bg-violet-400/30 transition-colors"></div>
                                        <LayoutDashboard className="w-10 h-10 text-slate-500 group-hover:text-violet-300 transition-colors z-10 drop-shadow-lg" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col relative z-20">
                                        <h3 className="font-bold text-white truncate text-xl mb-1 group-hover:text-violet-100 transition-colors">{board.title}</h3>
                                        {board.description ? (
                                            <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">{board.description}</p>
                                        ) : (
                                            <p className="text-sm text-slate-600 mt-1 italic">No description provided.</p>
                                        )}
                                        <div className="flex items-center justify-between mt-auto pt-6">
                                            <span className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                                {new Date(board.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <div className="bg-white/5 p-2 rounded-lg border border-white/5 group-hover:bg-violet-500 group-hover:border-violet-400 transition-all">
                                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}