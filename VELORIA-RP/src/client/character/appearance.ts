import { Events } from '../../shared/events';
import type { CharacterAppearance, OverlayStyle } from '../../shared/types/appearance';

const FEATURE_INDEX: Record<string, number> = {
  noseWidth: 0,
  noseHeight: 1,
  noseLength: 2,
  noseBridge: 3,
  noseTip: 4,
  noseShift: 5,
  browHeight: 6,
  browWidth: 7,
  cheekboneHeight: 8,
  cheekboneWidth: 9,
  cheekWidth: 10,
  eyeOpening: 11,
  lipThickness: 12,
  jawWidth: 13,
  jawHeight: 14,
  chinLength: 15,
  chinPosition: 16,
  chinWidth: 17,
  chinShape: 18,
  neckWidth: 19
};

const OVERLAY_INDEX: Record<string, number> = {
  blemishes: 0,
  beard: 1,
  eyebrows: 2,
  ageing: 3,
  makeup: 4,
  complexion: 6,
  sunDamage: 7,
  lipstick: 8,
  chestHair: 10
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

/**
 * RAGE MP Player#setHeadOverlay has had different JS signatures between
 * client builds. Calling the entity helper with only three arguments causes
 * "argument count does not match function definition" on Legacy clients.
 * Use the GTA V native wrappers instead; their signatures are stable.
 */
function applyOverlay(ped: any, name: string, overlay: OverlayStyle | undefined) {
  if (!overlay) return;
  const overlayId = OVERLAY_INDEX[name];
  if (overlayId === undefined) return;

  const index = Math.max(0, Math.trunc(Number(overlay.index ?? 0)));
  const opacity = clamp(Number(overlay.opacity ?? 0), 0, 1);
  const handle = Number(ped?.handle ?? 0);
  if (!handle) return;

  try {
    mp.game.ped.setPedHeadOverlay(handle, overlayId, index, opacity);
  } catch {
    // Do not abort character selection/spawn if a specific client build
    // rejects an optional cosmetic native.
    return;
  }

  if (overlay.color === undefined) return;
  const colorType = name === 'makeup' || name === 'lipstick' ? 2 : 1;
  const primary = Math.max(0, Math.trunc(Number(overlay.color)));
  const secondary = Math.max(0, Math.trunc(Number(overlay.secondaryColor ?? overlay.color)));
  try {
    mp.game.ped.setPedHeadOverlayColor(handle, overlayId, colorType, primary, secondary);
  } catch {
    // Color support is cosmetic; keep the player flow alive on Legacy builds.
  }
}

export function applyAppearance(appearance: CharacterAppearance) {
  const ped: any = mp.players.local as any;
  if (!ped || !appearance) return;

  const male = appearance.gender === 'male';
  const model = mp.game.joaat(male ? 'mp_m_freemode_01' : 'mp_f_freemode_01');
  if (ped.model !== model) ped.model = model;

  const parents = appearance.parents;
  ped.setHeadBlendData?.(
    Math.trunc(parents.mother), Math.trunc(parents.father), 0,
    Math.trunc(parents.mother), Math.trunc(parents.father), 0,
    clamp(parents.shapeMix, 0, 1), clamp(parents.skinMix, 0, 1), 0, false
  );

  for (const [name, raw] of Object.entries(appearance.faceFeatures ?? {})) {
    const index = FEATURE_INDEX[name];
    if (index !== undefined) ped.setFaceFeature?.(index, clamp(Number(raw), -1, 1));
  }

  ped.setComponentVariation?.(2, Math.max(0, Math.trunc(appearance.hair?.style ?? 0)), 0, 0);
  ped.setHairColor?.(Math.max(0, Math.trunc(appearance.hair?.color ?? 0)), Math.max(0, Math.trunc(appearance.hair?.highlight ?? appearance.hair?.color ?? 0)));
  ped.setEyeColor?.(Math.max(0, Math.trunc(appearance.eyeColor ?? 0)));

  applyOverlay(ped, 'eyebrows', appearance.eyebrows);
  applyOverlay(ped, 'beard', appearance.beard);
  applyOverlay(ped, 'makeup', appearance.makeup);
  applyOverlay(ped, 'blemishes', appearance.blemishes);
  applyOverlay(ped, 'ageing', appearance.ageing);
  applyOverlay(ped, 'complexion', appearance.complexion);
  applyOverlay(ped, 'sunDamage', appearance.sunDamage);
  applyOverlay(ped, 'lipstick', appearance.lipstick);
  applyOverlay(ped, 'chestHair', appearance.chestHair);

  const componentMap: Record<string, number> = { mask: 1, torso: 3, legs: 4, bags: 5, shoes: 6, accessories: 7, undershirt: 8, armor: 9, decals: 10, tops: 11 };
  for (const [name, item] of Object.entries(appearance.clothing ?? {})) {
    const component = componentMap[name];
    if (component === undefined || !item) continue;
    ped.setComponentVariation?.(component, Math.max(0, Math.trunc(Number(item.drawable ?? 0))), Math.max(0, Math.trunc(Number(item.texture ?? 0))), 0);
  }
}

function parseAppearance(json: string): CharacterAppearance | null {
  try { return JSON.parse(String(json ?? '')) as CharacterAppearance; }
  catch { return null; }
}

mp.events.add(Events.CharacterSpawned, (_characterId: number, appearanceJson?: string) => {
  const appearance = parseAppearance(String(appearanceJson ?? ''));
  if (appearance) applyAppearance(appearance);
});

mp.events.add('veloria:character:appearance:preview', (appearanceJson: string) => {
  const appearance = parseAppearance(appearanceJson);
  if (appearance) applyAppearance(appearance);
});
