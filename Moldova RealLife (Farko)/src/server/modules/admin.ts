import { langStringDefault } from "../../shared/lang";
import { CustomEvent } from "./custom.event";
import { reloadConfig, Vehicle, vehicleConfigs } from "./vehicles";
import { menu, MenuClass } from "./menu";
import { system } from "./system";
import { fuelTypeNames } from "../../shared/vehicles";
import { VehicleConfigsEntity } from "./typeorm/entities/vehicle.configs";
import { gui } from "./gui";
import { account, User } from "./user";
import {
  inventoryShared,
  OWNER_TYPES,
  WeaponAddonsItemBase,
} from "../../shared/inventory";
import { inventory } from "./inventory";
import { UserEntity } from "./typeorm/entities/user";
import { houses, openHouseEditAdminMenu } from "./houses";
import { DONATE_MONEY_NAMES, PLAYTIME_TIME } from "../../shared/economy";
import { JAIL_ADMIN_MAX_MIN } from "../../shared/jail";
import { getJobName, getLevelByExp } from "../../shared/jobs";
import { LicenceType, LicenseName, LicensesData } from "../../shared/licence";
import { document_templates } from "../../shared/documents";
import { VIP_TARIFS } from "../../shared/vip";
import { QUESTS_DATA } from "../../shared/quests";
import { AccountEntity } from "./typeorm/entities/account";
import { parking } from "./businesses/parking";
import { dialogSystem } from "./chat";
import {
  PromocodeList,
  PromocodeUseEntity,
} from "./typeorm/entities/promocodes";
import { MoreThan } from "typeorm";
import { saveEntity } from "./typeorm";
import { addAdminStats } from "./admin.stats";
import {
  CAR_FOR_PLAY_REWARD_MAX,
  MINUTES_FOR_PLAY_REWARD_MAX,
} from "../../shared/reward.time";
import {
  showFamilyAdminMenu,
  showFamilyEditAdminMenu,
} from "./families/admin_menu";
import { Family } from "./families/family";
import { BlackListEntity } from "./typeorm/entities/blacklist";
import { CargoBattleFamilyQuest } from "./families/quests/cargobattle";
import { HELPER_PAYDAY_MONEY } from "../../shared/admin.data";
import { clearExpiredPlayTime, payDayGlobal } from "./usermodule/payday";
import { SkinChange } from "../../shared/ChangeSkin";
import { SendUpdate } from "../../shared/GameVisualElement";
import { business } from "./business";
import { UserStatic } from "./usermodule/static";
import { getZoneAtPosition, setZoneControl } from "./gangwar";
import { SpecialLog } from "./typeorm/entities/specialLog";
import { writePersonalMessage, writeSpecialLog } from "./specialLogs";
import { fractionCfg } from "./fractions/main";
import { prison } from "./prison";
import { IPrisonData } from "../../shared/prison/IPrisonData";
import { PURCHASEABLE_ANIMS } from "../../shared/anim";

gui.chat.registerCommand(
  "changeSocialName",
  async (player: PlayerMp, oldSocialName: string, newSocialName: string) => {
    if (!player.user || !player.user.isAdminNow(5)) {
      return;
    }

    const account = await AccountEntity.findOne({
      social_name: oldSocialName,
    });

    if (!account) {
      return player.notify(
        player.user.LangString("admin.b331cd61d11beb8a4e8c164e6c97d618")
      );
    }

    account.social_name = newSocialName;
    await account.save();

    player.user.log(
      "AdminJob",
      langStringDefault(
        "admin.44db82617688a2a07f1793a3b6a0615c",
        account.login,
        oldSocialName,
        newSocialName
      )
    );
    player.notify(
      player.user.LangString(
        "admin.8241733dd023e0da8c9ece24e17e182e",
        account.login,
        oldSocialName,
        newSocialName
      )
    );
  }
);

gui.chat.registerCommand("deleteitems", (player, targetIdStr, itemIdStr) => {
  if (!player.user || !player.user.isAdminNow(4)) {
    return;
  }

  const target = UserStatic.get(parseInt(targetIdStr));
  if (!target || !target.user) {
    return player.notify(
      player.user.LangString("admin.88a275b7d1c59cc71347d2ad699b2a21"),
      "error"
    );
  }

  const itemId = parseInt(itemIdStr);
  const itemsToDelete = target.user.getItemsByIds([itemId]);

  const itemCount = itemsToDelete.length;
  const itemAmount = itemsToDelete
    .map((item) => item.count)
    .reduce((count1, count2) => count1 + count2, 0);

  itemsToDelete.forEach((item) => {
    inventory.deleteItem(item, OWNER_TYPES.PLAYER, target.user.id);
  });

  player.outputChatBox(
    player.user.LangString(
      "admin.6f22a57a86f23fef6103516d60a6a2bf",
      targetIdStr,
      itemIdStr,
      itemAmount,
      itemCount
    )
  );
  player.user.log(
    "AdminJob",
    langStringDefault(
      "admin.f5e2d9f9413061bef00dc183275e99bf",
      itemId,
      itemCount,
      itemAmount
    ),
    target
  );
});

gui.chat.registerCommand("toggleevlog", (player) => {
  player.call("toggleEventsLogging");
});

gui.chat.registerCommand("atest", (player) => testMenu(player));

gui.chat.registerCommand(
  "ajail",
  (player, userIdStr, minutesStr, ...reasonArgs) => {
    if (!player.user.isAdminNow()) return;

    const userId = parseInt(userIdStr);
    const minutes = parseInt(minutesStr);
    const reason = reasonArgs.join(" ");

    if (!userId || !minutes || !reason)
      return player.notify(
        player.user.LangString("admin.63741086350915fdc27d936d1f9af5fa"),
        "error"
      );
    if (minutes > 500)
      return player.notify(
        player.user.LangString("admin.fa2f4add2d34b71d1a9dd7d05a45be6d"),
        "error"
      );

    prison.jailAdmin(player, userId, minutes, reason);
  }
);

gui.chat.registerCommand("a", (player, ...args) => {
  if (!player.user) return;

  // Verificare nivel admin
  const level = player.user.admin_level || 0;
  if (level < 1) {
    return player.outputChatBox("!{FF0000}Nu ai acces la acest chat.");
  }

  const message = args.join(" ").trim();
  if (!message) {
    return player.outputChatBox("!{FF0000}Foloseste: /a [mesaj]");
  }

  // Grade admin
  const adminRanks = {
    1: "Helper",
    2: "Trial Admin",
    3: "Admin",
    4: "Senior Admin",
    5: "Administrator",
    6: "Manager",
    7: "Fondator",
  };

  const rankName = adminRanks[level] || "Staff";

  const name = player.user.name;
  const id = player.user.id;
  const time = gui.chat.getTime();

  // Mesaj formatat
  const formattedMsg = `[${time}] !{#FF4D9D}[${rankName}] ${name} (${id}): !{FFFFFF}${message}`;

  // Trimitem doar adminilor
  mp.players.forEach((p) => {
    if (p.user && p.user.admin_level && p.user.admin_level >= 1) {
      p.outputChatBox(formattedMsg);
    }
  });
});

// gui.chat.registerCommand("a", (player, ...args) => {
//     if (!player.user) return;

//     // Verificare nivel admin
//     if (!player.user.admin_level || player.user.admin_level < 1) {
//         return player.outputChatBox("!{FF0000}Nu ai acces la acest chat.");
//     }

//     const message = args.join(" ").trim();
//     if (!message) return player.outputChatBox("!{FF0000}Foloseste: /a [mesaj]");

//     const name = player.user.name;
//     const id = player.user.id;
//     const level = player.user.admin_level;
//     const time = gui.chat.getTime();

//     const formattedMsg = `[${time}] !{#FF4D9D}[Admin LVL.${level}] ${name} (${id}): !{FFFFFF}${message}`;

//     // Trimitem DOAR adminilor
//     mp.players.forEach((p) => {
//         if (p.user && p.user.admin_level && p.user.admin_level >= 1) {
//             p.outputChatBox(formattedMsg);
//         }
//     });
// });

// gui.chat.registerCommand("a", (player, ...args) => {
//     if (!player.user) {
//         return;
//     }

//     if (!player.user.admin_level || player.user.admin_level < 1) {
//         return;
//     }

//     const message = args.join(" ");

//     mp.players.toArray()
//         .filter(p => p.user && p.user.admin_level && p.user.admin_level >= 1)
//         .forEach(p => p.outputChatBox(p.user.LangString("admin.5c035cbb921582d8848cf39e925c3ac9", player.user.name, player.user.id, message)));
// })

gui.chat.registerCommand("gangzones", (player) => {
  if (!player.user) {
    return;
  }

  if (!player.user.admin_level || player.user.admin_level < 1) {
    return;
  }

  CustomEvent.triggerClient(player, "admin:gangzones:show");
});

gui.chat.registerCommand("testdebug", (player) => {
  if (!player.user) return;
  player.callUnreliable("testDebug");
  player.call("testDebug");
});

CustomEvent.registerClient("admin:setName", (player, name: string) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return;
  user.entity.admin_name = name;
  player.setVariable("adminName", name);
});

const testMenu = (player: PlayerMp) => {
  const user = player.user;
  if (!user) return;
  if (mp.config.announce) return;
  const m = menu.new(
    player,
    player.user.LangString("admin.0f05f40bb5f521acca1fe39b9824f696")
  );

  m.newItem({
    name: langStringDefault("admin.9f9b93a8bbdd2f5abbc8b55c3dc790ed"),
    onpress: () => {
      CustomEvent.triggerClient(player, "tpWaypoint");
    },
  });

  m.newItem({
    name: langStringDefault("admin.7c9019f80916afb65b13305c855cdd5b"),
    more: user.fraction
      ? `${fractionCfg.getFractionName(user.fraction)} (${user.fraction})`
      : langStringDefault("admin.8729e279e3283d2df4a46bf2cef2d594"),
    onpress: () => {
      menu
        .selectFraction(player, "all", user.fraction)
        .then(async (fraction) => {
          if (!fraction) return testMenu(player);
          user.fraction = fraction;
          player.notify(
            player.user.LangString("admin.11914e6ac001d0e1d4f6bff73c03254b"),
            "error"
          );
          testMenu(player);
        });
    },
  });

  if (user.fraction) {
    m.newItem({
      name: langStringDefault("admin.663b6b4914463f3917c652305993507d"),
      more: user.rank
        ? `${fractionCfg.getRankName(user.fraction, user.rank)} (${user.rank})`
        : langStringDefault("admin.8a666de691705248edb836b82abf3f54"),
      onpress: () => {
        menu
          .selector(
            player,
            player.user.LangString("admin.f184fb4d2883841c386dcbae4bfed793"),
            fractionCfg.getFractionRanks(user.fraction),
            true
          )
          .then(async (val) => {
            if (typeof val !== "number") return testMenu(player);
            if (!user.fraction)
              return (
                player.notify(
                  player.user.LangString(
                    "admin.63f59b945124237820c367ff5a7c6762"
                  ),
                  "error"
                ),
                testMenu(player)
              );
            user.rank = val + 1;
            player.notify(
              player.user.LangString("admin.6b65a9986baac52e1887f4720b9f9925"),
              "success"
            );
            testMenu(player);
          });
      },
    });
    m.newItem({
      name: langStringDefault("admin.3b66157a60d07cb909d94b9a7553ea24"),
      onpress: () => {
        menu.accept(player).then(async (status) => {
          if (!status) return testMenu(player);
          user.fraction = 0;
          user.rank = 0;
          player.notify(
            player.user.LangString("admin.3f1e83251eadbbf4980306fa8c931331"),
            "error"
          );
        });
      },
    });
  }

  m.newItem({
    name: langStringDefault("admin.a4951015e7b67fef2a92e5923352a0ef"),
    more: `$${system.numberFormat(user.money)}`,
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.19577d43be9076dc421c378be7936176"),
          100,
          7,
          "int"
        )
        .then((val) => {
          if (!val || val < 0 || val > 9999999) return;
          user.addMoney(
            val,
            true,
            user.LangString("admin.8986c0829b60b63ed072380feed24ef5")
          );
        });
    },
  });

  if (user.bank_have) {
    m.newItem({
      name: langStringDefault("admin.e053e0c220ad88b8de88b7d31b0004b9"),
      more: `$${system.numberFormat(user.bank_money)}`,
      onpress: () => {
        menu
          .input(
            player,
            player.user.LangString("admin.5a472035dd5b72d1ab244ce21c701019"),
            100,
            7,
            "int"
          )
          .then((val) => {
            if (!val || val < 0 || val > 9999999) return;
            user.addBankMoney(
              val,
              true,
              user.LangString("admin.eba92b78e27334ac73646510eff76286"),
              "System"
            );
          });
      },
    });
  }

  m.newItem({
    name: langStringDefault("admin.3a9890cf531036c6f38fd762b4ed35d3"),
    more: `$${system.numberFormat(user.donate_money)}`,
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.be0530ce2b3e91364f39310b0f0e1d70"),
          100,
          7,
          "int"
        )
        .then((val) => {
          if (!val || val < 0 || val > 9999999) return;
          user.addDonateMoney(
            val,
            user.LangString("admin.e535c50322b1989d89734ceb378f3b90")
          );
        });
    },
  });

  m.newItem({
    name: langStringDefault("admin.fc4cda94e34135f2845142af462fb325"),
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.d216a068bc68dce528ad61b7fba1eb58"),
          "",
          7
        )
        .then((model) => {
          if (!model) return;
          CustomEvent.callClient(player, "verifyVehModel", model).then((q) => {
            if (!q)
              return player.notify(
                player.user.LangString(
                  "admin.dca6fbfa535c524d6270567633a28412"
                ),
                "error"
              );
            let veh = Vehicle.spawn(
              model,
              player.position,
              player.heading,
              player.dimension,
              true,
              false
            );
            user.putIntoVehicle(veh);
          });
        });
    },
  });

  m.open();
};

gui.chat.registerCommand(
  "adminPanel",
  async (
    player,
    task: string,
    ids: string,
    timeT: "m" | "h" | "d",
    timeN: string,
    ...reasonT: string[]
  ) => {
    const user = player.user;
    if (!user) return;
    if (!player.user.isAdminNow()) return;

    const id = parseInt(ids);
    let time = parseInt(timeN);
    if (time) {
      if (timeT === "m") time = time * 60;
      if (timeT === "h") time = time * 60 * 60;
      if (timeT === "d") time = time * 60 * 60 * 24;
    }
    let reason =
      reasonT && reasonT.length > 0
        ? reasonT.map((q) => system.filterInput(q)).join(" ")
        : "";

    const data = await User.getData(id);

    if (!data)
      return player.notify(
        player.user.LangString("admin.8f7bd4258ccb44802cdbeb32b6531152"),
        "error"
      );

    if (!mp.players.exists(player)) return;

    if (
      data.admin_level > user.admin_level &&
      user.admin_level < 6 &&
      mp.config.announce
    )
      return player.notify(
        player.user.LangString("admin.7a6dca1fe0321df9bb8f47a796de55d1"),
        "error"
      );

    if (task === "ban") {
      if (!user.hasPermission("admin:useredit:banuser"))
        return player.notify(
          player.user.LangString("admin.015fb0d2a0041776d82c631b719a8d2d"),
          "error"
        );
      User.banUser(id, player, reason, system.timestamp + time);
    } else if (task === "aban") {
      if (!user.hasPermission("admin:useredit:banaccount"))
        return player.notify(
          player.user.LangString("admin.98932aa21580138ae2f4a1d5ce6983e7"),
          "error"
        );
      User.banUserAccount(
        data.accountId,
        player,
        reason,
        system.timestamp + time
      );
    } else if (task === "jail") {
      if (!user.hasPermission("admin:useredit:jail"))
        return player.notify(
          player.user.LangString("admin.d6e48e559b977dca9d1e64caf2b409c5"),
          "error"
        );
      const target = User.get(id);
      if (mp.players.exists(target)) {
        player.notify(
          player.user.LangString(
            "admin.b83d22c3b289b6b479b406040469ef53",
            target.user.jail_time_admin
              ? player.user.LangString("admin.df6f1475289955fd9991c6cee43fc139")
              : player.user.LangString("admin.50b2228ba7f85d045e2b3367276c7a14")
          ),
          "success"
        );
        target.user.jailAdmin(player, time, reason);
      } else {
        player.notify(
          player.user.LangString(
            "admin.375a4261e30f615dd8c2b83ec59b8a72",
            data.jail_time_admin
              ? player.user.LangString("admin.e1a675cda16a685a80afc39e407a01af")
              : player.user.LangString("admin.67e7f17f5bf6af186371f7428e819ebd")
          ),
          "success"
        );
        data.jail_time_admin = time;
        data.jail_reason_admin = `${reason} / ${user.name} (${user.id})`;
        saveEntity(data);
      }
      user.log(
        "AdminJob",
        langStringDefault(
          "admin.0cd12328e137e624eead67de496af89d",
          timeN,
          timeT,
          reason
        ),
        data.id
      );
      addAdminStats(user.id, "jail");
    } else if (task === "cmute") {
      if (!user.hasPermission("admin:useredit:cmute"))
        return player.notify(
          player.user.LangString("admin.73997b2a33d06143de6c28cc135023de"),
          "error"
        );
      const target = User.get(id);
      cmute.set(id, system.timestamp + time);
      user.log(
        "AdminBan",
        langStringDefault(
          "admin.e3a24a4d197c3933a86dd21ff9143082",
          id,
          system.timeStampString(cmute.get(id))
        ),
        id
      );
      addAdminStats(user.id, "cmute");
      syncMutePlayer(id);
      const mutePlayer = User.get(id);
      if (mutePlayer)
        mutePlayer.outputChatBox(
          mutePlayer.user.LangString(
            "admin.c8928c29c1e11a8458d45075d77d273a",
            system.timeStampString(cmute.get(id)),
            reason
          )
        );
    } else if (task === "vmute") {
      if (!user.hasPermission("admin:useredit:bmute"))
        return player.notify(
          player.user.LangString("admin.5132cfbf4ba495338ad8e0ddeee64101"),
          "error"
        );
      const target = User.get(id);
      vmute.set(id, system.timestamp + time);
      user.log(
        "AdminBan",
        langStringDefault(
          "admin.44a3c21c3e2ba9231069f220b77c850d",
          id,
          system.timeStampString(vmute.get(id))
        ),
        id
      );
      addAdminStats(user.id, "vmute");
      syncMutePlayer(id);
      const mutePlayer = User.get(id);
      if (mutePlayer)
        mutePlayer.outputChatBox(
          mutePlayer.user.LangString(
            "admin.d50492b8ba0085c61bb8f09595e4a73e",
            system.timeStampString(vmute.get(id)),
            reason
          )
        );
    } else if (task === "kill") {
      const target = User.get(id);
      if (!target)
        return player.notify(
          player.user.LangString("admin.df42e547ebd1fec10d13d8e2bffc8809"),
          "error"
        );
      target.user.health = 0;
    } else if (task === "fullhp") {
      const target = User.get(id);
      if (!target)
        return player.notify(
          player.user.LangString("admin.78ad56abeb9b67baba637fb8c0178126"),
          "error"
        );
      target.user.health = 100;
    } else if (task === "cuff") {
      const target = User.get(id);
      if (!target)
        return player.notify(
          player.user.LangString("admin.dd2223a1de83104a2fe018252064646c"),
          "error"
        );
      target.user.cuffed = !target.user.cuffed;
      return player.notify(
        player.user.LangString(
          "admin.1820a00453fcd7a9363b1e74a59192cc",
          target.user.cuffed
            ? player.user.LangString("admin.f40b764fbf0ea2235d407b03e89d33d5")
            : player.user.LangString("admin.0f518d765503b8280c26e0f581281475")
        ),
        "success"
      );
    } else if (task === "tp") {
      const target = User.get(id);
      if (!target)
        return player.notify(
          player.user.LangString("admin.36fda8ef4d0f9c5d2ec4af87e7df5436"),
          "error"
        );
      const { x, y, z } = target.position;
      user.teleportVeh(x, y, z, 0, target.dimension);
    } else if (task === "tpm") {
      const target = User.get(id);
      if (!target)
        return player.notify(
          player.user.LangString("admin.407fd9c82bcf29cf405713e37ae292e5"),
          "error"
        );
      const { x, y, z } = player.position;
      target.user.teleportVeh(x, y, z, 0, player.dimension);
    } else if (task === "kick") {
      const target = User.get(id);
      if (!target)
        return player.notify(
          player.user.LangString("admin.f2cac19443f2b249ed64286ece8c88c1"),
          "error"
        );
      User.kickUser(target, reason, player);
    } else if (task === "freeze") {
      const target = User.get(id);
      if (!target)
        return player.notify(
          player.user.LangString("admin.94a48e6ffb541834fc5a4f6fc884a076"),
          "error"
        );
      const current = target.getVariable("admin:freeze");
      target.setVariable("admin:freeze", !current);
      return player.notify(
        player.user.LangString(
          "admin.0608e18705f0e5a7e0e2f33edd95c709",
          current
            ? player.user.LangString("admin.d9427f0548297e642ad6ba9a7145cb1a")
            : player.user.LangString("admin.45445e632ef5395612b10e27a65cf585")
        ),
        "success"
      );
    } else if (task === "sp") {
      return startSpectate(player, id);
    } else if (task === "choice") {
      return userChoise(player, id);
    } else if (task === "stats") {
      let res: [string, any][] = [];
      const target = User.get(id);
      const prison: IPrisonData = data.prison ? JSON.parse(data.prison) : null;

      res.push([
        player.user.LangString("admin.300978f7aef762b46afe440d13272060"),
        data.rp_name,
      ]);
      res.push([
        player.user.LangString("admin.bbdbbc3eb271731c73938d204e6bf2e3"),
        data.level,
      ]);
      res.push([
        player.user.LangString("admin.9d2b2eb3643bd23825b4022f053da4b6"),
        `${
          data.fraction
            ? player.user.LangString(
                "admin.3faff3d90080ecf5c7241299e705b687",
                fractionCfg.getFractionName(data.fraction),
                data.rank
              )
            : player.user.LangString("admin.f34b24271963465aee3ceeee928fc289")
        }`,
      ]);
      res.push([
        player.user.LangString("admin.6358b415744b450cc79dd7d63af495e0"),
        `${
          data.family
            ? `${Family.getByID(data.family)?.name} (ID: ${data.family})`
            : player.user.LangString("admin.7affc9116fc57ef8ab6c498f9403d940")
        }`,
      ]);
      res.push([
        player.user.LangString("admin.31ac12dabeae2aa52f080a45dbf9598d"),
        `$${system.numberFormat(data.money)}`,
      ]);
      res.push([
        player.user.LangString("admin.3cc8bc9a888fce99e88a6265ff938b10"),
        `$${system.numberFormat(data.bank_money)}`,
      ]);
      res.push([
        player.user.LangString("admin.150a142ce76b357026341eef005af404"),
        `${system.numberFormat(data.chips)}`,
      ]);
      res.push([
        player.user.LangString("admin.431cd81752ac004f38c7b9871a6a407f"),
        `${
          prison
            ? player.user.LangString(
                "admin.0ebb7caf44b8a9cd964e06bca13b2b42",
                Math.floor(prison.time / 60),
                prison.byAdmin ? " [A]" : ""
              )
            : player.user.LangString("admin.930d925cb2528777fbc4e269a789b7c3")
        }`,
      ]);
      res.push([
        player.user.LangString("admin.0b8c6a86aeaaf62c8e5d5f7a07e26a11"),
        `${
          data.ban_end && data.ban_end > system.timestamp
            ? player.user.LangString(
                "admin.8da2c6669f98091fd3f3585f8aa71f3e",
                system.timeStampString(data.ban_end)
              )
            : player.user.LangString("admin.60bcea01beecee13782adf199307b169")
        }`,
      ]);
      res.push([
        player.user.LangString("admin.f6a0dc1e8ca41f69c8dd1aa94dbaf638"),
        `${data.warns.length}`,
      ]);
      res.push([
        "CMute",
        `${
          cmute.get(id)
            ? system.timeStampString(cmute.get(id))
            : player.user.LangString("admin.28e3c723499357230bec6e4e8e7fc9ed")
        }`,
      ]);
      res.push([
        "VMute",
        `${
          vmute.get(id)
            ? system.timeStampString(vmute.get(id))
            : player.user.LangString("admin.d53a503ccae26d468a58b53191a52663")
        }`,
      ]);
      if (target) {
        res.push([
          player.user.LangString("admin.c579de898bc10402e72e8c7aa07862ce"),
          `${target.user.health.toFixed(0)}`,
        ]);
        res.push([
          player.user.LangString("admin.43028db01bb682622998e599007cfa7d"),
          `${target.armour.toFixed(0)}`,
        ]);
        res.push([
          player.user.LangString("admin.5597711d048945d47a60d1e36ffac236"),
          `${target.ping}`,
        ]);
        res.push([
          player.user.LangString("admin.f092f76d2be14a4a26a14a54d467c837"),
          `${target.packetLoss}`,
        ]);
      }

      return CustomEvent.triggerCef(player, "admin:panel:stats:data", id, res);
    }
    player.notify(
      player.user.LangString("admin.6c984b1865e6d782eca561198f81ea9a"),
      "success"
    );
  }
);

gui.chat.registerCommand("skick", (player, ids, ...reasonT) => {
  if (!player.user) return;
  if (!player.user.isAdminNow(6)) return;

  const id = parseInt(ids),
    target = User.get(id);

  if (!target)
    return player.notify(
      player.user.LangString("admin.19e10feade9919db24547307889bc899"),
      "error"
    );
  let reason =
    reasonT && reasonT.length > 0
      ? reasonT.map((q) => system.filterInput(q)).join(" ")
      : "";
  target.kick(
    target.user.LangString("admin.d90017a95cf4c74b447a45610111716d", reason)
  );
  player.notify(
    player.user.LangString("admin.76820906a465faa8e7f443047118ad55"),
    "success"
  );
  writeSpecialLog(
    langStringDefault("admin.52eff16d302c0ab489753c94c26a0713", id, reason),
    player
  );
});

gui.chat.registerCommand("tpm", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow(1)) return; // modifica nivelul daca vrei alt grad

  CustomEvent.triggerClient(player, "tpWaypoint");
  player.notify("Ai fost teleportat la waypoint.", "success");
});

gui.chat.registerCommand("sban", (player, id, end, ...reasonT) => {
  if (!player.user || !player.user.isAdminNow(6)) return;
  if (!end) return;

  User.getData(parseInt(id)).then((usr) => {
    if (!usr) return;
    if (!mp.players.exists(player)) return;
    if (!player.user) return;
    usr.ban_end = parseInt(end);
    usr.ban_reason =
      reasonT && reasonT.length > 0
        ? reasonT.map((q) => system.filterInput(q)).join(" ")
        : "";
    usr.fraction = 0;
    usr.rank = 0;
    usr.ban_admin = player.dbid;
    usr.save().then(() => {
      const target = User.get(parseInt(id));
      if (target && mp.players.exists(target))
        target.kick(
          target.user.LangString(
            "admin.12b028863736b8a8f04d2c5fb6a80608",
            system.timeStampString(parseInt(end)),
            reasonT && reasonT.length > 0
              ? reasonT.map((q) => system.filterInput(q)).join(" ")
              : ""
          )
        );
      player.notify(
        player.user.LangString("admin.6d643febd44d79a99fe6f401a7a0d0f9"),
        "success"
      );
      writeSpecialLog(
        langStringDefault(
          "admin.1d33ed3d08ce387cdc322cb068aac380",
          id,
          system.timeStampString(parseInt(end)),
          reasonT && reasonT.length > 0
            ? reasonT.map((q) => system.filterInput(q)).join(" ")
            : ""
        ),
        player
      );
    });
  });
});

gui.chat.registerCommand("sunban", (player, id) => {
  if (!player.user || !player.user.isAdminNow(6)) return;
  if (!player.user || !id) return;

  User.getData(parseInt(id)).then((usr) => {
    if (!usr) return;
    if (!mp.players.exists(player)) return;
    if (!player.user) return;
    usr.ban_end = 0;

    player.notify(
      player.user.LangString("admin.df7d5018ea2fd184b3a4a74e74b5206d"),
      "success"
    );
    writeSpecialLog(
      langStringDefault("admin.a7f9fd3ea8fc9364ff4ec929ec92073f", id),
      player
    );
    usr.save();
  });
});

gui.chat.registerCommand("shban", async (admin, id, end, ...reasonT) => {
  if (!admin.user || !admin.user.isAdminNow(6)) return;
  if (!reasonT)
    return admin.notify(
      admin.user.LangString("admin.c3faf82e910c20b20053f74da8810a4d"),
      "error"
    );

  let target = User.get(parseInt(id));
  const data =
      target && target.user
        ? target.user.entity
        : await User.getData(parseInt(id)),
    dataAccount =
      target && target.user
        ? target.user.account
        : await User.getDataAccount(data.accountId);

  if (!mp.players.exists(admin)) return;
  if (!admin.user) return;
  dataAccount.ban_end = parseInt(end);
  dataAccount.ban_reason =
    reasonT && reasonT.length > 0
      ? reasonT.map((q) => system.filterInput(q)).join(" ")
      : "";
  dataAccount.ban_admin = admin.dbid;

  dataAccount.save().then(() => {
    if (target && mp.players.exists(target)) target.kick("");
  });

  admin.notify(
    admin.user.LangString("admin.b2c926a9c7b315a9a8e6b340b866e41f"),
    "success"
  );
  writeSpecialLog(
    langStringDefault(
      "admin.d53e7e5a4ccfab971bc2b4007e8ee9c4",
      id,
      system.timeStampString(parseInt(end)),
      reasonT && reasonT.length > 0
        ? reasonT.map((q) => system.filterInput(q)).join(" ")
        : ""
    ),
    admin
  );
});

gui.chat.registerCommand("shunban", async (player, id) => {
  if (!player.user || !player.user.isAdminNow(6)) return;
  const data = await User.getData(parseInt(id)),
    dataAccount = await User.getDataAccount(data.accountId);

  if (!data || !dataAccount) return;

  dataAccount.ban_end = 0;
  dataAccount.save();
  player.notify(
    player.user.LangString("admin.41e71a6bb9f33d07626d526bb13e2da1"),
    "success"
  );
  writeSpecialLog(
    langStringDefault("admin.af353ee7472166d32c7f2da7445a842b", id),
    player
  );
});

gui.chat.registerCommand("setTime", (player, str) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;
  let d = parseInt(str);
  CustomEvent.triggerClient(player, "forceSetTime", d);
});

gui.chat.registerCommand("cname", (player, strId, ...newName) => {
  if (!player.user) return;
  if (!player.user.hasPermission("admin:setusername")) return;
  let id = parseInt(strId);
  const targetUser = User.get(id);
  if (!targetUser?.user)
    return player.notify(
      player.user.LangString("admin.5b54fc7991dcf55d69d74a3b4f92a69b")
    );
  const fullName = newName.join(" ");
  if (!newName || !fullName)
    return player.notify(
      player.user.LangString("admin.f8369c7f70262aab93d7314e4b949a8d")
    );
  targetUser.user.name = fullName;
});

gui.chat.registerCommand("czone", (player, fractionIdStr) => {
  if (!player.user) return;
  if (!player.user.hasPermission("admin:changeCaptZone")) return;

  const zoneId = getZoneAtPosition(player.position);
  if (!zoneId)
    return player.notify(
      player.user.LangString("admin.f0ce4c15e8c1b3dc4548b83b17716f73"),
      "error"
    );

  let fractionId = parseInt(fractionIdStr);
  if (!fractionId)
    return player.notify(
      player.user.LangString("admin.cbbf536edd63bbd0682c7b25a0ca6fca"),
      "error"
    );

  setZoneControl(zoneId, fractionId);
});

gui.chat.registerCommand("resetpassword", async (player, login) => {
  if (!player.user) return;
  if (!player.user.hasPermission("admin:resetpassword")) return;
  const acc = await AccountEntity.findOne({ where: { login } });
  if (!acc)
    return player.notify(
      player.user.LangString("admin.c4652fa80ad73bd13407cf425cab66b4"),
      "error"
    );
  acc.password = account.hashPassword("12345678");
  player.notify(
    player.user.LangString("admin.b93a9c4fab38537efb21d384f92eaf67", login)
  );
  await acc.save();
});

gui.chat.registerCommand("d", (player, strId, str) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;
  let d = parseInt(str);
  let id = parseInt(strId);
  const target = User.get(id);
  if (!target)
    return player.notify(
      player.user.LangString("admin.ef4eb098253e476aa9d39d8efa4e98c6")
    );
  if (isNaN(d) && isNaN(id))
    return player.notify(
      player.user.LangString(
        "admin.8a71df5b99c0afdd044048f4566f7770",
        player.dimension
      ),
      "success"
    );
  if (isNaN(d) || d < 0 || d > 9999999999999)
    return player.notify(
      player.user.LangString(
        "admin.ca314e22d94ad82f12557789eddde897",
        player.dimension
      ),
      "success"
    );
  target.dimension = d;
});

gui.chat.registerCommand("warn", async (player, strId, reason) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:useredit:givewarn")) return;
  const id = parseInt(strId);
  if (isNaN(id) || id < 1 || id > 99999999) return;
  if (!reason) return;
  const target = User.get(id);
  const data =
    target && target.user ? target.user.entity : await User.getData(id);
  if (!data) return;

  let warns = [...data.warns];
  warns.push({
    reason,
    admin: player.dbid,
    time: system.timestamp + 10 * 24 * 60 * 60,
  });
  data.warns = warns;
  if (mp.players.exists(player))
    player.notify(
      player.user.LangString("admin.012c595e56b23a13f8cb5e91391716ee"),
      "error"
    );
  if (target && mp.players.exists(target)) {
    target.notify(
      target.user.LangString("admin.8253d9e6eff8c33370cdd0a485fd6477"),
      "error"
    );
    if (target.user.fraction && !target.user.isLeader) {
      target.notify(
        target.user.LangString("admin.c04f5e376f7ba17190e7b538b853e821"),
        "error"
      );
      target.user.fraction = 0;
    }
  } else {
    data.fraction = 0;
    data.rank = 0;
    await data.save();
  }
  addAdminStats(user.id, "warn");
  user.log(
    "AdminJob",
    langStringDefault("admin.208945f081c95bc8917fa2d52205a622", reason),
    data.id
  );
  if (data.warns.length && data.warns.length % 3 === 0) {
    User.banUser(
      data.id,
      player,
      langStringDefault("admin.78343d60a32a9a9f940d9d7a918c193e"),
      system.timestamp + 10 * 24 * 60 * 60
    );
  }
});

gui.chat.registerCommand("ban", (player, str) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:useredit:banuser")) return;
  const id = parseInt(str);
  if (isNaN(id) || id < 1 || id > 99999999) return;
  banUser(player, id);
});

gui.chat.registerCommand("kick", (player, strId, strReason) => {
  const user = player.user;
  if (!user) return;
  if (!strReason) return;
  if (!user.hasPermission("admin:useredit:jail")) return;
  if (strReason.length < 5)
    return player.notify(
      player.user.LangString("admin.74329fc6fc4e71212538ea97c26b6e59"),
      "error"
    );
  const id = parseInt(strId);

  if (isNaN(id) || id < 1 || id > 99999999) return;
  const target = User.get(id);

  if (!mp.players.exists(target))
    return player.notify(
      player.user.LangString("admin.c13f6c6b639e39001e1823f309dba604"),
      "error"
    );
  User.kickUser(target, strReason, player);
});

gui.chat.registerCommand("aban", (player, str) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:useredit:banaccount")) return;
  const id = parseInt(str);
  if (isNaN(id) || id < 1 || id > 99999999) return;
  banAccount(player, id);
});

gui.chat.registerCommand("bring", (player, str) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return;
  const id = parseInt(str);
  if (isNaN(id) || id < 1 || id > 99999999) return;
  const target = User.get(id);
  if (!target)
    return player.notify(
      player.user.LangString("admin.e45eeb21c18ff3745e32d3183a65d870"),
      "error"
    );
  target.user.teleportVeh(
    player.position.x,
    player.position.y,
    player.position.z,
    player.heading,
    player.dimension
  );
});
gui.chat.registerCommand("revive", (player, str) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow(1)) return;

  const id = parseInt(str);
  if (isNaN(id) || id < 1 || id > 99999999) return;

  const target = User.get(id);
  if (!target || !target.user) {
    // return player.notify(player.user.LangString("admin.player_not_found"), "error");
    return player.notify("Nu s-a putut gasi jucatorul", "error");
  }

  target.user.adminRestore();
  player.notify(`Ai dat revive pe ${target.name}`, "success");
  user.log(
    "AdminJob",
    `A folosit /revive pe jucatorul ${target.dbid}`,
    target.dbid
  );
});

gui.chat.registerCommand("pm", (player, str, ...text) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return;
  const id = parseInt(str);
  if (isNaN(id) || id < 1 || id > 99999999) return;
  const target = User.get(id);
  if (!target)
    return player.notify(
      player.user.LangString("admin.7a180be8654bf36ad9ed2ba6f1c1f35a"),
      "error"
    );
  writeSpecialLog(`pm: ${text.join(" ")}`, player, target.user.id);
  writePersonalMessage(`pm: ${text.join(" ")}`, player, target.user.id);
  target.outputChatBox(
    target.user.LangString(
      "admin.faffed7e0e6f3c6b7a40b0abd533aaa3",
      user.name,
      user.id,
      text.join(" ")
    )
  );
  player.outputChatBox(
    player.user.LangString(
      "admin.cf215d088919d6664aac0ff2bfc7fd46",
      user.name,
      user.id,
      text.join(" ")
    )
  );
});

gui.chat.registerCommand("tpveh", (player, str) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return;
  const id = parseInt(str);
  if (isNaN(id) || id < 0 || id > 99999999) return;
  const target = mp.vehicles.at(id);
  if (!target)
    return player.notify(
      player.user.LangString("admin.04818d54ba3a534b5efc511518e76b16"),
      "error"
    );
  Vehicle.teleport(target, player.position, player.heading, player.dimension);
});

gui.chat.registerCommand("admins", (player) => {
  const user = player.user;
  if (!user) return;
  if (!user.admin_level) return;
  player.outputChatBox(
    player.user.LangString(
      "admin.8e7b203be86207710a817bb9785ad0d6",
      mp.players
        .toArray()
        .filter((q) => q.user && q.user.admin_level)
        .map(
          (q) => `${q.user.name} [#${q.user.id}] (${q.user.admin_level} LVL)`
        )
        .join(", ")
    )
  );
});

gui.chat.registerCommand("helpers", (player) => {
  const user = player.user;
  if (!user) return;
  if (!user.admin_level && !user.helper) return;
  player.outputChatBox(
    player.user.LangString(
      "admin.f7ab3145519363143210fdf1088b2497",
      mp.players
        .toArray()
        .filter((q) => q.user && q.user.helper)
        .map(
          (q) => `${q.user.name} [#${q.user.id}] (${q.user.helper_level} LVL)`
        )
        .join(", ")
    )
  );
});

// gui.chat.registerCommand("makeadmin", (player, str) => {
//     if(mp.config.announce) return;
//     if(!player.user) return;
//     let d = parseInt(str);
//     if(isNaN(d) || d < 0 || d > 6) return player.notify("Уровень админки допустим от 0 до 6", "error");
//     player.user.admin_level = d;
//     player.notify("Новый уровень админки: "+d, "success");
// })

let deathList: {
  id: number;
  name: string;
  pos: Vector3Mp;
  killerid?: number;
  killername?: string;
}[] = [];

mp.events.add("playerDeath", (player, reason?: number, killer?: PlayerMp) => {
  const user = player.user;
  if (!user) return;
  if (killer && killer.user)
    deathList.push({
      id: user.id,
      name: user.name,
      pos: player.position,
      killerid: killer.user.id,
      killername: killer.user.name,
    });
  else deathList.push({ id: user.id, name: user.name, pos: player.position });
});

CustomEvent.registerClient("admin:blacklist", (player) => {
  blmenu(player);
});

const blmenu = (player: PlayerMp) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:blacklist")) return;

  BlackListEntity.find().then((list) => {
    const m = menu.new(
      player,
      player.user.LangString("admin.7f9e0f697b4bd631aee1bfe169f551b7")
    );

    m.newItem({
      name: langStringDefault("admin.b052287c175967e9d2afaf4b31fa334f"),
      onpress: () => {
        menu.close(player);
        menu
          .input(
            player,
            player.user.LangString("admin.46e2c37d48d8057f87e41188e2237c65"),
            "",
            20
          )
          .then((social) => {
            if (!social) return;
            if (
              list.find(
                (q) => q.social_name.toLowerCase() === social.toLowerCase()
              )
            )
              return player.notify(
                player.user.LangString(
                  "admin.fad5b2b6521c19d00509aa96fb84feaf"
                ),
                "error"
              );
            menu
              .input(
                player,
                player.user.LangString(
                  "admin.e1a7b6a06d398bfb6e03335e71bbc206"
                ),
                "",
                250
              )
              .then((reason) => {
                if (!reason) return;
                const item = new BlackListEntity();
                item.time = system.timestamp;
                item.admin = `${user.name} (${user.id})`;
                item.social_name = social.toLowerCase();
                item.reason = reason;
                item.save().then((r) => {
                  if (mp.players.exists(player)) {
                    player.notify(
                      player.user.LangString(
                        "admin.5ce45416d19c82fea57269c34444e960"
                      )
                    );
                    blmenu(player);
                  }
                });
              });
          });
      },
    });

    list.map((item) => {
      m.newItem({
        name: item.social_name,
        more: `${system.timeStampString(item.time)}`,
        desc: `${item.admin} - ${item.reason}`,
        onpress: () => {
          menu
            .accept(
              player,
              player.user.LangString("admin.ef59fb91ebc42bf19abe8bdad17ccbc8"),
              "small"
            )
            .then((status) => {
              if (!status) return;
              BlackListEntity.remove(item).then(() => {
                blmenu(player);
              });
            });
        },
      });
    });
    m.open();
  });
};

CustomEvent.registerCef(
  "admin:spectate:next",
  (player, id: number, history: number[] = []) => {
    const target = User.get(id);
    if (!target)
      return player.notify(
        player.user.LangString("admin.c1854c0ff68087d69c4ef3099bae7be0"),
        "error"
      );
    const newtarget = system.sortArrayObjects(
      User.getNearestPlayers(target, 100)
        .filter((q) => !history.includes(q.id) && q.id != player.dbid)
        .map((q) => {
          return {
            id: q.id,
            dist: system.distanceToPos(q.position, target.position),
          };
        }),
      [{ id: "dist", type: "ASC" }]
    );
    if (newtarget.length === 0)
      return player.notify(
        player.user.LangString("admin.2263c26e21dfe68ff6f727b9e5928e87"),
        "error"
      );
    startSpectate(player, newtarget[0].id);
  }
);

const startSpectate = (player: PlayerMp, id: number) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return player.call("admin:spectate:stop");
  if (id === user.id)
    return player.notify(
      player.user.LangString("admin.efaacf425065422fee62331e0ce8de2d"),
      "error"
    );
  const target = User.get(id);
  if (!target)
    return player.notify(
      player.user.LangString("admin.41e206574ed8f9d0112996a1992d7ff7"),
      "error"
    );
  const tuser = target.user;
  if (!player.user.spectatePos)
    player.user.spectatePos = [
      player.position.x,
      player.position.y,
      player.position.z,
      player.dimension,
    ];
  player.dimension = target.dimension;
  player.alpha = 0;
  CustomEvent.triggerClient(
    player,
    "admin:sp",
    [target.position.x, target.position.y, target.position.z],
    target.id,
    tuser.id
  );
};

CustomEvent.registerClient("admin:spectate:problem", (player, id: number) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return;
  const target = User.get(id);
  if (!target) {
    return player.call("admin:spectate:stop");
  }
  startSpectate(player, id);
});
CustomEvent.registerClientAndCef(
  "admin:spectate:stop",
  (player, returnMe = true, tpHim = false, id?: number) => {
    const user = player.user;
    if (!user) return;
    player.alpha = 255;
    if (!user.spectatePos) return;
    if (returnMe) {
      user.teleport(
        user.spectatePos[0],
        user.spectatePos[1],
        user.spectatePos[2],
        0,
        user.spectatePos[3],
        true
      );
      user.spectatePos = null;
    } else {
      const target = User.get(id);
      if (target)
        user.teleport(
          target.position.x,
          target.position.y,
          target.position.z,
          0,
          target.dimension,
          true
        );
      else
        user.teleport(
          user.spectatePos[0],
          user.spectatePos[1],
          user.spectatePos[2],
          0,
          user.spectatePos[3],
          true
        );
    }
    if (!tpHim) return;
    const target = User.get(id);
    if (!target) return;
    target.user.teleport(
      user.spectatePos[0],
      user.spectatePos[1],
      user.spectatePos[2],
      0,
      user.spectatePos[3],
      true
    );
  }
);

gui.chat.registerCommand("sp", (player, ids) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return;
  const id = parseInt(ids);
  const target = User.get(id);
  if (!target)
    return player.notify(
      player.user.LangString("admin.bec26b12d1ea00fdf17f3f03a26523cc"),
      "error"
    );
  if (
    mp.config.announce &&
    target.user.admin_level === 6 &&
    player.user.admin_level < 5
  )
    return player.notify(
      player.user.LangString("admin.166223630acced6347fb2dacb5d539d9")
    );
  startSpectate(player, id);
});

// gui.chat.registerCommand("spoff", (player) => {
//     const user = player.user;
//     if (!user) return;
//     if (!user.isAdminNow()) return;

//     player.call("admin:spectate:stop", [true, false]); // returnMe = true, tpHim = false
//     player.notify("Ai iesit din modul spectate.", "success");
// });

CustomEvent.registerClient("death:log", (player) => {
  const user = player.user;
  if (!user) return;
  if (!user.isAdminNow()) return;
  const m = menu.new(
    player,
    player.user.LangString("admin.71c3a8ed6380881f693a522deabc7f8e")
  );
  deathList
    .filter((q) => system.distanceToPos(q.pos, player.position) < 100)
    .map((item) => {
      m.newItem({
        name: `${item.name} [#${item.id}]`,
        more: `${
          item.killerid ? `${item.killername} [#${item.killerid}]` : ""
        }`,
        onpress: () => {
          user.setWaypoint(item.pos.x, item.pos.y, item.pos.z);
        },
      });
    });

  m.open();
});

CustomEvent.registerClient("admin:x2func", (player) => {
  x2funcmenu(player);
});

CustomEvent.registerClient("admin:familyControl", (player) => {
  if (player.user && player.user.hasPermission("admin:familyControl"))
    showFamilyAdminMenu(player);
});

CustomEvent.registerClient("admin:paydayglobal", (player) => {
  const user = player.user;
  if (!user.hasPermission("admin:paydayglobal")) return;
  payDayGlobal(false);
  player.notify(
    player.user.LangString("admin.b1ab8969afb9c182ce71e4c8650d43f0")
  );
});

CustomEvent.registerClient("admin:allheal", (player) => {
  const user = player.user;
  if (!user.hasPermission("admin:allheal")) return;
  const users = user.getNearestPlayers(50);
  users.map((target) => {
    if (mp.players.exists(target) && target.user) target.user.health = 100;
  });
});

CustomEvent.registerClient(
  "admin:global:notify",
  (player, text: string, dimensionFilter = false) => {
    const user = player.user;
    if (!user.hasPermission("admin:global:notify")) return;
    mp.players
      .toArray()
      .filter((q) => !dimensionFilter || player.dimension === q.dimension)
      .map((target) => {
        if (mp.players.exists(target))
          target.outputChatBox(
            `!{ff0000}[${gui.chat.getTime()}] Administrator ${
              player.user.name
            }: ${escape(text)}`
          );
      });
  }
);

CustomEvent.registerClient(
  "admin:globalevent:notify",
  (player, text: string, dimensionFilter = false) => {
    const user = player.user;
    if (!user.hasPermission("admin:global:notify")) return;
    mp.players
      .toArray()
      .filter((q) => !dimensionFilter || player.dimension === q.dimension)
      .map((target) => {
        if (mp.players.exists(target))
          target.outputChatBox(
            `!{fcba03}[${gui.chat.getTime()}] (${
              player.user.name
            }): Event ${escape(text)}`
          );
      });
  }
);

const x2funcmenu = (player: PlayerMp) => {
  const user = player.user;
  if (!user.hasPermission("admin:x2func")) return;
  const m = menu.new(
    player,
    player.user.LangString("admin.fe0cd5b79459bfc4725c8bc3301a5983")
  );
  m.newItem({
    name: langStringDefault("admin.037de9a46ac9673c30ccd43ffc7031a2"),
    more: `${
      User.x2func.data[0].donate
        ? langStringDefault("admin.21fc9d13674266666a56f3e752dcf76b")
        : langStringDefault("admin.95b77fe12904dff61234faba4178f32f")
    }`,
    onpress: () => {
      User.x2func.data[0].donate = !User.x2func.data[0].donate;
      player.notify(
        `${
          User.x2func.data[0].donate
            ? player.user.LangString("admin.5e71e12c49a81c5b3baa53921e68e305")
            : player.user.LangString("admin.eca5078b635f0999fa2bd035f3605aad")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.7b66118ae98e96cff6d51147ad233fbd"),
    more: `${
      User.x2func.data[0].exp
        ? langStringDefault("admin.bd94e51707854740578463cd0e8aa6d3")
        : langStringDefault("admin.68781dc7d5eada545da5d4c44a1e6f76")
    }`,
    onpress: () => {
      User.x2func.data[0].exp = !User.x2func.data[0].exp;
      player.notify(
        `${
          User.x2func.data[0].exp
            ? player.user.LangString("admin.1e6b1fed9f623b7c270b7b26cd034017")
            : player.user.LangString("admin.951417becc13fac8ed60b2a2147530d3")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.dc43bd3efd0369a2e1ccb619c404059e"),
    more: `${
      User.x2func.data[0].donate3
        ? langStringDefault("admin.342d467337e4a4f90bdef0855948a2c0")
        : langStringDefault("admin.36e4a986ad01a03080232fd03720b09e")
    }`,
    onpress: () => {
      User.x2func.data[0].donate3 = !User.x2func.data[0].donate3;
      player.notify(
        `${
          User.x2func.data[0].donate3
            ? player.user.LangString("admin.2058eb6c8b33ce291eafa6227ef7ca27")
            : player.user.LangString("admin.56391761b015d8a9cc253cc11c4b0142")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.fb1ed5e116b57537612e93b4e08dc65d"),
    more: `${
      User.x2func.data[0].exp3
        ? langStringDefault("admin.5be45c3b5f24f989eb67d8a490abed09")
        : langStringDefault("admin.a4a4419197ad4ee11fcdd13c62d29ccb")
    }`,
    onpress: () => {
      User.x2func.data[0].exp3 = !User.x2func.data[0].exp3;
      player.notify(
        `${
          User.x2func.data[0].exp3
            ? player.user.LangString("admin.a0726b8e3624ba58d0c098322d608209")
            : player.user.LangString("admin.d4d93b4a98cd8bd6de675210c9fccc6c")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.0f8364d58c66cbe34a7afe05adccaf79"),
    more: `${
      User.x2func.data[0].job
        ? langStringDefault("admin.5127d669349b1c008bd8bd110510c6c2")
        : langStringDefault("admin.dc9c2b9ebf237779df004960378e1696")
    }`,
    onpress: () => {
      User.x2func.data[0].job = !User.x2func.data[0].job;
      player.notify(
        `${
          User.x2func.data[0].job
            ? player.user.LangString("admin.b359347570324b43917069351198edd6")
            : player.user.LangString("admin.3528dbf4857156d60e07fb23af70dcc4")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault(
      "admin.59ee1f0a87bbd38abcce7dd556768014",
      PLAYTIME_TIME
    ),
    more: `${
      User.x2func.data[0].playtime
        ? langStringDefault("admin.72a00cc8f35fea9e60a10fd9ca1e4ac2")
        : langStringDefault("admin.7b69cbbfb8b081a67f7be650856fdf06")
    }`,
    desc: langStringDefault("admin.1f93f6b6a69b6ba589ec4e96731976e2"),
    onpress: () => {
      User.x2func.data[0].playtime = !User.x2func.data[0].playtime;
      player.notify(
        `${
          User.x2func.data[0].playtime
            ? player.user.LangString("admin.c6d6f8840788a7ee8ffd81513cbc266e")
            : player.user.LangString("admin.6b4152904ada0443049cea1963d1a03f")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  const cfgcar = Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX);
  m.newItem({
    name: langStringDefault(
      "admin.63c95415d1138d443f7aeddce12749d5",
      Math.floor(MINUTES_FOR_PLAY_REWARD_MAX / 60),
      cfgcar
        ? Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX).name
        : langStringDefault("admin.9b69410b039eadb626751cfe019db0c5")
    ),
    more: `${
      User.x2func.data[0].playtimecar
        ? langStringDefault("admin.19a0f6ded45a8a719fa2430de80c7626")
        : langStringDefault("admin.dc0b6276719997d5cc3cc949695d0dd1")
    }`,
    desc: langStringDefault("admin.73b1461b927fbfb78571d6824fd89b37"),
    onpress: () => {
      User.x2func.data[0].playtimecar = cfgcar
        ? !User.x2func.data[0].playtimecar
        : false;
      player.notify(
        `${
          User.x2func.data[0].playtimecar
            ? player.user.LangString("admin.d02523246dce2c786b2b4214ad67a169")
            : player.user.LangString("admin.b2490565bad428ea6947f66d7ee87f53")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.c87c31a089c5e070a61e01fe2cab6dae"),
    more: `${
      User.x2func.data[0].enabledonate
        ? langStringDefault("admin.9a8e87f7ec363e4cb4b0cd2f08f6b29e")
        : langStringDefault("admin.7ee032ed5b29b18ecd52ebe2bd210083")
    }`,
    onpress: () => {
      User.x2func.data[0].enabledonate = !User.x2func.data[0].enabledonate;
      player.notify(
        `${
          User.x2func.data[0].enabledonate
            ? player.user.LangString("admin.0178475c11ff89ebd9e657c53f275954")
            : player.user.LangString("admin.93746e6c34146199dc69d97cb9d0fc12")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.dc5479f38b14e0c489f6765e741598b8"),
    more: `${
      User.x2func.data[0].taxes
        ? langStringDefault("admin.21914081aaa6e7f274a7a43aaf7c8573")
        : langStringDefault("admin.84710062a5758a153ce11697ac46aa90")
    }`,
    onpress: () => {
      User.x2func.data[0].taxes = !User.x2func.data[0].taxes;
      player.notify(
        `${
          User.x2func.data[0].taxes
            ? player.user.LangString("admin.5569ffe811b1a681e505442c3e9bc30e")
            : player.user.LangString("admin.0652b3ac8ce0cb4682045c22db0e1e60")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.4d2576b1acfc03267ba9d2fe564a568a"),
    more: `${
      User.x2func.data[0].logoff
        ? langStringDefault("admin.ea9c49f2453491d5e305099b3ccbe1f1")
        : langStringDefault("admin.25f6092395526c631f6400d77d675f97")
    }`,
    onpress: () => {
      User.x2func.data[0].logoff = !User.x2func.data[0].logoff;
      player.notify(
        `${
          User.x2func.data[0].logoff
            ? player.user.LangString("admin.27bb7df8d3a51e22cc84978b34e7ca7d")
            : player.user.LangString("admin.b982867bbdbf116b1d0e7c396e236533")
        }`
      );
      User.x2func.save();
      x2funcmenu(player);
    },
  });
  m.newItem({
    name: langStringDefault("admin.e2283839a673a10a2477baaeb03f0f5f"),
    more: `${
      system.debug.debugShow
        ? langStringDefault("admin.70c6e9d88c576a12f277f6967c51e576")
        : langStringDefault("admin.02b6c473a8e5ad88e2b96f308ef7da91")
    }`,
    onpress: () => {
      system.debug.showDebug(!system.debug.debugShow);
      player.notify(
        `${
          system.debug.debugShow
            ? langStringDefault("admin.32d914f286b43b2078f287bcaaa12194")
            : langStringDefault("admin.a4626027fbea0f304b3bcda429bbe276")
        }`
      );
      x2funcmenu(player);
    },
  });
  m.open();
};

gui.chat.registerCommand("clearplaytime", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow(6))
    return player.notify(
      player.user.LangString("admin.7181d443ac5419589cd77793e4943c1c"),
      "error"
    );

  clearExpiredPlayTime();
});

gui.chat.registerCommand("car", (player, model) => {
  if (!player.user) return;
  if (!player.user.isAdminNow())
    return player.notify(
      player.user.LangString("admin.ba3af31b065c84c46ee6871fd3eac42b"),
      "error"
    );

  let veh = Vehicle.spawn(
    model,
    player.position,
    player.heading,
    player.dimension,
    true,
    false
  );
  player.user.log(
    "AdminJob",
    langStringDefault(
      "admin.886688d9bfa410418d3d6ba3875bbd76",
      player.position.x.toFixed(1),
      player.position.y.toFixed(1),
      player.position.z.toFixed(1),
      model
    )
  );
  setTimeout(() => {
    if (!mp.players.exists(player)) return;
    player.user.putIntoVehicle(veh, 0);
  }, 300);
});

gui.chat.registerCommand("tp", (player, str, str2, str3) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;
  if (str2 && str3) {
    const x = parseFloat(str);
    const y = parseFloat(str2);
    const z = parseFloat(str3);
    if (!x && !y && !z)
      return player.notify(
        player.user.LangString("admin.4b53d387d3eb579e503238f1ce5711d1"),
        "error"
      );
    player.user.teleport(x, y, z);
    return;
  }
  let d = parseInt(str);
  if (isNaN(d) || d < 0 || d > 9999999999999)
    return player.notify(
      player.user.LangString("admin.3a9693485cdd70814ccbd3a3953e01b1"),
      "error"
    );
  let target = User.get(d);
  if (!target)
    return player.notify(
      player.user.LangString("admin.821cc96dc209d2d231a0237fe95b9b91"),
      "error"
    );
  if (
    mp.config.announce &&
    target.user.admin_level === 6 &&
    player.user.admin_level < 6
  )
    return player.notify(
      player.user.LangString("admin.33f3c9ae13849be79876bb6206680316")
    );
  player.user.teleport(
    target.position.x,
    target.position.y,
    target.position.z,
    target.heading,
    target.dimension
  );
});

gui.chat.registerCommand("tpped", (player, str) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;
  let d = parseInt(str);
  if (isNaN(d) || d < 0 || d > 9999999999999)
    return player.notify(
      player.user.LangString("admin.9ba5d04c3ae246d8dc19fba0b4ec0316"),
      "error"
    );
  let target = mp.peds.at(d);
  if (!target)
    return player.notify(
      player.user.LangString("admin.a414f4832aad803e9fb66f3d4a858957"),
      "error"
    );
  player.user.teleport(
    target.position.x,
    target.position.y,
    target.position.z,
    0,
    target.dimension
  );
});

gui.chat.registerCommand("night", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;
  CustomEvent.triggerCefAll("notify:doomsdayNight");
});

gui.chat.registerCommand("fullhp", (player, str) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;

  let d = parseInt(str);
  if (isNaN(d) || d < 0 || d > 9999999999999)
    return player.notify(
      player.user.LangString("admin.e81072bf1497675edd074d55891bd32d"),
      "error"
    );
  let target = User.get(d);
  if (!target)
    return player.notify(
      player.user.LangString("admin.3f71c8b6dcce77eae0153ef77df68539"),
      "error"
    );
  target.user.health = 100;
});
gui.chat.registerCommand("kill", (player, str) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;

  let d = parseInt(str);
  if (isNaN(d) || d < 0 || d > 9999999999999)
    return player.notify(
      player.user.LangString("admin.ce89cc26e62b828955426d7244aecafd"),
      "error"
    );
  let target = User.get(d);
  if (!target)
    return player.notify(
      player.user.LangString("admin.33244891a5eb35ac6b0896cc48c300ea"),
      "error"
    );
  target.user.health = 0;
});
gui.chat.registerCommand("tpveh", (player, str) => {
  if (!player.user) return;
  if (!player.user.isAdminNow()) return;
  let d = parseInt(str);
  const veh = mp.vehicles.at(d);
  if (!mp.vehicles.exists(veh))
    return player.notify(
      player.user.LangString("admin.a414d40323d0389896b107f4b671c019"),
      "error"
    );
  Vehicle.teleport(veh, player.position, player.heading, player.dimension);
});
gui.chat.registerCommand("dv", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow(6)) return;

  const veh = player.vehicle; // vehiculul în care se află jucătorul
  if (!veh || !mp.vehicles.exists(veh)) {
    return player.notify("Nu esti intr-un vehicul!", "error");
  }

  Vehicle.respawn(veh, false); // respawn fără repair
  player.notify("Vehicul respawnat!", "success");
});

gui.chat.registerCommand("fix", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow(6)) return;

  const veh = player.vehicle;
  if (!veh || !mp.vehicles.exists(veh)) {
    return player.notify("Nu esti intr-un vehicul!", "error");
  }

  // repară vehiculul complet
  Vehicle.repair(veh, true); // repară șasiu + motor
  Vehicle.setFuel(veh, Vehicle.getFuelMax(veh)); // full tank

  // resetează rotația dacă jucătorul e șofer sau vehiculul e gol
  if (veh.getOccupants().length === 0 || veh.getOccupant(0) === player) {
    veh.rotation = new mp.Vector3(0, 0, veh.rotation.z);
  }

  player.notify("Vehiculul a fost reparat complet!", "success");
});
// const ADMIN_CLOTHES: Record<"male" | "female", [number, number, number][]> = {
// 	male: [
// 		[11, 14, 0], // torso
// 		[9, 2, 0],   // undershirt
// 		[4, 50, 0],  // pants
// 	],
// 	female: [
// 		[11, 6, 0],
// 		[4, 2, 0],
// 	],
// };

// CustomEvent.registerClient("enableAdmin", (player, status: boolean) => {
// 	if (!player.user) return;
// 	if (!player.user.admin_level) return;

// 	player.setVariable("enabledAdmin", !!status);
// 	SendUpdate(player, "admin");

// 	if (status) {
// 		console.log(`[ADMIN] ${player.name} -> Activating admin mode...`);
// 		CargoBattleFamilyQuest.all.forEach(q => q.addPlayer(player));

// 		setTimeout(() => {
// 			const gender = player.isMale ? "male" : "female";
// 			console.log(`[ADMIN] Applying admin outfit for ${gender} (${player.name})`);

// 			const clothes = ADMIN_CLOTHES[gender];
// 			for (const [component, drawable, texture] of clothes) {
// 				player.setClothes(component, drawable, texture, 2);
// 				console.log(`[ADMIN] setClothes(${component}, ${drawable}, ${texture}, 2)`);
// 			}
// 		}, 1000); // Delay 1s to ensure ped is fully loaded
// 	} else {
// 		console.log(`[ADMIN] ${player.name} -> Deactivating admin mode, restoring outfit.`);
// 		player.user.reloadDress();
// 	}
// });
const ADMIN_CLOTHES: { [key: string]: [number, number, number][] } = {
  male: [
    [3, 0, 0],
    [8, 0, 0],
    [11, 720, 2],
    [1, 0, 0],

    [4, 4, 0],
    [5, 0, 0],
    [6, 42, 0],
    [7, 0, 0],
    [9, 117, 0],
    [101, 0, 0],
    [102, 0, 0],
    [106, 0, 0],
    [107, 0, 0],
    [1000, 0, 0],
  ],
  female: [
    [11, 6, 0],
    [4, 2, 0],
  ],
};

CustomEvent.registerClient("enableAdmin", (player, status: boolean) => {
  if (!player.user) return;
  if (!player.user.admin_level) return;
  player.setVariable("enabledAdmin", !!status);
  SendUpdate(player, "admin");
  if (status) {
    CargoBattleFamilyQuest.all.forEach((q) => q.addPlayer(player));

    for (let [key, value] of Object.entries(
      ADMIN_CLOTHES[player.user.male ? "male" : "female"]
    )) {
      player.setClothes(value[0], value[1], value[2], 2);
    }
  } else {
    player.user.reloadDress();
  }
});

// CustomEvent.registerClient("admin:spawn:vehicle", (player, model: string, spawnMethoodSelect: number, headerSelect: number) => {
//     if (!player.user) return;
//     if (!player.user.isAdminNow()) return player.notify(player.user.LangString("admin.7b8f11b47e8519eed2d24ff0870544e9"), "error");

//     let veh = Vehicle.spawn(model, player.position, !headerSelect ? player.heading : headerSelect, player.dimension, true, false);

//     // ✅ Fortam culoarea alba (Frost White = 111)
//     try {
//         if (veh.setColours) veh.setColours(111, 111);
//         if (veh.setModColor1) veh.setModColor1(111, 111, 0);
//         if (veh.entity?.setColours) veh.entity.setColours(111, 111);
//         if (veh.entity?.setModColor1) veh.entity.setModColor1(111, 111, 0);
//     } catch (e) {
//         console.log("[admin:spawn:vehicle] Nu s-a putut seta culoarea:", e);
//     }

//     player.user.log(
//         "AdminJob",
//         langStringDefault(
//             "admin.8c2bd2aea3afce89bcf25842deb9f1a3",
//             player.position.x.toFixed(1),
//             player.position.y.toFixed(1),
//             player.position.z.toFixed(1),
//             model
//         )
//     );

//     setTimeout(() => {
//         if (!mp.players.exists(player)) return;
//         if (spawnMethoodSelect) return;
//         player.user.putIntoVehicle(veh, 0);
//     }, 300);
// });

CustomEvent.registerClient(
  "admin:spawn:vehicle",
  (player, model: string, spawnMethoodSelect: number, headerSelect: number) => {
    if (!player.user) return;
    if (!player.user.isAdminNow())
      return player.notify(
        player.user.LangString("admin.7b8f11b47e8519eed2d24ff0870544e9"),
        "error"
      );
    let veh = Vehicle.spawn(
      model,
      player.position,
      !headerSelect ? player.heading : headerSelect,
      player.dimension,
      true,
      false
    );
    player.user.log(
      "AdminJob",
      langStringDefault(
        "admin.8c2bd2aea3afce89bcf25842deb9f1a3",
        player.position.x.toFixed(1),
        player.position.y.toFixed(1),
        player.position.z.toFixed(1),
        model
      )
    );
    setTimeout(() => {
      if (!mp.players.exists(player)) return;
      if (spawnMethoodSelect) return;
      player.user.putIntoVehicle(veh, 0);
    }, 300);
  }
);
CustomEvent.registerClient(
  "admin:gamedata:newhouse",
  (player, model: string) => {
    if (!player.user) return;
    if (!player.user.hasPermission("admin:gamedata:newhouse"))
      return player.notify(
        player.user.LangString("admin.5f7a5128d888be7ad4e320f9caeb3f06"),
        "error"
      );
    houses.createNewHouseMenu(player);
  }
);
CustomEvent.registerClient("admin:inventory:create", (player, id: number) => {
  if (!player.user) return;
  if (!player.user.isAdminNow())
    return player.notify(
      player.user.LangString("admin.f53570ef89635dfffd015ed7d3693655"),
      "error"
    );
  let user = player.user;
  if (!user.hasPermission("admin:inventory:create"))
    return player.notify(
      player.user.LangString("admin.5aad49111d63993206984e2b61f626d5"),
      "error"
    );
  let itmCfg = inventoryShared.get(id);
  if (!itmCfg)
    return player.notify(
      player.user.LangString("admin.bc2367afb348a316a1c836dbc65f4f2d"),
      "error"
    );
  inventory
    .createItem({
      owner_type: OWNER_TYPES.PLAYER,
      owner_id: user.id,
      item_id: id,
      serial: `ADMIN_${user.id}_${system.getTimeStamp()}`,
    })
    .then((result) => {
      player.notify(
        player.user.LangString("admin.5d21cf211c2b77a49a19a6fe10f41b0f"),
        "success"
      );
    })
    .catch((err) => {
      player.notify(
        player.user.LangString("admin.5d13a980c3287576cb9e55ad60375c85", err),
        "error"
      );
    });
});
CustomEvent.registerClient("admin:reconnect", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow())
    return player.notify(
      player.user.LangString("admin.f5d0f28c5ea27a32b7f407989d8d5f18"),
      "error"
    );
  player.kickSilent(
    player.user.LangString("admin.84b255dc1d92262a0b2a46c330209058")
  );
});

CustomEvent.registerClient("admin:quit", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow())
    return player.notify(
      player.user.LangString("admin.e0b87a35da460a1df3c138d3892642c8"),
      "error"
    );
  player.kick(player.user.LangString("admin.018f6433b60dcfb4575ffa0e4d4a3c21"));
});
CustomEvent.registerClient("admin:users:choice", (player, id: number) => {
  userChoise(player, id);
});

const jailUser = async (
  player: PlayerMp,
  id: number,
  min: number = null,
  reason: string = null,
  isCalledFromMenu = true
) => {
  if (!player.user) return;
  if (!player.user.admin_level)
    return player.notify(
      player.user.LangString("admin.78721c2d37b6de7708d607783cd4e067"),
      "error"
    );
  let user = player.user;
  let target = User.get(id);
  let data: UserEntity;
  let dataaccount: AccountEntity;
  try {
    data = target && target.user ? target.user.entity : await User.getData(id);
    dataaccount =
      target && target.user
        ? target.user.account
        : await User.getDataAccount(data.accountId);
  } catch (error) {
    // console.error(error);
  }
  if (!mp.players.exists(player)) return;
  if (!data)
    return player.notify(
      player.user.LangString("admin.27f7e8a1509839c09a21add3f5680ace"),
      "error"
    );
  if (mp.players.exists(target) && target.user.isAdminNow())
    return player.notify(
      player.user.LangString("admin.62893ad981d07bd246145e882a117a2a"),
      "error"
    );
  if (data.jail_time_admin)
    player.notify(
      player.user.LangString("admin.6297db394942397c39d3c91c0244743e"),
      "success"
    );

  if (!min) {
    const minutesInputResult = await menu.input(
      player,
      player.user.LangString("admin.c01621ec4668b8e6622bef80202bfc81"),
      10,
      4,
      "int"
    );
    if (!minutesInputResult) {
      return;
    }

    min = minutesInputResult as number;
  }

  if (min <= 0)
    return player.notify(
      player.user.LangString("admin.a7d4053e507ae63ba46b4950ff5129b2")
    );
  if (min > JAIL_ADMIN_MAX_MIN && !user.isAdminNow(5))
    return player.notify(
      player.user.LangString(
        "admin.f33b917d58516abe42f59cdd3ddf3ac9",
        JAIL_ADMIN_MAX_MIN
      ),
      "error"
    );
  if (min > 9999999)
    return player.notify(
      player.user.LangString("admin.8cfa9ae41452edbbdedadd1c27a5836f"),
      "error"
    );

  if (!reason) {
    reason = await menu.input(
      player,
      player.user.LangString("admin.4abba0e98eaab9e6a8bc7bff7c7141e0"),
      "",
      60
    );
  }

  if (mp.players.exists(target)) {
    player.notify(
      player.user.LangString(
        "admin.29d86312cb8aab51729b2a3be1e0b53d",
        target.user.jail_time_admin
          ? player.user.LangString("admin.2ace678a1d6f137843f3ece61629b0fd")
          : player.user.LangString("admin.49aee0f063ecd526fb262f7836976fb2")
      ),
      "error"
    );
    target.user.jailAdmin(player, min * 60, reason);
  } else {
    player.notify(
      player.user.LangString(
        "admin.fe56382802fa14c963d1eed6bef0d0eb",
        data.jail_time_admin
          ? player.user.LangString("admin.e6f21433f9861f10d842846863d70383")
          : player.user.LangString("admin.3801a1764c622d0d8b9b7289ad7823b9")
      ),
      "success"
    );
    data.jail_time_admin = min * 60;
    data.jail_reason_admin = `${reason} / ${user.name} (${user.id})`;
    saveEntity(data);
  }

  if (isCalledFromMenu) {
    userChoise(player, id);
  }

  user.log(
    "AdminJob",
    langStringDefault("admin.4ec6d68bf56fa789a3ad35591e5a683b", min, reason),
    data.id
  );
  addAdminStats(user.id, "jail");
};

const unjailUser = async (player: PlayerMp, id: number) => {
  if (!player.user) return;
  if (!player.user.admin_level)
    return player.notify(
      player.user.LangString("admin.6c43a187b602a27a07796ab54afbe08b"),
      "error"
    );
  let user = player.user;
  let target = User.get(id);
  let data: UserEntity;
  let dataaccount: AccountEntity;
  try {
    data = target && target.user ? target.user.entity : await User.getData(id);
    dataaccount =
      target && target.user
        ? target.user.account
        : await User.getDataAccount(data.accountId);
  } catch (error) {
    // console.error(error);
  }
  if (!mp.players.exists(player)) return;
  if (!data)
    return player.notify(
      player.user.LangString("admin.784eaaa98576f8a24eaabea14586bad1"),
      "error"
    );

  if (!data.jail_time_admin)
    return player.notify(
      player.user.LangString("admin.7e9d29f94e1798725a6f7995f81e4250"),
      "success"
    );
  user.log(
    "AdminJob",
    langStringDefault(
      "admin.10c49e03739aa994cca003ee6af14e00",
      data.jail_time_admin,
      data.jail_reason_admin
    ),
    data.id
  );
  player.notify(
    player.user.LangString("admin.fed51a1df9668de5d3b0a3242c45d04b"),
    "success"
  );
  if (target && mp.players.exists(target)) {
    target.user.jail_time_admin = 0;
    target.user.jail_reason_admin = null;
    target.user.save();
    target.user.jailSync();
    userChoise(player, id);
  } else {
    player.notify(
      player.user.LangString(
        "admin.f5ea18d178b61bf1e142e9442fe2c1f3",
        data.jail_time_admin
          ? player.user.LangString("admin.5ccf836ae88631b60737df38a048750a")
          : player.user.LangString("admin.3544a8c464da4d682aaac92291e797a6")
      ),
      "success"
    );
    data.jail_time_admin = 0;
    data.jail_reason_admin = "";
    data.save().then(() => {
      userChoise(player, id);
    });
  }
};

const banUser = async (player: PlayerMp, id: number) => {
  if (!player.user) return;
  if (!player.user.admin_level)
    return player.notify(
      player.user.LangString("admin.5c8e3be77914391e7effde44db5d4ccf"),
      "error"
    );
  let user = player.user;
  let target = User.get(id);
  let data: UserEntity;
  let dataaccount: AccountEntity;
  try {
    data = target && target.user ? target.user.entity : await User.getData(id);
    dataaccount =
      target && target.user
        ? target.user.account
        : await User.getDataAccount(data.accountId);
  } catch (error) {
    // console.error(error);
  }
  if (!mp.players.exists(player)) return;
  if (!data)
    return player.notify(
      player.user.LangString("admin.9003e6cacce8dee2034b69fdfcb5c6c2"),
      "error"
    );

  let banhours = 0;
  let bandays = 0;
  let banmonths = 0;
  let banreason = "";
  const s = () => {
    if (data.admin_level > user.admin_level)
      return player.notify(
        player.user.LangString("admin.adf0ed6c29c409fd947de32f4def945c"),
        "error"
      );
    const submenu = menu.new(
      player,
      player.user.LangString("admin.b1119b0d2f8779aa7f6c4e7e76f721ca"),
      player.user.LangString("admin.1b63003116d0acc6aa87e2df2e61733e")
    );
    submenu.onclose = () => {
      userChoise(player, id);
    };
    if (data.ban_end > system.timestamp) {
      submenu.newItem({
        name: langStringDefault("admin.38a8cc6dfc2e18ff601da7dff3f102f9"),
        onpress: () => {
          menu.accept(player).then((status) => {
            if (!status) return;
            user.log(
              "AdminBan",
              langStringDefault(
                "admin.b928f1cbdfdc6c37f7cd5ad3c61b1c7f",
                data.ban_admin,
                system.timeStampString(data.ban_end),
                data.ban_reason
              ),
              data.id
            );
            data.ban_end = 0;
            data.ban_admin = 0;
            data.ban_reason = null;
            data.save().then(() => {
              if (!mp.players.exists(player)) return;
              player.notify(
                player.user.LangString("admin.f6c2aa6ba6aedfc3a7fb2b1710566a80")
              );
              s();
            });
          });
        },
      });
    }
    submenu.newItem({
      name: langStringDefault("admin.fd7afaa1d28bafac9507e98410704876"),
      onpress: () => {
        player.notify(
          player.user.LangString("admin.a7facaf20b40b19aa856d141d9fde51c")
        );
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.6de6add520d55159c9d4b2f9f7d3fbb1"),
      more: banreason
        ? langStringDefault("admin.c9b0ff70a957fb8a1d40619ae60a6983")
        : langStringDefault("admin.dd8a8a1d3f33961b1b9c1a477e44278e"),
      onpress: () => {
        menu
          .input(
            player,
            player.user.LangString("admin.81d5a12ca3006a57809afe7b4eaf1064"),
            "",
            400,
            "text"
          )
          .then((reason) => {
            if (!reason) return;
            banreason = reason;
            s();
          });
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.8115bddfea5f7d0a34c9a2eb2dc31ac4"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banhours,
      desc: langStringDefault("admin.dd97ea3e9975b69c39797b4a1c979089"),
      onchange: (val) => {
        banhours = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.f9ef4b9cebc8611b880c771fb1b63fa2"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: bandays,
      desc: langStringDefault("admin.8281b42ff386a4f13c18cd5e3b864df9"),
      onchange: (val) => {
        bandays = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.fffb26a32671e7209422b9db9a8cf4fc"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banmonths,
      desc: langStringDefault("admin.30edce4ede5843b35b7fc6cd705a56d3"),
      onchange: (val) => {
        banmonths = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.ec6d1bf65538581cf0b1c23c36fdfce5"),
      onpress: () => {
        if (!banreason)
          return player.notify(
            player.user.LangString("admin.0aa95a7019cd28f70021c19678faf93e"),
            "error"
          );
        if (banhours + bandays + banmonths === 0)
          return player.notify(
            player.user.LangString("admin.ca19d0284438e6aab906d6a79c2417c5"),
            "error"
          );
        let endtime =
          system.timestamp +
          banhours * 60 * 60 +
          bandays * 24 * 60 * 60 +
          banmonths * 30 * 24 * 60 * 60;
        menu
          .accept(
            player,
            player.user.LangString(
              "admin.30de150f0dc9eabdaa7d02ce72142fce",
              system.timeStampString(endtime)
            )
          )
          .then((status) => {
            if (!status) return;
            User.banUser(data.id, player, banreason, endtime);
            if (!mp.players.exists(player)) return;
            player.notify(
              player.user.LangString("admin.d4aca02e9dd1647c7ec861571b41f949"),
              "error"
            );
            menu.close(player);
          });
      },
    });

    submenu.open();
  };
  s();
};
const banAccount = async (player: PlayerMp, id: number) => {
  if (!player.user) return;
  if (!player.user.admin_level)
    return player.notify(
      player.user.LangString("admin.acc26d6bf54b611ab166a488d0a1f760"),
      "error"
    );
  let user = player.user;
  let target = User.get(id);
  let data: UserEntity;
  let dataaccount: AccountEntity;
  try {
    data = target && target.user ? target.user.entity : await User.getData(id);
    dataaccount =
      target && target.user
        ? target.user.account
        : await User.getDataAccount(data.accountId);
  } catch (error) {
    // console.error(error);
  }
  if (!mp.players.exists(player)) return;
  if (!data)
    return player.notify(
      player.user.LangString("admin.63c725e1722bc95582b9df20a2a0aebf"),
      "error"
    );

  if (data.admin_level > user.admin_level)
    return player.notify(
      player.user.LangString("admin.b45e6d6331668d0524c10b9770b40bf5"),
      "error"
    );
  let banhours = 0;
  let bandays = 0;
  let banmonths = 0;
  let banreason = "";
  const s = () => {
    const submenu = menu.new(
      player,
      player.user.LangString("admin.6f70d31b839deb28571be9fbd723b756"),
      player.user.LangString("admin.df2f6320ea7dfd86399fed13bc803f6e")
    );
    submenu.onclose = () => {
      userChoise(player, id);
    };
    if (dataaccount.ban_end > system.timestamp) {
      submenu.newItem({
        name: langStringDefault("admin.18a7a1bf711c6d781cca08d20edd53c6"),
        onpress: () => {
          menu.accept(player).then((status) => {
            if (!status) return;
            user.log(
              "AdminBan",
              langStringDefault(
                "admin.389fc5b987ed8d3b94df73ef07b844fb",
                dataaccount.ban_admin,
                system.timeStampString(dataaccount.ban_end),
                dataaccount.ban_reason
              ),
              data.id
            );
            dataaccount.ban_end = 0;
            dataaccount.ban_admin = 0;
            dataaccount.ban_reason = null;
            dataaccount.save().then(() => {
              if (!mp.players.exists(player)) return;
              player.notify(
                player.user.LangString("admin.f8b3e3bf9906ec5e9188d632dc829340")
              );
              s();
            });
          });
        },
      });
    }
    submenu.newItem({
      name: langStringDefault("admin.e2aaa4695aa6720fe3233525649167b5"),
      onpress: () => {
        player.notify(
          player.user.LangString("admin.19fc7ce15ca30bf2e3915290f1ca0f03")
        );
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.9d6dae2fdbee78fca6883c0acf3479e5"),
      more: banreason
        ? langStringDefault("admin.23823102f4da72f91543fb6b7ebceb49")
        : langStringDefault("admin.1bf338a94f816b4b44c2fcc58dbde879"),
      onpress: () => {
        menu
          .input(
            player,
            player.user.LangString("admin.68411aeb6eddd5745416a75902e1e9ef"),
            "",
            400,
            "text"
          )
          .then((reason) => {
            if (!reason) return;
            banreason = reason;
            s();
          });
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.3e69bed0d1d6b7151ee1c7b107588f20"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banhours,
      desc: langStringDefault("admin.293cbef577bc01f7d8af910f9ecb6d9c"),
      onchange: (val) => {
        banhours = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.4605b1d9659483c76b97dc0c366e4948"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: bandays,
      desc: langStringDefault("admin.583c2b348e1c79dff01b4b9de1323898"),
      onchange: (val) => {
        bandays = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.cda166b2dcddc0b509e39b4c16501ad2"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banmonths,
      desc: langStringDefault("admin.d017ccd3bdc4e08620e8451dd05ef7d4"),
      onchange: (val) => {
        banmonths = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.84e07ed58d7dd798bb8476aa0c035041"),
      onpress: () => {
        if (!banreason)
          return player.notify(
            player.user.LangString("admin.99351e270ece324e23abe2348ba561f5"),
            "error"
          );
        if (banhours + bandays + banmonths === 0)
          return player.notify(
            player.user.LangString("admin.b0157e4e8b83a60d7fde5eaab968387a"),
            "error"
          );
        let endtime =
          system.timestamp +
          banhours * 60 * 60 +
          bandays * 24 * 60 * 60 +
          banmonths * 30 * 24 * 60 * 60;
        menu
          .accept(
            player,
            player.user.LangString(
              "admin.10b37af3f9a2d9f171c779f1851c242e",
              system.timeStampString(endtime)
            )
          )
          .then((status) => {
            if (!status) return;
            User.banUserAccount(dataaccount.id, player, banreason, endtime);
            if (!mp.players.exists(player)) return;
            player.notify(
              player.user.LangString("admin.49b486dc954adbaef9df0be0eb129950"),
              "error"
            );
            menu.close(player);
          });
      },
    });

    submenu.open();
  };
  s();
};

export let vmute = new Map<number, number>();
export let cmute = new Map<number, number>();

// gui.chat.registerCommand("ppp", (player, str) => {
//     const user = player.user;
//     if(!user) return;
//     CustomEvent.trigger('newHour');
// })
//
// gui.chat.registerCommand("nm", async (player, str) => {
//     const user = player.user;
//     if(!user) return;
//     CustomEvent.trigger('newMinute');
// })
//
// gui.chat.registerCommand("nd", async (player, str) => {
//     const user = player.user;
//     if(!user) return;
//     CustomEvent.trigger('newDay');
// })

gui.chat.registerCommand("cmute", (player, str) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:useredit:cmute")) return;
  const id = parseInt(str);
  if (isNaN(id) || id < 1 || id > 99999999) return;
  cmuteAccount(player, id);
});

gui.chat.registerCommand("vmute", (player, str) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:useredit:vmute")) return;
  const id = parseInt(str);
  if (isNaN(id) || id < 1 || id > 99999999) return;
  vmuteAccount(player, id);
});

setInterval(
  () =>
    mp.players
      .toArray()
      .filter((q) => q.user && q.user.load)
      .map((q) => syncMutePlayer(q.dbid)),
  120 * 1000
);

export const syncMutePlayer = (id: number) => {
  syncVMutePlayer(id);
  syncCMutePlayer(id);
};
const syncVMutePlayer = (id: number) => {
  if (vmute.has(id) && system.timestamp > vmute.get(id)) vmute.delete(id);
  const player = User.get(id);
  if (!player) return;
  const exists = vmute.has(id);
  if (!!player.getVariable("muted:voice") !== exists)
    player.setVariable("muted:voice", exists ? vmute.get(id) : false);
};
const syncCMutePlayer = (id: number) => {
  if (cmute.has(id) && system.timestamp > cmute.get(id)) cmute.delete(id);
  const player = User.get(id);
  if (!player) return;
  const exists = cmute.has(id);
  if (!!player.getVariable("muted:chat") !== exists)
    player.setVariable("muted:chat", exists);
};

const vmuteAccount = async (player: PlayerMp, id: number) => {
  let user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:useredit:vmute"))
    return player.notify(
      player.user.LangString("admin.0d77887c16ef1897dbe225798b380578"),
      "error"
    );
  let banhours = 0;
  let banminutes = 0;
  const s = () => {
    const submenu = menu.new(
      player,
      player.user.LangString("admin.50b19a9d659bd717db5b1995e163a266"),
      player.user.LangString("admin.33ee4e18eb027a221fc62fcc1b7157ad")
    );
    submenu.onclose = () => {
      userChoise(player, id);
    };
    if (vmute.has(id)) {
      submenu.newItem({
        name: langStringDefault("admin.7822c742b6f2790dc3fa72a4a1ebcfab"),
        more: `${system.timeStampString(vmute.get(id))}`,
        onpress: () => {
          menu.accept(player).then((status) => {
            if (!status) return;
            user.log(
              "AdminBan",
              langStringDefault(
                "admin.0e3a844ad2f12a4180eb0b9f6088601a",
                id,
                system.timeStampString(vmute.get(id))
              ),
              id
            );
            vmute.delete(id);
            player.notify(
              player.user.LangString("admin.3b90d0f6c84c6e304b76ca79fee227b0"),
              "success"
            );
            syncMutePlayer(id);
            s();
          });
        },
      });
    }
    submenu.newItem({
      name: langStringDefault("admin.a08232bf752b57bbec9859fad961f009"),
      onpress: () => {
        player.notify(
          player.user.LangString("admin.5496dfb428ccc197810974f6c55183ba")
        );
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.8380b77ea351a76b361dc40f1e4cae24"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banminutes,
      desc: langStringDefault("admin.df4fe4c25e7d11c08f5af213f7699851"),
      onchange: (val) => {
        banminutes = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.3f0fd4e3f66ab0d53582c52962e2da52"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banhours,
      desc: langStringDefault("admin.f4199a45c12847ae91c2454848a0a17a"),
      onchange: (val) => {
        banhours = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.590028bdef5b6f63605939052c4d41a0"),
      onpress: () => {
        if (banhours + banminutes === 0)
          return player.notify(
            player.user.LangString("admin.0c1170b3f220f89a15247c6f934bd69e"),
            "error"
          );
        let endtime = system.timestamp + banhours * 60 * 60 + banminutes * 60;
        menu
          .input(
            player,
            player.user.LangString("admin.ae10535ae725d5668f56de9d02590915"),
            "",
            30,
            "text"
          )
          .then((reason) => {
            reason = system.filterInput(reason);
            if (!reason || !reason.length) return;
            menu
              .accept(
                player,
                player.user.LangString(
                  "admin.0014339477fe08e95d231cb995dfbb6f",
                  system.timeStampString(endtime),
                  reason
                )
              )
              .then((status) => {
                if (!status) return;
                vmute.set(id, endtime);
                user.log(
                  "AdminBan",
                  langStringDefault(
                    "admin.8e6f26f463d955f7320f26ed8bc51210",
                    id,
                    system.timeStampString(vmute.get(id)),
                    reason
                  ),
                  id
                );
                addAdminStats(user.id, "vmute");
                if (!mp.players.exists(player)) return;
                player.notify(
                  player.user.LangString(
                    "admin.b212f9e7a160dc1f520740c374c2e4b8"
                  ),
                  "error"
                );
                syncMutePlayer(id);

                const mutePlayer = User.get(id);
                if (mutePlayer)
                  mutePlayer.outputChatBox(
                    mutePlayer.user.LangString(
                      "admin.8811fea5c71e77278279ded4dd131b1d",
                      system.timeStampString(vmute.get(id)),
                      reason
                    )
                  );

                s();
              });
          });
      },
    });

    submenu.open();
  };
  s();
};

const cmuteAccount = async (player: PlayerMp, id: number) => {
  let user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:useredit:cmute"))
    return player.notify(
      player.user.LangString("admin.d6f3c773c6907d5d3882a61b38c143b4"),
      "error"
    );
  let banhours = 0;
  let banminutes = 0;
  const s = () => {
    const submenu = menu.new(
      player,
      player.user.LangString("admin.2059fe074ef76884649a8a73ff73a26b"),
      player.user.LangString("admin.ccfffe9e6fcafb0c0d0ba2b31048d921")
    );
    submenu.onclose = () => {
      userChoise(player, id);
    };
    if (cmute.has(id)) {
      submenu.newItem({
        name: langStringDefault("admin.f745f53d99ca31ec44479ef05da54574"),
        more: `${system.timeStampString(cmute.get(id))}`,
        onpress: () => {
          menu.accept(player).then((status) => {
            if (!status) return;
            user.log(
              "AdminBan",
              langStringDefault(
                "admin.d94716ee2a5e62266a8d7979cd26a5e0",
                id,
                system.timeStampString(cmute.get(id))
              ),
              id
            );
            cmute.delete(id);
            player.notify(
              player.user.LangString("admin.d651776370ffb73ff2658388069d7d3c"),
              "success"
            );
            syncMutePlayer(id);
            s();
          });
        },
      });
    }
    submenu.newItem({
      name: langStringDefault("admin.020f28b5bb21105aefbf7dc479fbc21b"),
      onpress: () => {
        player.notify(
          player.user.LangString("admin.d1ea26f669649465c07647e0e7139a0d")
        );
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.f7c6eb1f8b6f7e79e702de4c695fe029"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banminutes,
      desc: langStringDefault("admin.088f7f4cbad22ee4535bd6673d620ee3"),
      onchange: (val) => {
        banminutes = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.977934113ab44144f766374988f6afb7"),
      type: "range",
      rangeselect: [0, 60],
      listSelected: banhours,
      desc: langStringDefault("admin.41ea94e8f8b136573033538ac96f6033"),
      onchange: (val) => {
        banhours = val;
      },
    });
    submenu.newItem({
      name: langStringDefault("admin.7625eed7d63a1d806725c74dd770c077"),
      onpress: () => {
        if (banhours + banminutes === 0)
          return player.notify(
            player.user.LangString("admin.e97ae13653557ada544ddfe0aee9901d"),
            "error"
          );
        let endtime = system.timestamp + banhours * 60 * 60 + banminutes * 60;
        menu
          .input(
            player,
            player.user.LangString("admin.6d52ce4d3b461efd7bb5337285a89670"),
            "",
            30,
            "text"
          )
          .then((reason) => {
            reason = system.filterInput(reason);
            if (!reason || !reason.length) return;
            menu
              .accept(
                player,
                player.user.LangString(
                  "admin.da5d7f9c66098e8cecb43a16ec4680cd",
                  system.timeStampString(endtime)
                )
              )
              .then((status) => {
                if (!status) return;
                cmute.set(id, endtime);
                user.log(
                  "AdminBan",
                  langStringDefault(
                    "admin.a24d054bc6c5c66fc5d67451cbdcbda8",
                    id,
                    system.timeStampString(cmute.get(id))
                  ),
                  id
                );
                addAdminStats(user.id, "cmute");
                if (!mp.players.exists(player)) return;
                player.notify(
                  player.user.LangString(
                    "admin.c249350177197d8eec63a814c7c1cd64"
                  ),
                  "error"
                );
                syncMutePlayer(id);
                s();

                const mutePlayer = User.get(id);
                if (mutePlayer)
                  mutePlayer.outputChatBox(
                    mutePlayer.user.LangString(
                      "admin.67f33ddc37afa8b074b8de4f879e37c3",
                      system.timeStampString(cmute.get(id)),
                      reason
                    )
                  );
              });
          });
      },
    });

    submenu.open();
  };
  s();
};

export const userChoise = async (player: PlayerMp, id: number) => {
  if (!player.user) return;
  if (!player.user.admin_level)
    return player.notify(
      player.user.LangString("admin.ffca0a01cc2326d3b507e4559ace4550"),
      "error"
    );
  let user = player.user;
  let target = User.get(id);
  let data: UserEntity;
  let dataaccount: AccountEntity;
  try {
    data = target && target.user ? target.user.entity : await User.getData(id);
    dataaccount =
      target && target.user
        ? target.user.account
        : await User.getDataAccount(data.accountId);
  } catch (error) {
    // console.error(error);
  }
  if (!mp.players.exists(player)) return;
  if (!data)
    return player.notify(
      player.user.LangString("admin.13e2c0af384094d5ff6ab95b82ead8eb"),
      "error"
    );
  let m = menu.new(
    player,
    player.user.LangString("admin.a044b4d20a1aa0ac3b0c8e4e4edbc975"),
    player.user.LangString(
      "admin.28af34039cbfa0b0adfd9978360a2043",
      data.id,
      data.rp_name,
      target ? "Online" : "Offline"
    )
  );

  if (target && target.id != player.id) {
    m.newItem({
      name: langStringDefault("admin.1b9aca82cc19cddcc7899b4b071d3926"),
      type: "list",
      list: [
        player.user.LangString("admin.9972f0dba22d0447a412659215fcccd7"),
        player.user.LangString("admin.325639aafff924bb10e4e67f584de518"),
      ],
      onpress: (itm) => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.90030f5b5d4536921ad98f2ae7ac3dd7"),
            "error"
          );
        if (
          mp.config.announce &&
          target.user.admin_level >= 6 &&
          player.user.admin_level < 5
        )
          return player.notify(
            player.user.LangString("admin.6bbc033afbf8d0148f34a1a0a48dccef")
          );
        if (itm.listSelected) {
          player.user.teleportVeh(
            target.position.x,
            target.position.y,
            target.position.z,
            target.heading,
            target.dimension
          );
        } else {
          player.user.teleport(
            target.position.x,
            target.position.y,
            target.position.z,
            target.heading,
            target.dimension
          );
        }
        player.user.log(
          "AdminJob",
          langStringDefault("admin.8a5e8ce3102a37475543af4f9c0747f7"),
          target.dbid
        );
      },
    });
    m.newItem({
      name: langStringDefault("admin.387cd791692871e29282862c8947c5f5"),
      type: "list",
      list: [
        player.user.LangString("admin.1628dd60014d78c80ecfb595de889f4c"),
        player.user.LangString("admin.ac661905f9ebb1dc6fe3270e9bdf522f"),
      ],
      onpress: (itm) => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.0809e5a999261c70061b718ce0101023"),
            "error"
          );
        if (itm.listSelected) {
          target.user.teleportVeh(
            player.position.x,
            player.position.y,
            player.position.z,
            player.heading,
            player.dimension
          );
        } else {
          target.user.teleport(
            player.position.x,
            player.position.y,
            player.position.z,
            player.heading,
            player.dimension
          );
        }
        player.user.log(
          "AdminJob",
          langStringDefault("admin.0cfa9602800864ec7e3b2cfe1a86211f"),
          target.dbid
        );
      },
    });
  }
  if (user.hasPermission("admin:useredit:banuser")) {
    m.newItem({
      name: langStringDefault("admin.c6a56e30f178ffd6debac1b42d49a0cc"),
      more:
        data.ban_end > system.timestamp
          ? langStringDefault(
              "admin.e4e2d60d3dceab044f320362354880a6",
              system.timeStampString(data.ban_end)
            )
          : langStringDefault("admin.481aee7580daa207274cf05add6246e6"),
      desc:
        data.ban_end > system.timestamp
          ? data.ban_reason
          : langStringDefault("admin.4b3c9aa9f9de5241aa42b3d510b90ee5"),
      onpress: () => {
        banUser(player, id);
      },
    });
  }
  if (user.hasPermission("admin:useredit:banaccount")) {
    m.newItem({
      name: langStringDefault("admin.12e7e59a66016a12aa7797022053ebb5"),
      more:
        dataaccount.ban_end > system.timestamp
          ? langStringDefault(
              "admin.10a61254e23fdcf9d1d9ec6602b4ffba",
              system.timeStampString(dataaccount.ban_end)
            )
          : langStringDefault("admin.903b0d77c8700db27a493f4ceddff6cc"),
      desc: langStringDefault(
        "admin.6e1fe6bc1345581664d45686a3bea7df",
        dataaccount.ban_end > system.timestamp
          ? dataaccount.ban_reason
          : langStringDefault("admin.f78d3aa6c5c66c074ec78d89061bf296")
      ),
      onpress: () => {
        banAccount(player, id);
      },
    });
  }
  if (user.hasPermission("admin:useredit:vmute")) {
    m.newItem({
      name: langStringDefault("admin.2f3425e91411c63b481ab009578fc4a8"),
      onpress: () => {
        vmuteAccount(player, id);
      },
    });
  }
  if (user.hasPermission("admin:useredit:cmute")) {
    m.newItem({
      name: langStringDefault("admin.6345aad6d4d3fafa2b8b16f814ea6a10"),
      onpress: () => {
        cmuteAccount(player, id);
      },
    });
  }

  if (user.admin_level > data.admin_level && target) {
    m.newItem({
      name: langStringDefault("admin.9cbc3bb38081c21ba65932d27b526e16"),
      onpress: () => {
        menu
          .input(
            player,
            player.user.LangString("admin.56dd23f50f32a9e320dc8514619b5c06"),
            "",
            60,
            "text"
          )
          .then((val) => {
            if (!val) return;
            if (val.length < 5)
              return player.notify(
                player.user.LangString(
                  "admin.8e812cdf00e2b3872fb3e87a5bbd92b5"
                ),
                "error"
              );
            if (!mp.players.exists(target))
              return player.notify(
                player.user.LangString(
                  "admin.8684aef28c077caf800f7a558b8bbd01"
                ),
                "error"
              );
            addAdminStats(user.id, "kick");
            User.kickUser(target, val, player);
            menu.close(player);
          });
      },
    });
  }

  if (target) {
    m.newItem({
      name: langStringDefault("admin.c1b53d5d95d4eb1a06205d4ec8041e5d"),
      onpress: () => {
        menu
          .accept(
            target,
            target.user.LangString("admin.f337b3d17302e3919f3723d9361138ab"),
            "big",
            9999999
          )
          .then((status) => {
            if (status) {
              if (mp.players.exists(player))
                player.notify(
                  player.user.LangString(
                    "admin.ab14720b79723a931b0eb7514e53010c"
                  )
                );
            }
          });
      },
    });
  }

  if (target && target.user.cuffed) {
    m.newItem({
      name: langStringDefault("admin.ca7d539564f2a4522541f48269e1ed16"),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.0a6ed7cc93b9f9e0a40c17fead7f5e73"),
            "error"
          );
        if (!target.user.cuffed)
          return player.notify(
            player.user.LangString("admin.d188a3218a6567a709e6df0e306df8c4"),
            "error"
          );
        target.user.cuffed = false;
        player.notify(
          player.user.LangString("admin.9c8710de0bc3796e655abf6bf42af771")
        );
      },
    });
  }

  if (user.hasPermission("admin:useredit:givewarn")) {
    m.newItem({
      name: langStringDefault("admin.79b341910521039f2a569196faff2448"),
      more: data.warns.length,
      onpress: () => {
        const s = () => {
          const submenu = menu.new(
            player,
            player.user.LangString("admin.f852de80d85cc882756da4aab3a613bc"),
            player.user.LangString("admin.e98a632d8057c7f9b753ae915dab4744")
          );
          submenu.onclose = () => {
            userChoise(player, id);
          };
          submenu.newItem({
            name: langStringDefault("admin.e201656be66e84391ea4a4f1792393dc"),
            onpress: () => {
              menu
                .input(
                  player,
                  player.user.LangString(
                    "admin.872837749c3b038badb18745d54ec431"
                  ),
                  "",
                  400,
                  "text"
                )
                .then(async (reason) => {
                  if (!reason) return;
                  let warns = [...data.warns];
                  warns.push({
                    reason,
                    admin: player.dbid,
                    time: system.timestamp + 10 * 24 * 60 * 60,
                  });
                  data.warns = warns;
                  if (mp.players.exists(player))
                    player.notify(
                      player.user.LangString(
                        "admin.131bf921a5a36b7446b04bb0d0cf03d0"
                      ),
                      "error"
                    );
                  if (target && mp.players.exists(target)) {
                    target.notify(
                      target.user.LangString(
                        "admin.05f6fe8b4d65657006a9a38002bbced7"
                      ),
                      "error"
                    );
                    if (target.user.fraction && !target.user.isLeader) {
                      target.notify(
                        target.user.LangString(
                          "admin.a245126c0085b8204d595b925cc1caf5"
                        ),
                        "error"
                      );
                      target.user.fraction = 0;
                    }
                  } else {
                    data.fraction = 0;
                    data.rank = 0;
                    await data.save();
                  }
                  addAdminStats(user.id, "warn");
                  user.log(
                    "AdminJob",
                    langStringDefault(
                      "admin.a5af12d6bef996da343e62f03ff4720f",
                      reason
                    ),
                    data.id
                  );
                  if (data.warns.length && data.warns.length % 3 === 0) {
                    User.banUser(
                      data.id,
                      player,
                      langStringDefault(
                        "admin.9a08221b12c06f0cd471692963a8bce0"
                      ),
                      system.timestamp + 10 * 24 * 60 * 60
                    );
                  }
                  userChoise(player, id);
                });
            },
          });
          data.warns.map((warn, warnid) => {
            submenu.newItem({
              name: langStringDefault(
                "admin.aeae215f4c58846128866a63cc96aaf0",
                system.timeStampString(warn.time),
                warn.admin
              ),
              onpress: () => {
                if (
                  !user.hasPermission("admin:useredit:unwarn") &&
                  warn.admin !== player.dbid
                )
                  return player.notify(
                    player.user.LangString(
                      "admin.a357b8e4a757332fe99b8a658bb446c5"
                    )
                  );
                menu
                  .accept(
                    player,
                    player.user.LangString(
                      "admin.0d16d9198ced9dce3296753f2393d0ea"
                    )
                  )
                  .then(async (reason) => {
                    if (!reason) return;
                    if (target && !mp.players.exists(target))
                      return player.notify(
                        player.user.LangString(
                          "admin.d456275835379f6177579d499ad3cd05"
                        ),
                        "error"
                      );
                    let warns = [...data.warns];
                    warns.splice(warnid, 1);
                    data.warns = warns;
                    if (!target) await data.save();
                    if (mp.players.exists(player))
                      player.notify(
                        player.user.LangString(
                          "admin.7fa64bf9c0d783edfdecd78ed0cea34f"
                        ),
                        "error"
                      );
                    if (mp.players.exists(target))
                      target.notify(
                        target.user.LangString(
                          "admin.7f44dba69c5f77cdac5262c4ae39a0ae"
                        ),
                        "error"
                      );
                  });
              },
            });
          });
          submenu.open();
        };
        s();
      },
    });
  }

  m.newItem({
    name: langStringDefault("admin.e226801867b0bfa579af068ae2e45db9"),
    more: dataaccount.promocode_my,
    desc: langStringDefault("admin.b5cd2b646689ff50bfa466768ade88d4"),
    onpress: async () => {
      const submenu = menu.new(
        player,
        player.user.LangString("admin.64e4de4526fd46f40f3ff4e294c8eeae")
      );
      submenu.onclose = () => {
        userChoise(player, id);
      };
      const activators = await PromocodeUseEntity.find({
        code: dataaccount.promocode_my,
      });
      if (dataaccount.promocode_my) {
        if (user.isAdminNow(6)) {
          submenu.newItem({
            name: langStringDefault("admin.66ad0fd0a963f78e5080c092fd424bae"),
            onpress: () => {
              menu.accept(player).then((status) => {
                if (!status) return;
                dataaccount.promocode_my_reward = 0;
                saveEntity(dataaccount);
                player.notify(
                  player.user.LangString(
                    "admin.202dc81106c2efb3d60f378829f5b75c"
                  ),
                  "success"
                );
              });
            },
          });
        }
        submenu.newItem({
          name: langStringDefault("admin.420465ca5be4cb02b86dea9f9f513d5b"),
          more: `${activators.length}`,
          desc: langStringDefault("admin.4198d4cb004540f94ef389579754d890"),
        });
        submenu.newItem({
          name: langStringDefault("admin.532933a4da7bb04490f0c1b459540522"),
          more: `${
            activators.filter((q, i, a) => {
              return a.findIndex((z) => z.id === q.id) === i;
            }).length
          }`,
          desc: langStringDefault("admin.df1ebdc5e10dedad0379dc0589b47294"),
        });
        if (user.hasPermission("admin:useredit:mediapromo"))
          submenu.newItem({
            name: langStringDefault("admin.10d4c9f9406af8f9dad6f1bd9e254085"),
            more: dataaccount.promocode_my,
            onpress: () => {
              menu
                .input(
                  player,
                  player.user.LangString(
                    "admin.f54a5ea84e39c93b5018587c112c1155"
                  ),
                  dataaccount.promocode_my,
                  30,
                  "text"
                )
                .then((newpromo) => {
                  if (!newpromo) return;
                  AccountEntity.find({ promocode_my: newpromo }).then(
                    async (dublicate) => {
                      if (!mp.players.exists(player)) return;
                      if (dublicate.length > 0) {
                        if (
                          dublicate.length == 1 &&
                          dublicate[0].id == dataaccount.id
                        )
                          return player.notify(
                            player.user.LangString(
                              "admin.e281379f8464b8fa7c8350da92aa1042"
                            ),
                            "error"
                          );
                        if (
                          dublicate.length == 1 &&
                          dublicate[0].id != dataaccount.id
                        )
                          return player.notify(
                            player.user.LangString(
                              "admin.0c547315fc955cddf686eef4b19782c4"
                            ),
                            "error"
                          );
                        if (dublicate.length > 1)
                          return player.notify(
                            player.user.LangString(
                              "admin.82f1e140ca21a3e65cf85de481d23336"
                            ),
                            "error"
                          );
                        if (target && !mp.players.exists(target))
                          return player.notify(
                            player.user.LangString(
                              "admin.1ca1b18d50951b3264f8ca8a5d23d997"
                            ),
                            "error"
                          );
                        if ((await PromocodeList.count({ code: newpromo })) > 0)
                          return player.notify(
                            player.user.LangString(
                              "admin.1e04e03a30d875a93c368c3a747516be"
                            ),
                            "error"
                          );
                      }
                      dataaccount.promocode_my = newpromo;
                      dataaccount.save().then(() => {
                        if (!mp.players.exists(player)) return;
                        player.notify(
                          player.user.LangString(
                            "admin.1053a939cac79ec21761032c102a1829"
                          )
                        );
                        userChoise(player, id);
                      });
                    }
                  );
                });
            },
          });
        if (user.hasPermission("admin:useredit:mediapromo"))
          submenu.newItem({
            name: langStringDefault("admin.3b0e7f9b5ce04b872b088e12950045c9"),
            onpress: () => {
              menu.accept(player).then((status) => {
                if (!status) return;
                dataaccount.promocode_my = "";
                dataaccount.save().then(() => {
                  if (!mp.players.exists(player)) return;
                  player.notify(
                    player.user.LangString(
                      "admin.4fbb0ea5e81a261919abd3c5978e77bc"
                    )
                  );
                  userChoise(player, id);
                });
              });
            },
          });
      } else {
        if (user.hasPermission("admin:useredit:mediapromo"))
          submenu.newItem({
            name: langStringDefault("admin.f186281dc2f719d139b0308b28ed2f9f"),
            more: "",
            onpress: () => {
              menu
                .input(
                  player,
                  player.user.LangString(
                    "admin.ddb1527ff9920d9ed324efcb120e749a"
                  ),
                  "",
                  30,
                  "text"
                )
                .then((newpromo) => {
                  if (!newpromo) return;
                  AccountEntity.find({ promocode_my: newpromo }).then(
                    async (dublicate) => {
                      if (!mp.players.exists(player)) return;
                      if (dublicate.length > 0) {
                        if (
                          dublicate.length == 1 &&
                          dublicate[0].id == dataaccount.id
                        )
                          return player.notify(
                            player.user.LangString(
                              "admin.2311a220b3bb21c4a569f04fe96dc6ba"
                            ),
                            "error"
                          );
                        if (
                          dublicate.length == 1 &&
                          dublicate[0].id != dataaccount.id
                        )
                          return player.notify(
                            player.user.LangString(
                              "admin.c84ea4e1680b8c57f6151a5a535e4ee1"
                            ),
                            "error"
                          );
                        if (dublicate.length > 1)
                          return player.notify(
                            player.user.LangString(
                              "admin.a19afde4b9ca0c8c0c606df855cdd2b9"
                            ),
                            "error"
                          );
                        if (target && !mp.players.exists(target))
                          return player.notify(
                            player.user.LangString(
                              "admin.5c405e11be67241e261030efcb147b6e"
                            ),
                            "error"
                          );
                        if ((await PromocodeList.count({ code: newpromo })) > 0)
                          return player.notify(
                            player.user.LangString(
                              "admin.25050aefe4892e5fa7bb56d040bd112d"
                            ),
                            "error"
                          );
                      }
                      dataaccount.promocode_my = newpromo;
                      dataaccount.save().then(() => {
                        if (!mp.players.exists(player)) return;
                        player.notify(
                          player.user.LangString(
                            "admin.a9887285d5f4f639c175c1334aeb668b"
                          )
                        );
                        userChoise(player, id);
                      });
                    }
                  );
                });
            },
          });
      }
      submenu.open();
    },
  });

  // if (user.hasPermission("admin:useredit:helper")) {
  //     m.newItem({
  //         name: langStringDefault("admin.f469da9e521d8aff7ec0a18cb5b2adb5"),
  //         more: `${data.helper_level ? `${data.helper_level} LVL` : langStringDefault("admin.77e7f85f64340e8c09d9ceb63888009b")}`,
  //         onpress: () => {
  //             menu.selector(player, player.user.LangString("admin.5fe7b493f091e7980ba67e9b81f07dc8"), [langStringDefault("admin.acb478fd580215406bc9e19c313ef824"), ...HELPER_PAYDAY_MONEY.map((q, i) => `${i + 1} LVL ($${system.numberFormat(q)})`)], true, null, true).then(async status => {
  //                 if (typeof status !== "number") return userChoise(player, id);
  //                 data.helper_level = status;
  //                 if (!target) await data.save();
  //                 else if (!mp.players.exists(target)) return player.notify(player.user.LangString("admin.ff1a30d29fa2486535e04a89a13b3ff7"), "error");
  //                 userChoise(player, id);
  //             })
  //         }
  //     })
  // }

  m.newItem({
    name: langStringDefault("admin.f4d49e7ffb5fef3596dad806127bb199"),
    more: `${data.admin_level} LVL`,
    onpress: () => {
      if (!user.isAdminNow(5))
        return player.notify(
          player.user.LangString("admin.fc54abd49cccf0ce35ffa2413ddeed0d"),
          "error"
        );
      if (user.admin_level < data.admin_level)
        return player.notify(
          player.user.LangString("admin.d455bdb8c86b089f6b588b27369031f7"),
          "error"
        );
      let text: string[] = [];
      for (let adm = 0; adm <= 5; adm++)
        text.push(
          player.user.LangString("admin.4aeac335576d264bbda050a51f10c866", adm)
        );
      if (user.isAdminNow(6))
        text.push(
          player.user.LangString("admin.8dbd127bc1cbd70ad58e8afd0b93c18f", 6)
        );
      menu
        .selector(
          player,
          player.user.LangString("admin.1d29cc6d2fb47dd1639929ae0dd07779"),
          text,
          true,
          null,
          true
        )
        .then((lvl) => {
          if (typeof lvl !== "number") return;
          if (isNaN(lvl)) return;
          if (target && !mp.players.exists(target))
            return player.notify(
              player.user.LangString("admin.1be43420bb31aef11588e673d5eaac76"),
              "error"
            );
          if (target) {
            target.user.admin_level = lvl;
            player.notify(
              player.user.LangString("admin.4a4a8864e6c632fdae64d78c02d6e8e8"),
              "success"
            );
            writeSpecialLog(
              langStringDefault("admin.410fdf9fb1fb2097be75c248e0c47a96", lvl),
              player,
              target.user.id
            );
            userChoise(player, id);
          } else {
            data.admin_level = lvl;
            data.save().then(() => {
              player.notify(
                player.user.LangString(
                  "admin.536ba305002a7ac559f5a763768662c0"
                ),
                "success"
              );
              writeSpecialLog(
                langStringDefault(
                  "admin.b0d995466de6bb31255ecd6682c2b3b5",
                  lvl
                ),
                player,
                data.id
              );
              userChoise(player, id);
            });
          }
        });
    },
  });
  if (target && user.hasPermission("admin:useredit:jobskill")) {
    m.newItem({
      name: langStringDefault("admin.a09c13054113309109afe1520ae0fc1e"),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.08a78d6c64ec70aaeae32a30763f1fcd"),
            "error"
          );
        const submenu = menu.new(
          player,
          `${target.user.name} #${target.user.id}`,
          player.user.LangString("admin.39fb75c77f3ebd2981e1a58e73e756f0")
        );
        submenu.onclose = () => {
          userChoise(player, id);
        };
        submenu.newItem({
          name: langStringDefault("admin.7700bcd6bc8edf2add7a7f590e49beae"),
          more: `${data.deliver_level} LVL`,
          onpress: () => {
            menu
              .input(
                player,
                player.user.LangString(
                  "admin.c4ad7010902316ee00f8ca87262dd5e3"
                ),
                data.deliver_level,
                4,
                "int"
              )
              .then((val) => {
                if (typeof val !== "number") return;
                if (isNaN(val)) return;
                if (val < 0 || val > 9999) return;
                if (!mp.players.exists(target))
                  return (
                    player.notify(
                      player.user.LangString(
                        "admin.cc1ab02cc86b51cd5d70fdd10cdc0906"
                      ),
                      "error"
                    ),
                    userChoise(player, id)
                  );
                target.user.entity.deliver_level = val;
                player.notify(
                  player.user.LangString(
                    "admin.d989e1f93d03032fd9b2b5eac949770d"
                  ),
                  "success"
                );
                userChoise(player, id);
              });
          },
        });
        for (let job in target.user.jobStats) {
          const name = getJobName(job as any);
          if (name) {
            const exp = target.user.jobStats[job];
            submenu.newItem({
              name: name,
              more: langStringDefault(
                "admin.53893c8cd20aac0be8f95f90c1f44620",
                system.numberFormat(exp),
                system.numberFormat(1000),
                getLevelByExp(exp)
              ),
              onpress: () => {
                menu
                  .input(
                    player,
                    player.user.LangString(
                      "admin.892b42d175b48c05feeae3c24c33999f"
                    ),
                    exp,
                    4,
                    "int"
                  )
                  .then((newexp) => {
                    if (typeof newexp !== "number")
                      return userChoise(player, id);
                    if (!mp.players.exists(target))
                      return (
                        player.notify(
                          player.user.LangString(
                            "admin.fa771fb53e56cab1ed410611e0b1e1ac"
                          ),
                          "error"
                        ),
                        userChoise(player, id)
                      );
                    if (newexp > 1000 || newexp < 0)
                      return (
                        player.notify(
                          player.user.LangString(
                            "admin.37d0aa1aafab20c6c24057f5be01a963"
                          ),
                          "error"
                        ),
                        userChoise(player, id)
                      );
                    const oldexp = { ...target.user.jobStats };
                    oldexp[job] = newexp;
                    target.user.jobStats = oldexp;
                    player.notify(
                      player.user.LangString(
                        "admin.c76e30d2f96fb33352a5de75da92ac5b"
                      ),
                      "success"
                    );
                    userChoise(player, id);
                  });
              },
            });
          }
        }

        submenu.open();
      },
    });
  }
  if (target && user.hasPermission("admin:useredit:givedocument")) {
    m.newItem({
      name: langStringDefault("admin.a7fe6077024c242c64071b14b418051d"),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.995e667e560819f5acb41a26e0ab407d"),
            "error"
          );
        const submenu = menu.new(
          player,
          `${target.user.name} #${target.user.id}`,
          player.user.LangString("admin.86bf6756a5d7e2fc06b519869b37619a")
        );
        submenu.onclose = () => {
          userChoise(player, id);
        };
        submenu.newItem({
          name: langStringDefault("admin.dfa6db4b2b4062fd1f11497499560d71"),
        });
        submenu.widthMultipler = 2;
        LicensesData.map((item) => {
          if (target.user.haveActiveLicense(item.id)) {
            submenu.newItem({
              name: langStringDefault(
                "admin.da87f9bd9cff48114b69ed231d042da5",
                item.name
              ),
              onpress: async (itm) => {
                if (!mp.players.exists(target))
                  return (
                    player.notify(
                      player.user.LangString(
                        "admin.abc41129716692e7f60538085eb879bf"
                      ),
                      "error"
                    ),
                    userChoise(player, id)
                  );
                player.notify(
                  player.user.LangString(
                    "admin.dbdbae2486afc8c27fd719934c495bef"
                  )
                );
                writeSpecialLog(
                  langStringDefault(
                    "admin.a981da5a3ca6218a4765bc8ded2cc7d2",
                    item.id
                  ),
                  player,
                  target.user.id
                );
                target.user.removeLicense(item.id);
                userChoise(player, id);
              },
            });
          } else {
            submenu.newItem({
              name: item.name,
              onpress: async (itm) => {
                if (!mp.players.exists(target))
                  return (
                    player.notify(
                      player.user.LangString(
                        "admin.66b73e555c4af378fd9ecb0a032ae0f8"
                      ),
                      "error"
                    ),
                    userChoise(player, id)
                  );
                player.notify(
                  player.user.LangString(
                    "admin.90d757ca5a979e74de5f7fe030f23bfd"
                  )
                );
                writeSpecialLog(
                  langStringDefault(
                    "admin.86ae327b8963be9dcc02f6d26b2119d9",
                    item.id
                  ),
                  player,
                  target.user.id
                );
                target.user.giveLicense(item.id, 30);
                userChoise(player, id);
              },
            });
          }
        });
        submenu.newItem({
          name: langStringDefault("admin.eb6d6e99a17ede003372ed4e1a99a94a"),
        });
        document_templates.map((item) => {
          submenu.newItem({
            name: item.typeShort,
            type: "list",
            list: [
              player.user.LangString("admin.95cdda3400a7ff548250b1b5b778f3f2"),
              player.user.LangString("admin.8e917597bab2428e1331a0a62cfd1b0d"),
              player.user.LangString("admin.c4020568d3a5fbf4d3636003932732e8"),
            ],
            onpress: async (itm) => {
              if (!mp.players.exists(target))
                return (
                  player.notify(
                    player.user.LangString(
                      "admin.78f2c84ead74463ac1f8eb30b2595b57"
                    ),
                    "error"
                  ),
                  userChoise(player, id)
                );
              if (itm.listSelected == 0) {
                target.user.giveDocument(item.id, player);
                player.notify(
                  player.user.LangString(
                    "admin.91d3bfa673e1b371c00a9c6342240965"
                  ),
                  "success"
                );
                userChoise(player, id);
              } else {
                let fakeid = await menu.input(
                  player,
                  player.user.LangString(
                    "admin.aeb4a74caaab520637ad1f1c820b59ec"
                  ),
                  user.id
                );
                if (!fakeid) return userChoise(player, id);
                let fake_name = await menu.input(
                  player,
                  player.user.LangString(
                    "admin.24aa5a8d3a77f4450f964a08b6e79f19"
                  ),
                  user.name
                );
                if (!fake_name) return userChoise(player, id);
                let fake_social_number = await menu.input(
                  player,
                  player.user.LangString(
                    "admin.4ba3c490b27f6e3fa06f03fe85d2291d"
                  ),
                  user.social_number
                );
                if (!fake_social_number) return userChoise(player, id);
                if (!mp.players.exists(target))
                  return (
                    player.notify(
                      player.user.LangString(
                        "admin.19d864ebd8e51b572978f1d141b76c3d"
                      ),
                      "error"
                    ),
                    userChoise(player, id)
                  );
                target.user.giveDocumentData(
                  item.id,
                  fakeid,
                  fake_name,
                  fake_social_number,
                  itm.listSelected === 1
                );
                player.notify(
                  player.user.LangString(
                    "admin.d91c3802bf65d46942b46d8dc248454a"
                  ),
                  "success"
                );
                userChoise(player, id);
              }
            },
          });
        });

        submenu.open();
      },
    });
  }
  if (user.hasPermission("admin:inventory:create")) {
    m.newItem({
      name: langStringDefault("admin.1a1733ad965c73ecad1619d00dd57165"),
      type: "list",
      list: [
        player.user.LangString("admin.a93545c0acc3271d4c992624ad9f2cb5"),
        player.user.LangString("admin.693820317e16e9450f9dacdc007a8b52"),
      ],
      desc: langStringDefault("admin.8a862bdc60d3de4efd1b87c5530178b7"),
      onpress: (itm) => {
        menu.selectItem(player).then(async (item_id) => {
          if (!item_id) return userChoise(player, id);
          let count = await menu.input(
            player,
            player.user.LangString("admin.43058a6934665fa031792fb003c255a7"),
            1,
            2,
            "int"
          );
          if (!count || count <= 0) return userChoise(player, id);
          for (let q = 0; q < count; q++) {
            await inventory.createItem({
              item_id,
              owner_type: OWNER_TYPES.PLAYER,
              owner_id: id,
              temp: itm.listSelected ? 1 : 0,
            });
          }
          writeSpecialLog(
            langStringDefault(
              "admin.c954792bab3fea9b450dd26acdfa5c78",
              item_id
            ),
            player,
            id
          );
          player.notify(
            player.user.LangString("admin.8810dd5113c22d564b436938e66a3336"),
            "success"
          );
          userChoise(player, id);
        });
      },
    });
    m.newItem({
      name: langStringDefault("admin.477581adcb66b5a907b49b5ba4cc571c"),
      type: "list",
      list: [
        player.user.LangString("admin.b40a08bc9f44c2960a0c3a2fd0822800"),
        player.user.LangString("admin.935cdc800f0e5f17b1417223e9bd2958"),
      ],
      desc: langStringDefault("admin.418a1fed6c4da7adc3482e339dcf5111"),
      onpress: (itm) => {
        menu.selectWeapon(player).then(async (item_id) => {
          if (!item_id) return userChoise(player, id);
          let count = await menu.input(
            player,
            player.user.LangString("admin.5df6fde32f79a9d0d2f6ca635a12b269"),
            1,
            2,
            "int"
          );
          if (!count || count <= 0) return userChoise(player, id);

          writeSpecialLog(
            langStringDefault(
              "admin.5adf2c7e3c8b4e2e3cd5c4ae146f78c0",
              item_id
            ),
            player,
            id
          );

          for (let q = 0; q < count; q++) {
            const weapon = await inventory.createItem({
              item_id,
              owner_type: OWNER_TYPES.PLAYER,
              owner_id: id,
              temp: itm.listSelected ? 1 : 0,
            });
            const weaponCfg = inventoryShared.getWeaponConfigByItemId(item_id);
            if (weaponCfg.ammo_box) {
              inventory.createItem({
                item_id: weaponCfg.ammo_box,
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: id,
                count: 300,
                temp: itm.listSelected ? 1 : 0,
              });
            }
            if (weaponCfg.addons) {
              let groupUsed: number[] = [];
              Object.values(weaponCfg.addons).map(
                (addon: WeaponAddonsItemBase) => {
                  if (groupUsed.includes(addon.group)) return;
                  groupUsed.push(addon.group);
                  inventory.createItem({
                    item_id: addon.item_id,
                    owner_type: OWNER_TYPES.WEAPON_MODS,
                    owner_id: weapon.id,
                    temp: itm.listSelected ? 1 : 0,
                  });
                }
              );
            }
          }

          player.notify(
            player.user.LangString("admin.3390a9d8a2ca332d31c60ce75cb1f148"),
            "success"
          );
          userChoise(player, id);
        });
      },
    });
    m.newItem({
      name: langStringDefault("admin.d5407140814fc5eff1757ebee729752a"),
      onpress: () => {
        menu.accept(player).then((status) => {
          if (!status) return;
          writeSpecialLog(
            langStringDefault("admin.aaf255b95e179bd11b322e9401974003"),
            player,
            id
          );
          inventory.clearInventory(OWNER_TYPES.PLAYER, id);
          player.notify(
            player.user.LangString("admin.a5c038f05e3e67755c6a12087daf3065")
          );
        });
      },
    });
    if (user.isAdminNow(6)) {
      m.newItem({
        name: langStringDefault("admin.a9dfffca281986fb9d0f83945756cc66"),
        onpress: () => {
          menu.accept(player).then((status) => {
            if (!status) return;
            inventoryShared.items.map((q) => {
              inventory.createItem({
                item_id: q.item_id,
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: id,
              });
            });
          });
        },
      });
    }
    if (user.hasPermission("admin:animation:set")) {
      m.newItem({
        name: langStringDefault("admin.30e56abcb0998cf58d18a2f4ed37ae0e"),
        onpress: () => {
          const animationsMenu = menu.new(
            player,
            player.user.LangString("admin.47c4c5ffd8ca19f5e4bb0bf09ddf0b1e"),
            player.user.LangString("admin.35848da9f4584de72eba9a08724d4311")
          );
          animationsMenu.exitProtect = true;
          animationsMenu.onclose = () => {
            userChoise(player, id);
          };

          animationsMenu.newItem({
            name: langStringDefault("admin.1aadd492a62104d58c5234ba633550f8"),
            onpress: () => {
              menu.accept(player).then(async (status) => {
                if (!status) return;
                await target.user.animation.giveAllPurchaseableAnimations();
              });
            },
          });

          animationsMenu.newItem({
            name: langStringDefault("admin.738713e1b70d5ac2024691699581ada6"),
            onpress: () => {
              const subMenu = menu.new(
                player,
                player.user.LangString(
                  "admin.52eca477ed83a6720087e489f96a79ef"
                ),
                player.user.LangString("admin.0f7489676b9c1c655ecb9bf1e16ecd5d")
              );
              subMenu.exitProtect = true;
              subMenu.onclose = () => {
                userChoise(player, id);
              };
              PURCHASEABLE_ANIMS.filter(
                (a) => !target.user.animation.havePurchaseableAnimation(a.id)
              ).forEach((anim) => {
                subMenu.newItem({
                  name: `${anim.category} | ${anim.name}`,
                  more: `${
                    anim.forBattlePass
                      ? langStringDefault(
                          "admin.5c1d4c64e25b2b0052fca5d73bc0b94f"
                        )
                      : ""
                  } ${anim.cost ? anim.cost : ""} ${
                    anim.costType ? anim.costType : ""
                  }`,
                  onpress: async () => {
                    subMenu.close();
                    await target.user.animation.givePurchaseableAnimation(
                      anim.id
                    );
                  },
                });
              });
              subMenu.open();
            },
          });

          animationsMenu.newItem({
            name: langStringDefault("admin.62fe504fd4635b837f23a309f5afece4"),
            onpress: () => {
              const subMenu = menu.new(
                player,
                player.user.LangString(
                  "admin.17b782abf7a0ff97f2f86786c2ac484f"
                ),
                player.user.LangString("admin.e0ed8ae6805fcbfa8eea9e83abcb81e6")
              );
              subMenu.exitProtect = true;
              subMenu.onclose = () => {
                userChoise(player, id);
              };
              PURCHASEABLE_ANIMS.filter((a) =>
                target.user.animation.havePurchaseableAnimation(a.id)
              ).forEach((anim) => {
                subMenu.newItem({
                  name: `${anim.category} | ${anim.name}`,
                  more: `${anim.forBattlePass ? "Battle Pass" : ""} ${
                    anim.cost ? anim.cost : ""
                  } ${anim.costType ? anim.costType : ""}`,
                  onpress: async () => {
                    subMenu.close();
                    await target.user.animation.takePurchaseableAnimation(
                      anim.id
                    );
                  },
                });
              });
              subMenu.open();
            },
          });
          animationsMenu.open();
        },
      });
    }
  }
  if (user.hasPermission("admin:useredit:fraction")) {
    m.newItem({
      name: langStringDefault("admin.f3ac6f8cb2dc44432fc42cd0c4e30f6b"),
      more: data.fraction
        ? `${fractionCfg.getFractionName(data.fraction)} (${data.fraction})`
        : langStringDefault("admin.4bde113ca1ef9c80d439ac861b65bf2a"),
      onpress: () => {
        menu
          .selectFraction(player, "all", data.fraction)
          .then(async (fraction) => {
            if (!fraction) return userChoise(player, id);
            if (mp.players.exists(target)) {
              target.user.fraction = fraction;
              await target.user.save();
            } else {
              data.fraction = fraction;
              await data.save();
            }
            player.notify(
              player.user.LangString("admin.880d9b81af2e178099cb6a0ff19c220e"),
              "error"
            );
            player.user.log(
              "AdminJob",
              langStringDefault(
                "admin.51b1b120815512ef3de480557ec9cb9e",
                fraction,
                fractionCfg.getFractionName(fraction)
              ),
              data.id
            );
            userChoise(player, id);
          });
      },
    });

    if (data.fraction) {
      m.newItem({
        name: langStringDefault("admin.c00396bba2c8f722807c721242ba0db7"),
        more: data.rank
          ? `${fractionCfg.getRankName(data.fraction, data.rank)} (${
              data.rank
            })`
          : langStringDefault("admin.34f6e17f2c7e5317f1182c189bf6858e"),
        onpress: () => {
          menu
            .selector(
              player,
              player.user.LangString("admin.e4c5dd22aabf388bfa09a991d6a9e591"),
              fractionCfg.getFractionRanks(data.fraction),
              true
            )
            .then(async (val) => {
              if (typeof val !== "number") return userChoise(player, id);
              if (!data.fraction)
                return (
                  player.notify(
                    player.user.LangString(
                      "admin.e76418009aeb306e8011d531252799cc"
                    ),
                    "error"
                  ),
                  userChoise(player, id)
                );
              if (mp.players.exists(target)) {
                target.user.rank = val + 1;
                await target.user.save();
              } else {
                data.rank = val + 1;
                await data.save();
              }
              player.notify(
                player.user.LangString(
                  "admin.c521b2d872c29aca2d9e8356b397f092"
                ),
                "success"
              );
              player.user.log(
                "AdminJob",
                langStringDefault(
                  "admin.343bac226720ad3235a5382db1477ffd",
                  fractionCfg.getRankName(data.fraction, val + 1),
                  fractionCfg.getFractionName(data.fraction)
                ),
                data.id
              );
              userChoise(player, id);
            });
        },
      });
      m.newItem({
        name: langStringDefault("admin.0c48295767ae8d0ade0eb1eb43d86452"),
        onpress: () => {
          menu.accept(player).then(async (status) => {
            if (!status) return userChoise(player, id);
            if (mp.players.exists(target)) {
              target.user.fraction = 0;
              target.user.rank = 0;
              await target.user.save();
            } else {
              data.fraction = 0;
              data.rank = 0;
              await data.save();
            }
            player.notify(
              player.user.LangString("admin.24f4fcde64dfbaa4b672972c0b5b396c"),
              "error"
            );
            player.user.log(
              "AdminJob",
              langStringDefault("admin.fe0b07f81c66566e403c41a2f29752db"),
              data.id
            );
            userChoise(player, id);
          });
        },
      });
    }
  }
  if (target) {
    m.newItem({
      name: langStringDefault("admin.e4799497670e560bedca2ba8b227baba"),
      desc: langStringDefault("admin.8e9cf54702ac3a80360e4963e18854f1"),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.830351f5a8195f265b3b03da17b4f9a3"),
            "error"
          );
        target.user.adminRestore();
        player.user.log(
          "AdminJob",
          langStringDefault("admin.3539d7958d3ba591bcf41dacf0683e48"),
          target.dbid
        );
      },
    });
    if (!mp.config.announce) {
      m.newItem({
        name: langStringDefault("admin.4eca0b99f0493566f470daf6bbaf0a3b"),
        onpress: () => {
          target.user.food = 0;
          target.user.water = 0;
        },
      });
    }
    m.newItem({
      name: langStringDefault("admin.edd389156125ad2e74e2b4ea4320b98e"),
      desc: langStringDefault("admin.d857bd7b68596f8dc5c7a5c309f60fea"),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.b3cbd780c7273e66276679ca12f166f0"),
            "error"
          );
        target.user.health = 0;
        player.user.log(
          "AdminJob",
          langStringDefault("admin.c8e5b6e569ff1256dabe41debc32880c"),
          target.dbid
        );
      },
    });
  }
  if (target) {
    if (user.isAdminNow(6)) {
      m.newItem({
        name: langStringDefault("admin.1787bea89ba666b2823394ee34862f22"),
        more: "",
        onpress: () => {
          if (!mp.players.exists(target))
            return player.notify(
              player.user.LangString("admin.ef859bcf6788ac7983fe39c40c9320d0"),
              "error"
            );
          let submenu = menu.new(
            player,
            player.user.LangString("admin.fc6b2521c37fd5c5e917135d1754d152")
          );
          submenu.onclose = () => {
            userChoise(player, data.id);
          };
          QUESTS_DATA.forEach((item) => {
            submenu.newItem({
              name: item.name,
              desc: item.desc,
              onpress: () => {
                if (!mp.players.exists(target))
                  return player.notify(
                    player.user.LangString(
                      "admin.998d9ffd03c853c666586e09e66cb2f7"
                    ),
                    "error"
                  );
                target.user.giveQuest(item.id);
                player.notify(
                  player.user.LangString(
                    "admin.7c080738a176130d465a0bd6adf05acb"
                  )
                );
                userChoise(player, data.id);
              },
            });
          });
          submenu.open();
        },
      });
      m.newItem({
        name: langStringDefault("admin.eed911f5485e4e01d008568d850b4d8e"),
        more: "",
        onpress: () => {
          if (!mp.players.exists(target))
            return player.notify(
              player.user.LangString("admin.739ff988fab6d8cf1fdc08940b70e9b9"),
              "error"
            );
          target.user.quests = [];
        },
      });
      m.newItem({
        name: langStringDefault("admin.9690a90c1d57a463918680a133c47a8d"),
        desc: langStringDefault("admin.51cefa5af8a91793e7f659237d1fbf14"),
        onpress: () => {
          if (!mp.players.exists(target))
            return player.notify(
              player.user.LangString("admin.dec5c883cd94a5b678c4d8eeb3ea4725"),
              "error"
            );
          writeSpecialLog(
            langStringDefault("admin.e414eab63eae93c42028e5b4366edbfb"),
            player,
            target.user.id
          );
          target.user.entity.successItem = [];
          player.notify(
            player.user.LangString("admin.cb7d4ead6d81f6cd9511ffba6f98f76b")
          );
        },
      });
      m.newItem({
        name: langStringDefault("admin.683a4dbbc5cff4a1ebc6d7d5ef127425"),
        more: "",
        onpress: () => {
          if (!mp.players.exists(target))
            return player.notify(
              player.user.LangString("admin.aa5c88c263029ad8ce4d8e0207e973e8"),
              "error"
            );
          writeSpecialLog(
            langStringDefault("admin.6a5576e4e5b41b0129c207e784b8ee87"),
            player,
            target.user.id
          );
          target.user.tattoos = [];
          target.user.reloadTattoo();
        },
      });
    }
    if (user.hasPermission("admin:vehicle:givetoplayer")) {
      m.newItem({
        name: langStringDefault("admin.85430329d6abb3af2f6d8b773333425a"),
        more: "",
        onpress: () => {
          let search = "";
          const s = () => {
            if (!mp.players.exists(target))
              return player.notify(
                player.user.LangString(
                  "admin.5122ca29b9a1ff549fa1b42024305c73"
                ),
                "error"
              );
            let submenu = menu.new(
              player,
              player.user.LangString("admin.110438ba80ee512c3a298d1e36302659")
            );
            submenu.onclose = () => {
              userChoise(player, data.id);
            };
            submenu.newItem({
              name: langStringDefault("admin.3d0efa35cb51dd34d1a9fe95409e75c5"),
              onpress: () => {
                menu
                  .input(
                    player,
                    player.user.LangString(
                      "admin.47530de07f6082d8943a32f31c39513d"
                    ),
                    search,
                    15
                  )
                  .then((n) => {
                    search = n ? n : "";
                    s();
                  });
              },
            });
            [...vehicleConfigs]
              .map((q) => q[1])
              .filter(
                (q) =>
                  !search || q.name.toLowerCase().includes(search.toLowerCase())
              )
              .forEach((item) => {
                submenu.newItem({
                  name: item.name,
                  onpress: () => {
                    if (!mp.players.exists(target))
                      return player.notify(
                        player.user.LangString(
                          "admin.792261332a91f1a0b052b6fb11374e69"
                        ),
                        "error"
                      );
                    const pos = target.user.getFreeVehicleSlot();
                    if (!pos)
                      return player.notify(
                        player.user.LangString(
                          "admin.28850255277d4257ceb0af88e0b95bb8"
                        ),
                        "error"
                      );
                    Vehicle.createNewDatabaseVehicle(
                      target,
                      item.id,
                      { r: 0, g: 0, b: 0 },
                      {
                        r: 0,
                        g: 0,
                        b: 0,
                      },
                      new mp.Vector3(pos.x, pos.y, pos.z),
                      pos.h,
                      target.user.house,
                      0,
                      0
                    );
                    writeSpecialLog(
                      langStringDefault(
                        "admin.96a3c61e60d5ef45c9750cbbd955ba1f",
                        item.name
                      ),
                      player,
                      target.user.id
                    );
                    player.notify(
                      player.user.LangString(
                        "admin.578bd20325864b177fb1b70e66894cdd"
                      ),
                      "success"
                    );
                    target.notify(
                      target.user.LangString(
                        "admin.1a4256761ee11cc0c45d0e15ba2bd492",
                        item.name
                      ),
                      "success"
                    );
                  },
                });
              });
            submenu.open();
          };
          s();
        },
      });
    }
  }
  if (user.hasPermission("admin:useredit:wanted")) {
    m.newItem({
      name: langStringDefault("admin.c3cc78c5ff3fadadf0b736ac76e92f62"),
      more: "",
      onpress: () => {
        menu
          .input(
            player,
            player.user.LangString("admin.a69295670e6507449d0377b072cf1d2a"),
            null,
            1,
            "int"
          )
          .then((lvl) => {
            if (!lvl || lvl <= 0) return;
            menu
              .input(
                player,
                player.user.LangString(
                  "admin.a9cd0f970dfbea416efe4fd62ef8b123"
                ),
                "",
                100,
                "textarea"
              )
              .then((reason) => {
                if (!reason) return;
                if (target && !mp.players.exists(target))
                  return player.notify(
                    player.user.LangString(
                      "admin.7f5ca6ab046b4af19a7044069c632449"
                    ),
                    "error"
                  );
                if (target) {
                  target.user.giveWanted(lvl as any, reason);
                  userChoise(player, id);
                  player.notify(
                    player.user.LangString(
                      "admin.4536819b67b4c46a3a39252942918dc1"
                    ),
                    "success"
                  );
                } else {
                  data.wanted_level = lvl as any;
                  data.wanted_reason = reason;
                  data.save().then(() => {
                    writeSpecialLog(
                      langStringDefault(
                        "admin.5613b7e9e9df60ea9e465f8607a2d34f"
                      ),
                      player,
                      target.user.id
                    );
                    player.notify(
                      player.user.LangString(
                        "admin.92b63251cac6cce16d09495422329417"
                      ),
                      "success"
                    );
                    userChoise(player, id);
                  });
                }
              });
          });
      },
    });
    if (data.wanted_level) {
      m.newItem({
        name: langStringDefault("admin.aa8c68b2d8f46f769b3978f751dba424"),
        more: "",
        onpress: () => {
          if (target && !mp.players.exists(target))
            return player.notify(
              player.user.LangString("admin.376e826cc9060b886cf0edbd7d843ffe"),
              "error"
            );
          if (target) {
            target.user.clearWanted();
            userChoise(player, id);
            player.notify(
              player.user.LangString("admin.51ba9d8698511a5add201a545db866f0"),
              "success"
            );
          } else {
            data.wanted_level = 0;
            data.wanted_reason = "";
            data.save().then(() => {
              player.notify(
                player.user.LangString(
                  "admin.bb3fd8b826400cfb1361f79aa6252639"
                ),
                "success"
              );
              userChoise(player, id);
            });
          }
        },
      });
    }
  }
  if (user.hasPermission("admin:useredit:jail")) {
    m.newItem({
      name: langStringDefault("admin.88a251ffe53ac9c23885a4695783c0df"),
      more: "",
      onpress: async () => {
        const reason = await menu.input(
          player,
          player.user.LangString("admin.7266bbfa75e646174248df1933700f5f"),
          "",
          30
        );
        const time = await menu.input(
          player,
          player.user.LangString("admin.32164296d716b211f808d8f897fbebfd"),
          "",
          5,
          "int"
        );

        prison.jailAdmin(player, data.id, time, reason);
      },
    });
    if (data.prison) {
      m.newItem({
        name: langStringDefault("admin.eb2ab000f9e40c4199c4ee97b6001796"),
        more: `${data.jail_time_admin}`,
        onpress: () => {
          prison.unjailAdmin(player, data.id);
        },
      });
    }
  }

  const house = target ? target.user.houseEntity : houses.getByOwner(id);
  if (house) {
    m.newItem({
      name: langStringDefault("admin.a535505541e4480ed606827ecc6e3598"),
      more: `${house.name} #${house.id}`,
      onpress: () => {
        if (user.hasPermission("admin:houses:editmarks")) {
          openHouseEditAdminMenu(player, house);
        } else {
          user.teleport(house.x, house.y, house.z, house.h, house.d);
        }
      },
    });
  }

  const targetBusiness = target
    ? target.user.business
    : business.getByOwner(id);
  if (targetBusiness) {
    m.newItem({
      name: langStringDefault("admin.ac0ddaf20aad4b61725142be227ae08c"),
      more: `#${targetBusiness.id}`,
      onpress: () => {
        const pos = targetBusiness.positions[0];
        user.teleport(pos.x, pos.y, pos.z, 0, targetBusiness.dimension);
      },
    });
  }

  const targetVehs = Vehicle.getPlayerVehicles(data.id);
  if (targetVehs.length === 0) {
    m.newItem({
      name: langStringDefault("admin.910ec39323fb8ee4ef9fee9deb2a3b82"),
      more: langStringDefault("admin.5608af1014aeee662318e034ef9cae6c"),
      onpress: () => {
        if (targetVehs.length === 0) return;
      },
    });
  } else {
    m.newItem({
      name: langStringDefault("admin.b4f466072af19eb7a54903ee585c7393"),
      more: `x${targetVehs.length}`,
      onpress: () => {
        let submenu = menu.new(
          player,
          player.user.LangString("admin.69230cedbe01adc128212791b4f17e8d")
        );
        submenu.onclose = () => {
          userChoise(player, data.id);
        };
        targetVehs.map((veh) => {
          submenu.newItem({
            name: `#${veh.id} ${veh.name}`,
            more: `${veh.number}`,
            desc: langStringDefault(
              "admin.2698830a81a347fcf00df559b114d4c1",
              veh.isDonate ? DONATE_MONEY_NAMES[2] : "$",
              system.numberFormat(veh.data.cost),
              veh.onParkingFine
                ? langStringDefault(
                    "admin.b597c84445285cfcb5f076ba18661bf7",
                    system.numberFormat(veh.fine)
                  )
                : langStringDefault(
                    "admin.6cc3e9007e26f44f55be3531d35c60f3",
                    veh.inSpawnPoint
                      ? langStringDefault(
                          "admin.4787b3960b9ca803585232d992a32f8a"
                        )
                      : langStringDefault(
                          "admin.1ec20f864d9853244d9196f94ba3f797"
                        ),
                    parking
                      .allVehsInAllParking()
                      .find((q) => q.entity.id === veh.id)
                      ? langStringDefault(
                          "admin.018528cd5b269b4506b62f347a2d9937"
                        )
                      : langStringDefault(
                          "admin.b3d7ec33b9236630b7d74ff556a16e76"
                        )
                  )
            ),
            onpress: () => {
              let submenu2 = menu.new(
                player,
                player.user.LangString("admin.f5f5fdf46a21ecba96f9a4c3d9f83eaa")
              );
              submenu.onclose = () => {
                userChoise(player, data.id);
              };
              submenu2.newItem({
                name: langStringDefault(
                  "admin.9c4f342029495dc07de259405b027f97"
                ),
                onpress: () => {
                  veh.respawn();
                },
              });
              submenu2.newItem({
                name: langStringDefault(
                  "admin.409072f82a1f03c06dc13e0205fa2af6"
                ),
                onpress: () => {
                  Vehicle.teleport(
                    veh.vehicle,
                    player.position,
                    player.heading,
                    player.dimension
                  );
                },
              });
              submenu2.newItem({
                name: langStringDefault(
                  "admin.dc757172f6c608654a44ada1a6d12195"
                ),
                onpress: () => {
                  if (veh.exists)
                    user.teleport(
                      veh.vehicle.position.x,
                      veh.vehicle.position.y,
                      veh.vehicle.position.z,
                      0,
                      veh.vehicle.dimension
                    );
                },
              });
              submenu2.newItem({
                name: langStringDefault(
                  "admin.bcbf40c3e4b11aefc514a810116b1736"
                ),
                onpress: () => {
                  user.teleport(
                    veh.position.x,
                    veh.position.y,
                    veh.position.z,
                    veh.position.h,
                    veh.position.d
                  );
                },
              });
              if (user.isAdminNow(6)) {
                submenu2.newItem({
                  name: langStringDefault(
                    "admin.9e22bb7dbb2c2377bb0708a923ac14e1"
                  ),
                  onpress: () => {
                    menu.accept(player).then((status) => {
                      if (!status) return;
                      veh.deleteFromDatabase();
                      userChoise(player, id);
                      player.notify(
                        player.user.LangString(
                          "admin.e65bfcb24466e89e90603b3e6a216647"
                        ),
                        "success"
                      );
                    });
                  },
                });
              }
              submenu2.open();
            },
          });
        });
        submenu.open();
      },
    });
  }
  if (target && user.hasPermission("admin:useredit:vipcontrol")) {
    let currentVip = target.user.vipData;
    m.newItem({
      name: "Vip",
      more: `${
        currentVip
          ? currentVip.name
          : langStringDefault("admin.1d1a32fd2d758cae603a5b3bda7d35a1")
      }`,
      desc: `${
        currentVip
          ? langStringDefault(
              "admin.b160d7a698dea5b51319ff08e695f03c",
              system.timeStampString(currentVip.end)
            )
          : null
      }`,
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.102504c604a40da84b48233a9c0ca115"),
            "error"
          );
        let currentVip = target.user.vipData;
        const submenu = menu.new(
          player,
          player.user.LangString("admin.5f26140237836bdef4c222beda8156b0"),
          player.user.LangString("admin.19cf924d3d7724bac8b3588bcd7ad7f3")
        );
        submenu.onclose = () => {
          userChoise(player, id);
        };
        if (currentVip) {
          submenu.newItem({
            name: "VIP",
            more: `${
              currentVip
                ? currentVip.name
                : langStringDefault("admin.1a5078caf888387544bfe579063bdd92")
            }`,
            desc: `${
              currentVip
                ? langStringDefault(
                    "admin.753f641d2aa5dcc97c45ec16e3bb6b2b",
                    system.timeStampString(currentVip.end)
                  )
                : null
            }`,
          });
          submenu.newItem({
            name: langStringDefault("admin.4af5b03266ba330c366fa4c72577045f"),
            onpress: () => {
              menu
                .input(
                  player,
                  player.user.LangString(
                    "admin.01fc43a659d155f349ea0e94d5cc684b"
                  ),
                  30,
                  3,
                  "int"
                )
                .then((days) => {
                  if (!days) return;
                  if (isNaN(days) || days < 0) return;
                  if (days > 365)
                    return player.notify(
                      player.user.LangString(
                        "admin.a3d49e8a5cdb28bd8fb42cdf7675aca2"
                      ),
                      "error"
                    );
                  if (!mp.players.exists(target))
                    return player.notify(
                      player.user.LangString(
                        "admin.ef1fb0723e11b53f6eefbce6563a310b"
                      ),
                      "error"
                    );
                  target.user.giveVip(currentVip.id, days);
                  writeSpecialLog(
                    langStringDefault(
                      "admin.dc17222cbe902b2ffda5657221084fc4",
                      currentVip.name,
                      days
                    ),
                    player,
                    target.user.id
                  );
                  player.notify(
                    player.user.LangString(
                      "admin.c2ff97b247b0f392d2ec806b64459824"
                    )
                  );
                  userChoise(player, id);
                });
            },
          });
          submenu.newItem({
            name: langStringDefault("admin.63a290007d0dd4b56a94f1191cd33db6"),
            onpress: () => {
              menu.accept(player).then((status) => {
                if (!status) return;
                if (!mp.players.exists(target))
                  return player.notify(
                    player.user.LangString(
                      "admin.bdd78fec4693ef263ff90baddad70044"
                    ),
                    "error"
                  );
                target.user.removeVip();
                writeSpecialLog(
                  langStringDefault("admin.84961ab7b81b9319927d6e5ab3e18ba1"),
                  player,
                  target.user.id
                );
                player.notify(
                  player.user.LangString(
                    "admin.0dd2513e4cf256bb2af3d5446d4ba625"
                  )
                );
                userChoise(player, id);
              });
            },
          });
        }
        submenu.newItem({
          name: langStringDefault("admin.3309ca393525f197a68b12f5763ccc62"),
        });
        VIP_TARIFS.map((tarif) => {
          submenu.newItem({
            name: `${tarif.name}`,
            more: `${tarif.id}`,
            desc: langStringDefault(
              "admin.d20be04621caebe0a991133a9ac73560",
              tarif.cost
                ? system.numberFormat(tarif.cost)
                : langStringDefault("admin.6287b6611e4cbd6508fbbf04e662118a"),
              tarif.media
                ? langStringDefault("admin.33656648dcf25180a38bcfe5e07aa42e")
                : langStringDefault("admin.2f103564dbce741afbfd9c29ca46929f"),
              tarif.payday_money
                ? system.numberFormat(tarif.payday_money)
                : langStringDefault("admin.6e14a82d0824688cf16b2d2decaf15e2"),
              tarif.payday_exp
                ? system.numberFormat(tarif.payday_exp)
                : langStringDefault("admin.6e14a82d0824688cf16b2d2decaf15e2"),
              tarif.payday_donate
                ? system.numberFormat(tarif.payday_donate)
                : langStringDefault("admin.6e14a82d0824688cf16b2d2decaf15e2"),
              tarif.job_skill_multipler
                ? `+${tarif.job_skill_multipler}%`
                : langStringDefault("admin.6e14a82d0824688cf16b2d2decaf15e2")
            ),
            onpress: () => {
              if (!mp.players.exists(target))
                return player.notify(
                  player.user.LangString(
                    "admin.af3f584f6e9bc53366457d0f1b54b784"
                  ),
                  "error"
                );
              target.user.giveVip(tarif.id, 30);
              writeSpecialLog(
                langStringDefault(
                  "admin.e63cf0b364596e487c1cb242a70fae5e",
                  tarif.name
                ),
                player,
                target.user.id
              );
              player.notify(
                player.user.LangString(
                  "admin.5ee65aa61c27adae92e6f43dd3d96eb2"
                ),
                "success"
              );
            },
          });
        });
        submenu.open();
      },
    });
  }
  if (target && user.isAdminNow(6)) {
    m.newItem({
      name: langStringDefault("admin.56b259338d33840e6c3d4393f4ade932"),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.0269785eac97b4a0afe5227a6cde3304"),
            "error"
          );
        target.user.save();
        player.notify(
          player.user.LangString("admin.f1e7f07585fcde9cce59919aafe3a180"),
          "success"
        );
      },
    });
  }
  if (user.hasPermission("admin:useredit:coins")) {
    m.newItem({
      name: "SC-Coins",
      more: `${
        target && target.user
          ? system.numberFormat(target.user.donate_money)
          : system.numberFormat(dataaccount.donate)
      }`,
      onpress: () => {
        menu
          .input(
            player,
            player.user.LangString("admin.7b7c93d988dbad0b5033ab7e765ea47b"),
            target && target.user
              ? target.user.donate_money
              : dataaccount.donate,
            8,
            "int"
          )
          .then((val) => {
            if (val === null) return;
            if (val < 0 || val > 999999999)
              return player.notify(
                player.user.LangString(
                  "admin.5fbf67fc083d04d2fe096d99c156c309"
                ),
                "error"
              );
            let lastValue =
              target && target.user
                ? target.user.donate_money
                : dataaccount.donate;
            if (mp.players.exists(target)) {
              target.user.donate_money = val;
              writeSpecialLog(
                langStringDefault(
                  "admin.f8c87227c164c2331986b1211808d757",
                  lastValue,
                  val
                ),
                player,
                target.user.id
              );
            } else {
              if (dataaccount) {
                dataaccount.donate = val;
                writeSpecialLog(
                  langStringDefault(
                    "admin.3b2703be3b1e7ab4e1e9b43ae0af5780",
                    lastValue,
                    val
                  ),
                  player,
                  dataaccount.id
                );
                saveEntity(dataaccount);
              }
            }

            player.notify(
              player.user.LangString("admin.f9efea16ceac25dfc9747f0015456805"),
              "success"
            );
            userChoise(player, id);
          });
      },
    });
  }
  if (target && user.hasPermission("admin:useredit:chips")) {
    m.newItem({
      name: langStringDefault("admin.f1620fc6f04f31d0686cf21d50b4919c"),
      more: `${system.numberFormat(target.user.chips)}`,
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.2a53263f88ff5da665656090de4293e5"),
            "error"
          );
        menu
          .input(
            player,
            player.user.LangString("admin.cdda3f9d4d2a6814ca2d967a03429a5f"),
            target.user.chips,
            8,
            "int"
          )
          .then((val) => {
            if (!mp.players.exists(target))
              return player.notify(
                player.user.LangString(
                  "admin.17e9c512935a14c7cb55e24894378bb0"
                ),
                "error"
              );
            if (val === null) return;
            if (val < 0 || val > 999999999)
              return player.notify(
                player.user.LangString(
                  "admin.978ce2b30107d4c88039879ca7866895"
                ),
                "error"
              );
            target.user.chips = val;
            player.notify(
              player.user.LangString("admin.ecbc7344e72c4769e7653338fa695ec7"),
              "success"
            );
            userChoise(player, id);
            player.user.log(
              "AdminJob",
              langStringDefault("admin.7cbb2c69dc6f42bec7282f79106bc0a8", val),
              target
            );
          });
      },
    });
  }
  if (user.hasPermission("admin:setmedia")) {
    m.newItem({
      name: langStringDefault("admin.9ca36dc033303fc2acd7e63bc3704a59"),
      more: `${
        target && target.user
          ? target.user.account.isMedia
            ? player.user.LangString("admin.4220dda4cf14f222a99918915909eb85")
            : player.user.LangString("admin.463aac11836d4c7bbe8be9affa099e4c")
          : dataaccount.isMedia
          ? player.user.LangString("admin.0734502f2cbf6717f4c0e693f4b63e65")
          : player.user.LangString("admin.e33609139cf08dacd84f40e96a063b61")
      }`,
      onpress: () => {
        menu.accept(player).then((status) => {
          if (!status) return;
          if (target && target.user) {
            target.user.account.isMedia = !target.user.account.isMedia;
            target.setVariable("media", target.user.account.isMedia);
            writeSpecialLog(
              langStringDefault("admin.89408e56166624ce1ce5f3e8440fe817"),
              player,
              target.user.id
            );
            saveEntity(target.user.account);
          } else {
            dataaccount.isMedia = !dataaccount.isMedia;
            writeSpecialLog(
              langStringDefault("admin.2e61d4ba180a8399802004edfc51c6e6"),
              player,
              data.id
            );
            saveEntity(dataaccount);
          }
          player.notify(
            player.user.LangString("admin.29b869a49014778368e262e32808461a"),
            "success"
          );
          userChoise(player, id);
        });
      },
    });
  }
  if (target && user.hasPermission("admin:useredit:payday")) {
    m.newItem({
      name: langStringDefault("admin.d3a92359f03499e3b7966c88836d82c1"),
      onpress: () => {
        menu.accept(player).then((status) => {
          if (!status) return;
          if (!mp.players.exists(target))
            return player.notify(
              player.user.LangString("admin.f5a594b642c7bf90d1142dae23b0b93e"),
              "error"
            );
          target.user.payday();
          writeSpecialLog(
            langStringDefault("admin.df7110c4c209bbd7f228f671f707dabb"),
            player,
            target.user.id
          );
          player.notify(
            player.user.LangString("admin.399b64b3a97d72c06fc711515ca6cf8d"),
            "success"
          );
          userChoise(player, id);
        });
      },
    });
  }

  m.newItem({
    name: langStringDefault("admin.2511cdb5af54026808c9f3b2699dda0b"),
    more: `$${system.numberFormat(data.money)}`,
    onpress: () => {
      if (!user.hasPermission("admin:useredit:money"))
        return player.notify(
          player.user.LangString("admin.323736588abfc31b6eb65eaef4ba92db"),
          "error"
        );
      menu
        .input(
          player,
          player.user.LangString("admin.b177a1867bbbcfb888776eff7e9da043"),
          data.money,
          8,
          "int"
        )
        .then((val) => {
          if (val === null) return;
          if (val < 0 || val > 999999999)
            return player.notify(
              player.user.LangString("admin.7b7eb7fc46941f88b696415bc663b4c6"),
              "error"
            );
          if (user.admin_level < 6)
            player.user.log(
              "AdminJob",
              langStringDefault(
                "admin.5522ddda90b9e5940d696f5096c5809b",
                data.money,
                val,
                data.money > val
                  ? `-${data.money - val}$`
                  : `+${val - data.money}$`
              ),
              data.id
            );
          const lastValue = data.money;
          if (target) target.user.money = val;
          else {
            data.money = val;
            data.save();
          }
          writeSpecialLog(
            langStringDefault(
              "admin.ce57d4339c1f80a3193009161b1b4170",
              lastValue,
              val
            ),
            player,
            data.id
          );
          player.notify(
            player.user.LangString("admin.fa10efc240eb5eb7360b1d8aea7349ec"),
            "success"
          );
          userChoise(player, id);
        });
    },
  });
  if (data.bank_number) {
    m.newItem({
      name: langStringDefault("admin.30efecaf64fe5057e1620d33801740c5"),
      more: `$${system.numberFormat(data.bank_money)}`,
      onpress: () => {
        if (!user.hasPermission("admin:useredit:money"))
          return player.notify(
            player.user.LangString("admin.b4c45bf173d0c67b1f8e2d65da66c24c"),
            "error"
          );
        menu
          .input(
            player,
            player.user.LangString("admin.88eb77440add1db4e0f4f70929dc4015"),
            data.bank_money,
            8,
            "int"
          )
          .then((val) => {
            if (val === null) return;
            if (val < 0 || val > 999999999)
              return player.notify(
                player.user.LangString(
                  "admin.4a481537ababaf45a92d0384bf459267"
                ),
                "error"
              );
            if (user.admin_level < 6)
              player.user.log(
                "AdminJob",
                langStringDefault(
                  "admin.a2f16a83383e02449f76558ff0589c6d",
                  data.bank_money,
                  val,
                  data.bank_money > val
                    ? `-${data.bank_money - val}$`
                    : `+${val - data.bank_money}$`
                ),
                data.id
              );
            const lastValue = data.bank_money;
            if (target) target.user.bank_money = val;
            else {
              data.bank_money = val;
              data.save();
            }
            writeSpecialLog(
              langStringDefault(
                "admin.12d3aa91ccb7aa1f665db3a207e06f0c",
                lastValue,
                val
              ),
              player,
              data.id
            );
            player.notify(
              player.user.LangString("admin.6e7172b25ab311184b95d7719e1eb822"),
              "success"
            );
            userChoise(player, id);
          });
      },
    });
  }

  if (target && data.family) {
    m.newItem({
      name: langStringDefault("admin.c13503e26568fcea34ce3f074fb260f0"),
      more: `${Family.getByID(data.family).name}`,
      desc: langStringDefault(
        "admin.f86328a34002cbb0c00e2295a29b40e2",
        data.family
      ),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.2a823ac188b0c7eb4e4196cc759fcab4"),
            "error"
          );
        showFamilyEditAdminMenu(player, Family.getByID(data.family));
      },
    });
    m.newItem({
      name: langStringDefault("admin.78d17b23b702fe0667915af76109c003"),
      more: `${
        target.user.family.getRank(target.user.familyRank)
          ? target.user.family.getRank(target.user.familyRank).name
          : langStringDefault("admin.01a36fc689364f12f6b8e67383d7802b")
      }`,
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.168e7223d7d1ca4377c0dd30316bb8b2"),
            "error"
          );
        if (!target.user.family) return;
        if (!user.hasPermission("admin:useredit:familyRank"))
          return player.notify(
            player.user.LangString("admin.fbbbb0e48f7e4b39138db34124390165"),
            "error"
          );
        menu
          .selector(
            player,
            player.user.LangString("admin.d433e72975b940248fd008dded4e374f"),
            target.user.family.ranks.map((r) => {
              return r.name;
            }),
            false
          )
          .then((name) => {
            if (!mp.players.exists(target))
              return player.notify(
                player.user.LangString(
                  "admin.1b5d3ef40a1d8859b674efbd9e885b27"
                ),
                "error"
              );
            if (!target.user.family) return;
            target.user.familyRank = target.user.family.ranks.find(
              (r) => r.name == name
            )
              ? target.user.family.ranks.find((r) => r.name == name).id
              : 1;
            writeSpecialLog(
              langStringDefault(
                "admin.643e9979599b70439b5467acd664607a",
                target.user.name,
                target.user.family.getRank(target.user.familyRank).name,
                target.user.family.name
              ),
              player,
              target.user.id
            );
            player.notify(
              player.user.LangString(
                "admin.a6a62bf2e82a0cccb22c9474691140c2",
                target.user.name,
                target.user.family.getRank(target.user.familyRank).name
              )
            );
          });
      },
    });
  }

  if (user.hasPermission("admin:useredit:armour") && target) {
    m.newItem({
      name: langStringDefault("admin.3b08d179d235407ee280f73a0951f3cf"),
      more: `${target.armour}`,
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.f41f85db96aff83ceae931e0a9435dea"),
            "error"
          );
        menu
          .input(
            player,
            player.user.LangString("admin.6736b96715c1209d5fc1b5859393580d"),
            target.armour,
            3,
            "int"
          )
          .then((val) => {
            if (!mp.players.exists(target))
              return player.notify(
                player.user.LangString(
                  "admin.5d2b037c552ebef9771e2789f7acc0cc"
                ),
                "error"
              );
            if (val === null) return;
            if (val < 0 || val > 100)
              return player.notify(
                player.user.LangString(
                  "admin.2b90957df507f08f0afb09a37766925a"
                ),
                "error"
              );
            player.user.log(
              "AdminJob",
              langStringDefault(
                "admin.88789f1e202ba74babc2230db28f4dfb",
                target.armour,
                val,
                target.armour > val
                  ? `-${target.armour - val}%`
                  : `+${val - target.armour}%`
              ),
              target
            );
            target.user.armour = val;
            player.notify(
              player.user.LangString("admin.647ead5ba26af349af97110fa00e83e6"),
              "success"
            );
            userChoise(player, id);
          });
      },
    });
  }
  if (user.hasPermission("admin:useredit:skin") && target) {
    m.newItem({
      name: langStringDefault("admin.b7ff0aa67d9b01f26fd68333dd31ea0c"),
      more: `${
        target.user.mp_character
          ? langStringDefault("admin.c9faf94c4bd4033e67d4f79cb299510b")
          : langStringDefault("admin.e97be54be1d7e32d1bd1a14eafc74add")
      }`,
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.2c6f6383414b07545e4f5f184f5e6865"),
            "error"
          );
        if (!target.user.mp_character) {
          target.user.reloadSkin();
          player.notify(
            player.user.LangString("admin.f17adbbe8cdf30233e9a3bd943a14756"),
            "success"
          );
          userChoise(player, id);
          return;
        }
        menu
          .selector(
            player,
            player.user.LangString("admin.8a5354cba89c0486fcacdbffe33f9420"),
            SkinChange,
            false,
            null,
            true
          )
          .then((model) => {
            if (!model) return;
            target.user.anticheatProtect("heal");
            target.model = mp.joaat(model);
            target.user.inventoryAttachSync();
            player.notify(
              player.user.LangString("admin.1687ac10c4f083a81128b4246df7c205"),
              "success"
            );
            userChoise(player, id);
          });
      },
    });
  }
  if (user.hasPermission("admin:useredit:level")) {
    m.newItem({
      name: langStringDefault("admin.daff83cb54074b2933ccd864230ed427"),
      more: `${data.level} LVL`,
      onpress: () => {
        if (target && !mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.607a1b4a016eabfe7790003f99f65615"),
            "error"
          );
        menu
          .input(
            player,
            player.user.LangString("admin.201c6fc98240568dfdac57add9535ef8"),
            target.user.level,
            3,
            "int"
          )
          .then((val) => {
            if (target && !mp.players.exists(target))
              return player.notify(
                player.user.LangString(
                  "admin.29532a5e22cc2937169985f6f58155b1"
                ),
                "error"
              );
            if (!val) return;
            if (val < 0 || val > 100)
              return player.notify(
                player.user.LangString(
                  "admin.8da9cb7e1a32f0fdaf48cb5c166b5c97"
                ),
                "error"
              );
            player.user.log(
              "AdminJob",
              langStringDefault(
                "admin.1848dc864794aa876ce9d460fa3f2710",
                data.level,
                val,
                data.level > val
                  ? `-${data.level - val}`
                  : `+${val - data.level}`
              ),
              data.id
            );
            data.level = val;
            if (!target) data.save();
            player.notify(
              player.user.LangString("admin.ced725df68b05d8060f94885536fcf87"),
              "success"
            );
            userChoise(player, id);
          });
      },
    });
  }
  if (user.hasPermission("admin:useredit:played_time")) {
    m.newItem({
      name: "Playtime",
      more: `${data.played_time || 0} min`,
      onpress: () => {
        if (target && !mp.players.exists(target))
          return player.notify("Jucatorul nu mai este online.", "error");

        menu
          .input(
            player,
            "Seteaza noul playtime (în minute):",
            data.played_time || 0,
            5,
            "int"
          )
          .then((val) => {
            if (target && !mp.players.exists(target))
              return player.notify("Jucatorul nu mai este online.", "error");

            if (val === undefined || val < 0)
              return player.notify("Valoare invalida.", "error");

            player.user.log(
              "AdminJob",
              `Adminul a modificat played_time de la ${data.played_time} la ${val}`,
              data.id
            );

            data.played_time = val;
            if (!target) data.save();

            player.notify("Playtime modificat cu succes.", "success");
            userChoise(player, id);
          });
      },
    });
  }

  if (user.hasPermission("admin:useredit:editor") && target) {
    m.newItem({
      name: langStringDefault("admin.bb1a615a35bf49daf8d96fe469a2f8f9"),
      onpress: () => {
        if (!mp.players.exists(target))
          return player.notify(
            player.user.LangString("admin.398c1edeee7e55d1c284ede728a5269a"),
            "error"
          );
        menu.close(target);
        target.user.startCustomization();
      },
    });
  }
  if (user.hasPermission("admin:deletepersonage")) {
    m.newItem({
      name: langStringDefault("admin.8d9a4c17f8dfd644f07c10796bc11aee"),
      onpress: () => {
        if (
          mp.config.announce &&
          data.admin_level === 6 &&
          user.account.id !== dataaccount.id
        )
          return player.notify(
            player.user.LangString("admin.8d43295107086ae005a799217a2ca3da"),
            "error"
          );
        menu.accept(player).then((status) => {
          if (!status) return;
          menu.close(player);
          player.notify(
            player.user.LangString("admin.e101156504f6cf37ae6eb0ee64458ecd"),
            "success"
          );
          User.deletepersonage(data.id);
          writeSpecialLog(
            langStringDefault(
              "admin.b8f7cf8f2111bf603f2cac75b7b64010",
              data.id
            ),
            player,
            data.id
          );
        });
      },
    });
  }
  // if (user.hasPermission('admin:celarpersonage')) {
  //     m.newItem({
  //         name: '~r~Очистить персонажа',
  //         onpress: () => {
  //             if(mp.config.announce && data.admin_level === 6 && user.account.id !== dataaccount.id) return player.notify('~r~Вы не можете очистить персонажа главного адмистратора. Только если это ваш персонаж', 'error');
  //             menu.accept(player).then(status => {
  //                 if(!status) return;
  //                 menu.close(player);
  //                 player.notify('Персонаж будет очищен через 10 секунд', 'success')
  //                 User.clearPersonage(data.id)
  //             })
  //         }
  //     })
  // }
  if (user.hasPermission("admin:changeidpersonage")) {
    m.newItem({
      name: langStringDefault("admin.69479776cf5d49e2081477948493a6a4"),
      onpress: () => {
        if (
          mp.config.announce &&
          data.admin_level === 6 &&
          user.account.id !== dataaccount.id
        )
          return player.notify(
            player.user.LangString("admin.39415015e855d06176e38d059e6d7e30"),
            "error"
          );
        menu.accept(player).then((status) => {
          if (!status) return;
          menu
            .input(
              player,
              player.user.LangString("admin.cc33e54b62541a4aa5190c3589015dfa"),
              "",
              6,
              "int"
            )
            .then((val) => {
              if (!val || val < 0 || val > 999999) return;
              menu.close(player);
              player.notify(
                player.user.LangString(
                  "admin.d0d63f35569eb2eab7afc2cd1c9ddf66"
                ),
                "success"
              );
              User.changeId(data.id, val).then((q) => {
                if (!mp.players.exists(player)) return;
                player.notify(
                  `${
                    q
                      ? player.user.LangString(
                          "admin.46523b60156343eee4cac9e6a413a889"
                        )
                      : player.user.LangString(
                          "admin.d8b4862762a26354cf110b9f2bdc0334"
                        )
                  }`,
                  "error"
                );
              });
            });
        });
      },
    });
  }

  m.open();
};

CustomEvent.registerClient("admin:fullrestore", (player) => {
  if (!player.user) return;
  if (!player.user.isAdminNow())
    return player.notify(
      player.user.LangString("admin.e73c08a4ca776883902407ba4daf0917"),
      "error"
    );
  let user = player.user;
  user.adminRestore();
});
CustomEvent.registerClient("admins:vehicle:config", (player) => {
  configEditMain(player);
});

const configEditMain = (player: PlayerMp, search?: string, page = 0) => {
  if (!player.user) return;
  let user = player.user;
  if (!user.hasPermission("admin:vehicle:configs"))
    return player.notify(
      player.user.LangString("admin.d5be262fa4aa226488f1aa3226952b63"),
      "error"
    );
  let m = menu.new(
    player,
    player.user.LangString("admin.8bdb9e400ae594f426edbc563266dc55"),
    player.user.LangString("admin.78cbbb7a94ba0ed0e66feab1ff488f5b")
  );
  m.newItem({
    name: langStringDefault("admin.1c5c7b6ced8458b145088f9bd81627e1"),
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.4806613e6fa6df449a39fbd5e34791a3"),
          "",
          100
        )
        .then((val) => {
          if (!val) return configEditMain(player, search, page);
          if (
            [...vehicleConfigs]
              .map((q) => q[1])
              .find((q) => q.model === val.toLowerCase())
          )
            return player.notify(
              player.user.LangString("admin.e313da66b42ca69147a1f6b60c95d7f2"),
              "error"
            );
          let item = new VehicleConfigsEntity();
          item.model = val.toLowerCase();
          item.name = val;
          item.multiple = 100;
          item.save().then((r) => {
            vehicleConfigs.set(r.id, r);
            vehicleConfigEdit(player, r);
          });
        })
        .catch((err) => console.error(err));
    },
  });
  m.newItem({
    name: langStringDefault("admin.43376cb9ea2880db471e62380eb4ed9d"),
    onpress: () => {
      const submenu = menu.new(
        player,
        player.user.LangString("admin.225c381b1e1cd7c84013303bd8552455")
      );

      submenu.onclose = () => {
        configEditMain(player, search, page);
      };

      [...vehicleConfigs]
        .map((q) => q[1])
        .filter((q) => !Vehicle.haveTruck(q.model))
        .map((q) => {
          submenu.newItem({
            name: q.name,
            more: q.model,
            onpress: () => {
              CustomEvent.callClient(player, "verifyVehModel", q.model).then(
                (q) => {
                  if (!q)
                    return player.notify(
                      player.user.LangString(
                        "admin.114ecf1b4b29d822b545d2a4e235bace"
                      ),
                      "error"
                    );
                  let veh = Vehicle.spawn(
                    q.model,
                    player.position,
                    player.heading,
                    player.dimension,
                    true,
                    false
                  );
                  user.putIntoVehicle(veh);
                }
              );
            },
          });
        });

      submenu.open();
    },
  });
  const configs = system.chunkArray(
    [...vehicleConfigs]
      .map((q) => q[1])
      .filter(
        (q) => !search || q.model.toLowerCase().includes(search.toLowerCase())
      ),
    100
  );
  if (configs[page + 1]) {
    m.newItem({
      name: langStringDefault("admin.5d04d5d61f9ecd8f497220ff1c84c3dd"),
      onpress: () => {
        configEditMain(player, search, page + 1);
      },
    });
  }
  m.newItem({
    name: langStringDefault("admin.1e3a23df4494d38285c3d7576d9e3c75"),
    more: search,
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.5342695b722e81cbf59fe5a50692ee93"),
          "",
          50
        )
        .then((val) => {
          if (typeof val === "string") search = val;
          configEditMain(player, search, 0);
        })
        .catch((err) => console.error(err));
    },
  });
  if (configs.length > 1) {
    m.newItem({
      name: langStringDefault("admin.630b92edede859b7c33e7df821feb55f"),
      more: `${page + 1} / ${configs.length}`,
    });
  }
  if (page) {
    m.newItem({
      name: langStringDefault("admin.95c4740084f3b301010c0c283280b7a0"),
      onpress: () => {
        configEditMain(player, search, page - 1);
      },
    });
  }
  if (configs[page])
    configs[page].map((item) => {
      let fuelString = "";
      if (item.fuel_max == 0)
        fuelString = player.user.LangString(
          "admin.dd98f7a8d2f79d27b868bf8ad16b389f"
        );
      else
        fuelString = player.user.LangString(
          "admin.49dc06bbc528917bc3744492b6187116",
          fuelTypeNames[item.fuel_type],
          item.fuel_max,
          item.fuel_min
        );
      m.newItem({
        name: `${item.id}) ${item.name}`,
        more: `${item.model}`,
        desc: langStringDefault(
          "admin.23f3f50b8cd6631947e184835946aaa8",
          system.numberFormat(item.stock),
          fuelString
        ),
        onpress: () => {
          vehicleConfigEdit(player, item);
        },
      });
    });
  m.open();
};

export const vehicleConfigEdit = (
  player: PlayerMp,
  item: VehicleConfigsEntity
) => {
  let m = menu.new(
    player,
    item.name,
    player.user.LangString("admin.b592df415fef22ddbb7211055c8b338f")
  );
  m.onclose = () => {
    configEditMain(player);
  };
  const count = item.model
    ? Vehicle.toArray()
        .filter((veh) => veh.entity)
        .map((veh) => veh.entity.model)
        .filter((veh) => veh && veh.toLowerCase() === item.model.toLowerCase())
        .length
    : 0;
  m.newItem({
    name: langStringDefault("admin.66997577c4d96a67898a078b4c269006"),
    more: `x${count}`,
  });
  m.newItem({
    name: langStringDefault("admin.092b6b23a5b3b857b6eb14794d92b783"),
    more: `${item.model}`,
    onpress: () => {
      menu
        .accept(
          player,
          player.user.LangString("admin.9ccba4aa9d9dfc652251309477c769aa")
        )
        .then((status) => {
          if (!status) return vehicleConfigEdit(player, item);
          vehicleConfigs.delete(item.id);
          player.notify(
            player.user.LangString("admin.e389b857e30cbca09c18fe0dff486c84"),
            "success"
          );
          item.remove();
          configEditMain(player);
        })
        .catch(console.error);
    },
  });

  m.newItem({
    name: langStringDefault("admin.7e595bf7e413b2009944ffe146ab5e3a"),
    more: `${item.name}`,
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.39ddacba8e896ce99b727851561e8c01"),
          item.name,
          200
        )
        .then((val) => {
          if (!val) return vehicleConfigEdit(player, item);
          item.name = val;
          item.save().then((r) => {
            player.notify(
              player.user.LangString("admin.02d26f6f68d0afd23a4bb232fa08c0c1"),
              "success"
            );
            vehicleConfigs.set(r.id, r);
            reloadConfig(r);
            vehicleConfigEdit(player, r);
          });
        })
        .catch((err) => console.error(err));
    },
  });

  m.newItem({
    name: langStringDefault("admin.ee682b7ae198fad8cabaf4faea44467a"),
    more: `$${system.numberFormat(item.cost)}`,
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.8925363a89f19e5935de1642f2fdbc9c"),
          item.cost,
          10,
          "int"
        )
        .then((val) => {
          if (typeof val !== "number") return vehicleConfigEdit(player, item);
          item.cost = val;
          item.save().then((r) => {
            player.notify(
              player.user.LangString("admin.18127601d3d4b34fc6fcbfcf280e0d1c"),
              "success"
            );
            vehicleConfigs.set(r.id, r);
            reloadConfig(r);
            vehicleConfigEdit(player, r);
          });
        })
        .catch((err) => console.error(err));
    },
  });

  m.newItem({
    name: langStringDefault("admin.c9d4f7e768f3b851af210ae92169bca8"),
    more: `${item.multiple}`,
    desc: langStringDefault("admin.52a58905ae6af9673b0c2f1024998269"),
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.26e28ecb849febd3d72bbd78055cb2a5"),
          item.multiple,
          10,
          "int"
        )
        .then((val) => {
          if (typeof val !== "number") return vehicleConfigEdit(player, item);
          item.multiple = val;
          item.save().then((r) => {
            player.notify(
              player.user.LangString("admin.7609d13b803a6b339f039c289199b9fd"),
              "success"
            );
            vehicleConfigs.set(r.id, r);
            reloadConfig(r);
            vehicleConfigEdit(player, r);
          });
        })
        .catch((err) => console.error(err));
    },
  });

  // m.newItem({
  //     name: `Количество на складе`,
  //     more: `${system.numberFormat(item.count)}`,
  //     onpress: () => {
  //         menu.input(player, "Введите количество", item.count, 10, "int").then(val => {
  //             if(typeof val !== "number") return vehicleConfigEdit(player, item);
  //             item.count = val;
  //             item.save().then((r) => {
  //                 player.notify("Параметр сохранён", "success");
  //                 vehicleConfigs.set(r.id, r);
  //                 reloadConfig(r)
  //                 vehicleConfigEdit(player, r);
  //             })
  //         }).catch(err => console.error(err))
  //     }
  // })

  m.newItem({
    name: langStringDefault("admin.e17d65f3caf2abc686402aff65318661"),
    more: langStringDefault(
      "admin.75a37af5688ff176a668587a7475ee42",
      item.stock
    ),
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.3ff237911c768b614219949a471aedd3"),
          item.stock.toString(),
          100,
          "int"
        )
        .then((val) => {
          if (!val) return vehicleConfigEdit(player, item);
          item.stock = val;
          item.save().then((r) => {
            player.notify(
              player.user.LangString("admin.c21535530f9a7de39f75da34fa7973cf"),
              "success"
            );
            vehicleConfigs.set(r.id, r);
            reloadConfig(r);
            vehicleConfigEdit(player, r);
          });
        })
        .catch((err) => console.error(err));
    },
  });
  m.newItem({
    name: langStringDefault("admin.22a60bd0fbcdb0e711ea0aa023b24ade"),
    more: `${
      item.autopilot
        ? langStringDefault("admin.c9c6f755dafdff55fef5f385771f55e2")
        : langStringDefault("admin.f5275550167e71e3a50ab30b2041a8d2")
    }`,
    onpress: () => {
      item.stock = item.autopilot ? 0 : 1;
      item.save().then((r) => {
        player.notify(
          player.user.LangString("admin.5e66336445a4915eb1889f7ee1e4eb52"),
          "success"
        );
        vehicleConfigs.set(r.id, r);
        reloadConfig(r);
        vehicleConfigEdit(player, r);
      });
    },
  });

  const vehLicList: LicenceType[] = ["car", "moto", "air", "boat", "truck"];
  const vehLicListName = vehLicList.map(
    (item, i) => LicenseName[vehLicList[i]]
  );
  m.newItem({
    name: langStringDefault("admin.8e2a43f40103d5f83827e60a34578368"),
    desc: langStringDefault("admin.e57419c9010a2507431b0321ae728d2b"),
    type: "list",
    list: [
      player.user.LangString("admin.d91444ac09b5e45e83c1f57b7a244531"),
      ...vehLicListName,
    ],
    listSelected: vehLicList.findIndex((q) => q === item.license) + 1,
    onpress: (itm) => {
      if (itm.listSelected === 0) {
        (item.license as any) = "";
      } else {
        item.license = vehLicList[itm.listSelected - 1];
      }
      item.save().then((r) => {
        player.notify(
          player.user.LangString("admin.c8c522df24c87f47052bb68f7a17b106"),
          "success"
        );
        vehicleConfigs.set(r.id, r);
        reloadConfig(r);
        vehicleConfigEdit(player, r);
      });
    },
  });

  m.newItem({
    name: langStringDefault("admin.d79f0ec80a178af5ca2634ecfc5fdba3"),
    more: langStringDefault(
      "admin.d8c585151b8226a89664e9fe03d12097",
      item.fuel_max
    ),
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.c82ef96fbdd818eeb7fc20c93563baea"),
          item.fuel_max.toString(),
          100,
          "int"
        )
        .then((val) => {
          if (!val && val !== 0) return vehicleConfigEdit(player, item);
          item.fuel_max = val;
          item.save().then((r) => {
            player.notify(
              player.user.LangString("admin.44c0b7edccb06fce400b99407d6e0a3b"),
              "success"
            );
            vehicleConfigs.set(r.id, r);
            reloadConfig(r);
            vehicleConfigEdit(player, r);
          });
        })
        .catch((err) => console.error(err));
    },
  });

  if (item.fuel_max > 0) {
    m.newItem({
      name: langStringDefault("admin.97a460b34912c3e4415451d68174d775"),
      more: langStringDefault(
        "admin.446d95a5006a113fce145e26adf06fdb",
        item.fuel_min
      ),
      onpress: () => {
        menu
          .input(
            player,
            player.user.LangString("admin.d15734dcb8973fbab89ea87b42405d98"),
            item.fuel_min.toString(),
            100,
            "int"
          )
          .then((val) => {
            if (!val && val !== 0) return vehicleConfigEdit(player, item);
            item.fuel_min = val;
            item.save().then((r) => {
              player.notify(
                player.user.LangString(
                  "admin.eb1ef089d26bc0b3fefcf43d3fb4b407"
                ),
                "success"
              );
              vehicleConfigs.set(r.id, r);
              reloadConfig(r);
              vehicleConfigEdit(player, r);
            });
          })
          .catch((err) => console.error(err));
      },
    });
    m.newItem({
      name: langStringDefault("admin.d6ce96681acae49d6217afb54d3c186e"),
      type: "list",
      list: fuelTypeNames,
      listSelected: item.fuel_type,
      onpress: (itm) => {
        item.fuel_type = itm.listSelected as any;
        item.save().then((r) => {
          player.notify(
            player.user.LangString("admin.69181657c77e97af537b40a96d844d14"),
            "success"
          );
          vehicleConfigs.set(r.id, r);
          reloadConfig(r);
          vehicleConfigEdit(player, r);
        });
      },
    });
  }

  m.newItem({
    name: langStringDefault("admin.837f995ec9ace0cd4655a839513e58ec"),
    more: langStringDefault(
      "admin.2c6ef9865c19c03bec56aca1d418f460",
      item.maxSpeed
    ),
    desc: langStringDefault("admin.69ca76d8ae1b962694dc0b5e35de864b"),
    onpress: () => {
      menu
        .input(
          player,
          player.user.LangString("admin.6dbe42296e2909623239d7e2dcf2329a"),
          item.maxSpeed.toString(),
          2000,
          "int"
        )
        .then((val) => {
          if (!val && val !== 0) return vehicleConfigEdit(player, item);
          item.maxSpeed = val;
          item.save().then((r) => {
            player.notify(
              player.user.LangString("admin.60668608ce221d414ccffcdab7a54479"),
              "success"
            );
            vehicleConfigs.set(r.id, r);
            reloadConfig(r);
            vehicleConfigEdit(player, r);
          });
        })
        .catch((err) => console.error(err));
    },
  });

  m.open();
};

CustomEvent.registerClient("flyMode", (player: PlayerMp, status: boolean) => {
  if (!player.user) return;
  if (!player.user.isAdminNow())
    return player.notify(
      player.user.LangString("admin.1bd22ac3ab699800edd60c5890f3ab55"),
      "error"
    );
  player.alpha = status ? 0 : 255;
});

CustomEvent.registerClient("admin:promocode", async (player) => {
  await promomenu(player);
});

export const tempPromo = {
  list: new Map<string, { label: TextLabelMp; sum: number }>(),
  add: (code: string, sum: number, pos: Vector3Mp) => {
    tempPromo.list.set(code.toUpperCase(), {
      label: mp.labels.new(
        langStringDefault(
          "admin.83c27533c8b37a3707f328b7e5145e30",
          system.numberFormat(sum),
          code.toUpperCase()
        ),
        pos,
        {
          drawDistance: 10,
          los: true,
        }
      ),
      sum,
    });
  },
  get: (code: string) => {
    return tempPromo.list.get(code.toUpperCase());
  },
  delete: (code: string) => {
    const promo = tempPromo.get(code.toUpperCase());
    if (!promo) return;
    if (promo.label && mp.labels.exists(promo.label)) promo.label.destroy();
    tempPromo.list.delete(code.toUpperCase());
  },
};

const promomenu = async (player: PlayerMp) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:promocode"))
    return player.notify(
      player.user.LangString("admin.1129cb33985be68728118070c539970a"),
      "error"
    );
  const m = menu.new(
    player,
    player.user.LangString("admin.f9dd6b84eaef19addde30ce104505b53")
  );

  m.open();
};

// mp.events.addCommand("revive", (player: PlayerMp, fullText: string) => {
// 	if (!player.user?.isAdminNow?.(1)) return player.notify("Nu ai acces la aceasta comanda", "error");

// 	const args = fullText.trim().split(" ");
// 	const id = parseInt(args[0]);

// 	if (isNaN(id)) {
// 		player.notify("ID invalid", "error");
// 		return;
// 	}

// 	const target = mp.players.at(id);
// 	if (!target || !target.user) {
// 		player.notify("Jucatorul nu a fost gasit", "error");
// 		return;
// 	}

// 	target.user.adminRestore();
// 	player.notify(`L-ai readus la viata pe ${target.name}`, "success");
// 	player.user.log("AdminJob", "A folosit /revive pe jucatorul " + target.dbid, target.dbid);
// });
