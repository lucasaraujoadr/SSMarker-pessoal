// Configuração específica para Konva.js no Next.js
import { useEffect } from 'react';

export const useKonvaConfig = () => {
  useEffect(() => {
    // Configurar Konva para funcionar no browser
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.Konva = require('konva/lib/Core').Konva;
    }
  }, []);
};

// Configuração global para Konva
export const konvaConfig = {
  // Desabilitar canvas node.js no browser
  enableCanvas: false,
  // Usar WebGL quando disponível
  enableWebGL: true,
};
