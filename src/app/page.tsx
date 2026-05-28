'use client';

import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { templates } from '@/data/templates';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 'boda' | 'babyshower'>('all');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredTemplates = filter === 'all'
    ? templates
    : templates.filter(t => t.category === filter);

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface pb-16">
      <header className="bg-surface-container-lowest shadow-sm border-b border-outline-variant/20 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-serif font-bold text-primary">EventaCanvas</h1>
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <div className="flex items-center gap-4 border-l border-outline-variant/30 pl-6">
            <span className="text-sm font-label text-on-surface-variant hidden sm:inline-block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="btn-tertiary text-sm"
            >
              {t('header.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-3">{t('dashboard.title')}</h2>
            <p className="text-on-surface-variant text-lg">{t('dashboard.subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-surface-container rounded-lg inline-flex">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface hover:bg-surface-container-high'}`}
            >
              {t('dashboard.filter.all')}
            </button>
            <button
              onClick={() => setFilter('boda')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${filter === 'boda' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface hover:bg-surface-container-high'}`}
            >
              {t('dashboard.filter.weddings')}
            </button>
            <button
              onClick={() => setFilter('babyshower')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${filter === 'babyshower' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface hover:bg-surface-container-high'}`}
            >
              {t('dashboard.filter.babyshowers')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* Create new blank canvas */}
          <div
            onClick={() => router.push('/editor/new')}
            className="card-container aspect-[2/3] flex flex-col items-center justify-center cursor-pointer group bg-surface hover:bg-surface-container-low border-dashed"
          >
            <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-serif font-medium text-on-surface-variant group-hover:text-primary transition-colors">{t('dashboard.blank')}</span>
          </div>

          {/* Templates */}
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => router.push(`/editor/${template.id}`)}
              className="card-container group cursor-pointer flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[2/3] bg-surface-container border-b border-outline-variant/10">
                <Image
                  src={template.thumbnailUrl}
                  alt={template.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-surface-container-lowest/0 group-hover:bg-surface-container-lowest/20 transition-all flex items-center justify-center backdrop-blur-[0px] group-hover:backdrop-blur-[2px]">
                  <span className="opacity-0 group-hover:opacity-100 btn-secondary shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {t('dashboard.useTemplate')}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-surface-container-lowest">
                <h3 className="font-serif font-medium text-on-surface text-lg truncate">{template.name}</h3>
                <p className="text-sm font-label text-tertiary capitalize mt-1">{template.category === 'boda' ? t('dashboard.filter.weddings') : t('dashboard.filter.babyshowers')}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
