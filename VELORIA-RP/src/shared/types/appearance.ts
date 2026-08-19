export interface ParentBlend { mother: number; father: number; shapeMix: number; skinMix: number; }
export interface HairStyle { style: number; color: number; highlight: number; }
export interface FaceFeatureMap { [feature: string]: number; }
export interface OverlayStyle { index: number; opacity: number; color?: number; secondaryColor?: number; }
export interface CharacterAppearance {
  gender: 'male' | 'female';
  parents: ParentBlend;
  faceFeatures: FaceFeatureMap;
  hair: HairStyle;
  eyeColor: number;
  eyebrows: OverlayStyle;
  beard: OverlayStyle;
  makeup: OverlayStyle;
  blemishes: OverlayStyle;
  ageing: OverlayStyle;
  complexion: OverlayStyle;
  sunDamage: OverlayStyle;
  lipstick: OverlayStyle;
  chestHair: OverlayStyle;
  clothing: Record<string, { drawable: number; texture: number }>;
}
