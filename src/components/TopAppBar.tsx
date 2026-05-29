'use client';

import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function TopAppBar() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header
      className={`w-full top-0 sticky z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-sm' : 'bg-surface-container-lowest'
      }`}
      id="main-header"
    >
      <div className="flex justify-between items-center px-8 py-4 w-full">
        <div className="flex items-center gap-8">
          <span className="font-headline font-bold text-xl text-primary">EventaCanvas</span>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="font-label text-sm font-medium text-primary border-b-2 border-primary pb-1"
            >
              Plantillas
            </Link>
            <Link
              href="/"
              className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Mis Proyectos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 group">
            <div className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <LanguageSwitcher />
            </div>
            {user && (
                <div className="flex items-center gap-2 px-4 py-1 border-l border-outline-variant/30">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">account_circle</span>
                    <span className="font-label text-xs font-semibold text-on-surface-variant hidden sm:inline-block">{user.email}</span>
                </div>
            )}
            <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-full font-label text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
                {t('header.logout')}
            </button>
        </div>
      </div>
    </header>
  );
}
