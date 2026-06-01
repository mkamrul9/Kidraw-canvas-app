import Link from "next/link";
import { ArrowLeft, Rocket, Wrench, Sparkles, Bug, ArrowUpRight } from "lucide-react";

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-black text-slate-50 relative font-sans selection:bg-cyan-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[0%] right-[10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <nav className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl px-8 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
            </nav>

            <main className="flex-1 max-w-4xl w-full mx-auto p-8 py-20 relative z-10">
                
                {/* Header */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 mb-6 shadow-sm">
                        <Rocket className="w-3 h-3" /> Product Updates
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tighter">Changelog</h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                        New features, performance improvements, and bug fixes. We ship new updates every week to make Kidraw faster and more powerful.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative border-l border-white/10 pl-8 md:pl-12 ml-4 md:ml-0 space-y-20">
                    
                    {/* Release 1.2.0 */}
                    <div className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[41px] md:-left-[57px] w-5 h-5 bg-black border-4 border-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                Kidraw v1.2.0 <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">Latest</span>
                            </h2>
                            <p className="text-zinc-500 font-medium">October 24, 2024</p>
                        </div>

                        <div className="mb-8 w-full h-64 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <Sparkles className="w-16 h-16 text-white/30" />
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-cyan-400"/> New Features</h3>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> <strong>Mermaid.js Export:</strong> You can now export your flowcharts and architecture diagrams directly to Mermaid markdown syntax.</li>
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> <strong>Laser Pointer:</strong> Added a new fading laser pointer tool for guiding attention during live presentations.</li>
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> <strong>Bento Grid Dashboard:</strong> Completely redesigned the dashboard to use a sleek, pure black premium aesthetic.</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><Wrench className="w-4 h-4 text-emerald-400"/> Improvements</h3>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> Hardware acceleration for panning and zooming now supports up to 120fps on M-series Macs.</li>
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> Reduced initial websocket connection latency by 40%.</li>
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Release 1.1.0 */}
                    <div className="relative">
                        <div className="absolute -left-[41px] md:-left-[57px] w-5 h-5 bg-black border-4 border-zinc-700 rounded-full"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Kidraw v1.1.0</h2>
                            <p className="text-zinc-500 font-medium">September 15, 2024</p>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-cyan-400"/> New Features</h3>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> <strong>React Code Export:</strong> Convert wireframes directly into React components with Tailwind CSS styling.</li>
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> <strong>Comments:</strong> Added ability to drop sticky comments anywhere on the canvas and tag teammates.</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><Bug className="w-4 h-4 text-rose-400"/> Bug Fixes</h3>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> Fixed an issue where cursors would occasionally desync when moving rapidly across network boundaries.</li>
                                    <li className="flex items-start gap-3"><span className="text-zinc-600 mt-1">•</span> Resolved a memory leak in the PDF export renderer.</li>
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Release 1.0.0 */}
                    <div className="relative opacity-60">
                        <div className="absolute -left-[41px] md:-left-[57px] w-5 h-5 bg-black border-4 border-zinc-800 rounded-full"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Kidraw v1.0.0</h2>
                            <p className="text-zinc-500 font-medium">August 1, 2024</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-zinc-400 leading-relaxed">
                                Initial public release of Kidraw! Introduced the core infinite canvas, real-time multiplayer socket connections, basic shapes, and the authentication system.
                            </p>
                            <a href="#" className="inline-flex items-center gap-1 text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                                Read the launch announcement <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
