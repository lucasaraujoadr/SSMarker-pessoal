'use client';

import { ReactNode } from 'react';
import { useEditorStore } from '@/store/editor-store';

interface EditorLayoutProps {
  children: ReactNode;
}

export function EditorLayout({ children }: EditorLayoutProps) {
  const { currentProject } = useEditorStore();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">
              {currentProject?.name || 'Editor'}
            </h1>
            <div className="text-sm text-muted-foreground">
              {currentProject?.pages.length || 0} páginas
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground">
              Auto-save ativo
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
