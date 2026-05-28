'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { templates } from '@/data/templates';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import { useI18n } from '@/i18n/I18nProvider';

interface CanvasEditorProps {
  templateId: string;
}

export default function CanvasEditor({ templateId }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const router = useRouter();
  const { t } = useI18n();

  // Toolbar state
  const [textColor, setTextColor] = useState('#333333');
  const [fontSize, setFontSize] = useState(32);
  const [linkUrl, setLinkUrl] = useState('');

  const A4_WIDTH = 595;
  const A4_HEIGHT = 842;

  const handleSelection = useCallback((obj?: fabric.Object) => {
    if (!obj) return;
    setActiveObject(obj);
    if (obj.type === 'textbox' || obj.type === 'i-text') {
      setTextColor((obj.fill as string) || '#333333');
      setFontSize((obj as fabric.IText).fontSize || 32);
    }
    // @ts-expect-error - custom property for link
    setLinkUrl(obj.linkUrl || '');
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: A4_WIDTH,
      height: A4_HEIGHT,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    setCanvas(initCanvas);

    // Load template or blank canvas
    if (templateId !== 'new') {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        initCanvas.loadFromJSON(template.canvasData, () => {
          initCanvas.renderAll();
        });
      }
    }

    // Handle object selection
    initCanvas.on('selection:created', (e) => handleSelection(e.selected?.[0]));
    initCanvas.on('selection:updated', (e) => handleSelection(e.selected?.[0]));
    initCanvas.on('selection:cleared', () => {
      setActiveObject(null);
      setLinkUrl('');
    });

    // Clean up
    return () => {
      initCanvas.dispose();
    };
  }, [templateId, handleSelection]);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText(t('editor.defaultText'), {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fill: textColor,
      fontSize: fontSize,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  // Predefined SVG Paths for Icons (Lucide simplified)
  const iconPaths = {
    location: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    calendar: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z",
    whatsapp: "M20.52 3.44C18.24 1.15 15.18 0 12 0 5.38 0 0 5.38 0 12c0 2.12.55 4.16 1.6 5.96L0 24l6.14-1.6c1.76.95 3.71 1.45 5.86 1.45 6.62 0 12-5.38 12-12 0-3.18-1.15-6.24-3.48-8.41zM12 21.82c-1.83 0-3.63-.48-5.2-1.4l-.37-.22-3.87 1.01 1.03-3.77-.24-.39C2.42 15.35 1.85 13.7 1.85 12c0-5.59 4.56-10.15 10.15-10.15 2.71 0 5.26 1.06 7.18 2.98 1.91 1.91 2.97 4.46 2.97 7.17 0 5.59-4.56 10.15-10.15 10.15z",
    gift: "M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2v11h12V10h2V8zm-8 11H6v-9h6v9zm6 0h-6v-9h6v9zm-4-12c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm-6 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1z"
  };

  const addInteractiveButton = (iconType: keyof typeof iconPaths) => {
    if (!canvas) return;

    // Create a group containing a circle and the icon
    const circle = new fabric.Circle({
      radius: 30,
      fill: '#3b82f6',
      originX: 'center',
      originY: 'center',
    });

    const path = new fabric.Path(iconPaths[iconType], {
      fill: '#ffffff',
      originX: 'center',
      originY: 'center',
      scaleX: 1.5,
      scaleY: 1.5,
    });

    const group = new fabric.Group([circle, path], {
      left: 200,
      top: 200,
      hasControls: true,
    });

    // @ts-expect-error - custom property
    group.isInteractiveButton = true;
    // @ts-expect-error - custom property
    group.linkUrl = 'https://'; // Default URL

    canvas.add(group);
    canvas.setActiveObject(group);
  };

  const handleUpdateText = (key: string, value: string | number) => {
    if (!canvas || !activeObject) return;
    if (activeObject.type === 'i-text' || activeObject.type === 'textbox') {
      activeObject.set(key as keyof fabric.Object, value);
      canvas.renderAll();

      if (key === 'fill') setTextColor(value as string);
      if (key === 'fontSize') setFontSize(value as number);
    }
  };

  const handleUpdateLink = (url: string) => {
    if (!canvas || !activeObject) return;
    activeObject.set("linkUrl" as keyof fabric.Object, url);
    setLinkUrl(url);
  };

  const deleteSelected = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    setActiveObject(null);
  };

  const exportPDF = () => {
    if (!canvas) return;

    // Deselect before export
    canvas.discardActiveObject();
    canvas.renderAll();

    // Generate high quality image from canvas
    const imgData = canvas.toDataURL({
      format: 'jpeg',
      quality: 1,
      multiplier: 2 // Higher resolution
    });

    // Create PDF (A4 size by default: 210x297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // Add interactive links
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      // @ts-expect-error - custom property
      if (obj.linkUrl && obj.linkUrl.startsWith('http')) {
        // Calculate position proportionally to A4 size
        const scaleX = pdfWidth / A4_WIDTH;
        const scaleY = pdfHeight / A4_HEIGHT;

        const bound = obj.getBoundingRect();

        pdf.link(
          bound.left * scaleX,
          bound.top * scaleY,
          bound.width * scaleX,
          bound.height * scaleY,
          // @ts-expect-error - custom property
          { url: obj.linkUrl }
        );
      }
    });

    pdf.save('invitacion.pdf');
  };

  return (
    <>
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest transition-all duration-300 border-b border-outline-variant/15" id="main-header">
        <div className="flex justify-between items-center px-8 py-4 w-full">
          <div className="flex items-center gap-8">
            <button onClick={() => router.push('/')} className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center -ml-2">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="font-headline font-bold text-xl text-primary">{t('editor.title')}</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={exportPDF} className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-full font-label text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                {t('editor.export')}
             </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)] overflow-hidden">

        {/* Sidebar Left */}
        <aside className="hidden md:flex h-full w-64 flex-col py-6 px-4 space-y-2 bg-surface-container-lowest border-r border-outline-variant/15 overflow-y-auto">
          <div className="px-2 mb-6">
            <h3 className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-4 ml-2">{t('editor.add')}</h3>

            <button onClick={addText} className="w-full mb-4 flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-dim text-primary font-label text-xs font-bold py-3 rounded-xl transition-all">
              <span className="material-symbols-outlined text-sm">text_fields</span>
              {t('editor.text')}
            </button>

            <h3 className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-3 ml-2 mt-6">{t('editor.interactiveButtons')}</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addInteractiveButton('location')} className="flex flex-col items-center justify-center p-3 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition gap-2 border border-outline-variant/10">
                <span className="material-symbols-outlined text-blue-500">location_on</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">{t('editor.location')}</span>
              </button>
              <button onClick={() => addInteractiveButton('calendar')} className="flex flex-col items-center justify-center p-3 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition gap-2 border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">{t('editor.calendar')}</span>
              </button>
              <button onClick={() => addInteractiveButton('whatsapp')} className="flex flex-col items-center justify-center p-3 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition gap-2 border border-outline-variant/10">
                <span className="material-symbols-outlined text-green-500">chat</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">{t('editor.whatsapp')}</span>
              </button>
              <button onClick={() => addInteractiveButton('gift')} className="flex flex-col items-center justify-center p-3 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition gap-2 border border-outline-variant/10">
                <span className="material-symbols-outlined text-purple-500">featured_seasonal_and_gifts</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">{t('editor.gift')}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-surface p-8 overflow-auto flex items-start justify-center relative">
          <div className="shadow-modal bg-white relative rounded-sm" style={{ width: A4_WIDTH, height: A4_HEIGHT, minWidth: A4_WIDTH, minHeight: A4_HEIGHT }}>
            <canvas ref={canvasRef} />
          </div>
        </main>

        {/* Sidebar Right (Properties) */}
        <aside className="w-72 bg-surface-container-lowest border-l border-outline-variant/15 flex flex-col p-6 overflow-y-auto hidden lg:flex h-full">
            {activeObject ? (
               <div className="space-y-8">
                  <header className="border-b border-outline-variant/20 pb-4">
                     <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary font-bold mb-1 block">Propiedades</span>
                     <h2 className="font-headline text-lg text-on-surface">{t('editor.properties')}</h2>
                  </header>

                  {/* Text Properties */}
                  {(activeObject.type === 'i-text' || activeObject.type === 'textbox') && (
                     <div className="space-y-6">
                        <div>
                           <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">{t('editor.textColor')}</label>
                           <div className="flex gap-2 items-center">
                              <input
                                 type="color"
                                 value={textColor}
                                 onChange={(e) => handleUpdateText('fill', e.target.value)}
                                 className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-0 p-0"
                              />
                              <input
                                 type="text"
                                 value={textColor}
                                 onChange={(e) => handleUpdateText('fill', e.target.value)}
                                 className="flex-1 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 font-mono text-on-surface"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex justify-between">
                              <span>{t('editor.size')}</span>
                              <span className="text-primary">{fontSize}px</span>
                           </label>
                           <input
                              type="range"
                              min="12" max="120"
                              value={fontSize}
                              onChange={(e) => handleUpdateText('fontSize', parseInt(e.target.value))}
                              className="w-full h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary"
                           />
                        </div>
                     </div>
                  )}

                  {/* Link Property */}
                  <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                     <div>
                        <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">
                           {t('editor.link')}
                        </label>
                        <input
                           type="url"
                           placeholder="https://..."
                           value={linkUrl}
                           onChange={(e) => handleUpdateLink(e.target.value)}
                           className="w-full text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                        />
                        <p className="text-[10px] text-on-surface-variant mt-2">{t('editor.linkHelp')}</p>
                     </div>
                  </div>

                  {/* Alignment & Actions */}
                  <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                     <button
                        onClick={deleteSelected}
                        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-error border border-error/30 hover:bg-error/5 rounded-xl transition-colors"
                     >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        {t('editor.delete')}
                     </button>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant/50 space-y-4">
                  <span className="material-symbols-outlined text-4xl">touch_app</span>
                  <p className="font-body text-sm max-w-[200px]">Selecciona un elemento en el lienzo para editar sus propiedades.</p>
               </div>
            )}
        </aside>
      </div>
    </>
  );
}
