// Mapping of winner progression in Knockout stage
export const progressionMap: Record<string, { targetMatchId: string; slot: 'teamA' | 'teamB' }> = {
  // Round of 32 -> Round of 16
  R32_1: { targetMatchId: 'R16_2', slot: 'teamA' }, // Trận 73 -> Trận 90, slot A
  R32_3: { targetMatchId: 'R16_2', slot: 'teamB' }, // Trận 75 -> Trận 90, slot B
  R32_2: { targetMatchId: 'R16_1', slot: 'teamA' }, // Trận 74 -> Trận 89, slot A
  R32_5: { targetMatchId: 'R16_1', slot: 'teamB' }, // Trận 77 -> Trận 89, slot B
  R32_4: { targetMatchId: 'R16_3', slot: 'teamA' }, // Trận 76 -> Trận 91, slot A
  R32_6: { targetMatchId: 'R16_3', slot: 'teamB' }, // Trận 78 -> Trận 91, slot B
  R32_7: { targetMatchId: 'R16_4', slot: 'teamA' }, // Trận 79 -> Trận 92, slot A
  R32_8: { targetMatchId: 'R16_4', slot: 'teamB' }, // Trận 80 -> Trận 92, slot B
  R32_11: { targetMatchId: 'R16_5', slot: 'teamA' }, // Trận 83 -> Trận 93, slot A
  R32_12: { targetMatchId: 'R16_5', slot: 'teamB' }, // Trận 84 -> Trận 93, slot B
  R32_9: { targetMatchId: 'R16_6', slot: 'teamA' }, // Trận 81 -> Trận 94, slot A
  R32_10: { targetMatchId: 'R16_6', slot: 'teamB' }, // Trận 82 -> Trận 94, slot B
  R32_14: { targetMatchId: 'R16_7', slot: 'teamA' }, // Trận 86 -> Trận 95, slot A
  R32_16: { targetMatchId: 'R16_7', slot: 'teamB' }, // Trận 88 -> Trận 95, slot B
  R32_13: { targetMatchId: 'R16_8', slot: 'teamA' }, // Trận 85 -> Trận 96, slot A
  R32_15: { targetMatchId: 'R16_8', slot: 'teamB' }, // Trận 87 -> Trận 96, slot B

  // Round of 16 -> Quarter finals
  R16_1: { targetMatchId: 'QF_1', slot: 'teamA' }, // Trận 89 -> Trận 97, slot A
  R16_2: { targetMatchId: 'QF_1', slot: 'teamB' }, // Trận 90 -> Trận 97, slot B
  R16_5: { targetMatchId: 'QF_2', slot: 'teamA' }, // Trận 93 -> Trận 98, slot A
  R16_6: { targetMatchId: 'QF_2', slot: 'teamB' }, // Trận 94 -> Trận 98, slot B
  R16_3: { targetMatchId: 'QF_3', slot: 'teamA' }, // Trận 91 -> Trận 99, slot A
  R16_4: { targetMatchId: 'QF_3', slot: 'teamB' }, // Trận 92 -> Trận 99, slot B
  R16_7: { targetMatchId: 'QF_4', slot: 'teamA' }, // Trận 95 -> Trận 100, slot A
  R16_8: { targetMatchId: 'QF_4', slot: 'teamB' }, // Trận 96 -> Trận 100, slot B

  // Quarter finals -> Semi finals
  QF_1: { targetMatchId: 'SF_1', slot: 'teamA' }, // Trận 97 -> Trận 101, slot A
  QF_2: { targetMatchId: 'SF_1', slot: 'teamB' }, // Trận 98 -> Trận 101, slot B
  QF_3: { targetMatchId: 'SF_2', slot: 'teamA' }, // Trận 99 -> Trận 102, slot A
  QF_4: { targetMatchId: 'SF_2', slot: 'teamB' }, // Trận 100 -> Trận 102, slot B

  // Semi finals -> Final (Winners go to F_1)
  SF_1: { targetMatchId: 'F_1', slot: 'teamA' }, // Trận 101 -> Chung Kết, slot A
  SF_2: { targetMatchId: 'F_1', slot: 'teamB' }, // Trận 102 -> Chung Kết, slot B
};

// Losers of Semi finals go to Third Place Playoff (TP_1)
export const loserProgressionMap: Record<string, { targetMatchId: string; slot: 'teamA' | 'teamB' }> = {
  SF_1: { targetMatchId: 'TP_1', slot: 'teamA' }, // Trận 101 -> Tranh Hạng 3, slot A
  SF_2: { targetMatchId: 'TP_1', slot: 'teamB' }, // Trận 102 -> Tranh Hạng 3, slot B
};
