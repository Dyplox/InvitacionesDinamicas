'use client';

import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-[calc(100vh-73px)] w-64 left-0 sticky top-[73px] flex-col py-6 px-4 space-y-2 bg-surface-container-low border-r border-outline-variant/15 overflow-y-auto">
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 mb-2 group/edit cursor-pointer hover:bg-surface-container-high p-1 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-lg bg-surface-dim overflow-hidden flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-on-surface font-semibold text-sm truncate">Nuevo Proyecto</h2>
              <span className="material-symbols-outlined text-xs text-on-surface-variant opacity-0 group-hover/edit:opacity-100 transition-opacity">edit</span>
            </div>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Lienzo en blanco</p>
          </div>
        </div>
        <Link href="/editor/new" className="w-full mt-4 flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-dim text-primary font-label text-xs font-bold py-3 rounded-xl transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          Crear
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        <Link href="/" className="flex items-center gap-3 bg-primary-container text-on-primary-container rounded-full px-4 py-3 transition-all">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-body text-sm">Plantillas</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high rounded-full px-4 py-3 transition-all">
          <span className="material-symbols-outlined">folder</span>
          <span className="font-body text-sm">Mis Proyectos</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high rounded-full px-4 py-3 transition-all">
          <span className="material-symbols-outlined">delete</span>
          <span className="font-body text-sm">Papelera</span>
        </Link>
      </nav>

      <footer className="pt-4 border-t border-outline-variant/10 space-y-1">
        <Link href="/" className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high rounded-full px-4 py-2 transition-all">
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span className="font-label text-xs">Ayuda</span>
        </Link>
      </footer>
    </aside>
  );
}
