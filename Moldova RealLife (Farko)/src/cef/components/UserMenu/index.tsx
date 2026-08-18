import React, { Component } from "react";
import "./style.less";
// import "./assets/main-menu.less";
// import "./assets/partner.less";
import "./assets/aim.less";
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";
import { helpInfo, ruleItem, rules } from "../../../shared/rules";
import {
  defaultHotkeys,
  generateHotkeysButtonsArray,
  getHotkeysName,
  getHotkeysNeedHold,
  hotkeyCategories,
} from "../../../shared/hotkeys";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { Statistic } from "./components/Statistic";
import DonateStorage from "./components/DonateStorage";
import {
  getJobData,
  JobId,
  JOBS_ADVANCED_LIST,
  jobsList,
} from "../../../shared/jobs";
import { systemUtil } from "../../../shared/system";
import { getVipConfig, PACKETS, VIP_TARIFS, VipId } from "../../../shared/vip";
import { Circle } from "rc-progress";
import {
  COINS_FOR_ONE_ROUBLE,
  Donate_Items,
  DONATE_MONEY_NAMES,
  MEDIA_PROMOCODE,
  PLAYTIME_MONEY,
  PLAYTIME_TIME,
  PLAYTIME_TYPE,
} from "../../../shared/economy";
import { CustomEventHandler } from "../../../shared/custom.event";
import { BUSINESS_SUBTYPE_NAMES } from "../../../shared/business";
import { LicensesData } from "../../../shared/licence";
import { getMaxExpLevel } from "../../../shared/payday";
import { system } from "../../modules/system";
import { getBaseItemNameById } from "../../../shared/inventory";
import {
  ALERTS_SETTINGS,
  StorageAlertData,
} from "../../../shared/alertsSettings";
import {
  CAR_NAME_FOR_CEF_FOR_PLAY_REWARD_MAX,
  MINUTES_FOR_PLAY_REWARD_MAX,
} from "../../../shared/reward.time";
import {
  getAchievConfig,
  getTempAchievConfig,
  UserAchievmentData,
  UserAchievmentKey,
} from "../../../shared/achievements";
import { SocketSync } from "../SocketSync";
import { TooltipClass } from "../Tooltip";
import { DonateRoulette } from "./components/donate-roulette";
import { CustomPicker, HSLColor, RGBColor } from "react-color";
import { Hue, Saturation } from "react-color/lib/components/common";
import { ColorPicker } from "../LSCnew";
import { ICrosshairSettings } from "../../../shared/crosshair";
import { HudCrosshair } from "../HudBlock/crosshair/crosshair";
import CrosshairStore from "../../stores/Crosshair";
import { AdminTickets } from "./components/AdminTickets";
import { Tickets } from "./components/Tickets";
import DailyRewards from './components/rewards';  
const vehicleShopList = [
  { name: "Bravado Contender", model: "16challenger", price: 600, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor JLS Y166", model: "63gls", price: 1200, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor JLS Y167", model: "63gls2", price: 900, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Annis 370X", model: "370z", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Grotti 884 Pizta", model: "488pista", price: 1600, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pfister 781 S Cabrio", model: "718bs", price: 1200, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Progen 720c", model: "720s", price: 1600, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pfister 819 Spyder", model: "918s", price: 1600, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Vapid Steed C550", model: "2020mustang", price: 1250, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Karin Superia", model: "a80", price: 900, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Gallivanter AB L460", model: "ab2", price: 1250, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor-ASG GS R", model: "amggt", price: 1150, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Dewbauchee Wanquish", model: "ast", price: 1200, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Enus Bakalar", model: "bacalar", price: 1100, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Truffade Vivo", model: "bdivo", price: 1600, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Enus Benteygo", model: "bentaygast", price: 1300, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht 3-line J20", model: "bmwg20", price: 0, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht Y7", model: "bmwx7", price: 1100, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Chevrolet Camaro (Gen 2)", model: "camaro2", price: 1300, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Declasse Gamaro 1TL", model: "camaro21", price: 750, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Karin Camria XW70", model: "camry70", price: 500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pfister Rayenne GS", model: "cayenne2", price: 800, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pegassi Centerio", model: "centenario", price: 1500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Cavalcade Excalibur", model: "cesc21", price: 950, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Bravado Changer CRT", model: "charger20", price: 850, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor ZLS S217", model: "cls63s", price: 1350, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Enus Mainland", model: "continental", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Declasse Covetto S8", model: "corvette2", price: 1350, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Dewbauchee DPX", model: "dbx", price: 1150, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor E-Series M213", model: "e63s", price: 1350, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Obey I-tron GS", model: "etron", price: 1500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Maibatsu Lance Revolution X", model: "evo10", price: 650, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Grotti F21 Verleenetta", model: "ff12", price: 1500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor G-Series M464", model: "g63", price: 1450, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Enus Shade", model: "ghost", price: 1500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor JLE S292", model: "gle63", price: 1450, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor ASG GS 4-door", model: "gt63s", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pegassi Hurricane", model: "huracan", price: 1450, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht l8", model: "i8", price: 1300, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Canis Great Cherokee", model: "jgc", price: 1000, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Grotti LaGrotti", model: "laferrari", price: 1450, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Emperor MX 570", model: "lex570", price: 1000, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht W4 H82", model: "m4f82", price: 1200, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht W5 H90 Contention", model: "m5comp", price: 1300, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht 7-line J70", model: "m7g70", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht 8-line", model: "m850", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Bravado Changer CRT", model: "charger2", price: 1300, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor E-Series C214 Estate", model: "eclass4", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht 2-line J42", model: "m2g42", price: 1100, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Annis Slivia", model: "s15", price: 500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Lampadati MS20", model: "mc20", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Coil Line S", model: "models", price: 1300, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Coil Line X", model: "modelx", price: 1100, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Annis GS-R M35", model: "nisgtr", price: 1300, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pfister Paramena", model: "panamera17turbo", price: 1100, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pfister 919 922-series", model: "pts21", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Obey O8", model: "q8", price: 750, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Obey P8", model: "r820", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pegassi Eventora", model: "reventon", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pegassi Rewuelto", model: "revuelto", price: 1500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Obey PS5", model: "rs5", price: 750, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Obey PS6", model: "rs6", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Obey PS7", model: "rs7", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Annis PX-7", model: "rx7", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Benefactor S-Series M222", model: "s63w222", price: 1000, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pfister Teycan", model: "taycan", price: 1400, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pegassi Ursus", model: "urus", price: 1200, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Pegassi Verano", model: "veneno", price: 1600, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Truffade Weyron", model: "veyron", price: 1600, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Bravado Wiper SPT", model: "viper", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Dewbauchee Vulcore", model: "vulcan", price: 1200, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht Y5 J05", model: "x5g05", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht Y6 W H86", model: "x6m", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht S4 N40i", model: "z4b", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Annis 400Z", model: "400z", price: 700, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Ubermacht 5-line A39", model: "bmwe39", price: 500, showroom: { x: -191.58, y: -1154.74 } },
  { name: "Zx 10r", model: "zx10r", price: 400, showroom: { x: -191.58, y: -1154.74 } },

];
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./img/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./img/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
import coins from "../../components/UserMenu/assets/svg/player-stop-white.svg";

import checkmark from "./img/rewardcollected.svg";
const msvg = Object.fromEntries(
  Object.entries(
    import.meta.glob("./img/menu-items/*.svg", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.svg$/)[1];
    return [name, value.default];
  })
);
import "./style/style.css";

import hotkeyarrow from "./img/hotkeyarrow.svg";

const ppng = Object.fromEntries(
  Object.entries(import.meta.glob("./img/profile/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

const achievementsLogo = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../shared/AchievImage/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    return [name, value.default];
  })
);

const iconsItems = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../shared/icons/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    return [name, value.default];
  })
);

import { profile } from "console";
import { LangString } from "../../../client/modules/lang";

const ColorPickerWrapped = CustomPicker(ColorPicker);

const pages = [
  ["profile", "Profil", "profile"],
  ["achiev", "Realizari", "advance"],
  ["players", "Jucatori", "players"],
  ["vip", "Donat", "shop"],
  ["binder", "Keybinds", "hotkeys"],
  ["help", "Regulament", "support"],
  ["rules", "Daily Rewards", "rewards"],
  ["settings", "Setari", "office"],
  ["statistic", "Statistici", "stats"],
  // ["donateStorage", "Depozit", "storage"],
  ["ticket", "Ticket", "complaints"],
];

let volumeStepsDraw = [{ value: 0, label: "OFF" }];
for (let id = 10; id <= 100; id += 10)
  volumeStepsDraw.push({ value: id, label: id + "%" });

export class UserMenuBlock extends Component<
  {
    CrosshairStore: CrosshairStore;
  },
  {
    loaded: boolean;
    page?: (typeof pages)[number][0];
    rp_name?: string;
    job?: number;
    jobs?: string;
    HotKeyArrow?: number;
    food?: number;
    water?: number;
    man?: boolean;
    exp?: number;
    level?: number;
    wanted_level?: number;
    warns?: number;
    bans?: number;
    work?: JobId;
    fraction?: string;
    rank?: string;
    house?: string;
    business?: string;
    players?: [number, string, number][];
    newplayers: number;
    hotkeys: {
      [task: string]: number;
    };
    shopPay: number;
    shopPage: number;
    JobPage: number;
    hotkeyEdit?: string;
    hotkeyOpen?: string;
    selectedKey?: number;
    helpSection: number;
    voiceData: [number, number, number];
    boomboxSound: number;
    alertsData: Partial<StorageAlertData>;
    menuItems: number;
    wanted_reason?: string;
    selectJob?: number;
    ads: {
      title: string;
      text: string;
      pic: string;
      button: string;
      pos?: {
        x: number;
        y: number;
        z: number;
      };
    }[];
    curAd: number;
    vipId?: VipId;
    vipEnd?: number;
    donate: number;
    buyVip: number;
    buyVipTime: number;
    buyModal: number;
    buyCoin: number;
    buyName: string;
    showPass: Array<boolean>;
    passData: Array<string>;
    google: boolean;
    googleInput: string;
    promo: string;
    ask: {
      helper?: boolean;
      /** Текущий тикет */
      select: string;
      /** id игрока для фильтрации */
      id: number;
      /** Фильтры */
      filter: Array<boolean>;
      input: string;
    };
    donateShops: {
      x: number;
      y: number;
      name: string;
      type: number;
      sub_type: number;
    }[];
    bankNumber?: number;
    bankPos?: { x: number; y: number };
    donateX: boolean;
    donateX3: boolean;
    chatSort: [boolean, boolean];
    playersType: number;
    online?: number;
    total?: number;
    bonus?: number;
    carbonus?: number;
    achieve: UserAchievmentData;
    achieveDaily: UserAchievmentData;
    promocodeMy?: string;
    promocodeMyInput?: string;
    promocodeMyCount?: number;
    promocodeMyRewardGived?: number;
    usersVoice?: [number, number][];
    voiceLevel: number;
    lodDistPlayers: number;
    lodDistVehs: number;
    crosshairSettings: ICrosshairSettings;
    currentCrosshairColor: { r: number; g: number; b: number };
    dailyRewards: {
      currentDay: number;
      lastRewardDate: number;
      todayPlayTime: number;
      resetDate: number;
      requiredPlayTime: number;
      isRewardClaimed: boolean;
      claimedRewards: number[];
      canClaimReward: boolean;
    },
    playTime: number,
  }
> {
  ev: CustomEventHandler;
  evAsk: CustomEventHandler;
  evDonateCoins: CustomEventHandler;
  evCrosshair: CustomEventHandler;
  adsTime: any;

  constructor(props: any) {
    super(props);
    this.state = {
      boomboxSound: 100,
      lodDistPlayers: 100,
      lodDistVehs: 100,
      voiceLevel: 1,
      usersVoice: CEF.test
        ? new Array(2)
          .fill([system.getRandomInt(1, 100000), system.getRandomInt(0, 200)])
          .map((q) => [
            system.getRandomInt(1, 100000),
            system.getRandomInt(0, 200),
          ])
        : [],
      achieve: CEF.test ? {
        "1hours": [33, 1123],
        "24hours": [1, 1],
      } : {},
      achieveDaily: CEF.test ? {
        "1hours": [0, 1123],
      } : {},
      donateShops: [],
      wanted_reason: "",
      loaded: CEF.test,
      currentCrosshairColor: { r: 0, g: 0, b: 0 },
      page: "profile",
      rp_name: "Test Name",
      food: 450,
      crosshairSettings: {
        width: 3,
        length: 20,
        alpha: 1,
        gap: 5,
        color: { r: 255, g: 255, b: 0 },
        enable: true,
        aimColor: { r: 255, g: 255, b: 0 },
      },
      water: 900,
      HotKeyArrow: 0,
      man: true,
      exp: 600,
      level: 100,
      wanted_level: 3,
      warns: 1,
      bans: 0,
      work: null,
      fraction: null,
      rank: null,
      players: [],
      newplayers: 0,
      hotkeys: { ...defaultHotkeys },
      helpSection: 0,
      voiceData: [100, 100, 100],
      alertsData: {},
      menuItems: 6,
      vipId: "Sapfire",
      vipEnd: 11111111111,
      ads: [
        {
          title: "Title",
          text: "text",
          pic: "car-slider-4",
          button: "button",
          pos: { x: 1, y: 1, z: 1 },
        },
      ],
      curAd: 0,
      selectJob: 0,
      shopPay: null,
      shopPage: 0,
      JobPage: 0,
      donate: 9999,
      buyVip: 0,
      buyVipTime: 0,
      buyCoin: 0,
      buyName: "",
      buyModal: 0,
      showPass: [false, false, false],
      passData: ["", "", ""],
      google: false,
      googleInput: "",
      promo: "",
      ask: {
        select: null,
        filter: [false, false],
        id: CEF.id,
        items: [],
        // messages: [
        //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"},
        //     {id: 2, time: 12345, name:"Test Name2", text: "Привет привет привет привет пакет"},
        //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"},
        //     {id: 4, time: 12345, name:"Test Name4", text: "Привет привет привет привет пакет"},
        //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"},
        //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"}
        // ],
        input: "",
      },
      bankNumber: 123456,
      bankPos: { x: 0, y: 0 },
      donateX: false,
      donateX3: false,
      chatSort: [false, false],
      playersType: 0,
      bonus: 265,
      carbonus: 100,
      dailyRewards: {
        currentDay: 1,
        lastRewardDate: 1,
        todayPlayTime: 1,
        resetDate: 1,
        requiredPlayTime: 180,
        isRewardClaimed: false,
        claimedRewards: [],
        canClaimReward: false,
      },
      playTime: 0,
    };
    this.ev = CustomEvent.register(
      "mainmenu:data",
      (
        rp_name: string,
        food: number,
        water: number,
        man: boolean,
        exp: number,
        level: number,
        wanted_level: number,
        wanted_reason: string,
        warns: number,
        bans: number,
        work: JobId,
        fraction: string,
        rank: string,
        house: string,
        business: string,
        players: [number, string, number][],
        hotkeys: {
          [task: string]: number;
        },
        voiceData: [number, number, number],
        menuItems: number,
        ads: {
          title: string;
          text: string;
          pic: string;
          button: string;
          pos: {
            x: number;
            y: number;
            z: number;
          };
        }[],
        vipId: VipId,
        vipEnd: number,
        donate_money: number,
        donateShops: any,
        bankNumber: number,
        bankPos: any,
        donateX,
        donateX3,
        online,
        total,
        bonus,
        alertsData: StorageAlertData,
        carbonus,
        achieve,
        achieveDaily,
        promocodeMy,
        promocodeMyCount,
        promocodeMyRewardGived,
        usersVoice,
        voiceLevel,
        lodDistPlayers,
        lodDistVehs,
        boomboxSound,
        report,
        playTime
      ) => {
        this.setState(
          {
            achieve,
            achieveDaily,
            donateX,
            donateX3,
            bankPos,
            bankNumber,
            donateShops,
            loaded: true,
            rp_name,
            food: Math.floor(food),
            water: Math.floor((water)),
            man,
            exp,
            level,
            wanted_level,
            wanted_reason,
            warns,
            bans,
            work,
            fraction,
            rank,
            house,
            business,
            players,
            hotkeys,
            voiceData,
            menuItems,
            ads,
            vipId,
            vipEnd,
            donate: donate_money,
            online,
            total,
            bonus,
            alertsData,
            carbonus,
            promocodeMy,
            promocodeMyCount,
            promocodeMyRewardGived,
            usersVoice,
            voiceLevel,
            lodDistPlayers,
            lodDistVehs,
            boomboxSound,
            playTime
          },
          () => {
            if (report) {
              this.setPage("ticket");
            }
          }
        );
      }
    );


    this.evDonateCoins = CustomEvent.register(
      "mainmenu:coins",
      (coins: number) => {
        this.setState({ donate: coins });
      }
    );
    this.evCrosshair = CustomEvent.register(
      "mainmenu:setCrosshairSettings",
      (settings: ICrosshairSettings) => {
        if (!settings) return;
        this.setState({
          crosshairSettings: settings,
        });
      }
    );

    this.closeRoulette = this.closeRoulette.bind(this);
  }

  closeRoulette() {
    this.setState({ ...this.state, shopPage: 4 });
  }
  componentDidMount = () => {
    this.adsTime = setInterval(() => {
      if (this.state.page === "profile") this.adsPage(1);
    }, 5000);
  };

  componentWillUnmount() {
    if (this.ev) this.ev.destroy();

    if (this.evAsk) this.evAsk.destroy();
    if (this.evDonateCoins) this.evDonateCoins.destroy();
    if (this.adsTime) clearInterval(this.adsTime);
  }
setPage = async (url: string) => {
  if (url === "rules") {
    CustomEvent.callServer("server::dailyrewards:get").then((data) => {
      if (data) this.setState({ dailyRewards: data });
    });
  }

  if (this.state.page === "ask") CustomEvent.triggerServer("ask:close");
  else if (url === "players" && this.state.page !== "players" && !CEF.test) {
    return CustomEvent.callServer("mainmenu:getOnline").then((players) => {
      this.setState({ playersType: 0, players, page: url });
      CEF.playSound("beep"); // 🔊 sunet la schimbare pagina spre "players"
    });
  }

  this.setState({ ...this.state, page: url });
  CEF.playSound("beep"); // 🔊 sunet la schimbare pagina general

  if (url == "aim") {
    setTimeout(() => {
      CustomEvent.trigger("crosshair:setSettings", this.state.crosshairSettings);
      CustomEvent.trigger("crosshair:enable");
      CustomEvent.trigger("crosshair:rerender");
    }, 15);
  }
};

  // setPage = async (url: string) => {
  //   if (url === "rules") {
  //     CustomEvent.callServer("server::dailyrewards:get").then((data) => {
  //       if (data) this.setState({ dailyRewards: data });
  //     });
  //   }

  //   if (this.state.page === "ask") CustomEvent.triggerServer("ask:close");
  //   else if (url === "players" && this.state.page !== "players" && !CEF.test) {
  //     return CustomEvent.callServer("mainmenu:getOnline").then((players) => {
  //       this.setState({ playersType: 0, players, page: url });
  //     });
  //   }
  //   this.setState({ ...this.state, page: url });
  //   if (url == "aim") {
  //     setTimeout(() => {
  //       CustomEvent.trigger(
  //         "crosshair:setSettings",
  //         this.state.crosshairSettings
  //       );
  //       CustomEvent.trigger("crosshair:enable");
  //       CustomEvent.trigger("crosshair:rerender");
  //     }, 15); // todo: fix
  //   }
  // };
  renderWantedLevel = () => {
    let itms: JSX.Element[] = [];
    for (let id = 1; id <= 5; id++)
      itms.push(
        <img
          key={id}
          style={{ width: '2.222vh', height: '2.222vh', opacity: this.state.wanted_level >= id ? 1 : 0.3 }}
          src={svg["document"]}
          alt=""
        />
      );
    return itms;
  };
  inputPromo = () => {
    // Ввод промо this.state.promo
    CEF.enterPromocode(this.state.promo);
  };

  close(): void {
    CEF.gui.setGui(null);
    CEF.playSound("exitmagazin"); // ruleaza instant
    
  }

  changePassword = () => {
    let old_password = this.state.passData[0]
      .replace(/"/g, "'")
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "");
    let password = this.state.passData[1]
      .replace(/"/g, "'")
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "");
    let password2 = this.state.passData[2]
      .replace(/"/g, "'")
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "");

    if (password.length < 6 || old_password.length < 6)
      return CEF.alert.setAlert(
        "error",
        "Parola trebuie sa aiba cel putin 6 caractere"
      );
    if (password != password2) {
      return CEF.alert.setAlert("error", "Parolele nu coincid");
    }

    CustomEvent.callServer(
      "mainmenu:changePassword",
      old_password,
      password
    ).then((status: boolean) => {
      if (status) {
        this.setState({ ...this.state, passData: ["", "", ""] });
        CEF.alert.setAlert("success", "Parola a fost schimbata cu succes");
      } else {
        CEF.alert.setAlert("error", "Parola veche este incorecta");
      }
    });
  };

  async claimDailyReward(id: number) {
    await CustomEvent.callServer("server:dailyrewards:claim", id).then((data: any) => {
      if (!data) return;

      this.setState({ dailyRewards: data });
    });

    this.setPage("rules");
  }
getAchievCompleteCount() {
  return Object.values(this.state.achieve).filter(v => v[1] === 2).length +
         Object.values(this.state.achieveDaily).filter(v => v[1] === 2).length;
}

getAchievCount() {
  return Object.keys(this.state.achieve).length + Object.keys(this.state.achieveDaily).length;
}
  // getAchievCount() {
  //   return Object.values(this.state.achieve).length;
  // }

  // getAchievCompleteCount() {
  //   return Object.values(this.state.achieve).filter((q) => q[1] === 1).length;
  // }

  renderHotkeys(): JSX.Element {
    if (!this.state.hotkeys) return <></>;

    return (
      <div>
        <div className="umenu-title">Keybinds</div>
        <button
          onClick={() => {
            let k = { ...this.state.hotkeys };
            for (let task in this.state.hotkeys) {
              k[task] = (defaultHotkeys as any)[task];
              CustomEvent.triggerClient(
                "hotkeys:set",
                task,
                (defaultHotkeys as any)[task],
                false
              );
            }
            this.setState({ hotkeyEdit: null, hotkeys: defaultHotkeys });
            CEF.alert.setAlert("success", "Tastele sunt setate");
          }}
        >
          Reseteaza setarile
        </button>
        {/* <div className="umenu-subtitle">Lorem ipsum dolor sit amet</div> */}
        <div className="umenu-content">
          {hotkeyCategories.map((cat) => (
            <>
              <div className="umenu-title">{cat.name}</div>
              {cat.keys.map((el) => this.drawItem(el))}
            </>
          ))}
        </div>
      </div>
    );
  }

  drawItem(task: any) {
    const hotkeyName = getHotkeysName(task);

    // const arr = [
    //   "cuff",
    //   "uncuff",
    //   "megaphone",
    //   "autopilot",
    //   "phoneSlot",
    //   "tabletSlot",
    //   "hidehud",
    //   "battlePass",
    //   "toggleChat",
    //   "cursor",
    // ];

    const buttonsArray = generateHotkeysButtonsArray().filter(
      (hotkey) =>
        hotkey[0] ==
        (this.state.selectedKey && this.state.hotkeyEdit === task
          ? this.state.selectedKey
          : this.state.hotkeys[task])
    );
    const buttonsArray0 = buttonsArray ? buttonsArray[0] : undefined;
    const buttonsArray1 = buttonsArray0 ? buttonsArray0[1] : undefined;

    return (
      <div key={task} className="usermenu__hotkeys__item">
        <div
          className={`usermenu__hotkeys__item__name ${hotkeyName.length > 30
            ? "usermenu__hotkeys__item__name__very-small"
            : hotkeyName.length > 16 || task === "cuff"
              ? "usermenu__hotkeys__item__name__small"
              : ""
            }`}
        >
          {this.state.selectedKey && this.state.hotkeyEdit === task
            ? hotkeyName.replace(/\//g, "/ ")
            : hotkeyName}
        </div>
        <div
          className="usermenu__hotkeys__item__select"
          onClick={() =>
            this.setState({
              ...this.state,
              selectedKey: null,
              hotkeyOpen: this.state.hotkeyOpen === task ? null : task,
            })
          }
        >
          {/* <select
            value={
              this.state.selectedKey && this.state.hotkeyEdit === task
                ? this.state.selectedKey
                : this.state.hotkeys[task]
            }
            onChange={(e) =>
              this.setState({
                selectedKey: e.target.value,
                hotkeyEdit: task,
              })
            }
            onClick={() =>
              this.setState((prevState) => ({
                ...prevState,
                HotKeyArrow: prevState.HotKeyArrow === task ? null : task,
              }))
            }
          >
            {/* {generateHotkeysButtonsArray().map((hotkey) => (
              <option
                className="umenu-hotkey-text"
                key={hotkey[0]}
                value={hotkey[0]}
              >
                Key {hotkey[1].toString()}
              </option>
            ))} */}
          {/* </select> */}
          <div className="umenu-hotkey-text">Key {buttonsArray1}</div>
          <ul
            className={`usermenu__hotkeys__item__list ${this.state.hotkeyOpen === task ? " active" : ""
              }`}
          >
            {generateHotkeysButtonsArray().map((hotkey, index) => (
              <div
                // className="umenu-hotkey-text"
                key={hotkey[0] + index + Math.random()}
                onClick={(e) => {
                  e.stopPropagation();
                  this.setState({
                    ...this.state,
                    selectedKey: hotkey[0],
                    hotkeyEdit: task,
                    hotkeyOpen: null,
                  });
                }}
              >
                Key {hotkey[1].toString()}
              </div>
            ))}
          </ul>
          <img
            src={hotkeyarrow}
            key={task}
            className={
              this.state.hotkeyOpen === task ? "umenu-hotkey-rotate" : ""
            }
            alt=""
          />
        </div>
        {this.state.selectedKey && this.state.hotkeyEdit === task ? (
          <div className="usermenu__hotkeys__item__btns">
            <div
              className="usermenu__hotkeys__item__btn usermenu__hotkeys__item__btn__green"
              onClick={(e) => {
                if (!this.state.selectedKey)
                  return CEF.alert.setAlert(
                    "error",
                    LangString(
                      "components.UserMenu.index.31b6fdbf816d5359f4623d910f7ab77f"
                    )
                  );
                if (this.state.selectedKey == this.state.hotkeys[task])
                  return CEF.alert.setAlert(
                    "error",
                    LangString(
                      "components.UserMenu.index.de42347099dfce2dd3472d63a6a489f9"
                    )
                  );
                let k = this.state.hotkeys;
                k[task] = parseInt(this.state.selectedKey as any);
                this.setState({ hotkeyEdit: null, hotkeys: k });
                CustomEvent.triggerClient(
                  "hotkeys:set",
                  task,
                  parseInt(this.state.selectedKey as any)
                );
              }}
            >
              <img src={svg["check2"]} />
            </div>
            <div
              className="usermenu__hotkeys__item__btn usermenu__hotkeys__item__btn__red"
              onClick={(e) => {
                this.setState({
                  ...this.state,
                  hotkeyEdit: null,
                  selectedKey: null,
                });
              }}
            >
              <img src={svg["cancel2"]} />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  // drawItem(task: any) {
  //   const hotkeyName = getHotkeysName(task);

  //   return (
  //     <div key={task} className="umenu-hitem">
  //       <div
  //         className={`umenu-text ${
  //           hotkeyName.length > 30
  //             ? "umenu-hotkey-text-very-small"
  //             : hotkeyName.length > 16
  //             ? "umenu-hotkey-text-small"
  //             : ""
  //         }`}
  //       >
  //         {hotkeyName}
  //       </div>
  //       <select
  //         value={
  //           this.state.selectedKey && this.state.hotkeyEdit === task
  //             ? this.state.selectedKey
  //             : this.state.hotkeys[task]
  //         }
  //         onChange={(e) =>
  //           this.setState({
  //             selectedKey: e.target.value,
  //             hotkeyEdit: task,
  //           })
  //         }
  //         onClick={() =>
  //           this.setState((prevState) => ({
  //             ...prevState,
  //             HotKeyArrow: prevState.HotKeyArrow === task ? null : task,
  //           }))
  //         }
  //       >
  //         {generateHotkeysButtonsArray().map((hotkey) => (
  //           <option
  //             className="umenu-hotkey-text"
  //             key={hotkey[0]}
  //             value={hotkey[0]}
  //           >
  //             Key {hotkey[1].toString()}
  //           </option>
  //         ))}
  //       </select>
  //       <img
  //         src={hotkeyarrow}
  //         key={task}
  //         className={
  //           this.state.HotKeyArrow === task ? "umenu-hotkey-rotate" : ""
  //         }
  //         alt=""
  //       />
  //     </div>
  //   );
  // }

  drawRule(rule: ruleItem) {
    let n = "";
    let d = "";
    switch (rule[2]) {
      case "ban":
        n = "Бан";
        break;
      case "jail":
        n = "Тюрьма";
        break;
      case "kick":
        n = "Кик";
        break;
      case "mute":
        n = "Блокировка чата";
        break;
      case "warn":
        n = "Предупреждение";
        break;
    }
    switch (rule[3]) {
      case "d":
        d = "Дней";
        break;
      case "m":
        d = "Минут";
        break;
      case "h":
        d = "Часов";
        break;
    }
    return (
      <p key={rule[0]}>
        {rule[0]}. {rule[1]}{" "}
        <strong>
          | {n} на {rule[4]} {d}
        </strong>
      </p>
    );
  }

  getMaxExpLevel = (level: number) => {
    return getMaxExpLevel(level);
  };
  inputPay = (value: number) => {
    this.setState({ shopPay: value });
  };
  pay = () => {
    /** Пополнить счет */
    if (!this.state.shopPay) return;
    CustomEvent.callServer("donate:add", this.state.shopPay).then((link) => {
      if (!link)
        return CEF.alert.setAlert("error", "Донаты временно отключены");
      CustomEvent.triggerClient("donate:add", link);
    });
  };
  buyVip = (id: string) => {
    /** Купить vip */
    this.setState({ ...this.state, buyVip: 0 });
    console.log("buy vip ", id, this.state.buyVipTime);
    CustomEvent.triggerServer("mainmenu:buyVip", id, this.state.buyVipTime);
  };
  buyShop = (id: number, value?: number | string) => {
    console.log(id, value);
    /** купить донат услуги */
    CustomEvent.triggerServer("mainmenu:buyShop", id, value);
  };
  buyPacket = (id: number) => {
    console.log(id);
    /** купить пакет услун */
    CustomEvent.triggerServer("mainmenu:buyPacket", id);
  };
  selectVip = (id: number) => {
    this.setState({ ...this.state, buyVip: id, buyVipTime: 1 });
  };

  adsPage = (page: number) => {
    let _newpage = this.state.curAd + page;
    if (_newpage >= this.state.ads.length) _newpage = 0;
    if (_newpage < 0) _newpage = this.state.ads.length - 1;
    this.setState({ ...this.state, curAd: _newpage });
  };

  get currentAsk() {
    if (!this.state.ask.select) return null;
    return this.state.ask.items.find(
      (item) => item.id === this.state.ask.select
    );
  }

  private convertTime = (time: number) => {
    const hours = time / 60;
    const minutes = time % 60;

    return `${hours < 10 ? "0" : ""}${parseInt(hours.toString())}H ${minutes < 10 ? "0" : ""}${minutes.toFixed(2)}M`;
  }

  selectAsk = (id: string) => {
    /* Добавить получение сообщений */
    this.setState({ ask: { ...this.state.ask, select: id } });
  };

  setHouseWaypoint = () => {
    if (!this.state.house) return;
    CustomEvent.triggerServer("usermenu:setHouseWaypoint");
  };

  setBusinessWaypoint = () => {
    if (!this.state.business) return;
    CustomEvent.triggerServer("usermenu:setBusinessWaypoint");
  };

  render() {
    if (!this.state.loaded) return <></>;
    if (!this.state.page) return <></>;
    return (
      <>
        <div className="umenu-container-box">
          <div className="umenu-box">
            <div className="umenu-menu">
              {this.state.page !== "ticket" && (
                <>
                  <div className="umenu-header">
                    <div className="umenu-title">
                      MENIU <span>PERSONAJ</span>
                    </div>
                    {/*<div className="umenu-subtitle">
                    Aici gasesti toate informatiile despre caracter
                    </div>*/}
                  </div>
                  <div className="umenu-close">
                    <div className="umenu-text">Exit</div>
                    <div className="umenu-icon" onClick={this.close}>
                      <img src={svg["close"]} alt="" />
                    </div>
                  </div>
                </>
              )}

              {this.state.page === "profile" && (
                <>
                  <div className="umenu-profile">
                    <div className="umenu-character-info">
                      <div className="umenu-nickname">
                        <img src={svg["user"]} alt="" />
                        <div className="umenu-title"> {this.state.rp_name}</div>
                        <div className="umenu-subtitle umenu-nickname-subtitle">
                          Static ID: #{CEF.id}
                        </div>
                      </div>
                      <div className="umenu-info">
                        <div className="umenu-title">Informatii caracter</div>
                        <div className="umenu-citems">
                          <div className="umenu-citem">
                            <Circle
                              percent={
                                (this.state.exp /
                                  this.getMaxExpLevel(this.state.level)) *
                                100
                              }
                              strokeWidth={9}
                              trailWidth={9}
                              strokeColor="#ffffff"
                              trailColor="rgba(196, 196, 196, 0.2)"
                            />
                            <div className="umenu-level">
                              {this.state.level}{" "}
                            </div>
                            <div className="umenu-exp">
                              {this.state.exp}/
                              {this.getMaxExpLevel(this.state.level)}{" "}
                            </div>
                            <div className="umenu-text">Level</div>
                          </div>
                          <div className="umenu-citem">
                            <svg
                              className="umenu-main-ring"
                              width="61.983566"
                              height="51.943298"
                              viewBox="0 0 61.9836 51.9433"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                id="Ellipse 1"
                                d="M7.48 51.2C2.49 45.41 1.52e-5 38.2 1.52e-5 30.99C-0.01 22.43 3.46 14.68 9.07 9.07C15.11 3.02 23.05 0 30.99 0C39.54 -0.01 47.29 3.46 52.9 9.07C58.95 15.11 61.98 23.05 61.98 30.99C61.99 38.7 59.16 45.77 54.49 51.2C53.65 52.17 52.17 52.17 51.26 51.26C50.35 50.35 50.36 48.89 51.19 47.91C55.28 43.03 57.33 37.01 57.33 30.99C57.34 23.72 54.38 17.13 49.61 12.36C44.48 7.21 37.73 4.64 30.99 4.64C23.72 4.64 17.13 7.59 12.36 12.36C7.21 17.5 4.64 24.24 4.64 30.99C4.64 37.42 6.95 43.32 10.79 47.9C11.61 48.89 11.62 50.35 10.71 51.26C9.8 52.17 8.32 52.18 7.48 51.2Z"
                                fill="#FFFFFF"
                                fill-opacity="0.1"
                                fill-rule="evenodd"
                              />
                            </svg>
                            <svg
                              className="umenu-progress-ring"
                              width="95.228012"
                              height="85.187744"
                              viewBox="0 0 95.228 85.1877"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <filter
                                  id="filter_331_47_dd"
                                  x="0"
                                  y="0"
                                  width="95.228"
                                  height="85.188"
                                  filterUnits="userSpaceOnUse"
                                  color-interpolation-filters="sRGB"
                                >
                                  <feFlood
                                    flood-opacity="0"
                                    result="BackgroundImageFix"
                                  />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                  />
                                  <feOffset dx="0" dy="0" />
                                  <feGaussianBlur stdDeviation="5.54074" />
                                  <feComposite
                                    in2="hardAlpha"
                                    operator="out"
                                    k2="-1"
                                    k3="1"
                                  />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0.788 0 0 0 0 0.529 0 0 0 0 0.071 0 0 0 1 0"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect_dropShadow_1"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect_dropShadow_1"
                                    result="shape"
                                  />
                                </filter>
                              </defs>
                              <g filter="url(#filter_331_47_dd)">
                                <circle
                                  cx="47.61"
                                  cy="47.61"
                                  r="25"
                                  stroke="#C98712"
                                  stroke-width="5"
                                  fill="none"
                                  stroke-dasharray={`${(Math.floor(this.state.food / 10) / 100) * 110}, 157`}
                                  stroke-linecap="round"
                                  transform="rotate(140 47.61 47.61)"
                                />
                              </g>
                            </svg>
                            <img src={svg["food"]} alt="" />
                            <div className="umenu-percent">
                              {Math.floor(this.state.food / 10)}%
                            </div>

                            <div className="umenu-text umenu-citem-text">
                              Food
                            </div>
                          </div>
                          <div className="umenu-citem">
                            <svg
                              className="umenu-main-ring"
                              width="61.983566"
                              height="51.943298"
                              viewBox="0 0 61.9836 51.9433"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                id="Ellipse 1"
                                d="M7.48 51.2C2.49 45.41 1.52e-5 38.2 1.52e-5 30.99C-0.01 22.43 3.46 14.68 9.07 9.07C15.11 3.02 23.05 0 30.99 0C39.54 -0.01 47.29 3.46 52.9 9.07C58.95 15.11 61.98 23.05 61.98 30.99C61.99 38.7 59.16 45.77 54.49 51.2C53.65 52.17 52.17 52.17 51.26 51.26C50.35 50.35 50.36 48.89 51.19 47.91C55.28 43.03 57.33 37.01 57.33 30.99C57.34 23.72 54.38 17.13 49.61 12.36C44.48 7.21 37.73 4.64 30.99 4.64C23.72 4.64 17.13 7.59 12.36 12.36C7.21 17.5 4.64 24.24 4.64 30.99C4.64 37.42 6.95 43.32 10.79 47.9C11.61 48.89 11.62 50.35 10.71 51.26C9.8 52.17 8.32 52.18 7.48 51.2Z"
                                fill="#FFFFFF"
                                fill-opacity="0.1"
                                fill-rule="evenodd"
                              />
                            </svg>
                            <svg
                              className="umenu-progress-ring"
                              width="95.228012"
                              height="85.187744"
                              viewBox="0 0 95.228 85.1877"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <filter
                                  id="filter_331_47_water"
                                  x="0"
                                  y="0"
                                  width="95.228"
                                  height="85.188"
                                  filterUnits="userSpaceOnUse"
                                  color-interpolation-filters="sRGB"
                                >
                                  <feFlood
                                    flood-opacity="0"
                                    result="BackgroundImageFix"
                                  />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                  />
                                  <feOffset dx="0" dy="0" />
                                  <feGaussianBlur stdDeviation="5.54074" />
                                  <feComposite
                                    in2="hardAlpha"
                                    operator="out"
                                    k2="-1"
                                    k3="1"
                                  />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0.063 0 0 0 0 0.431 0 0 0 0 0.890 0 0 0 1 0"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect_dropShadow_1"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect_dropShadow_1"
                                    result="shape"
                                  />
                                </filter>
                              </defs>
                              <g filter="url(#filter_331_47_water)">
                                <circle
                                  cx="47.61"
                                  cy="47.61"
                                  r="25"
                                  stroke="#106EE3"
                                  stroke-width="5"
                                  fill="none"
                                  stroke-dasharray={`${(Math.floor(this.state.water / 10) / 100) * 110}, 157`}
                                  stroke-linecap="round"
                                  transform="rotate(140 47.61 47.61)"
                                />
                              </g>
                            </svg>
                            <img className="umenu-water-icon" src={svg["water"]} alt="" />
                            <div className="umenu-percent umenu-percent-water">
                              {Math.floor(this.state.water / 10)}%
                            </div>
                            <div className="umenu-text umenu-citem-water">
                              Apa
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="umenu-categories">
                        <div className="umenu-item">
                          <div className="umenu-text">Ore jucate</div>
                          <div className="umenu-value">{this.convertTime(this.state.playTime)}</div>
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-text">Gen</div>
                          <div className="umenu-value">
                          {this.state.man === true ? " Barbat" : " Femeie"}
                          </div>
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-text">Caziere</div>
                          <div className="umenu-value">
                            {this.renderWantedLevel()}
                          </div>
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-text">VIP</div>
                          <div className="umenu-value">
                            {" "}
                            {this.state.vipId &&
                              getVipConfig(this.state.vipId) &&
                              systemUtil.timestamp < this.state.vipEnd &&
                              getVipConfig(this.state.vipId) ? (
                              <>{getVipConfig(this.state.vipId).name}</>
                            ) : (
                              <>Fara VIP</>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="umenu-bankacc">
                        <div className="umenu-title">Cont bancar</div>
                        <div className="umenu-box">
                          <img src={png["bank-account"]} alt="" />
                          <div className="umenu-title">
                            #{this.state.bankNumber}
                          </div>
                          <div className="umenu-text">$ {CEF.user.bank}</div>
                          <div
                            className="umenu-icon"
                            onClick={() => {
                              CEF.setGPS(
                                this.state.bankPos.x,
                                this.state.bankPos.y
                              );
                            }}
                          >
                            <img src={svg["position"]} alt="" />
                          </div>
                        </div>
                      </div>
                      <div className="umenu-bonus">
                        <div className="umenu-title">BONUS</div>
                        <div className="umenu-box">
                          <div className="umenu-icon">
                            <img src={svg["gift"]} alt="" />
                          </div>
                          <div className="umenu-text">
                            Joaca <span>{PLAYTIME_TIME} ore</span> si primeste {" "}
                            <span>
                              {" "}
                              {PLAYTIME_TYPE === "donate" ? "" : `$`}
                              {systemUtil.numberFormat(PLAYTIME_MONEY)}{" "}
                              {PLAYTIME_TYPE === "donate" ? "MDc" : ``}{" "}
                            </span>
                            {/*<span>
                            {PLAYTIME_TYPE === "donate" ? (
                              <>
                                <img
                                  src={coins}
                                  width={13}
                                  height={13}
                                  style={{ verticalAlign: "middle", marginRight: "4px" }}
                                />
                                {systemUtil.numberFormat(PLAYTIME_MONEY)}
                              </>
                            ) : (
                              <>${systemUtil.numberFormat(PLAYTIME_MONEY)}</>
                            )}
                          </span>*/}
                          </div>
                          <div
                            className={`umenu-timer ${this.state.bonus >= PLAYTIME_TIME * 60
                              ? "accepted"
                              : ""
                              }`}
                          >
                            {this.state.bonus >= PLAYTIME_TIME * 60
                              ? "accepted"
                              : system.secondsToString(
                                PLAYTIME_TIME * 60 - this.state.bonus
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="umenu-property">
                      <div className="umenu-title">Proprietati</div>
                      <div className="umenu-line"></div>
                      <div className="umenu-pitems">
                        <div className="umenu-item">
                          <div className="umenu-icon">
                            <img src={svg["house"]} alt="" />
                          </div>
                          <div className="umenu-title">Loc de resedinta</div>
                          <img src={ppng["property"]} alt="" />
                          <div className="umenu-subtitle">
                            <img src={svg["position"]} alt="" />
                            {this.state.house || "Nu ai casa"}
                          </div>
                          <button onClick={() => this.setHouseWaypoint()}>
                            <img src={svg["position-black"]} alt="" />
                            <div className="umenu-text">  Seteaza o ruta</div>
                          </button>
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-icon">
                            <img src={svg["business"]} alt="" />
                          </div>
                          <div className="umenu-title">Afacerea ta</div>
                          <img
                            src={ppng["business"]}
                            className="umenu-pitem-business"
                            alt=""
                          />
                          <div className="umenu-subtitle">
                            {" "}
                            {this.state.business || "Nu ai afacere"}
                          </div>
                          <button onClick={() => this.setBusinessWaypoint()}>
                            <img src={svg["position-black"]} alt="" />
                            <div className="umenu-text">  Seteaza o ruta</div>
                          </button>
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-icon">
                            <img src={svg["work"]} alt="" />
                          </div>
                          <div className="umenu-title">Loc de munca</div>
                          <img
                            src={ppng["work"]}
                            className="umenu-pitem-work"
                            alt=""
                          />
                          <div className="umenu-subtitle">
                            {" "}
                            {this.state.work && getJobData(this.state.work)
                              ? getJobData(this.state.work).name
                              : "Nu ai un loc de munca"}
                          </div>
                          <button
                            onClick={() =>
                              this.setState({ ...this.state, JobPage: 1 })
                            }
                          >
                            <img
                              className="umenu-search-img"
                              src={svg["search"]}
                              alt=""
                            />
                            <div className="umenu-text"> Cauta un job</div>
                          </button>
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-icon">
                            <img src={svg["organization"]} alt="" />
                          </div>
                          <div className="umenu-title">Organizatie</div>
                          <img
                            src={ppng["organization"]}
                            className="umenu-pitem-org"
                            alt=""
                          />
                          <div className="umenu-subtitle">
                            {this.state.fraction ||
                              "Nu faci parte dintr-o organizatie"}
                          </div>
                          <div className="umenu-post">
                            Post{" "}
                            <span>
                              {this.state.rank ? `(${this.state.rank})` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="umenu-verctors-slider">
                      {this.state.ads.map((data, id) => {
                        return (
                          <div
                            className="umenu-advert"
                            key={id}
                            style={{
                              position: "absolute",
                              left:
                                id !== this.state.curAd
                                  ? `calc(${(id - this.state.curAd) * 100}%)`
                                  : "0",
                            }}
                          >
                            <div className="umenu-bg"></div>
                            <div className="umenu-title">INFORMATII</div>
                            <div className="umenu-subtitle"> {data.title}</div>
                            <div className="umenu-desc">{data.text}</div>
                            <div className="umenu-car">
                              <img src={ppng["car"]} alt="" />
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                CEF.setGPS(data.pos.x, data.pos.y);
                              }}
                            >
                              {" "}
                              {data.button}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="umenu-vectors">
                      <div
                        className="umenu-item"
                        onClick={() => this.adsPage(-1)}
                      >
                        <img src={svg["left-vector"]} alt="" />
                      </div>
                      <div
                        className="umenu-item"
                        onClick={() => this.adsPage(1)}
                      >
                        <img src={svg["left-vector"]} alt="" />
                      </div>
                    </div>
                    {this.state.JobPage === 1 && (
                      <div className="umenu-work-list">
                        <div className="umenu-box">
                          <div className="umenu-title">
                            LISTA <span>DE JOBURI</span>
                          </div>
                         <div className="umenu-text">
                            
                          </div> 

                          <div className="umenu-vacancy">
                            {/* {jobsList.map((item, index) => {
                              return (
                                <div
                                  className={`umenu-item ${this.state.selectJob === index
                                    ? "umenu-worklist-active"
                                    : ""
                                    }`}
                                  key={`job` + index}
                                  onClick={() =>
                                    this.setState({ selectJob: index })
                                  }
                                >
                                  <div className="umenu-title">{item.name}</div>
                                  <div className="umenu-text">{item.desc}</div>
                                </div>
                              );
                            })} */}
                            {JOBS_ADVANCED_LIST.map((item, index) => {
                              return (
                                <div
                                  className={`umenu-item ${this.state.selectJob === index + 1000
                                    ? "umenu-worklist-active"
                                    : ""
                                    }`}
                                  key={`jobadvanced` + index}
                                  onClick={() =>
                                    this.setState({ selectJob: index + 1000 })
                                  }
                                >
                                  <div className="umenu-title">{item.name}</div>
                                  <div className="umenu-text">{item.desc}</div>
                                </div>
                              );
                            })}
                          </div>
                          {this.state.selectJob >= 1000 && (
                            <div className="umenu-content">
                              <div className="umenu-title">
                                {" "}
                                {
                                  JOBS_ADVANCED_LIST[
                                    this.state.selectJob - 1000
                                  ].name
                                }
                                <div
                                  className="umenu-icon"
                                  onClick={() => {
                                    CEF.setGPS(
                                      JOBS_ADVANCED_LIST[
                                        this.state.selectJob - 1000
                                      ].pos.x,
                                      JOBS_ADVANCED_LIST[
                                        this.state.selectJob - 1000
                                      ].pos.y
                                    );
                                  }}
                                >
                                  <img src={svg["position"]} alt="" />
                                </div>
                              </div>
                              <div
                                className="umenu-close"
                                onClick={() => {
                                  console.log("test");
                                  this.setState({
                                    ...this.state,
                                    JobPage: 0,
                                  });
                                }}
                              >
                                <img src={svg["close"]} alt="" />
                              </div>
                              <div className="umenu-description">
                                {
                                  JOBS_ADVANCED_LIST[
                                    this.state.selectJob - 1000
                                  ].descFull
                                }
                              </div>
                            </div>
                          )}
                          {this.state.selectJob != 1000 &&
                            jobsList[this.state.selectJob] && (
                              <div className="umenu-content">
                                <div className="umenu-title">
                                  {" "}
                                  {jobsList[this.state.selectJob].name}
                                  <div
                                    className="umenu-icon"
                                    onClick={() => {
                                      CEF.setGPS(
                                        jobsList[this.state.selectJob].pos.x,
                                        jobsList[this.state.selectJob].pos.y,
                                        jobsList[this.state.selectJob].pos.z
                                      );
                                    }}
                                  >
                                    <img src={svg["position"]} alt="" />
                                  </div>
                                </div>
                                <div
                                  className="umenu-close"
                                  onClick={() => {
                                    console.log("test");
                                    this.setState({
                                      ...this.state,
                                      JobPage: 0,
                                    });
                                  }}
                                >
                                  <img src={svg["close"]} alt="" />
                                </div>
                                {jobsList[this.state.selectJob].tasks.length > 0 && (
                                  <div className="umenu-description">
                                    <p><strong>{jobsList[this.state.selectJob].tasks[0].name}</strong></p>
                                    <p>{jobsList[this.state.selectJob].tasks[0].desc}</p>
                                  </div>
                                )}
                                {/* {jobsList[this.state.selectJob].tasks.map(
                                  (data, index) => {
                                    return (
                                       <div className="umenu-description">
                                       Alegeti din lista jobul dorit 
                                       pentru a vedea mai multe informatii
                                      </div>
                                    );
                                  }
                                )} */}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              {this.state.page === "achiev" ? (
                <SocketSync
                  path={"achiev"}
                  data={(d) => {
                    const q = JSON.parse(d as any);
                    this.setState({ achieve: q[1], achieveDaily: q[0] });
                  }}
                >
                  <div className="umenu-advance">
                    <div className="umenu-progress">
                      <div className="umenu-text">
                          Realizari<span>progress</span>
                      </div>
                      <Circle
                        percent={
                          this.getAchievCount() > 0
                            ? Math.min(
                                (Number(this.getAchievCompleteCount()) / Number(this.getAchievCount())) * 100,
                                100
                              )
                            : 0
                        }
                        strokeWidth={7}
                        trailWidth={7}
                        strokeColor="#187e0b"
                        trailColor="rgba(196, 196, 196, 0.2)"
                      />
                      {/* <Circle
                        percent={
                          this.getAchievCompleteCount() <= 0 ? 0 :
                          this.getAchievCompleteCount() / this.getAchievCount() * 100
                          // this.getAchievCount() > 0
                          //   ? (this.getAchievCount() / 100) *
                          //   this.getAchievCompleteCount()
                          //   : 0
                        }
                        strokeWidth={7}
                        trailWidth={7}
                        strokeColor="#187e0b"
                        trailColor="rgba(196, 196, 196, 0.2)"
                      /> */}
                      <div className="umenu-pamount">
                        {this.getAchievCompleteCount()}
                        <span>/{this.getAchievCount()}</span>
                      </div>
                    </div>
                    <div className="umenu-aitems">
                      {Object.keys(this.state.achieveDaily).map(
                        (key: UserAchievmentKey, i) => {
                          const cfg = getTempAchievConfig(key);
                          if (!cfg) return <></>;
                          const val = this.state.achieveDaily[key];
                          return (
                            <div
                              className={`umenu-aitem ${val[1]
                                ? val[1] === 1
                                  ? "umenu-aitem-get"
                                  : ""
                                : ""
                                }`}
                              key={`achieve_d_${i}`}
                            >
                              <div
                                className={`umenu-daily ${val[1]
                                  ? val[1] === 1
                                    ? "umenu-daily-get"
                                    : ""
                                  : ""
                                  }`}
                              >
                                Daily
                              </div>
                              <img
                                src={
                                  achievementsLogo[cfg.key] ||
                                  achievementsLogo["img-achieve"]
                                }
                                alt=""
                              />

                              <div className="umenu-title">{cfg.name}</div>
                              <div className="umenu-subtitle">{cfg.desc}</div>
                              <div className="umenu-proggress">
                                <div
                                  className={`umenu-bar ${val[1]
                                    ? val[1] === 1
                                      ? "umenu-bar-get"
                                      : ""
                                    : ""
                                    }`}
                                >
                                  <div
                                    className={`umenu-active ${val[1]
                                      ? val[1] === 1
                                        ? "umenu-bar-get"
                                        : ""
                                      : ""
                                      }`}
                                    style={{
                                      width: `${(val[0] / cfg.max) * 100}%`,
                                    }}
                                  ></div>
                                  <div className="umenu-text">
                                    {system.numberFormat(val[0])}
                                  </div>
                                  <div className="umenu-text umenu-text-right">
                                    {system.numberFormat(cfg.max)}
                                  </div>
                                </div>
                              </div>
                              {val[1] !== 1 ? (
                                cfg.reward && (
                                  <div className="umenu-payment">
                                    {cfg.reward.money && (
                                      <button>
                                        + $
                                        {system.numberFormat(cfg.reward.money)}
                                      </button>
                                    )}
                                    {cfg.reward.exp && (
                                      <button>+ {cfg.reward.exp} EXP</button>
                                    )}
                                    {cfg.reward.item
                                      ? cfg.reward.item.map((item, rid) => {
                                        return (
                                          <TooltipClass
                                            text={getBaseItemNameById(item)}
                                          >
                                            <div
                                              className="umenu__achieve__item"
                                              key={`ach_d_${i}_${rid}`}
                                            >
                                              <img
                                                src={
                                                  iconsItems[`Item_${item}`]
                                                }
                                                alt=""
                                              />
                                            </div>
                                          </TooltipClass>
                                        );
                                      })
                                      : ""}
                                  </div>
                                )
                              ) : (
                                <button
                                  onClick={(e) => {
                                    if (val[1] !== 1) return;
                                    e.preventDefault();
                                    this.state.achieveDaily[key][1] = 2;
                                    this.setState({
                                      achieveDaily: this.state.achieveDaily,
                                    });
                                    CustomEvent.triggerServer("achieveD", key);
                                  }}
                                >
                                  Get Gift
                                </button>
                              )}
                            </div>
                          );
                        }
                      )}

                      {/* {Array(50)
                        .fill(null)
                        .map((_, i) => (
                          <div className="umenu-aitem umenu-aitem-get" key={i}>
                            <div className="umenu-daily">Daily</div>
                            <img src={achievementsLogo["img-achieve"]} alt="" />
                            <div className="umenu-title">Test</div>
                            <div className="umenu-subtitle">
                              TESTETESTSTSTSTSTSSTSTTETTETSTETSTETEST
                            </div>
                            <div className="umenu-proggress">
                              <div className="umenu-bar">
                                <div
                                  className="umenu-active"
                                  style={{
                                    width: `4.50%`, // Динамическое изменение ширины
                                  }}
                                ></div>
                                <div className="umenu-text">0</div>
                                <div className="umenu-text umenu-text-right">
                                  2000
                                </div>
                              </div>
                            </div>
                            <div className="umenu-payment">
                              {/* <button>+ $50 000</button> */}
                      {/* <button>+ 50 EXP</button> */}
                      {/* </div>
                            <button>Get gift</button>
                          </div>
                        ))} */}

                      {Object.keys(this.state.achieve).map(
                        (key: UserAchievmentKey, i) => {
                          const cfg = getAchievConfig(key);
                          if (!cfg) return <></>;
                          const val = this.state.achieve[key];
                          return (
                            <div
                              className={`umenu-aitem ${val[1]
                                ? val[1] === 1
                                  ? "umenu-aitem-get"
                                  : ""
                                : ""
                                }`}
                              key={`achieve_d_${i}`}
                            >
                              <img
                                src={
                                  achievementsLogo[cfg.key] ||
                                  achievementsLogo["img-achieve"]
                                }
                                alt=""
                              />
                              <div className="umenu-title">{cfg.name}</div>
                              <div className="umenu-subtitle">{cfg.desc}</div>
                              <div className="umenu-proggress">
                                <div
                                  className={`umenu-bar ${val[1]
                                    ? val[1] === 1
                                      ? "umenu-bar-get"
                                      : ""
                                    : ""
                                    }`}
                                >
                                  <div
                                    className={`umenu-active ${val[1]
                                      ? val[1] === 1
                                        ? "umenu-bar-get"
                                        : ""
                                      : ""
                                      }`}
                                    style={{
                                      width: `${(val[0] / cfg.max) * 100}%`,
                                    }}
                                  ></div>
                                  <div className="umenu-text">
                                    {system.numberFormat(val[0])}
                                  </div>
                                  <div className="umenu-text umenu-text-right">
                                    {system.numberFormat(cfg.max)}
                                  </div>
                                </div>
                              </div>
                              {val[1] !== 1 ? (
                                cfg.reward && (
                                  <div className="umenu-payment">
                                    {cfg.reward.money && (
                                      <button>
                                        + $
                                        {system.numberFormat(cfg.reward.money)}
                                      </button>
                                    )}
                                    {cfg.reward.exp && (
                                      <button>+ {cfg.reward.exp} EXP</button>
                                    )}

                                    {cfg.reward.item
                                      ? cfg.reward.item.map((item, rid) => {
                                        return (
                                          <TooltipClass
                                            text={getBaseItemNameById(item)}
                                          >
                                            <div
                                              className="umenu__achieve__item"
                                              key={`ach_d_${i}_${rid}`}
                                            >
                                              <img
                                                src={
                                                  iconsItems[`Item_${item}`]
                                                }
                                                alt=""
                                              />
                                            </div>
                                          </TooltipClass>
                                        );
                                      })
                                      : ""}
                                  </div>
                                )
                              ) : (
                                <button
                                  onClick={(e) => {
                                    if (val[1] !== 1) return;
                                    e.preventDefault();
                                    this.state.achieve[key][1] = 2;
                                    this.setState({
                                      achieve: this.state.achieve,
                                    });
                                    CustomEvent.triggerServer("achieve", key);
                                  }}
                                >
                                  Get Gift
                                </button>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </SocketSync>
              ) : (
                <></>
              )}

              {this.state.page === "players" && (
                <div className="umenu-players">
                  <div className="umenu-title">JUCATORI</div>
                  <div className="umenu-subtitle">
                    informatiile despre jucatori
                  </div>
                  <div className="umenu-categories">
                    <div
                      className={`umenu-item ${this.state.playersType === 0
                        ? `umenu-players-item-selected`
                        : ``
                        }`}
                      onClick={() => {
                        if (this.state.playersType === 0) return;
                        CustomEvent.callServer("mainmenu:getOnline").then(
                          (players) => {
                            this.setState({
                              playersType: 0,
                              players,
                            });
                          }
                        );
                      }}
                    >
                      Jucatori
                    </div>
                    <div
                      className={`umenu-item ${this.state.playersType === 1
                        ? `umenu-players-item-selected`
                        : ``
                        }`}
                      onClick={() => {
                        if (this.state.playersType === 1) return;
                        CustomEvent.callServer("mainmenu:getRich").then(
                          (players) => {
                            this.setState({
                              playersType: 1,
                              players,
                            });
                          }
                        );
                      }}
                    >
                      Forbes
                    </div>
                    <div
                      className={`umenu-item ${this.state.playersType === 2
                        ? `umenu-players-item-selected`
                        : ``
                        }`}
                      onClick={() => {
                        if (this.state.playersType === 2) return;
                        CustomEvent.callServer("mainmenu:getActive").then(
                          (players) => {
                            this.setState({
                              playersType: 2,
                              players,
                            });
                          }
                        );
                      }}
                    >
                      Top activi
                    </div>
                    <div
                      className={`umenu-item ${this.state.playersType === 3
                        ? `umenu-players-item-selected`
                        : ``
                        }`}
                      onClick={() => {
                        if (this.state.playersType === 3) return;
                        CustomEvent.callServer("mainmenu:getBanlist").then(
                          (players) => {
                            this.setState({
                              playersType: 3,
                              players,
                            });
                          }
                        );
                      }}
                    >
                      Ban List
                    </div>
                    <div
                      className={`umenu-item ${this.state.playersType === 4
                        ? `umenu-players-item-selected`
                        : ``
                        }`}
                      onClick={() => {
                        if (this.state.playersType === 4) return;
                        CustomEvent.callServer("mainmenu:getFamilies").then(
                          (players) => {
                            this.setState({
                              playersType: 4,
                              players,
                            });
                          }
                        );
                      }}
                    >
                      Familii
                    </div>
                  </div>
                  <div className="umenu-list">
                    {this.state.players
                      ? this.state.players.map((item) => {
                        return (
                          <div className="umenu-item" key={item[0]}>
                            <div className="umenu-number">{item[0]}</div>
                            <div className="umenu-text">
                              {item[1]} 
                            </div>
                            {/* {this.state.playersType !== 0 &&
                                this.state.playersType !== 3 && (
                                  <div className="umenu-value">$ {item[2]}</div>
                                )} */}
                          </div>
                        );
                      })
                      : null}
                  </div>
                  <div className="umenu-info">
                    <div className="umenu-box">
                      <div className="umenu-number">{this.state.online}</div>
                      <div className="umenu-text">Online</div>
                    </div>
                    <div className="umenu-box">
                      <div className="umenu-number">{this.state.total}</div>
                      <div className="umenu-text">Inregistrati</div>
                    </div>
                  </div>
                </div>
              )}

              {this.state.page === "vip" && (
                <div className="umenu-shop">
                  <div className="umenu-title">SHOP</div>
                  <div className="umenu-subtitle">
                   Aici puteti obtine anumite beneficii
                  </div>
                  <div className="umenu-balance">
                    Sold:&nbsp;
                    <img
                      src={coins}
                      width={18}
                      height={18}
                      style={{ verticalAlign: "middle", marginRight: "6px" }}
                    />
                    {systemUtil.numberFormat(this.state.donate)}
                  </div>
                  {/* <div className="umenu-balance">
                      Sold: {systemUtil.numberFormat(this.state.donate)}{" "}
                    <span>&nbsp;SC</span>
                  </div> */}
                  <div className="umenu-categories">
                    <button
                      className={
                        this.state.shopPage === 0 ? "umenu-shop-active" : ""
                      }
                      onClick={() =>
                        this.setState({ ...this.state, shopPage: 0 })
                      }
                    >
                      General
                    </button>
                    <button
                      className={
                        this.state.shopPage === 1 ? "umenu-shop-active" : ""
                      }
                      onClick={() =>
                        this.setState({ ...this.state, shopPage: 1 })
                      }
                    >
                      VIP
                    </button>
                    <button
                      className={
                        this.state.shopPage === 2 ? "umenu-shop-active" : ""
                      }
                      onClick={() =>
                        this.setState({ ...this.state, shopPage: 2 })
                      }
                    >
                      Altele
                    </button>
                    <button
                      className={
                        this.state.shopPage === 3 ? "umenu-shop-active" : ""
                      }
                      onClick={() =>
                        this.setState({ ...this.state, shopPage: 3 })
                      }
                    >
                      Oferte profitabile
                    </button>
                    <button
                      className={
                        this.state.shopPage === 4 ? "umenu-shop-active" : ""
                      }
                      onClick={() =>
                        this.setState({ ...this.state, shopPage: 4 })
                      }
                    >
                      Roulette
                    </button>
                    <button
                      className={
                        this.state.shopPage === 5 ? "umenu-shop-active" : ""
                      }
                      onClick={() =>
                        this.setState({ ...this.state, shopPage: 5 })
                      }
                    >
                      Vehicule
                    </button>
                  </div>
                  {/* <div className="umenu-exxchange">
                    <div className="umenu-title">Curs de schimb</div>
                    <div className="umenu-box">
                      10.000 $ = {COINS_FOR_ONE_ROUBLE} <span>&nbsp;SC</span>
                      &nbsp;=&nbsp;
                      <span className="umenu-green-shop">&nbsp;$</span>&nbsp;100
                    </div>
                    <div className="umenu-text">
                      To top up your account balance, You need to go to our
                      website: stage-rp.com
                    </div>
                  </div> */}
                  <div className="umenu-exxchange">
                    <div className="umenu-title">Curs de schimb</div>
                    <div className="umenu-box">
                      {/* 1.000.000 $ = 100 <span>&nbsp;SC</span> */}
                      {/* 3.500&nbsp;<span className="umenu-green-shop">$&nbsp;</span> = 1&nbsp;<span>SC</span> */}
                      350&nbsp;<span className="umenu-green-shop">$&nbsp;</span> = 1&nbsp;
                      <img
                        src={coins}
                        width={16}
                        height={16}
                        style={{ verticalAlign: "middle", marginLeft: "4px" }}
                      />
                      {/* &nbsp;=&nbsp; */}
                      {/* <span className="umenu-green-shop">&nbsp;$</span>&nbsp;1.000.000 */}
                    </div>
                    <div className="umenu-text">
                      Pentru a adauga bani în cont, creati un ticket
                    </div>
                  </div>
                  {this.state.shopPage === 0 && (
                    <div className="umenu-general">
                      {Donate_Items.map((item, index) => {
                        return (
                          <div className="umenu-item" key={index}>
                            <div className="umenu-title"> {item.name}</div>
                            <div className="umenu-subtitle">{item.desc}</div>


                            <div className="umenu-price">
                              {item.id == 4 ? 1 : item.price}{" "}
                              <span>&nbsp;Coins</span>
                            </div>
                            <button
                              onClick={() => {
                                if ([4, 1, 5].includes(item.id)) {
                                  return this.setState({
                                    ...this.state,
                                    buyModal: item.id,
                                    buyCoin: 0,
                                    buyName: "",
                                  });
                                }
                                this.buyShop(item.id);
                              }}
                            >
                              Buy
                            </button>
                            <img src={png[item.pic]} alt="" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {this.state.buyModal > 0 && (
                    <div className="umenu-buyvip">
                      <div className="umenu-buyvipm">
                        {this.state.buyModal === 4 && (
                          <div className="umenu-title">
                            Schimba{" "}
                            <img
                              src={coins}
                              width={16}
                              height={16}
                              style={{ verticalAlign: "middle", margin: "0 4px" }}
                            />
                            în bani
                          </div>

                          // <div className="umenu-title">
                          //   Schimba SC în bani
                          // </div>
                        )}

                        {this.state.buyModal === 1 && (
                          <div className="umenu-title">Schimba numele</div>
                        )}

                        {this.state.buyModal === 5 && (
                          <div className="umenu-title">Schimba varsta</div>
                        )}
                        <div className="umenu-subtitle">
                          {/* 3.500$ = 1 SC */}
                        </div>
                        <div
                          className="umenu-icon"
                          onClick={() =>
                            this.setState({ ...this.state, buyModal: 0 })
                          }
                        >
                          <img src={svg["close"]} alt="" />
                        </div>
                        <div className="umenu-input">
                          <input
                            type={this.state.buyModal !== 1 ? "number" : "text"}
                            placeholder={
                              this.state.buyModal === 4
                                ? "Introduceti suma de Coins"
                                : this.state.buyModal === 1
                                  ? "Nume nou"
                                  : "Varsta noua"
                            }
                            value={
                              this.state.buyModal === 1
                                ? this.state.buyName.length > 0
                                  ? this.state.buyName
                                  : ""
                                : this.state.buyCoin > 0
                                  ? this.state.buyCoin
                                  : ""
                            }
                            maxLength={
                              this.state.buyModal === 4
                                ? 5
                                : this.state.buyModal === 1
                                  ? 24
                                  : 3
                            }
                            onChange={(e) => {
                              switch (this.state.buyModal) {
                                case 4: {
                                  if (
                                    parseInt(e.target.value) < 1 ||
                                    parseInt(e.target.value) > 99999
                                  )
                                    return;
                                  this.setState({
                                    ...this.state,
                                    buyCoin: parseInt(e.target.value),
                                  });
                                  return;
                                }
                                case 5: {
                                  if (
                                    parseInt(e.target.value) < 1 ||
                                    parseInt(e.target.value) > 99
                                  )
                                    return;
                                  this.setState({
                                    ...this.state,
                                    buyCoin: parseInt(e.target.value),
                                  });
                                  return;
                                }
                                case 1: {
                                  if (
                                    e.target.value.match(
                                      /^[ a-zA-Z0-9_-]{0,24}$/i
                                    )
                                  )
                                    this.setState({
                                      ...this.state,
                                      buyName: e.target.value,
                                    });
                                  return;
                                }
                              }
                            }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            this.buyShop(
                              this.state.buyModal,
                              this.state.buyModal == 1
                                ? this.state.buyName
                                : this.state.buyCoin
                            );
                            this.setState({ ...this.state, buyModal: 0 });
                          }}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  )}
                  {/* {this.state.buyVip > 0 && (
                    <div className="umenu-buyvip">
                      <div className="umenu-buyvipm">
                        <div className="umenu-title">VIP</div>
                        <div className="umenu-subtitle">
                          Alege perioada pe care o doresti
                        </div>
                        <div
                          className="umenu-icon"
                          onClick={() =>
                            this.setState({ ...this.state, buyVip: 0 })
                          }
                        >
                          <img src={svg["close"]} alt="" />
                        </div>
                        <div className="umenu-month">
                          <div
                            className={`umenu-mbox ${this.state.buyVipTime === 1 ? "month-active" : ""
                              }`}
                            onClick={() =>
                              this.setState({ ...this.state, buyVipTime: 1 })
                            }
                          >
                            <div className="umenu-title">1 luna</div>
                            <div className="umenu-subtitle">
                              {" "} SC
                              {
                                VIP_TARIFS.filter((q) => q.cost)[
                                  this.state.buyVip - 1
                                ].cost
                              }{" "}
                            </div>
                          </div>
                          <div
                            className={`umenu-mbox ${this.state.buyVipTime === 2 ? "month-active" : ""
                              }`} 
                            onClick={() =>
                              this.setState({ ...this.state, buyVipTime: 2 })
                            }
                          >
                            <div className="umenu-title">2 luni</div>
                            <div className="umenu-subtitle">
                              
                              {VIP_TARIFS.filter((q) => q.cost)[
                                this.state.buyVip - 1
                              ].cost * 2}{" "} SC
                            </div>
                          </div>
                          <div
                            className={`umenu-mbox ${this.state.buyVipTime === 3 ? "month-active" : ""
                              }`} 
                          >
                            <div
                              className="umenu-title"
                              onClick={() =>
                                this.setState({ ...this.state, buyVipTime: 3 })
                              }
                            >
                              3 luni
                            </div>
                            <div className="umenu-subtitle">
                              SC{" "}
                              {VIP_TARIFS.filter((q) => q.cost)[
                                this.state.buyVip - 1
                              ].cost * 3}{" "}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            this.buyVip(
                              VIP_TARIFS.filter((q) => q.cost)[
                                this.state.buyVip - 1
                              ].id
                            )
                          }
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  )} */}
                  {this.state.buyVip > 0 && (
                    <div className="umenu-buyvip">
                      <div className="umenu-buyvipm">
                        <div className="umenu-title">VIP</div>
                        <div className="umenu-subtitle">
                          Alege perioada pe care o doresti
                        </div>
                        <div
                          className="umenu-icon"
                          onClick={() => this.setState({ ...this.state, buyVip: 0 })}
                        >
                          <img src={svg["close"]} alt="" />
                        </div>

                        <div className="umenu-month">
                          {/* 1 luna */}
                          <div
                            className={`umenu-mbox ${this.state.buyVipTime === 1 ? "month-active" : ""}`}
                            onClick={() => this.setState({ ...this.state, buyVipTime: 1 })}
                          >
                            <div className="umenu-title">1 luna</div>
                            {/* <div className="umenu-subtitle">
                              {
                                VIP_TARIFS.filter((q) => q.cost)[this.state.buyVip - 1].cost
                              } SC
                            </div> */}
                            <div className="umenu-subtitle">
                            {VIP_TARIFS.filter((q) => q.cost)[this.state.buyVip - 1].cost}{" "}
                            <img
                              src={coins}
                              width={16}
                              height={16}
                              style={{ verticalAlign: "middle", marginLeft: "4px" }}
                            />
                          </div>
                          </div>

                          {/* 2 luni */}
                          <div
                            className={`umenu-mbox ${this.state.buyVipTime === 2 ? "month-active" : ""}`}
                            onClick={() => this.setState({ ...this.state, buyVipTime: 2 })}
                          >
                            <div className="umenu-title">2 luni</div>
                            <div className="umenu-subtitle">
                              {VIP_TARIFS.filter((q) => q.cost)[this.state.buyVip - 1].cost * 2}{" "}
                              <img
                                src={coins}
                                width={16}
                                height={16}
                                style={{ verticalAlign: "middle", marginLeft: "4px" }}
                              />
                            </div>
                            </div>

                          {/* 3 luni */}
                          <div
                            className={`umenu-mbox ${this.state.buyVipTime === 3 ? "month-active" : ""}`}
                            onClick={() => this.setState({ ...this.state, buyVipTime: 3 })}
                          >
                            <div className="umenu-title">3 luni</div>
                            <div className="umenu-subtitle">
                              {VIP_TARIFS.filter((q) => q.cost)[this.state.buyVip - 1].cost * 3}{" "}
                              <img
                                src={coins}
                                width={16}
                                height={16}
                                style={{ verticalAlign: "middle", marginLeft: "4px" }}
                              />
                            </div>

                          </div>
                        </div>

                        <button
                          onClick={() =>
                            this.buyVip(
                              VIP_TARIFS.filter((q) => q.cost)[this.state.buyVip - 1].id
                            )
                          }
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  )}

                  {this.state.shopPage === 1 && (
                    <div className="umenu-vip">
                      {VIP_TARIFS.filter((q) => q.cost).map((item, id) => {
                        return (
                          <div className="umenu-item" key={id}>
                            <div className="umenu-img">
                              <img
                                className="vip__image__contain"
                                src={png[item.id]}
                                alt=""
                              />
                            </div>
                            <div className="umenu-title">
                              VIP {item.name}

                            </div>
                            <div className="umenu-features">
                              {item.payday_donate && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    +
                                    {systemUtil.numberFormat(
                                      item.payday_donate
                                    )}{" "}
                                   Coins pe ora 
                                  </div>
                                </div>
                              )}

                              {item.payday_money && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    +{" "}
                                    {systemUtil.numberFormat(item.payday_money)}
                                    $ la salariu pe ora
                                  </div>
                                </div>
                              )}
                              {item.payday_exp && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    +{item.payday_exp}EXP pe ora
                                  </div>
                                </div>
                              )}
                              {item.job_skill_multipler && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    {" "}
                                    +{item.job_skill_multipler}% experienta la job
                                    pe ora
                                  </div>
                                </div>
                              )}
                              {item.healmultipler && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    vindecare mai rapida în spital
                                  </div>
                                </div>
                              )}
                              {item.afkminutes && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    permisiunea de a sta {item.afkminutes} minute AFK
                                  </div>
                                </div>
                              )}
                              {item.sitepay && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    persmission to use site {item.sitepay}
                                  </div>
                                </div>
                              )}
                              {item.vipuninvite && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    permisiunea de a folosi comanda /vipuninvite
                                  </div>
                                </div>
                              )}
                              {item.casino && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    acces VIP la casino
                                  </div>
                                </div>
                              )}
                              {item.taxPropertyMaxDays && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    plata taxelor pentru {item.taxPropertyMaxDays}{" "}
                                    zile
                                  </div>
                                </div>
                              )}
                              {item.jobPaymentMultiplier && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    crestere a salariului de job cu {" "}
                                    {item.jobPaymentMultiplier} %
                                  </div>
                                </div>
                              )}
                              {item.deathScreenTime && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    timp de asteptare mai mic la moarte{" "}
                                    {item.deathScreenTime / 1000} secunde
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="umenu-price">
                              <div className="umenu-text">Pret</div>
                              <div className="umenu-amount">
                                {item.cost} <span>Coins</span>
                              </div>
                            </div>
                            <button onClick={() => this.selectVip(id + 1)}>
                              Buy
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {this.state.shopPage === 2 && (
                    <div className="umenu-shops">
                      {this.state.donateShops.map((item, index) => {
                        return (
                          <div className="umenu-item" key={index}>
                            <img
                              src={png[`shop_${item.type}`] || png["d-face"]}
                              alt=""
                            />
                            <div className="umenu-title">
                              {" "}
                              {BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}
                            </div>
                            <div className="umenu-subtitle"> {item.name}</div>
                            <button
                              onClick={() => {
                                CEF.setGPS(item.x, item.y);
                              }}
                            >
                              Seteaza locatia
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {this.state.shopPage === 3 && (
                    <div className="umenu-vip">
                      {PACKETS.map((data, id) => {
                        return (
                          <div className="umenu-item">
                            <div className="umenu-img">
                              <img className="umenu-img-packet" src={png["money-bag"]} alt="" />
                            </div>
                            <div className="umenu-subtitle">{data.class}</div>
                            <div className="umenu-title">{data.name}</div>
                            <div className="umenu-features">
                              {data.items.vip && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    VIP {getVipConfig(data.items.vip.type).name}{" "}
                                    pentru {data.items.vip.time} luni
                                  </div>
                                </div>
                              )}
                              {data.items.money && (
                                <div className="umenu-fitem">
                                  <img src={svg["checkmark"]} alt="" />
                                  <div className="umenu-text">
                                    ${system.numberFormat(data.items.money)}
                                  </div>
                                </div>
                              )}
                              {data.items.licenses &&
                                data.items.licenses.map((lic) => {
                                  return (
                                    <div className="umenu-fitem">
                                      <img src={svg["checkmark"]} alt="" />
                                      <div className="umenu-text">
                                        {" "}
                                        {
                                          LicensesData.find(
                                            (q) => q.id === lic.id
                                          ).name
                                        }{" "}
                                        pentru {lic.days} zile
                                      </div>
                                    </div>
                                  );
                                })}
                              {data.items.items &&
                                data.items.items.map((item, i) => {
                                  return (
                                    <div
                                      className="umenu-fitem"
                                      key={`packet_${data.id}_${i}`}
                                    >
                                      <img src={svg["checkmark"]} alt="" />
                                      <div className="umenu-text">
                                        {getBaseItemNameById(item)}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="umenu-price">
                              <div className="umenu-text">Pret</div>
                              <div className="umenu-amount">
                                {data.price} <span>Coins</span>
                              </div>
                            </div>
                            <button onClick={() => this.buyPacket(data.id)}>
                              Cumpara
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {this.state.shopPage === 4 && (
                    <DonateRoulette
                      close={this.closeRoulette}
                      coins={this.state.donate}
                      dollars={CEF.user.money}
                    />
                  )}
                  {this.state.shopPage === 5 && (
                    <div className="umenu-vehicle">
                      {vehicleShopList.map((el, index) => (
                        <div className="umenu-vitem" key={index}>
                          <img src={CEF.getVehicleURL(el.model)} alt={el.name} />

                          <div className="umenu-vitem-content">
                            <div className="umenu-vitem-content-row">
                              <div className="umenu-name">{el.name}</div> {/* nume corect stilizat */}
                              <div className="umenu-price">{el.price} <span className="scoin-yellow">Coins</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                CEF.setGPS(el.showroom.x, el.showroom.y);
                              }}
                            >
                              Cumpara
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>

                  )}
                </div>
              )}
              {this.state.page === "binder" ? (
                <>
                  <div className="umenu-hotkeys">{this.renderHotkeys()}</div>
                </>
              ) : null}

              {this.state.page === "help" && (
                <div className="umenu-support">
                  <div className="umenu-title">Wiki</div>
                  <div className="umenu-subtitle">
                  Informatii despre server gasiti aici.
                  Detalii complete: wiki.vipuri.ro
                  </div>
                  <div className="umenu-list">
                    {helpInfo.map(([title, text], index) => {
                      return (
                        <button
                          className={`${this.state.helpSection == index
                            ? "support-active"
                            : ""
                            }`}
                          key={index}
                          onClick={(e) => {
                            this.setState({ helpSection: index });
                          }}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                  <div className="umenu-content">
                    <div className="umenu-title">
                      {helpInfo[this.state.helpSection][0]}
                    </div>
                    <div className="umenu-text">
                      {helpInfo[this.state.helpSection][1]
                        .split('\n')
                        .map((line, i) => (
                          <p key={i} style={{ marginBottom: '0.8vh' }}>{line}</p>
                        ))}
                    </div>
                    {/* <div className="umenu-text">
                      {helpInfo[this.state.helpSection][1]}
                    </div> */}
                  </div>
                </div>
              )}

              {this.state.page === "rules" && (
                <DailyRewards
                  rewards={this.state.dailyRewards}
                  onClaimReward={this.claimDailyReward.bind(this)}
                />
              )}

              {[
                "settings",
                "mypromo",
                "settings_auth",
                "settings_voice",
                "voiceBlance",
                "settings_promo",
                "settings_aim",
                "settings_alert",
              ].includes(this.state.page) && (
                  <div className="umenu-office">
                    <div className="umenu-title">Setari</div>
                    <div className="umenu-subtitle">
                      Personalizeaza experienta ta de joc
                    </div>
                    <div className="umenu-categories">
                      <button
                        className={
                          this.state.page == "settings"
                            ? "umenu-office-catactive"
                            : ""
                        }
                        onClick={() => this.setPage("settings")}
                      >
                        Schimbati parola
                      </button>
                      <button
                        className={
                          this.state.page == "settings_voice"
                            ? "umenu-office-catactive"
                            : ""
                        }
                        onClick={() => this.setPage("settings_voice")}
                      >
                        Volum
                      </button>
                      <button
                        className={
                          this.state.page == "voiceBlance"
                            ? "umenu-office-catactive"
                            : ""
                        }
                        onClick={() => this.setPage("voiceBlance")}
                      >
                        Volumul jucatorului
                      </button>
                      <button
                        className={
                          this.state.page == "settings_promo"
                            ? "umenu-office-catactive"
                            : ""
                        }
                        onClick={() => this.setPage("settings_promo")}
                      >
                        Foloseste un cod (Referal)
                      </button>
                      <button
                        className={
                          this.state.page == "mypromo"
                            ? "umenu-office-catactive"
                            : ""
                        }
                        onClick={() => this.setPage("mypromo")}
                      >
                        Creaza un cod (Referal)
                      </button>
                      <button
                        className={
                          this.state.page == "settings_aim"
                            ? "umenu-office-catactive"
                            : ""
                        }
                        onClick={() => this.setPage("settings_aim")}
                      >
                        Aim
                      </button>
                      <button
                        className={
                          this.state.page == "settings_alert"
                            ? "umenu-office-catactive"
                            : ""
                        }
                        onClick={() => this.setPage("settings_alert")}
                      >
                        Setari
                      </button>
                    </div>

                    {this.state.page === "settings" && (
                      <div className="umenu-password">
                        <div className="umenu-title">Schimbati parola</div>
                        <div className="umenu-input">
                          <div className="umenu-title">Parola veche</div>
                          <div className="umenu-box">
                            <input
                              type="password"
                              value={this.state.passData[0]}
                              onChange={(e) => {
                                let passData = this.state.passData;
                                passData[0] = e.target.value;
                                this.setState({
                                  ...this.state,
                                  passData: passData,
                                });
                              }}
                              placeholder="parola veche"
                            />
                          </div>
                        </div>
                        <div className="umenu-input">
                          <div className="umenu-title">Parola noua</div>
                          <div className="umenu-box">
                            <input
                              type="text"
                              value={this.state.passData[1]}
                              onChange={(e) => {
                                let passData = this.state.passData;
                                passData[1] = e.target.value;
                                this.setState({
                                  ...this.state,
                                  passData: passData,
                                });
                              }}
                              placeholder="parola noua"
                            />
                          </div>
                        </div>
                        <div className="umenu-input">
                          <div className="umenu-title">Parola noua</div>
                          <div className="umenu-box">
                            <input
                              type="text"
                              value={this.state.passData[2]}
                              onChange={(e) => {
                                let passData = this.state.passData;
                                passData[2] = e.target.value;
                                this.setState({
                                  ...this.state,
                                  passData: passData,
                                });
                              }}
                              placeholder="parola noua"
                            />
                          </div>
                        </div>
                        <button onClick={this.changePassword}>Change</button>
                      </div>
                    )}
                    {this.state.page === "settings_voice" && (
                      <div className="umenu-volume">
                        <div className="umenu-title">Volum</div>
                        <div className="umenu-item">
                          <div className="umenu-title">
                            Volumul microfonului tau
                          </div>
                          <div className="umenu-value">
                            {Math.round(this.state.voiceData[0] / 1.5)}%
                          </div>
                          {addSlider(this.state.voiceData[0] / 1.5, (e, val) =>
                            this.setState({
                              voiceData: [
                                (val as number) * 1.5,
                                this.state.voiceData[1],
                                this.state.voiceData[2],
                              ],
                            })
                          )}
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-title">
                            Volumul vocilor din jur
                          </div>
                          <div className="umenu-value">
                            {Math.round(this.state.voiceData[1] / 1.5)}%
                          </div>
                          {addSlider(this.state.voiceData[1] / 1.5, (e, val) =>
                            this.setState({
                              voiceData: [
                                this.state.voiceData[0],
                                (val as number) * 1.5,
                                this.state.voiceData[2],
                              ],
                            })
                          )}
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-title">
                           Volumul radioului si al telefonului
                          </div>
                          <div className="umenu-value">
                            {Math.round(this.state.voiceData[2] / 1.5)}%
                          </div>
                          {addSlider(this.state.voiceData[2] / 1.5, (e, val) =>
                            this.setState({
                              voiceData: [
                                this.state.voiceData[0],
                                this.state.voiceData[1],
                                (val as number) * 1.5,
                              ],
                            })
                          )}
                        </div>
                        {/* <div className="umenu-item">
                          <div className="umenu-title">
                            Volumul boomboxului tau
                          </div>
                          <div className="umenu-value">
                            {Math.round(this.state.boomboxSound)}%
                          </div>
                          {addSlider(
                            this.state.boomboxSound,
                            (e, val) =>
                              this.setState({
                                boomboxSound: val,
                              }),
                            0,
                            100,
                            1
                          )}
                        </div> */}
                        <button
                          onClick={() => {
                            CustomEvent.triggerClient(
                              "saveVoiceSettings",
                              JSON.stringify(this.state.voiceData),
                              this.state.boomboxSound
                            );
                          }}
                        >
                          Save
                        </button>
                      </div>
                    )}
                    {this.state.page === "voiceBlance" && (
                      <div className="umenu-volume">
                        <div className="umenu-title">Jucatori</div>
                        <div className="umenu-item">
                          <div className="umenu-title">Nivel voce</div>
                          <div className="umenu-value">
                            {Math.round(this.state.voiceLevel)}
                          </div>
                          {addSlider(
                            this.state.voiceLevel,
                            (e, val) => {
                              this.setState({
                                voiceLevel: val,
                              });
                              CustomEvent.triggerClient(
                                "voiceUser:voiceLevel",
                                val
                              );
                            },
                            1,
                            10,
                            1,
                            " LVL"
                          )}
                        </div>
                        {this.state.usersVoice.map(([id, val]) => {
                          return (
                            <div
                              className="umenu-item"
                              key={`voice_user_item_${id}`}
                            >
                              <div className="umenu-title">ID: {id}</div>
                              <div className="umenu-value">
                                {Math.round(val)}%
                              </div>
                              {addSlider(
                                val,
                                (e, val) => {
                                  let usersVoice = [...this.state.usersVoice];
                                  usersVoice.find((q) => q[0] === id)[1] = val;
                                  this.setState({
                                    usersVoice,
                                  });
                                  CustomEvent.triggerClient(
                                    "voiceUser:set",
                                    id,
                                    val
                                  );
                                },
                                0,
                                200,
                                1
                              )}
                            </div>
                          );
                        })}

                        <button>Save</button>
                      </div>
                    )}
                    {this.state.page === "settings_promo" && (
                      <div className="umenu-password">
                        <div className="umenu-title">Referal</div>
                        <div className="umenu-input">
                          <div className="umenu-title">Cod Referal</div>
                          <div className="umenu-box">
                            <input
                              type="text"
                              value={this.state.promo}
                              onChange={(e) => {
                                this.setState({
                                  ...this.state,
                                  promo: e.target.value,
                                });
                              }}
                              placeholder="Introdu codul de referal"
                            />
                          </div>
                        </div>
                        <button onClick={this.inputPromo}>Save</button>
                      </div>
                    )}
                    {this.state.page === "mypromo" && (
                      <div className="umenu-password">
                        <div className="umenu-title">Creaza Referal</div>
                        <div className="umenu-subtitle">
                          Aici iti poti creaia un cod de referal 
                        </div>
                        <img src={png["personage"]} alt="" />
                        <div className="umenu-prizes">
                          <div className="umenu-title">
                            Premii pentru jucatorii invitati
                          </div>
                          <div className="umenu-box">
                            <div className="umenu-icon umenu-blue">10</div>
                            <div className="umenu-text">$ 100 000</div>
                          </div>
                          <div className="umenu-box">
                            <div className="umenu-icon umenu-green">15</div>
                            <div className="umenu-text">
                              VIP Diamond <span>/ o luna</span>
                            </div>
                          </div>
                          <div className="umenu-box">
                            <div className="umenu-icon umenu-yellow">20</div>
                            <div className="umenu-text">Familie gratuita</div>
                          </div>
                          <div className="umenu-box">
                            <div className="umenu-icon umenu-red">25</div>
                            <div className="umenu-text">Pachet de licente</div>
                          </div>
                          <div className="umenu-box">
                            <div className="umenu-icon umenu-pink">30</div>
                            <div className="umenu-text">BMW G20</div>
                            <img src={png["bmw"]} alt="" />
                          </div>
                        </div>
                        <div className="umenu-input">
                          <div className="umenu-title">Cod referal</div>
                          <div className="umenu-box">
                            <input
                              type="text"
                              value={
                                this.state.promocodeMy ||
                                this.state.promocodeMyInput ||
                                ""
                              }
                              onChange={(e) => {
                                e.preventDefault();
                                if (this.state.promocodeMy) return;
                                this.setState({
                                  promocodeMyInput: system.filterInput(
                                    e.currentTarget.value || ""
                                  ),
                                });
                              }}
                              placeholder="Creeaza un cod referal"
                            />
                          </div>
                        </div>
                        <SocketSync
                          path={"mymediapromo"}
                          data={(e) => {
                            let {
                              promocodeMy,
                              promocodeMyCount,
                              promocodeMyRewardGived,
                            } = JSON.parse(e);
                            this.setState({
                              promocodeMy,
                              promocodeMyCount,
                              promocodeMyRewardGived,
                            });
                          }}
                        >
                          {this.state.promocodeMy ? (
                            <button
                              onClick={() => {
                                CEF.copy(this.state.promocodeMy);
                              }}
                            >
                              Copie
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (this.state.promocodeMy) return;
                                if (!this.state.promocodeMyInput) return;
                                CustomEvent.triggerServer(
                                  "mediapromo:create",
                                  this.state.promocodeMyInput
                                );
                              }}
                            >
                              Creaza
                            </button>
                          )}
                        </SocketSync>
                        <div className="umenu-features">
                          <div className="umenu-title">
                            Ce beneficii primeste jucatorul care a folosit codul tau de referal?
                          </div>
                          <div className="umenu-item">
                            <img src={svg["checkmark"]} alt="" />
                            <div className="umenu-text">$ 5 000</div>
                          </div>
                          <div className="umenu-item">
                            <img src={svg["checkmark"]} alt="" />
                            <div className="umenu-text">$ 25 000 la lvl 3 </div>
                          </div>
                          <div className="umenu-item">
                            <img src={svg["checkmark"]} alt="" />
                            <div className="umenu-text">
                              VIP Sapphire pentru 7 zile
                            </div>
                            <div className="umenu-subtext">
                              + 1 EXP la PayDay, x2 tratament spital
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.page === "settings_aim" && (
                      <div className="umenu-volume umenu-aim-volume">
                        <div className="umenu-title">Setari Tinta</div>
                        <div className="umenu-subtitle">Setari generale</div>
                        <div className="umenu-item umenu-aim-item">
                          <div className="umenu-title">Lungimea tintei</div>
                          <div className="umenu-value">
                            {Math.round(this.state.crosshairSettings.length)}%
                          </div>
                          {addSliderAim(
                            this.state.crosshairSettings.length,
                            (e, val) => {
                              this.setState({
                                crosshairSettings: {
                                  ...this.state.crosshairSettings,
                                  length: val,
                                },
                              });
                              CustomEvent.trigger(
                                "crosshair:setSettings",
                                this.state.crosshairSettings
                              );
                              CustomEvent.trigger("crosshair:rerender");
                            },
                            1,
                            30,
                            1
                          )}
                        </div>
                        <div className="umenu-item umenu-aim-item">
                          <div className="umenu-title">Latime tinta</div>
                          <div className="umenu-value">
                            {Math.round(this.state.crosshairSettings.width)}%
                          </div>
                          {addSliderAim(
                            this.state.crosshairSettings.width,
                            (e, val) => {
                              this.setState({
                                crosshairSettings: {
                                  ...this.state.crosshairSettings,
                                  width: val,
                                },
                              });
                              CustomEvent.trigger(
                                "crosshair:setSettings",
                                this.state.crosshairSettings
                              );
                              CustomEvent.trigger("crosshair:rerender");
                            },
                            1,
                            30,
                            1
                          )}
                        </div>
                        <div className="umenu-item umenu-aim-item">
                          <div className="umenu-title">Spatiu tinta</div>
                          <div className="umenu-value">
                            {Math.round(this.state.crosshairSettings.gap)}%
                          </div>
                          {addSliderAim(
                            this.state.crosshairSettings.gap,
                            (e, val) => {
                              this.setState({
                                crosshairSettings: {
                                  ...this.state.crosshairSettings,
                                  gap: val,
                                },
                              });
                              CustomEvent.trigger(
                                "crosshair:setSettings",
                                this.state.crosshairSettings
                              );
                              CustomEvent.trigger("crosshair:rerender");
                            },
                            1,
                            10,
                            1
                          )}
                        </div>
                        <div className="umenu-item umenu-aim-item">
                          <div className="umenu-title">Opacitate tinta</div>
                          <div className="umenu-value">
                            {Math.round(this.state.crosshairSettings.alpha)}%
                          </div>
                          {addSliderAim(
                            this.state.crosshairSettings.alpha,
                            (e, val) => {
                              this.setState({
                                crosshairSettings: {
                                  ...this.state.crosshairSettings,
                                  alpha: val,
                                },
                              });
                              CustomEvent.trigger(
                                "crosshair:setSettings",
                                this.state.crosshairSettings
                              );
                              CustomEvent.trigger("crosshair:rerender");
                            },
                            0,
                            1,
                            0.1
                          )}
                        </div>
                        <div className="umenu-appreance">
                          <div className="umenu-title">Aspect</div>
                          <div className="umenu-colorpicker">
                            <div className="umenu-title">Culoare tinta</div>
                            <ColorPickerWrapped
                              color={this.state.crosshairSettings.color}
                              onChange={(e: any) => {
                                this.setState({
                                  crosshairSettings: {
                                    ...this.state.crosshairSettings,
                                    color: e.rgb,
                                  },
                                });
                                CustomEvent.trigger(
                                  "crosshair:setSettings",
                                  this.state.crosshairSettings
                                );
                                CustomEvent.trigger("crosshair:rerender");
                              }}
                              onChangeComplete={(e: any) => { }}
                            />
                          </div>
                          <div className="umenu-colorpicker">
                            <div className="umenu-title">Culoare hover</div>
                            <ColorPickerWrapped
                              color={this.state.crosshairSettings.aimColor}
                              onChange={(e: any) => {
                                this.setState({
                                  crosshairSettings: {
                                    ...this.state.crosshairSettings,
                                    aimColor: e.rgb,
                                  },
                                });
                                CustomEvent.trigger(
                                  "crosshair:setSettings",
                                  this.state.crosshairSettings
                                );
                              }}
                              onChangeComplete={(e: any) => { }}
                            />
                          </div>
                          <div className="umenu-aimtype">
                            <div className="umenu-title">Tipul tintei</div>
                            <button
                              className={
                                this.state.crosshairSettings.enable
                                  ? `umenu-shop-active`
                                  : ``
                              }
                              onClick={() => {
                                const s = this.state.crosshairSettings;
                                s.enable = true;
                                this.setState({
                                  crosshairSettings: s,
                                });
                                CustomEvent.trigger(
                                  "crosshair:setSettings",
                                  this.state.crosshairSettings
                                );
                                CustomEvent.trigger("crosshair:rerender");
                              }}
                            >
                              Custom
                            </button>
                            <button
                              className={
                                !this.state.crosshairSettings.enable
                                  ? `umenu-shop-active`
                                  : ``
                              }
                              onClick={() => {
                                const s = this.state.crosshairSettings;
                                s.enable = false;
                                this.setState({
                                  crosshairSettings: s,
                                });
                                CustomEvent.trigger(
                                  "crosshair:setSettings",
                                  this.state.crosshairSettings
                                );
                                //CustomEvent.trigger('crosshair:rerender')
                              }}
                            >
                              System
                            </button>
                            <div className="umenu-preview">
                              <div className="umenu-title">Previzualizare</div>
                              <img src={png["aimbg"]} alt="" />
                              <div className="umenu-aim">
                                <HudCrosshair
                                  store={this.props.CrosshairStore}
                                  isShow={this.state.crosshairSettings.enable}
                                />
                              </div>
                            </div>
                            <div className="umenu-btns">
                              <button
                                onClick={() => {
                                  CustomEvent.triggerClient(
                                    "crosshair:save",
                                    JSON.stringify(this.state.crosshairSettings)
                                  );
                                  CustomEvent.trigger(
                                    "crosshair:setSettings",
                                    this.state.crosshairSettings
                                  );
                                  CustomEvent.trigger("crosshair:rerender");
                                }}
                              >
                                Save
                              </button>
                              <button onClick={() => this.setPage("settings")}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.page === "settings_alert" && (
                      <div className="umenu-volume umenu-sett-volume">
                        <div className="umenu-title">Setari</div>
                        <div className="umenu-item">
                          <div className="umenu-title">
                            Distanta de afisare a jucatorilor
                          </div>
                          <div className="umenu-value">
                            {Math.round(this.state.lodDistPlayers)}m
                          </div>
                          {addSlider(
                            this.state.lodDistPlayers,
                            (e, val) => {
                              this.setState({
                                lodDistPlayers: val,
                              });
                              CustomEvent.triggerClient("setLod:players", val);
                            },
                            1,
                            400,
                            20,
                            " m"
                          )}
                        </div>
                        <div className="umenu-item">
                          <div className="umenu-title">
                            Distanta de afisare a masinilor
                          </div>
                          <div className="umenu-value">
                            {Math.round(this.state.lodDistVehs)}m
                          </div>
                          {addSlider(
                            this.state.lodDistVehs,
                            (e, val) => {
                              this.setState({
                                lodDistVehs: val,
                              });
                              CustomEvent.triggerClient("setLod:vehs", val);
                            },
                            1,
                            400,
                            20,
                            " m"
                          )}
                        </div>

                        <div className="umenu-buttons">
                          {Object.keys(this.state.alertsData).map((key) => {
                            const value = (this.state.alertsData as any)[key];
                            return (
                              <div
                                className="umenu-box"
                                key={`alert_settings_${key}`}
                              >
                                <input
                                  checked={!!value}
                                  type="checkbox"
                                  id={`alert_settings_label_${key}`}
                                  onChange={() => {
                                    let alertsData = this.state.alertsData as any;
                                    alertsData[key] = !alertsData[key];
                                    this.setState({
                                      ...this.state,
                                      alertsData,
                                    });
                                    CustomEvent.triggerClient(
                                      "saveAlertSettings",
                                      JSON.stringify(this.state.alertsData)
                                    );
                                  }}
                                  className="umenu-toggle-input"
                                />
                                <label
                                  htmlFor={`alert_settings_label_${key}`}
                                  className="umenu-toggle-label"
                                >
                                  <div className="umenu-toggle-inner"></div>
                                </label>
                                <div className="umenu-text">
                                  {(ALERTS_SETTINGS as any)[key]}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {this.state.page === "statistic" ? <Statistic
                totalPlayerTime={this.state.playTime}
              /> : null}
              {this.state.page === "donateStorage" ? <DonateStorage /> : null}
              {this.state.page === "ticket" ? (
                CEF.admin ? (
                  <AdminTickets />
                ) : (
                  <Tickets />
                )
              ) : (
                <></>
              )}
              {this.state.page !== "ticket" && (
                <div className="umenu-items">
                  {pages.map((item, id) => {
                    return (
                      <div
                        className={`umenu-item ${this.state.page === item[0] ||
                          ([
                            "settings",
                            "settings_auth",
                            "settings_voice",
                            "settings_promo",
                            "settings_aim",
                            "settings_alert",
                          ].includes(this.state.page) &&
                            item[0] == "settings")
                          ? "umenu-selected-menu-item"
                          : id == 3
                            ? "bg-li-favourite"
                            : ""
                          }`}
                        key={id}
                        onClick={() => this.setPage(item[0])}
                      >
                        <img src={msvg[item[2]]} alt="" />
                        <div className="umenu-text">{item[1]}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}




const addSlider = (
  value: number,
  onChange: (e: any, val: number) => void,
  min = 0,
  max = 100,
  step = 1,
  addText = "%",
  zeroText = "OFF"
) => {
  let volumeStepsDraw = [{ value: 0, label: zeroText }];
  for (let id = max / 10; id <= max; id += max / 10) {
    volumeStepsDraw.push({ value: id, label: id + addText });
  }

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val !== value) {
            onChange(e, val);
          }
        }}
        style={{
          width: "100%",
          height: "4px",
          borderRadius: "5px",
          outline: "none",
          background: `linear-gradient(to right, rgb(30, 129, 17) ${((value - min) / (max - min)) * 100
            }%, rgba(255, 255, 255, 0.1) ${((value - min) / (max - min)) * 100
            }%)`,
        }}
      />
    </div>
  );
};
const addSliderAim = (
  value: number,
  onChange: (e: any, val: number) => void,
  min = 0,
  max = 100,
  step = 1,
  addText = "",
  zeroText = ""
) => {
  let volumeStepsDraw = [{ value: 0, label: zeroText }];
  for (let id = max; id <= max; id += max) {
    volumeStepsDraw.push({ value: id, label: id + addText });
  }

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val !== value) {
            onChange(e, val);
          }
        }}
        style={{
          width: "100%",
          height: "4px",
          borderRadius: "5px",
          outline: "none",
          background: `linear-gradient(to right, rgb(15, 122, 12) ${((value - min) / (max - min)) * 100
            }%, rgba(255, 255, 255, 0.1) ${((value - min) / (max - min)) * 100
            }%)`,
        }}
      />
    </div>
  );
};

const SliderStyles = createStyles({
  colorPrimary: {
    color: "#000000",
  },
  root: {
    marginTop: 5,
    color: "#C4C4C4",
    height: 16,
    "&$vertical": {
      width: 8,
    },
  },
  markLabel: {
    color: "#FFFFFFaa",
    fontSize: "0.7vw",
  },
  markLabelActive: {
    color: "#FFFFFFee",
  },
  thumb: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#187e0b",
    marginTop: -3,
    "&:focus, &:hover, &$active": {
      boxShadow: "0px 0px 30px #187e0b",
    },
  },
  track: {
    backgroundColor: "#187e0b",
    boxShadow: "0px 0px 3px #187e0b",
  },
});

const SliderAimStyles = createStyles({
  colorPrimary: {
    color: "#000000",
  },
  root: {
    marginTop: "2vw",
    color: "#C4C4C4",
    height: "0.83vw",
    "&$vertical": {
      width: "0.41vw",
    },
  },
  markLabel: {
    color: "#FFFFFFaa",
    fontSize: "0.7vw",
    display: "flex",
  },
  markLabelActive: {
    color: "#FFFFFFee",
  },
  thumb: {
    height: "0.83vw",
    width: "0.2vw",
    left: 0,
    borderRadius: "0.2vw",
    backgroundColor: "#187e0b",
    marginTop: "-0.41vw",
    "&:focus, &:hover, &$active": {
      boxShadow: "0px 0px 30px #187e0b",
    },
  },
  track: {
    backgroundColor: "#187e0b",
    boxShadow: "0px 0px 3px #187e0b",
  },
});

const NewSliderStyles = withStyles(SliderStyles)(Slider);
const NewSliderAimStyles = withStyles(SliderAimStyles)(Slider);
