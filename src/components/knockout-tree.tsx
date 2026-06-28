'use client';

import React from 'react';
import { Match, Team } from '@/types';
import { formatMatchTime, formatMatchDate } from '@/utils/date';
import { getFlagUrl } from '@/utils/helpers';
import { progressionMap } from '@/constants/progression';

interface KnockoutTreeProps {
  matches: Match[];
  teams: Team[];
  isEditMode: boolean;
  useUTC: boolean;
  onUpdateScore: (matchId: string, scoreA: number | null, scoreB: number | null, status: Match['status']) => void;
  onSelectWinner: (matchId: string, winnerId: string) => void;
  onUpdateR32Team: (matchId: string, slot: 'teamA' | 'teamB', teamId: string | null) => void;
}

export default function KnockoutTree({
  matches,
  teams,
  isEditMode,
  useUTC,
  onUpdateScore,
  onSelectWinner,
  onUpdateR32Team,
}: KnockoutTreeProps) {
  // Filter matches by stage
  const getStageMatches = (stage: Match['stage']) => {
    return matches.filter((m) => m.stage === stage);
  };

  const r32 = getStageMatches('ROUND_OF_32');
  const r16 = getStageMatches('ROUND_OF_16');
  const qf = getStageMatches('QUARTER_FINAL');
  const sf = getStageMatches('SEMI_FINAL');
  const tp = getStageMatches('THIRD_PLACE');
  const f = getStageMatches('FINAL');

  const finalMatch = matches.find((m) => m.stage === 'FINAL');
  const championTeam = finalMatch?.winner ? teams.find(t => t.id === finalMatch.winner) : null;

  // Left and Right bracket lists mapping to correct display order (top to bottom)
  const leftR32Ids = ['R32_2', 'R32_5', 'R32_1', 'R32_3', 'R32_11', 'R32_12', 'R32_9', 'R32_10'];
  const rightR32Ids = ['R32_4', 'R32_6', 'R32_7', 'R32_8', 'R32_14', 'R32_16', 'R32_13', 'R32_15'];

  const leftR16Ids = ['R16_1', 'R16_2', 'R16_5', 'R16_6'];
  const rightR16Ids = ['R16_3', 'R16_4', 'R16_7', 'R16_8'];

  const leftQFIds = ['QF_1', 'QF_2'];
  const rightQFIds = ['QF_3', 'QF_4'];

  const leftSFIds = ['SF_1'];
  const rightSFIds = ['SF_2'];

  const leftR32 = leftR32Ids.map(id => r32.find(m => m.id === id)).filter(Boolean) as Match[];
  const rightR32 = rightR32Ids.map(id => r32.find(m => m.id === id)).filter(Boolean) as Match[];

  const leftR16 = leftR16Ids.map(id => r16.find(m => m.id === id)).filter(Boolean) as Match[];
  const rightR16 = rightR16Ids.map(id => r16.find(m => m.id === id)).filter(Boolean) as Match[];

  const leftQF = leftQFIds.map(id => qf.find(m => m.id === id)).filter(Boolean) as Match[];
  const rightQF = rightQFIds.map(id => qf.find(m => m.id === id)).filter(Boolean) as Match[];

  const leftSF = leftSFIds.map(id => sf.find(m => m.id === id)).filter(Boolean) as Match[];
  const rightSF = rightSFIds.map(id => sf.find(m => m.id === id)).filter(Boolean) as Match[];

  const leftSideMatchIds = React.useMemo(() => new Set([
    'R32_1', 'R32_2', 'R32_3', 'R32_5', 'R32_9', 'R32_10', 'R32_11', 'R32_12',
    'R16_1', 'R16_2', 'R16_5', 'R16_6',
    'QF_1', 'QF_2',
    'SF_1'
  ]), []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [connections, setConnections] = React.useState<{ pathD: string }[]>([]);

  const updatePaths = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newConns: { pathD: string }[] = [];

    const stagesToConnect: Match['stage'][] = [
      'ROUND_OF_32',
      'ROUND_OF_16',
      'QUARTER_FINAL',
      'SEMI_FINAL',
    ];

    matches.forEach((m) => {
      if (!stagesToConnect.includes(m.stage)) return;

      const progression = progressionMap[m.id];
      if (!progression) return;

      const childEl = document.getElementById(`tree-match-${m.id}`);
      const parentEl = document.getElementById(`tree-match-${progression.targetMatchId}`);

      if (childEl && parentEl) {
        const childRect = childEl.getBoundingClientRect();
        const parentRect = parentEl.getBoundingClientRect();

        const isLeft = leftSideMatchIds.has(m.id);

        const x1 = (isLeft ? childRect.right : childRect.left) - containerRect.left + container.scrollLeft;
        const y1 = childRect.top + childRect.height / 2 - containerRect.top + container.scrollTop;

        const x2 = (isLeft ? parentRect.left : parentRect.right) - containerRect.left + container.scrollLeft;
        const slotOffset = progression.slot === 'teamA' ? 0.35 : 0.65;
        const y2 = parentRect.top + parentRect.height * slotOffset - containerRect.top + container.scrollTop;

        const dx = x2 - x1;
        const xm = x1 + dx * 0.45;

        const pathD = `M ${x1} ${y1} H ${xm} V ${y2} H ${x2}`;
        newConns.push({ pathD });
      }
    });

    setConnections(newConns);
  }, [matches, leftSideMatchIds]);

  React.useEffect(() => {
    const timer = setTimeout(updatePaths, 150);
    const handleResize = () => {
      requestAnimationFrame(updatePaths);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [matches, isEditMode, updatePaths]);

  // Helper to render a bracket node
  const renderBracketNode = (match: Match) => {
    const teamA = teams.find((t) => t.id === match.teamA);
    const teamB = teams.find((t) => t.id === match.teamB);

    const handleScoreAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === '' ? null : parseInt(e.target.value);
      onUpdateScore(match.id, val, match.scoreB, val !== null || match.scoreB !== null ? 'FINISHED' : 'UPCOMING');
    };

    const handleScoreBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === '' ? null : parseInt(e.target.value);
      onUpdateScore(match.id, match.scoreA, val, match.scoreA !== null || val !== null ? 'FINISHED' : 'UPCOMING');
    };

    return (
      <div
        id={`tree-match-${match.id}`}
        key={match.id}
        className={`w-[145px] flex-shrink-0 flex flex-col rounded-lg border text-[10px] overflow-hidden shadow-md backdrop-blur-sm transition-all duration-300 ${
          match.status === 'LIVE'
            ? 'bg-red-950/20 border-red-500/50 shadow-red-950/10'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Header: Label & Time */}
        <div className="bg-slate-950/60 px-1.5 py-0.5 text-[8.5px] text-slate-400 font-bold flex justify-between items-center select-none">
          <span>{match.label || 'K.O'}</span>
          <span className="text-white">
            {formatMatchDate(match.date, useUTC).split(',')[1]?.trim() || formatMatchDate(match.date, useUTC)} {formatMatchTime(match.date, useUTC)}
          </span>
        </div>

        {/* Teams & Scores */}
        <div className="p-1.5 space-y-1.5">
          {/* Team A */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 truncate max-w-[95px]">
              {teamA ? (
                <img
                  src={getFlagUrl(teamA.id)}
                  alt={teamA.name}
                  className="w-4 h-2.5 object-cover rounded-sm shadow-sm select-none flex-shrink-0 border border-slate-700/30"
                />
              ) : (
                <span className="text-slate-500 text-[9px]">🏳️</span>
              )}
              <span
                className={`font-semibold truncate text-[9.5px] ${
                  match.status === 'FINISHED' && match.winner === match.teamA
                    ? 'text-emerald-400 font-bold'
                    : match.status === 'FINISHED' && match.winner !== match.teamA
                    ? 'text-slate-500'
                    : 'text-slate-200'
                }`}
              >
                {teamA?.name || match.placeholderA || 'Chưa xác định'}
              </span>
            </div>

            {isEditMode ? (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={match.scoreA ?? ''}
                onChange={handleScoreAChange}
                placeholder="-"
                disabled={!match.teamA}
                className="w-6 h-5 rounded bg-slate-800 text-center text-[10px] font-bold border border-slate-700 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            ) : (
              match.status !== 'UPCOMING' && (
                <span
                  className={`font-extrabold pr-0.5 text-[11px] ${
                    match.status === 'FINISHED' && match.winner === match.teamA
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  {match.scoreA}
                </span>
              )
            )}
          </div>

          {/* Team B */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 truncate max-w-[95px]">
              {teamB ? (
                <img
                  src={getFlagUrl(teamB.id)}
                  alt={teamB.name}
                  className="w-4 h-2.5 object-cover rounded-sm shadow-sm select-none flex-shrink-0 border border-slate-700/30"
                />
              ) : (
                <span className="text-slate-500 text-[9px]">🏳️</span>
              )}
              <span
                className={`font-semibold truncate text-[9.5px] ${
                  match.status === 'FINISHED' && match.winner === match.teamB
                    ? 'text-emerald-400 font-bold'
                    : match.status === 'FINISHED' && match.winner !== match.teamB
                    ? 'text-slate-500'
                    : 'text-slate-200'
                }`}
              >
                {teamB?.name || match.placeholderB || 'Chưa xác định'}
              </span>
            </div>

            {isEditMode ? (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={match.scoreB ?? ''}
                onChange={handleScoreBChange}
                placeholder="-"
                disabled={!match.teamB}
                className="w-6 h-5 rounded bg-slate-800 text-center text-[10px] font-bold border border-slate-700 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            ) : (
              match.status !== 'UPCOMING' && (
                <span
                  className={`font-extrabold pr-0.5 text-[11px] ${
                    match.status === 'FINISHED' && match.winner === match.teamB
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  {match.scoreB}
                </span>
              )
            )}
          </div>
        </div>

        {/* Winner Selector for penalty shootout tie in tree */}
        {isEditMode &&
          match.scoreA !== null &&
          match.scoreB !== null &&
          match.scoreA === match.scoreB &&
          match.teamA &&
          match.teamB && (
            <div className="bg-slate-950/80 px-1.5 py-0.5 flex items-center justify-between text-[8px] text-amber-400 gap-1 border-t border-slate-800 select-none">
              <span>Đội thắng PK:</span>
              <div className="flex gap-0.5">
                <button
                  onClick={() => onSelectWinner(match.id, match.teamA!)}
                  className="px-1 py-0.5 rounded text-[7.5px] border bg-slate-800 border-slate-700"
                >
                  A
                </button>
                <button
                  onClick={() => onSelectWinner(match.id, match.teamB!)}
                  className="px-1 py-0.5 rounded text-[7.5px] border bg-slate-800 border-slate-700"
                >
                  B
                </button>
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto py-6 relative" ref={containerRef}>
      {/* SVG Connection Lines overlay */}
      <svg 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" 
        style={{ minWidth: '1420px' }}
      >
        {connections.map((conn, idx) => (
          <path
            key={idx}
            d={conn.pathD}
            fill="none"
            stroke="rgba(99, 102, 241, 0.4)" // Indigo color with opacity
            strokeWidth="1.5"
            strokeDasharray="4,4" // dashed lines for premium aesthetic
            className="transition-all duration-300"
          />
        ))}
      </svg>

      <div className="min-w-[1420px] flex justify-between gap-2 px-1 relative z-10">
        {/* ================= LEFT BRACKET ================= */}
        {/* Left Vòng 1/16 (Round of 32) */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Vòng 1/16
          </h4>
          <div className="flex flex-col gap-2 py-1">
            {leftR32.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Left Vòng 1/8 (Round of 16) */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Vòng 1/8
          </h4>
          <div className="flex flex-col gap-[56px] py-8 justify-around h-full min-h-[500px]">
            {leftR16.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Left Tứ Kết */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Tứ Kết
          </h4>
          <div className="flex flex-col gap-[165px] py-16 justify-around h-full min-h-[500px]">
            {leftQF.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Left Bán Kết */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Bán Kết
          </h4>
          <div className="flex flex-col gap-[380px] py-32 justify-around h-full min-h-[500px]">
            {leftSF.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* ================= CENTER COLUMN (Final & Trophy) ================= */}
        <div className="flex flex-col gap-4 justify-start items-center w-[155px]">
          <h4 className="w-full text-[10px] font-bold text-center text-amber-400 uppercase tracking-wider bg-amber-950/40 py-1 rounded border border-amber-800/40 select-none">
            Chung Kết
          </h4>
          <div className="flex flex-col items-center justify-center gap-6 py-4 h-full min-h-[500px]">
            {/* Trophy / Winner Display */}
            {championTeam ? (
              <div className="flex flex-col items-center p-2 bg-amber-500/10 border-2 border-amber-500/80 rounded-xl shadow-lg shadow-amber-500/5 select-none text-center max-w-[145px] w-full animate-bounce">
                <span className="text-[20px] leading-none mb-0.5">🏆</span>
                <span className="text-[8px] font-black uppercase text-amber-400 tracking-wider">NHÀ VÔ ĐỊCH</span>
                <img
                  src={getFlagUrl(championTeam.id)}
                  alt={championTeam.name}
                  className="w-8 h-5.5 object-cover rounded shadow border border-white/20 my-1"
                />
                <span className="text-[10px] font-black text-white truncate max-w-full drop-shadow">
                  {championTeam.name.toUpperCase()}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center p-2 bg-slate-900/60 border border-slate-800 rounded-xl select-none text-center max-w-[145px] w-full opacity-60">
                <span className="text-[18px] leading-none mb-0.5">🏆</span>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">NHÀ VÔ ĐỊCH</span>
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-[12px] font-bold my-1">
                  ?
                </div>
                <span className="text-[9px] font-bold text-slate-500">Chưa xác định</span>
              </div>
            )}

            {/* Chung Kết Match Card */}
            <div className="space-y-0.5 text-center">
              <span className="text-[8px] text-amber-400 uppercase font-extrabold block select-none">
                🏆 Chung Kết 🏆
              </span>
              {f.map((m) => renderBracketNode(m))}
            </div>

            {/* Tranh Hạng 3 Match Card */}
            <div className="space-y-0.5 text-center pt-2">
              <span className="text-[8px] text-cyan-400 uppercase font-extrabold block select-none">
                🥉 Tranh Hạng Ba 🥉
              </span>
              {tp.map((m) => renderBracketNode(m))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT BRACKET ================= */}
        {/* Right Bán Kết */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Bán Kết
          </h4>
          <div className="flex flex-col gap-[380px] py-32 justify-around h-full min-h-[500px]">
            {rightSF.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Right Tứ Kết */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Tứ Kết
          </h4>
          <div className="flex flex-col gap-[165px] py-16 justify-around h-full min-h-[500px]">
            {rightQF.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Right Vòng 1/8 (Round of 16) */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Vòng 1/8
          </h4>
          <div className="flex flex-col gap-[56px] py-8 justify-around h-full min-h-[500px]">
            {rightR16.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Right Vòng 1/16 (Round of 32) */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider bg-slate-950/80 py-1 rounded border border-slate-800 select-none">
            Vòng 1/16
          </h4>
          <div className="flex flex-col gap-2 py-1">
            {rightR32.map((m) => renderBracketNode(m))}
          </div>
        </div>
      </div>
    </div>
  );
}
