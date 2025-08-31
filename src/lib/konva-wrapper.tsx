// Wrapper para Konva.js que evita problemas de SSR
import React from 'react';

// Componente de loading simples
const LoadingComponent = () => (
  <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
    Carregando editor...
  </div>
);

// Estado para controlar se os componentes foram carregados
let componentsLoaded = false;
let konvaComponents: any = {};

// Função para carregar os componentes Konva
const loadKonvaComponents = async () => {
  if (typeof window === 'undefined' || componentsLoaded) return;
  
  try {
    const konva = await import('react-konva');
    konvaComponents = {
      Stage: konva.Stage,
      Layer: konva.Layer,
      Rect: konva.Rect,
      Text: konva.Text,
      Image: konva.Image,
      Circle: konva.Circle,
      Line: konva.Line,
      Group: konva.Group,
    };
    componentsLoaded = true;
  } catch (error) {
    console.error('Erro ao carregar Konva:', error);
  }
};

// Carregar componentes quando o módulo for importado
if (typeof window !== 'undefined') {
  loadKonvaComponents();
}

// Componentes wrapper que verificam se os componentes estão carregados
export const Stage = (props: any) => {
  const [loaded, setLoaded] = React.useState(componentsLoaded);
  
  React.useEffect(() => {
    if (!loaded) {
      loadKonvaComponents().then(() => setLoaded(true));
    }
  }, [loaded]);
  
  if (!loaded || !konvaComponents.Stage) {
    return <LoadingComponent />;
  }
  
  return React.createElement(konvaComponents.Stage, props);
};

export const Layer = (props: any) => {
  const [loaded, setLoaded] = React.useState(componentsLoaded);
  
  React.useEffect(() => {
    if (!loaded) {
      loadKonvaComponents().then(() => setLoaded(true));
    }
  }, [loaded]);
  
  if (!loaded || !konvaComponents.Layer) {
    return null;
  }
  
  return React.createElement(konvaComponents.Layer, props);
};

export const Rect = (props: any) => {
  if (!componentsLoaded || !konvaComponents.Rect) {
    return null;
  }
  return React.createElement(konvaComponents.Rect, props);
};

export const Text = (props: any) => {
  if (!componentsLoaded || !konvaComponents.Text) {
    return null;
  }
  return React.createElement(konvaComponents.Text, props);
};

export const Image = (props: any) => {
  if (!componentsLoaded || !konvaComponents.Image) {
    return null;
  }
  return React.createElement(konvaComponents.Image, props);
};

export const Circle = (props: any) => {
  if (!componentsLoaded || !konvaComponents.Circle) {
    return null;
  }
  return React.createElement(konvaComponents.Circle, props);
};

export const Line = (props: any) => {
  if (!componentsLoaded || !konvaComponents.Line) {
    return null;
  }
  return React.createElement(konvaComponents.Line, props);
};

export const Group = (props: any) => {
  if (!componentsLoaded || !konvaComponents.Group) {
    return null;
  }
  return React.createElement(konvaComponents.Group, props);
};

// Hook para configurar Konva no browser
export const useKonvaSetup = () => {
  React.useEffect(() => {
    loadKonvaComponents();
  }, []);
};
