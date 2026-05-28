'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EditorSkeleton } from '@/components/EditorSkeleton';

const CanvasEditor = dynamic(() => import('@/components/CanvasEditor'), {
  ssr: false,
  loading: () => <EditorSkeleton />
});

export default function EditorPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="h-screen w-full bg-surface flex flex-col">
      <CanvasEditor templateId={id} />
    </div>
  );
}
