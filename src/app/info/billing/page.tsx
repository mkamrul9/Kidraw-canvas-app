import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function BillingPage() {
    return (
        <div className="min-h-screen bg-black text-slate-50 relative overflow-hidden font-sans selection:bg-violet-500/30">


            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <nav className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl px-8 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
            </nav>

            <main className="max-w-4xl mx-auto p-8 py-12 relative z-10">
                <h1 className="text-4xl font-bold mb-8 tracking-tight text-white">Billing & Subscription</h1>

                <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 mb-8 relative overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none"></div>
                    <div className="absolute top-0 right-0 p-8"><CreditCard className="w-24 h-24 text-white/5" /></div>
                    <div className="relative z-10">
                        <div className="inline-block bg-white text-black text-xs font-bold px-3 py-1 rounded-full mb-4">CURRENT PLAN</div>
                        <h2 className="text-4xl font-bold mb-2 text-white">Kidraw Pro <span className="text-xl text-zinc-400 font-medium ml-2">Lifetime Access</span></h2>
                        <p className="text-zinc-400 max-w-md mb-8">You are currently on the free builder tier. Enjoy unlimited boards, all shapes, and real-time collaboration forever.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Infinite Canvas</div>
                            <div className="flex items-center gap-2 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Advanced Export (SVG/PNG)</div>
                            <div className="flex items-center gap-2 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Real-time Cloud Sync</div>
                            <div className="flex items-center gap-2 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Laser Presentation Tool</div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white">Payment Methods</h3>
                    <p className="text-zinc-400 text-sm mb-6">No payment methods are attached to your account because your current plan is 100% free.</p>
                    <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl font-bold">Add Payment Method</Button>
                </div>
            </main>
        </div>
    );
}
