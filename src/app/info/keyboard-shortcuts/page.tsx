'use client';

import { Keyboard } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";
import Footer from "@/shared/components/Footer";
import React from "react";

const SHORTCUT_CATEGORIES = [
    {
        title: "Tools & Shapes",
        shortcuts: [
            { action: "Select Tool", key: "V" },
            { action: "Hand Tool (Pan)", key: "H" },
            { action: "Lasso Select", key: "L" },
            { action: "Rectangle", key: "R" },
            { action: "Ellipse / Circle", key: "C" },
            { action: "Arrow", key: "A" },
            { action: "Pen (Draw)", key: "P" },
            { action: "Text", key: "T" },
            { action: "Sticky Note", key: "N" },
            { action: "Frame", key: "F" },
            { action: "Laser Pointer", key: "K" },
            { action: "Eraser", key: "E" },
            { action: "Object Eraser", keys: ["Shift", "E"] },
        ]
    },
    {
        title: "General Actions",
        shortcuts: [
            { action: "Undo", keys: ["Ctrl/Cmd", "Z"] },
            { action: "Redo", keys: ["Ctrl/Cmd", "Y"] },
            { action: "Redo (Alternative)", keys: ["Ctrl/Cmd", "Shift", "Z"] },
            { action: "Copy", keys: ["Ctrl/Cmd", "C"] },
            { action: "Paste", keys: ["Ctrl/Cmd", "V"] },
            { action: "Delete Selected", key: "Delete / Backspace" },
            { action: "Quick Menu", key: "/" },
        ]
    },
    {
        title: "Layers & Grouping",
        shortcuts: [
            { action: "Group Selection", keys: ["Ctrl/Cmd", "G"] },
            { action: "Ungroup Selection", keys: ["Ctrl/Cmd", "Shift", "G"] },
            { action: "Bring Forward", key: "]" },
            { action: "Send Backward", key: "[" },
            { action: "Bring to Front", keys: ["Shift", "]"] },
            { action: "Send to Back", keys: ["Shift", "["] },
        ]
    },
    {
        title: "Canvas Navigation",
        shortcuts: [
            { action: "Pan Canvas", key: "Space + Drag" },
            { action: "Zoom In/Out", key: "Ctrl/Cmd + Scroll" },
        ]
    }
];

export default function KeyboardShortcutsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-violet-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="max-w-5xl mx-auto p-6 md:p-12 relative z-10 min-h-[calc(100vh-64px)]">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <Keyboard className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Keyboard Shortcuts</h1>
                        <p className="text-muted-foreground text-lg mt-1">Master Kidraw and map at the speed of thought.</p>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {SHORTCUT_CATEGORIES.map((category, index) => (
                        <div key={index} className="bg-card border border-border rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                            <h2 className="text-xl font-bold mb-6 text-foreground">{category.title}</h2>
                            <div className="space-y-4">
                                {category.shortcuts.map((shortcut, sIndex) => (
                                    <div key={sIndex} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                        <span className="text-muted-foreground font-medium">{shortcut.action}</span>
                                        <div className="flex gap-1.5">
                                            {shortcut.key ? (
                                                <Kbd>{shortcut.key}</Kbd>
                                            ) : (
                                                shortcut.keys?.map((k, i) => (
                                                    <React.Fragment key={i}>
                                                        <Kbd>{k}</Kbd>
                                                        {i < shortcut.keys!.length - 1 && <span className="text-muted-foreground/50 self-center">+</span>}
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-muted border border-border border-b-2 rounded-md text-xs font-bold text-foreground shadow-sm">
            {children}
        </kbd>
    );
}
