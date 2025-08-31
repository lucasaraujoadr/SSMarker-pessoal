'use client';

import { useRef, useEffect, useState } from 'react';
import { useEditorStore, useCurrentPage, useSelectedLayers } from '@/store/editor-store';
import { LayerRenderer } from './layer-renderer';
import { Stage, Layer, Rect, useKonvaSetup } from '@/lib/konva-wrapper';

export function EditorCanvas() {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPage = useCurrentPage();
  const selectedLayers = useSelectedLayers();
  
  // Configurar Konva
  useKonvaSetup();
  
  const {  
    zoom, 
    pan, 
    setPan, 
    selectedLayerIds, 
    selectLayer, 
    clearSelection,
    setHoveredLayer,
    tool,
    isMoving,
    setIsMoving
  } = useEditorStore();

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  // Ajustar tamanho do stage baseado no container
  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setStageSize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  // Handlers de mouse
  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      clearSelection();
    }
  };

  const handleMouseDown = (e: any) => {
    if (tool === 'hand') {
      setIsMoving(true);
    }
  };

  const handleMouseMove = (e: any) => {
    if (tool === 'hand' && isMoving) {
      const stage = e.target.getStage();
      const oldPos = stage.position();
      setPan({
        x: oldPos.x - e.evt.movementX,
        y: oldPos.y - e.evt.movementY,
      });
    }
  };

  const handleMouseUp = () => {
    if (tool === 'hand') {
      setIsMoving(false);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;
    const clampedScale = Math.max(0.1, Math.min(5, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    stage.scale({ x: clampedScale, y: clampedScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma página selecionada</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative bg-muted/20 overflow-hidden"
      style={{ cursor: tool === 'hand' ? 'grab' : 'default' }}
    >
      {/* Grid de fundo */}
      <div className="absolute inset-0 editor-canvas" />
      
      {/* Stage do Konva */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        draggable={tool === 'hand'}
      >
        {/* Background layer */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={currentPage.width}
            height={currentPage.height}
            fill={currentPage.background || '#ffffff'}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        </Layer>

        {/* Content layer */}
        <Layer>
          {currentPage.layers.map((layer) => (
            <LayerRenderer
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerIds.includes(layer.id)}
              onSelect={() => selectLayer(layer.id)}
              onHover={() => setHoveredLayer(layer.id)}
              onUnhover={() => setHoveredLayer(null)}
            />
          ))}
        </Layer>

        {/* Selection layer */}
        <Layer>
          {selectedLayers.map((layer) => (
            <Rect
              key={`selection-${layer.id}`}
              x={layer.x - 2}
              y={layer.y - 2}
              width={layer.width + 4}
              height={layer.height + 4}
              stroke="#3b82f6"
              strokeWidth={2}
              dash={[5, 5]}
              fill="transparent"
            />
          ))}
        </Layer>
      </Stage>

      {/* Overlay com informações */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur rounded-lg px-3 py-2 text-sm">
        <div className="text-muted-foreground">
          {currentPage.width} × {currentPage.height}px
        </div>
        <div className="text-muted-foreground">
          {currentPage.layers.length} camadas
        </div>
      </div>

      {/* Overlay com zoom */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur rounded-lg px-3 py-2 text-sm">
        <div className="text-muted-foreground">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}
