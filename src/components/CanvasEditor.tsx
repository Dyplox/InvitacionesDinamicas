'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { templates } from '@/data/templates';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, MessageCircle, Gift, Type, Download, ChevronLeft } from 'lucide-react';
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-surface-container-lowest shadow-sm ghost-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-semibold text-gray-800">{t('editor.title')}</h1>
        </div>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 btn-primary px-4 py-2 rounded-md transition"
        >
          <Download size={18} />
          {t('editor.export')}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Toolbar */}
        <div className="w-72 bg-surface-container-lowest ghost-border shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col p-4 gap-6 overflow-y-auto">

          {/* Add Elements */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('editor.add')}</h3>
            <button
              onClick={addText}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border rounded-lg text-gray-700 transition mb-2"
            >
              <Type size={18} className="text-gray-500" />
              <span>{t('editor.text')}</span>
            </button>

            <p className="text-xs text-gray-500 mt-4 mb-2">{t('editor.interactiveButtons')}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addInteractiveButton('location')}
                className="flex flex-col items-center justify-center p-3 hover:bg-blue-50 border rounded-lg text-gray-700 transition gap-1"
              >
                <MapPin size={20} className="text-blue-500" />
                <span className="text-xs">{t('editor.location')}</span>
              </button>
              <button
                onClick={() => addInteractiveButton('calendar')}
                className="flex flex-col items-center justify-center p-3 hover:bg-blue-50 border rounded-lg text-gray-700 transition gap-1"
              >
                <Calendar size={20} className="text-blue-500" />
                <span className="text-xs">{t('editor.calendar')}</span>
              </button>
              <button
                onClick={() => addInteractiveButton('whatsapp')}
                className="flex flex-col items-center justify-center p-3 hover:bg-green-50 border rounded-lg text-gray-700 transition gap-1"
              >
                <MessageCircle size={20} className="text-green-500" />
                <span className="text-xs">{t('editor.whatsapp')}</span>
              </button>
              <button
                onClick={() => addInteractiveButton('gift')}
                className="flex flex-col items-center justify-center p-3 hover:bg-purple-50 border rounded-lg text-gray-700 transition gap-1"
              >
                <Gift size={20} className="text-purple-500" />
                <span className="text-xs">{t('editor.gift')}</span>
              </button>
            </div>
          </div>

          {/* Properties Panel (Contextual) */}
          {activeObject && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('editor.properties')}</h3>

              {/* Text Properties */}
              {(activeObject.type === 'i-text' || activeObject.type === 'textbox') && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('editor.textColor')}</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => handleUpdateText('fill', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => handleUpdateText('fill', e.target.value)}
                        className="flex-1 text-sm border rounded px-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('editor.size')} ({fontSize}px)</label>
                    <input
                      type="range"
                      min="12" max="120"
                      value={fontSize}
                      onChange={(e) => handleUpdateText('fontSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Link Property (For any object, especially buttons) */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-blue-600 font-medium block mb-1">
                    {t('editor.link')}
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={linkUrl}
                    onChange={(e) => handleUpdateLink(e.target.value)}
                    className="w-full text-sm border rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">{t('editor.linkHelp')}</p>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={deleteSelected}
                className="w-full py-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition mt-4"
              >
                {t('editor.delete')}
              </button>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-surface-dim p-8 overflow-auto flex items-start justify-center">
          <div className="shadow-2xl bg-white relative" style={{ width: A4_WIDTH, height: A4_HEIGHT }}>
            <canvas ref={canvasRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
