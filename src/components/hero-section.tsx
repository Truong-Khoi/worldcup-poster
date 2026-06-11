'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <div className="w-full space-y-6 flex flex-col items-center">
      {/* Giant Poster Header */}
      <div className="text-center space-y-1 select-none py-2">
        <div className="inline-block px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-400 text-[9px] font-extrabold tracking-widest uppercase">
          🏆 FIFA WORLD CUP 2026 🏆
        </div>
        <h2 className="text-3xl font-black text-white tracking-wide text-glow">
          LỊCH THI ĐẤU
        </h2>
        <div className="text-slate-400 font-extrabold text-sm tracking-widest">
          WORLD CUP
        </div>
      </div>

      {/* Players Collage (Dynamic CSS crop of screen.png) */}
      <div className="relative w-full h-[530px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-all duration-500 hover:border-slate-700 bg-slate-950">
        <img
          src="/screen.png"
          alt="FIFA World Cup 2026 Players & Trophy"
          className="w-full h-full object-cover pointer-events-none select-none"
          style={{
            objectPosition: '50% 30%', // center player collage
            transform: 'scale(1.85)', // focus scale
          }}
        />
        {/* Visual styling overlay for smooth integrations */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Glowing ring behind the trophy in the image */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />
      </div>
    </div>
  );
}
