import Link from "next/link";
import { ArrowLeft, Code2, Key, Zap, ChevronRight, Copy, Terminal } from "lucide-react";

export default function DeveloperApiPage() {
    return (
        <div className="min-h-screen bg-black text-slate-50 relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <nav className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl px-8 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 py-20 relative z-10 flex flex-col lg:flex-row gap-16">
                
                {/* Sticky Sidebar Navigation */}
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="sticky top-32">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-8 shadow-sm">
                            <Code2 className="w-4 h-4" /> v1 API Docs
                        </div>
                        <ul className="space-y-1">
                            <li><a href="#introduction" className="flex items-center justify-between text-sm text-white font-bold bg-white/5 rounded-lg px-3 py-2">Introduction <ChevronRight className="w-3 h-3 text-blue-400"/></a></li>
                            <li><a href="#authentication" className="flex items-center justify-between text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">Authentication</a></li>
                            <li><a href="#boards" className="flex items-center justify-between text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">Boards API</a></li>
                            <li><a href="#export" className="flex items-center justify-between text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">Export API</a></li>
                            <li><a href="#webhooks" className="flex items-center justify-between text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">Webhooks</a></li>
                        </ul>

                        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-black border border-white/5 text-center">
                            <Zap className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                            <h4 className="text-white text-sm font-bold mb-2">Need higher limits?</h4>
                            <p className="text-zinc-500 text-xs mb-4">Enterprise plans include dedicated API capacity.</p>
                            <button className="w-full text-xs font-bold bg-white text-black py-2 rounded-lg hover:bg-zinc-200">Contact Sales</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    
                    <section id="introduction" className="mb-24">
                        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Developer API</h1>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-10">
                            Build custom integrations, automate workspace creation, and programmatically export your infinite canvases using the Kidraw REST API.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                                <Terminal className="w-8 h-8 text-blue-400 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">RESTful Design</h3>
                                <p className="text-sm text-zinc-400">Predictable, resource-oriented URLs. Accepts form-encoded request bodies, returns JSON-encoded responses.</p>
                            </div>
                            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                                <Key className="w-8 h-8 text-amber-400 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">API Keys</h3>
                                <p className="text-sm text-zinc-400">Generate personal access tokens from your dashboard settings to authenticate requests securely.</p>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-white/5 mb-16"></div>

                    <section id="authentication" className="mb-24">
                        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Authentication</h2>
                        <p className="text-zinc-400 mb-8 max-w-2xl">
                            Authenticate your API requests by including your secret API key in the Authorization HTTP header. Never share your secret keys in publicly accessible areas such as GitHub or client-side code.
                        </p>
                        
                        <div className="rounded-2xl border border-white/10 bg-[#0c0c0e] overflow-hidden mb-8">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-950">
                                <span className="text-xs font-mono text-zinc-400">Example Request</span>
                                <button className="text-zinc-500 hover:text-white transition-colors"><Copy className="w-4 h-4"/></button>
                            </div>
                            <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                                <span className="text-pink-400">curl</span> <span className="text-blue-300">https://api.kidraw.com/v1/boards</span> \<br/>
                                <span className="text-zinc-500">  -H </span><span className="text-amber-300">&quot;Authorization: Bearer kd_live_xxx...&quot;</span>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-white/5 mb-16"></div>

                    <section id="boards" className="mb-24">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Create a Board</h2>
                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">POST</span>
                        </div>
                        <p className="text-zinc-400 mb-8 max-w-2xl">
                            Creates a new empty board workspace and returns its unique identifier. You can optionally pass an initial title.
                        </p>
                        
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Request params */}
                            <div>
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Parameters</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div>
                                            <span className="text-sm font-mono font-bold text-white block mb-1">title</span>
                                            <span className="text-xs text-zinc-500">string, optional</span>
                                        </div>
                                        <div className="text-sm text-zinc-400 text-right max-w-[200px]">The name of the new board. Defaults to &apos;Untitled&apos;.</div>
                                    </div>
                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div>
                                            <span className="text-sm font-mono font-bold text-white block mb-1">is_private</span>
                                            <span className="text-xs text-zinc-500">boolean, optional</span>
                                        </div>
                                        <div className="text-sm text-zinc-400 text-right max-w-[200px]">Whether the board is restricted to invited members only.</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Code block */}
                            <div className="rounded-2xl border border-white/10 bg-[#0c0c0e] overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/5 bg-zinc-950">
                                    <span className="text-xs font-mono text-zinc-400">Response</span>
                                </div>
                                <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                                    <span className="text-zinc-400">{`{`}</span><br/>
                                    <span className="text-blue-300">  &quot;id&quot;</span><span className="text-zinc-400">: </span><span className="text-amber-300">&quot;brd_8x29d10s&quot;</span>,<br/>
                                    <span className="text-blue-300">  &quot;title&quot;</span><span className="text-zinc-400">: </span><span className="text-amber-300">&quot;Q4 Roadmap&quot;</span>,<br/>
                                    <span className="text-blue-300">  &quot;created_at&quot;</span><span className="text-zinc-400">: </span><span className="text-amber-300">&quot;2024-10-24T12:00:00Z&quot;</span>,<br/>
                                    <span className="text-blue-300">  &quot;url&quot;</span><span className="text-zinc-400">: </span><span className="text-amber-300">&quot;https://kidraw.com/b/brd_8x29d10s&quot;</span><br/>
                                    <span className="text-zinc-400">{`}`}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
