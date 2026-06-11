'use client';

import React, { useState, useMemo } from 'react';
import { useMatches } from '@/hooks/useMatches';
import GroupsGrid from '@/components/groups-grid';
import MatchTable from '@/components/match-table';
import KnockoutTree from '@/components/knockout-tree';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import FinalCard from '@/components/final-card';
import { removeAccents } from '@/utils/helpers';

export default function Home() {
  const {
    matches,
    teams,
    isLoaded,
    isEditMode,
    setIsEditMode,
    updateMatch,
    setKnockoutWinner,
    updateR32Team,
    resetAll,
  } = useMatches();

  // Display configuration
  const useUTC = false;
  const [viewMode, setViewMode] = useState<'poster' | 'bracket'>('poster');
  const [searchQuery, setSearchQuery] = useState('');

  // Separated matches for individual tables
  const groupStageMatches = useMemo(() => {
    return matches
      .filter((m) => m.stage === 'GROUP')
      .filter((m) => {
        if (!searchQuery) return true;
        const teamA = teams.find((t) => t.id === m.teamA)?.name || '';
        const teamB = teams.find((t) => t.id === m.teamB)?.name || '';
        const q = removeAccents(searchQuery.toLowerCase());
        return (
          removeAccents(teamA.toLowerCase()).includes(q) ||
          removeAccents(teamB.toLowerCase()).includes(q)
        );
      });
  }, [matches, teams, searchQuery]);

  const r32Matches = useMemo(
    () => matches.filter((m) => m.stage === 'ROUND_OF_32'),
    [matches]
  );
  const r16Matches = useMemo(
    () => matches.filter((m) => m.stage === 'ROUND_OF_16'),
    [matches]
  );
  const qfMatches = useMemo(
    () => matches.filter((m) => m.stage === 'QUARTER_FINAL'),
    [matches]
  );
  const sfMatches = useMemo(
    () => matches.filter((m) => m.stage === 'SEMI_FINAL'),
    [matches]
  );
  const tpMatch = useMemo(
    () => matches.find((m) => m.stage === 'THIRD_PLACE'),
    [matches]
  );
  const finalMatch = useMemo(
    () => matches.find((m) => m.stage === 'FINAL'),
    [matches]
  );

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1143A6] via-[#1A3673] to-[#0A1931] text-white">
        <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider animate-pulse text-teal-200">
          Đang tải lịch thi đấu...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#1143A6] via-[#1A3673] to-[#0A1931] min-h-screen text-white">
      {/* Header bar controls */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        resetAll={resetAll}
      />

      {/* Main Container */}
      <main className="max-w-[1700px] w-full mx-auto px-4 py-8 flex-1">
        {/* Toggle Mode 1: Exact Poster Replica Layout */}
        {viewMode === 'poster' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* COLUMN 1: LEFT SIDE (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5 flex flex-col">
              {/* Groups A-F grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider pl-1 select-none">
                  Bảng Đấu A - F
                </span>
                <GroupsGrid
                  teams={teams}
                  groupRange={['A', 'C', 'E', 'B', 'D', 'F']}
                />
              </div>

              {/* Vòng Bảng Match Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider select-none">
                    Lịch Vòng Bảng
                  </span>
                  {/* Inline search box */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm đội tuyển..."
                    className="text-[10px] rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-white max-w-[130px] placeholder-slate-600 focus:outline-none focus:border-teal-500/80"
                  />
                </div>
                {/* Scrollable match table exactly like the poster bottom */}
                <div className="max-h-[600px] overflow-y-auto rounded-xl border border-white/20 shadow-xl">
                  <MatchTable
                    matches={groupStageMatches}
                    teams={teams}
                    isEditMode={isEditMode}
                    useUTC={useUTC}
                    title="Vòng Bảng World Cup 2026"
                    headerBgClass="bg-blue-900 border-b border-white/10"
                    onUpdateScore={updateMatch}
                    onSelectWinner={setKnockoutWinner}
                  />
                </div>
              </div>
            </div>

            {/* COLUMN 2: CENTER HERO (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6 flex flex-col items-center">
              {/* Giant Poster Header & Players Collage */}
              <HeroSection />

              {/* Finals Section (Tranh Hạng 3 & Chung Kết) */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tranh Hạng 3 */}
                <FinalCard
                  match={tpMatch}
                  title="🥉 Tranh Hạng 3"
                  borderClass="border-cyan-500/30 hover:border-cyan-500/60"
                  textGlowClass="text-cyan-400 text-glow"
                  teams={teams}
                  isEditMode={isEditMode}
                  useUTC={useUTC}
                  updateMatch={updateMatch}
                  setKnockoutWinner={setKnockoutWinner}
                />
                {/* Chung Kết */}
                <FinalCard
                  match={finalMatch}
                  title="🏆 Trận Chung Kết"
                  borderClass="border-amber-500/40 hover:border-amber-500/80"
                  textGlowClass="text-amber-400 text-glow"
                  teams={teams}
                  isEditMode={isEditMode}
                  useUTC={useUTC}
                  updateMatch={updateMatch}
                  setKnockoutWinner={setKnockoutWinner}
                />
              </div>
            </div>

            {/* COLUMN 3: RIGHT SIDE (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5 flex flex-col">
              {/* Groups G-L grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider pl-1 select-none">
                  Bảng Đấu G - L
                </span>
                <GroupsGrid
                  teams={teams}
                  groupRange={['G', 'I', 'K', 'H', 'J', 'L']}
                />
              </div>

              {/* Knockout Match Tables Stacked */}
              <div className="space-y-5">
                <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider pl-1 block select-none">
                  Vòng Loại Trực Tiếp (K.O)
                </span>

                <div className="max-h-[600px] overflow-y-auto space-y-4 pr-1 rounded-xl border border-white/20 bg-white/5 p-2 shadow-xl">
                  {/* Round of 32 (Vòng 1/16) */}
                  <MatchTable
                    matches={r32Matches}
                    teams={teams}
                    isEditMode={isEditMode}
                    useUTC={useUTC}
                    title="Vòng 1/16 (Vòng 32 Đội)"
                    headerBgClass="bg-indigo-900 border-b border-white/10"
                    onUpdateScore={updateMatch}
                    onSelectWinner={setKnockoutWinner}
                    onUpdateR32Team={updateR32Team}
                  />

                  {/* Round of 16 (Vòng 1/8) */}
                  <MatchTable
                    matches={r16Matches}
                    teams={teams}
                    isEditMode={isEditMode}
                    useUTC={useUTC}
                    title="Vòng 1/8 (Vòng 16 Đội)"
                    headerBgClass="bg-violet-800 border-b border-white/10"
                    onUpdateScore={updateMatch}
                    onSelectWinner={setKnockoutWinner}
                  />

                  {/* Tứ Kết */}
                  <MatchTable
                    matches={qfMatches}
                    teams={teams}
                    isEditMode={isEditMode}
                    useUTC={useUTC}
                    title="Trận Tứ Kết"
                    headerBgClass="bg-fuchsia-800 border-b border-white/10"
                    onUpdateScore={updateMatch}
                    onSelectWinner={setKnockoutWinner}
                  />

                  {/* Bán Kết */}
                  <MatchTable
                    matches={sfMatches}
                    teams={teams}
                    isEditMode={isEditMode}
                    useUTC={useUTC}
                    title="Trận Bán Kết"
                    headerBgClass="bg-rose-800 border-b border-white/10"
                    onUpdateScore={updateMatch}
                    onSelectWinner={setKnockoutWinner}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Mode 2: Tree Bracket Layout */}
        {viewMode === 'bracket' && (
          <div className="space-y-4">
            <div className="p-3 text-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-semibold select-none leading-relaxed">
              💡 <strong>Chế độ Sơ đồ cây:</strong> Giúp bạn quan sát cấu
              trúc nhánh đấu của 32 đội đi tiếp trực quan nhất. Hãy bật{' '}
              <strong>"✏️ Nhập Điểm Số"</strong> để thay đổi tỉ số hoặc chọn
              đội.
            </div>

            <KnockoutTree
              matches={matches}
              teams={teams}
              isEditMode={isEditMode}
              useUTC={useUTC}
              onUpdateScore={updateMatch}
              onSelectWinner={setKnockoutWinner}
              onUpdateR32Team={updateR32Team}
            />
          </div>
        )}
      </main>

      {/* Dynamic Stadium Footer */}
      <footer className="py-6 text-center text-[10px] text-white/50 border-t border-white/10 mt-12 bg-black/20 select-none">
        <p>
          © 2026 Lịch thi đấu World Cup 2026. Trang web được phát triển bởi nhà sáng tạo Trương Minh Khôi.
        </p>
      </footer>
    </div>
  );
}
