import Link from "next/link";
import { ArrowLeft, Bell, Monitor, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 relative overflow-hidden">
            <nav className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-8 flex items-center">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
            </nav>

            <main className="max-w-4xl mx-auto p-8 py-12 relative z-10">
                <h1 className="text-3xl font-extrabold mb-8">System Settings</h1>
                <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4"><Monitor className="w-5 h-5 text-violet-400" /> <h3 className="text-lg font-bold">Preferences</h3></div>
                        <div className="flex items-center justify-between p-4 bg-[#06090F] rounded-lg border border-white/10">
                            <div><p className="font-bold">Theme Mode</p><p className="text-sm text-slate-400">Kidraw defaults to Dark Aurora.</p></div>
                            <div className="flex gap-2"><Button className="bg-violet-600 text-white">Dark</Button><Button variant="outline" className="bg-transparent border-white/20 text-slate-400">Light</Button></div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4"><Bell className="w-5 h-5 text-amber-400" /> <h3 className="text-lg font-bold">Notifications</h3></div>
                        <div className="flex items-center justify-between p-4 bg-[#06090F] rounded-lg border border-white/10 mb-2">
                            <div><p className="font-bold">Email Updates</p><p className="text-sm text-slate-400">Receive feature announcements.</p></div>
                            <input type="checkbox" className="w-5 h-5 accent-violet-500" defaultChecked />
                        </div>
                    </div>

                    <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4"><Lock className="w-5 h-5 text-red-400" /> <h3 className="text-lg font-bold text-red-400">Danger Zone</h3></div>
                        <p className="text-sm text-slate-400 mb-4">Permanently delete your account and all associated boards. This cannot be undone.</p>
                        <Button className="bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}