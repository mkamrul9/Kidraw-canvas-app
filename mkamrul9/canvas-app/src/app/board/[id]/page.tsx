'use client';

import dynamic from 'next/dynamic';
import { useEffect, use } from 'react';
import Toolbar from '../../../components/layout/Toolbar';
import PropertiesPanel from '../../../components/layout/PropertiesPanel';
import ZoomHUD from '../../../components/layout/ZoomHUD';
import { useCanvasStore } from '../../../store/useCanvasStore';


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
    <main className="h-screen w-screen overflow-hidden relative bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Board />
      <Toolbar />
      <ZoomHUD />
      <PropertiesPanel />
    </main>
  );
}