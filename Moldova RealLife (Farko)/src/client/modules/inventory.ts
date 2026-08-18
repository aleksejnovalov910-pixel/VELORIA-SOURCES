import { LangString, langStringDefault } from "./lang";
import { CustomEvent } from "./custom.event";
import {
  ExchangeData,
  getBaseItemNameById,
  InventoryDataCef,
  InventoryEquipList,
  inventoryShared,
  InventoryWeaponPlayerData,
  ITEM_TYPE,
  ITEM_TYPE_ARRAY,
  WeaponAddonsItem,
} from "../../shared/inventory";
import { gui, inputOnFocus, phoneOpened, terminalOpened } from "./gui";
import { user } from "./user";
import { dressData } from "./cloth";
import { currentMenu, DialogInput, MenuClass } from "./menu";
import { system } from "./system";
import { menu } from "../../server/modules/menu";
import { dancing } from "./dance";
import { furniturePlace } from "./houses/furniturePlace";

const player = mp.players.local;
export const inventory = {
  open: () => {
    // createPedScreen();
    CustomEvent.triggerServer("inventory:open");
  },
  close: () => {},
};

let remCnt = 0;
CustomEvent.registerServer(
  "fireshow:play",
  async ([x, y, z]: [number, number, number]) => {
    const countTry = 10;
    remCnt += countTry;
    await system.sleep(2000);
    const object = mp.objects.new(
      "ind_prop_firework_03",
      new mp.Vector3(x, y, z),
      {
        dimension: 0,
      }
    );
    await system.sleep(10);
    object.placeOnGroundProperly();
    object.freezePosition(true);

    await system.sleep(5000);
    for (let count = 0; count < countTry; count++) {
      while (
        !mp.game.streaming.hasNamedPtfxAssetLoaded("scr_indep_fireworks")
      ) {
        mp.game.streaming.requestNamedPtfxAsset("scr_indep_fireworks");
        await system.sleep(10);
      }
      mp.game.graphics.setPtfxAssetNextCall("scr_indep_fireworks");
      let part1 = mp.game.graphics.startParticleFxLoopedAtCoord(
        "scr_indep_firework_trailburst",
        x,
        y,
        z,
        0.0,
        0.0,
        0.0,
        1.0,
        false,
        false,
        false,
        false
      );
      await system.sleep(3500);
      remCnt--;
    }
    if (remCnt <= 0)
      mp.game.streaming.removeNamedPtfxAsset("scr_indep_fireworks");
    if (remCnt < 0) remCnt = 0;
    await system.sleep(2000);
    if (mp.objects.exists(object)) object.destroy();
  }
);

let isExchangeOpen = false;

CustomEvent.registerServer(
  "inventory:openExchange",
  (
    myInventory: InventoryDataCef,
    exchange: ExchangeData,
    weapons: InventoryWeaponPlayerData,
    hotkeys: [number, number, number, number, number],
    inv_level: number
  ) => {
    gui.setGuiWithEvent(
      "inventory",
      "inventory:exchange",
      myInventory,
      exchange,
      { ...dressData, armour: player.getArmour() },
      weapons,
      hotkeys,
      inv_level
    );

    isExchangeOpen = true;

    deletePedScreen();

    setTimeout(() => {
      deletePedScreen();
    }, 1000);
  }
);


CustomEvent.registerServer(
  "inventory:open",
  async (
    blocks: InventoryDataCef[],
    weapon: InventoryWeaponPlayerData,
    hotkeys,
    inv_level,
    hunger,
    water,
    armorSlot,
    phoneSlot,
    bagSlot,
  ) => {
    gui.browser.active = false;

    gui.setGui("inventory");

    await createPedScreen();
    createPedCheckInterval();

    // setTimeout(() => {
    //     mp.game.invoke("0x98215325A695E78A", true);
    // }, 2000)

    // mp.game.cam.doScreenFadeOut(100);

    CustomEvent.triggerCef(
      "inventory:open",
      blocks,
      { ...dressData, armour: player.getArmour() },
      weapon,
      hotkeys,
      inv_level,
      hunger,
      water,
      armorSlot,
      phoneSlot,
      bagSlot
    );

    // gui.browser.active = true;
  }
);

CustomEvent.register("invopen", () => {
  inventory.open();
});

let sendHotkeyCommand = false;

for (let i = 0; i < 8; i++) {
  CustomEvent.register(`invslot${i + 1}`, () => {
    if (gui.is_block_keys) return;
    // if (phoneOpened) return;
    if (terminalOpened) return;
    if (inputOnFocus) return;
    //if (sendHotkeyCommand) return user.notify('Не нажимайте на хоткей так часто', 'error')
    if (user.cuffed)
      return user.notify("Nu poate fi folosit in catuse");
    if (user.walkingWithObject)
      return user.notify(
        LangString("inventory.a7aecb45d73481d41ec21bf3cc436597"),
        "error"
      );
    CustomEvent.triggerServer("inventory:hotkey:user", i);
    sendHotkeyCommand = true;
    setTimeout(() => {
      sendHotkeyCommand = false;
    }, 2000);
  });
}

CustomEvent.register("phoneSlot", () => {
  if (!user.login) return;
  if (currentMenu) return;
  if (terminalOpened) return;
  if (inputOnFocus) return;
  if (dancing) return;
  if (!furniturePlace.lockControls) return;
  //if (sendHotkeyCommand) return user.notify('Не нажимайте на хоткей так часто', 'error')
  if (user.cuffed) return user.notify("Nu poate fi folosit in catuse");
  if (user.walkingWithObject)
    return user.notify(
      LangString("inventory.5e100725f3dc237821d1a89a862bb962"),
      "error"
    );

  //if (gui.is_block_keys) return;
  // if (gui.currentGui === "phone") {
    // CustomEvent.triggerServer("phone:openPhone");
    // gui.setGui(null);
  // } else {
    if (!gui.currentGui && !mp.game.ui.isPauseMenuActive()) {
      CustomEvent.triggerServer("phone:openPhone");
      // gui.setGui("phone");
    // }
  }

  sendHotkeyCommand = true;
  setTimeout(() => {
    sendHotkeyCommand = false;
  }, 500);
});

CustomEvent.register("tabletSlot", () => {
  if (!user.login) return;
  if (currentMenu) return;
  if (terminalOpened) return;
  if (inputOnFocus) return;
  if (dancing) return;
  if (!furniturePlace.lockControls) return;
  //if (sendHotkeyCommand) return user.notify('Не нажимайте на хоткей так часто', 'error')
  if (user.cuffed)
    return user.notify("Nu poate fi folosit in catuse");
  if (user.walkingWithObject)
    return user.notify(
      LangString("inventory.c0397e65c513466c26379a836cf124da"),
      "error"
    );

  //if (gui.is_block_keys) return;
  if (gui.currentGui === "tablet") {
    gui.setGui(null);
    mp.console.logInfo(
      LangString("inventory.670a8c86f342f9e40a54133821e8b03c")
    );
  } else {
    if (!gui.currentGui && !mp.game.ui.isPauseMenuActive()) {
      CustomEvent.triggerServer("tablet:openTablet");
      // gui.setGui("tablet");
      // mp.console.logInfo(
      //   LangString("inventory.5fa07fb2745c7141737f578d6254bb91")
      // );
      // mp.console.logInfo(
      //   LangString("inventory.ce3f89471298f639ab8bdfadf77136e3", gui.currentGui)
      // );
    }
  }
});

// for(let key = 0; key < 5; key++){
//     registerHotkey((49+key), () => {
//         if (gui.is_block_keys) return;
//         // if (phoneOpened) return;
//         if (terminalOpened) return;
//         if (inputOnFocus) return;
//         if (sendHotkeyCommand) return user.notify('Не нажимайте на хоткей так часто', 'error')
//         CustomEvent.triggerServer('inventory:hotkey:user', key)
//         sendHotkeyCommand = true;
//         setTimeout(() => {
//             sendHotkeyCommand = false;
//         }, 2000)
//     })
// }

let sendReloadCommand = false;
let serverWeapon: number;
CustomEvent.registerServer(
  "user:removeWeapon",
  (data: {
    hash: number;
    magazines: number[];
    weapon: number;
    maxMagazine: number;
  }) => {
    serverWeapon = data ? data.hash : null;
    sendWeaponAmmo = 0;
    CustomEvent.triggerCef("hud:weapon", data ? { ...data, ammo: 0 } : null);
  }
);

CustomEvent.registerServer(
  "weaponInHand",
  (data: {
    hash: number;
    magazines: number[];
    weapon: number;
    maxMagazine: number;
  }) => {
    serverWeapon = data ? data.hash : null;
    sendWeaponAmmo = 0;
    CustomEvent.triggerCef("hud:weapon", data ? { ...data, ammo: 0 } : null);
  }
);

let sendWeaponAmmo = 0;

const AMMO_UPDATE_COOLDOWN_MS = 100;
let nextAmmoUpdateTime = 0;

let finalAmmoCheckTimer: NodeJS.Timeout = null;

function updateHudAmmo(ammo: number) {
  if (system.timestampMS < nextAmmoUpdateTime) {
    if (finalAmmoCheckTimer == null) {
      finalAmmoCheckTimer = setTimeout(() => {
        CustomEvent.triggerCef("hud:ammo", user.currentAmmo);
        clearTimeout(finalAmmoCheckTimer);
        finalAmmoCheckTimer = null;
      }, AMMO_UPDATE_COOLDOWN_MS);
    }

    return;
  }

  CustomEvent.triggerCef("hud:ammo", ammo);
  nextAmmoUpdateTime = system.timestampMS + AMMO_UPDATE_COOLDOWN_MS;
}

mp.events.add("render", () => {
  if (gui.currentGui != "inventory" && PlayerPedPreview) {
    deletePedScreen();
  }

  if (serverWeapon) mp.game.controls.disableControlAction(0, 45, true);
  mp.game.controls.disableControlAction(0, 140, true);
  const hand = 2725352035;
  const currentAmmo = user.currentAmmo;
  if (sendWeaponAmmo !== currentAmmo) {
    sendWeaponAmmo = currentAmmo;
    updateHudAmmo(currentAmmo);
  }
  if (
    mp.players.local.weapon !== hand &&
    mp.game.weapon.getWeaponClipSize(mp.players.local.weapon) &&
    mp.game.controls.isDisabledControlJustPressed(0, 45) &&
    !sendReloadCommand &&
    !gui.is_block_keys &&
    !phoneOpened &&
    !terminalOpened &&
    !inputOnFocus
  ) {
    CustomEvent.triggerServer("inventory:reload:weapon");
    sendReloadCommand = true;
    setTimeout(() => {
      sendReloadCommand = false;
    }, 3000);
  }
});

export const selectItem = (
  disabled: number[] = [],
  disableName?: string
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const select = (
      name?: string,
      category: ITEM_TYPE = ITEM_TYPE_ARRAY.length
    ) => {
      if (name) name = name.toLowerCase();
      let m = new MenuClass(
        LangString("inventory.a533eacf8d8065439c7d80823da53647")
      );
      m.onclose = () => {
        resolve(null);
      };
      m.newItem({
        name: LangString("inventory.8aee4abca503dff3ba1b220b7ec63a6b"),
        more: name,
        onpress: () => {
          DialogInput(
            LangString("inventory.0ed406d2c454fde67a7a1b32f9c8c567"),
            name ? name : ""
          ).then((val) => {
            if (val === null) return select(name);
            else return select(val);
          });
        },
      });
      m.newItem({
        name: LangString("inventory.fd5a8e93b03f87c3787a2b5588b21999"),
        type: "list",
        list: [
          ...ITEM_TYPE_ARRAY,
          LangString("inventory.2fb089e0792edb1dfe87322eb1542d07"),
        ],
        listSelected: category,
        onpress: (itm) => {
          select(name, itm.listSelected);
        },
      });
      inventoryShared.items.map((item) => {
        if (disabled.includes(item.item_id) && !disableName) return;
        if (category !== ITEM_TYPE_ARRAY.length) {
          if (item.type !== category) return;
        }
        let idsrch = parseInt(name);
        if (
          !name ||
          item.name.toLowerCase().includes(name) ||
          idsrch === item.item_id
        ) {
          m.newItem({
            name: `${item.name} #${item.item_id}`,
            icon: `Item_${item.item_id}`,
            more:
              disabled.includes(item.item_id) && disableName ? disableName : "",
            onpress: () => {
              if (disabled.includes(item.item_id))
                return user.notify(disableName, "error");
              m.close();
              resolve(item.item_id);
            },
          });
        }
      });
      if (name)
        m.subtitle = LangString(
          "inventory.73fe9e61c2105a0e21ee458bacfde7a3",
          m.items.length,
          inventoryShared.items.length
        );
      else
        m.subtitle = LangString("inventory.24d18e81e65e91b96aa2e53211cc2bd2");
      m.open();
    };
    select();
  });
};

CustomEvent.register("tablet:getTrackSuspect", () => {
  return user.trackSuspect;
});

CustomEvent.registerServer(
  "tablet:open",
  (
    house: {
      carInt: number;
      name: string;
      id: number;
      owner: string;
      price: number;
      tax: number;
      cars: { name: string; number: string; model: string }[];
      pos: { x: number; y: number };
    },
    vehicles: {
      name: string;
      model: string;
      number: string;
      x: number;
      y: number;
      onSpawn: boolean;
      id: number;
    }[],
    faction: any,
    myNumbers: any,
    lifeInvaderModerate: any,
    bussinessData,
    familyData,
    gosSuspects
  ) => {
    gui.setGui("tablet");
    const trackSuspect = user.trackSuspect;
    CustomEvent.triggerCef(
      "tablet:open",
      house,
      vehicles,
      faction,
      myNumbers,
      lifeInvaderModerate,
      bussinessData,
      familyData,
      gosSuspects,
      trackSuspect
    );
  }
);

let objects: {
  handle: number;
  x: number;
  y: number;
  z: number;
  name: string;
}[] = [];

setInterval(() => {
  if (!user.login) return;
  // if(mp.players.local.dimension) return;
  
  if (gui.currentGui != "inventory" && PlayerPedPreview) {
    deletePedScreen();
  }
  
  objects = [];
  mp.objects.forEachInStreamRange((object) => {
    if (!object.getVariable("inventory_dropped")) return;

    if (!object.isCollisonDisabled()) {
      object.setCollision(false, true);
    }

    if (system.distanceToPos(object.position, mp.players.local.position) > 5)
      return;
    objects.push({
      handle: object.handle,
      x: object.position.x,
      y: object.position.y,
      z: object.position.z,
      name: getBaseItemNameById(object.getVariable("item_id")),
    });
  });
}, 400);

mp.events.add("render", () => {
  objects.map((item) => {
    gui.drawText3D(item.name, item.x, item.y, item.z, 0.5, true);
  });
});

let flashEnabled = new Map<number, string>();

const setWeaponAddons = (
  target: PlayerMp,
  data: [string, (keyof WeaponAddonsItem)[]],
  oldData: [string, (keyof WeaponAddonsItem)[]],
  tick = false
) => {
  if (!mp.players.exists(target) || !target.handle) return;
  if (oldData) {
    const weaponHash = oldData[0];
    const weaponHashInt = mp.game.joaat(weaponHash) as number;
    const cfg = inventoryShared.getWeaponConfigByHash(weaponHash);
    if (cfg) {
      const addons = oldData[1];
      if (addons) {
        addons.map((addon) => {
          const hash = cfg.addons[addon]?.hash;
          if (hash) {
            mp.game.invoke(
              "0x1E8BE90C74FB4C09",
              target.handle,
              weaponHashInt >> 0,
              (mp.game.joaat(hash) as number) >> 0
            );
          }
        });
      }
    }
  }

  flashEnabled.delete(target.remoteId);

  if (data) {
    const weaponHash = data[0];
    const weaponHashInt = mp.game.joaat(weaponHash.toUpperCase());
    const cfg = inventoryShared.getWeaponConfigByHash(weaponHash);
    if (cfg) {
      const addons = data[1];
      if (addons) {
        addons.map((addon) => {
          const hash = cfg.addons[addon]?.hash;
          if (hash) {
            if (hash.includes("_FLSH")) flashEnabled.set(target.remoteId, hash);

            const hashC = mp.game.joaat(hash);
            if (hash.includes("WEAPON_TINT")) {
              mp.game.invoke(
                "0x50969B9B89ED5738",
                target.handle,
                weaponHashInt >> 0,
                Number.parseInt(hash.toString().replace("WEAPON_TINT", "")) >> 0
              );
            }
            mp.game.invoke(
              "0xD966D51AA5B28BB9",
              target.handle,
              weaponHashInt >> 0,
              hashC >> 0
            );
            if (!tick) {
              setTimeout(() => {
                if (target && mp.players.exists(target) && target.handle)
                  mp.game.invoke(
                    "0xD966D51AA5B28BB9",
                    target.handle,
                    weaponHashInt >> 0,
                    hashC >> 0
                  );
              }, 500);
            }
          }
        });
        // mp.game.invoke("0xADF692B254977C0C", target.handle, weaponHashInt >> 0, true);
      }
    }
  }
};

let flashPos = {
  COMPONENT_AT_AR_FLSH: [
    new mp.Vector3(0.5, 0.03, 0.05),
    new mp.Vector3(1.0, -0.16, 0.145),
  ],
  COMPONENT_AT_PI_FLSH: [
    new mp.Vector3(0.28, 0.04, 0.0),
    new mp.Vector3(1.0, -0.12, 0.03),
  ],
  COMPONENT_AT_PI_FLSH_02: [
    new mp.Vector3(0.28, 0.04, 0.0),
    new mp.Vector3(1.0, -0.135, 0.03),
  ],
  COMPONENT_AT_PI_FLSH_03: [
    new mp.Vector3(0.28, 0.04, 0.0),
    new mp.Vector3(1.0, -0.135, 0.03),
  ],
};
let block = false;
CustomEvent.register("flashlight", () => {
  if (block) return;
  if (!flashEnabled.has(player.remoteId)) return;
  block = true;
  CustomEvent.triggerServer("inventory:flashlight");
  mp.game.audio.playSoundFrontend(
    -1,
    "PICK_UP_WEAPON",
    "HUD_FRONTEND_CUSTOM_SOUNDSET",
    true
  );
  setTimeout(() => {
    block = false;
  }, 3000);
});

mp.events.add("render", () => {
  flashEnabled.forEach((hash: keyof typeof flashPos, targetid) => {
    const target = mp.players.atRemoteId(targetid);
    if (!target || !mp.players.exists(target) || !target.handle)
      return flashEnabled.delete(targetid);
    if (!target.getVariable("flashlightWeapon")) return;
    const cfg = flashPos[hash];
    if (!cfg) return;
    let FlashlightPosition = target.getBoneCoords(
      0xdead,
      cfg[0].x,
      cfg[0].y,
      cfg[0].z
    );
    let FlashlightDirection = target.getBoneCoords(
      0xdead,
      cfg[1].x,
      cfg[1].y,
      cfg[1].z
    );
    let DirectionVector = new mp.Vector3(
      FlashlightDirection.x - FlashlightPosition.x,
      FlashlightDirection.y - FlashlightPosition.y,
      FlashlightDirection.z - FlashlightPosition.z
    );
    let VectorMagnitude = Math.hypot(
      DirectionVector.x,
      DirectionVector.y,
      DirectionVector.z
    );
    let FlashlightEndPosition = new mp.Vector3(
      DirectionVector.x / VectorMagnitude,
      DirectionVector.y / VectorMagnitude,
      DirectionVector.z / VectorMagnitude
    );
    mp.game.graphics.drawSpotLight(
      FlashlightPosition.x,
      FlashlightPosition.y,
      FlashlightPosition.z,
      FlashlightEndPosition.x,
      FlashlightEndPosition.y,
      FlashlightEndPosition.z,
      255,
      255,
      255,
      40.0,
      2.0,
      2.0,
      10.0,
      15.0
    );
  });
});

mp.events.addDataHandler(
  "currentWeaponAddons",
  async (
    target: PlayerMp,
    data: [string, (keyof WeaponAddonsItem)[]],
    oldData: [string, (keyof WeaponAddonsItem)[]]
  ) => {
    if (target.type !== "player") return;
    setTimeout(
      () => {
        if (!mp.players.exists(target) || !target.handle) return;
        setWeaponAddons(target, data, oldData);
      },
      mp.players.local === target ? 100 : 500
    );
  }
);

mp.events.add("entityStreamIn", async (target: PlayerMp) => {
  if (target.type !== "player") return;
  setTimeout(
    () => {
      if (!mp.players.exists(target) || !target.handle) return;
      const val = target.getVariable("currentWeaponAddons");
      if (val)
        setWeaponAddons(
          target,
          target.getVariable("currentWeaponAddons"),
          null
        );
    },
    mp.players.local === target ? 100 : 500
  );
});

setInterval(() => {
  if (!user.login) return;
  const my = mp.players.local.getVariable("currentWeaponAddons");
  if (my) setWeaponAddons(mp.players.local, my, null, true);
  mp.players.forEachInStreamRange((target) => {
    const val = target.getVariable("currentWeaponAddons");
    if (val) setWeaponAddons(target, val, null, true);
  });
}, 1000);

let screenPedHandle: number = undefined;

CustomEvent.registerServer("onInventoryClose", () => {
  isExchangeOpen = false;

  deletePedScreen();
});

CustomEvent.registerServer("inventory:updatePersonage", () => {
  refreshPedScreen();
})

let PlayerPedPreview;
let pedActiveInterval = undefined;

function createPedCheckInterval() {
  pedActiveInterval = setInterval(() => {
    if (PlayerPedPreview && gui.currentGui != "inventory") {
      deletePedScreen();
      pedActiveInterval && clearInterval(pedActiveInterval);
      pedActiveInterval = undefined;

      return;
    }

    if (!PlayerPedPreview && gui.currentGui == "inventory" && !isExchangeOpen) {
      createPedScreen();
    }
  }, 300);
}

async function createPedScreen() {
  try {
    mp.game.ui.setFrontendActive(true);
    mp.game.ui.activateFrontendMenu(
      mp.game.gameplay.getHashKey("FE_MENU_VERSION_EMPTY_NO_BACKGROUND"),
      true,
      -1
    );

    let PlayerPed = mp.game.player.getPed();

    PlayerPedPreview = mp.game.invoke(
      "0xEF29A16337FACADB",
      PlayerPed,
      mp.players.local.getHeading(),
      false,
      true
    );
    while (PlayerPedPreview === 0) {
      await mp.game.waitAsync(15);
    }

    mp.events.add("render", PlayerPedPreviewRender)

    mp.game.invoke("0x1A9205C1B9EE827F", PlayerPedPreview, false, false);
    mp.game.invoke(
      "0x06843DA7060A026B",
      PlayerPedPreview,
      mp.players.local.position.x,
      mp.players.local.position.y,
      mp.players.local.position.z - 15,
      true,
      true,
      true,
      false
    );

    mp.game.invoke("0x364DF566EC833DE2", PlayerPedPreview, 0.001);
    mp.game.wait(100);

    mp.game.ui.pauseMenuSetBusySpinner(false, 0, 0);
    mp.game.ui.givePedToPauseMenu(PlayerPedPreview, 1);
    mp.game.ui.replaceColourWithRgba(117, 0, 0, 0, 0);

    mp.game.invoke("0x3CA6050692BC61B0", true);
    mp.game.invoke("0x98215325A695E78A", false);
    mp.game.invoke("0xECF128344E9FF9F1", true);
    await mp.game.waitAsync(15);

    gui.browser.active = true;

    gui.freezeCursorDatas = true;
    gui.cursor = true;
  } catch (e) {
    mp.console.logWarning(`${JSON.stringify(e.message)}`);
  }
}

let updateInProcess = false;

async function refreshPedScreen(isSecond = false) {
  if (updateInProcess) return;
  if (!mp.players.local) return;
  if (!PlayerPedPreview) return;
  
  updateInProcess = true;
  let PlayerPed = mp.game.player.getPed();

  PlayerPedPreview = mp.game.invoke(
    "0xEF29A16337FACADB",
    PlayerPed,
    mp.players.local.getHeading(),
    false,
    true
  );
  while (PlayerPedPreview === 0) {
    await mp.game.waitAsync(15);
  }

  if (!PlayerPedPreview) return;

  mp.game.invoke("0x1A9205C1B9EE827F", PlayerPedPreview, false, false);
  mp.game.invoke(
    "0x06843DA7060A026B",
    PlayerPedPreview,
    mp.players.local.position.x,
    mp.players.local.position.y,
    mp.players.local.position.z - 15,
    true,
    true,
    true,
    false
  );

  mp.game.invoke("0x364DF566EC833DE2", PlayerPedPreview, 0.001);
  mp.game.wait(100);
  if (!PlayerPedPreview || !mp.peds.exists(PlayerPedPreview)) return;

  mp.game.ui.pauseMenuSetBusySpinner(false, 0, 0);
  mp.game.ui.givePedToPauseMenu(PlayerPedPreview, 1);
  mp.game.ui.replaceColourWithRgba(117, 0, 0, 0, 0);

  mp.game.invoke("0x3CA6050692BC61B0", true);
  mp.game.invoke("0x98215325A695E78A", false);
  mp.game.invoke("0xECF128344E9FF9F1", true);

  await mp.game.waitAsync(250);
  updateInProcess = false;
  if (!isSecond) refreshPedScreen(true);
}
/**
 * Deletes the ped screen.
 */
function deletePedScreen() {
  if (!PlayerPedPreview) return;

  mp.game.invoke("0xF314CF4F0211894E", 117, 0, 0, 0, 186); // REPLACE_HUD_COLOUR_WITH_RGBA
  mp.game.ui.clearPedInPauseMenu();
  mp.game.ui.setPauseMenuActive(false);
  mp.game.ui.setFrontendActive(false);
  mp.game.invoke("0x98215325A695E78A", true);
  // mp.game.cam.doScreenFadeIn(300);

  let findPed = mp.peds.atHandle(PlayerPedPreview);
  if (findPed && mp.peds.exists(findPed)) {
    findPed.destroy();
  }

  mp.events.remove("render", PlayerPedPreviewRender)

  PlayerPedPreview = undefined;
}

mp.events.add("playerQuit", (player: PlayerMp) => {
  if (player != mp.players.local) return;
  deletePedScreen();
});

function PlayerPedPreviewRender() {
// mp.events.add("render", () => {
  if (!PlayerPedPreview) return;
  /**
   * Weapon related actions
   */
  //Disables weapon wheel selection
  mp.game.controls.disableControlAction(2, 37, true);
  mp.game.controls.disableControlAction(32, 157, true); // INPUT_SELECT_WEAPON_UNARMED
  mp.game.controls.disableControlAction(32, 158, true); // INPUT_SELECT_WEAPON_MELEE
  mp.game.controls.disableControlAction(32, 159, true); // INPUT_SELECT_WEAPON_HANDGUN
  mp.game.controls.disableControlAction(32, 160, true); // INPUT_SELECT_WEAPON_SHOTGUN
  mp.game.controls.disableControlAction(32, 161, true); // INPUT_SELECT_WEAPON_SMG
  mp.game.controls.disableControlAction(32, 162, true); // INPUT_SELECT_WEAPON_AUTO_RIFLE
  mp.game.controls.disableControlAction(32, 163, true); // INPUT_SELECT_WEAPON_SNIPER
  mp.game.controls.disableControlAction(32, 164, true); // INPUT_SELECT_WEAPON_HEAVY
  mp.game.controls.disableControlAction(32, 165, true); // INPUT_SELECT_WEAPON_SPECIAL
  //Hides current player's weapon HUD data (like ammo)
  mp.game.ui.hideHudComponentThisFrame(2);
  mp.game.ui.hideHudComponentThisFrame(20);

  // mp.game.graphics.setScriptGfxDrawBehindPausemenu(true);

  // mp.gui.cursor.visible = true;
  // mp.gui.cursor.show(true, true);

  //------------------------------------------------------//
};

mp.game.graphics.requestStreamedTextureDict("ps_pause", true);
