'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { 
  Sparkles, 
  LayoutDashboard, 
  Layers, 
  MousePointer2, 
  ArrowRight, 
  Shapes, 
  Type, 
  MessageSquare,
  CheckCircle2,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';
import Footer from '@/shared/components/Footer';
import GlobalNavbar from '@/shared/components/GlobalNavbar';

// ─── FADE IN ANIMATION COMPONENT ─────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: "50px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// ─── PROPS ───────────────────────────────────────────────────────────────────
interface LandingPageProps {
    isAuthenticated: boolean;
}

export default function LandingPage({ isAuthenticated }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col font-sans relative selection:bg-violet-500/30">
            


            {/* ─── BACKGROUND LAYERS ─── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Glowing Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-float-delayed"></div>
                
                {/* Masked Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
            </div>

            {/* ─── NAVBAR ─── */}
            <GlobalNavbar />

            {/* ─── HERO SECTION ─── */}
            <div className="relative pt-40 pb-20 flex-1 z-10 flex flex-col items-center">
                <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                    <FadeIn delay={0}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs font-semibold text-muted-foreground mb-8 backdrop-blur-sm shadow-xl">
                            <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Kidraw v2.0 is now live
                        </div>
                    </FadeIn>
                    
                    <FadeIn delay={100}>
                        <h1 className="text-6xl md:text-[90px] font-bold tracking-tighter mb-8 leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-foreground/60">
                            Where engineering teams <br className="hidden md:block" />
                            think out loud.
                        </h1>
                    </FadeIn>
                    
                    <FadeIn delay={200}>
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            The ultimate visual workspace. Map complex architectures, wireframe user flows, and collaborate in real-time on an infinite, blazing-fast canvas.
                        </p>
                    </FadeIn>
                    
                    <FadeIn delay={300}>
                        <div className="flex justify-center mb-24">
                            <Link href={isAuthenticated ? "/" : "/api/auth/signin"}>
                                <Button size="lg" className="bg-violet-600 text-white hover:bg-violet-500 text-base px-8 py-6 rounded-full shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-all hover:-translate-y-1 font-semibold border border-violet-400/30">
                                    Start drawing for free <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </FadeIn>

                    {/* HERO ABSTRACT GRAPHIC */}
                    <FadeIn delay={400} className="w-full">
                        <div className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[500px] [perspective:1000px]">
                            <div className="absolute inset-0 rounded-2xl bg-card/80 border border-border backdrop-blur-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                                {/* Inner Grid */}
                                <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]"></div>

                                {/* Center Node */}
                                <div className="absolute w-40 h-24 bg-secondary/50 border border-border rounded-xl backdrop-blur-md shadow-2xl flex flex-col items-center justify-center z-20">
                                    <Globe className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="font-semibold text-foreground tracking-tight text-sm">API Gateway</span>
                                </div>

                                {/* Left Node */}
                                <div className="absolute -translate-x-56 translate-y-12 w-32 h-32 bg-violet-500/10 border border-violet-500/20 rounded-full backdrop-blur-md shadow-2xl flex flex-col items-center justify-center z-10">
                                    <Cpu className="w-6 h-6 text-violet-300 mb-2" />
                                    <span className="font-semibold text-violet-200 text-sm">Client App</span>
                                </div>

                                {/* Right Node */}
                                <div className="absolute translate-x-56 -translate-y-16 w-36 h-28 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-md shadow-2xl flex flex-col items-center justify-center z-10">
                                    <Layers className="w-6 h-6 text-emerald-300 mb-2" />
                                    <span className="font-semibold text-emerald-200 text-sm">PostgreSQL</span>
                                </div>

                                {/* Connecting Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                                    <path d="M 330 250 L 420 250" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" className="animate-pulse text-border" />
                                    <path d="M 540 250 L 610 200" stroke="currentColor" strokeWidth="2" fill="none" className="text-border" />
                                </svg>

                                {/* Collaborator Cursor 1 */}
                                <div className="absolute translate-x-12 translate-y-24 z-30 animate-bounce" style={{ animationDuration: '3s' }}>
                                    <MousePointer2 className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500 -rotate-12" />
                                    <div className="bg-fuchsia-500 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ml-3 shadow-lg">Sarah</div>
                                </div>

                                {/* Collaborator Cursor 2 */}
                                <div className="absolute -translate-x-32 -translate-y-20 z-30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                    <MousePointer2 className="w-5 h-5 text-sky-500 fill-sky-500 -rotate-12" />
                                    <div className="bg-sky-500 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ml-3 shadow-lg">Alex</div>
                                </div>

                                {/* Floating Toolbar */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card backdrop-blur-xl border border-border rounded-full p-2 flex gap-2 shadow-2xl z-40">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"><MousePointer2 className="w-4 h-4 text-foreground" /></div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"><Shapes className="w-4 h-4 text-muted-foreground" /></div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"><Type className="w-4 h-4 text-muted-foreground" /></div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"><MessageSquare className="w-4 h-4 text-muted-foreground" /></div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>


            {/* ─── BENTO GRID FEATURES ─── */}
            <div id="features" className="relative z-10 py-32 max-w-6xl mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Everything you need to build.</h2>
                        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">A powerful toolkit designed for modern engineering teams to move fast without breaking things.</p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    <FadeIn delay={100} className="md:col-span-2 bg-card border border-border rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 bg-secondary/50 border border-border rounded-xl flex items-center justify-center"><Globe className="w-5 h-5 text-violet-400" /></div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Real-time Multiplayer</h3>
                                <p className="text-muted-foreground max-w-sm">Collaborate instantly with zero latency. See cursors move, shapes drawn, and ideas form in real-time across the globe.</p>
                            </div>
                        </div>
                        {/* Decorative Graphic */}
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-violet-500/10 rounded-full blur-[50px] group-hover:bg-violet-500/20 transition-colors"></div>
                    </FadeIn>

                    <FadeIn delay={200} className="md:col-span-1 bg-card border border-border rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 bg-secondary/50 border border-border rounded-xl flex items-center justify-center"><Shapes className="w-5 h-5 text-fuchsia-400" /></div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Smart Geometry</h3>
                                <p className="text-muted-foreground text-sm">Auto-snapping shapes and orthogonal routing.</p>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={300} className="md:col-span-1 bg-card border border-border rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 bg-secondary/50 border border-border rounded-xl flex items-center justify-center"><Lock className="w-5 h-5 text-emerald-400" /></div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                                <p className="text-muted-foreground text-sm">Role-based access control and end-to-end encryption.</p>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={400} className="md:col-span-2 bg-card border border-border rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 bg-secondary/50 border border-border rounded-xl flex items-center justify-center"><LayoutDashboard className="w-5 h-5 text-blue-400" /></div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Infinite Canvas</h3>
                                <p className="text-muted-foreground max-w-sm">Never run out of space. Our hardware-accelerated WebGL engine can handle thousands of layers without dropping a frame.</p>
                            </div>
                        </div>
                        <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-colors"></div>
                    </FadeIn>
                </div>
            </div>

            {/* ─── PRICING SECTION ─── */}
            <div id="pricing" className="relative z-10 py-32 bg-card/50 border-y border-border">
                <div className="max-w-6xl mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing.</h2>
                            <p className="text-muted-foreground text-lg font-medium">Start for free, upgrade when you need more power.</p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <FadeIn delay={100}>
                            <div className="bg-card border border-border rounded-3xl p-8 backdrop-blur-sm h-full flex flex-col">
                                <h3 className="text-xl font-bold text-foreground mb-2">Starter</h3>
                                <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-muted-foreground font-medium">/mo</span></div>
                                <p className="text-muted-foreground text-sm mb-8">Perfect for individuals and small projects.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Up to 3 Boards</li>
                                    <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Basic Shapes</li>
                                    <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> 2 Collaborators</li>
                                </ul>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-foreground rounded-full">Get Started</Button>
                            </div>
                        </FadeIn>

                        {/* Pro Tier */}
                        <FadeIn delay={200}>
                            <div className="bg-card border border-violet-500/50 rounded-3xl p-8 backdrop-blur-sm h-full flex flex-col relative shadow-[0_0_30px_rgba(124,58,237,0.1)] scale-105">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-foreground text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Pro</h3>
                                <div className="text-4xl font-bold mb-6">$12<span className="text-lg text-muted-foreground font-medium">/mo</span></div>
                                <p className="text-muted-foreground text-sm mb-8">For professional teams shipping fast.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center text-sm text-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Unlimited Boards</li>
                                    <li className="flex items-center text-sm text-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Advanced Architecture Tools</li>
                                    <li className="flex items-center text-sm text-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Unlimited Collaborators</li>
                                    <li className="flex items-center text-sm text-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> PDF & Image Export</li>
                                </ul>
                                <Button className="w-full bg-violet-600 hover:bg-violet-500 text-foreground rounded-full font-bold">Start Free Trial</Button>
                            </div>
                        </FadeIn>

                        {/* Enterprise Tier */}
                        <FadeIn delay={300}>
                            <div className="bg-card border border-border rounded-3xl p-8 backdrop-blur-sm h-full flex flex-col">
                                <h3 className="text-xl font-bold text-foreground mb-2">Enterprise</h3>
                                <div className="text-4xl font-bold mb-6">Custom</div>
                                <p className="text-muted-foreground text-sm mb-8">For large organizations with strict security.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Everything in Pro</li>
                                    <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> SSO & SAML</li>
                                    <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Audit Logs</li>
                                    <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 mr-3 text-violet-400"/> Dedicated Support</li>
                                </ul>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-foreground rounded-full">Contact Sales</Button>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>

            {/* ─── WALL OF LOVE ─── */}
            <div id="testimonials" className="relative z-10 py-32 max-w-6xl mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Wall of Love</h2>
                        <p className="text-muted-foreground text-lg font-medium">Don&apos;t just take our word for it.</p>
                    </div>
                </FadeIn>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FadeIn delay={100}>
                        <div className="bg-white/[0.02] border border-border p-10 rounded-3xl hover:bg-white/[0.04] transition-colors">
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed italic">&quot;Kidraw replaced three different tools in our stack. The infinite canvas and smart routing allowed us to map our microservices in half the time.&quot;</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-foreground font-bold">AL</div>
                                <div>
                                    <p className="font-bold text-foreground text-sm">Alex Larson</p>
                                    <p className="text-muted-foreground text-xs font-medium">Engineering Lead @ TechCorp</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={200}>
                        <div className="bg-white/[0.02] border border-border p-10 rounded-3xl hover:bg-white/[0.04] transition-colors">
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed italic">&quot;The real-time collaboration is flawless. We use it for remote sprint planning and architectural reviews. It feels like we are all in the same room.&quot;</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-foreground font-bold">SM</div>
                                <div>
                                    <p className="font-bold text-foreground text-sm">Sarah Mitchell</p>
                                    <p className="text-muted-foreground text-xs font-medium">Product Manager @ StartupInc</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* ─── PRE-FOOTER CTA ─── */}
            <div className="relative z-10 py-32 border-t border-border bg-gradient-to-b from-transparent to-violet-900/10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <FadeIn>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-foreground">Ready to start building?</h2>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Join thousands of engineers who are visualizing their architecture faster than ever before.</p>
                        <Link href={isAuthenticated ? "/" : "/api/auth/signin"}>
                            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-base px-10 py-7 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105 font-bold">
                                Get Started for Free
                            </Button>
                        </Link>
                    </FadeIn>
                </div>
            </div>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
