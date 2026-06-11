'use client';

import React from 'react';
import { Team } from '@/types';
import { getFlagUrl } from '@/utils/helpers';

interface GroupsGridProps {
  teams: Team[];
  groupRange: string[]; // e.g. ['A', 'C', 'E', 'B', 'D', 'F'] or ['G', 'I', 'K', 'H', 'J', 'L']
}

// Solid vibrant background colors for each group header
const groupHeaderStyles: Record<string, string> = {
  A: 'bg-green-500 text-white',
  B: 'bg-red-600 text-white',
  C: 'bg-yellow-500 text-gray-900',
  D: 'bg-blue-600 text-white',
  E: 'bg-purple-600 text-white',
  F: 'bg-orange-500 text-white',
  G: 'bg-pink-600 text-white',
  H: 'bg-teal-500 text-white',
  I: 'bg-cyan-500 text-gray-900',
  J: 'bg-indigo-600 text-white',
  K: 'bg-violet-600 text-white',
  L: 'bg-slate-500 text-white',
};

export default function GroupsGrid({ teams, groupRange }: GroupsGridProps) {
  // Group teams
  const groupsList: Record<string, Team[]> = {};

  groupRange.forEach((g) => {
    groupsList[g] = [];
  });

  teams.forEach((t) => {
    if (groupsList[t.group]) {
      groupsList[t.group].push(t);
    }
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      {groupRange.map((g) => {
        const headerStyle = groupHeaderStyles[g] || 'bg-slate-500 text-white';
        return (
          <div
            key={g}
            className="flex flex-col rounded-lg overflow-hidden shadow-lg select-none"
          >
            {/* Group Header (Vibrant Solid Color) */}
            <div className={`px-2 py-1.5 text-center font-black text-[11px] uppercase tracking-wider ${headerStyle}`}>
              Bảng {g}
            </div>

            {/* Teams List (Translucent White Background & Thin Border) */}
            <div className="flex-1 p-2 bg-white/10 border border-white/20 border-t-0 rounded-b-lg flex flex-col gap-1.5 backdrop-blur-sm">
              {groupsList[g].map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-white truncate"
                >
                  <img
                    src={getFlagUrl(t.id)}
                    alt={t.name}
                    className="w-3.5 h-2.5 object-cover rounded-sm shadow-sm select-none flex-shrink-0 border border-white/10"
                  />
                  <span className="truncate">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
