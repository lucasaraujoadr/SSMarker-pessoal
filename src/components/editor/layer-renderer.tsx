'use client';

import { useRef, useEffect, useState } from 'react';
import { Layer } from '@/types';
import { Rect, Text, Image, Circle, Line, Group } from '@/lib/konva-wrapper';
import { useEditorStore, useCurrentPage } from '@/store/editor-store';

interface LayerRendererProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
  onUnhover: () => void;
}

export function LayerRenderer({ 
  layer, 
  isSelected, 
  onSelect, 
  onHover, 
  onUnhover 
}: LayerRendererProps) {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const { updateLayer } = useEditorStore();
  const currentPage = useCurrentPage();

  // Carregar imagem se for uma camada de imagem
  useEffect(() => {
    if (layer.type === 'image' && 'src' in layer && layer.src) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImageElement(img);
      };
      img.src = layer.src;
    }
  }, [layer]);

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    onSelect();
  };

  const handleMouseEnter = () => {
    onHover();
  };

  const handleMouseLeave = () => {
    onUnhover();
  };

  const SNAP_DISTANCE = 8;
  const GRID_SIZE = 16;

  const snap = (value: number, targets: number[]) => {
    for (const t of targets) {
      if (Math.abs(value - t) <= SNAP_DISTANCE) return t;
    }
    return value;
  };

  const getSnappedPosition = (x: number, y: number, w: number, h: number) => {
    if (!currentPage) return { x, y };
    const pageW = currentPage.width;
    const pageH = currentPage.height;

    const targetsX: number[] = [0, pageW / 2 - w / 2, pageW - w];
    const targetsY: number[] = [0, pageH / 2 - h / 2, pageH - h];
    for (let gx = 0; gx <= pageW - w; gx += GRID_SIZE) targetsX.push(gx);
    for (let gy = 0; gy <= pageH - h; gy += GRID_SIZE) targetsY.push(gy);

    return { x: snap(x, targetsX), y: snap(y, targetsY) };
  };

  const onDragMove = (e: any) => {
    const node = e.target;
    const pos = node.position();
    const size = { w: (layer as any).width, h: (layer as any).height };
    const { x, y } = getSnappedPosition(pos.x, pos.y, size.w, size.h);
    node.position({ x, y });
    // Atualizar guias para o centro
    if (currentPage) {
      const centerX = x + size.w / 2;
      const centerY = y + size.h / 2;
      // Centralizado se encostou no centro da página
      const showV = Math.abs(centerX - currentPage.width / 2) <= 8 ? currentPage.width / 2 : undefined;
      const showH = Math.abs(centerY - currentPage.height / 2) <= 8 ? currentPage.height / 2 : undefined;
      // Usar store via window to avoid circular import – simples placeholder
      try {
        // @ts-ignore
        const { useEditorStore } = require('@/store/editor-store');
        const setGuides = useEditorStore.getState().setGuides;
        setGuides({ vertical: showV, horizontal: showH });
      } catch {}
    }
  };

  const onDragEnd = (e: any) => {
    const node = e.target;
    const pos = node.position();
    updateLayer((layer as any).id, { x: pos.x, y: pos.y } as any);
    try {
      // @ts-ignore
      const { useEditorStore } = require('@/store/editor-store');
      const clearGuides = useEditorStore.getState().clearGuides;
      clearGuides();
    } catch {}
  };

  const renderLayer = () => {
    switch (layer.type) {
      case 'text': {
        const textLayer = layer as any;
        return (
          <Text
            x={textLayer.x}
            y={textLayer.y}
            width={textLayer.width}
            height={textLayer.height}
            text={textLayer.content}
            fontSize={textLayer.fontSize}
            fontFamily={textLayer.fontFamily}
            fontWeight={textLayer.fontWeight}
            fill={textLayer.color}
            align={textLayer.align}
            verticalAlign={textLayer.verticalAlign}
            lineHeight={textLayer.lineHeight / textLayer.fontSize}
            letterSpacing={textLayer.letterSpacing}
            textDecoration={textLayer.textDecoration}
            fontStyle={textLayer.fontStyle}
            backgroundColor={textLayer.backgroundColor}
            padding={textLayer.padding ? {
              top: textLayer.padding.top,
              right: textLayer.padding.right,
              bottom: textLayer.padding.bottom,
              left: textLayer.padding.left,
            } : undefined}
            cornerRadius={textLayer.borderRadius}
            shadowColor={textLayer.shadow?.color}
            shadowBlur={textLayer.shadow?.blur}
            shadowOffsetX={textLayer.shadow?.x}
            shadowOffsetY={textLayer.shadow?.y}
            shadowOpacity={textLayer.shadow ? 1 : 0}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        );
      }


      case 'image': {
        const imageLayer = layer as any;
        return (
          <Image
            x={imageLayer.x}
            y={imageLayer.y}
            width={imageLayer.width}
            height={imageLayer.height}
            image={imageElement}
            cornerRadius={imageLayer.mask?.radius}
            filters={imageLayer.filters ? [
              imageLayer.filters.brightness && (() => {
                const brightness = imageLayer.filters!.brightness!;
                return (imageData: any) => {
                  const data = imageData.data;
                  for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * brightness);
                    data[i + 1] = Math.min(255, data[i + 1] * brightness);
                    data[i + 2] = Math.min(255, data[i + 2] * brightness);
                  }
                };
              })(),
              imageLayer.filters.contrast && (() => {
                const contrast = imageLayer.filters!.contrast!;
                return (imageData: any) => {
                  const data = imageData.data;
                  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                  for (let i = 0; i < data.length; i += 4) {
                    data[i] = factor * (data[i] - 128) + 128;
                    data[i + 1] = factor * (data[i + 1] - 128) + 128;
                    data[i + 2] = factor * (data[i + 2] - 128) + 128;
                  }
                };
              })(),
            ].filter(Boolean) : undefined}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        );
      }

      case 'shape': {
        const shapeLayer = layer as any;
        switch (shapeLayer.shape) {
          case 'rect':
            return (
              <Rect
                x={shapeLayer.x}
                y={shapeLayer.y}
                width={shapeLayer.width}
                height={shapeLayer.height}
                fill={shapeLayer.fill}
                stroke={shapeLayer.stroke}
                strokeWidth={shapeLayer.strokeWidth}
                dash={shapeLayer.strokeDasharray}
                cornerRadius={shapeLayer.borderRadius}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                draggable
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
              />
            );

          case 'circle':
            return (
              <Circle
                x={layer.x + layer.width / 2}
                y={layer.y + layer.height / 2}
                radius={Math.min(layer.width, layer.height) / 2}
                fill={layer.fill}
                stroke={layer.stroke}
                strokeWidth={layer.strokeWidth}
                dash={layer.strokeDasharray}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                draggable
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
              />
            );

          case 'line':
            return (
              <Line
                points={[layer.x, layer.y, layer.x + layer.width, layer.y + layer.height]}
                stroke={layer.stroke || layer.fill}
                strokeWidth={layer.strokeWidth}
                dash={layer.strokeDasharray}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                draggable
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
              />
            );

          case 'polygon':
            if (layer.points && layer.points.length >= 6) {
              return (
                <Line
                  points={shapeLayer.points}
                  stroke={shapeLayer.stroke}
                  fill={shapeLayer.fill}
                  strokeWidth={shapeLayer.strokeWidth}
                  dash={shapeLayer.strokeDasharray}
                  closed
                  onClick={handleClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  draggable
                  onDragMove={onDragMove}
                  onDragEnd={onDragEnd}
                />
              );
            }
            return null;

          case 'star':
            // Implementação simplificada de estrela
            const centerX = shapeLayer.x + shapeLayer.width / 2;
            const centerY = shapeLayer.y + shapeLayer.height / 2;
            const outerRadius = Math.min(shapeLayer.width, shapeLayer.height) / 2;
            const innerRadius = outerRadius * (shapeLayer.innerRadius || 0.5);
            const sides = shapeLayer.sides || 5;
            
            const points = [];
            for (let i = 0; i < sides * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / sides;
              points.push(
                centerX + radius * Math.cos(angle),
                centerY + radius * Math.sin(angle)
              );
            }

            return (
              <Line
                points={points}
                stroke={shapeLayer.stroke}
                fill={shapeLayer.fill}
                strokeWidth={shapeLayer.strokeWidth}
                dash={shapeLayer.strokeDasharray}
                closed
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                draggable
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
              />
            );

          default:
            return null;
        }
      }

      case 'icon': {
        const iconLayer = layer as any;
        // Para ícones, renderizar como texto temporariamente
        return (
          <Text
            x={iconLayer.x}
            y={iconLayer.y}
            width={iconLayer.size}
            height={iconLayer.size}
            text={iconLayer.name}
            fontSize={iconLayer.size * 0.8}
            fill={iconLayer.color}
            align="center"
            verticalAlign="middle"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <Group>
      {renderLayer()}
      {isSelected && (
        <Rect
          x={layer.x - 2}
          y={layer.y - 2}
          width={layer.width + 4}
          height={layer.height + 4}
          stroke="#3b82f6"
          strokeWidth={2}
          dash={[5, 5]}
          fill="transparent"
        />
      )}
    </Group>
  );
}
