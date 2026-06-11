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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [connections, setConnections] = React.useState<{ pathD: string }[]>([]);

  const updatePaths = React.useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
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

        const x1 = childRect.right - containerRect.left + containerRef.current.scrollLeft;
        const y1 = childRect.top + childRect.height / 2 - containerRect.top + containerRef.current.scrollTop;

        const x2 = parentRect.left - containerRect.left + containerRef.current.scrollLeft;
        const slotOffset = progression.slot === 'teamA' ? 0.35 : 0.65;
        const y2 = parentRect.top + parentRect.height * slotOffset - containerRect.top + containerRef.current.scrollTop;

        const dx = x2 - x1;
        const xm = x1 + dx * 0.45;

        const pathD = `M ${x1} ${y1} H ${xm} V ${y2} H ${x2}`;
        newConns.push({ pathD });
      }
    });

    setConnections(newConns);
  }, [matches]);

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
        className={`w-[200px] flex-shrink-0 flex flex-col rounded-lg border text-xs overflow-hidden shadow-md backdrop-blur-sm transition-all duration-300 ${
          match.status === 'LIVE'
            ? 'bg-red-950/20 border-red-500/50 shadow-red-950/10'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Header: Label & Time */}
        <div className="bg-slate-950/60 px-2 py-1 text-[10px] text-slate-400 font-bold flex justify-between items-center select-none">
          <span>{match.label || 'K.O'}</span>
          <span className="text-white">
            {formatMatchDate(match.date, useUTC).split(',')[1]?.trim() || formatMatchDate(match.date, useUTC)} {formatMatchTime(match.date, useUTC)}
          </span>
        </div>

        {/* Teams & Scores */}
        <div className="p-2 space-y-2">
          {/* Team A */}
          <div className="flex items-center justify-between gap-1">
            {isEditMode && match.stage === 'ROUND_OF_32' ? (
              <select
                value={match.teamA || ''}
                onChange={(e) => onUpdateR32Team(match.id, 'teamA', e.target.value || null)}
                className="w-[120px] text-[10px] bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white"
              >
                <option value="">{match.placeholderA || 'Đội A'}</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                {teamA ? (
                  <img
                    src={getFlagUrl(teamA.id)}
                    alt={teamA.name}
                    className="w-4.5 h-3 object-cover rounded-sm shadow-sm select-none flex-shrink-0 border border-slate-700/30"
                  />
                ) : (
                  <span className="text-slate-500 text-[10px]">🏳️</span>
                )}
                <span
                  className={`font-semibold truncate ${
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
            )}

            {isEditMode ? (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={match.scoreA ?? ''}
                onChange={handleScoreAChange}
                placeholder="-"
                disabled={!match.teamA}
                className="w-7 h-6 rounded bg-slate-800 text-center text-xs font-bold border border-slate-700 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            ) : (
              match.status !== 'UPCOMING' && (
                <span
                  className={`font-extrabold pr-1 text-sm ${
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
            {isEditMode && match.stage === 'ROUND_OF_32' ? (
              <select
                value={match.teamB || ''}
                onChange={(e) => onUpdateR32Team(match.id, 'teamB', e.target.value || null)}
                className="w-[120px] text-[10px] bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white"
              >
                <option value="">{match.placeholderB || 'Đội B'}</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                {teamB ? (
                  <img
                    src={getFlagUrl(teamB.id)}
                    alt={teamB.name}
                    className="w-4.5 h-3 object-cover rounded-sm shadow-sm select-none flex-shrink-0 border border-slate-700/30"
                  />
                ) : (
                  <span className="text-slate-500 text-[10px]">🏳️</span>
                )}
                <span
                  className={`font-semibold truncate ${
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
            )}

            {isEditMode ? (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={match.scoreB ?? ''}
                onChange={handleScoreBChange}
                placeholder="-"
                disabled={!match.teamB}
                className="w-7 h-6 rounded bg-slate-800 text-center text-xs font-bold border border-slate-700 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            ) : (
              match.status !== 'UPCOMING' && (
                <span
                  className={`font-extrabold pr-1 text-sm ${
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
            <div className="bg-slate-950/80 px-2 py-1 flex items-center justify-between text-[8px] text-amber-400 gap-1.5 border-t border-slate-800 select-none">
              <span>Đội thắng PK:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onSelectWinner(match.id, match.teamA!)}
                  className={`px-1 py-0.5 rounded text-[8px] border ${
                    match.winner === match.teamA ? 'bg-amber-500 text-slate-950 border-transparent font-bold' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => onSelectWinner(match.id, match.teamB!)}
                  className={`px-1 py-0.5 rounded text-[8px] border ${
                    match.winner === match.teamB ? 'bg-amber-500 text-slate-950 border-transparent font-bold' : 'bg-slate-800 border-slate-700'
                  }`}
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
        style={{ minWidth: '1150px' }}
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

      <div className="min-w-[1150px] flex justify-between gap-6 px-4 relative z-10">
        {/* Vòng 1/16 (Round of 32) */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest bg-slate-950/80 py-1.5 rounded border border-slate-800 select-none">
            Vòng 1/16 (32 đội)
          </h4>
          <div className="flex flex-col gap-4 py-2">
            {r32.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Vòng 1/8 (Round of 16) */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest bg-slate-950/80 py-1.5 rounded border border-slate-800 select-none">
            Vòng 1/8 (16 đội)
          </h4>
          <div className="flex flex-col gap-[76px] py-12 justify-around">
            {r16.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Tứ Kết */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest bg-slate-950/80 py-1.5 rounded border border-slate-800 select-none">
            Tứ Kết
          </h4>
          <div className="flex flex-col gap-[220px] py-24 justify-around">
            {qf.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Bán Kết */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest bg-slate-950/80 py-1.5 rounded border border-slate-800 select-none">
            Bán Kết
          </h4>
          <div className="flex flex-col gap-[510px] py-48 justify-around">
            {sf.map((m) => renderBracketNode(m))}
          </div>
        </div>

        {/* Chung Kết & Tranh Hạng 3 */}
        <div className="flex flex-col gap-4 justify-start">
          <h4 className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest bg-slate-950/80 py-1.5 rounded border border-slate-800 select-none">
            Chung Kết / Tranh Hạng 3
          </h4>
          <div className="flex flex-col gap-16 py-32 justify-center">
            {/* Chung Kết (F_1) */}
            <div className="space-y-1">
              <span className="text-[9px] text-amber-400 uppercase font-extrabold block text-center select-none">
                🏆 Trận Chung Kết 🏆
              </span>
              {f.map((m) => renderBracketNode(m))}
            </div>

            {/* Tranh Hạng 3 (TP_1) */}
            <div className="space-y-1 pt-12">
              <span className="text-[9px] text-cyan-400 uppercase font-extrabold block text-center select-none">
                🥉 Tranh Hạng Ba 🥉
              </span>
              {tp.map((m) => renderBracketNode(m))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
