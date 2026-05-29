'use client';

import { templates } from '@/data/templates';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from '@/i18n/I18nProvider';
import { TopAppBar } from '@/components/TopAppBar';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 'boda' | 'babyshower'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredTemplates = filter === 'all'
    ? templates
    : templates.filter(t => t.category === filter);

  return (
    <>
      <TopAppBar />
      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 bg-background pt-12 px-8 pb-32">
          {/* Header Area */}
          <header className="max-w-6xl mx-auto mb-16 text-center">
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary font-bold mb-4 block">Premium Selection</span>
            <h1 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight mb-6">{t('dashboard.title')}</h1>
            <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto">{t('dashboard.subtitle')}</p>
          </header>

          {/* Gallery Filter */}
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-label text-sm transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}
            >
              {t('dashboard.filter.all')}
            </button>
            <button
              onClick={() => setFilter('boda')}
              className={`px-6 py-2 rounded-full font-label text-sm transition-colors ${filter === 'boda' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}
            >
              {t('dashboard.filter.weddings')}
            </button>
            <button
              onClick={() => setFilter('babyshower')}
              className={`px-6 py-2 rounded-full font-label text-sm transition-colors ${filter === 'babyshower' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}
            >
              {t('dashboard.filter.babyshowers')}
            </button>
          </div>

          {/* Bento Art Gallery Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            {isLoading ? (
              // Skeleton Loading Grid
              <>
                {[0, 1, 2, 3].map((index) => {
                  const colSpanClass = index % 3 === 0 ? "md:col-span-8" : "md:col-span-4";
                  return (
                    <div key={index} className={`${colSpanClass} rounded-xl bg-surface-container-high animate-pulse`}>
                      <div className={`${index % 3 === 0 ? 'aspect-[16/10]' : 'aspect-square md:aspect-auto md:h-full min-h-[300px]'}`}></div>
                    </div>
                  );
                })}
              </>
            ) : (
              // Actual Template Rendering
              <>
                {filteredTemplates.map((template, index) => {
                  const colSpanClass = index % 3 === 0 ? "md:col-span-8" : "md:col-span-4";
                  return (
                    <div
                      key={template.id}
                      onClick={() => router.push(`/editor/${template.id}`)}
                      className={`${colSpanClass} group relative overflow-hidden rounded-xl bg-surface-container-lowest transition-all hover:scale-[1.01] cursor-pointer`}
                    >
                      <div className={`${index % 3 === 0 ? 'aspect-[16/10]' : 'aspect-square md:aspect-auto md:h-full min-h-[300px]'} overflow-hidden relative`}>
                        <Image
                          src={template.thumbnailUrl}
                          alt={template.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority={false}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                         <div className="mb-2 flex items-center gap-2">
                            <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-label font-bold px-3 py-1 rounded-full uppercase tracking-widest">{template.category}</span>
                        </div>
                        <h2 className="font-headline text-3xl mb-2">{template.name}</h2>
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity mt-4">
                          <button className="bg-primary px-6 py-2 rounded-full font-label text-xs font-bold hover:bg-primary-container transition-all active:scale-95 text-white">
                            {t('dashboard.useTemplate')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Small Square Card (Create New) */}
                <div onClick={() => router.push('/editor/new')} className="md:col-span-3 group bg-surface-dim rounded-xl p-6 flex flex-col justify-between transition-all hover:bg-surface-container-high cursor-pointer min-h-[250px]">
                  <div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <span className="material-symbols-outlined text-primary">add</span>
                    </div>
                    <h3 className="font-headline text-lg text-on-surface mb-2">{t('dashboard.blank')}</h3>
                    <p className="font-body text-xs text-on-surface-variant">Empieza desde cero y crea tu propio diseño.</p>
                  </div>
                  <span className="font-label text-[10px] font-bold text-primary flex items-center gap-1 mt-4">
                      CREAR AHORA
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
