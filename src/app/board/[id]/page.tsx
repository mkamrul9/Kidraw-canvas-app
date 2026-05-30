'use client';

import dynamic from 'next/dynamic';
import Toolbar from '@/widgets/Toolbar';
import ActionToolbar from '@/widgets/ActionToolbar';
import PropertiesPanel from '@/widgets/PropertiesPanel';
import ZoomHUD from '@/widgets/ZoomHUD';
import NavigationHUD from '@/widgets/NavigationHUD';
import LibrarySidebar from '@/widgets/LibrarySidebar';
import { useEffect, use } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';

const Board = dynamic(() => import('@/features/canvas/components/Board'), {
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
      <NavigationHUD />
      <LibrarySidebar />
      <Toolbar />
      <ActionToolbar />
      <PropertiesPanel />
      <ZoomHUD />
    </main>
  );
}