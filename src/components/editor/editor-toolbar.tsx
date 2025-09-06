'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import html2canvas from 'html2canvas';

export function EditorToolbar() {
  const { currentProject, currentPageId, updatePage, requestFitToScreen } = useEditorStore();

  const handleExportPNG = async () => {
    const el = document.getElementById('editor-canvas-snapshot');
    if (!el) return;
    const canvas = await html2canvas(el, { useCORS: true, backgroundColor: '#ffffff', scale: 1 });
    const data = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = data;
    a.download = 'arte.png';
    a.click();
  };

  const setFormat = (format: 'IG_SQUARE' | 'STORY' | 'LANDSCAPE') => {
    const pageId = currentPageId;
    if (!currentProject || !pageId) return;
    const size = format === 'IG_SQUARE' ? { width: 1080, height: 1080 }
      : format === 'STORY' ? { width: 1080, height: 1920 }
      : { width: 1920, height: 1080 };
    updatePage(pageId, size);
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Esquerda: Download */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPNG} title="Baixar PNG">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Centro: Presets de formato */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setFormat('IG_SQUARE')} title="Instagram Square">1:1</Button>
          <Button variant="outline" size="sm" onClick={() => setFormat('STORY')} title="Story 9:16">9:16</Button>
          <Button variant="outline" size="sm" onClick={() => setFormat('LANDSCAPE')} title="Landscape 16:9">16:9</Button>
        </div>

        {/* Direita: Centralizar */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={requestFitToScreen} title="Centralizar na tela">Centralizar</Button>
        </div>
      </div>
    </div>
  );
}
