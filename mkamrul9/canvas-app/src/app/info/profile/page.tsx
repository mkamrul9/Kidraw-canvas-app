import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import Link from "next/link";
import { ArrowLeft, User, Mail, Shield, Key } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-violet-600/10 blur-[150px] pointer-events-none"></div>

            <nav className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-8 flex items-center">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
            </nav>

            <main className="max-w-4xl mx-auto p-8 py-12 relative z-10">
                <h1 className="text-3xl font-extrabold mb-8">Personal Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-1">
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm">
                            <Avatar className="h-24 w-24 border-4 border-violet-500/30 shadow-2xl mb-4">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback className="bg-slate-800 text-violet-400 font-bold text-2xl">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold text-white">{session?.user?.name}</h2>
                            <p className="text-slate-400 text-sm mb-4">Engineering Lead</p>
                            <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10">Edit Avatar</Button>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Account Details</h3>
                            <div className="space-y-4">
                                <div><label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1"><User className="w-4 h-4" /> Full Name</label><input disabled value={session?.user?.name || ""} className="w-full bg-[#06090F] border border-white/10 rounded-lg p-3 text-white opacity-70" /></div>
                                <div><label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1"><Mail className="w-4 h-4" /> Email Address</label><input disabled value={session?.user?.email || ""} className="w-full bg-[#06090F] border border-white/10 rounded-lg p-3 text-white opacity-70" /></div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Security</h3>
                            <div className="flex justify-between items-center bg-[#06090F] border border-white/10 rounded-lg p-4">
                                <div className="flex items-center gap-3"><Key className="w-5 h-5 text-amber-400" /><div><p className="font-bold">OAuth Connected</p><p className="text-xs text-slate-400">Managed via Github/Google</p></div></div>
                                <Button variant="outline" disabled className="bg-white/5 border-white/10 opacity-50">Locked</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}