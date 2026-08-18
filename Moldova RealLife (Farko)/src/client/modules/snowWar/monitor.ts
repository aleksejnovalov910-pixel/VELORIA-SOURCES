import { LangString, langStringDefault } from "../lang";
import { CustomEvent } from "../custom.event";
import { HudUpdateDTO, RegistrationDTO } from "../../../shared/snowWar/dtos";
import { guiNames } from "../../../shared/gui";
import { SNOW_WAR_WEAPON_HASH } from "../../../shared/snowWar/main.config";
import { system } from "../system";

mp.events.add("snowwar:update:registration", (data: RegistrationDTO) => {
  CustomEvent.triggerCef("snowwar:registration:update", data);
});

mp.events.add("snowwar:update:hud", (data: HudUpdateDTO) => {
  CustomEvent.triggerCef("snowwar:hud:update", data);
});

mp.events.add("gui:menuClosed", (closedGui: guiNames) => {
  if (closedGui !== "snowWar") return;

  CustomEvent.triggerServer("snowwar:registrationClose");
});

type SnowballTarget = {
  entity: EntityMp;
  time: number;
  position: Vector3Mp;
  targetPosition: Vector3Mp;
};

const targets: SnowballTarget[] = [];
let snowWarActive: boolean = false;


CustomEvent.registerServer("snowwar:activate", (toggle: boolean) => {
  snowWarActive = toggle;
});

/**
 * Handle snowball shot
 *
 * @function
 * @param targetPosition
 * @param entity
 * @returns {void}
 */
function handleSnowWarWeaponShot(sourcePlayer: EntityMp, position: Vector3Mp) {
  if (
    !sourcePlayer ||
    sourcePlayer.type !== "player" ||
    sourcePlayer.remoteId === mp.players.local.remoteId
  ) {
    mp.console.logInfo(LangString("monitor.990dc570132b6202a7d97f6cf489966c"));
    return;
  }

  CustomEvent.triggerServer("snowwar:outgoingDamage", sourcePlayer);

  targets.push({
    entity: sourcePlayer,
    targetPosition: position,
    time: system.timestamp,
    position: mp.players.local.position,
  });

  mp.gui.chat.push(
    LangString("monitor.13d1c7facbbee020c026c962fb9feac6", sourcePlayer, mp.players.local.remoteId),
  );
}

// mp.events.add(
//   'playerWeaponShot',
//   (targetPosition: Vector3Mp, targetEntity: EntityMp) => {
//     if (snowWarActive) {
//       handleSnowWarWeaponShot(targetPosition, targetEntity);
//       return;
//     }
//   },
// );

mp.events.add(
  "incomingDamage",
  (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
    mp.console.logInfo(
      LangString("monitor.478400f92d4b34607ea3259981d93a3c", sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage),
    );
  },
);

mp.events.add(
  "projectile",
  (
    sourcePlayer: EntityMp,
    weaponHash: number,
    ammoType: number,
    position: Vector3Mp,
    direction: Vector3Mp,
  ) => {
    if (snowWarActive && weaponHash === SNOW_WAR_WEAPON_HASH) {
      mp.console.logInfo(
        LangString("monitor.0d2b47777c9bfd0f9eb9f7f511847ac9", JSON.stringify(
          sourcePlayer,
        ), weaponHash, ammoType, JSON.stringify(
          position,
        ), JSON.stringify(direction)),
      );
      handleSnowWarWeaponShot(sourcePlayer, position);
    }
  },
);

mp.events.add("render", () => {
  if (!snowWarActive || targets.length === 0) return;

  targets.forEach((el: SnowballTarget, key: number) => {
    if (system.timestamp - el.time > 10) {
      targets.splice(key, 1);
      return;
    }

    if (el.entity?.handle === 0) return;

    mp.console.logInfo(
      LangString("monitor.d1d00492537658b50cd55e17ab7fcddb", el.entity.handle, el.entity.remoteId),
    );

    mp.console.logInfo(
      mp.game.invoke("0x2D343D2219CD027A", el.entity.handle, 3219281620, 0),
    );

    const hasBeenDamagedBySnowBall = mp.game.invoke(
      "0x2D343D2219CD027A",
      el.entity.handle,
      SNOW_WAR_WEAPON_HASH,
      0,
    );
    
    mp.console.logInfo(LangString("monitor.80f1bce871239bfc15792b88fc96d495", hasBeenDamagedBySnowBall));
    
    // Snowballs aren't making any damage, so the value will be always 0
    if (hasBeenDamagedBySnowBall === 0) {
      CustomEvent.triggerServer("snowwar:outgoingDamage", el.entity.remoteId);
      targets.splice(key, 1);
    }
  });
});
