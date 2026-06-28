'use client';

import React from 'react';
import { Match, Team } from '@/types';
import { formatMatchTime, formatMatchDate } from '@/utils/date';
import { getFlagUrl } from '@/utils/helpers';

interface MatchTableProps {
  matches: Match[];
  teams: Team[];
  isEditMode: boolean;
  useUTC: boolean;
  title: string;
  headerBgClass?: string;
  onUpdateScore: (matchId: string, scoreA: number | null, scoreB: number | null, status: Match['status']) => void;
  onSelectWinner: (matchId: string, winnerId: string) => void;
  onUpdateR32Team?: (matchId: string, slot: 'teamA' | 'teamB', teamId: string | null) => void;
}

export default function MatchTable({
  matches,
  teams,
  isEditMode,
  useUTC,
  title,
  headerBgClass = 'bg-blue-900/80',
  onUpdateScore,
  onSelectWinner,
  onUpdateR32Team,
}: MatchTableProps) {

  // Format Date for Table (e.g. "12-06")
  const getTableDate = (m: Match) => {
    if (m.vnDate) return m.vnDate;
    const date = new Date(m.date);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      timeZone: useUTC ? 'UTC' : 'Asia/Ho_Chi_Minh',
    };
    return date.toLocaleDateString('vi-VN', options);
  };

  // Format Time for Table (e.g. "22:00")
  const getTableTime = (m: Match) => {
    if (m.vnTime) return m.vnTime;
    return formatMatchTime(m.date, useUTC);
  };

  const handleScoreChange = (match: Match, slot: 'A' | 'B', val: string) => {
    const score = val === '' ? null : parseInt(val);
    const scoreA = slot === 'A' ? score : match.scoreA;
    const scoreB = slot === 'B' ? score : match.scoreB;

    let nextStatus: Match['status'] = 'UPCOMING';
    if (scoreA !== null || scoreB !== null) {
      nextStatus = 'FINISHED';
    }

    onUpdateScore(match.id, scoreA, scoreB, nextStatus);
  };

  // Group matches by date and sort matches within each date group by time ascending
  const groupedMatches = React.useMemo(() => {
    const groups: { date: string; list: Match[] }[] = [];
    matches.forEach((m) => {
      const dateStr = getTableDate(m);
      let group = groups.find((g) => g.date === dateStr);
      if (!group) {
        group = { date: dateStr, list: [] };
        groups.push(group);
      }
      group.list.push(m);
    });

    // Sort matches in each day by kickoff time ascending
    groups.forEach((g) => {
      g.list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return groups;
  }, [matches, useUTC]);

  const groupColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
    A: { bg: 'bg-emerald-950/70', text: 'text-emerald-400', border: 'border-emerald-500/40', accent: 'bg-emerald-500' },
    B: { bg: 'bg-red-950/70', text: 'text-red-400', border: 'border-red-500/40', accent: 'bg-red-500' },
    C: { bg: 'bg-amber-950/70', text: 'text-amber-400', border: 'border-amber-500/40', accent: 'bg-amber-500' },
    D: { bg: 'bg-blue-950/70', text: 'text-blue-400', border: 'border-blue-500/40', accent: 'bg-blue-500' },
    E: { bg: 'bg-lime-950/70', text: 'text-lime-400', border: 'border-lime-500/40', accent: 'bg-lime-500' },
    F: { bg: 'bg-orange-950/70', text: 'text-orange-400', border: 'border-orange-500/40', accent: 'bg-orange-500' },
    G: { bg: 'bg-pink-950/70', text: 'text-pink-400', border: 'border-pink-500/40', accent: 'bg-pink-500' },
    H: { bg: 'bg-teal-950/70', text: 'text-teal-400', border: 'border-teal-500/40', accent: 'bg-teal-500' },
    I: { bg: 'bg-sky-950/70', text: 'text-sky-400', border: 'border-sky-500/40', accent: 'bg-sky-500' },
    J: { bg: 'bg-indigo-950/70', text: 'text-indigo-400', border: 'border-indigo-500/40', accent: 'bg-indigo-500' },
    K: { bg: 'bg-violet-950/70', text: 'text-violet-400', border: 'border-violet-500/40', accent: 'bg-violet-500' },
    L: { bg: 'bg-zinc-900/80', text: 'text-zinc-300', border: 'border-zinc-500/40', accent: 'bg-zinc-500' },
  };

  const getGroupColor = (m: Match) => {
    if (m.stage === 'GROUP') {
      return groupColors[m.group || ''] || groupColors.L;
    }
    if (m.stage === 'ROUND_OF_32') return { bg: 'bg-indigo-950/70', text: 'text-indigo-400', border: 'border-indigo-500/40', accent: 'bg-indigo-500' };
    if (m.stage === 'ROUND_OF_16') return { bg: 'bg-violet-950/70', text: 'text-violet-400', border: 'border-violet-500/40', accent: 'bg-violet-500' };
    if (m.stage === 'QUARTER_FINAL') return { bg: 'bg-fuchsia-950/70', text: 'text-fuchsia-400', border: 'border-fuchsia-500/40', accent: 'bg-fuchsia-500' };
    if (m.stage === 'SEMI_FINAL') return { bg: 'bg-rose-950/70', text: 'text-rose-400', border: 'border-rose-500/40', accent: 'bg-rose-500' };
    return { bg: 'bg-slate-900/80', text: 'text-slate-300', border: 'border-slate-700/50', accent: 'bg-slate-700' };
  };

  const isGroupStage = React.useMemo(() => {
    return matches.some((m) => m.stage === 'GROUP');
  }, [matches]);

  return (
    <div className="w-full flex flex-col gap-3 bg-transparent">
      {/* Title Header */}
      {title && (
        <div className={`px-4 py-2 ${headerBgClass} text-white font-extrabold uppercase text-[11px] tracking-wider text-center select-none rounded-xl shadow-md`}>
          {title}
        </div>
      )}

      {/* Table Column Headers */}
      <div className="w-full flex bg-blue-100 border border-gray-300 rounded-lg text-blue-900 font-bold uppercase text-[10px] tracking-wider py-2 select-none shadow-sm">
        <div className="w-[16%] text-center border-r border-gray-300">NGÀY</div>
        <div className="w-[12%] text-center border-r border-gray-300">GIỜ</div>
        <div className="w-[12%] text-center border-r border-gray-300">{isGroupStage ? 'BẢNG' : 'TRẬN'}</div>
        <div className="flex-1 text-center">ĐỘI THI ĐẤU</div>
      </div>

      {/* Grouped Day Blocks */}
      {groupedMatches.map((group) => (
        <div
          key={group.date}
          className="flex border border-gray-300 rounded-xl overflow-hidden shadow-md bg-white transition-colors"
        >
          {/* Left Date Block */}
          <div className="w-[16%] flex-shrink-0 bg-gray-50 border-r border-gray-300 flex items-center justify-center font-black text-[12px] text-gray-800 select-none py-4 text-center">
            {group.date}
          </div>

          {/* Right Rows Column */}
          <div className="flex-1 flex flex-col divide-y divide-gray-300">
            {group.list.map((m) => {
              const teamA = teams.find((t) => t.id === m.teamA);
              const teamB = teams.find((t) => t.id === m.teamB);
              const color = getGroupColor(m);
              const displayLabel = m.stage === 'GROUP'
                ? m.group
                : m.stage === 'FINAL'
                  ? 'CK'
                  : m.stage === 'THIRD_PLACE'
                    ? '3'
                    : m.label ? m.label.replace('Trận ', '') : m.id;

              return (
                <div
                  key={m.id}
                  className={`flex items-center py-2.5 text-[11px] hover:bg-gray-50 transition-colors ${m.status === 'LIVE' ? 'bg-red-50/70 border-y border-red-200' : ''
                    }`}
                >
                  {/* Time */}
                  <div className="w-[14.3%] text-center font-bold text-gray-900 border-r border-gray-300">
                    {getTableTime(m)}
                  </div>

                  {/* Group badge */}
                  <div className="w-[14.3%] flex justify-center border-r border-gray-300 select-none text-center">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-black text-[10px] shadow-sm text-white ${color.accent}`}>
                      {displayLabel}
                    </span>
                  </div>

                  {/* Matchup & Score */}
                  <div className="flex-1 px-3">
                    <div className="flex items-center justify-between gap-1 w-full">
                      {/* Team A or input */}
                      <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0 text-center">
                          <span
                            className={`font-bold truncate text-right ${m.status === 'FINISHED' && m.winner === m.teamA
                                ? 'text-emerald-700 font-black'
                                : m.status === 'FINISHED' && m.winner !== m.teamA
                                  ? 'text-gray-400 font-normal opacity-60'
                                  : 'text-gray-900'
                              }`}
                          >
                            {teamA?.name || m.placeholderA || 'Chưa rõ'}
                          </span>
                        {teamA ? (
                          <img
                            src={getFlagUrl(teamA.id)}
                            alt={teamA.name}
                            className="w-4 h-2.5 object-cover rounded-sm shadow-sm select-none flex-shrink-0 border border-gray-200"
                          />
                        ) : (
                          <span className="text-xs select-none">🏳️</span>
                        )}
                      </div>

                      {/* Scores area */}
                      <div className="flex-shrink-0 flex items-center justify-center px-1.5 min-w-[50px] text-center">
                        {isEditMode ? (
                          <div className="flex items-center gap-0.5">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={m.scoreA ?? ''}
                              onChange={(e) => handleScoreChange(m, 'A', e.target.value)}
                              placeholder="-"
                              disabled={!m.teamA}
                              className="w-5 h-5 rounded bg-gray-50 text-center text-[10px] font-bold border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 disabled:opacity-30"
                            />
                            <span className="text-gray-400 text-[9px] font-bold select-none">-</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={m.scoreB ?? ''}
                              onChange={(e) => handleScoreChange(m, 'B', e.target.value)}
                              placeholder="-"
                              disabled={!m.teamB}
                              className="w-5 h-5 rounded bg-gray-50 text-center text-[10px] font-bold border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 disabled:opacity-30"
                            />
                          </div>
                        ) : m.status !== 'UPCOMING' ? (
                          <span
                            className={`font-extrabold text-[11px] bg-gray-50 border border-gray-250 px-1.5 py-0.5 rounded ${m.status === 'LIVE' ? 'text-red-600 ring-1 ring-red-300 animate-pulse' : 'text-gray-900'
                              }`}
                          >
                            {m.scoreA} : {m.scoreB}
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 select-none">
                            -
                          </span>
                        )}
                      </div>

                      {/* Team B or input */}
                      <div className="flex-1 flex items-center justify-start gap-1.5 min-w-0 text-center">
                        {teamB ? (
                          <img
                            src={getFlagUrl(teamB.id)}
                            alt={teamB.name}
                            className="w-4 h-2.5 object-cover rounded-sm shadow-sm select-none flex-shrink-0 border border-gray-200"
                          />
                        ) : (
                          <span className="text-xs select-none">🏳️</span>
                        )}
                          <span
                            className={`font-bold truncate text-left ${m.status === 'FINISHED' && m.winner === m.teamB
                                ? 'text-emerald-700 font-black'
                                : m.status === 'FINISHED' && m.winner !== m.teamB
                                  ? 'text-gray-400 font-normal opacity-60'
                                  : 'text-gray-900'
                              }`}
                          >
                            {teamB?.name || m.placeholderB || 'Chưa rõ'}
                          </span>
                      </div>
                    </div>

                    {/* Tie match winner selection for Penalty shootout */}
                    {isEditMode &&
                      m.stage !== 'GROUP' &&
                      m.scoreA !== null &&
                      m.scoreB !== null &&
                      m.scoreA === m.scoreB &&
                      m.teamA &&
                      m.teamB && (
                        <div className="mt-1.5 pt-1.5 border-t border-gray-200 flex items-center justify-between text-[9px] text-amber-700 select-none text-center">
                          <span>Hòa PK! Chọn đội thắng:</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onSelectWinner(m.id, m.teamA!)}
                              className={`px-1.5 py-0.5 rounded border ${m.winner === m.teamA
                                  ? 'bg-amber-500 text-white border-transparent font-bold'
                                  : 'bg-gray-100 border-gray-300 text-gray-700'
                                }`}
                            >
                              {teamA?.name}
                            </button>
                            <button
                              onClick={() => onSelectWinner(m.id, m.teamB!)}
                              className={`px-1.5 py-0.5 rounded border ${m.winner === m.teamB
                                  ? 'bg-amber-500 text-white border-transparent font-bold'
                                  : 'bg-gray-100 border-gray-300 text-gray-700'
                                }`}
                            >
                              {teamB?.name}
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
