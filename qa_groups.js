export const PIN_START_INTROS = {};
export const QA_BY_GROUP = {};
export const RIDDLE_POOL = [];
export const SPEED_POOL = { kid: [], teen: [], adult: [] };
export const BATTLE_POOL = { kid: [], teen: [], adult: [] };
export const FAMILY_POOL = { kid: [], teen: [], adult: [] };
export const ACTIVITY_POOL = { kid: [], teen: [], adult: [] };
export const ABBEY_GHOST_POOL = { kid: [], teen: [], adult: [] };
export const GENERIC_GHOST_POOL = { kid: [], teen: [], adult: [] };
export const DISCOVERY_PIN_CONTENT = {};
export const GHOST_PIN_CONTENT = {};
export const BOSS_PIN_CONTENT = {};
export const HISTORY_MASTER_BANK = { kid: [], teen: [], adult: [] };

export function getHistoryMasterBank(tier = "kid") {
  return Array.isArray(HISTORY_MASTER_BANK[tier])
    ? HISTORY_MASTER_BANK[tier]
    : HISTORY_MASTER_BANK.kid;
}
