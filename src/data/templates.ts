export type Template = {
  id: string;
  name: string;
  category: 'boda' | 'babyshower';
  thumbnailUrl: string;
  canvasData: Record<string, unknown>; // Simplified for MVP: representing initial Fabric.js JSON state
};

const createTemplateData = (bgColor: string, titleText: string) => ({
  version: "5.3.0",
  objects: [
    {
      type: "rect",
      left: 0,
      top: 0,
      width: 800,
      height: 1200,
      fill: bgColor,
      selectable: false,
    },
    {
      type: "textbox",
      left: 400,
      top: 200,
      width: 600,
      fontSize: 64,
      fontFamily: "Arial",
      fill: "#333333",
      text: titleText,
      textAlign: "center",
      originX: "center"
    }
  ]
});

export const templates: Template[] = [
  // Bodas
  {
    id: 'boda-1',
    name: 'Elegancia Clásica',
    category: 'boda',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Boda+1',
    canvasData: createTemplateData('#ffffff', 'Nuestra Boda')
  },
  {
    id: 'boda-2',
    name: 'Rústico Floral',
    category: 'boda',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Boda+2',
    canvasData: createTemplateData('#fdf8f5', 'Enlace Matrimonial')
  },
  {
    id: 'boda-3',
    name: 'Minimalista',
    category: 'boda',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Boda+3',
    canvasData: createTemplateData('#f0f0f0', 'Boda Minimal')
  },
  {
    id: 'boda-4',
    name: 'Noche Estrellada',
    category: 'boda',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Boda+4',
    canvasData: createTemplateData('#0a192f', 'Boda Nocturna')
  },
  {
    id: 'boda-5',
    name: 'Jardín Botánico',
    category: 'boda',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Boda+5',
    canvasData: createTemplateData('#e8f4e5', 'Nuestra Boda')
  },

  // Baby Showers
  {
    id: 'bs-1',
    name: 'Osito Cariñoso',
    category: 'babyshower',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Baby+Shower+1',
    canvasData: createTemplateData('#ffe4e1', 'Baby Shower')
  },
  {
    id: 'bs-2',
    name: 'Aventura Safari',
    category: 'babyshower',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Baby+Shower+2',
    canvasData: createTemplateData('#f0fff0', '¡Es un niño!')
  },
  {
    id: 'bs-3',
    name: 'Estrellas y Lunas',
    category: 'babyshower',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Baby+Shower+3',
    canvasData: createTemplateData('#e6e6fa', '¡Es una niña!')
  },
  {
    id: 'bs-4',
    name: 'Globo Aerostático',
    category: 'babyshower',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Baby+Shower+4',
    canvasData: createTemplateData('#e0ffff', 'Baby Shower')
  },
  {
    id: 'bs-5',
    name: 'Dulce Espera',
    category: 'babyshower',
    thumbnailUrl: 'https://via.placeholder.com/200x300?text=Baby+Shower+5',
    canvasData: createTemplateData('#fffacd', 'Dulce Espera')
  }
];
