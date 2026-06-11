'use client';

import React from 'react';
import { Match, Team } from '@/types';
import { formatMatchTime, formatMatchDate } from '@/utils/date';
import { getFlagUrl } from '@/utils/helpers';

interface FinalCardProps {
  match: Match | undefined;
  title: string;
  borderClass: string;
  textGlowClass: string;
  teams: Team[];
  isEditMode: boolean;
  useUTC: boolean;
  updateMatch: (matchId: string, scoreA: number | null, scoreB: number | null, status: Match['status']) => void;
  setKnockoutWinner: (matchId: string, winnerId: string) => void;
}

export default function FinalCard({
  match,
  title,
  borderClass,
  textGlowClass,
  teams,
  isEditMode,
  useUTC,
  updateMatch,
  setKnockoutWinner,
}: FinalCardProps) {
  if (!match) return null;
  const teamA = teams.find((t) => t.id === match.teamA);
  const teamB = teams.find((t) => t.id === match.teamB);

  const handleScoreChange = (slot: 'A' | 'B', val: string) => {
    const score = val === '' ? null : parseInt(val);
    const scoreA = slot === 'A' ? score : match.scoreA;
    const scoreB = slot === 'B' ? score : match.scoreB;
    updateMatch(
      match.id,
      scoreA,
      scoreB,
      scoreA !== null || scoreB !== null ? 'FINISHED' : 'UPCOMING'
    );
  };

  return (
    <div
      className={`p-4 rounded-xl border bg-slate-950/60 backdrop-blur-md shadow-xl ${borderClass} flex flex-col items-center text-center space-y-3 relative overflow-hidden transition-all duration-300 hover:scale-[1.03]`}
    >
      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${textGlowClass}`}>
        {title}
      </span>
      <div className="text-[10px] font-semibold text-slate-400">
        {match.vnDate ? `${match.vnDate}` : formatMatchDate(match.date, useUTC)} •{' '}
        <span className="text-white bg-slate-800 px-1.5 py-0.5 rounded">
          {match.vnTime || formatMatchTime(match.date, useUTC)}
        </span>
      </div>

      <div className="flex items-center justify-between w-full gap-2 px-2 py-1">
        {/* Team A */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          {teamA ? (
            <img
              src={getFlagUrl(teamA.id)}
              alt={teamA.name}
              className="w-8 h-5.5 object-cover rounded shadow-md select-none mb-1 border border-slate-700/30"
            />
          ) : (
            <span className="text-2xl mb-1 opacity-20">🏳️</span>
          )}
          <span
            className={`text-xs font-bold truncate max-w-[100px] ${match.status === 'FINISHED' && match.winner === match.teamA
                ? 'text-emerald-400'
                : 'text-slate-200'
              }`}
          >
            {teamA?.name || match.placeholderA || 'Chưa rõ'}
          </span>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 flex items-center justify-center min-w-[60px]">
          {isEditMode ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={match.scoreA ?? ''}
                onChange={(e) => handleScoreChange('A', e.target.value)}
                placeholder="-"
                className="w-7 h-7 rounded bg-slate-800 text-center text-xs font-bold border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-600 text-[10px] font-bold">-</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={match.scoreB ?? ''}
                onChange={(e) => handleScoreChange('B', e.target.value)}
                placeholder="-"
                className="w-7 h-7 rounded bg-slate-800 text-center text-xs font-bold border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          ) : match.status !== 'UPCOMING' ? (
            <span className="text-lg font-black text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">
              {match.scoreA} - {match.scoreB}
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded-full">
              VS
            </span>
          )}
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          {teamB ? (
            <img
              src={getFlagUrl(teamB.id)}
              alt={teamB.name}
              className="w-8 h-5.5 object-cover rounded shadow-md select-none mb-1 border border-slate-700/30"
            />
          ) : (
            <span className="text-2xl mb-1 opacity-20">🏳️</span>
          )}
          <span
            className={`text-xs font-bold truncate max-w-[100px] ${match.status === 'FINISHED' && match.winner === match.teamB
                ? 'text-emerald-400'
                : 'text-slate-200'
              }`}
          >
            {teamB?.name || match.placeholderB || 'Chưa rõ'}
          </span>
        </div>
      </div>

      {/* Penalty tie resolver */}
      {isEditMode &&
        match.scoreA !== null &&
        match.scoreB !== null &&
        match.scoreA === match.scoreB &&
        match.teamA &&
        match.teamB && (
          <div className="pt-2 border-t border-slate-900 text-[9px] text-amber-400 flex flex-col items-center gap-1 w-full">
            <span>Luân lưu! Chọn đội vô địch:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setKnockoutWinner(match.id, match.teamA!)}
                className={`px-2 py-0.5 rounded border text-[9px] ${match.winner === match.teamA
                    ? 'bg-amber-500 text-slate-950 font-bold border-transparent'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
              >
                {teamA?.name}
              </button>
              <button
                onClick={() => setKnockoutWinner(match.id, match.teamB!)}
                className={`px-2 py-0.5 rounded border text-[9px] ${match.winner === match.teamB
                    ? 'bg-amber-500 text-slate-950 font-bold border-transparent'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
              >
                {teamB?.name}
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
