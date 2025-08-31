'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore, useCurrentPage } from '@/store/editor-store';
import { EditorLayout } from '@/components/editor/editor-layout';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { EditorSidebar } from '@/components/editor/editor-sidebar';
import { EditorPanels } from '@/components/editor/editor-panels';
import toast from 'react-hot-toast';

export default function EditorPage() {
  const router = useRouter();
  const { currentProject } = useEditorStore();
  const currentPage = useCurrentPage();

  useEffect(() => {
    if (!currentProject) {
      toast.error('Nenhum projeto encontrado');
      router.push('/');
      return;
    }

    if (!currentPage) {
      toast.error('Nenhuma página encontrada');
      router.push('/');
      return;
    }
  }, [currentProject, currentPage, router]);

  if (!currentProject || !currentPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <EditorLayout>
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar />
        <EditorCanvas />
        <EditorPanels />
      </div>
    </EditorLayout>
  );
}
