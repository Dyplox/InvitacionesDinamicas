'use client';

export function EditorSkeleton() {
  return (
    <>
      {/* Skeleton TopAppBar */}
      <header className="w-full h-[73px] top-0 sticky z-50 bg-surface-container-lowest border-b border-outline-variant/15 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-8">
          <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse"></div>
          <div className="h-6 w-32 bg-surface-container-high animate-pulse rounded"></div>
        </div>
        <div className="h-10 w-24 bg-surface-container-high animate-pulse rounded-full"></div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)] overflow-hidden">
        {/* Skeleton Sidebar Left */}
        <aside className="hidden md:flex h-full w-64 flex-col py-6 px-4 space-y-4 bg-surface-container-lowest border-r border-outline-variant/15">
          <div className="px-2">
            <div className="h-3 w-16 bg-surface-container-high animate-pulse rounded mb-4 ml-2"></div>
            <div className="w-full h-12 bg-surface-container-high animate-pulse rounded-xl mb-6"></div>

            <div className="h-3 w-24 bg-surface-container-high animate-pulse rounded mb-4 ml-2 mt-6"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-20 w-full bg-surface-container-high animate-pulse rounded-xl"></div>
              <div className="h-20 w-full bg-surface-container-high animate-pulse rounded-xl"></div>
              <div className="h-20 w-full bg-surface-container-high animate-pulse rounded-xl"></div>
              <div className="h-20 w-full bg-surface-container-high animate-pulse rounded-xl"></div>
            </div>
          </div>
        </aside>

        {/* Skeleton Canvas Area */}
        <main className="flex-1 bg-surface p-8 overflow-auto flex items-start justify-center">
          <div className="shadow-modal bg-surface-container-highest animate-pulse relative rounded-sm" style={{ width: 595, height: 842, minWidth: 595, minHeight: 842 }}></div>
        </main>

        {/* Skeleton Sidebar Right */}
        <aside className="w-72 bg-surface-container-lowest border-l border-outline-variant/15 hidden lg:flex flex-col p-6 space-y-8">
            <div className="h-4 w-20 bg-surface-container-high animate-pulse rounded mb-2"></div>
            <div className="h-6 w-32 bg-surface-container-high animate-pulse rounded mb-8"></div>

            <div className="space-y-6">
                <div className="h-10 w-full bg-surface-container-high animate-pulse rounded"></div>
                <div className="h-10 w-full bg-surface-container-high animate-pulse rounded"></div>
            </div>
        </aside>
      </div>
    </>
  );
}
