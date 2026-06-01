import { ArrowLeft, Rocket, Wrench, Sparkles, Bug, ArrowUpRight, Code, MessageCircle, PenTool, LayoutGrid, Blocks, Calendar, ArrowRight, Zap } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-rose-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[30%] left-[40%] w-[600px] h-[600px] bg-rose-600/10 blur-[150px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="flex-1 max-w-6xl w-full mx-auto p-8 py-20 relative z-10">
                
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 mb-6 shadow-sm">
                            <Blocks className="w-4 h-4" /> Seamless Workflow
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tighter">
                            Connect Kidraw to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">favorite tools.</span>
                        </h1>
                        <p className="text-muted-foreground text-xl leading-relaxed mb-8 max-w-lg">
                            Sync issues, embed boards in your documents, and receive real-time notifications where your team already works.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                                Browse Directory
                            </button>
                            <button className="bg-card border border-border text-foreground font-bold px-6 py-3 rounded-xl hover:bg-accent transition-colors flex items-center gap-2">
                                Build an Integration <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Hero Graphic */}
                    <div className="flex-1 relative hidden lg:block">
                        <div className="w-80 h-80 mx-auto relative">
                            <div className="absolute inset-0 border border-border rounded-full animate-spin-slow"></div>
                            <div className="absolute inset-4 border border-border rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                            
                            {/* Center Logo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center shadow-2xl z-20">
                                <Zap className="w-10 h-10 text-rose-500 fill-rose-500" />
                            </div>

                            {/* Orbiting Icons */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-card border border-border rounded-full flex items-center justify-center z-10 shadow-lg">
                                <Code className="w-6 h-6 text-foreground" />
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 bg-card border border-border rounded-full flex items-center justify-center z-10 shadow-lg">
                                <MessageCircle className="w-6 h-6 text-[#E01E5A]" />
                            </div>
                            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-card border border-border rounded-full flex items-center justify-center z-10 shadow-lg">
                                <PenTool className="w-6 h-6 text-[#0ACF83]" />
                            </div>
                            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-card border border-border rounded-full flex items-center justify-center z-10 shadow-lg">
                                <LayoutGrid className="w-6 h-6 text-[#0052CC]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Integrations List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Popular Integrations</h2>
                    
                    {[
                        { name: "GitHub", desc: "Embed live architecture boards directly into pull requests and issues.", icon: <Code className="w-8 h-8 text-foreground"/>, tag: "Engineering", color: "text-muted-foreground" },
                        { name: "Slack", desc: "Get notifications when team members comment on or update your boards.", icon: <MessageCircle className="w-8 h-8 text-[#E01E5A]"/>, tag: "Communication", color: "text-rose-400" },
                        { name: "Figma", desc: "Import Figma frames into Kidraw to annotate and brainstorm over designs.", icon: <PenTool className="w-8 h-8 text-[#0ACF83]"/>, tag: "Design", color: "text-emerald-400" },
                        { name: "Jira / Trello", desc: "Turn sticky notes into actionable tickets with two-way sync.", icon: <LayoutGrid className="w-8 h-8 text-[#0052CC]"/>, tag: "Productivity", color: "text-blue-400" },
                        { name: "Google Calendar", desc: "Automatically attach an empty brainstorming board to your upcoming meetings.", icon: <Calendar className="w-8 h-8 text-[#4285F4]"/>, tag: "Productivity", color: "text-indigo-400" },
                    ].map((integration, i) => (
                        <div key={i} className="group p-6 rounded-2xl border border-border bg-card backdrop-blur-sm hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-xl bg-background border border-border flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                    {integration.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-foreground">{integration.name}</h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-background ${integration.color}`}>
                                            {integration.tag}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{integration.desc}</p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto px-6 py-2 rounded-lg bg-secondary/50 text-foreground font-medium border border-border hover:bg-accent transition-colors shrink-0">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
