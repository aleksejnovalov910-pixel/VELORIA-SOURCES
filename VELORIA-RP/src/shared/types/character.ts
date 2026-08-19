export interface CharacterAppearance {
  gender: 0 | 1;
  father: number;
  mother: number;
  resemblance: number;
  skinMix: number;
  hairStyle: number;
  hairColor: number;
  eyeColor: number;
  eyebrows: number;
  beard: number;
  faceFeatures: number[];
}

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
