import type { CharacterAppearance } from './appearance';

export type { CharacterAppearance } from './appearance';

export interface CharacterSummary {
  id: number;
  slot: 1 | 2 | 3;
  firstName: string;
  lastName: string;
  level: number;
  cash: number;
  bank: number;
  appearance: CharacterAppearance;
}
