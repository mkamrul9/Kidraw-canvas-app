import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, User, LayoutGrid, Cpu, PenTool } from "lucide-react";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-black text-slate-50 relative overflow-hidden font-sans selection:bg-amber-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 blur-[150px] rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full animate-float-delayed"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <nav className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl px-8 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 py-20 relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-400 mb-6 shadow-sm">
                            <PenTool className="w-3 h-3" /> The Kidraw Blog
                        </div>
                        <h1 className="text-5xl font-bold text-white tracking-tight">Updates & Insights</h1>
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Engineering', 'Product', 'Design'].map((tag, i) => (
                            <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Post */}
                <div className="group cursor-pointer mb-20 relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/50 backdrop-blur-sm transition-all hover:border-white/30 flex flex-col md:flex-row min-h-[400px]">
                    <div className="w-full md:w-1/2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 relative overflow-hidden flex items-center justify-center p-12">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <LayoutGrid className="w-32 h-32 text-white/20 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Product Update</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1"><Calendar className="w-3 h-3"/> Oct 24, 2024</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6 group-hover:text-amber-400 transition-colors">
                            Introducing the New Premium Bento Dashboard
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-8 line-clamp-3">
                            We&apos;ve completely overhauled the Kidraw interface. Learn how our design team moved from a complex sidebar layout to a beautifully simple, pure black bento grid aesthetic.
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 border-2 border-black"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Alex Designer</p>
                                    <p className="text-xs text-zinc-500">Head of Design</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {[
                        { tag: "Engineering", title: "Building a conflict-free real-time engine with CRDTs", desc: "A deep dive into how we prevent strokes from overriding each other when 50 people draw at once.", icon: <Cpu className="w-12 h-12 text-white/20"/>, bg: "from-blue-500/20 to-cyan-500/20" },
                        { tag: "Design", title: "Why we chose pure black over dark grey", desc: "The psychology and aesthetic reasoning behind Kidraw's high-contrast dark mode.", icon: <PenTool className="w-12 h-12 text-white/20"/>, bg: "from-fuchsia-500/20 to-pink-500/20" },
                        { tag: "Product", title: "Templates are here: Mind maps to architecture", desc: "Don't start from scratch. Use one of our 50+ new professionally designed canvas templates.", icon: <LayoutGrid className="w-12 h-12 text-white/20"/>, bg: "from-emerald-500/20 to-teal-500/20" },
                    ].map((post, i) => (
                        <div key={i} className="group cursor-pointer rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-sm overflow-hidden hover:border-white/30 transition-all flex flex-col">
                            <div className={`h-48 w-full bg-gradient-to-br ${post.bg} relative flex items-center justify-center overflow-hidden`}>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                <div className="group-hover:scale-110 transition-transform duration-500">{post.icon}</div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{post.tag}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                    <span className="text-xs text-zinc-500">5 min read</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">{post.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">{post.desc}</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-500 flex items-center gap-1"><User className="w-3 h-3"/> Eng Team</span>
                                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-12 text-center max-w-3xl mx-auto backdrop-blur-sm shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                    <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Subscribe to our newsletter</h2>
                    <p className="text-zinc-400 mb-8 relative z-10">Get the latest product updates and engineering deep-dives straight to your inbox. No spam, ever.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
                        <input type="email" placeholder="Email address..." className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                        <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors">Subscribe</button>
                    </div>
                </div>

            </main>
        </div>
    );
}
