import { VeloriaEvents } from '../../shared/events/veloria';
import type { CharacterAppearance } from '../../shared/types/appearance';
import { VELORIA_CONFIG } from '../../shared/config/server';
import { suspendAuthCamera, resumeAuthCamera } from '../authScene';
import { applyAppearance } from './appearance';

let creatorCam: CameraMp | null = null;
let active = false;
let yaw = 180;
let distance = 2.1;
let mouseDown = false;
let lastX = 0;

function cameraPosition() {
  const p = mp.players.local.position;
  const r = yaw * Math.PI / 180;
  return new mp.Vector3(p.x + Math.sin(r) * distance, p.y + Math.cos(r) * distance, p.z + 0.65);
}

function refreshCamera() {
  if (!creatorCam) return;
  const pos = cameraPosition();
  creatorCam.setCoord(pos.x, pos.y, pos.z);
  creatorCam.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.65);
}

export function openCreator(initial?: Partial<CharacterAppearance>) {
  if (active) return;
  active = true;
  yaw = 180;
  distance = 2.1;
  suspendAuthCamera();

  const s = VELORIA_CONFIG.creatorScene;
  mp.players.local.position = new mp.Vector3(s.x, s.y, s.z);
  mp.players.local.setHeading(s.heading);
  mp.players.local.freezePosition(true);
  try { mp.players.local.setAlpha(255); } catch { /* compatibility */ }

  creatorCam = mp.cameras.new('default', cameraPosition(), new mp.Vector3(0, 0, 0), 45);
  refreshCamera();
  creatorCam.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
  mp.gui.cursor.show(true, true);
  mp.gui.chat.show(false);
  mp.events.call(VeloriaEvents.CharacterCreatorOpen, JSON.stringify(initial ?? {}));
}

export function closeCreator() {
  if (!active) return;
  active = false;
  mouseDown = false;
  mp.players.local.freezePosition(true);
  try { mp.players.local.setAlpha(0); } catch { /* compatibility */ }
  mp.gui.cursor.show(true, true);
  mp.gui.chat.show(false);
  if (creatorCam) {
    creatorCam.destroy();
    creatorCam = null;
  }
  mp.game.cam.renderScriptCams(false, false, 0, true, false);
  resumeAuthCamera();
  mp.events.call(VeloriaEvents.CharacterCreatorClose);
}

function installCefCreatorBridge() {
  mp.browsers.forEach((browser: BrowserMp) => {
    browser.execute(`(() => {
      if (window.__veloriaCreatorBridgeInstalled) return;
      window.__veloriaCreatorBridgeInstalled = true;
      let wasOpen = false;

      const range = (root, prefix, fallback) => {
        const labels = Array.from(root.querySelectorAll('label'));
        const label = labels.find(node => String(node.textContent || '').trim().startsWith(prefix));
        const input = label?.querySelector('input[type="range"]');
        const value = Number(input?.value ?? fallback);
        return Number.isFinite(value) ? value : fallback;
      };

      const emit = () => {
        const root = document.querySelector('.creator-screen');
        const isOpen = Boolean(root);
        if (isOpen !== wasOpen) {
          wasOpen = isOpen;
          window.mp?.trigger(isOpen ? 'veloria:cef:character:creator:open' : 'veloria:cef:character:creator:close', '{}');
        }
        if (!root) return;

        const buttons = Array.from(root.querySelectorAll('.mode-switch button'));
        const gender = buttons.find(button => button.classList.contains('active'))?.textContent?.includes('Жен') ? 'female' : 'male';
        const hairColor = range(root, 'Цвет волос', 0);
        const appearance = {
          gender,
          parents: {
            mother: range(root, 'Мать', 21),
            father: range(root, 'Отец', 0),
            shapeMix: range(root, 'Сходство', 0.5),
            skinMix: range(root, 'Тон кожи', 0.5)
          },
          faceFeatures: {},
          hair: {
            style: range(root, 'Прическа', 0),
            color: hairColor,
            highlight: hairColor
          },
          eyeColor: range(root, 'Глаза', 0),
          eyebrows: { index: range(root, 'Брови', 0), opacity: 1, color: hairColor },
          beard: { index: range(root, 'Борода', 0), opacity: gender === 'male' ? 1 : 0, color: hairColor },
          makeup: { index: 0, opacity: 0 },
          blemishes: { index: 0, opacity: 0 },
          ageing: { index: 0, opacity: 0 },
          complexion: { index: 0, opacity: 0 },
          sunDamage: { index: 0, opacity: 0 },
          lipstick: { index: 0, opacity: 0 },
          chestHair: { index: 0, opacity: 0 },
          clothing: {}
        };
        window.mp?.trigger('veloria:creator:appearance', JSON.stringify(appearance));
      };

      const observer = new MutationObserver(() => setTimeout(emit, 0));
      observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'value'] });
      document.addEventListener('input', emit, true);
      document.addEventListener('change', emit, true);
      document.addEventListener('click', () => setTimeout(emit, 0), true);
      document.addEventListener('wheel', event => {
        if (!document.querySelector('.creator-screen')) return;
        window.mp?.trigger('veloria:creator:zoom', Math.sign(Number(event.deltaY) || 0));
      }, { passive: true });
      emit();
    })();`);
  });
}

mp.events.add('playerReady', () => {
  setTimeout(installCefCreatorBridge, 750);
  setTimeout(installCefCreatorBridge, 2000);
});

mp.events.add('render', () => {
  if (!active) return;
  if (mp.game.controls.isDisabledControlPressed(0, 24)) {
    const [x] = mp.gui.cursor.position;
    if (!mouseDown) {
      mouseDown = true;
      lastX = x;
    }
    const dx = x - lastX;
    lastX = x;
    yaw += dx * 0.25;
    refreshCamera();
  } else {
    mouseDown = false;
  }
});

mp.events.add('veloria:creator:zoom', (delta: number) => {
  if (!active) return;
  distance = Math.max(1.25, Math.min(3.5, distance + delta * 0.1));
  refreshCamera();
});

mp.events.add('veloria:creator:appearance', (appearanceJson: string) => {
  if (!active) return;
  try {
    applyAppearance(JSON.parse(String(appearanceJson ?? '{}')) as CharacterAppearance);
  } catch {
    return;
  }
});

mp.events.add('veloria:cef:character:creator:open', (initialJson?: string) => {
  let initial: Partial<CharacterAppearance> = {};
  try { initial = JSON.parse(String(initialJson ?? '{}')) as Partial<CharacterAppearance>; } catch { /* defaults */ }
  openCreator(initial);
});

mp.events.add('veloria:cef:character:creator:close', closeCreator);
mp.events.add('veloria:character:spawned', () => {
  if (active) {
    active = false;
    mouseDown = false;
    if (creatorCam) {
      creatorCam.destroy();
      creatorCam = null;
    }
  }
});
