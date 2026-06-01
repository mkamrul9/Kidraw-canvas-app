import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, LayoutDashboard, Layers, Share2, MousePointer2, ArrowRight, Zap as FastIcon, HeartHandshake, ShieldCheck, Shapes, Type, ArrowUpRight } from 'lucide-react';
import Footer from '@/shared/components/Footer';

interface LandingPageProps {
    isAuthenticated: boolean;
}

/**
 * Full SaaS landing page — extracted from the 379-line page.tsx.
 * Renders hero, how-it-works, use-cases, testimonials, and footer.
 */
export default function LandingPage({ isAuthenticated }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 selection:bg-fuchsia-500/30 overflow-x-hidden flex flex-col font-sans">

            <nav className="h-20 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl px-8 flex items-center justify-between fixed top-0 w-full z-50">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-lg shadow-violet-500/20"><Sparkles className="w-5 h-5 text-white" /></div>
                        <span className="font-extrabold text-xl text-white tracking-tight">Kidraw</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                        <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                        <Link href="#use-cases" className="hover:text-white transition-colors">Use Cases</Link>
                        <Link href="#testimonials" className="hover:text-white transition-colors">Wall of Love</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <Link href="/"><Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-full px-6">Go to Dashboard</Button></Link>
                    ) : (
                        <>
                            <Link href="/api/auth/signin"><Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 font-medium">Log in</Button></Link>
                            <Link href="/api/auth/signin"><Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 font-bold rounded-full px-6">Sign up free</Button></Link>
                        </>
                    )}
                </div>
            </nav>

            {/* HERO SECTION WITH FLOATING MOCKUP */}
            <div className="relative pt-32 pb-32 overflow-hidden flex-1 mt-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 blur-[150px] opacity-20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-fuchsia-300 mb-8 backdrop-blur-md shadow-lg shadow-fuchsia-500/10">
                        <Sparkles className="w-4 h-4" /> Kidraw v2.0 is now live
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Where engineering teams <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400">
                            think out loud.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The ultimate visual workspace. Map complex architectures, wireframe user flows, and collaborate in real-time on an infinite, blazing-fast canvas.
                    </p>
                    <div className="flex justify-center mb-20">
                        <Link href="/api/auth/signin">
                            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 text-lg px-10 py-7 rounded-full shadow-[0_0_50px_rgba(217,70,239,0.3)] transition-all hover:scale-105 font-bold">
                                Start Drawing Free <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* THE VISUAL SHOWCASE (3D Floating Canvas) */}
                    <div className="relative mx-auto w-full max-w-5xl hidden md:block" style={{ perspective: '1200px' }}>
                        <div className="relative rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl shadow-2xl overflow-hidden h-[500px] w-full transform rotate-x-[10deg] rotate-y-[-5deg] hover:rotate-x-0 hover:rotate-y-0 transition-transform duration-700 ease-out flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:20px_20px]"></div>
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 flex gap-2">
                                <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center"><MousePointer2 className="w-4 h-4 text-white" /></div>
                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center"><Shapes className="w-4 h-4 text-white" /></div>
                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center"><Type className="w-4 h-4 text-white" /></div>
                            </div>
                            <div className="absolute top-[30%] left-[20%] w-48 h-32 bg-indigo-500/30 border-2 border-indigo-400 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg shadow-indigo-500/20 animate-pulse">
                                <span className="font-bold text-indigo-200">Database Layer</span>
                            </div>
                            <div className="absolute top-[40%] right-[25%] w-40 h-40 bg-fuchsia-500/30 border-2 border-fuchsia-400 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg shadow-fuchsia-500/20">
                                <span className="font-bold text-fuchsia-200">Load Balancer</span>
                            </div>
                            <div className="absolute top-[40%] left-[45%] w-32 h-[2px] bg-white/50 rotate-12"></div>
                            <ArrowUpRight className="absolute top-[42%] left-[58%] w-6 h-6 text-white/50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW TO USE SECTION */}
            <div id="how-it-works" className="bg-[#0F172A] py-24 relative z-10 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">How it works</h2>
                        <p className="text-slate-400 text-xl">Go from chaos to clarity in three simple steps.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                            <div className="w-14 h-14 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mb-6"><LayoutDashboard className="w-6 h-6 text-violet-400" /></div>
                            <h3 className="text-2xl font-bold mb-3">1. Initialize</h3>
                            <p className="text-slate-400 text-base leading-relaxed">Create a boundless canvas. Set your environment to dark mode, dotted grid, or solid colors to match your team&apos;s focus.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                            <div className="w-14 h-14 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-2xl flex items-center justify-center mb-6"><Layers className="w-6 h-6 text-fuchsia-400" /></div>
                            <h3 className="text-2xl font-bold mb-3">2. Architect</h3>
                            <p className="text-slate-400 text-base leading-relaxed">Utilize our smart geometry, freehand pens, and image uploads to wireframe databases, UI flows, and logic trees instantly.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6"><Share2 className="w-6 h-6 text-emerald-400" /></div>
                            <h3 className="text-2xl font-bold mb-3">3. Collaborate</h3>
                            <p className="text-slate-400 text-base leading-relaxed">Generate role-based share links. Let stakeholders view, or invite engineers to edit and drop sticky-note comments in real-time.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* WHO IS IT FOR SECTION */}
            <div id="use-cases" className="bg-[#0B0F19] max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Built for builders.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                        <FastIcon className="w-10 h-10 text-amber-400 mb-6" /><h3 className="text-xl font-bold mb-3">Full-Stack Devs</h3>
                        <p className="text-slate-400 text-sm">Visualize complex Next.js, Prisma, and PostgreSQL data schemas before writing code.</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                        <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" /><h3 className="text-xl font-bold mb-3">System Architects</h3>
                        <p className="text-slate-400 text-sm">Design load balancers, microservices, and CI/CD pipelines on an infinite grid.</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                        <HeartHandshake className="w-10 h-10 text-rose-400 mb-6" /><h3 className="text-xl font-bold mb-3">Product Managers</h3>
                        <p className="text-slate-400 text-sm">Wireframe user journeys and gather contextual feedback via sticky-note comments.</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                        <Layers className="w-10 h-10 text-blue-400 mb-6" /><h3 className="text-xl font-bold mb-3">UI/UX Designers</h3>
                        <p className="text-slate-400 text-sm">Rapidly prototype interface layouts and map out component hierarchies.</p>
                    </div>
                </div>
            </div>

            {/* TESTIMONIALS SECTION */}
            <div id="testimonials" className="bg-[#0D0B1A] py-24 relative z-10 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-12 text-center">Wall of Love</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/[0.03] border border-violet-500/20 p-10 rounded-3xl shadow-xl shadow-violet-900/20">
                            <p className="text-xl text-slate-300 italic mb-8">&quot;Kidraw was instrumental when mapping out the real-time websocket infrastructure. The infinite canvas and smart geometry allowed us to see the entire system at a glance.&quot;</p>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-violet-500/20 rounded-full flex items-center justify-center border border-violet-500/30 text-violet-300 font-bold text-xl">AL</div>
                                <div><p className="font-bold text-white text-lg">Alex Larson</p><p className="text-slate-500">Engineering Lead</p></div>
                            </div>
                        </div>
                        <div className="bg-white/[0.03] border border-fuchsia-500/20 p-10 rounded-3xl shadow-xl shadow-fuchsia-900/20">
                            <p className="text-xl text-slate-300 italic mb-8">&quot;Wireframing payment flow logic was effortless. The laser pointer tool made our virtual pitch meetings incredibly seamless and focused.&quot;</p>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-fuchsia-500/20 rounded-full flex items-center justify-center border border-fuchsia-500/30 text-fuchsia-300 font-bold text-xl">SM</div>
                                <div><p className="font-bold text-white text-lg">Sarah Mitchell</p><p className="text-slate-500">Product Manager</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
