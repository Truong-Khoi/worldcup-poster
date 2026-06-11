export type MatchStage =
  | 'GROUP'
  | 'ROUND_OF_32'
  | 'ROUND_OF_16'
  | 'QUARTER_FINAL'
  | 'SEMI_FINAL'
  | 'THIRD_PLACE'
  | 'FINAL';

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';

export interface Team {
  id: string;
  name: string;
  flag: string;
  group: string;
}

export interface Match {
  id: string;
  stage: MatchStage;
  group?: string;
  date: string; // ISO format
  vnDate?: string; // Vietnam date display (e.g. "12/06")
  vnTime?: string; // Vietnam time display (e.g. "02:00")
  teamA: string | null; // Team ID
  teamB: string | null; // Team ID
  scoreA: number | null;
  scoreB: number | null;
  status: MatchStatus;
  winner: string | null; // Team ID
  label?: string;
  placeholderA?: string;
  placeholderB?: string;
}

export interface GroupData {
  name: string;
  teams: Team[];
}
