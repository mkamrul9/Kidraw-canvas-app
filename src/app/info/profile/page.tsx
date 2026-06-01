'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Shield, Key, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");

    const handleSave = () => {
        setIsEditing(false);
        toast.success("Profile updated!", { description: "Your changes have been saved successfully." });
    };

    const handleAvatarClick = () => {
        toast.info("Avatar managed by OAuth provider", { description: "Change your avatar on GitHub or Google to see it updated here." });
    };

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
                <h1 className="text-4xl font-bold mb-8 tracking-tight text-white">Personal Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Identity Column */}
                    <div className="col-span-1">
                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center backdrop-blur-sm shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none"></div>

                            <div className="relative group cursor-pointer mb-4" onClick={handleAvatarClick}>
                                <Avatar className="h-28 w-28 border-4 border-black shadow-2xl ring-2 ring-violet-500/30 group-hover:ring-violet-500 transition-all">
                                    <AvatarImage src={session?.user?.image || ""} />
                                    <AvatarFallback className="bg-zinc-800 text-violet-400 font-bold text-3xl">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{session?.user?.name}</h2>
                            <p className="text-violet-400 text-sm font-medium mb-6">Pro Member</p>
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                                <h3 className="text-xl font-bold">Account Details</h3>
                                <Button onClick={isEditing ? handleSave : () => setIsEditing(true)} className={isEditing ? "bg-white text-black hover:bg-zinc-200 rounded-xl shadow-lg font-bold" : "bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl"}>
                                    {isEditing ? "Save Changes" : "Edit Profile"}
                                </Button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2 mb-2"><User className="w-4 h-4 text-violet-400" /> Full Name</label>
                                    <input disabled={!isEditing} value={name} onChange={(e) => setName(e.target.value)} className={`w-full bg-zinc-950 rounded-xl p-4 text-white transition-all ${isEditing ? 'border border-violet-500 ring-1 ring-violet-500/30 focus:outline-none' : 'border border-white/5 opacity-70 cursor-not-allowed'}`} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-fuchsia-400" /> Email Address</label>
                                    <div className="relative">
                                        <input disabled value={session?.user?.email || ""} className="w-full bg-zinc-950 border border-white/5 rounded-xl p-4 text-zinc-400 cursor-not-allowed" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 uppercase bg-white/5 px-2 py-1 rounded">Locked</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/5 pb-4">Security Validation</h3>
                            <div className="flex justify-between items-center bg-zinc-950 border border-white/5 rounded-xl p-5">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-500/10 p-3 rounded-full border border-emerald-500/20"><Key className="w-6 h-6 text-emerald-400" /></div>
                                    <div><p className="font-bold text-white text-lg">OAuth Secured</p><p className="text-sm text-zinc-400">Authentication is managed externally by your provider.</p></div>
                                </div>
                                <Shield className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
