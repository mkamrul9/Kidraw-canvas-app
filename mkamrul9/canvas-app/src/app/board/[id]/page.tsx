'use client';

import dynamic from 'next/dynamic';
import { useEffect, use } from 'react';
import Toolbar from '../../../components/layout/Toolbar';
import PropertiesPanel from '../../../components/layout/PropertiesPanel';
import { useCanvasStore } from '../../../store/useCanvasStore';

// Fix paths (added an extra '../' because we are one folder deeper)
const Board = dynamic(() => import('../../../components/canvas/Board'), {
  ssr: false,
  loading: () => <div className="h-screen w-screen flex items-center justify-center bg-slate-50">Loading canvas...</div>
});

export default function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const boardId = resolvedParams.id;

  const { loadFromCloud, setBoardId } = useCanvasStore();

  useEffect(() => {
    if (boardId) {
      setBoardId(boardId);
      loadFromCloud(boardId);
    }
  }, [boardId, loadFromCloud, setBoardId]);

  return (
    <main className="h-screen w-screen overflow-hidden relative bg-slate-50">
      <Board />
      <Toolbar />
      <PropertiesPanel />
    </main>
  );
}