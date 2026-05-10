'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Board component and strictly disable SSR
const Board = dynamic(() => import('../components/canvas/Board'), {
  ssr: false,
  loading: () => <div className="h-screen w-screen flex items-center justify-center bg-slate-50">Loading canvas...</div>
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden relative">

      <Board />
    </main>
  );
}