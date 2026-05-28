'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const CanvasEditor = dynamic(() => import('@/components/CanvasEditor'), { ssr: false });

export default function EditorPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      <CanvasEditor templateId={id} />
    </div>
  );
}
