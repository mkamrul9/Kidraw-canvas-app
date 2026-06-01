import Link from "next/link";
import { ArrowLeft, Search, BookOpen, PenTool, Users, CreditCard, ChevronRight, MessageSquare, FileText } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-violet-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="flex-1 max-w-5xl w-full mx-auto p-8 py-20 relative z-10">
                
                {/* Hero Search Section */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-bold text-foreground mb-6 tracking-tight">How can we help?</h1>
                    <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                        Search for guides, tutorials, and frequently asked questions to get the most out of Kidraw.
                    </p>
                    
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <input 
                            type="text" 
                            className="w-full h-16 bg-card border border-border rounded-2xl pl-14 pr-6 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-2xl backdrop-blur-sm"
                            placeholder="Search for articles (e.g., 'export to svg', 'keyboard shortcuts')..."
                        />
                    </div>
                </div>

                {/* Category Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {[
                        { title: "Getting Started", icon: <BookOpen className="w-6 h-6 text-emerald-400" />, desc: "Learn the basics of infinite canvas creation." },
                        { title: "Drawing & Tools", icon: <PenTool className="w-6 h-6 text-violet-400" />, desc: "Master the pen, shapes, and text tools." },
                        { title: "Collaboration", icon: <Users className="w-6 h-6 text-blue-400" />, desc: "Invite team members and share boards." },
                        { title: "Billing & Plans", icon: <CreditCard className="w-6 h-6 text-amber-400" />, desc: "Manage your subscription and invoices." }
                    ].map((cat, i) => (
                        <div key={i} className="bg-card border border-border hover:border-white/20 hover:bg-card transition-all rounded-3xl p-6 group cursor-pointer backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                <ChevronRight className="w-5 h-5 text-white/40" />
                            </div>
                            <div className="bg-secondary/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-border">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{cat.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Popular Articles */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-foreground mb-8">Popular Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Essential keyboard shortcuts for faster drawing",
                            "How to export a specific frame to PNG/SVG",
                            "Inviting guest editors to a private board",
                            "Understanding the real-time cursor engine",
                            "Setting up single sign-on (SSO) for your team",
                            "Recovering deleted strokes and version history"
                        ].map((article, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/50 border border-border hover:bg-accent transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
                                    <span className="text-muted-foreground group-hover:text-foreground font-medium">{article}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-border rounded-3xl p-10 text-center relative overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                    <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                        <MessageSquare className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Still need help?</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Our support team is available 24/7 to help you with any technical issues or billing questions.
                    </p>
                    <button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-zinc-200 transition-colors shadow-xl">
                        Contact Support
                    </button>
                </div>

            </main>
        </div>
    );
}
