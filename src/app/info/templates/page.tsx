import { ArrowLeft, LayoutTemplate, Search, Hexagon, Component, Workflow, Database } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-fuchsia-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[150px] rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full animate-float-delayed"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 py-20 relative z-10">
                
                {/* Hero Section */}
                <div className="text-center mb-20 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs font-bold text-fuchsia-400 mb-8 shadow-sm">
                        <LayoutTemplate className="w-4 h-4" /> 50+ Professionally Designed Templates
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tighter">
                        Don&apos;t start from <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">scratch.</span>
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        Jumpstart your next brainstorming session, architecture review, or sprint planning with our curated library of canvas templates.
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-fuchsia-400 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search templates (e.g., 'Wireframe', 'AWS Architecture')..." 
                            className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 backdrop-blur-sm transition-all"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {['All Templates', 'Wireframes', 'Architecture', 'Mind Maps', 'Agile / Scrum', 'User Journeys'].map((category, i) => (
                        <button key={i} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                            {category}
                        </button>
                    ))}
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[
                        { title: "SaaS Dashboard Wireframe", cat: "Wireframes", icon: <Component className="w-10 h-10"/>, bg: "from-blue-500/20 to-indigo-500/20" },
                        { title: "AWS Cloud Architecture", cat: "Architecture", icon: <Database className="w-10 h-10"/>, bg: "from-orange-500/20 to-amber-500/20" },
                        { title: "Product Launch Mind Map", cat: "Mind Maps", icon: <Hexagon className="w-10 h-10"/>, bg: "from-fuchsia-500/20 to-pink-500/20" },
                        { title: "User Journey Map", cat: "User Journeys", icon: <Workflow className="w-10 h-10"/>, bg: "from-emerald-500/20 to-teal-500/20" },
                        { title: "Mobile App Flow", cat: "Wireframes", icon: <Component className="w-10 h-10"/>, bg: "from-cyan-500/20 to-blue-500/20" },
                        { title: "Microservices Diagram", cat: "Architecture", icon: <Database className="w-10 h-10"/>, bg: "from-rose-500/20 to-orange-500/20" },
                        { title: "Sprint Retrospective", cat: "Agile / Scrum", icon: <LayoutTemplate className="w-10 h-10"/>, bg: "from-violet-500/20 to-purple-500/20" },
                        { title: "Marketing Campaign Flow", cat: "Mind Maps", icon: <Hexagon className="w-10 h-10"/>, bg: "from-yellow-500/20 to-amber-500/20" },
                    ].map((template, i) => (
                        <div key={i} className="group cursor-pointer rounded-3xl border border-border bg-card backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all flex flex-col">
                            {/* Mockup Preview Area */}
                            <div className={`h-40 w-full bg-gradient-to-br ${template.bg} relative flex items-center justify-center overflow-hidden`}>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                <div className="text-white/30 group-hover:scale-110 group-hover:text-foreground/50 transition-all duration-500">
                                    {template.icon}
                                </div>
                                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-xl">Use Template</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-2">{template.cat}</div>
                                <h3 className="text-lg font-bold text-foreground group-hover:text-fuchsia-300 transition-colors">{template.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
