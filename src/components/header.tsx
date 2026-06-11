'use client';

import React from 'react';

interface HeaderProps {
  viewMode: 'poster' | 'bracket';
  setViewMode: (mode: 'poster' | 'bracket') => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  resetAll: () => void;
}

export default function Header({
  viewMode,
  setViewMode,
  isEditMode,
  setIsEditMode,
  resetAll,
}: HeaderProps) {
  return (
    <header className="py-6 px-4 border-b border-white/10 bg-slate-950/20 backdrop-blur-md sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo Vibe */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl filter drop-shadow select-none">🏆</span>
          <div>
            <h1 className="text-sm font-black text-white tracking-wider uppercase">Lịch World Cup 2026</h1>
            <p className="text-[10px] text-teal-400 font-bold">STITCH MOCKUP INTERACTIVE</p>
          </div>
        </div>

        {/* Interactive controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg p-1 bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('poster')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                viewMode === 'poster'
                  ? 'bg-slate-800 text-teal-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🗺️ Bản Đồ Poster
            </button>
            <button
              onClick={() => setViewMode('bracket')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                viewMode === 'bracket'
                  ? 'bg-slate-800 text-teal-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌳 Sơ Đồ Cây (Bracket)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                isEditMode
                  ? 'bg-amber-500 border-transparent text-slate-950 hover:bg-amber-400 shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isEditMode ? '💾 Đóng Chế Độ Nhập' : '✏️ Nhập Điểm Số'}
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-800 bg-slate-950 text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
