import { UserDatingEntity, UserEntity } from "./typeorm/entities/user";
import crypto from "crypto";
import { AccountEntity } from "./typeorm/entities/account";
import { CustomEvent } from "./custom.event";
import { personageLoginData } from "../../shared/login.state";
import { AlertType, DEFAULT_ALERT_TIME } from "../../shared/alert";
import { guiNames } from "../../shared/gui";
import { CharacterSkinData } from "../../shared/character";
import { permissions } from "../../shared/permissions";
import { weather } from "./weather";

import { In } from "typeorm";
import {
  ARMOR_ITEM_ID,
  CONTAINERS_DATA,
  getBaseItemNameById,
  InventoryEquipList,
  inventoryShared,
  OWNER_TYPES,
} from "../../shared/inventory";
import { inventory } from "./inventory";
import { FileLogType, MyData } from "../../shared/log";
import { menu } from "./menu";
import { system } from "./system";
import { food_max, water_max } from "../../shared/survival";
import { houses } from "./houses";
import { Vehicle } from "./vehicles";
import { Family } from "./families/family";
import {
  getInteriorHouseById,
  interriorPointData,
} from "../../shared/inrerriors";
import { dress } from "./customization";
import {
  bankCardMax,
  DEFAULT_VEHICLE_PLAYER_LIMIT,
  DONATE_MONEY_NAMES,
  DONATE_SLOT_PERSONAGE_COST,
  GIVE_MONEY_PER_DAY,
  GIVE_MONEY_PER_TASK,
  MEDIA_PROMOCODE,
  PLAYTIME_MONEY,
  PLAYTIME_TIME,
  PLAYTIME_TYPE,
} from "../../shared/economy";
import {
  CLOTH_VARIATION_ID_MULTIPLER,
  ClothData,
  GloveClothData,
} from "../../shared/cloth";
import { business } from "./business";
import { RpHistoryEntity } from "./typeorm/entities/rp_history";
import {
  getJobData,
  getJobName,
  getLevelByExp,
  JobId,
  jobsList,
} from "../../shared/jobs";
import { BankHistoryEntity } from "./typeorm/entities/bank_history";
import {
  CRIME_ROBBERY_COOLDOWN,
  FACTION_ID,
  fractionList,
} from "../../shared/fractions";
import {
  ADMIN_PRISON_COORD,
  CUFF_LEAVE_JAIL_MINUTES,
  JAIL_MINUTES_PER_STAR,
  PRISON_DATA,
} from "../../shared/jail";
import { ANTICHEAT_TYPE, AntiCheatUserData } from "../../shared/anticheat";
import { ItemEntity } from "./typeorm/entities/inventory";
import { UdoTypeBase } from "../../shared/licence";
import { getVipConfig, VIP_TARIFS, VipId } from "../../shared/vip";
import {
  getMaxExpLevel,
  LEVEL_MONEY_REWARD_MULTIPLER,
} from "../../shared/payday";
import { gui } from "./gui";
import { colshapes } from "./checkpoints";
import {
  raceCarsEntity,
  raceRegisteredPlayers,
  raceSelectedCars,
} from "./race";
import { duels } from "./duels";
import { IFish } from "../../shared/fish";
import {
  getIllConfig,
  ILL_SYSTEM_STEP,
  illData,
  IllId,
} from "../../shared/ill";
import { NoSQLbase } from "./nosql";
import { QUEST_SPAWN_ITEM } from "../../shared/quests";
import {
  BarberData,
  NAILS_COMPONENT_ID,
  nailsConfig,
} from "../../shared/barbershop";
import { PARKING_CARS_PLAYER_MAX } from "../../shared/parking";
import { MINIGAME_TYPE } from "../../shared/minigame";
import { RESTORE_CODE_LIFETIME } from "../../shared/restore.account";
import { Mail } from "./mail";
import { BankHistoryItem } from "../../shared/atm";
import { getIp, incrementAuthCounter } from "./web";
import { cmute, syncMutePlayer } from "./admin";
import { saveEntity } from "./typeorm";
import { zoneControlData } from "./gangwar";
import { DeathMath } from "./deadmatch";
import { StorageAlertData } from "../../shared/alertsSettings";
import { syncDeathId } from "./survival";
import { dialogSystem } from "./chat";
import { FamilyTasks } from "../../shared/family";
import { CargoBattleFamilyQuest } from "./families/quests/cargobattle";
import {
  CAR_FOR_PLAY_REWARD_MAX,
  LEVEL_FOR_PLAY_REWARD_MAX,
  MINUTES_FOR_PLAY_REWARD_MAX,
} from "../../shared/reward.time";
// import { ConstructionSystem } from "./construction";
// import { CONSTRUCTION_REGISTER_POS } from "../../shared/construction";
import { BlackListEntity } from "./typeorm/entities/blacklist";
import { WarehouseEntity } from "./typeorm/entities/warehouse";
import { BAG_ATTACH, BagAttachData } from "../../shared/bag";
import { tablet } from "./tablet";
import { UserAchiev } from "./usermodule/achieve";
import { UserAnimation } from "./usermodule/animation";
import { UserQuest } from "./usermodule/quest";
import { getX2Param, UserStatic } from "./usermodule/static";
import { userPayDay } from "./usermodule/payday";
import { UserLicense } from "./usermodule/license";
import { UserWeapon } from "./usermodule/weapon";
import { getGpsMissionVehs } from "./task";
// import { nonHiddenMasksIds } from "../../shared/masks";
import { PayData, PayType } from "../../shared/pay";
import { DeathMathLobby } from "./gungame";
import { isPlayerInActiveSafeZone } from "./safezone";
import { BizWar } from "./bizwar";
import { MiningStats } from "./mining";
import { SendUpdate } from "../../shared/GameVisualElement";
import { ExchangeServerData } from "./inventory.exchange";
import { UserQuestManager } from "./advancedQuests/userQuestManager";
import { UserStats } from "./usermodule/stats";
import { UserBattlePassManager } from "./battlePass/userBattlePassManager";
import { COMMAND_EVENT_DIMENSION } from "../../shared/adminEvents/commandEvent/config";
import { ISLAND_BATTLE_DIMENSION } from "../../shared/islandBattle";
import { ISanitationSort } from "../../shared/jobs/sanitation/sort";
import { furniture } from "./houses/furniture";
import { fractionCfg } from "./fractions/main";
import { lscConfig } from "./businesses/lsc";
import { IPrisonData } from "../../shared/prison/IPrisonData";
import { PRISON_SPAWN_POSITIONS } from "../../shared/prison/config";
import { prison } from "./prison";
import { IPrisonTask } from "../../shared/prison/IPrisonTask";
import { AnimParam } from "../../shared/anim";

import {
  getAllLangs,
  langData,
  langString,
  langStringDefault,
  langType,
} from "../../shared/lang";
import { DEFAULT_SELECTED_LANG } from "../../shared/lang/default";
import { DailyRewardEntity } from "./usermodule/dailyReward/dailyreward.entity";
import mdt from "./fractions/mdt";
import { Signatures } from "./typeorm/entities/signatures";

const COMBAT_BLOCK_TIME_S = 5;

mp.events.add("playerJoin", (player: PlayerMp) => {
  player.dimension = 10000 + player.id;
  player.setVariable("customHealth", player.health);
});

CustomEvent.registerClient("clearcurrentWeapon", (player) => {
  player.setVariable("currentWeapon", null);
});

CustomEvent.registerClient("anticheatNotify", (player, status: boolean) => {
  player.anticheatNotify = status;
});

CustomEvent.registerClient("gpsMarkSyncRequest", (player, pos: Vector3) => {
  if (!player.user || !pos.x) return;
  if (!player.vehicle || player.user.isDriver) return;
  const driver = player.vehicle.getOccupant(0);
  if (!driver || !driver.user) return;
  menu
    .accept(
      driver,
      driver.user.LangString("user.gpsMarkSyncRequest", player.user.id),
      "small"
    )
    .then((status) => {
      if (!status) return;
      driver.user.setWaypoint(pos.x, pos.y, pos.z, "Passagier-Tag", true);
    });
});

CustomEvent.registerClient("damage:updateCombatBlock", (player) => {
  if (!mp.players.exists(player) || !player.user) {
    return;
  }

  player.user.lastCombatTimeMs = system.timestampMS;
});

CustomEvent.registerClient("admin:server:setLang", (player, lang: number) => {
  if (!mp.players.exists(player) || !player.user) {
    return;
  }
  const res = getAllLangs()[lang];
  if (res) player.user.lang = res;
});

export class User extends UserStatic {
  policeCuffed: any;

  // stopAnim() {
  // const player = this.player;
  // if (!mp.players.exists(player)) return;
  // player.clearTasks();
  // }
  lang: langType = DEFAULT_SELECTED_LANG;

  LangString(key: langData, ...args: (number | string | boolean)[]) {
    return langString(this.lang, key, ...args);
  }

  get candyCount() {
    return this.entity.candyCount;
  }

  set candyCount(amount: number) {
    this.entity.candyCount = amount;
    //CustomEvent.triggerCef(this.player, 'hud:updateCandy', amount);
  }

  get lollipops(): number {
    return this.entity.lollipops;
  }

  set lollipops(amount: number) {
    this.entity.lollipops = amount;
    CustomEvent.triggerCef(this.player, "hud:updateLollipops", amount);
  }

  isBlockedByCriminals: boolean = false;

  lastSmoke: number = 0;
  vapeInHand: number | null = null;
  sanitationSquad: number | null = null;
  sanitationSort: ISanitationSort | null = null;
  sanitationTrashBag: boolean = false;

  wheelPrize: number | null = null;
  antiBlockEnterVehicle: boolean = false;
  haveDiverMission: boolean = false;

  get prison(): IPrisonData | null {
    if (!this.entity.prison) return null;
    return JSON.parse(this.entity.prison);
  }

  set prison(data: IPrisonData | null) {
    this.entity.prison = data === null ? null : JSON.stringify(data);
  }

  prisonLastEat: number | null = null;
  prisonLastDrink: number | null = null;

  giveLollipops(amount: number) {
    if (amount < 0) {
      throw new Error("Amount cant be less then 0");
    }

    this.lollipops = this.lollipops + amount;
  }

  takeLollipops(amount: number) {
    if (amount < 0) {
      throw new Error("Amount cant be less then 0");
    }

    amount = amount > this.lollipops ? this.lollipops : amount;
    this.lollipops = this.lollipops - amount;
  }

  giveCandies(amount: number) {
    if (amount < 0) {
      throw new Error("Amount cant be less then 0");
    }

    this.candyCount = this.candyCount + amount;
  }

  takeCandies(amount: number) {
    if (amount < 0) {
      throw new Error("Amount cant be less then 0");
    }

    amount = amount > this.candyCount ? this.candyCount : amount;
    this.candyCount = this.candyCount - amount;
  }

  stats: UserStats;

  deathTimeEnd?: number;

  exchangeData: ExchangeServerData;

  afterLoginEvents: (() => void)[] = [];

  nextDonateRoulleteDrop: number | undefined = undefined;

  achiev: UserAchiev;

  get is_media() {
    return this.vipData && this.vipData.media;
  }

  lastFamilyActions: [number, number][] = []; // ID действия, время использования

  socket: Socket;

  get socketId() {
    return this.socket?.id;
  }

  private attachListData: (string | [string, ...number[]])[] = [];
  get attachList() {
    return this.attachListData;
  }
  set attachList(val) {
    this.attachListData = val && val.length ? val : [];
    this.attachSync();
  }
  addAttachment = (id: string) => {
    if (this.attachList.includes(id)) return;
    this.attachList = [...this.attachList, id];
  };
  removeAttachment = (id: string) => {
    if (!this.attachList.includes(id)) return;
    let old = [...this.attachList];
    old.splice(
      old.findIndex((q) => q === id),
      1
    );
    this.attachList = [...old];
  };

  get inventoryAttachSync() {
    return this.weaponClass.inventoryAttachSync;
  }

  hasAttachment = (id: string) => {
    return this.attachList.includes(id);
  };

  private attachSync = () => {
    if (!this.exists) return;
    this.player.setVariable("attachObjects", this.attachList);
  };

  brTeam: number;

  readonly entity: UserEntity;
  private anticheatData: AntiCheatUserData;
  private ent_spam_protect: boolean;
  readonly player: PlayerMp;
  readonly account: AccountEntity;

  private inventoryPasswordStorage = new Map<string, number>();
  tempData: {
    oldpos?: {
      x: number;
      y: number;
      z: number;
      h: number;
      d: number;
    };
    /** Игрок недавно ловил рыбу, и какое то время рыбачить не сможет физически. В общем защита от читов */
    fishing?: boolean;
    fishToCatch?: number;
  };
  readonly lastEnterPosition: {
    x: number;
    y: number;
    z: number;
    h: number;
    d: number;
  };

  get chatMuted() {
    if (!this.exists) return null;
    return this.player.getVariable("muted:chat") ? cmute.get(this.id) : null;
  }
  /** Игрок недавно отправлял запрос (TENCODE или вызов службы) */
  sendDispatch = false;
  lastDispatch = -1;
  answerDispatch = false;
  spectatePos: [number, number, number, number];
  private get currentWeaponData() {
    return this.weaponClass.currentWeaponData;
  }
  private set currentWeaponData(val) {
    this.weaponClass.currentWeaponData = val;
  }
  load: boolean;
  save_wait: boolean;
  private grab_money_data = 0;
  private grab_item_data: { id: number; amount: number }[] = [];
  private box_game_owner = false;
  /** Работает таксистом */
  taxiJob = false;
  /** Арендованый в таксопарке транспорт */
  taxiCar: VehicleMp;
  rodInHandId: number = 0;

  killedByPolice: PlayerMp;

  lastReanimationTime: number = 0;
  // deathWantedReason: string
  // deathWantedLevel: number

  /** Обработка игрока при выходе с сервера или смерти. */

  get vehicle_limit() {
    return this.entity.vehicles_limit;
  }

  set vehicle_limit(val) {
    this.entity.vehicles_limit = val;
    this.save();
  }
  addVehicleLimit = () => {
    this.vehicle_limit = this.vehicle_limit + 1;
  };

  get current_vehicle_limit() {
    return this.entity.vehicles_limit + DEFAULT_VEHICLE_PLAYER_LIMIT;
  }

  deadLeaveEvent = () => {
    this.grab_money_shop = 0;
    const pos = this.player ? this.player.position : null;
    const dimension = this.player ? this.player.dimension : 0;
    if (pos) {
      if (this.grab_money) {
        const sum = this.grab_money;
        let pick = false;
        const shape = colshapes.new(
          pos,
          this.LangString(
            "user.deadLeaveEvent",
            system.numberFormat(this.grab_money)
          ),
          (target) => {
            const targetuser = target.user;
            if (!targetuser) return;
            const targetFraction = targetuser.fractionData;
            if (!targetFraction || targetFraction.id === 16)
              return target.notify(
                targetuser.LangString("user.deadLeaveEvent.errfaction"),
                "error"
              );
            targetuser
              .playAnimationWithResult(
                ["anim@heists@money_grab@duffel", "loop"],
                15,
                targetuser.LangString("user.deadLeaveEvent.anim"),
                target.heading,
                MINIGAME_TYPE.MONEY
              )
              .then((status) => {
                if (!status) return;
                if (!mp.players.exists(target)) return;
                if (pick)
                  return target.notify(
                    targetuser.LangString("user.deadLeaveEvent.anim.pick"),
                    "error"
                  );
                targetuser.grab_money += sum;
                pick = true;
                if (shape) shape.destroy();
              });
          },
          {
            type: 29,
            dimension,
            color: [0, 255, 255, 60],
            radius: 3,
          }
        );
        setTimeout(() => {
          if (pick) return;
          pick = true;
          if (shape) shape.destroy();
        }, 10 * 60000);
        this.grab_money = 0;
      }

      if (this.grab_item && this.grab_item.length > 0) {
        const items = [...this.grab_item];
        let pick = false;
        const shape = colshapes.new(
          pos,
          (target) => target.user.LangString("user.deadLeaveEvent.colshape"),
          (target) => {
            const targetuser = target.user;
            if (!targetuser) return;
            const targetFraction = targetuser.fractionData;
            if (!targetFraction || targetFraction.id === 16)
              return target.notify(
                targetuser.LangString("user.deadLeaveEvent.colshape.faction"),
                "error"
              );
            targetuser
              .playAnimationWithResult(
                ["anim@heists@money_grab@duffel", "loop"],
                20,
                targetuser.LangString("user.deadLeaveEvent.colshape.anim"),
                target.heading
              )
              .then((status) => {
                if (!status) return;
                if (!mp.players.exists(target)) return;
                if (pick)
                  return target.notify(
                    targetuser.LangString(
                      "user.deadLeaveEvent.colshape.anim.pick"
                    ),
                    "error"
                  );
                items.map((q) => targetuser.giveGrabItem(q.id, q.amount));
                pick = true;
                if (shape) shape.destroy();
              });
          },
          {
            type: 30,
            dimension,
            color: [0, 255, 255, 60],
            radius: 2,
          }
        );
        setTimeout(() => {
          if (pick) return;
          pick = true;
          if (shape) shape.destroy();
        }, 10 * 60000);
        this.grab_item = null;
      }
    }
    //? Гонки
    const inRace = raceRegisteredPlayers.findIndex((q) => q === this.player);
    if (inRace > -1) {
      raceRegisteredPlayers.splice(inRace, 1);
    }
    raceSelectedCars.delete(this.id);
    if (
      raceCarsEntity.has(this.id) &&
      mp.vehicles.exists(raceCarsEntity.get(this.id))
    ) {
      raceCarsEntity.get(this.id).destroy();
    }
    raceCarsEntity.delete(this.id);
  };

  /** Синхронизация сумки на игроке */
  sync_bag = () => {
    if (!this.exists) return;
    let need: BagAttachData;
    if (this.grab_money) need = BAG_ATTACH.grab_money;
    if (!need && this.grab_money_shop) need = BAG_ATTACH.grab_money_shop;
    if (!need && this.grab_item && this.grab_item.length > 0)
      need = BAG_ATTACH.grab_item;
    if (!need && this.gr6Money) need = BAG_ATTACH.gr6Money;
    if (!need && this.box_game_owner) need = BAG_ATTACH.box_game_owner;
    if (!need) {
      const inv = this.inventory;

      if (
        this.entity.selectedBag &&
        CONTAINERS_DATA.find((b) => b.item_id === this.entity.selectedBag)
          ?.bag_sync
      ) {
        need = CONTAINERS_DATA.find(
          (b) => b.item_id === this.entity.selectedBag
        ).bag_sync;
      } else {
        CONTAINERS_DATA.filter((q) => q.bag_sync).map((q) => {
          if (need) return;
          if (inv.find((s) => s.item_id === q.item_id)) need = q.bag_sync;
        });
      }
    }

    if (need) this.player.setClothes(5, need.d, need.t, need.p);
    else this.player.setClothes(5, 0, 0, 2);
  };

  get illData() {
    return this.entity.ill;
  }

  getIll = (id: IllId) => {
    return this.entity.ill[id] || 0;
  };

  setIll = (id: IllId, value: number) => {
    const cfg = illData.find((q) => q.id === id);
    if (!cfg) return;
    if (value < 0) value = 0;
    if (cfg.max < value) value = cfg.max;
    let oldIll = { ...this.entity.ill };
    oldIll[id] = value;
    this.entity.ill = oldIll;
  };

  addIll = (id: IllId, value: number) => {
    const cfg = illData.find((q) => q.id === id);
    if (!cfg) return;
    if (this.getIll(id) >= cfg.critical)
      this.setIll(
        id,
        system.biggestNumber(cfg.critical, this.getIll(id) - value)
      );
    else this.setIll(id, this.getIll(id) + value);
  };

  removeIll = (id: IllId, value: number) => {
    this.setIll(id, this.getIll(id) - value);
  };

  /** Таймер использования медикаментов и прочего */
  pillUseCoolDown = new Map();

  get afk(): boolean {
    return !this.exists || !!this.player.getVariable("afk");
  }

  set afk(val) {
    if (!this.exists) return;
    this.player.setVariable("afk", val);
  }

  get grab_money() {
    return this.grab_money_data;
  }

  set grab_money(val) {
    this.grab_money_data = val;
    this.sync_bag();
  }

  private grab_money_shop_data = 0;
  get grab_money_shop() {
    return this.grab_money_shop_data;
  }

  set grab_money_shop(val) {
    this.grab_money_shop_data = val;
    this.sync_bag();
  }

  get grab_item() {
    return this.grab_item_data || [];
  }

  set grab_item(val) {
    if (!val) val = [];
    this.grab_item_data = val;
    this.sync_bag();
  }
  giveGrabItem = (id: number, amount: number = 1) => {
    const items = [...this.grab_item];
    const item = items.find((q) => q.id === id);
    if (item) item.amount += amount;
    else items.push({ id, amount });
    this.grab_item = items;
  };

  get boxgame_owner() {
    return this.box_game_owner;
  }

  set boxgame_owner(val) {
    this.box_game_owner = val;
    this.sync_bag();
  }

  get dbid() {
    return this.id;
  }

  /** Текущая випка */
  get vip() {
    return this.entity.vip;
  }

  /** Окончание текущей випки */
  get vip_end() {
    return this.entity.vip_end;
  }

  /** Данные по текущей випке */
  get vipData() {
    if (!this.vip) return null;
    if (system.timestamp > this.entity.vip_end) return null;
    const cfg = getVipConfig(this.vip);
    if (!cfg) return null;
    /** Срок окончания випки */
    const end = this.entity.vip_end;
    return {
      ...cfg,
      end,
    };
  }

  giveVip = (vip: VipId, days: number) => {
    if (system.timestamp < this.entity.vip_end && this.vip === vip)
      this.entity.vip_end += days * 24 * 60 * 60;
    else this.entity.vip_end = system.timestamp + days * 24 * 60 * 60;
    this.entity.vip = vip;
    this.save();
    CustomEvent.triggerClient(this.player, "vip:data", this.vip, this.vip_end);

    this.updateUserInAllProperty();
    this.player.setVariable("vip", this.entity.vip);
  };

  removeVip = () => {
    this.entity.vip = null;
    this.entity.vip_end = 0;
    this.entity.save();
    CustomEvent.triggerClient(this.player, "vip:data", this.vip, this.vip_end);

    this.updateUserInAllProperty();
    this.player.setVariable("vip", this.entity.vip);
  };

  /**
   * Обновить UserEntity в сущностях, в которых есть ссылка на текущего этого пользователя
   */
  updateUserInAllProperty = () => {
    if (this.houseEntity) {
      this.houseEntity.user = this.entity;
    }

    if (this.warehouseEntity) {
      this.warehouseEntity.user = this.entity;
    }

    if (this.business) {
      this.business.user = this.entity;
    }

    this.myVehicles.forEach((vehicle) => {
      vehicle.data.user = this.entity;
    });
  };

  /** Данные по лицензиям игрока */
  get licenses() {
    return this.licenseClass.licenses;
  }

  set licenses(val) {
    this.licenseClass.licenses = val;
  }

  /** Проверка на наличие активной лицензии */
  get haveActiveLicense() {
    return this.licenseClass.haveActiveLicenseQ;
  }

  /** Проверка на наличие активной лицензии */
  get getLicense() {
    return this.licenseClass.getLicenseQ;
  }

  /** Выдача лицензии на определённый срок в днях */
  get giveLicense() {
    return this.licenseClass.giveLicenseQ;
  }

  /** Изъять лицензию у игрока */
  get removeLicense() {
    return this.licenseClass.removeLicense;
  }

  get giveDocument() {
    return this.licenseClass.giveDocument;
  }

  get giveFakeDocument() {
    return this.licenseClass.giveFakeDocument;
  }

  get giveDocumentData() {
    return this.licenseClass.giveDocumentData;
  }

  get currentWeapon() {
    return this.weaponClass.currentWeapon;
  }
  set currentWeapon(val) {
    this.weaponClass.currentWeapon = val;
  }

  get syncAddonsWeapon() {
    return this.weaponClass.syncAddonsWeapon;
  }
  get reloadCurrentWeapon() {
    return this.weaponClass.reloadCurrentWeapon;
  }

  get currentWeaponSync() {
    return this.weaponClass.currentWeaponSync;
  }

  get hotkeys(): [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ] {
    try {
      if (!this.entity.hotkeys)
        return [null, null, null, null, null, null, null, null, null];

      let data = null;

      try {
        data = JSON.parse(this.entity.hotkeys || "[]");
      } catch (e) {
        data = null;
      }

      if (!Array.isArray(data) || data.length !== 9) {
        return [
          data[0] || null,
          data[1] || null,
          data[2] || null,
          data[3] || null,
          data[4] || null,
          data[5] || null,
          data[6] || null,
          data[7] || null,
          data[8] || null,
        ];
      }

      return data as [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ];
    } catch (e) {
      console.error("Ошибка при парсинге hotkeys:", e);
      return [null, null, null, null, null, null, null, null, null];
    }
  }

  set hotkeys(param) {
    this.entity.hotkeys = JSON.stringify(param);
  }

  get partner() {
    return this.entity.partnerId;
  }
  set partner(val) {
    this.entity.partnerId = val;
    this.save();
  }

  get password() {
    return this.account.password;
  }

  newPassword(password: string) {
    this.account.password = account.hashPassword(password);
    this.account.save();
  }

  setPartner = (val: UserEntity) => {
    this.entity.partner = val;
    this.save();
  };

  get social_number() {
    return this.entity.social_number;
  }

  set social_number(param) {
    this.entity.social_number = param;
    this.save();
  }

  /** Персонаж использует стоковую модель. Нужно для всяких проверок на одежду и т.д. */
  get mp_character() {
    if (!this.exists) return false;
    if (this.male) return true;
    if (this.feemale) return true;
    return false;
  }

  /** Является ли персонаж мужским */
  get is_male() {
    if (!this.exists) return 0;
    if (this.player.model == mp.joaat("mp_m_freemode_01")) return 1;
    return 0;
  }

  /** Является ли персонаж мужским */
  get male() {
    if (!this.exists) return false;
    if (this.player.model == mp.joaat("mp_m_freemode_01")) return true;
    return false;
  }

  /** Является ли персонаж женским */
  get feemale() {
    if (!this.exists) return false;
    if (this.player.model == mp.joaat("mp_f_freemode_01")) return true;
    return false;
  }

  get isDriver() {
    if (!this.exists) return false;
    if (!this.player.vehicle) return false;
    if (this.player.seat) return false;
    return true;
  }

  get jail_time() {
    return this.entity.jail_time;
  }

  set jail_time(value: number) {
    this.entity.jail_time = value;
  }

  get jail_reason() {
    return this.entity.jail_reason;
  }

  set jail_reason(value) {
    this.entity.jail_reason = value;
  }

  get jail_time_admin() {
    return this.entity.jail_time_admin;
  }

  set jail_time_admin(value: number) {
    this.entity.jail_time_admin = value;
  }

  get jail_reason_admin() {
    return this.entity.jail_reason_admin;
  }

  set jail_reason_admin(value) {
    this.entity.jail_reason_admin = value;
  }

  /** Инвентарь игрока */
  get inventory() {
    return inventory.getInventory(OWNER_TYPES.PLAYER, this.id);
  }

  get giveWeapon() {
    return this.weaponClass.giveWeapon;
  }

  /** Все предметы со всех контейнеров внутри */
  get allMyItems() {
    let data = [...this.inventory];
    data.map((item) => {
      const container = CONTAINERS_DATA.find((q) => q.item_id === item.item_id);
      if (container)
        data.push(...inventory.getInventory(container.owner_type, item.id));
    });
    return data;
  }

  /** Получить в хоткеях игрока предмет по Item_ID */
  getItemInHotkeyByItemID = (item_id: number | number[]) => {
    let item_ids = typeof item_id === "number" ? [item_id] : item_id;
    let resItemId: ItemEntity;
    const items = this.inventory;
    this.hotkeys.map((id) => {
      if (resItemId) return;
      const itm = items.find((i) => i.id === id);
      if (itm && item_ids.includes(itm.item_id)) resItemId = itm;
    });

    return resItemId;
  };

  /** Функция проверяет, влезел ли новый предмет в инвентарь */
  canTakeItem = (item_id: number, amount = 1, count?: number) => {
    return inventory.canTakeItem(
      OWNER_TYPES.PLAYER,
      this.id,
      item_id,
      amount,
      count
    );
  };

  /** Функция проверяет, влезет ли новый предмет в инвентарь и если необходимо - выдаёт */
  tryGiveItem = (
    item_id: number,
    notifyCheck = true,
    notifyGive = false,
    count?: number
  ) => {
    if (!this.canTakeItem(item_id, 1, count)) {
      if (notifyCheck)
        this.player.notify(
          this.LangString("user.tryGiveItem", getBaseItemNameById(item_id)),
          "error"
        );
      return false;
    }
    this.giveItem(item_id, notifyGive, false, count);
    return true;
  };
  /** Функция проверяет, влезет ли новый предмет в инвентарь и если необходимо - выдаёт */
  tryGiveItemAsync = async (
    item_id: number,
    notifyCheck = true,
    notifyGive = false,
    count?: number
  ) => {
    if (!this.canTakeItem(item_id, 1, count)) {
      if (notifyCheck)
        this.player.notify(
          this.LangString("user.tryGiveItem", getBaseItemNameById(item_id)),
          "error"
        );
      return null;
    }
    return this.giveItem(item_id, notifyGive, false, count);
  };

  /** Функция проверяет, влезет ли новый предмет в инвентарь и если необходимо - выдаёт */
  giveItem = (
    item: number | Partial<ItemEntity>,
    notifyGive = false,
    isTempItem = false,
    count?: number
  ) => {
    const item_id = typeof item === "number" ? item : item.item_id;

    const cfg = inventoryShared.get(item_id);
    if (!cfg) return null;

    if (notifyGive && this.exists)
      this.player.notify(
        this.LangString("user.giveItem", getBaseItemNameById(item_id)),
        "success"
      );

    let itemParams: Partial<ItemEntity> =
      typeof item === "number"
        ? {
            item_id,
            temp: isTempItem ? 1 : 0,
            count: count ? count : cfg.default_count,
          }
        : item;

    itemParams = {
      ...itemParams,
      owner_type: OWNER_TYPES.PLAYER,
      owner_id: this.id,
    };

    return inventory.createItem(itemParams);
  };

  jailByFamily = (who: PlayerMp, timeInMinutes: number, reason: string) => {
    if (!this.exists) return;

    this.jail_time = timeInMinutes * 60;
    this.jail_reason = reason;

    if (mp.players.exists(who) && !who.user.isAdminNow() && who.user.is_gos) {
      const whoFamily = who.user.family;
      this.jail_reason =
        reason + ` / [${whoFamily.name}] ${who.user.name} (${who.user.id})`;
      this.writeRpHistory(
        this.LangString(
          "user.jailfamily.history",
          whoFamily.name,
          who.user.name,
          who.user.id,
          this.jail_time / 60,
          this.jail_reason
        )
      );
      who.user.log(
        "gosJob",
        who.user.LangString(
          "user.jailfamily.log",
          this.jail_time / 60,
          this.jail_reason
        ),
        this.player
      );
    }

    this.wanted_level = 0;
    this.wanted_reason = "";
    this.jailSync();
  };

  jail = (who: PlayerMp, reason: string) => {
    if (!this.exists) return;
    if (!this.wanted_level) return;

    if (!this.isAdminNow()) {
      this.jail_time = this.wanted_level * JAIL_MINUTES_PER_STAR * 60;
      this.jail_reason = reason;
    }
    if (mp.players.exists(who) && !who.user.isAdminNow() && who.user.is_gos) {
      const whoFraction = who.user.fractionData;
      this.jail_reason =
        reason + ` / [${whoFraction.name}] ${who.user.name} (${who.user.id})`;
      this.writeRpHistory(
        this.LangString(
          "user.jail.history",
          whoFraction.name,
          who.user.name,
          who.user.id,
          this.jail_time / 60,
          this.jail_reason
        )
      );
      who.user.log(
        "gosJob",
        who.user.LangString(
          "user.jail.log",
          this.jail_time / 60,
          this.jail_reason
        ),
        this.player
      );
    }
    this.wanted_level = 0;
    this.wanted_reason = "";
    tablet.gosSearchDataReload(this.id);
    this.jailSync();
  };

  jailAdmin = async (who: PlayerMp, time: number, reason: string) => {
    if (!this.isAdminNow()) {
      this.jail_time_admin = time;
      this.jail_reason_admin = reason;
      if (mp.players.exists(who)) {
        this.jail_reason_admin =
          reason + ` / ${who.user.name} (${who.user.id})`;
      }
      if (this.exists) {
        if (this.heal_time) {
          this.heal_time = 0;
          await CustomEvent.triggerClient(
            this.player,
            "hospital:clearHealTimer"
          );
        }
        if (this.player && mp.players.exists(this.player) && this.player.user) {
          mp.players
            .toArray()
            .filter(
              (q) =>
                q.id !== this.player.id &&
                q.user &&
                (q.user.isAdminNow() ||
                  (q.dimension === this.player.dimension &&
                    system.distanceToPos(this.player.position, q.position) <
                      50))
            )
            .map((target) => {
              target.outputChatBox(
                target.user.LangString(
                  "user.jailadmin.chat",
                  gui.chat.getTime(),
                  this.name,
                  `${who.user.name} (${who.user.id})`,
                  system.filterInput(reason)
                )
              );
            });
        }
      }
    }
    this.jailSync();
  };

  jailSync = () => {
    if (!this.exists) return false;
    this.cuffed = false;
    this.adminRestore();
    if (this.jail_time_admin) {
      this.teleport(
        ADMIN_PRISON_COORD.x,
        ADMIN_PRISON_COORD.y,
        ADMIN_PRISON_COORD.z,
        0,
        this.player.id + 1
      );
      CustomEvent.triggerClient(
        this.player,
        "jail:sync",
        this.jail_time_admin,
        this.jail_reason_admin,
        true
      );
      this.notify(this.LangString("user.jailadmin.sync"), "warning");
      inventory.removeAllWeapons(this.player);
      return true;
    } else if (this.jail_time) {
      this.notify(this.LangString("user.jail.time"), "warning");
      this.teleport(PRISON_DATA[0].x, PRISON_DATA[0].y, PRISON_DATA[0].z, 0, 0);
      CustomEvent.triggerClient(
        this.player,
        "jail:sync",
        this.jail_time,
        this.jail_reason,
        false
      );
      return true;
    } else {
      if (!this.returnToOldPos()) return false;
      CustomEvent.triggerClient(this.player, "jail:clear");
    }
    return false;
  };

  get jailSyncHave() {
    if (!this.exists) return false;
    return !!this.prison;
  }

  regenerationInterval?: number;
  regenerationEndsTimestamp?: number;

  /**
   * Регенерирует здоровье игрока в течении определенного времени
   * @param health кол-во хп, которое будет даваться
   * каждые breakDurationS секунд в течении durationS секунд
   * @param durationS
   * @param breakDurationS
   */
  setRegeneration(health: number, durationS: number, breakDurationS: number) {
    if (this.regenerationInterval) {
      this.clearRegeneration();
    }

    this.regenerationEndsTimestamp = system.timestamp + durationS;
    this.regenerationInterval = setInterval(() => {
      if (!this.player || !mp.players.exists(this.player)) {
        clearInterval(this.regenerationInterval);
      }

      if (this.health > 0) this.health += health;

      if (system.timestamp > this.regenerationEndsTimestamp) {
        this.clearRegeneration();
      }
    }, breakDurationS * 1000);
  }

  clearRegeneration() {
    if (this.regenerationInterval != null) {
      clearInterval(this.regenerationInterval);
      this.regenerationInterval = null;
    }
  }

  resistTimer?: number;
  /**
   * Дает сопротивление к урону на определенное время
   * @param resist Сопротивление (процент непоглощаемого урона), должно быть меньше 1
   * @param timeS Время сопротивления в секундах
   */
  giveDamageResist(resist: number, timeS: number) {
    if (resist >= 1) {
      throw new Error("Resist must be less then 1");
    }

    this.player.setVariable("damageResist", resist);
    this.resistTimer = setTimeout(this.clearDamageResist, timeS * 1000);
  }

  clearDamageResist = () => {
    if (this.player && mp.players.exists(this.player)) {
      this.player.setVariable("damageResist", null);
    }

    if (this.resistTimer) {
      clearTimeout(this.resistTimer);
    }
  };

  returnToOldPos = () => {
    if (!this.exists) return false;
    if (!this.tempData.oldpos) return false;
    this.teleport(
      this.tempData.oldpos.x,
      this.tempData.oldpos.y,
      this.tempData.oldpos.z,
      this.tempData.oldpos.h,
      this.tempData.oldpos.d
    );
    this.tempData.oldpos = null;
    return true;
  };

  get is_gos() {
    return this.fractionData ? !!this.fractionData.gos : false;
  }

  /** Фракция игрока имеет возможности полиции (арест, наручники и прочее) */
  get is_police() {
    return this.fractionData ? !!this.fractionData.police : false;
  }

  get is_government() {
    return this.fractionData?.government ?? false;
  }

  get is_mafia() {
    return this.fractionData?.mafia;
  }

  get is_gang() {
    return this.fractionData ? !!this.fractionData.gang : false;
  }

  duckWalk: boolean = false;

  cheatDetect = (type: ANTICHEAT_TYPE, reason: string) => {
    let r = `${this.name} (${this.id}) CHEAT DETECTION - ${type} ${reason}`;
    system.debug.info(r);
    this.log("anticheat", `${type} - ${reason}`);
    dialogSystem.postMessage(null, "admin_cheat", r, {
      x: this.player.position.x,
      y: this.player.position.y,
    });
    return;
    if (this.exists) {
      this.player.kick("Cheat detection");
    }
  };

  payday = () => {
    return userPayDay(this);
  };

  private _tryPayment(
    sum: number,
    type: "all" | "cash" | "card" | "donate" = "all",
    checkBeforePay: () => boolean,
    reason: string,
    initiator: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.exists) return reject("Jucatorul nu este online");

      const cardTr = (pin: string) => {
        if (!this.bank_have) {
          this.notify(this.LangString("user.tryPayment.bankHave"), "error");
          return resolve(false);
        }
        const card = this.allMyItems.find(
          (item) => item.item_id == 801 && this.bank_number == item.serial
        );
        if (!card) {
          this.notify(this.LangString("user.tryPayment.noCard"), "error");
          return resolve(false);
        }
        if (account.hashPassword(pin) != card.extra)
          return (
            this.notify(this.LangString("user.tryPayment.pass"), "error"),
            resolve(false)
          );
        if (this.bank_money < sum) {
          this.notify(this.LangString("user.tryPayment.money"), "error");
          return resolve(false);
        }
        if (checkBeforePay) {
          if (!checkBeforePay()) return resolve(false);
        }
        if (!this.tryRemoveBankMoney(sum, true, reason, initiator))
          return resolve(false);
        return resolve(true);
      };
      const cashTr = () => {
        if (this.money < sum) {
          this.notify(
            this.LangString(
              "user.tryPayment.cash.money",
              system.numberFormat(sum - this.money),
              system.numberFormat(this.money)
            ),
            "error"
          );
          return resolve(false);
        }
        if (checkBeforePay) {
          if (!checkBeforePay()) return resolve(false);
        }
        this.removeMoney(sum, false, reason);
        return resolve(true);
      };

      if (type == "cash") {
        cashTr();
      } else if (type == "card") {
        menu
          .input(
            this.player,
            this.LangString("user.tryPayment.card.pin"),
            "",
            4,
            "passwordNumber"
          )
          .then((res) => {
            res = String(res);
            cardTr(res);
          });
      } else if (type == "donate") {
        if (this.donate_money < sum) {
          this.notify(
            this.LangString(
              "user.tryPayment.donate.sum",
              system.numberFormat(sum - this.donate_money),
              system.numberFormat(this.donate_money),
              DONATE_MONEY_NAMES[2]
            ),
            "error"
          );
          return resolve(false);
        } else {
          if (checkBeforePay) {
            if (!checkBeforePay()) return resolve(false);
          }
          this.removeDonateMoney(sum, reason);
          return resolve(true);
        }
      } else {
        CustomEvent.callClient(this.player, "server:payment", reason, sum).then(
          (qs: string) => {
            if (!qs) resolve(false);
            const q: PayData = JSON.parse(qs);
            if (q.paytype === PayType.CASH) {
              cashTr();
            } else if (q.paytype === PayType.CARD) {
              cardTr(q.pin);
            } else return resolve(false);
          }
        );
      }
    });
  }

  tryPayment = (
    sum: number,
    type: "all" | "cash" | "card" | "donate" = "all",
    checkBeforePay: () => boolean,
    reason: string,
    initiator: string
  ): Promise<boolean> => {
    return this._tryPayment(sum, type, checkBeforePay, reason, initiator);
  };

  getBankHistory = async (): Promise<BankHistoryItem[]> => {
    const data = await BankHistoryEntity.find({
      where: {
        user: { id: this.id },
      },
      take: 50,
      order: { id: "DESC" },
    });
    return data.map((item) => {
      return {
        id: item.id,
        text: item.text.replace(/\n/g, "||||").replace(/<br\/>/g, "||||"),
        type: item.type,
        sum: item.sum,
        time: item.time,
        target: item.target,
        ticket: item.ticket,
      };
    });
  };

  _verifyBankCardPay(pin: string) {
    if (!this.bank_have) return false;
    return !!this.allMyItems.find(
      (item) =>
        item.item_id == 801 &&
        item.advancedNumber == this.id &&
        this.bank_number == item.serial &&
        account.hashPassword(pin) == item.extra
    );
  }

  verifyBankCardPay = (pin: string) => {
    return this._verifyBankCardPay(pin);
  };

  setNewBankPassword(newPin: string) {
    const card = this.allMyItems.find(
      (item) =>
        item.item_id == 801 &&
        item.advancedNumber == this.id &&
        this.bank_number == item.serial
    );
    if (!card) return false;
    card.extra = account.hashPassword(newPin);
    card.save();
    return true;
  }

  setHelpKey = (key: string, text: string, time?: number) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(this.player, "cef:alert:setHelpKey", key, text);
    if (!time) return;
    setTimeout(() => {
      if (!this.exists) return;
      this.removeHelpKey();
    }, time);
  };

  removeHelpKey = () => {
    if (!this.exists) return;
    CustomEvent.triggerCef(this.player, "cef:alert:removeHelpKey");
  };

  setHotkey = (slot: number, value: number) => {
    let hotkeys = this.hotkeys;
    hotkeys[slot] = value;
    this.hotkeys = hotkeys;
  };

  /** Запись действий игрока.
   * @requires Писать нужно от имени того, кто выполняет то или иное действие
   */
  log = (type: FileLogType, text: string, target?: PlayerMp | number) => {
    let myData = `${this.name} [${this.id}]`;
    let targetData = ``;
    if (target) {
      if (typeof target === "number") {
        let q = User.get(target);
        if (q) target = q;
      }
      targetData =
        typeof target === "number"
          ? `Spieler ${target}`
          : `${target.user.name} [${target.user.id}]`;
    }
    let resText = target
      ? this.LangString("user.log", myData, targetData, text)
      : `${myData} - ${text}`;
    system.saveLog(
      type,
      resText,
      this.entity,
      target ? (typeof target === "number" ? target : target.dbid) : null
    );
  };

  get setCurrentWeaponAmmo() {
    return this.weaponClass.setCurrentWeaponAmmo;
  }
  get removeCurrentWeapon() {
    return this.weaponClass.removeCurrentWeapon;
  }
  get removeWeapon() {
    return this.weaponClass.removeWeapon;
  }
  get unloadAmmo() {
    return this.weaponClass.unloadAmmo;
  }
  get dropPos() {
    return system.offsetPosition(
      this.player.position,
      this.player.heading,
      new mp.Vector3(0, 0.5, -0.9)
    );
  }

  /** Получить пароль, который игрок указывал ранее от хранилища */
  getSavedPassword = (owner_type: number, owner_id: number) => {
    return this.inventoryPasswordStorage.get(`${owner_type}_${owner_id}`);
  };

  /** Сохранить в хранилище игрока пароль */
  setSavedPassword = (owner_type: number, owner_id: number, value: number) => {
    this.inventoryPasswordStorage.set(`${owner_type}_${owner_id}`, value);
  };

  notify = (text: string, type?: AlertType, img?: string, time?: number) => {
    if (!this.exists) return;
    return this.player.notify(text, type, img, time);
  };

  notifyBig = (title: string, text: string, time = DEFAULT_ALERT_TIME) => {
    if (!this.exists) return;
    CustomEvent.triggerCef(this.player, "cef:notifyBig", title, text, time);
  };

  /** Блокировка защиты от спама */
  spam = (time: number = 1000) => {
    if (this.ent_spam_protect) return true;
    this.ent_spam_protect = true;
    setTimeout(() => {
      if (this.exists) this.ent_spam_protect = false;
    }, time);
    return false;
  };

  get id() {
    return this.entity.id;
  }

  get signature() {
    return system.playerSignature(this.id);
  }

  get heal_time() {
    return this.entity.heal_time;
  }

  set heal_time(value: number) {
    this.entity.heal_time = value;
  }

  get warehouseEntity(): WarehouseEntity {
    return WarehouseEntity.getByOwner(this.id);
  }
  get warehouse(): number {
    const q = this.warehouseEntity;
    return q ? q.id : null;
  }

  get house(): number {
    const mhouse = this.houseEntity;
    return mhouse ? mhouse.id : null;
  }

  get houseEntity() {
    return [...houses.data].map((q) => q[1]).find((q) => q.userId === this.id);
  }

  get houseEntityLive() {
    return [...houses.data]
      .map((q) => q[1])
      .find((q) => q.garageAccess(this.id));
  }

  get business() {
    return business.getByOwner(this.id);
  }

  get exp() {
    return this.entity.exp;
  }

  set exp(value: number) {
    this.entity.exp = value;
  }

  giveExp = (value: number) => {
    this.entity.exp += value;
    if (this.exp >= getMaxExpLevel(this.level)) {
      this.entity.exp -= getMaxExpLevel(this.level);
      this.level += 1;
      if (LEVEL_MONEY_REWARD_MULTIPLER) {
        this.addMoney(
          LEVEL_MONEY_REWARD_MULTIPLER * this.level,
          true,
          this.LangString("user.giveExp")
        );
        this.notify(
          this.LangString(
            "user.giveExp.notify",
            this.level,
            system.numberFormat(LEVEL_MONEY_REWARD_MULTIPLER * this.level)
          ),
          "success"
        );
      }
      if (this.account.promocode && MEDIA_PROMOCODE.LEVEL_TWO === this.level) {
        this.addMoney(
          MEDIA_PROMOCODE.GIVE_MONEY_PLAYER_LEVEL,
          true,
          this.LangString("user.giveExp.promo")
        );
        if (this.exists)
          this.player.outputChatBox(
            this.LangString(
              "user.giveExp.promo.chat",
              system.numberFormat(MEDIA_PROMOCODE.GIVE_MONEY_PLAYER_LEVEL)
            )
          );
      }
    }
  };

  private alertsList: StorageAlertData = {};

  get alertsEnabled() {
    return this.alertsList;
  }
  set alertsEnabled(val) {
    if (typeof val !== "object") return;
    this.alertsList = val;
  }

  get level() {
    return this.entity.level;
  }

  get playtime() {
    return Math.floor(this.entity.played_time / 60); // conversie minute -> ore
  }

  set level(value: number) {
    if (this.exists) this.player.setVariable("level", value);
    this.entity.level = value;
    this.save();
  }

  get tag() {
    return this.entity.tag;
  }

  set tag(value) {
    this.entity.tag = value;
    if (this.exists) this.player.setVariable("tag", value);
  }

  private gpsTrackingListData = <number[]>[];

  get gpsTrackingList() {
    return this.gpsTrackingListData;
  }

  set gpsTrackingList(value) {
    this.gpsTrackingListData = value;
    CustomEvent.triggerClient(this.player, "faction:gpsTracking", value);
  }

  addGpsTracking = (id: number) => {
    if (this.gpsTrackingList.includes(id)) return;
    this.gpsTrackingList = [...this.gpsTrackingList, id];
  };

  removeGpsTracking = (id: number) => {
    if (!this.gpsTrackingList.includes(id)) return;
    const q = [...this.gpsTrackingList];
    q.splice(q.indexOf(id), 1);
    this.gpsTrackingList = q;
  };

  hasGpsTracking = (id: number) => {
    return this.gpsTrackingList.includes(id);
  };

  /** Конфиг моей фракции */
  get fractionData() {
    if (!this.fraction) return null;
    return fractionCfg.getFraction(this.fraction);
  }

  get isLeader() {
    if (!this.fraction) return false;
    return fractionCfg.getLeaderRank(this.fraction) === this.rank;
  }

  get isSubLeader() {
    if (!this.fraction) return false;
    return fractionCfg.getSubLeaderRank(this.fraction) <= this.rank;
  }

  /** ID моей фракции */
  get fraction(): FACTION_ID {
    return this.entity.fraction;
  }

  get udoData(): UdoTypeBase {
    return {
      player: this.name,
      fraction: this.fraction,
      rank: this.rank,
      user: this.id,
      tag: this.tag,
    };
  }

  set fraction(value: FACTION_ID) {
    const old = this.fraction;
    if (old === value) return;
    if (!value && this.entity.fraction) this.rank = 0;
    else if (value) this.rank = 1;

    if (value) {
      let q = fractionCfg.getFraction(value);
      if (q.gos) {
        this.writeRpHistory(this.LangString("user.factionHistory", q.name));
      }
    }

    if (this.entity.fraction) {
      let q = fractionCfg.getFraction(this.entity.fraction);
      if (q.gos) {
        this.writeRpHistory(this.LangString("user.factionHistory.gos", q.name));
      }
    }

    this.entity.fraction = value ? value : 0;
    if (this.exists) {
      this.player.setVariable("fraction", value);
      if (this.player.getVariable("gpsTrack"))
        this.player.setVariable("gpsTrack", null);
    }
    this.save();
    setTimeout(() => {
      if (old) tablet.reloadFractionData(old);
      if (this.fraction) tablet.reloadFractionData(this.fraction);
    }, 500);

    SendUpdate(this.player, "fraction");
  }

  /** Ранг внутри моей фракции */
  get rank() {
    return this.entity.rank;
  }

  /** Можем ли мы попасть в другое измерение */
  get canEnterAnotherDimension() {
    return true;
  }

  /** Время когда игрока грабили последний раз */
  public lastRobbedTime: number = 0;
  /** Можно ли ограбить игрока */
  get canBeRobbed(): boolean {
    return system.getTimeStamp() - this.lastRobbedTime > CRIME_ROBBERY_COOLDOWN;
  }

  get rankName() {
    return fractionCfg.getRankName(this.fraction, this.rank);
  }

  set rank(value: number) {
    this.entity.rank = value ? value : 0;
    if (this.exists) this.player.setVariable("rank", value);
    if (this.fraction && value) tablet.reloadFractionData(this.fraction);
    this.save();
  }

  set fractionWarns(count: number) {
    this.entity.fraction_warns = count;
    this.save();
    if (this.fraction) tablet.reloadFractionData(this.fraction);
  }

  get fractionWarns() {
    return this.entity.fraction_warns;
  }

  get donate_money() {
    return this.account.donate;
  }

  set donate_money(value: number) {
    if (typeof value === "string") value = parseInt(value);
    if (isNaN(value)) return;
    if (!value) value = 0;
    this.account.donate = value;
    saveEntity(this.account);
  }

  removeDonateMoney = (money: number, reason: string) => {
    if (typeof money === "string") money = parseInt(money);
    if (isNaN(money)) return false;
    if (!money) return false;
    if (this.donate_money < money) return false;
    this.donate_money = this.donate_money - money;
    this.log("DonateMoney", `remove ${money} [${reason}]`);
    return true;
  };

  addDonateMoney = (money: number, reason: string) => {
    if (typeof money === "string") money = parseInt(money);
    if (isNaN(money)) return false;
    if (!money) return false;
    this.donate_money = this.donate_money + money;
    this.log("DonateMoney", `add ${money} [${reason}]`);
    return true;
  };

  /** Попытка снятия средств с донат-счета */
  tryRemoveDonateMoney = (money: number, notify = false, reason: string) => {
    if (isNaN(money) || money <= 0) {
      system.debug.error(
        `tryRemoveDonateMoney get money arg as ${typeof money}`
      );
      return false;
    }

    if (this.donate_money < money) {
      if (notify)
        this.notify(
          this.LangString(
            "user.tryRemoveDonateMoney",
            system.numberFormat(money)
          )
        );
      return false;
    }
    this.donate_money -= money;
    system.saveLog("DonateMoney", `remove ${money}$ [${reason}]`, this.entity);
    return true;
  };

  get money() {
    return Math.floor(this.entity.money || 0);
  }

  set money(value: number) {
    if (typeof value === "string") value = parseInt(value);
    if (isNaN(value)) return;
    if (!value) value = 0;
    this.entity.money = value;
    value = Math.floor(value);
    CustomEvent.triggerClient(this.player, "setMoney", value);
  }

  get chips() {
    return Math.floor(this.entity.chips || 0);
  }

  set chips(value: number) {
    if (typeof value === "string") value = parseInt(value);
    if (isNaN(value)) return;
    if (!value) value = 0;
    this.entity.chips = value;
    value = Math.floor(value);
    CustomEvent.triggerClient(this.player, "setChips", value);
  }

  get crypto_number() {
    return this.entity.crypto_number;
  }

  newCryptoNumber() {
    this.entity.crypto_number = system.randomStr(20);
  }

  get crypto() {
    return Math.floor(this.entity.crypto_money || 0);
  }

  set crypto(value: number) {
    if (typeof value === "string") value = parseInt(value);
    if (isNaN(value)) return;
    if (!value) value = 0;
    this.entity.crypto_money = value;
    // value = Math.floor(value);
    // CustomEvent.triggerClient(this.player, 'setChips', value);
  }

  get bank_money() {
    return Math.floor(this.entity.bank_money || 0);
  }

  set bank_money(value: number) {
    if (typeof value === "string") value = parseInt(value);
    if (isNaN(value)) return;
    if (!value) value = 0;
    value = Math.floor(value);
    this.entity.bank_money = value;
    CustomEvent.triggerClient(this.player, "setBankMoney", value);
  }

  get bank_number() {
    return this.entity.bank_number;
  }

  set bank_number(value: string) {
    this.entity.bank_number = value;
    if (this.exists)
      CustomEvent.triggerCef(
        this.player,
        "cef:hud:hasBankCard",
        !!value,
        this.myBankType,
        this.bank_number
      );
    this.save();
  }

  get bank_have() {
    return !!this.entity.bank_number;
  }

  get bank_tarif() {
    return this.entity.bank_tarif;
  }

  get bank_tarif_max() {
    if (!this.bank_have) return 0;
    return bankCardMax[this.entity.bank_tarif];
  }

  set bank_tarif(value: number) {
    this.entity.bank_tarif = value;
    this.save();
  }

  hp: number = 50;

  /** Здоровье игрока */
  get health() {
    return this.hp;
  }

  set health(value: number) {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    if (!this.exists) return;
    if (this.hp < value) this.anticheatProtect("heal");
    if (this.hp <= 0 && value > 0) this.player.spawn(this.player.position);
    this.hp = value;
    CustomEvent.triggerClient(this.player, "survival:setHP", value);
    this.player.setVariable("customHealth", value);
    this.entity.health = value;
  }

  public lastCombatTimeMs: number = 0;
  /** Комбат протект - после получения урона  */
  get isInCombat(): boolean {
    return (
      system.timestampMS < this.lastCombatTimeMs + COMBAT_BLOCK_TIME_S * 1000
    );
  }

  spawn = (pos: Vector3Mp) => {
    if (!this.exists) return;
    this.anticheatProtects(["heal", "teleport"]);
    this.player.spawn(pos);
  };

  private _customArmor = 0;

  get customArmor() {
    return this._customArmor;
  }

  set customArmor(value: number) {
    this._customArmor = value;
    this.entity.armour = value;
  }

  /** Здоровье игрока */
  get armour() {
    return this.player.armour;
  }

  set armour(value: number) {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    if (!this.exists) return;
    if (this.player.armour < value) this.anticheatProtect("armour", 20000);
    this.player.armour = value;
    this.entity.armour = value;

    this._customArmor = value;
  }

  /** Тату игрока */
  get tattoos() {
    return JSON.parse(this.entity.tattoos || "[]");
  }

  set tattoos(value: [string, string][]) {
    this.entity.tattoos = JSON.stringify(value);
    this.save();
  }

  /** Все тату игрока */
  getAllTattoos = (): [string, string][] => {
    return this.tattoos;
  };

  /** Количество тату на теле */
  countTattoos = () => {
    return this.getAllTattoos().length;
  };

  /** Есть ли тату на теле у игрока */
  haveTattoo = (collection: string, overlay: string) => {
    return !!this.getAllTattoos().find(
      (q) => q[0] === collection && q[1] === overlay
    );
  };

  /** Удалить тату с тела */
  removeTattoo = (collection: string, overlay: string) => {
    if (!this.exists) return;
    this.player.removeDecoration(mp.joaat(collection), mp.joaat(overlay));
    let tattoos = [...this.tattoos];
    if (tattoos.findIndex((q) => q[0] === collection && q[1] === overlay) > -1)
      tattoos.splice(
        tattoos.findIndex((q) => q[0] === collection && q[1] === overlay),
        1
      );
    this.tattoos = tattoos;
  };

  /** Удалить тату с тела */
  removeAllTattoo = () => {
    if (!this.exists) return;
    this.player.clearDecorations();
  };

  /** Добавить тату */
  newTattoo = (collection: string, overlay: string) => {
    let tattoos = [...this.tattoos];
    tattoos.push([collection, overlay]);
    this.tattoos = tattoos;
    if (!this.exists) return;
    this.player.setDecoration(mp.joaat(collection), mp.joaat(overlay));
  };

  reloadTattoo = () => {
    if (!this.exists) return;
    this.player.clearDecorations();
    this.tattoos.map((item) =>
      this.player.setDecoration(mp.joaat(item[0]), mp.joaat(item[1]))
    );
  };

  /** Кастомизация персонажа */
  get skin(): CharacterSkinData {
    return this.entity.skin ? JSON.parse(this.entity.skin) : null;
  }

  set skin(value) {
    this.entity.skin = value ? JSON.stringify(value) : "";
    this.save();
  }

  /** Кастомизация персонажа */
  get dress() {
    return JSON.parse(this.entity.dress);
  }

  set dress(value: InventoryEquipList) {
    this.entity.dress = JSON.stringify(value);
    this.save();
  }

  setDressData = (val: Partial<InventoryEquipList>, withReload = true) => {
    if (!this.exists) return;
    if (this.player.getVariable("enabledAdmin")) return;

    let data = this.dress;
    this.dress = { ...data, ...val };

    if (withReload) {
      this.reloadDress();
    }
  };

  setDressValueById = (id: number, value: number, armorLeft?: number) => {
    if (!this.exists) return;
    if (this.player.getVariable("enabledAdmin")) return;

    let userdress = this.dress;
    let advancedNumber = 0;
    let serial = "";
    let forBattlePass = false;
    let donateBlock = false;
    if (value) {
      let dressCfg = dress.get(value);
      if (!dressCfg) {
        this.setDressValueById(id, 0);
        return;
      }
    }
    if (id === 949) {
      let dressCfg = dress.get(userdress.gloves);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.gloves;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err"), "error");
      this.setDressData({ gloves: value });
      this.playAnimation([["clothingspecs", "take_off"]], true);
    }
    if (id === 950) {
      let dressCfg = dress.get(userdress.mask);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.mask;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err2"), "error");
      this.setDressData({ mask: value });
      this.playAnimation([["mp_masks@standard_car@ds@", "put_on_mask"]], true);
    }
    if (id === 951) {
      let dressCfg = dress.get(userdress.torso);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.torso;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err3"), "error");
      this.setDressData({ torso: value });
      this.playAnimation([["missmic4", "michael_tux_fidget"]], true);
    }
    if (id === 952) {
      let dressCfg = dress.get(userdress.leg);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.leg;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err4"), "error");
      this.setDressData({ leg: value });
      this.playAnimation([["re@construction", "out_of_breath"]], true);
    }
    if (id === 953) {
      let dressCfg = dress.get(userdress.foot);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.foot;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err5"), "error");
      this.setDressData({ foot: value });
      this.playAnimation([["random@domestic", "pickup_low"]], true);
    }
    if (id === 954) {
      let dressCfg = dress.get(userdress.hat);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.hat;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err6"), "error");
      this.setDressData({ hat: value });
      this.playAnimation(
        [
          [
            "mp_masks@standard_car@ds@",
            value ? "put_on_mask" : "take_off_helmet_stand",
          ],
        ],
        true
      );
    }
    if (id === 955) {
      let dressCfg = dress.get(userdress.glasses);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.glasses;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err7"), "error");
      this.setDressData({ glasses: value });
      this.playAnimation([["clothingspecs", "take_off"]], true);
    }
    if (id === 956) {
      let dressCfg = dress.get(userdress.ear);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.ear;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err8"), "error");
      this.setDressData({ ear: value });
      this.playAnimation([["mp_cp_stolen_tut", "b_think"]], true);
    }
    if (id === 957) {
      let dressCfg = dress.get(userdress.watch);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.watch;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err9"), "error");
      this.setDressData({ watch: value });
      this.playAnimation([["nmt_3_rcm-10", "cs_nigel_dual-10"]], true);
    }
    if (id === 958) {
      let dressCfg = dress.get(userdress.accessorie);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.accessorie;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err10"), "error");
      this.setDressData({ accessorie: value });
      this.playAnimation([["clothingtie", "try_tie_positive_a"]], true);
    }
    if (id === 959) {
      let dressCfg = dress.get(userdress.bracelet);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.bracelet;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err11"), "error");
      this.setDressData({ bracelet: value });
      this.playAnimation([["nmt_3_rcm-10", "cs_nigel_dual-10"]], true);
    }
    if (id === ARMOR_ITEM_ID) {
      let dressCfg = dress.get(userdress.armor);
      if (dressCfg) {
        forBattlePass = dressCfg.forBattlePass;
        donateBlock = dressCfg.donateBlock;
        advancedNumber = userdress.armor;
        serial = dressCfg.name;
      } else if (!value)
        return this.player.notify(this.LangString("user.dress.err12"), "error");

      if (value === 0) {
        this.setDress(9, 0, 0);
      } else {
        const newCfg = dress.get(value);
        (newCfg.data as ClothData[])[0].forEach((q) =>
          this.setDress(q.component, q.drawable, q.texture)
        );
      }

      this.setDressData({ armor: value }, false);
      CustomEvent.triggerClient(this.player, "dress:data", this.dress);

      this.playAnimation([["missmic4", "michael_tux_fidget"]], true);
    }

    const getAdvancedString = () => {
      if (forBattlePass === true) {
        return "BATTLE_PASS_CLOTHES";
      }

      if (donateBlock === true) {
        return "DONATE_BLOCK_CLOTHES";
      }

      return "";
    };

    if (serial && advancedNumber) {
      const itemParams: Partial<ItemEntity> = {
        item_id: id,
        owner_type: OWNER_TYPES.PLAYER,
        owner_id: this.id,
        serial,
        advancedNumber,
        advancedString: getAdvancedString(),
      };

      if (id === ARMOR_ITEM_ID) {
        const armor = armorLeft ?? this.player.armour;
        if (!armor) {
          return;
        }

        itemParams.count = armor;
      }

      inventory.createItem(itemParams);
      this.player.notify(this.LangString("user.dress.notify", serial), "info");
    }
    if (value) {
      let dressCfg = dress.get(value);
      if (dressCfg)
        this.player.notify(
          this.LangString("user.dress.notify2", dressCfg.name),
          "success"
        );
    }
  };

  /** Визуально снять всю одежду на время */
  undress = () => {
    this.setDress(107, -1, -1);
    this.setDress(106, -1, -1);
    this.setDress(102, -1, -1);
    this.setDress(101, -1, -1);
    this.setDress(100, -1, -1);
    this.setDress(7, 0, 0);
    this.setDress(1, 0, 0);
    this.setDress(6, this.feemale ? 35 : 34, 0);
    this.setDress(4, this.feemale ? 15 : 14, 0);
    this.setDress(3, 15, 0);
    this.setDress(8, this.feemale ? 2 : 57, 0);
    this.setDress(11, 15, 0);
  };

  reloadDress = () => {
    let data = this.dress;
    if (!this.exists) return;
    if (this.player.getVariable("enabledAdmin")) return;

    let items: [string, number][] = [];
    if (!data.mask) this.setDress(1, 0, 0);
    else items.push(["mask", data.mask]);
    if (!data.bracelet) this.setDress(107, -1, -1);
    else items.push(["bracelet", data.bracelet]);
    if (!data.watch) this.setDress(106, -1, -1);
    else items.push(["watch", data.watch]);
    if (!data.ear) this.setDress(102, -1, -1);
    else items.push(["ear", data.ear]);
    if (!data.glasses) this.setDress(101, -1, -1);
    else items.push(["glasses", data.glasses]);
    if (!data.hat) this.setDress(100, -1, -1);
    else items.push(["hat", data.hat]);
    if (!data.accessorie) this.setDress(7, 0, 0);
    else items.push(["accessorie", data.accessorie]);
    if (!data.foot) this.setDress(6, this.feemale ? 35 : 34, 0);
    else items.push(["foot", data.foot]);
    if (!data.leg) this.setDress(4, this.feemale ? 15 : 14, 0);
    else items.push(["leg", data.leg]);
    if (!data.torso)
      this.setDress(3, 15, 0),
        this.setDress(8, this.feemale ? 2 : 57, 0),
        this.setDress(11, 15, 0);
    else items.push(["torso", data.torso]);
    if (!data.armor) this.setDress(9, 0, 0);
    else items.push(["armor", data.armor]);

    // getMany
    let cfgs = dress.getMany(
      items.map((q) => {
        return q[1];
      })
    );

    let nonHaveItems = items.filter((q) => {
      const cfgId =
        q[1] < CLOTH_VARIATION_ID_MULTIPLER
          ? q[1]
          : q[1] % CLOTH_VARIATION_ID_MULTIPLER;
      return !cfgs.find((s) => s.id === cfgId);
    });
    if (nonHaveItems.length > 0) {
      let res: Partial<InventoryEquipList> = {};
      nonHaveItems.map((item) => {
        (res as any)[item[0]] = 0;
      });
      this.setDressData(res);
      return;
    }

    items.map((item) => {
      const { id, variation } = dress.getIdVariation(item[1]);

      if (item[0] === "gloves") {
        return;
      } else {
        let cfg = dress.get(id);
        if (cfg && cfg.data[variation])
          (cfg.data[variation] as ClothData).map((q) =>
            this.setDress(q.component, q.drawable, q.texture)
          );
      }
    });

    if (data.gloves) {
      const { id, variation } = dress.getIdVariation(data.gloves);

      const torso = data.torso ? dress.getTorsoComponent(data.torso) : 15;

      const selectedGloves = dress.get(id).data[variation] as GloveClothData;
      const glovesTorso = selectedGloves.torsoMap.find(
        (torsoEntry) => torsoEntry[0] === torso
      )[1];

      if (glovesTorso != null) {
        this.setDress(1000, glovesTorso, selectedGloves.texture);
      }
    }

    this.sync_bag();
    CustomEvent.triggerClient(this.player, "dress:data", this.dress);

    this.setSkinNails();
  };

  putIntoVehicle = (
    vehicle: VehicleMp,
    /** Сиденье от 0 */
    seat: number = 0
  ) => {
    if (!this.exists) return;
    if (!vehicle || !mp.vehicles.exists(vehicle)) return;
    vehicle.usedAfterRespawn = true;
    vehicle.afkTime = 0;
    CustomEvent.triggerClient(
      this.player,
      "user:putIntoVehicle",
      vehicle.id,
      seat
    );
  };

  leaveVehicle = (flag: RageEnums.LeaveVehicle = 16) => {
    if (!this.exists) return;
    if (!this.player.vehicle) return;
    CustomEvent.triggerClient(this.player, "user:leaveVehicle", flag);
  };

  setDress = (component: number, drawable: number, texture: number) => {
    if (!this.exists) return;

    if (component === 1000) {
      this.player.setClothes(3, drawable, texture, 2);
      return;
    }

    if (component >= 100)
      this.player.setProp(component - 100, drawable, texture);
    else this.player.setClothes(component, drawable, texture, 2);
  };

  private incuff = false;

  /** В наручниках ли игрок */
  get cuffed() {
    return this.incuff;
  }

  set cuffed(val) {
    if (this.exists && this.cuffed != val)
      this.player.setVariable("cuffed", val);
    this.incuff = val;
    this.currentWeapon = null;
    if (val) inventory.closeInventory(this.player);
    if (!val && this.follow) this.follow = null;
  }

  private walkWithObject = false;
  /** Игрок переносит предмет с аттачем */
  get walkingWithObject() {
    return this.walkWithObject;
  }
  set walkingWithObject(val: boolean) {
    if (!this.exists) return;
    if (!mp.players.exists(this.player)) return;
    if (this.walkingWithObject != val)
      this.player.setVariable("walkingWithObject", val);
    this.walkWithObject = val;
    this.currentWeapon = null;
  }
  setUncuffedTarget = (target: PlayerMp) => {
    if (!this.exists) return;
    if (!mp.players.exists(target)) return;

    if (target.vehicle)
      return this.player.notify(
        this.LangString("user.setUncuffedTarget.vehicle"),
        "error"
      );

    if (
      target.user.cuffed &&
      target.user.policeCuffed &&
      !this.is_police &&
      !this.is_government &&
      target.user
        .getNearestPlayers(25)
        .find((q) => q && q.user && q.user.is_police && q.health > 0)
    )
      return this.notify(
        this.LangString("user.setUncuffedTarget.err"),
        "error"
      );

    if (!target.user.cuffed) {
      return this.notify("Jucatorul nu este in catuse", "error");
    }

    // ⚠️ Eliminam verificarea itemelor pentru descatusare complet
    // if (target.user.policeCuffed) {
    // 	if (this.getArrayItem(CUFFS_KEY_ITEM_ID).length === 0) {
    // 		this.notify(this.LangString("user.setUncuffedTarget.cuffed"));
    // 		return;
    // 	}
    // } else {
    // 	if (this.getItemsByIds(SCREWS_DESTROYER_ITEM_IDS).length === 0) {
    // 		this.notify(this.LangString("user.setUncuffedTarget.noscrews"));
    // 		return;
    // 	}
    // }

    const cuffsItemName = target.user.policeCuffed
      ? this.LangString("user.setUncuffedTarget.itemname1")
      : this.LangString("user.setUncuffedTarget.itemname2");

    target.user.cuffed = false;
    target.user.policeCuffed = false;

    gui.chat.sendMeCommandToPlayer(
      this.player,
      target,
      this.LangString("user.setUncuffedTarget.itemerr", cuffsItemName)
    );

    target.notify(
      target.user.LangString(
        "user.setUncuffedTarget.itemerr.notify",
        cuffsItemName
      ),
      "success"
    );

    if (this.is_police) {
      this.log(
        "gosJob",
        this.LangString("user.setUncuffedTarget.policeLog"),
        target
      );
    }

    this.playAnimation([["mp_arresting", "a_uncuff", 1]], false, false);
    mp.events.call("playerCuffed", target, target.user.cuffed);
  };

  /** Наручники использовал сотрудник LSPD */
  // policeCuffed = false;
  // setUncuffedTarget = (target: PlayerMp) => {
  // 	if (!this.exists) return;
  // 	if (!mp.players.exists(target)) return;

  // 	if (target.vehicle)
  // 		return this.player.notify(
  // 			this.LangString("user.setUncuffedTarget.vehicle"),
  // 			"error",
  // 		);

  // 	if (
  // 		target.user.cuffed &&
  // 		target.user.policeCuffed &&
  // 		!this.is_police &&
  // 		!this.is_government &&
  // 		target.user
  // 			.getNearestPlayers(25)
  // 			.find((q) => q && q.user && q.user.is_police && q.health > 0)
  // 	)
  // 		return this.notify(
  // 			this.LangString("user.setUncuffedTarget.err"),
  // 			"error",
  // 		);

  // 	if (!target.user.cuffed) {
  // 		// return this.notify("Spieler nicht in Handschellen", "error");
  // 		return this.notify("Jucatorul nu este in catuse", "error");

  // 	}

  // 	if (target.user.policeCuffed) {
  // 		if (this.getArrayItem(CUFFS_KEY_ITEM_ID).length === 0) {
  // 			this.notify(this.LangString("user.setUncuffedTarget.cuffed"));
  // 			return;
  // 		}
  // 	} else {
  // 		if (this.getItemsByIds(SCREWS_DESTROYER_ITEM_IDS).length === 0) {
  // 			this.notify(this.LangString("user.setUncuffedTarget.noscrews"));
  // 			return;
  // 		}
  // 	}

  // 	const cuffsItemName = target.user.policeCuffed
  // 		? this.LangString("user.setUncuffedTarget.itemname1")
  // 		: this.LangString("user.setUncuffedTarget.itemname2");

  // 	target.user.cuffed = false;
  // 	target.user.policeCuffed = false;
  // 	gui.chat.sendMeCommandToPlayer(
  // 		this.player,
  // 		target,
  // 		this.LangString("user.setUncuffedTarget.itemerr", cuffsItemName),
  // 	);
  // 	target.notify(
  // 		target.user.LangString(
  // 			"user.setUncuffedTarget.itemerr.notify",
  // 			cuffsItemName,
  // 		),
  // 		"success",
  // 	);

  // 	if (this.is_police) {
  // 		this.log(
  // 			"gosJob",
  // 			this.LangString("user.setUncuffedTarget.policeLog"),
  // 			target,
  // 		);
  // 	}

  // 	this.playAnimation([["mp_arresting", "a_uncuff", 1]], false, false);
  // 	mp.events.call("playerCuffed", target, target.user.cuffed);
  // };
  setCuffedTarget = (target: PlayerMp, handCuff?: ItemEntity) => {
    if (!this.exists) return;
    if (!mp.players.exists(target)) return;

    if (target.vehicle)
      return this.player.notify(
        this.LangString("user.setCuffedTarget.vehicle"),
        "error"
      );

    if (
      !this.is_police &&
      !this.is_government &&
      this.fraction !== 16 &&
      this.fraction != 1 &&
      this.inSaveZone
    )
      return this.player.notify(
        this.LangString("user.setCuffedTarget.savezone"),
        "error"
      );

    if (target.user.cuffed) {
      return this.notify(
        this.LangString("user.setCuffedTarget.cuffed"),
        "error"
      );
    }

    // NU mai verificam daca are item si NU il mai consumam
    target.user.cuffed = true;
    target.user.policeCuffed = this.is_police || this.is_government;

    const cuffsItemName = target.user.policeCuffed
      ? this.LangString("user.setUncuffedTarget.itemname1")
      : this.LangString("user.setUncuffedTarget.itemname2");

    gui.chat.sendMeCommandToPlayer(
      this.player,
      target,
      this.LangString("user.setCuffedTarget.chat", cuffsItemName)
    );
    target.notify(
      target.user.LangString("user.setCuffedTarget.notify", cuffsItemName),
      "error"
    );

    if (this.is_police || this.is_government) {
      this.log(
        "gosJob",
        this.LangString("user.setCuffedTarget.policeLog", cuffsItemName),
        target
      );
    }

    this.playAnimation([["mp_arresting", "a_uncuff", 1]], false, false);

    mp.events.call("playerCuffed", target, target.user.cuffed);
  };

  // setCuffedTarget = (target: PlayerMp, handCuff?: ItemEntity) => {
  // 	if (!this.exists) return;
  // 	if (!mp.players.exists(target)) return;

  // 	if (target.vehicle)
  // 		return this.player.notify(
  // 			this.LangString("user.setCuffedTarget.vehicle"),
  // 			"error",
  // 		);

  // 	if (
  // 		handCuff &&
  // 		handCuff.item_id === CUFFS_ITEM_ID &&
  // 		!this.is_police &&
  // 		!this.is_government &&
  // 		this.fraction !== 1
  // 	) {
  // 		return this.player.notify(
  // 			this.LangString("user.setCuffedTarget.item"),
  // 			"error",
  // 		);
  // 	}

  // 	if (
  // 		!this.is_police &&
  // 		!this.is_government &&
  // 		this.fraction !== 16 &&
  // 		this.fraction != 1 &&
  // 		this.inSaveZone
  // 	)
  // 		return this.player.notify(
  // 			this.LangString("user.setCuffedTarget.savezone"),
  // 			"error",
  // 		);

  // 	if (target.user.cuffed) {
  // 		return this.notify(
  // 			this.LangString("user.setCuffedTarget.cuffed"),
  // 			"error",
  // 		);
  // 	}

  // 	if ((this.is_police || this.is_government) && !handCuff) {
  // 		handCuff = this.getItemInHotkeyByItemID([CUFFS_ITEM_ID]);
  // 	} else if (!handCuff) {
  // 		handCuff = this.getItemInHotkeyByItemID([SCREWS_ITEM_ID]);
  // 	}

  // 	if (!handCuff) {
  // 		this.player.notify(
  // 			this.LangString("user.setCuffedTarget.nohandCuff"),
  // 			"error",
  // 		);
  // 		return;
  // 	}

  // 	handCuff.useCount(1, this.player);
  // 	target.user.cuffed = true;
  // 	target.user.policeCuffed = handCuff.item_id === CUFFS_ITEM_ID;

  // 	const cuffsItemName = target.user.policeCuffed
  // 		? this.LangString("user.setUncuffedTarget.itemname1")
  // 		: this.LangString("user.setUncuffedTarget.itemname2");

  // 	gui.chat.sendMeCommandToPlayer(
  // 		this.player,
  // 		target,
  // 		this.LangString("user.setCuffedTarget.chat", cuffsItemName),
  // 	);
  // 	target.notify(
  // 		target.user.LangString("user.setCuffedTarget.notify", cuffsItemName),
  // 		"error",
  // 	);

  // 	if (this.is_police || this.is_government) {
  // 		this.log(
  // 			"gosJob",
  // 			this.LangString("user.setCuffedTarget.policeLog", cuffsItemName),
  // 			target,
  // 		);
  // 	}

  // 	this.playAnimation([["mp_arresting", "a_uncuff", 1]], false, false);

  // 	mp.events.call("playerCuffed", target, target.user.cuffed);
  // };
  setFollowTarget = (target: PlayerMp) => {
    if (!target.user.cuffed) return;
    if (target.user.follow && target.user.follow !== this.player.id + 1) {
      return this.notify(
        this.LangString("user.setCuffedTarget.setFollowTarget.followed"),
        "error"
      );
    }

    target.user.follow = target.user.follow ? null : this.player.id + 1;
    target.notify(
      target.user.follow
        ? target.user.LangString("user.setCuffedTarget.setFollowTarget.err1")
        : target.user.LangString("user.setCuffedTarget.setFollowTarget.err2"),
      target.user.follow ? "error" : "success"
    );
    this.notify(
      target.user.follow
        ? this.LangString("user.setCuffedTarget.setFollowTarget.err3")
        : this.LangString("user.setCuffedTarget.setFollowTarget.err4"),
      target.user.follow ? "error" : "success"
    );
    this.log(
      "gosJob",
      this.LangString(
        target.user.follow
          ? "user.setCuffedTarget.setFollowTarget.log1"
          : "user.setCuffedTarget.setFollowTarget.log2"
      ),
      target
    );
  };
  get pos() {
    if (!this.exists) return null;
    return this.player.position;
  }

  get inSaveZone() {
    if (!this.exists) return false;
    return isPlayerInActiveSafeZone(this.player);
  }

  private needFollow: number;

  /** Игрок следует за кем то */
  get follow() {
    return this.needFollow;
  }

  set follow(val) {
    if (this.exists && this.needFollow != val)
      this.player.setVariable("follow", val);
    this.needFollow = val;
  }

  /** Имя персонажа */
  get name() {
    return this.entity.rp_name;
  }

  set name(value: string) {
    this.entity.rp_name = value;
    if (this.exists)
      this.player.setVariable("name", this.entity.rp_name),
        CustomEvent.triggerCef(this.player, "user:name", this.entity.rp_name);
    this.save();
  }

  get age() {
    return this.entity.age;
  }

  set age(val) {
    this.entity.age = val;
    this.save();
  }

  /** Еда персонажа */
  get food() {
    return this.entity.food;
  }

  set food(value: number) {
    this.entity.food = value;
    if (this.entity.food > food_max) this.entity.food = food_max;
    if (this.entity.food < 0) this.entity.food = 0;
    if (this.exists)
      CustomEvent.triggerClient(
        this.player,
        "survival:init",
        this.food,
        this.water
      );
  }

  /** Вода персонажа */
  get water() {
    return this.entity.water;
  }

  set water(value: number) {
    this.entity.water = value;
    if (this.entity.water > water_max) this.entity.water = water_max;
    if (this.entity.water < 0) this.entity.water = 0;
    if (this.exists)
      CustomEvent.triggerClient(
        this.player,
        "survival:init",
        this.food,
        this.water
      );
  }

  newFine = (who: PlayerMp, sum: number, reason: string) => {
    if (sum <= 0) return true;
    if (this.money >= sum) {
      this.removeMoney(
        sum,
        true,
        this.LangString(
          "user.newFine.removeMoney",
          who.user.fraction ? who.user.fractionData.name : "",
          who.user.name,
          who.user.id,
          system.numberFormat(sum),
          system.filterInput(reason)
        )
      );
      this.writeRpHistory(
        this.LangString(
          "user.newFine.removeMoney",
          who.user.fraction ? who.user.fractionData.name : "",
          who.user.name,
          who.user.id,
          system.numberFormat(sum),
          system.filterInput(reason)
        )
      );
      return true;
    }
    if (this.bank_have) return false;
    if (this.bank_money < sum) return false;
    this.removeBankMoney(
      sum,
      true,
      this.LangString(
        "user.newFine.removeMoney",
        who.user.fraction ? who.user.fractionData.name : "",
        who.user.name,
        who.user.id,
        system.numberFormat(sum),
        system.filterInput(reason)
      ),
      `${
        who.user.fraction
          ? who.user.fractionData.name
          : this.LangString("user.newFine.removeMoney.who")
      }`
    );
    this.writeRpHistory(
      this.LangString(
        "user.newFine.removeMoney",
        who.user.fraction ? who.user.fractionData.name : "",
        who.user.name,
        who.user.id,
        system.numberFormat(sum),
        system.filterInput(reason)
      )
    );
    return true;
  };

  drawTimer = (text: string, timer: number) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(this.player, "timer:drawserver", text, timer);
  };

  /** Время последнего нырения **/

  lastDiveMissionTime: number = 0;

  private jobItem: string = null;

  /** Текущая работа */
  job: JobId;
  /** Ключ */
  jobkey: string;
  /** Номер задания */
  jobtask: number;

  /** Текущая семья */
  get family() {
    return this.entity.family
      ? Family.getByID(this.entity.family) || null
      : null;
  }

  /** Текущая семья (id) */
  get familyId() {
    return this.entity.family;
  }

  /** Изменить семью */
  set family(val: Family | null) {
    if (!val) {
      this.entity.family = 0;
      CustomEvent.triggerCef(this.player, "user:family", 0, 0);
      CustomEvent.triggerClient(this.player, "family:cargoBattle:stopAll");
    } else {
      this.entity.family = val.id;
      this.checkFamilyQuests();
    }
    this.player.setVariable("family", [val ? val.id : 0, 1]);
    this.entity.familyRank = 1;
    this.entity.familyScores = 0;
    saveEntity(this.entity);
  }

  private checkFamilyQuests = () => {
    if (!this.family) return;
    if (!mp.players.exists(this.player)) return;
    CustomEvent.triggerCef(
      this.player,
      "user:family",
      this.family.id,
      this.entity.familyRank
    );
    CargoBattleFamilyQuest.all.forEach((q) => q.addPlayer(this.player));
  };

  /** Лидер семьи */
  get isFamilyLeader() {
    return !!this.getFamilyRank().isOwner;
  }

  /** Лидер семьи */
  get isFamilySubLeader() {
    return !!this.getFamilyRank().isSoOwner;
  }

  isHaveFamilyRule(rule: number) {
    return this.family.isRankHaveRule(this.entity.familyRank, rule);
  }

  /** Ранг семьи */
  get familyRank() {
    return this.entity.familyRank || 0;
  }

  getFamilyRank() {
    return (
      this.family.getRank(this.entity.familyRank) || {
        id: 0,
        name: "",
        rules: [],
      }
    );
  }

  set familyRank(val: number) {
    this.entity.familyRank = val;
    this.save();
    if (!mp.players.exists(this.player)) return;
    CustomEvent.triggerCef(this.player, "user:family", this.family.id, val);
    this.player.setVariable("family", [this.family.id, val]);
  }

  /** Очки семьи */
  get familyScores() {
    return this.entity.familyScores;
  }
  set familyScores(val: number) {
    this.entity.familyScores = val;
    this.save();
  }

  private activeFamilyQuest: number;
  familyCargoType: number;

  /** Активный семейный квест (значения квестов от 1, выключить это 0) */
  set active_family_quest(val: number) {
    if (isNaN(val) || val < 0 || !FamilyTasks[val - 1]) return;
    this.activeFamilyQuest = val;
  }

  /** Возвращает активный семейный квест или null */
  getActiveFamilyQuest = (type: number = 0) => {
    return this.family.hourQuests.find((q) => q.type == type) || null;
  };

  /** Уровень розыска */
  get wanted_level() {
    return this.entity.wanted_level;
  }

  set wanted_level(val) {
    this.entity.wanted_level = val;
    tablet.gosSuspectsReload();
  }

  /** Причина розыска */
  get wanted_reason() {
    return this.entity.wanted_reason;
  }

  set wanted_reason(val) {
    this.entity.wanted_reason = val;
  }

  clearWanted = () => {
    if (this.wanted_level > 0) {
      this.writeRpHistory(
        this.LangString(
          "user.newFine.clearWanted",
          this.wanted_level,
          this.wanted_reason
        )
      );
    }
    this.entity.wanted_level = 0;
    this.entity.wanted_reason = null;
    tablet.gosSearchDataReload(this.id);
    if (this.exists)
      this.notify(this.LangString("user.newFine.clearWanted.notify"), "error");
  };

  giveWanted = (level: 0 | 1 | 2 | 3 | 4 | 5, reason: string, who?: User) => {
    if (!reason) reason = this.LangString("user.newFine.giveWanted.reason");
    if (reason.length > 512) reason = reason.slice(0, 512);
    this.entity.wanted_level = level;
    this.entity.wanted_reason = reason;
    if (!who)
      this.writeRpHistory(
        this.LangString("user.newFine.giveWanted.reason.history", level, reason)
      );
    else
      this.writeRpHistory(
        this.LangString(
          "user.newFine.giveWanted.reason.history2",
          who.name,
          who.id,
          level,
          reason
        )
      );
    tablet.gosSearchDataReload(this.id);
    if (this.exists)
      this.notify(
        this.LangString("user.newFine.giveWanted.reason.notify"),
        "error"
      );
  };

  /** Сделать запись в РП истории персонажа */
  writeRpHistory = (text: string) => {
    if (!text) return;
    if (text.length > 1000) text = text.slice(0, 1000);
    let record = new RpHistoryEntity();
    record.user = this.entity;
    record.text = text;
    record.time = system.timestamp;
    record.save();
  };

  /** Очистить РП историю персонажа */
  clearRpHistory = () => {
    return RpHistoryEntity.delete({ userId: this.id });
  };

  /** Получить записи РП истории персонажа */
  getRpHistory = (limit = 10) => {
    return User.getRpHistory(this.id, limit);
  };

  getShowingIdString = (target: PlayerMp) => {
    if (!target) return "-1";
    if (!target.user) return "-1";
    return `${target.user.id}`;
  };
  getChatNameString = (target: PlayerMp): string => {
    if (!mp.players.exists(target))
      return "(Civil) (" + (target && target.dbid ? target.dbid : -1) + ")";

    const user = target.user;
    if (!user)
      return "(Civil) (" + (target && target.dbid ? target.dbid : -1) + ")";

    // 🔹 ID din baza de date
    const dbid = target.dbid ? target.dbid : -1;

    // 🔹 Facțiunea
    const fractionId: FACTION_ID = user.fraction || FACTION_ID.UNEMPLOYED;
    const factionData = fractionList.find((f) => f.id === fractionId);

    const factionName = factionData?.name || "Civil";
    let factionColor = "#FFFFFF"; // implicit alb

    // ✅ dacă are culoare setată (gang/mafia), o folosim
    if (factionData && factionData.color) {
      factionColor = factionData.color;
    }

    // 🔹 Ranguri și culori admin
    const adminRanks: Record<number, { name: string; color: string }> = {
      1: { name: "Helper", color: "#7FFF00" },
      2: { name: "Trial Admin", color: "#00FFFF" },
      3: { name: "Admin", color: "#4A90E2" },
      4: { name: "Senior Admin", color: "#FFAA00" },
      5: { name: "Administrator", color: "#FF5500" },
      6: { name: "Manager", color: "#C800FF" },
      7: { name: "Fondator", color: "#FF0000" },
    };

    const adminLevel = user.admin_level || 0;
    const adminData = adminRanks[adminLevel];
    const adminTag = adminData
      ? ` !{${adminData.color}}(${adminData.name})`
      : "";

    // 🔹 Numele jucătorului
    const playerName = target.name;

    // 🔹 Returnare finală
    return `!{${factionColor}}(${factionName}) !{#FFFFFF}${playerName} !{#BEBEBE}(${dbid})${adminTag}`;
  };
  // /** Имя игрока для нас в виде полной строки */
  // getChatNameString = (target: PlayerMp) => {
  // 	if (!mp.players.exists(target))
  // 		return this.LangString(
  // 			"user.getChatNameString",
  // 			target && target.dbid ? target.dbid : -1,
  // 		);
  // 	const adminString =
  // 		target.user && target.user.isAdminNow() ? "[Admin] " : "";
  // 	if (target.dbid === this.id)
  // 		return `${this.name} [${this.LangString("user.getChatNameString.you")}] ${adminString}(${this.id})`;
  // 	const fam = this.getFamiliar(target);
  // 	if (!fam)
  // 		return `${this.LangString("user.getChatNameString.player")} ${adminString}(${target.dbid})`;
  // 	return `${fam.name} ${adminString}(${target.dbid})`;
  // };

  /** Данные знакомого */
  getFamiliar = (target: PlayerMp | number) => {
    if (typeof target !== "number" && !mp.players.exists(target)) return null;
    const id = typeof target === "number" ? target : target.dbid;
    return this.dating.find((q) => q.targetId === id);
  };

  /** Является ли игрок нашим знакомым */
  isFamiliar = (target: PlayerMp | number) => {
    return !!this.getFamiliar(target);
  };

  newFamiliar = (target: PlayerMp, name: string) => {
    const old = this.getFamiliar(target);
    let d = old ? old : new UserDatingEntity();
    d.name = name;
    d.target = target.user.entity;
    d.user = this.entity;
    d.save().then((res) => {
      CustomEvent.triggerClient(this.player, "newDating", [
        res.targetId,
        res.name,
      ]);
    });
  };
  getShowingNameString = (target: PlayerMp | number) => {
    const targetid = typeof target !== "number" ? target.user.dbid : target;
    if (!targetid) return this.LangString("user.getShowingNameString.notarget");
    if (targetid == this.id) return this.name;

    const dating = this.dating.find((d) => d.targetId === targetid);
    if (dating) return dating.name;

    const targetPlayer = target as PlayerMp;
    if (
      targetPlayer &&
      targetPlayer.user &&
      this.fraction === targetPlayer.user.fraction
    ) {
      return targetPlayer.user.name;
    }

    // în loc să arate ID sau „notarget”,
    // returnăm un string gol => nu se afișează nimic
    return "";
  };

  // getShowingNameString = (target: PlayerMp | number) => {
  // 	const targetid = typeof target !== "number" ? target.user.dbid : target;
  // 	if (!targetid) return this.LangString("user.getShowingNameString.notarget");
  // 	if (targetid == this.id) return this.name;
  // 	const dating = this.dating.find((d) => d.targetId === targetid);
  // 	if (dating) return dating.name;
  // 	const targetPlayer = target as PlayerMp;
  // 	if (
  // 		targetPlayer &&
  // 		targetPlayer.user &&
  // 		this.fraction === targetPlayer.user.fraction
  // 	)
  // 		return targetPlayer.user.name;
  // 	return this.LangString("user.getShowingNameString.notarget");
  // };

  setSkinParam = (vals: Partial<CharacterSkinData>) => {
    if (!this.exists) return;
    let skin = { ...this.skin };
    for (let param in vals) {
      let val = vals[param as keyof CharacterSkinData];
      skin[param as keyof CharacterSkinData] = val as any;
    }
    this.skin = skin;
    this.reloadSkin();
  };

  private jobDress: [number, number, number][];
  /** ИД гардероба */
  jobdressId: number;

  get getJobDress() {
    return this.jobDress;
  }

  setJobDress = (data: [number, number, number][]) => {
    if (!this.exists) return;
    if (!this.getJobDress && !data) return;
    this.undress();
    this.jobDress = data;
    if (this.jobDress) {
      this.jobDress.map((item) => {
        this.setDress(item[0], 0, 0);
      });
    }
    this.jobdressId = null;
    this.playAnimation([["missmic4", "michael_tux_fidget"]], true);
    this.reloadSkin();
  };

  reloadSkin = () => {
    if (!this.exists) return;
    let skin = { ...this.skin };
    this.player.model = mp.joaat(
      skin.SEX == 0 ? "mp_m_freemode_01" : "mp_f_freemode_01"
    );
    this.player.setVariable(
      "currentModel",
      skin.SEX == 0 ? "mp_m_freemode_01" : "mp_f_freemode_01"
    );

    if (this.age > 72) this.player.setHeadOverlay(3, [14, 1, 1, 1]);
    else if (this.age > 69) this.player.setHeadOverlay(3, [13, 1, 1, 1]);
    else if (this.age > 66) this.player.setHeadOverlay(3, [12, 1, 1, 1]);
    else if (this.age > 63) this.player.setHeadOverlay(3, [11, 0.9, 1, 1]);
    else if (this.age > 60) this.player.setHeadOverlay(3, [10, 0.9, 1, 1]);
    else if (this.age > 57) this.player.setHeadOverlay(3, [9, 0.9, 1, 1]);
    else if (this.age > 54) this.player.setHeadOverlay(3, [8, 0.8, 1, 1]);
    else if (this.age > 51) this.player.setHeadOverlay(3, [7, 0.7, 1, 1]);
    else if (this.age > 48) this.player.setHeadOverlay(3, [6, 0.6, 1, 1]);
    else if (this.age > 45) this.player.setHeadOverlay(3, [5, 0.5, 1, 1]);
    else if (this.age > 42) this.player.setHeadOverlay(3, [4, 0.4, 1, 1]);
    else if (this.age > 39) this.player.setHeadOverlay(3, [4, 0.4, 1, 1]);
    else if (this.age > 36) this.player.setHeadOverlay(3, [3, 0.3, 1, 1]);
    else if (this.age > 33) this.player.setHeadOverlay(3, [1, 0.2, 1, 1]);
    else if (this.age > 30) this.player.setHeadOverlay(3, [0, 0.1, 1, 1]);

    this.player.setCustomization(
      skin.SEX == 0,
      skin.SHAPE_THRID_ID,
      skin.SHAPE_SECOND_ID,
      0,
      skin.SKIN_THRID_ID,
      skin.SKIN_SECOND_ID,
      0,
      skin.SHAPE_MIX,
      skin.SKIN_MIX,
      0,
      skin.EYE_COLOR,
      skin.HAIR_COLOR,
      skin.HAIR_COLOR2,
      skin.FACE_SPECIFICATIONS || [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ]
    );

    this.player.setClothes(2, skin.HAIR, 0, 0);
    if (skin.LIPS)
      this.player.setHeadOverlay(8, [
        skin.LIPS,
        skin.LIPS_OPACITY,
        skin.LIPS_COLOR,
        0,
      ]);
    this.player.setHeadOverlay(2, [
      skin.EYEBROWS,
      skin.EYEBROWS_OPACITY,
      skin.EYEBROWS_COLOR,
      0,
    ]);
    this.player.setHeadOverlay(9, [
      skin.OVERLAY9,
      skin.OVERLAY9_OPACITY,
      skin.OVERLAY9_COLOR,
      0,
    ]);
    if (skin.SEX == 0)
      this.player.setHeadOverlay(1, [
        skin.OVERLAY,
        skin.OVERLAY_OPACITY,
        skin.OVERLAY_COLOR,
        0,
      ]);
    if (this.feemale)
      this.player.setHeadOverlay(4, [
        skin.OVERLAY4,
        typeof skin.OVERLAY4_OPACITY === "number" ? skin.OVERLAY4_OPACITY : 1.0,
        skin.OVERLAY4_COLOR,
        0,
      ]);
    if (this.feemale && skin.BLUSH)
      this.player.setHeadOverlay(5, [
        skin.BLUSH,
        typeof skin.BLUSH_OPACITY === "number" ? skin.BLUSH_OPACITY : 1.0,
        skin.BLUSH_COLOR,
        0,
      ]);

    this.reloadTattoo();
    if (this.jobDress) {
      this.jobDress.map((item) => {
        this.setDress(item[0], item[1], item[2]);
      });
    } else {
      this.reloadDress();
    }

    this.inventoryAttachSync();

    this.setSkinNails();
  };

  setSkinNails = () => {
    if (this.skin.SEX === 0) {
      return;
    }

    const nailsId = this.skin.NAILS || -1;
    const nailsData = nailsConfig.find((data) => data.Id === nailsId);
    this.player.setClothes(
      NAILS_COMPONENT_ID,
      nailsData.Drawable,
      nailsData.Texture,
      2
    );
  };

  anticheatProtect = (param: keyof AntiCheatUserData, time = 5000) => {
    if (!this.anticheatData) this.anticheatData = {};
    if (!this.anticheatData[param]) this.anticheatData[param] = 0;
    this.anticheatData[param]++;
    CustomEvent.triggerClient(this.player, "anticheatProtect", param, time);
    setTimeout(() => {
      if (!this) return;
      this.anticheatData[param]--;
    }, time);
  };

  anticheatProtects = (params: (keyof AntiCheatUserData)[], time = 5000) => {
    if (!this.anticheatData) this.anticheatData = {};
    params.map((param) => {
      if (!this.anticheatData[param]) this.anticheatData[param] = 0;
      this.anticheatData[param]++;
    });
    CustomEvent.triggerClient(this.player, "anticheatProtects", params, time);
    setTimeout(() => {
      if (!this) return;
      params.map((param) => {
        this.anticheatData[param]--;
      });
    }, time);
  };

  revive = (cost = 0) => {
    if (!this.exists) return;
    this.health = 100;
    if (cost > 0)
      this.removeMoney(cost, true, this.LangString("user.revivecost"));
  };

  get position() {
    if (this.tempData.oldpos) return this.tempData.oldpos;
    return this.player
      ? {
          x: this.player.position.x,
          y: this.player.position.y,
          z: this.player.position.z,
          h: this.player.heading,
          d: this.player.dimension,
        }
      : null;
  }

  /** Существует ли сетевой игрок */
  get exists() {
    return mp.players.exists(this.player);
  }

  showLoadDisplay = (time?: number) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(this.player, "showLoadDisplay", time);
  };

  hideLoadDisplay = (time?: number) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(this.player, "hideLoadDisplay", time);
  };

  addScreenEffect = (name: string, seconds: number) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(this.player, "addScreenEffect", name, seconds);
  };

  disableAllControls = (status: boolean) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(this.player, "disableAllControls", status);
  };

  teleportVisible = (h?: number, pos?: Vector3Mp, d?: number) => {
    if (!this.exists) return;
    this.anticheatProtect("teleport", 5000);
    this.player.call("teleportVisible", [h, [pos.x, pos.y, pos.z]]);
    if (pos) {
      const { x, y, z } = pos;
      this.teleportsHandlesStart.map((q) => q(x, y, z, h, d, false));
      CustomEvent.trigger(
        "player:teleport:start",
        this.player,
        x,
        y,
        z,
        h,
        d,
        false
      );
      setTimeout(() => {
        if (!this.exists) return;
        this.teleportsHandlesEnd.map((q) => q(x, y, z, h, d, false));
        CustomEvent.trigger(
          "player:teleport:end",
          this.player,
          x,
          y,
          z,
          h,
          d,
          false
        );
      }, system.TELEPORT_TIME + 100);
    }
  };

  private teleportsHandlesStart: ((
    x: number,
    y: number,
    z: number,
    h?: number,
    d?: number,
    withRespawn?: boolean
  ) => void)[] = [];
  private teleportsHandlesEnd: ((
    x: number,
    y: number,
    z: number,
    h?: number,
    d?: number,
    withRespawn?: boolean
  ) => void)[] = [];

  teleportHandleStart = (
    ev: (
      x: number,
      y: number,
      z: number,
      h?: number,
      d?: number,
      withRespawn?: boolean
    ) => void
  ) => {
    this.teleportsHandlesStart.push(ev);
  };
  teleportHandleEnd = (
    ev: (
      x: number,
      y: number,
      z: number,
      h?: number,
      d?: number,
      withRespawn?: boolean
    ) => void
  ) => {
    this.teleportsHandlesEnd.push(ev);
  };

  teleport = (
    x: number,
    y: number,
    z: number,
    h?: number,
    d?: number,
    withRespawn = false
  ) => {
    if (!this.exists) return;
    if (withRespawn) this.health = 100;
    system.debug.debug(
      `${this.name} #${this.id} teleport x: ${x.toFixed(2)} y: ${y.toFixed(
        2
      )} z: ${z.toFixed(2)} h: ${h ? h.toFixed(2) : this.player.heading} d: ${
        d || this.player.dimension
      }`
    );
    this.player.call("teleport", [x, y, z, h]);
    this.teleportsHandlesStart.map((q) => q(x, y, z, h, d, withRespawn));
    CustomEvent.trigger(
      "player:teleport:start",
      this.player,
      x,
      y,
      z,
      h,
      d,
      withRespawn
    );
    if (typeof d === "number") {
      if (d) {
        this.tempData.oldpos = this.position;
      } else this.tempData.oldpos = null;
      setTimeout(() => {
        if (!this.exists) return;
        this.player.dimension = d;
      }, system.TELEPORT_TIME);
    } else this.tempData.oldpos = null;
    if (withRespawn) {
      setTimeout(() => {
        if (!this.exists) return;
        this.health = 100;
        setTimeout(() => {
          this.health = 100;
        }, 1000);
      }, system.TELEPORT_TIME);
    }
    setTimeout(() => {
      if (!this.exists) return;
      this.player.position = new mp.Vector3(x, y, z);
      this.teleportsHandlesEnd.map((q) => q(x, y, z, h, d, withRespawn));
      CustomEvent.trigger(
        "player:teleport:end",
        this.player,
        x,
        y,
        z,
        h,
        d,
        withRespawn
      );
    }, system.TELEPORT_TIME + 100);
  };

  teleportVeh = (x: number, y: number, z: number, h?: number, d?: number) => {
    if (!this.exists) return;
    const veh = this.player.vehicle;
    if (!veh) return this.teleport(x, y, z, h, d);
    Vehicle.teleport(veh, new mp.Vector3(x, y, z), h, d);
  };

  get admin_level() {
    if (!this.exists) return;
    if (this.player.getVariable("admin_level") != this.entity.admin_level)
      this.player.setVariable("admin_level", this.entity.admin_level);
    return this.entity.admin_level;
  }

  set admin_level(value: number) {
    if (!this.exists) return;
    if (this.player.getVariable("admin_level") != value)
      this.player.setVariable("admin_level", value);
    if (this.entity.admin_level == value) return;
    if (this.player.getVariable("enabledAdmin") && !value)
      this.player.setVariable("enabledAdmin", false);
    this.entity.admin_level = value;
  }

  isAdminNow = (level = 1) => {
    if (!this.exists) return;
    return this.admin_level >= level && this.player.getVariable("enabledAdmin");
  };

  get helper() {
    return !!this.entity.helper_level;
  }

  get helper_level() {
    return this.entity.helper_level;
  }

  set helper_level(val) {
    this.entity.helper_level = val;
  }

  hasPermission = (name: string) => {
    let perm = permissions[name];
    if (this.isAdminNow(7)) return true;
    if (!perm) return false;
    if (perm.admin_level && !this.isAdminNow(perm.admin_level)) return false;
    if (perm.fractions) {
      if (!perm.fractions.includes(this.fraction)) return false;
    }
    if (perm.rank && perm.rank > this.rank) return false;
    if (this.fraction && perm.rankLast) {
      const fraction = this.fractionData;
      if (!fraction) return false;
      if (fraction.ranks.length + 1 - perm.rankLast > this.rank) return false;
    }
    if (perm.gos && !this.is_gos) return false;

    return true;
  };

  drugUse = false;

  /** Сколько времени осталось в больнице */
  getHospitalTimer = (): Promise<number> => {
    return CustomEvent.callClient(this.player, "hospital:healTimer");
  };

  last_save: number = 0;

  /** Сохранить игрока */
  save = () => {
    this.savePrepare();
    if (this.save_wait) return;
    this.save_wait = true;
    setTimeout(() => {
      saveEntity(this.entity)
        .then(() => {})
        .catch((err) => {
          system.debug.error(err);
        });
      if (!this.exists) return;
      this.save_wait = false;
    }, 3000);
  };
  /** Подготовить сохранение игрока */
  savePrepare = () => {
    if (!this.player) return this.entity;
    if (!this.id) return this.entity;
    if (!this.load) return this.entity;
    this.entity.armour = this.player.armour;
    this.entity.date_auth = system.timestamp;
    User.lastSave.set(this.id, system.timestamp);
    const pos = this.position;
    if (pos && pos.d == 0 && (pos.x !== 0 || pos.y !== 0 || pos.z !== 0))
      this.entity.position = JSON.stringify(pos);
    this.entity.health = this.health;
    this.entity.online = system.timestamp;
    let warns = [...this.entity.warns];
    warns.map((warn, warnid) => {
      if (warn.time < system.timestamp) warns.splice(warnid, 1);
    });
    this.entity.warns = warns;
    return this.entity;
  };

  /** Зачисление средств со счёта */
  addChips = (money: number, notify = false, reason: string) => {
    if (typeof money !== "number") return;
    if (money <= 0) return;
    this.chips += money;
    if (notify) this.notify(this.LangString("user.addChips", money), "success");
    if (reason)
      this.log("addChips", `${system.numberFormat(money)} - ${reason}`);
  };

  /** Снятие средств со счёта */
  removeChips = (money: number, notify = false, reason: string) => {
    if (typeof money !== "number") return;
    if (money <= 0) return;
    this.chips -= money;
    if (notify)
      this.notify(this.LangString("user.removeChips", money), "success");
    if (reason)
      this.log("removeChips", `${system.numberFormat(money)} - ${reason}`);
  };

  /** Зачисление средств со счёта */
  addCryptoMoney = (money: number, notify = false, reason: string) => {
    //if (typeof money !== "number") return;
    if (money <= 0) return;
    this.crypto += money;
    if (notify)
      this.notify(this.LangString("user.addCryptoMoney", money), "success");
    if (reason) {
      this.log("addCrypto", `${system.numberFormat(money)} ${reason}`);
    }
  };

  /** Снятие средств со счёта */
  removeCryptoMoney = (money: number, notify = false, reason: string) => {
    if (money <= 0) return;
    this.crypto -= money;
    MiningStats.cryptoDailyWithdrawal += money;
    if (notify)
      this.notify(this.LangString("user.removeCryptoMoney", money), "success");
    if (reason) {
      this.log("removeCrypto", `${system.numberFormat(money)} ${reason}`);
    }
  };

  /** Зачисление средств со счёта */
  addMoney = (money: number, notify = false, reason: string) => {
    if (money <= 0) return;
    this.money += money;
    if (notify) this.notify(this.LangString("user.addMoney", money), "success");
    if (reason) {
      this.log("addMoney", `$${system.numberFormat(money)} ${reason}`);
    }
  };

  /** Снятие средств со счёта */
  removeMoney = (money: number, notify = false, reason: string) => {
    if (typeof money !== "number") return false;
    if (money <= 0) return false;
    this.money -= money;
    this.stats.spendMoney(money);
    if (notify)
      this.notify(this.LangString("user.removeMoney", money), "success");
    if (reason) {
      this.log("removeMoney", `$${system.numberFormat(money)} ${reason}`);
    }
    return true;
  };

  /** Зачисление средств со счёта банка */
  addBankMoney = (
    money: number,
    notify = false,
    reason: string,
    iniciator: string,
    addCashIfNotBank = false
  ) => {
    if (typeof money !== "number") return;
    if (money <= 0) return;
    if (!this.bank_have) {
      if (addCashIfNotBank) return this.addMoney(money, true, reason);
      return;
    }
    this.bank_money += money;
    // if(reason)
    if (notify)
      this.sendSmsBankOperation(
        this.LangString("user.addCashIfNotBank", system.numberFormat(money))
      );
    setTimeout(() => {
      if (reason) this.bankLog("add", money, reason, iniciator);
    }, 1000);
  };

  /** Попытка снятия средств со счёта банка */
  tryRemoveBankMoney = (
    money: number,
    notify = false,
    reason: string,
    iniciator: string
  ) => {
    if (typeof money !== "number") {
      system.debug.error(`tryRemoveBankMoney get money arg as ${typeof money}`);
      return false;
    }
    if (money <= 0) {
      if (notify)
        this.sendSmsBankOperation(
          this.LangString("user.tryRemoveBankMoney.money")
        );
      return false;
    }
    if (!this.bank_have) {
      if (notify)
        this.sendSmsBankOperation(
          this.LangString("user.tryRemoveBankMoney.bank_have")
        );
      return false;
    }
    if (this.bank_money < money) {
      this.bankLog("reject", money, reason, iniciator);
      if (notify)
        this.sendSmsBankOperation(
          this.LangString(
            "user.tryRemoveBankMoney.bank_money",
            system.numberFormat(money)
          )
        );
      return false;
    }
    this.removeBankMoney(money, notify, reason, iniciator);
    return true;
  };

  /** Снятие средств со счёта банка */
  removeBankMoney = (
    money: number,
    notify = false,
    reason: string,
    iniciator: string
  ) => {
    if (typeof money !== "number") return;
    if (money <= 0) return;
    this.bank_money -= money;
    this.stats.spendMoney(money);
    if (notify)
      this.sendSmsBankOperation(
        this.LangString(
          "user.removeBankMoney.notify",
          system.numberFormat(money)
        )
      );
    setTimeout(() => {
      if (reason) this.bankLog("remove", money, reason, iniciator);
    }, 1000);
  };

  get myBank() {
    if (!this.bank_number) return null;
    let data = this.bank_number.split("A");
    if (data.length != 4) return null;
    return business.get(parseInt(data[1]));
  }

  get myBankType() {
    if (!this.bank_number) return null;
    let data = this.bank_number.split("A");
    if (data.length != 4) return null;
    return parseInt(data[0]) - 1;
  }

  get parkingMax() {
    let max = PARKING_CARS_PLAYER_MAX;
    const house = this.houseEntity;
    if (house && !house.car_interrior) max++;
    return max;
  }

  static parkingMax(userEntity: UserEntity) {
    let max = PARKING_CARS_PLAYER_MAX;
    const house = [...houses.data]
      .map((q) => q[1])
      .find((q) => q.userId === userEntity.id);
    if (house && !house.car_interrior) max++;
    return max;
  }

  getJobExp = (job?: string) => {
    if (!job) job = this.job;
    if (!job) return 0;
    const res = this.jobStats[job];
    return res || 0;
  };

  addJobExp = (job?: JobId, exp = 1) => {
    const prevLvl = getLevelByExp(this.getJobExp(job));
    if (typeof exp !== "number") exp = 1;
    if (!job) job = this.job;
    if (!job) return 0;
    const cfgVip = this.vipData;
    if (cfgVip && typeof cfgVip.job_skill_multipler === "number") {
      exp += (exp / 100) * cfgVip.job_skill_multipler;
    }
    let stats = { ...this.jobStats };
    let res = (stats[job] || 0) + exp;
    if (res < 0) res = 0;
    if (res > 1000 && getJobName(job) != null) res = 1000;
    stats[job] = res;
    this.jobStats = stats;
    const newLvl = getLevelByExp(this.getJobExp(job));
    if (prevLvl < newLvl && getJobName(job) != null) {
      this.notify(
        this.LangString("user.addJobExp.lvlerr", newLvl, getJobName(job)),
        "success"
      );
      let jobData = getJobData(job);
      if (newLvl == 4 && jobData.maxLevelReward) {
        this.notify(
          this.LangString(
            "user.addJobExp.lvldone",
            system.numberFormat(jobData.maxLevelReward)
          ),
          "success"
        );
        this.addMoney(
          jobData.maxLevelReward,
          true,
          this.LangString("user.addJobExp.lvldone.reason", jobData.name)
        );
      }
    }
  };

  get jobStats() {
    return this.entity.jobStats;
  }

  set jobStats(value) {
    this.entity.jobStats = value;
  }

  addFishStat(fish: IFish) {
    const currentStats = this.entity.fishStats;

    let totalCatching = currentStats[fish.itemId] || 0;
    totalCatching++;
    currentStats[fish.itemId] = totalCatching;

    this.entity.fishStats = currentStats;
  }

  sendSmsBankOperation = (
    text: string,
    title = this.LangString("user.sendSmsBankOperation.title"),
    time = 8000
  ) => {
    if (!this.exists) return;
    if (typeof this.myBankType !== "number") return;
    if (this.havePhone) {
      let bank = "";
      switch (this.myBankType) {
        case 0:
          bank = "Pacific Bank";
          break;
        case 1:
          bank = "Maze Bank";
          break;
        case 2:
          bank = "Fleeca Bank";
          break;
        case 3:
          bank = "Blaine Bank";
          break;
      }
      this.notifyPhone(bank, title, text);

      return;
    }
    switch (this.myBankType) {
      case 0:
        this.notifyWithPicture(
          title,
          "Pacific Bank",
          text,
          "WEB_SIXFIGURETEMPS",
          time
        );
        break;
      case 1:
        this.notifyWithPicture(
          title,
          "Maze Bank",
          text,
          "CHAR_BANK_MAZE",
          time
        );
        break;
      case 2:
        this.notifyWithPicture(
          title,
          "Fleeca Bank",
          text,
          "CHAR_BANK_FLEECA",
          time
        );
        break;
      case 3:
        this.notifyWithPicture(
          title,
          "Blaine Bank",
          text,
          "DIA_CUSTOMER",
          time
        );
        break;
    }
  };

  exit = () => {
    this.log("PlayerLeave", "Leaved from the server");
    this.removeCurrentWeapon();
    this.clearDamageResist();
    this.clearRegeneration();
    // this.save(true);
    if (this.cuffed && this.policeCuffed) {
      prison.systemJail(
        this.entity,
        CUFF_LEAVE_JAIL_MINUTES,
        this.LangString("user.exit.jail")
      );

      mp.players
        .toArray()
        .filter(
          (q) =>
            q.user &&
            q.user.id !== this.id &&
            q.dimension === this.player.dimension &&
            system.distanceToPos(this.player.position, q.position) < 50
        )
        .map((target) => {
          target.outputChatBox(
            target.user.LangString(
              "user.exit.jail.chat",
              gui.chat.getTime(),
              target.user.getChatNameString(this.player)
            )
          );
        });
    }
    this.entity.is_onlines = false;

    this.save();

    User.remove(this.id);
    if (this.fraction) tablet.reloadFractionData(this.fraction);
  };

  setGui = (
    guiName: guiNames,
    cefEventName?: string,
    ...cefEventArgs: any[]
  ) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(
      this.player,
      "server:setGui",
      guiName,
      cefEventName,
      ...cefEventArgs
    );
  };

  get barbershopData(): BarberData {
    const playerSkin = this.skin;

    return {
      sex: playerSkin.SEX,
      hair: playerSkin.HAIR,
      hairColor: playerSkin.HAIR_COLOR,
      hairColor2: playerSkin.HAIR_COLOR2,
      eyecolor: playerSkin.EYE_COLOR,
      eyebrows: playerSkin.EYEBROWS,
      eyebrowsColor: playerSkin.EYEBROWS_COLOR,
      eyebrowOpacity: playerSkin.EYEBROWS_OPACITY,
      beard: playerSkin.OVERLAY + 1,
      beardColor: playerSkin.OVERLAY_COLOR,
      beardOpacity: playerSkin.OVERLAY_OPACITY,

      lips: playerSkin.LIPS,
      lipsOpacity: playerSkin.LIPS_OPACITY,
      lipsColor: playerSkin.LIPS_COLOR,

      makeup: playerSkin.OVERLAY4,
      makeupOpacity: playerSkin.OVERLAY4_OPACITY,
      makeupColor: playerSkin.OVERLAY4_COLOR,

      blush: playerSkin.BLUSH || 0,
      blushOpacity: playerSkin.BLUSH_OPACITY || 0.0,
      blushColor: playerSkin.BLUSH_COLOR || 0,

      nails: playerSkin.NAILS || -1,
    };
  }

  set barbershopData(val) {
    let data = { ...this.skin };
    data.HAIR = val.hair;
    data.HAIR_COLOR = val.hairColor;
    data.HAIR_COLOR2 = val.hairColor2;
    data.EYE_COLOR = val.eyecolor;
    data.EYEBROWS = val.eyebrows;
    data.EYEBROWS_COLOR = val.eyebrowsColor;
    data.EYEBROWS_OPACITY = val.eyebrowOpacity;
    if (typeof val.beard === "number") data.OVERLAY = val.beard - 1;
    data.OVERLAY_COLOR = val.beardColor;
    data.OVERLAY_OPACITY = val.beardOpacity;

    data.LIPS = val.lips;
    data.LIPS_COLOR = val.lipsColor;
    data.LIPS_OPACITY = val.lipsOpacity;

    data.OVERLAY4 = val.makeup;
    data.OVERLAY4_COLOR = val.makeupColor;
    data.OVERLAY4_OPACITY = val.makeupOpacity;

    data.NAILS = val.nails;

    this.skin = data;
    this.reloadSkin();
  }

  startCustomization = () => {
    if (!this.exists) return;
    this.anticheatProtect("teleport", 10000);
    this.tempData.oldpos = this.position;
    this.player.dimension = system.personalDimension;
    this.player.call("client:user:personage:start");
    if (this.skin) this.skin = null;
    this.undress();
  };

  notifyWithPicture = (
    title: string,
    sender: string,
    message: string,
    notifPic: string,
    time: number = 8000
  ) => {
    if (!this.exists) return;
    this.player.notifyWithPicture(title, sender, message, notifPic, time);
  };

  /** Статус работы в GR6 */
  private _gr6job: boolean = false;
  /** Статус лидера отряда GR6 */
  gr6jobLeader: boolean = false;
  /** Идентификатор бригады GR6 */
  gr6jobId: number;
  /** Арендованый транспорт GR6 */
  gr6jobCar: VehicleMp;
  private gr6MoneyData: number = 0;

  public fireSquad?: number;

  set gr6job(val: boolean) {
    this._gr6job = val;
    SendUpdate(this.player, "job");
  }

  get gr6job() {
    return this._gr6job;
  }

  /** Средства GR6 */
  get gr6Money() {
    return this.gr6MoneyData;
  }

  set gr6Money(val) {
    this.gr6MoneyData = val;
    this.sync_bag();
  }

  /** Арендованый транспорт службы доставки */
  deliverJobCar: VehicleMp;
  /** Погружен ли заказ в транспорт */
  deliverJobLoaded = false;

  get quests() {
    return this.questClass.quests;
  }
  set quests(val) {
    this.questClass.quests = val;
  }

  get haveQuest() {
    return this.questClass.haveQuest;
  }
  get giveQuest() {
    return this.questClass.giveQuest;
  }
  get getQuestTaskComplete() {
    return this.questClass.getQuestTaskComplete;
  }
  get getQuestReadyToComplete() {
    return this.questClass.getQuestReadyToComplete;
  }
  get setQuestTaskComplete() {
    return this.questClass.setQuestTaskComplete;
  }
  get addQuestTaskVal() {
    return this.questClass.addQuestTaskVal;
  }
  get sendClientQuestsData() {
    return this.questClass.sendClientQuestsData;
  }
  get questTick() {
    return this.questClass.questTick;
  }
  get setQuestComplete() {
    return this.questClass.setQuestComplete;
  }

  playMinigame = async (game: MINIGAME_TYPE): Promise<boolean> => {
    if (!this.player) return false;
    return CustomEvent.callClient(this.player, "minigame:play", game);
  };
  /** Prizonier, mort, in arest, in eveniment sau in stare care limiteaza miscarea */
  get attachedToPlace() {
    if (!this.exists) return true;
    if (this.player.dimension >= 10000000) return true;
    if (this.jail_time) return true;
    if (this.jail_time_admin) return true;
    if (this.cuffed) return true;
    if (this.dead) return true;
    if (DeathMathLobby.getByPlayer(this.player)) return true;
    if (
      raceRegisteredPlayers.find(
        (q) => mp.players.exists(q) && q.id === this.player.id
      )
    )
      return true;
    if (duels.getLobbyByUser(this.id) && !duels.getLobbyByUser(this.id).ended)
      return true;
    if (this.player.getVariable("inVehicleTruck")) return true;

    return false;
  }

  get canUseInventory() {
    if (this.isAdminNow(6)) return true;
    const dm = DeathMath.getByPlayer(this.player);
    if (dm && !dm.weapon) return true;
    if (this.attachedToPlace) return false;
    return true;
  }

  // /** Привязан ли игрок к тюрьме, больнице, или какому то мероприятию, либо же в наручниках либо мёртв */
  // get attachedToPlace() {
  // 	if (!this.exists) return true;
  // 	if (this.player.dimension >= 10000000) return true;
  // 	if (this.jail_time) return true;
  // 	if (this.jail_time_admin) return true;
  // 	if (this.cuffed) return true;
  // 	if (this.dead) return true;
  // 	if (DeathMathLobby.getByPlayer(this.player)) return true;
  // 	if (
  // 		raceRegisteredPlayers.find(
  // 			(q) => mp.players.exists(q) && q.id === this.player.id,
  // 		)
  // 	)
  // 		return true;
  // 	if (duels.getLobbyByUser(this.id) && !duels.getLobbyByUser(this.id).ended)
  // 		return true;
  // 	if (ConstructionSystem.getByPlayer(this.player)) return true;
  // 	if (this.player.getVariable("inVehicleTruck")) return true;
  // 	return false;
  // }

  // get canUseInventory() {
  // 	if (this.isAdminNow(6)) return true;
  // 	const dm = DeathMath.getByPlayer(this.player);
  // 	if (dm && !dm.weapon) return true;
  // 	if (ConstructionSystem.getByPlayer(this.player)) return true;
  // 	if (this.attachedToPlace) return false;
  // 	return true;
  // }

  adminRestore = () => {
    if (!this.exists) return;
    this.health = 100;
    this.food = food_max;
    this.water = water_max;
  };

  get dead() {
    if (!this.exists) return false;
    return this.hp <= 0;
  }

  getNearestPlayers = (r = 5) => {
    return User.getNearestPlayers(this.player, r);
  };

  getNearestPlayer = (r = 5) => {
    return User.getNearestPlayer(this.player, r);
  };

  selectNearestPlayer = (r = 3): Promise<PlayerMp> => {
    return new Promise((resolve, reject) => {
      if (!this.exists) return resolve(null);
      const m = menu.new(
        this.player,
        "",
        this.LangString("user.selectNearestPlayer.menu.subtitle")
      );
      User.getNearestPlayers(this.player, r).map((pl) => {
        if (!pl.user) return;
        if (!pl.alpha) return;
        m.newItem({
          name: `${this.getShowingNameString(pl)} (${pl.dbid})`,
          onpress: () => {
            m.close();
            return resolve(pl);
          },
        });
      });
      m.onclose = () => {
        resolve(null);
      };
      m.open();
    });
  };

  getFreeVehicleSlot = (pos?: Vector3Mp, radius = 60): interriorPointData => {
    let slot: interriorPointData;
    // Поиск в доме
    if (this.house) slot = houses.getFreeVehicleSlot(this.house);
    if (slot) return slot;

    // Передаём результат в любом случае
    return slot;
  };

  get myVehicles() {
    return Vehicle.getPlayerVehicles(this.id);
  }

  get countCars() {
    return this.myVehicles.length;
  }

  giveMoneyToPlayer = (target: PlayerMp, sum: number) => {
    if (!mp.players.exists(target)) return;
    if (!target.user) return;
    if (sum > GIVE_MONEY_PER_TASK)
      return this.notify(
        this.LangString(
          "user.giveMoneyToPlayer.limitTask",
          system.numberFormat(GIVE_MONEY_PER_TASK)
        ),
        "error"
      );
    if (sum > this.money)
      return this.notify(
        this.LangString(
          "user.giveMoneyToPlayer.money",
          system.numberFormat(sum)
        ),
        "error"
      );
    if (!User.dayTransferMoney.has(this.id))
      User.dayTransferMoney.set(this.id, 0);
    let today = User.dayTransferMoney.get(this.id) + sum;

    if (today > GIVE_MONEY_PER_DAY) {
      return this.notify(
        this.LangString(
          "user.giveMoneyToPlayer.money",
          system.numberFormat(today)
        ),
        "error"
      );
    }
    this.removeMoney(
      sum,
      false,
      this.LangString("user.giveMoneyToPlayer.remove", target.dbid)
    );
    target.user.addMoney(
      sum,
      false,
      this.LangString("user.giveMoneyToPlayer.remove2", this.id)
    );

    this.notify(
      this.LangString(
        "user.giveMoneyToPlayer.notify1",
        system.numberFormat(sum)
      ),
      "success"
    );
    target.notify(
      target.user.LangString(
        "user.giveMoneyToPlayer.notify2",
        system.numberFormat(sum)
      ),
      "success"
    );

    this.playSyncAnimation(
      target,
      ["mp_common", "givetake2_a"],
      ["mp_common", "givetake1_a"]
    );
  };

  animation: UserAnimation;
  get playSyncAnimation() {
    return this.animation.playSyncAnimation;
  }
  get goToCoord() {
    return this.animation.goToCoord;
  }
  get turnToFace() {
    return this.animation.turnToFace;
  }
  get playAnimationWithResult() {
    return this.animation.playAnimationWithResult;
  }
  get waitTimer() {
    return this.animation.waitTimer;
  }
  get playAnimation() {
    return this.animation.playAnimation;
  }
  get playScenario() {
    return this.animation.playScenario;
  }

  createRouteBlip(name: string, position: Vector3Mp, color: number) {
    CustomEvent.triggerClient(
      this.player,
      "blips:createRouteBlip",
      name,
      position,
      color
    );
  }

  destroyRouteBlip(name: string) {
    CustomEvent.triggerClient(this.player, "blips:destroyRouteBlip", name);
  }

  setWaypoint = (
    x: number,
    y: number,
    z?: number,
    sendInChat?: string,
    alert = true
  ) => {
    if (this.exists) this.player.call("gps:set", [x, y, z, sendInChat, alert]);
  };

  setWaypointBlips = (
    list: {
      x: number;
      y: number;
      name: string;
      shortRange: boolean;
      distDestroy: number;
      type: number;
      color: number;
    }[]
  ) => {
    CustomEvent.triggerClient(this.player, "gps:blips", list);
  };

  notifyPhone = (
    program: string,
    title: string,
    text: string,
    type: "default" | "success" | "error" = "default",
    timer = 5000,
    time = this.LangString("user.notifyPhone.timedefault")
  ) => {
    if (!this.exists) return;
    if (this.havePhone)
      CustomEvent.triggerCef(
        this.player,
        "phone:showalert",
        program,
        title,
        text,
        type,
        timer,
        time
      );
    else this.notifyWithPicture(title, program, text, "WEAZEL", timer);
    //this.notifyWithPicture(title, program, text, 'WEAZEL', timer)
    //this.notify(text, type as any, null, timer);
  };

  haveItem = (item: number) => {
    return this.allMyItems.find((q) => q.item_id === item);
  };

  getArrayItem = (item: number) => {
    return this.inventory.filter((q) => q.item_id === item);
  };

  getItemsByIds = (itemIds: number[]) => {
    return this.inventory.filter((item) => itemIds.includes(item.item_id));
  };

  get havePhone() {
    return !!this.haveItem(850);
  }

  get haveRadio() {
    return !!this.haveItem(852);
  }

  /** Есть ли удочка */
  get haveFishRod() {
    return !!this.rodInHandId;
  }

  get c4item() {
    return this.haveItem(854);
  }

  showHelp = (text: string) => {
    if (!this.exists) return;
    CustomEvent.triggerClient(this.player, "cef:showHelp", text);
  };

  get getDaylyOnline() {
    return UserStats.getDaylyOnline(this.id);
  }

  questClass: UserQuest;
  licenseClass: UserLicense;
  weaponClass: UserWeapon;
  readonly advancedQuests: UserQuestManager;
  readonly battlePass: UserBattlePassManager;

  constructor(
    player: PlayerMp,
    entity: UserEntity,
    account: AccountEntity,
    quest?: number
  ) {
    super();
    this.ent_spam_protect = false;
    this.tempData = {};
    this.entity = entity;
    this.account = account;
    this.player = player;
    this.notify = this.player.notify;
    player.user = this;
    player.setVariable("id", entity.id);
    player.dbid = entity.id;
    player.setVariable("name", entity.rp_name);
    player.setVariable("media", entity.account.isMedia);
    CustomEvent.triggerCef(this.player, "user:name", this.entity.rp_name);
    this.admin_level = entity.admin_level;
    User.list.set(entity.id, this);

    this.stats = new UserStats(this);
    this.achiev = new UserAchiev(this);
    this.animation = new UserAnimation(this);
    this.questClass = new UserQuest(this);
    this.licenseClass = new UserLicense(this);
    this.weaponClass = new UserWeapon(this);
    this.advancedQuests = new UserQuestManager(this);
    this.battlePass = new UserBattlePassManager(this);

    new DailyRewardEntity(this);

    if (typeof quest === "number") {
      const q = QUEST_SPAWN_ITEM[quest];
      if (q) this.giveQuest(q.questID);
      this.entity.quest_line = quest;
    }
    this.lastEnterPosition = <
      { x: number; y: number; z: number; h: number; d: number }
    >JSON.parse(this.entity.position);

    this.afterLogin();
    tablet.reloadFractionData(player);
    system.debug.info(
      `ID-Auswahl [#${this.id}] ${this.name} auf dem Konto [${this.account.id}] ${this.account.login}`
    );
  }

  dating: UserDatingEntity[] = [];

  afterLogin = (teleport = true) => {
    if (!this.exists) return;
    if (this.bank_number && this.bank_number.includes("_"))
      this.bank_number = this.bank_number.replace(/_/g, "A");
    syncMutePlayer(this.id);
    this.player.setVariable("name", this.entity.rp_name);
    CustomEvent.triggerCef(this.player, "user:name", this.entity.rp_name);
    const rentCar = Vehicle.toArray().find(
      (car) => car.rentCarOwner === this.id
    );
    if (rentCar) this.player.rentCar = rentCar;
    const myStats = this.jobStats;
    jobsList.map((item) => {
      if (!item || !item.id) return;
      if (typeof myStats[item.id] !== "number") {
        myStats[item.id] = 0;
      }
    });

    if (this.vip_end < system.timestamp && this.vip !== null) {
      this.entity.vip = null;
      this.entity.save();
    }

    this.player.setVariables({
      fraction: this.fraction,
      rank: this.rank,
      tag: this.tag,
      family: [this.family ? this.family.id : 0, this.familyRank],
      level: this.level,
      adminName: this.entity.admin_name,
      vip: this.vip_end < system.timestamp ? null : this.vip,
    });
    illData.map((ill) => {
      if (!this.getIll(ill.id)) this.setIll(ill.id, 0);
    });
    this.player.call("setLogin", [
      system.playerSignature(this.id),
      !mp.config.announce,
      this.player.ip !== "127.0.0.1"
        ? mp.config.bind
          ? mp.config.bind
          : getIp()
        : "127.0.0.1",
    ]);
    this.health = this.entity.health;
    this.armour = this.entity.armour;
    CustomEvent.triggerClient(
      this.player,
      "survival:init",
      this.food,
      this.water
    );
    this.money = this.entity.money;
    this.chips = this.entity.chips;
    this.bank_money = this.entity.bank_money;
    this.bank_number = this.entity.bank_number;
    UserDatingEntity.find({ user: this.entity }).then((list) => {
      if (!mp.players.exists(this.player)) return;
      this.dating = list;
      CustomEvent.triggerClient(
        this.player,
        "loadDating",
        this.dating.map((q) => {
          return [q.targetId, q.name];
        })
      );
    });

    //CustomEvent.triggerCef(this.player, 'hud:updateCandy', this.candyCount);
    CustomEvent.triggerCef(this.player, "hud:updateLollipops", this.lollipops);
    setTimeout(() => {
      if (this.exists)
        CustomEvent.triggerClient(
          this.player,
          "dressData:new",
          dress.sendingConfig
        );
    }, 10000);

    if (!this.skin) {
      this.startCustomization();
    } else {
      weather.sync(this.player);
      this.notifyWithPicture(
        `Weazel News [${weather.getFullRpTime()}]`,
        this.LangString("user.afterLogin.notifyWithPicture"),
        `${weather.getWeatherName(weather.weather)}`,
        "WEAZEL"
      );
      this.reloadSkin();

      if (teleport) {
        // Eliminat: verificarea pentru ConstructionSystem
        CustomEvent.triggerClient(
          this.player,
          "spawn:select",
          this.canSpawnHouse,
          !!this.houseEntityLive,
          !!this.family,
          !!this.family && !!this.family.house,
          this.fraction,
          !this.canSpawnHouse
            ? `${Math.floor(
                Math.max(
                  1,
                  15 - (system.timestamp - User.lastSave.get(this.id)) / 60
                )
              )}`
            : null
        );
      }
    }
    // setTimeout(() => {
    // 	if (this.exists)
    // 		CustomEvent.triggerClient(
    // 			this.player,
    // 			"dressData:new",
    // 			dress.sendingConfig,
    // 		);
    // }, 10000);
    // if (!this.skin) {
    // 	this.startCustomization();
    // } else {
    // 	weather.sync(this.player);
    // 	this.notifyWithPicture(
    // 		`Weazel News [${weather.getFullRpTime()}]`,
    // 		this.LangString("user.afterLogin.notifyWithPicture"),
    // 		`${weather.getWeatherName(weather.weather)}`,
    // 		"WEAZEL",
    // 	);
    // 	this.reloadSkin();

    // 	if (teleport) {
    // 		const flatLobby = ConstructionSystem.getByPlayer(this.player);
    // 		if (flatLobby) {
    // 			flatLobby.enterInterior(this.player);
    // 			this.tempData.oldpos = {
    // 				x: CONSTRUCTION_REGISTER_POS.x,
    // 				y: CONSTRUCTION_REGISTER_POS.y,
    // 				z: CONSTRUCTION_REGISTER_POS.z,
    // 				d: 0,
    // 				h: 0,
    // 			};
    // 		} else {
    // 			CustomEvent.triggerClient(
    // 				this.player,
    // 				"spawn:select",
    // 				this.canSpawnHouse,
    // 				!!this.houseEntityLive,
    // 				!!this.family,
    // 				!!this.family && !!this.family.house,
    // 				this.fraction,
    // 				!this.canSpawnHouse
    // 					? `${Math.floor(Math.max(1, 15 - (system.timestamp - User.lastSave.get(this.id)) / 60))}`
    // 					: null,
    // 			);
    // 		}
    // 	}
    // }
    this.afterLoginEvents.map((handle) => handle());
    // Загрузка данных по конфигурации одежды
    setTimeout(() => {
      if (!this.exists) return;
      if (getX2Param("donate"))
        this.player.outputChatBox(
          this.LangString("user.afterLogin.chat.notify.donate")
        );
      if (getX2Param("donate3"))
        this.player.outputChatBox(
          this.LangString("user.afterLogin.chat.notify.donate3")
        );
      if (getX2Param("exp"))
        this.player.outputChatBox(
          this.LangString("user.afterLogin.chat.notify.exp")
        );
      if (getX2Param("exp3"))
        this.player.outputChatBox(
          this.LangString("user.afterLogin.chat.notify.exp3")
        );
      if (getX2Param("job"))
        this.player.outputChatBox(
          this.LangString("user.afterLogin.chat.notify.job")
        );
      if (getX2Param("playtime") && system.playtimeCanNow)
        this.player.outputChatBox(
          this.LangString(
            "user.afterLogin.chat.notify.playtime",
            PLAYTIME_TIME,
            "",
            system.numberFormat(PLAYTIME_MONEY),
            PLAYTIME_TYPE === "donate" ? DONATE_MONEY_NAMES[2] : ""
          )
        );
      if (
        getX2Param("playtimecar") &&
        !this.account.playtimecar &&
        (this.level <= LEVEL_FOR_PLAY_REWARD_MAX || this.entity.playtimecar > 0)
      ) {
        const cfg = Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX);
        if (cfg) {
          this.player.outputChatBox(
            this.LangString(
              "user.afterLogin.chat.notify.playtimecar",
              Math.floor(MINUTES_FOR_PLAY_REWARD_MAX / 60),
              cfg.name
            )
          );
        }
      }
      getGpsMissionVehs(this.player);
    }, 5000);
    CustomEvent.triggerClient(this.player, "vip:data", this.vip, this.vip_end);
    CustomEvent.triggerClient(
      this.player,
      "zoneControl:sync",
      zoneControlData()
    );

    const house = houses.getByUserList(this.id);
    if (house && !house.forFamily)
      CustomEvent.triggerClient(
        this.player,
        "house:homeBlip:create",
        JSON.stringify({ x: house.x, y: house.y, z: house.z })
      );

    if (
      this.familyId &&
      houses.getByFamilyId(this.familyId) &&
      Family.getByID(this.familyId).level < 4
    )
      CustomEvent.triggerClient(
        this.player,
        "familyHome:createBlip",
        JSON.stringify({
          x: houses.getByFamilyId(this.familyId).x,
          y: houses.getByFamilyId(this.familyId).y,
          z: houses.getByFamilyId(this.familyId).z,
        })
      );
    if (this.warehouseEntity)
      CustomEvent.triggerClient(
        this.player,
        "warehouseBlip:create",
        this.warehouseEntity.position
      );

    this.sendClientQuestsData();
    if (!this.load)
      this.log("PlayerJoin", this.LangString("user.afterLogin.load"));
    syncDeathId(this.id);
    this.checkFamilyQuests();
    this.inventoryAttachSync();
    // biome-ignore lint/complexity/noForEach: <explanation>
    BizWar.currentBizWars.forEach((q) => q.addPlayer(this.player));

    this.load = true;

    if (this.entity.walkingStyle) {
      this.player.setVariable("walkingStyle", this.entity.walkingStyle);
    }

    mp.events.call("_userLoggedIn", this);
    incrementAuthCounter();

    mdt.reloadCriminals(this.player);
  };

  showTimeEvents = () => {
    if (!mp.players.exists(this.player)) return;
    const sendListHud: {
      type: number;
      time: number;
      desc?: string;
      amount?: number;
      pic: string;
    }[] = [];
    if (getX2Param("playtime") && !this.entity.successItem.includes(100000))
      sendListHud.push({
        type: 0,
        time: 5,
        desc: this.LangString("user.showTimeEvents.playtime"),
        amount: PLAYTIME_MONEY,
        pic: "coins-action",
      });
    if (
      getX2Param("playtimecar") &&
      !this.account.playtimecar &&
      (this.level <= LEVEL_FOR_PLAY_REWARD_MAX || this.entity.playtimecar > 0)
    ) {
      const cfg = Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX);
      if (cfg && !this.entity.successItem.includes(100001)) {
        sendListHud.push({
          type: 1,
          time: Math.floor(MINUTES_FOR_PLAY_REWARD_MAX / 60),
          desc: cfg.name,
          pic: "car-action",
        });
      }
    }
    if (sendListHud.length > 0) {
      CustomEvent.triggerCef(this.player, "hud:actions", sendListHud);
    }
  };

  get canSpawnHouse() {
    return true;
    //if(!User.lastSave.has(this.id)) return true;
    //return (system.timestamp - User.lastSave.get(this.id) > (15 * 60));
  }

  getSignature = (document: string, info?: string): Promise<boolean> => {
    return CustomEvent.callClient(this.player, "signature:get", document, info);
  };

  bankLog = (
    type: "add" | "remove" | "reject",
    sum: number,
    reason: string,
    iniciator: string
  ) => {
    User.writeBankNotify(this, type, sum, reason, iniciator);
  };

  get haveActiveWarns() {
    return !!this.entity.warns.find((q) => q.time > system.timestamp);
  }

  getNearestVehicle = (r = 5) => {
    if (!this.exists) return null;
    if (this.player.vehicle) return this.player.vehicle;
    return this.getNearestVehicles(r)[0];
  };
  getNearestVehicles = (r = 5) => {
    if (!this.exists) return null;
    const vehs = Vehicle.toArray()
      .filter(
        (veh) =>
          veh.dimension === this.player.dimension &&
          this.player.dist(veh.position) <= r
      )
      .sort((a, b) => {
        return this.player.dist(a.position) - this.player.dist(b.position);
      });
    return vehs;
  };

  public selectedChestOrderId = 0;
}

CustomEvent.registerCef("greeting:ok", (player) => {
  const user = player.user;
  if (!user) return;
  user.showTimeEvents();
});

CustomEvent.registerCef("spawn:select", (player, type: number) => {
  const user = player.user;
  if (!user) return;

  setTimeout(() => {
    user.showTimeEvents();
  }, system.TELEPORT_TIME + 1000);

  const { x, y, z, h, d } = user.lastEnterPosition;
  if (user.heal_time) {
    user.teleport(x, y, z, h, d);
    setTimeout(() => {
      CustomEvent.triggerClient(user.player, "heal:start", user.heal_time);
    }, system.TELEPORT_TIME * 3);
  } else if (user.jailSyncHave) {
    user.teleport(x, y, z, h, d);
    setTimeout(() => {
      prison.sync(user.player);
    }, system.TELEPORT_TIME * 3);
  } else {
    const spawnLast = () => {
      user.teleport(x, y, z, h, d);
    };

    if (type === 3) return spawnLast();
    else if (type === 2) {
      const family = user.family;
      if (!family) return spawnLast();
      const house = family.house;
      if (!house) return spawnLast();
      const houseInt = getInteriorHouseById(house.interrior);
      if (!houseInt) return spawnLast();
      houses.enterHouse(player, house);
      furniture.enterHouse(player, house);
    } else if (type === 1) {
      if (!user.fraction) return spawnLast();
      const fraction = fractionCfg.getFraction(user.fraction);
      const pos = fraction.spawn;
      if (!pos) return spawnLast();
      user.teleport(pos.x, pos.y, pos.z, pos.h, 0);
    } else if (type === 0) {
      const house = user.houseEntityLive;
      if (!house) return spawnLast();
      const houseInt = getInteriorHouseById(house.interrior);
      if (!houseInt) return spawnLast();
      user.teleport(
        houseInt.enter.x,
        houseInt.enter.y,
        houseInt.enter.z + 1,
        houseInt.enter.h,
        house.id
      );
      furniture.enterHouse(player, house);
    } else {
      system.debug.error(`spawn:select ${user.id} ${user.name} send ${type}`);
      spawnLast();
    }
  }
});

export const account = {
  getAccount: (
    login: string,
    passwordInput: string
  ): Promise<AccountEntity> => {
    return new Promise((resolve, reject) => {
      let password = account.hashPassword(passwordInput);
      AccountEntity.findOne({ login, password }).then((usr) => {
        resolve(usr);
      });
    });
  },
  getAccountLog: (login: string, passwordInput: string): Promise<MyData> => {
    return new Promise((resolve, reject) => {
      account.getAccount(login, passwordInput).then(async (usr) => {
        if (!usr) return resolve(null);
        const pers = await UserEntity.find({ account: usr });
        let level = 0;
        pers.map((s) => {
          if (s.admin_level > level) level = s.admin_level;
        });
        resolve({
          id: usr.id,
          level,
          online: !!mp.players
            .toArray()
            .find((q) => q.user && q.user.account.id === usr.id),
          name: usr.login,
        });
      });
    });
  },
  auth: (
    player: PlayerMp,
    login: string,
    passwordInput: string
  ): Promise<AccountEntity> => {
    return new Promise((resolve, reject) => {
      account.getAccount(login, passwordInput).then((usr) => {
        if (!usr || !mp.players.exists(player)) return resolve(null);
        const name = player.socialClub;
        const rgscid = player.rgscId;
        const ip = player.ip;
        const hash = player.serial;
        const check = () => {
          if (usr.social_name === name) return true;
          if (usr.social_name_register === name) return true;
          if (usr.social_id === rgscid) return true;
          if (usr.social_id_register === rgscid) return true;
          if (usr.social_id_real === player.socialClub) return true;
          if (usr.hash === hash) return true;
          if (usr.hash_register === hash) return true;
          return false;
        };
        if (!check()) return resolve(null);
        usr.social_name = name;
        usr.social_id = rgscid;
        usr.social_id_real = player.socialClub;
        usr.ip = ip;
        usr.hash = hash;
        usr.save().then((r) => {
          resolve(r);
        });
      });
    });
  },
  hashPassword: (password: string) => {
    return crypto.createHash("sha256").update(password).digest("hex");
  },
  findAll: (player: PlayerMp): Promise<AccountEntity> => {
    return new Promise((resolve, reject) => {
      const name = player.socialClub;
      const rgscid = player.rgscId;
      const ip = player.ip;
      const hash = player.serial;
      AccountEntity.findOne({
        where: [
          { social_name: name },
          { social_name_register: name },
          { social_id: rgscid },
          { social_id_register: rgscid },
          { ip: ip },
          { ip_register: ip },
          { hash: hash },
          { hash_register: hash },
        ],
      }).then((acc) => {
        resolve(acc);
      });
    });
  },
  existAnyAccount: (
    player: PlayerMp,
    registerCheck = false
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const name = player.socialClub;
      const rgscid = player.rgscId;
      const ip = player.ip;
      // let hash = player.serial
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const check: { [param: string]: any }[] = [
        { social_name: name },
        { social_name_register: name },
        { social_id: rgscid },
        { social_id_register: rgscid },
        //{hash: hash},
        //{hash_register: hash}
      ];
      if (!registerCheck) {
        check.push({ ip: ip }, { ip_register: ip });
      }

      AccountEntity.count({
        where: check,
      }).then((acc) => {
        resolve(!!acc);
      });
    });
  },
  registerAccount: (
    player: PlayerMp,
    login: string,
    password: string,
    email: string,
    promocode: string
  ): Promise<AccountEntity> => {
    return new Promise((resolve, reject) => {
      const acc = new AccountEntity();
      acc.login = login;
      acc.password = account.hashPassword(password);
      acc.email = email;
      acc.promocode = promocode;

      acc.social_name = player.socialClub;
      acc.social_id = player.rgscId;
      acc.social_id_real = player.socialClub;
      acc.hash = player.serial;
      acc.ip = player.ip;

      acc.social_name_register = player.socialClub;
      acc.social_id_register = player.rgscId;
      acc.social_id_real_register = player.socialClub;
      acc.hash_register = player.serial;
      acc.ip_register = player.ip;

      if (!mp.players.exists(player)) return reject();
      acc
        .save()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  },
};
mp.events.add("server:syncScratchEyes", (player) => {
  // const range = 50.0; // raza în care ceilalți jucători văd animația

  // setează flag pentru textul deasupra capului
  player.setVariable("checkingIDs", true);

  // pornește animația pentru toți (sincronizată automat)
  player.user.playAnimation(
    [["anim@mp_player_intcelebrationmale@face_palm", "face_palm", 1]],
    false,
    true
  );

  // după 3 secunde oprim animația
  setTimeout(() => {
    player.stopAnimation();
    player.setVariable("checkingIDs", false);
  }, 3000);
});

mp.events.add(
  "playerQuit",
  async (player: PlayerMp, exitType: string, reason: string) => {
    if (!player.user) return;

    system.debug.info(
      `#${player.user.id} ${player.user.name} Beende den Server, ${exitType} ${reason}`
    );

    player.user.deadLeaveEvent();
    User.userQuit(player);
  }
);

// mp.events.add(
// 	"playerQuit",
// 	(player: PlayerMp, exitType: string, reason: string) => {
// 		if (!player.user) return;
// 		system.debug.info(
// 			`#${player.user.id} ${player.user.name} Beende den Server, ${exitType} ${reason}`,
// 		);
// 		player.user.deadLeaveEvent();
// 		User.userQuit(player);
// 	},
// );
mp.events.add("playerDeath", (player, reason?: number, killer?: PlayerMp) => {
  const user = player.user;
  if (!user) return;
  // inventory.clearInventory(OWNER_TYPES.PLAYER, user.id);
  if (player.dimension === COMMAND_EVENT_DIMENSION) return;
  if (player.dimension === ISLAND_BATTLE_DIMENSION) return;
  if (player.user.jailSyncHave) return;
  user.removeCurrentWeapon(true);
  user.deadLeaveEvent();
  if (killer)
    CustomEvent.triggerClient(
      player,
      "player:dead",
      player.user.getShowingNameString(killer),
      killer.user.dbid
    );
  else CustomEvent.triggerClient(player, "player:dead", null, null);

  if (killer?.user)
    killer.user.log(
      "PlayerKill",
      killer.user.LangString("user.death.reason", reason),
      user.id
    );
  if (killer?.user && player?.user) {
    killer.user.stats.kill();
    player.user.stats.death();
  }
  user.log(
    "PlayerDeath",
    user.LangString(
      "user.death.reason3",
      killer && killer.user
        ? user.LangString(
            "user.death.reason1",
            killer.user.name,
            killer.user.id
          )
        : user.LangString("user.death.reason2"),
      reason
    ),
    killer && killer.user ? killer.user.id : null
  );

  if (
    !!killer &&
    !!killer.user &&
    player != killer &&
    user.is_gos &&
    user.getJobDress &&
    !player.dimension &&
    !killer.dimension &&
    !killer.user.is_gos &&
    nonHiddenMasksIds.includes(killer.getClothes(1).drawable)
  ) {
    killer.user.giveWanted(
      killer.user.wanted_level + 2 > 5
        ? 5
        : ((killer.user.wanted_level + 2) as 0 | 1 | 2 | 3 | 4 | 5),
      killer.user.LangString("user.death.wanted")
    );
  }

  if (
    !!killer &&
    !!killer.user &&
    player != killer &&
    !player.dimension &&
    !killer.dimension &&
    user.wanted_level &&
    killer.user.is_police &&
    !user.is_police
  ) {
    player.user.killedByPolice = killer;
  } else if (!!user.killedByPolice) user.killedByPolice = null;
});

mp.events.add("playerJoin", (player) => {
  User.initPlayerFunctions(player);
});
// mp.events.add("_userLoggedIn", (user: User) => {
// 	const player = user.player;
// 	weather.sync(player);

// 	// ✅ Aici adaugi verificarea pentru poliție:
// 	if (user.fraction === 2) {
// 		givePoliceWeapons(player);
// 	}
// });

mp.events.add("_userLoggedIn", async (user: User) => {
  const player = user.player;
  weather.sync(player);

  // Marchează jucătorul ca fiind online
  user.entity.is_onlines = true; // sau 1
  await user.entity.save();
});
// mp.events.add("_userLoggedIn", (user: User) => {
// 	const player = user.player;
// 	// Setează jucătorul ca fiind online în DB
// 	// ✅ Marchează jucătorul ca fiind online
// 	user.entity.is_online = true;
// 	await user.entity.save();;
// 	weather.sync(player);
// });

CustomEvent.registerClient("death:toggle", (player, isDead: boolean) => {
  if (!player.user) {
    return;
  }

  if (isDead) {
    player.user.deathTimeEnd = system.timestamp + 10 * 60;
  } else {
    // Для предотвращения поднятия с пола предметов после смерти
    player.user.deathTimeEnd = system.timestamp + 15;
  }
});

CustomEvent.registerClient(
  "accounts:exists",
  (player, realSocialId: number) => {
    player.realSocial = String(realSocialId);
    return account.existAnyAccount(player);
  }
);
CustomEvent.registerClient(
  "user:playAnimation",
  (
    player,
    seq: [string, string, number?][],
    upper = false,
    lopping = false
  ) => {
    if (!player.user) return;
    player.user.playAnimation(seq, upper, lopping);
  }
);

CustomEvent.registerClient(
  "user:playAnimCustom",
  (player, scenario: string, song?: string, attach?: AnimParam["prop"]) => {
    if (!player.user) return;
    [player, ...player.user.getNearestPlayers(20)].forEach((target) => {
      CustomEvent.triggerClient(
        target,
        "user:playAnimCustomEv",
        player.id,
        scenario,
        song,
        attach
      );
    });
  }
);

CustomEvent.registerCef(
  "server:user:account:register",
  (
    player,
    login: string,
    password: string,
    email: string,
    promocode: string
  ): Promise<{ status: boolean; text: string }> => {
    return new Promise((resolve, reject) => {
      // if (!mp.config.announce && player.ip !== "127.0.0.1") {
      // 	if (
      // 		!testUsers.data.find(
      // 			(q) => q.toLowerCase() == player.socialClub.toLowerCase(),
      // 		)
      // 	)
      // 		return resolve({
      // 			status: false,
      // 			text: langStringDefault("user.register.test"),
      // 		});
      // }
      account.existAnyAccount(player, true).then(async (exist) => {
        if (!mp.players.exists(player)) return reject();
        if (exist) {
          system.debug.info(
            `social_name: ${player.socialClub}, social_id: ${player.rgscId}, hash: ${player.serial}`
          );
          resolve({
            status: false,
            text: langStringDefault("user.register.exist"),
          });
        } else {
          let existsWithLogin = await AccountEntity.count({
            where: [{ login }, { email }],
          });
          if (!mp.players.exists(player)) return reject();
          if (existsWithLogin > 0)
            return resolve({
              status: false,
              text: langStringDefault("user.register.existLogin"),
            });

          BlackListEntity.count({
            where: {
              social_name: player.socialClub.toLowerCase(),
            },
          }).then((block) => {
            if (block)
              return resolve({
                status: false,
                text: langStringDefault(
                  "user.register.blockSC",
                  player.socialClub
                ),
              });
            account
              .registerAccount(player, login, password, email, promocode)
              .then((res) => {
                if (!mp.players.exists(player)) return reject();
                if (!res)
                  return resolve({
                    status: false,
                    text: langStringDefault("user.register.nores"),
                  });
                player.account = res;
                player.usersList = [];
                resolve({ status: true, text: "" });
              });
          });
        }
      });
    });
  }
);

// export let testUsers = new NoSQLbase<string>("testUsers");
// gui.chat.registerCommand("addwl", (player, social) => {
// 	if (!player.user.isAdminNow(6))
// 		return player.notify(player.user.LangString("user.addWL.admin"));
// 	if (testUsers.data.find((q) => q.toLowerCase() == social.toLowerCase()))
// 		return player.notify(player.user.LangString("user.addWL.exist"), "error");
// 	testUsers.insert(social.toLowerCase());
// 	testUsers.save();
// 	player.notify(player.user.LangString("user.addWL.added"), "success");
// });
// gui.chat.registerCommand("removewl", (player, social) => {
// 	if (!player.user.isAdminNow(6))
// 		return player.notify(player.user.LangString("user.removewl.admin"));
// 	if (!testUsers.data.find((q) => q.toLowerCase() == social.toLowerCase()))
// 		return player.notify(player.user.LangString("user.removewl.fnd"), "error");
// 	testUsers.remove(social.toLowerCase());
// 	testUsers.save();
// 	player.notify(player.user.LangString("user.removewl.ok"), "success");
// });

// CustomEvent.registerCef(
//     "server:user:account:login",
//     async (
//         player,
//         login: string,
//         password: string,
//     ): Promise<{
//         status: boolean;
//         text?: string;
//         personages?: personageLoginData[];
//         donate?: number;
//     }> => {
//         if (player.spamProtect) {
//             return { status: false, text: langStringDefault("user.login.spam") };
//         }
//         if (player.account) return { status: false };

//         player.spamProtect = true;
//         setTimeout(() => {
//             if (mp.players.exists(player)) {
//                 player.spamProtect = false;
//             }
//         }, 3000);

//         try {
//             const acc = await account.auth(player, login, password);
//             if (!mp.players.exists(player)) return { status: false };

//             if (!acc) {
//                 return { status: false, text: langStringDefault("user.login.acc") };
//             }

//             const block = await BlackListEntity.findOne({
//                 where: {
//                     social_name: In([
//                         player.socialClub.toLowerCase(),
//                         acc.social_name.toLowerCase(),
//                         acc.social_name_register.toLowerCase(),
//                     ]),
//                 },
//             });

//             if (block) {
//                 return {
//                     status: false,
//                     text: langStringDefault("user.login.block", block.social_name),
//                 };
//             }

//             if (acc.ban_end >= system.timestamp) {
//                 return {
//                     status: false,
//                     text: langStringDefault(
//                         "user.login.accban",
//                         system.timeStampString(acc.ban_end),
//                         acc.ban_admin,
//                         acc.ban_reason,
//                     ),
//                 };
//             }

//             if (
//                 mp.players
//                     .toArray()
//                     .some(
//                         (target) =>
//                             target.account?.id === acc.id ||
//                             target.user?.account.id === acc.id,
//                     )
//             ) {
//                 return { status: false, text: langStringDefault("user.login.err") };
//             }

//             // 🔹 Căutăm caracterul (doar unul)
//             const pers = await UserEntity.find({ account: acc });
//             player.account = acc;

//             let personages: personageLoginData[] = [];

//             if (pers.length > 0) {
//                 const itm = pers[0]; // doar primul caracter
//                 let genderValue = 0;

//                 try {
//                     if (itm.skin && itm.skin.length > 10) {
//                         const parsedSkin = JSON.parse(itm.skin);
//                         if (parsedSkin && typeof parsedSkin.SEX !== "undefined") {
//                             genderValue = parsedSkin.SEX;
//                         }
//                     }
//                 } catch (e) {
//                     system.debug.error(`Eroare la parsarea skin-ului pentru user ${itm.id}:`, e);
//                 }

//                 personages.push({
//                     id: itm.id,
//                     name: itm.rp_name,
//                     money: itm.money,
//                     bank: itm.bank_money,
//                     playTime: itm.played_time,
//                     gender: genderValue,
//                     fraction: itm.fraction,
//                     rank: itm.rank,
//                     level: itm.level,
//                     haveSkin: itm.skin && itm.skin.length > 10,
//                 });
//             }

//             player.usersList = personages;
//             CustomEvent.triggerClient(player, "lsc:load", lscConfig);

//             system.debug.info(
//                 `Login OK [#${acc.id} ${acc.social_name} ${acc.ip}]. Caracter: ${personages.length > 0 ? `(#${personages[0].id} ${personages[0].name})` : "Niciun caracter"}`
//             );

//             return { status: true, personages, donate: acc.donate };
//         } catch (err) {
//             system.debug.error("Eroare autorizație:", err);
//             return { status: false, text: "Eroare de server" };
//         }
//     },
// );

CustomEvent.registerCef(
  "server:user:account:login",
  async (
    player,
    login: string,
    password: string
  ): Promise<{
    status: boolean;
    text?: string;
    personages?: personageLoginData[];
    donate?: number;
  }> => {
    if (player.spamProtect) {
      return { status: false, text: langStringDefault("user.login.spam") };
    }
    if (player.account) return { status: false };

    player.spamProtect = true;
    setTimeout(() => {
      if (mp.players.exists(player)) {
        player.spamProtect = false;
      }
    }, 3000);

    try {
      const acc = await account.auth(player, login, password);
      if (!mp.players.exists(player)) return { status: false };

      if (!acc) {
        return { status: false, text: langStringDefault("user.login.acc") };
      }

      const block = await BlackListEntity.findOne({
        where: {
          social_name: In([
            player.socialClub.toLowerCase(),
            acc.social_name.toLowerCase(),
            acc.social_name_register.toLowerCase(),
          ]),
        },
      });

      if (block) {
        return {
          status: false,
          text: langStringDefault("user.login.block", block.social_name),
        };
      }

      if (acc.ban_end >= system.timestamp) {
        return {
          status: false,
          text: langStringDefault(
            "user.login.accban",
            system.timeStampString(acc.ban_end),
            acc.ban_admin,
            acc.ban_reason
          ),
        };
      }

      if (
        mp.players
          .toArray()
          .some(
            (target) =>
              target.account?.id === acc.id ||
              target.user?.account.id === acc.id
          )
      ) {
        return { status: false, text: langStringDefault("user.login.err") };
      }

      const pers = await UserEntity.find({ account: acc });
      player.account = acc;

      const personages: personageLoginData[] = pers.map((itm) => ({
        id: itm.id,
        name: itm.rp_name,
        money: itm.money,
        bank: itm.bank_money,
        playTime: itm.played_time,
        gender: JSON.parse(itm.skin).SEX,
        fraction: itm.fraction,
        rank: itm.rank,
        level: itm.level,
        haveSkin: itm.skin?.length > 10,
      }));

      player.usersList = personages;
      CustomEvent.triggerClient(player, "lsc:load", lscConfig);

      system.debug.info(
        `Kontovollmacht [#${acc.id} ${acc.social_name} ${
          acc.ip
        }]. Verfügbare Zeichen: ${personages
          .map((q) => `(#${q.id} ${q.name})`)
          .join(", ")}`
      );

      return { status: true, personages, donate: acc.donate };
    } catch (err) {
      system.debug.error("Eroare de la server:", err);
      return { status: false, text: "Eroare de server" };
    }
  }
);

CustomEvent.registerCef(
  "cef:user:create",
  async (player, buy: boolean = false, quest?: number) => {
    if (!player.usersList) {
      system.debug.error("[Benutzererstellung] !player.usersList");
      return false;
    }

    if (!mp.players.exists(player)) {
      system.debug.error("[User Creation] Spieler hat den Server verlassen");
      return false;
    }

    if (player.usersList.length >= 3 || player.user) return false;

    const needDonateCreate = player.usersList.length === 2;
    if (needDonateCreate && player.account.donate < DONATE_SLOT_PERSONAGE_COST)
      return false;

    try {
      const pos = system.getRandomSpawn();
      const usr = UserEntity.create({
        rp_name: "",
        date_reg: system.timestamp,
        position: JSON.stringify({
          x: pos[0].x,
          y: pos[0].y,
          z: pos[0].z,
          d: 0,
          h: pos[1],
        }),
        account: player.account,
      });

      await usr.save();

      if (!mp.players.exists(player)) {
        system.debug.error("[User Creation] Spieler hat den Server verlassen");
        return false;
      }

      if (needDonateCreate) {
        player.account.donate -= DONATE_SLOT_PERSONAGE_COST;
        await player.account.save();
      }

      system.debug.info(
        `Ein neues Zeichen wurde registriert [#${usr.id} ${usr.rp_name}] auf dem Konto #${player.account.id}`
      );

      // inventory.createItem({ owner_type: OWNER_TYPES.PLAYER, owner_id: usr.id, item_id: randomArrayElement(inventoryShared.items.filter(q => q.type == ITEM_TYPE.FOOD)).item_id });
      // inventory.createItem({ owner_type: OWNER_TYPES.PLAYER, owner_id: usr.id, item_id: randomArrayElement(inventoryShared.items.filter(q => q.type == ITEM_TYPE.WATER)).item_id });
      // inventory.createItem({ owner_type: OWNER_TYPES.PLAYER, owner_id: usr.id, item_id: randomArrayElement(inventoryShared.items.filter(q => q.type == ITEM_TYPE.WATER)).item_id });

      User.create(player, usr, usr.account, quest);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
);

CustomEvent.registerCef("cef:user:select", async (player, id: number) => {
  if (!player.usersList?.some((q) => q.id === id) || player.user) return;

  const acc = await UserEntity.findOne({
    relations: ["account"],
    where: { id },
  });

  if (!acc) return;

  if (acc.ban_end >= system.timestamp) {
    const admin = acc.ban_admin
      ? await UserEntity.findOne({ where: { id: acc.ban_admin } })
      : null;
    return langStringDefault(
      "user.user.select.ban",
      system.timeStampString(acc.ban_end),
      acc.ban_reason,
      admin?.rp_name || "Unknown"
    );
  }

  User.create(player, acc, acc.account);
  return null;
});

gui.chat.registerCommand("vipuninvite", (player) => {
  const user = player.user;
  if (!user) return;
  const vip = user.vipData;
  if (!vip || !vip.vipuninvite)
    return player.notify(
      player.user.LangString(
        "user.vipuninvite.novip",
        VIP_TARIFS.filter((q) => q.vipuninvite)
          .map((q) => q.name)
          .join(", ")
      ),
      "error"
    );
  if (!user.fractionData)
    return player.notify(
      player.user.LangString("user.vipuninvite.faction"),
      "error"
    );
  menu.accept(player).then((status) => {
    if (!status) return;
    user.fraction = null;
    player.notify(player.user.LangString("user.vipuninvite.ok"), "success");
  });
});

CustomEvent.registerClient(
  "anticheat:detect",
  (player, type: ANTICHEAT_TYPE, reason: string) => {
    if (!player.user) return;
    player.user.cheatDetect(type, reason);
  }
);

// CustomEvent.registerClient('anticheat:vehicletp', (player, vehid: number) => {
//     if (!player.user) return;
//     const user = player.user;
//     const vehicle = mp.vehicles.at(vehid);
//     if(!vehicle) return system.debug.error(`anticheat:vehicletp ${user.name} [${user.id}] SEND non exists vehicle id ${vehid}`), user.cheatDetect('memory', 'Подмена данных в ивенте anticheat:vehicletp');
//     const controller = vehicle.controller
//     if(!controller) return;
//     if(controller.id !== player.id) return;
//     user.cheatDetect('vehicletp', 'Телепортация транспорта не находясь в нём');
// })

CustomEvent.registerClient("users:whitelist", (player) => {
  const user = player.user;
  if (!user) return;
  if (user.admin_level < 6) return;
  const s = () => {
    const m = menu.new(player, "WhiteList", "List");
    m.newItem({
      name: player.user.LangString("user.whitelist.menu"),
      onpress: () => {
        menu
          .input(player, player.user.LangString("user.whitelist.menu.input"))
          .then((val) => {
            if (!val) return;
            if (
              testUsers.data.find((q) => q.toLowerCase() === val.toLowerCase())
            )
              return player.notify(
                player.user.LangString("user.whitelist.menu.err"),
                "error"
              );
            testUsers.insert(val.toLowerCase());
            testUsers.save();
            player.notify(
              player.user.LangString("user.whitelist.menu.notify"),
              "success"
            );
            s();
          });
      },
    });
    testUsers.data.map((social, socialid) => {
      m.newItem({
        name: social,
        onpress: () => {
          testUsers.remove(social);
          testUsers.save();
          player.notify(
            player.user.LangString("user.whitelist.menu.notify2"),
            "success"
          );
          s();
        },
      });
    });
    m.open();
  };
  s();
});

let restoreCodes = new Map<string, string>();

CustomEvent.registerCef("account:restorePassword", (player, email: string) => {
  return new Promise((resolve) => {
    AccountEntity.findOne({ where: { email: email } }).then((acc) => {
      if (!acc) return resolve(langStringDefault("user.restoreEmail"));
      if (restoreCodes.has(email)) return resolve(null);
      const code = system.randomStr(4);
      restoreCodes.set(email, code);
      resolve(null);
      Mail.sendMail(
        "STAGE-RP Restore",
        email,
        langStringDefault("user.restoreEmail.title"),
        langStringDefault(
          "user.restoreEmail.text",
          acc.login,
          code,
          RESTORE_CODE_LIFETIME
        )
      );
      setTimeout(() => {
        if (restoreCodes.get(email) === code) restoreCodes.delete(email);
      }, RESTORE_CODE_LIFETIME * 60000);
    });
  });
});
CustomEvent.registerCef(
  "account:verifyRestore",
  (player, email: string, code: string) => {
    return new Promise((resolve) => {
      AccountEntity.findOne({ where: { email: email } }).then((acc) => {
        if (!acc) return resolve(langStringDefault("user.restoreEmail"));
        if (!restoreCodes.has(email))
          return resolve(langStringDefault("user.verifyRestore.codehas"));
        if (restoreCodes.get(email) === code) {
          const newPassword = system.randomStr(9);
          acc.password = account.hashPassword(newPassword);
          acc.save();
          const kicktarget = mp.players
            .toArray()
            .find((q) => q.user && q.user.account.id === acc.id);
          if (kicktarget) {
            User.kickUser(
              kicktarget,
              langStringDefault("user.verifyRestore.kick")
            );
          }
          Mail.sendMail(
            "STAGE-RP Password",
            email,
            langStringDefault("user.verifyRestore.mail.title"),
            langStringDefault(
              "user.verifyRestore.mail.text",
              acc.login,
              newPassword
            )
          );
          resolve(null);
        } else {
          return resolve(langStringDefault("user.verifyRestore.resolve"));
        }
      });
    });
  }
);

export let playTimeX2Users = new NoSQLbase<{ id: number; time: number }>(
  "playTimeX2Users"
);

CustomEvent.registerClient("alertsEnable:data", (player, data) => {
  const user = player.user;
  if (!user) return;
  user.alertsEnabled = data;
});

setInterval(() => {
  mp.players.forEachFast((player) => {
    const user = player.user;
    if (!user) return;
    for (let ill in user.illData) {
      const val = user.illData[ill];
      if (val) {
        const cfg = getIllConfig(ill as any);
        if (cfg) {
          if (val < cfg.critical) {
            user.removeIll(cfg.id, cfg.step);
          } else {
            user.addIll(cfg.id, cfg.step_critical);
          }
          if (user.getIll(cfg.id) == cfg.max) {
            if (mp.players.exists(player)) {
              player.notify(
                player.user.LangString("user.ill", cfg.name),
                "error"
              );
              if (!user.attachedToPlace) user.health -= cfg.hp;
            }
          }
        }
      }
    }
  });
}, ILL_SYSTEM_STEP * 1000);

CustomEvent.registerClient("haveActiveLicense", (player, lic) => {
  const user = player.user;
  if (!user) return;
  return user.haveActiveLicense(lic);
});

CustomEvent.registerCef("wintaskevent:setnotshow", (player, type: number) => {
  const user = player.user;
  if (!user) return;
  user.entity.successItem = [...user.entity.successItem, type + 100000];
});

CustomEvent.registerCef(
  "server::signature:save",
  async (player: PlayerMp, dataString: string) => {
    if (!player.user) return;

    try {
      const data = JSON.parse(dataString);
      console.log("save signature");

      const signature = await Signatures.findOne({
        where: { userId: player.user.id, type: data.document },
      });
      if (signature) {
        await signature.remove();
      }

      const entity = new Signatures();
      entity.userId = player.user.id;
      entity.signature = data.sign;
      entity.type = data.document;

      await entity.save();

      // CustomEvent.triggerCef(player, "cef:setSignature", signature);
    } catch (e) {
      console.error(e);

      return false;
    }

    return true;
  }
);

CustomEvent.registerCef(
  "server::signature:get",
  async (player: PlayerMp, targetId: number, type: string) => {
    if (!player.user) return;

    const signature = await Signatures.findOne({
      where: { userId: targetId, type: type },
    });
    if (!signature) return null;

    return signature.signature;
  }
);

// gui.chat.registerCommand('k', (player: PlayerMp) => {  /// Зделай чтобы когда написал команда еще раз чтобы октл анимация <<<<<<<<<<<<
// 	if (!player) return;

// 	player.user.playAnimation([["busted", "idle_a", 1]], true, true);
// })

const kAnimState = new Map<number, boolean>();

gui.chat.registerCommand("k", (player: PlayerMp) => {
  if (!player || !player.user) return;

  const isPlaying = kAnimState.get(player.id) || false;

  if (isPlaying) {
    // oprește animația
    player.stopAnimation(); // aceasta funcție va trimite comanda clientului să oprească animația
    kAnimState.set(player.id, false);
  } else {
    // pornește animația
    player.user.playAnimation([["busted", "idle_a", 1]], false, true);
    kAnimState.set(player.id, true);
  }
});
