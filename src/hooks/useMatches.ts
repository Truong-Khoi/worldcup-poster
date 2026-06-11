'use client';

import { useState, useEffect } from 'react';
import { Match, Team, MatchStage } from '@/types';
import initialMatches from '@/data/matches.json';
import initialTeams from '@/data/teams.json';

const STORAGE_KEY_MATCHES = 'worldcup_2026_matches_v1';
const STORAGE_KEY_TEAMS = 'worldcup_2026_teams_v1';

import { progressionMap, loserProgressionMap } from '@/constants/progression';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load from local storage or defaults on mount
  useEffect(() => {
    const savedMatches = localStorage.getItem(STORAGE_KEY_MATCHES);
    const savedTeams = localStorage.getItem(STORAGE_KEY_TEAMS);

    if (savedMatches) {
      try {
        const parsed = JSON.parse(savedMatches) as Match[];
        // Merge vnDate/vnTime from initial data (these are display-only fields from the poster)
        const initialMap = new Map((initialMatches as Match[]).map(m => [m.id, m]));
        const merged = parsed.map(m => {
          const init = initialMap.get(m.id);
          return init
            ? {
                ...m,
                vnDate: init.vnDate,
                vnTime: init.vnTime,
                placeholderA: init.placeholderA,
                placeholderB: init.placeholderB,
                label: init.label,
                date: init.date,
                stage: init.stage,
              }
            : m;
        });
        setMatches(merged);
      } catch (e) {
        setMatches(initialMatches as Match[]);
      }
    } else {
      setMatches(initialMatches as Match[]);
    }

    // Always use fresh teams from initialTeams to prevent stale cached data when teams.json is updated
    setTeams(initialTeams as Team[]);
    if (savedTeams) {
      localStorage.removeItem(STORAGE_KEY_TEAMS);
    }

    setIsLoaded(true);
  }, []);

  // Sync to local storage
  const saveToStorage = (updatedMatches: Match[], updatedTeams?: Team[]) => {
    localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(updatedMatches));
    if (updatedTeams) {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(updatedTeams));
    }
  };

  // Update a match's scores, status, and winner
  const updateMatch = (
    matchId: string,
    scoreA: number | null,
    scoreB: number | null,
    status: Match['status'] = 'FINISHED'
  ) => {
    let updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        let winner: string | null = null;
        if (scoreA !== null && scoreB !== null) {
          if (scoreA > scoreB) winner = m.teamA;
          else if (scoreB > scoreA) winner = m.teamB;
          // In knockout, ties must be resolved (penalties/extra time)
          // For simplicity, if scores are equal, we don't declare winner automatically,
          // but winner can be set manually or we default to none unless they select.
        }

        return {
          ...m,
          scoreA,
          scoreB,
          status,
          winner,
        };
      }
      return m;
    });

    // Handle progressions for knockout matches
    const updatedMatch = updatedMatches.find((m) => m.id === matchId);
    if (updatedMatch && scoreA !== null && scoreB !== null) {
      // Determine winner id
      let winnerId = updatedMatch.winner;
      let loserId: string | null = null;

      if (scoreA === scoreB) {
        // Tie in knockout - let's ask the user or default to teamA for progression,
        // but let's allow manual winner picking in UI. We'll default to teamA winner here just to avoid nulls.
        winnerId = updatedMatch.teamA;
        loserId = updatedMatch.teamB;
      } else {
        winnerId = scoreA > scoreB ? updatedMatch.teamA : updatedMatch.teamB;
        loserId = scoreA > scoreB ? updatedMatch.teamB : updatedMatch.teamA;
      }

      // 1. Winner progression
      const progression = progressionMap[matchId];
      if (progression) {
        updatedMatches = updateTargetMatchSlot(
          updatedMatches,
          progression.targetMatchId,
          progression.slot,
          winnerId
        );
      }

      // 2. Loser progression (for Semis -> Third Place)
      const loserProgression = loserProgressionMap[matchId];
      if (loserProgression) {
        updatedMatches = updateTargetMatchSlot(
          updatedMatches,
          loserProgression.targetMatchId,
          loserProgression.slot,
          loserId
        );
      }
    }

    setMatches(updatedMatches);
    saveToStorage(updatedMatches);
  };

  // Explicitly select a winner (useful for penalty shootout ties)
  const setKnockoutWinner = (matchId: string, winnerId: string) => {
    let updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        const loserId = winnerId === m.teamA ? m.teamB : m.teamA;
        return {
          ...m,
          winner: winnerId,
          status: 'FINISHED' as const,
        };
      }
      return m;
    });

    const m = matches.find((match) => match.id === matchId);
    if (m) {
      const loserId = winnerId === m.teamA ? m.teamB : m.teamA;

      const progression = progressionMap[matchId];
      if (progression) {
        updatedMatches = updateTargetMatchSlot(
          updatedMatches,
          progression.targetMatchId,
          progression.slot,
          winnerId
        );
      }

      const loserProgression = loserProgressionMap[matchId];
      if (loserProgression) {
        updatedMatches = updateTargetMatchSlot(
          updatedMatches,
          loserProgression.targetMatchId,
          loserProgression.slot,
          loserId
        );
      }
    }

    setMatches(updatedMatches);
    saveToStorage(updatedMatches);
  };

  // Edit the selected teams in the Round of 32 (starts the bracket tree)
  const updateR32Team = (matchId: string, slot: 'teamA' | 'teamB', teamId: string | null) => {
    const updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return {
          ...m,
          [slot]: teamId,
          // Reset status and scores if teams change
          scoreA: null,
          scoreB: null,
          status: 'UPCOMING' as const,
          winner: null,
        };
      }
      return m;
    });

    setMatches(updatedMatches);
    saveToStorage(updatedMatches);
  };

  // Helper to promote team to target match slot
  const updateTargetMatchSlot = (
    matchList: Match[],
    targetMatchId: string,
    slot: 'teamA' | 'teamB',
    teamId: string | null
  ): Match[] => {
    return matchList.map((m) => {
      if (m.id === targetMatchId) {
        return {
          ...m,
          [slot]: teamId,
          // Reset score/winner of the next stage match since the team changed
          scoreA: null,
          scoreB: null,
          status: 'UPCOMING' as const,
          winner: null,
        };
      }
      return m;
    });
  };

  // Reset all data to initial state
  const resetAll = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ tỷ số và lịch thi đấu về mặc định không?')) {
      setMatches(initialMatches as Match[]);
      setTeams(initialTeams as Team[]);
      localStorage.removeItem(STORAGE_KEY_MATCHES);
      localStorage.removeItem(STORAGE_KEY_TEAMS);
    }
  };

  return {
    matches,
    teams,
    isLoaded,
    isEditMode,
    setIsEditMode,
    updateMatch,
    setKnockoutWinner,
    updateR32Team,
    resetAll,
  };
}
