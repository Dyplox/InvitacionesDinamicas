'use client';

import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { templates } from '@/data/templates';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'boda' | 'babyshower'>('all');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredTemplates = filter === 'all'
    ? templates
    : templates.filter(t => t.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">EventaCanvas</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2">Plantillas</h2>
            <p className="text-gray-500">Selecciona una plantilla para comenzar a diseñar.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('boda')}
              className={`px-4 py-2 rounded-full text-sm ${filter === 'boda' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Bodas
            </button>
            <button
              onClick={() => setFilter('babyshower')}
              className={`px-4 py-2 rounded-full text-sm ${filter === 'babyshower' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Baby Showers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* Create new blank canvas */}
          <div
            onClick={() => router.push('/editor/new')}
            className="border-2 border-dashed border-gray-300 rounded-lg aspect-[2/3] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition group"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-600 group-hover:text-blue-600">Lienzo en blanco</span>
          </div>

          {/* Templates */}
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => router.push(`/editor/${template.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative border border-gray-200 rounded-lg overflow-hidden aspect-[2/3] mb-2 group-hover:shadow-lg transition">
                <Image
                  src={template.thumbnailUrl}
                  alt={template.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm transform scale-95 group-hover:scale-100 transition duration-200">
                    Usar plantilla
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-gray-800">{template.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{template.category}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
