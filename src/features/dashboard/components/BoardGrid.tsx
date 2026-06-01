'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DASHBOARD_INITIAL_BOARD_COUNT } from '@/shared/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BoardGrid({ boards }: { boards: any[] }) {
    const [showAll, setShowAll] = useState(false);

    const visibleBoards = showAll ? boards : boards.slice(0, DASHBOARD_INITIAL_BOARD_COUNT);

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleBoards.map((board, index) => {
                    // Cycle through some subtle accent colors for the hover gradients
                    const gradients = [
                        "from-violet-500/10",
                        "from-blue-500/10",
                        "from-emerald-500/10",
                        "from-fuchsia-500/10"
                    ];
                    const bgGradients = [
                        "group-hover:bg-violet-500/20",
                        "group-hover:bg-blue-500/20",
                        "group-hover:bg-emerald-500/20",
                        "group-hover:bg-fuchsia-500/20"
                    ];
                    const hoverGradient = gradients[index % gradients.length];
                    const hoverBg = bgGradients[index % bgGradients.length];

                    return (
                        <Link key={board.id} href={`/board/${board.id}`} className="group block h-full">
                            <div className="bg-zinc-900/40 rounded-3xl border border-white/5 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-1 backdrop-blur-sm relative">
                                
                                {/* Inner Gradient Reveal */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                
                                {/* Decorative Blob */}
                                <div className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-[40px] bg-transparent ${hoverBg} transition-colors duration-500`}></div>

                                <div className="p-8 flex-1 flex flex-col relative z-10">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6">
                                        <LayoutDashboard className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-white text-xl mb-2">{board.title}</h3>
                                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                                        {board.description || <span className="italic text-zinc-600">No description provided.</span>}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-8">
                                        <span className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">
                                            {new Date(board.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 group-hover:bg-white group-hover:border-white transition-all shadow-md">
                                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {boards.length > DASHBOARD_INITIAL_BOARD_COUNT && (
                <div className="mt-12 flex justify-center w-full">
                    <Button onClick={() => setShowAll(!showAll)} variant="outline" className="bg-transparent border-white/10 text-zinc-400 hover:bg-white hover:text-black hover:border-white rounded-full px-8 py-6 font-bold shadow-lg transition-all">
                        {showAll ? "Show Less" : `View All Workspaces (${boards.length})`}
                    </Button>
                </div>
            )}
        </div>
    );
}
