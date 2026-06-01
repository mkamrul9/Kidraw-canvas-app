import Link from "next/link";
import { Sparkles, PencilRuler, Users, FileCode2, History, Zap, Lock, Palette } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-violet-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-float-delayed"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="flex-1 max-w-6xl w-full mx-auto p-8 py-20 relative z-10">
                
                {/* Hero Section */}
                <div className="text-center mb-24 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 mb-8 shadow-sm">
                        <Sparkles className="w-4 h-4" /> Everything you need to create
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tighter">
                        Powerful Features for <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            Limitless Creativity
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                        Kidraw combines the freedom of an infinite canvas with the power of real-time collaboration, built for teams that move fast.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {[
                        { 
                            title: "Infinite Canvas", 
                            icon: <PencilRuler className="w-8 h-8 text-violet-400" />, 
                            desc: "Never run out of space. Pan and zoom infinitely across a hardware-accelerated drawing surface.",
                            bg: "from-violet-500/10 to-fuchsia-500/10"
                        },
                        { 
                            title: "Real-time Multiplayer", 
                            icon: <Users className="w-8 h-8 text-blue-400" />, 
                            desc: "Collaborate instantly with live cursors, selection indicators, and instant shape syncing via Socket.io.",
                            bg: "from-blue-500/10 to-cyan-500/10"
                        },
                        { 
                            title: "Code Export", 
                            icon: <FileCode2 className="w-8 h-8 text-emerald-400" />, 
                            desc: "Turn your wireframes and diagrams directly into React/Tailwind code or Mermaid.js syntax with one click.",
                            bg: "from-emerald-500/10 to-teal-500/10"
                        },
                        { 
                            title: "Time Travel", 
                            icon: <History className="w-8 h-8 text-amber-400" />, 
                            desc: "Made a mistake? Access complete version history and scrub through a timeline of every change ever made.",
                            bg: "from-amber-500/10 to-orange-500/10"
                        },
                        { 
                            title: "Laser Pointer", 
                            icon: <Zap className="w-8 h-8 text-rose-400" />, 
                            desc: "Guide your team's attention during presentations with a fading laser pointer tool.",
                            bg: "from-rose-500/10 to-pink-500/10"
                        },
                        { 
                            title: "Secure & Private", 
                            icon: <Lock className="w-8 h-8 text-muted-foreground" />, 
                            desc: "Enterprise-grade security. Control access with private boards, read-only links, and password protection.",
                            bg: "from-zinc-500/10 to-slate-500/10"
                        },
                        { 
                            title: "Smart Styling", 
                            icon: <Palette className="w-8 h-8 text-pink-400" />, 
                            desc: "Beautiful presets out of the box. Automatically snap arrows, align shapes, and apply premium gradients.",
                            bg: "from-pink-500/10 to-rose-500/10"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group relative rounded-[2rem] overflow-hidden border border-border bg-card backdrop-blur-sm transition-all hover:border-white/20 p-8 flex flex-col h-full">
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            <div className={`bg-gradient-to-br ${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-border group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed flex-1">{feature.desc}</p>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
