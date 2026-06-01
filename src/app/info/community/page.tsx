import Link from "next/link";
import { ArrowLeft, MessageCircle, Heart, Share2, Users, Disc, ExternalLink, Hexagon } from "lucide-react";

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-black text-slate-50 relative overflow-hidden font-sans selection:bg-emerald-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-float-delayed"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <nav className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl px-8 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
            </nav>

            <main className="flex-1 max-w-6xl w-full mx-auto p-8 py-20 relative z-10">
                
                {/* Hero Section */}
                <div className="text-center mb-24 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 mb-8 shadow-sm">
                        <Users className="w-4 h-4" /> 100,000+ Creators Worldwide
                    </div>
                    <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tighter">
                        Create together. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Build the future.
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join our vibrant community of designers, engineers, and product managers. Share templates, get feedback, and shape the future of Kidraw.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-2">
                            <Disc className="w-5 h-5" /> Join the Discord
                        </button>
                        <button className="bg-zinc-900 border border-white/10 text-white font-bold px-8 py-4 rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2">
                            View Forum <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Showcase Masonry Grid Mockup */}
                <div className="mb-24">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Community Showcase</h2>
                            <p className="text-zinc-400">Incredible boards built by teams using Kidraw.</p>
                        </div>
                        <button className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 text-sm">
                            Submit yours <ArrowLeft className="w-4 h-4 rotate-180" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "SaaS Architecture Diagram", author: "@dev_sarah", likes: 342, height: "h-[300px]", gradient: "from-blue-500/20 to-purple-500/20" },
                            { title: "Mobile App Wireframes", author: "@ui_max", likes: 891, height: "h-[400px]", gradient: "from-pink-500/20 to-rose-500/20" },
                            { title: "Q3 Marketing Mindmap", author: "@growth_team", likes: 124, height: "h-[250px]", gradient: "from-amber-500/20 to-orange-500/20" },
                            { title: "Database Schema", author: "@backend_bob", likes: 456, height: "h-[350px]", gradient: "from-emerald-500/20 to-teal-500/20" },
                            { title: "User Journey Flow", author: "@design_jane", likes: 672, height: "h-[280px]", gradient: "from-indigo-500/20 to-cyan-500/20" },
                            { title: "Product Roadmap 2025", author: "@pm_alex", likes: 531, height: "h-[320px]", gradient: "from-fuchsia-500/20 to-purple-500/20" },
                        ].map((item, i) => (
                            <div key={i} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 transition-all hover:border-white/30 cursor-pointer">
                                {/* Placeholder Image Area */}
                                <div className={`w-full ${item.height} bg-gradient-to-br ${item.gradient} flex items-center justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                    <Hexagon className="w-16 h-16 text-white/20 absolute group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                                </div>
                                
                                {/* Overlay / Footer */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <h3 className="font-bold text-white mb-1 truncate">{item.title}</h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">{item.author}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-zinc-300"><Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> {item.likes}</span>
                                            <Share2 className="w-4 h-4 text-zinc-400 hover:text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-10 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold text-white mb-4">Community Townhall</h2>
                            <p className="text-zinc-400 mb-6">
                                Join our monthly livestream where the founders demo new features, answer your questions, and showcase the best community boards.
                            </p>
                            <div className="flex items-center gap-4 text-sm font-medium">
                                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md">Next: June 15th, 10am PT</span>
                                <span className="text-zinc-500 flex items-center gap-1"><MessageCircle className="w-4 h-4"/> YouTube Live</span>
                            </div>
                        </div>
                        <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors whitespace-nowrap">
                            Add to Calendar
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
