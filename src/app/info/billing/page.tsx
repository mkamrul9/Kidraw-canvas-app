'use client';

import { ArrowRight, CreditCard, CheckCircle2, Shield, Download, FileText, Zap } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";
import { Button } from "@/shared/components/ui/button";
import Footer from "@/shared/components/Footer";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog";

const INVOICES = [
    { id: "INV-2026-05", date: "May 1, 2026", amount: "$0.00", status: "Paid", plan: "Free Builder" },
    { id: "INV-2026-04", date: "Apr 1, 2026", amount: "$0.00", status: "Paid", plan: "Free Builder" },
    { id: "INV-2026-03", date: "Mar 1, 2026", amount: "$0.00", status: "Paid", plan: "Free Builder" },
];

export default function BillingPage() {
    const [isPending, startTransition] = useTransition();
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [isYearly, setIsYearly] = useState(true);

    const handleUpgrade = () => {
        startTransition(() => {
            // Mock a network request for the upgrade checkout flow
            setTimeout(() => {
                toast.success("Redirecting to checkout...", { description: "Opening secure Stripe payment portal." });
                setUpgradeOpen(false);
            }, 1500);
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-violet-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="max-w-5xl mx-auto p-6 md:p-12 relative z-10 min-h-[calc(100vh-64px)]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Billing & Plans</h1>
                        <p className="text-muted-foreground text-lg">Manage your subscription, payment methods, and invoices.</p>
                    </div>
                    
                    <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold h-11 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all hover:scale-105 shrink-0">
                                <Zap className="w-4 h-4 mr-2" /> Upgrade to Pro
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border border-border sm:max-w-xl shadow-2xl rounded-3xl p-0 overflow-hidden">
                            <div className="p-8">
                                <DialogHeader className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <DialogTitle className="text-2xl font-bold">Upgrade to Pro</DialogTitle>
                                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
                                    </div>
                                    <DialogDescription className="text-muted-foreground text-base">Supercharge your team's workflow with infinite history, custom templates, and priority support.</DialogDescription>
                                </DialogHeader>
                                
                                <div className="bg-muted/50 rounded-2xl p-6 border border-border mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setIsYearly(false)} className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${!isYearly ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Monthly</button>
                                            <button onClick={() => setIsYearly(true)} className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${isYearly ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Yearly <span className="text-emerald-500 text-xs ml-1">-20%</span></button>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-bold">${isYearly ? '12' : '15'}</span>
                                            <span className="text-muted-foreground">/mo</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-3">
                                        {['Unlimited Cloud Workspaces', 'Version History (30 Days)', 'Custom Component Libraries', 'Advanced Export Formats (PDF/SVG)'].map((feature, i) => (
                                            <li key={i} className="flex items-center text-sm font-medium text-foreground">
                                                <CheckCircle2 className="w-4 h-4 mr-3 text-primary" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button 
                                    onClick={handleUpgrade} 
                                    disabled={isPending}
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold shadow-lg text-base"
                                >
                                    {isPending ? "Connecting to Stripe..." : "Continue to Payment"} <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                            <div className="bg-muted/50 p-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                                <Shield className="w-4 h-4" /> Secure payment processing by Stripe
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Current Plan Card */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center bg-secondary/80 text-foreground text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-border">
                                CURRENT PLAN
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-foreground">Free Builder <span className="text-lg text-muted-foreground font-medium ml-2 font-mono">($0/mo)</span></h2>
                            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">You are currently on the free tier. Enjoy unlimited boards, standard shapes, and real-time collaboration forever.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-muted-foreground font-medium bg-muted/30 p-3 rounded-xl border border-border"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 3 Active Workspaces</div>
                                <div className="flex items-center gap-3 text-muted-foreground font-medium bg-muted/30 p-3 rounded-xl border border-border"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Standard PNG Export</div>
                                <div className="flex items-center gap-3 text-muted-foreground font-medium bg-muted/30 p-3 rounded-xl border border-border"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Real-time Sync</div>
                                <div className="flex items-center gap-3 text-muted-foreground font-medium bg-muted/30 p-3 rounded-xl border border-border"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Laser Presentation</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm flex flex-col">
                        <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Method</h3>
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
                                <CreditCard className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium mb-6">No payment methods attached. Your current plan is 100% free.</p>
                            <Button variant="outline" className="w-full bg-background border-border text-foreground hover:bg-accent rounded-xl font-bold shadow-sm">
                                Add Card
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-card border border-border rounded-3xl shadow-xl backdrop-blur-sm overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Billing History</h3>
                            <p className="text-muted-foreground text-sm mt-1">View and download your past invoices.</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                    <th className="p-4 pl-6 md:pl-8 font-semibold">Invoice</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold">Amount</th>
                                    <th className="p-4 font-semibold">Plan</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 pr-6 md:pr-8 font-semibold text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {INVOICES.map((inv, idx) => (
                                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="p-4 pl-6 md:pl-8 font-medium text-foreground">{inv.id}</td>
                                        <td className="p-4 text-muted-foreground">{inv.date}</td>
                                        <td className="p-4 font-mono font-medium text-foreground">{inv.amount}</td>
                                        <td className="p-4 text-muted-foreground">{inv.plan}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 md:pr-8 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
