'use client';

import { useRef, useEffect, useState } from 'react';
import { Layer } from '@/types';
import { Rect, Text, Image, Circle, Line, Group } from '@/lib/konva-wrapper';

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

  // Carregar imagem se for uma camada de imagem
  useEffect(() => {
    if (layer.type === 'image' && layer.src) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImageElement(img);
      };
      img.src = layer.src;
    }
  }, [layer.src, layer.type]);

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

  const renderLayer = () => {
    switch (layer.type) {
      case 'text':
        return (
          <Text
            x={layer.x}
            y={layer.y}
            width={layer.width}
            height={layer.height}
            text={layer.content}
            fontSize={layer.fontSize}
            fontFamily={layer.fontFamily}
            fontWeight={layer.fontWeight}
            fill={layer.color}
            align={layer.align}
            verticalAlign={layer.verticalAlign}
            lineHeight={layer.lineHeight / layer.fontSize}
            letterSpacing={layer.letterSpacing}
            textDecoration={layer.textDecoration}
            fontStyle={layer.fontStyle}
            backgroundColor={layer.backgroundColor}
            padding={layer.padding ? {
              top: layer.padding.top,
              right: layer.padding.right,
              bottom: layer.padding.bottom,
              left: layer.padding.left,
            } : undefined}
            cornerRadius={layer.borderRadius}
            shadowColor={layer.shadow?.color}
            shadowBlur={layer.shadow?.blur}
            shadowOffsetX={layer.shadow?.x}
            shadowOffsetY={layer.shadow?.y}
            shadowOpacity={layer.shadow ? 1 : 0}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable
          />
        );

      case 'image':
        return (
          <Image
            x={layer.x}
            y={layer.y}
            width={layer.width}
            height={layer.height}
            image={imageElement}
            cornerRadius={layer.mask?.radius}
            filters={layer.filters ? [
              layer.filters.brightness && (() => {
                const brightness = layer.filters!.brightness!;
                return (imageData: any) => {
                  const data = imageData.data;
                  for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * brightness);
                    data[i + 1] = Math.min(255, data[i + 1] * brightness);
                    data[i + 2] = Math.min(255, data[i + 2] * brightness);
                  }
                };
              })(),
              layer.filters.contrast && (() => {
                const contrast = layer.filters!.contrast!;
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
          />
        );

      case 'shape':
        switch (layer.shape) {
          case 'rect':
            return (
              <Rect
                x={layer.x}
                y={layer.y}
                width={layer.width}
                height={layer.height}
                fill={layer.fill}
                stroke={layer.stroke}
                strokeWidth={layer.strokeWidth}
                dash={layer.strokeDasharray}
                cornerRadius={layer.borderRadius}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                draggable
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
              />
            );

          case 'polygon':
            if (layer.points && layer.points.length >= 6) {
              return (
                <Line
                  points={layer.points}
                  stroke={layer.stroke}
                  fill={layer.fill}
                  strokeWidth={layer.strokeWidth}
                  dash={layer.strokeDasharray}
                  closed
                  onClick={handleClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  draggable
                />
              );
            }
            return null;

          case 'star':
            // Implementação simplificada de estrela
            const centerX = layer.x + layer.width / 2;
            const centerY = layer.y + layer.height / 2;
            const outerRadius = Math.min(layer.width, layer.height) / 2;
            const innerRadius = outerRadius * (layer.innerRadius || 0.5);
            const sides = layer.sides || 5;
            
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
                stroke={layer.stroke}
                fill={layer.fill}
                strokeWidth={layer.strokeWidth}
                dash={layer.strokeDasharray}
                closed
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                draggable
              />
            );

          default:
            return null;
        }

      case 'icon':
        // Para ícones, renderizar como texto temporariamente
        return (
          <Text
            x={layer.x}
            y={layer.y}
            width={layer.size}
            height={layer.size}
            text={layer.name}
            fontSize={layer.size * 0.8}
            fill={layer.color}
            align="center"
            verticalAlign="middle"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable
          />
        );

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
