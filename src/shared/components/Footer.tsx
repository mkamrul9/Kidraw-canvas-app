import Link from 'next/link';
import { Sparkles } from 'lucide-react';

/**
 * Shared footer component used by both the Landing Page and Dashboard.
 * Extracted from the monolithic page.tsx to enable reuse.
 */
export default function Footer() {
    return (
        <footer className="relative bg-black pt-20 pb-10 text-slate-300 z-10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-violet-600/20 blur-[80px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1.5 rounded-lg"><Sparkles className="w-5 h-5 text-white" /></div>
                        <span className="font-extrabold text-2xl text-white tracking-tight">Kidraw</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">The visual workspace for modern engineering teams. Map, wireframe, and collaborate in real-time on an infinite canvas.</p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6 tracking-wide">PRODUCT</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/info/features" className="hover:text-violet-400 transition-colors">Features</Link></li>
                        <li><Link href="/info/templates" className="hover:text-violet-400 transition-colors">Templates</Link></li>
                        <li><Link href="/info/integrations" className="hover:text-violet-400 transition-colors">Integrations</Link></li>
                        <li><Link href="/info/changelog" className="hover:text-violet-400 transition-colors">Changelog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6 tracking-wide">RESOURCES</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/info/help-center" className="hover:text-violet-400 transition-colors">Help Center</Link></li>
                        <li><Link href="/info/community" className="hover:text-violet-400 transition-colors">Community</Link></li>
                        <li><Link href="/info/blog" className="hover:text-violet-400 transition-colors">Blog</Link></li>
                        <li><Link href="/info/developers-api" className="hover:text-violet-400 transition-colors">Developers API</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6 tracking-wide">LEGAL</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/info/privacy-policy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/info/terms-of-service" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/info/cookie-policy" className="hover:text-violet-400 transition-colors">Cookie Policy</Link></li>
                        <li><Link href="/info/security" className="hover:text-violet-400 transition-colors">Security</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium">
                <p>© {new Date().getFullYear()} Kidraw Inc. All rights reserved.</p>
            </div>
        </footer>
    );
}
