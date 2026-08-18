import { langStringDefault } from "../../shared/lang";
import { GRAB_POS_LIST } from "../../shared/grab.zone";
import { colshapes } from "./checkpoints";
import { CustomEvent } from "./custom.event";
import { system } from "./system";
import { menu } from "./menu";
// import {getBaseItemNameById, inventoryShared} from "../../shared/inventory";
import {
  getBaseItemNameById,
  inventoryShared,
  DIRTY_MONEY_ITEM_ID,
} from "../../shared/inventory";

import { ScaleformTextMp } from "./scaleform.mp";
import { Dispatch } from "./dispatch";
import { Family } from "./families/family";
import { FamilyReputationType } from "../../shared/family";
import { User } from "./user";

let exploded = new Map<number, boolean>();
let currentMoney = new Map<number, number>();
let currentItem = new Map<number, number[]>();
GRAB_POS_LIST.map((item, id) => {
  setTimeout(() => {
    restore(id);
  }, 100);
  item.points.map((point, pointindex) => {
    colshapes.new(
      new mp.Vector3(point.x, point.y, point.z),
      () => {
        return (
          langStringDefault("grab.zone.328c437ac7e3dd2c12d0300d01f90903") +
          (pointindex + 1)
        );
      },
      (player) => {
        if (typeof player.grab_item === "number")
          return player.notify(
            player.user.LangString(
              "grab.zone.5eaf2dce431db541bbf16fc72e46d823"
            ),
            "error"
          );
        const user = player.user;
        const nwrk = notwork(id);
        if (nwrk) return player.notify(nwrk, "error");
        if (item.door && !exploded.has(id)) {
          player.notify(
            player.user.LangString(
              "grab.zone.a0031a49481e55a470a34cb396e48968"
            ),
            "error"
          );
          return;
        }
        if (currentGrab(id) >= item.points.length)
          return player.notify(
            player.user.LangString(
              "grab.zone.0f75d4e2b1fa8c812ccb193c287e68e7",
              item.points.length
            ),
            "error"
          );
        if (typeof item.fractions === "string") {
          if (item.fractions === "family") {
            if (!user.family || user.family.level < item.familyLevel)
              return player.notify(
                player.user.LangString(
                  "grab.zone.7bb7d3e89b040c6aeb630d70b632d695"
                ),
                "error"
              );
          } else if (item.fractions !== "all") {
            if (item.fractions === "mafia" && !user.fractionData?.mafia)
              return player.notify(
                player.user.LangString(
                  "grab.zone.242fa65b8a881cfda2154e6cde7edd13"
                ),
                "error"
              );
            if (item.fractions === "gang" && !user.fractionData?.gang)
              return player.notify(
                player.user.LangString(
                  "grab.zone.c59830a6e3598e17e7d2c880c8fa84e5"
                ),
                "error"
              );
          } else {
            if (!user.fractionData?.mafia && !user.fractionData?.gang)
              return player.notify(
                player.user.LangString(
                  "grab.zone.ff526562aa72002dca0a508694451316"
                ),
                "error"
              );
          }
        } else {
          if (!item.fractions.includes(user.fraction))
            return player.notify(
              player.user.LangString(
                "grab.zone.8524469869301d8eaf0f1901cd2f05d3"
              ),
              "error"
            );
        }
        const itm = user.haveItem(813);
        if (!itm)
          return player.notify(
            player.user.LangString(
              "grab.zone.7393e2c31552bddc9291e32ced4ccacf"
            ),
            "error"
          );
        player.grab_item = id;
        CustomEvent.callClient(
          player,
          "grab:start",
          item.anim,
          point.x,
          point.y,
          point.z + 1,
          point.h,
          item.minigame
        ).then((status: boolean) => {
          if (!mp.players.exists(player)) return;
          const user = player.user;
          player.grab_item = null;
          if (!status) return;
          const nwrk = notwork(id);
          if (nwrk) return player.notify(nwrk, "error");
          if (item.door && !exploded.has(id)) {
            player.notify(
              player.user.LangString(
                "grab.zone.3c9d709aa9f6bb6e1f355e51f21543a6"
              ),
              "error"
            );
            return;
          }
          const itm = user.haveItem(813);
          if (!itm)
            return player.notify(
              player.user.LangString(
                "grab.zone.92d914627033f2fcdba5f9cc9f96e99a"
              ),
              "error"
            );
          if (system.getRandomInt(1, 10) <= 2)
            itm.useCount(1, player),
              player.notify(
                player.user.LangString(
                  "grab.zone.e0aae7caa61b69dcc325c767ab7870b1"
                ),
                "error"
              );
          if (item.findChance && system.getRandomInt(0, 100) <= item.findChance)
            return player.notify(
              player.user.LangString(
                "grab.zone.779ea9239e78ea6d56b00e86ad7141c1"
              ),
              "error"
            );
          // if (item.type === "money"){
          //     if (item.type === "money" && currentMoney.get(id) <= 0) return player.notify(player.user.LangString("grab.zone.8fd8ee1cf0855bec3109798d2da302b6"), "error");
          //     let current = currentMoney.get(id);
          //     let give = typeof item.money === "number" ? item.money : system.getRandomInt(item.money[0], item.money[1]);
          //     if (current < give) give = current;
          //     currentMoney.set(id, currentMoney.get(id) - give);
          //     user.grab_money += give;
          //     player.notify(player.user.LangString("grab.zone.c49bfd165e32579a0948a5ca6a6847c3", system.numberFormat(give)), 'success');
          if (item.type === "money") {
            if (currentMoney.get(id) <= 0)
              return player.notify(
                player.user.LangString(
                  "grab.zone.8fd8ee1cf0855bec3109798d2da302b6"
                ),
                "error"
              );

            let current = currentMoney.get(id);
            let give =
              typeof item.money === "number"
                ? item.money
                : system.getRandomInt(item.money[0], item.money[1]);
            if (current < give) give = current;

            currentMoney.set(id, current - give);

            user.tryGiveItem(DIRTY_MONEY_ITEM_ID, true, true, give);

            player.notify(
              player.user.LangString(
                "grab.zone.c49bfd165e32579a0948a5ca6a6847c3",
                system.numberFormat(give)
              ),
              "success"
            );
          } else {
            const t = system.randomArrayElementIndex(item.giveItem);
            if (t == -1)
              return player.notify(
                player.user.LangString(
                  "grab.zone.5b0c77244c5126f4efdac8f98afb755a"
                ),
                "error"
              );
            if (!currentItem.get(id)[t])
              return player.notify(
                player.user.LangString(
                  "grab.zone.4ecaba5433b4ea5d273542163a6f38e8"
                ),
                "error"
              );
            const itemid = item.giveItem[t];
            user.giveGrabItem(itemid.item);
            const d = currentItem.get(id);
            d[t]--;
            currentItem.set(id, d);
          }
        });
      }
    );
    if (item.door) {
      /// Точка подрыва
      colshapes.new(
        new mp.Vector3(item.door.x, item.door.y, item.door.z),
        (player) =>
          player?.user?.LangString(
            "grab.zone.4d0a8eeca5b85b6dbb6730a75ce2f689"
          ) ?? langStringDefault("grab.zone.4d0a8eeca5b85b6dbb6730a75ce2f689"),
        (player) => {
          if (exploded.has(id))
            return player.notify(
              player.user.LangString(
                "grab.zone.da549a0c037613866db22d7af6ddbc62"
              )
            );
          const nwrk = notwork(id);
          if (nwrk) return player.notify(nwrk, "error");
          if (
            ScaleformTextMp.toArray().find(
              (text) =>
                text.grab_item === id &&
                system.distanceToPos(item.door, text.position) < 3
            )
          )
            return player.notify(
              player.user.LangString(
                "grab.zone.ea5508182556b627096ed205ca4718cc"
              ),
              "error"
            );
          const user = player.user;
          const bomb = user.c4item;
          if (!bomb)
            return player.notify(
              player.user.LangString(
                "grab.zone.3e9fd1473b697fa82e13365a08f37ff2",
                getBaseItemNameById(854)
              ),
              "error"
            );
          if (typeof item.fractions === "string") {
            if (item.fractions === "family") {
              if (!user.family || user.family.level < item.familyLevel)
                return player.notify(
                  player.user.LangString(
                    "grab.zone.c838abbe727a81aaffefa6e749354675"
                  ),
                  "error"
                );
            } else if (item.fractions !== "all") {
              if (item.fractions === "mafia" && !user.fractionData?.mafia)
                return player.notify(
                  player.user.LangString(
                    "grab.zone.567e336870f6845f85e5fef851fb22d9"
                  ),
                  "error"
                );
              if (item.fractions === "gang" && !user.fractionData?.gang)
                return player.notify(
                  player.user.LangString(
                    "grab.zone.04724022f151863d6b10c0589ee31b1b"
                  ),
                  "error"
                );
            }
          } else {
            if (!item.fractions.includes(user.fraction))
              return player.notify(
                player.user.LangString(
                  "grab.zone.8b3d126ff8d2e611d251ff9cb04350b4"
                ),
                "error"
              );
          }
          CustomEvent.callClient(
            player,
            "grab:explode",
            item.door.x,
            item.door.y,
            item.door.z,
            item.door.h + 180
          ).then((res: boolean) => {
            if (!res) return;
            if (!mp.players.exists(player)) return;
            if (exploded.has(id))
              return player.notify(
                player.user.LangString(
                  "grab.zone.9c4fd7c19889ca716d17ea9402526fdc"
                )
              );
            if (
              ScaleformTextMp.toArray().find(
                (text) =>
                  text.grab_item === id &&
                  system.distanceToPos(item.door, text.position) < 3
              )
            )
              return player.notify(
                player.user.LangString(
                  "grab.zone.aa9b9a6a7c5bc7cec36d1fe418d31fd1"
                ),
                "error"
              );
            const bomb = user.c4item;
            if (!bomb)
              return player.notify(
                player.user.LangString(
                  "grab.zone.dd5b0df8400aa1a6b5261b70d4625fb0",
                  getBaseItemNameById(854)
                ),
                "error"
              );
            bomb.useCount(1, player);
            let timer = item.door.timer;
            let text = new ScaleformTextMp(
              new mp.Vector3(item.door.x, item.door.y, item.door.z + 1),
              langStringDefault(
                "grab.zone.2dd0cd6bb0dda680ff0e24ada544cff7",
                timer
              )
            );
            if (item.door.alert && item.door.alertBefore) {
              item.door.alert.map((faction) => {
                Dispatch.new(
                  faction,
                  langStringDefault(
                    "grab.zone.0000685a98fe0ed4a0c41c1556ddc76d",
                    item.name
                  ),
                  { x: item.door.x, y: item.door.y }
                );
              });
            }
            text.grab_item = id;
            let object = mp.objects.new(
              inventoryShared.get(854).prop,
              new mp.Vector3(item.door.x, item.door.y, item.door.z),
              {
                rotation: new mp.Vector3(-90, 0, 0),
              }
            );
            let int = setInterval(() => {
              timer--;
              if (timer === 0) {
                if (ScaleformTextMp.exists(text)) text.destroy();
                if (mp.objects.exists(object)) object.destroy();
                exploded.set(id, true);
                CustomEvent.triggerClients("grab:door:add", id);
                if (item.door.alert && !item.door.alertBefore) {
                  item.door.alert.map((faction) => {
                    Dispatch.new(
                      faction,
                      langStringDefault(
                        "grab.zone.972051bfe4fdd1240889d19176fbda11",
                        item.name
                      ),
                      { x: item.door.x, y: item.door.y }
                    );
                  });
                }
                clearInterval(int);
              }
            }, 1000);
          });
        },
        {
          radius: item.door.r,
          color: [0, 0, 0, 0],
        }
      );
      /// Выход если дверь закрыта
      colshapes.new(
        new mp.Vector3(item.door.exit_x, item.door.exit_y, item.door.exit_z),
        "",
        (player) => {
          if (exploded.has(id)) return;
          if (player.user.isAdminNow())
            return player.notify(
              player.user.LangString(
                "grab.zone.f528dd73835b162b22544334bc68d8bf"
              ),
              "error"
            );
          player.user.teleport(
            item.door.x,
            item.door.y,
            item.door.z,
            item.door.h
          );
          player.notify(
            player.user.LangString(
              "grab.zone.0ec68431caee8bfe4203602a41e12212"
            ),
            "error"
          );
        },
        {
          onenter: true,
          radius: item.door.exit_r,
          color: [0, 0, 0, 0],
        }
      );
    }
  });
});

const currentGrab = (id: number) => {
  return mp.players
    .toArray()
    .filter((q) => q.user && q.grab_item === id && mp.players.exists(q)).length;
};

const restore = (id: number) => {
  const cfg = GRAB_POS_LIST[id];
  if (cfg.type === "money") {
    let money =
      typeof cfg.money_max !== "number"
        ? system.getRandomInt(
            (cfg.money_max as number[])[0],
            (cfg.money_max as number[])[1]
          )
        : (cfg.money_max as number);
    currentMoney.set(id, money);
  } else {
    currentItem.set(
      id,
      cfg.giveItem.map((q) => q.amount)
    );
  }

  if (exploded.has(id)) {
    CustomEvent.triggerClients("grab:door:remove", id);
  }
  exploded.delete(id);
  adminGrabEnable.delete(id);
};

export let adminGrabEnable = new Map<number, boolean>();

export const runAdminGrab = (id: number) => {
  restore(id);
  if (adminGrabEnable.has(id)) adminGrabEnable.delete(id);
  else {
    adminGrabEnable.set(id, true);
    const item = GRAB_POS_LIST[id];
    mp.players
      .toArray()
      .filter((player) => {
        const user = player.user;
        if (!user) return false;

        if (typeof item.fractions === "string") {
          if (item.fractions === "family") {
            if (!user.family || user.family.level < item.familyLevel)
              return false;
          }

          if (item.fractions !== "all") {
            if (item.fractions === "mafia" && !user.fractionData?.mafia)
              return false;
            if (
              item.fractions === "gang" &&
              (!user.fractionData || !user.fractionData.gang)
            )
              return false;
          }
        } else {
          if (!item.fractions.includes(user.fraction)) return false;
        }
        return true;
      })
      .map((player) => {
        player.notify(
          player.user.LangString(
            "grab.zone.f2ef7719dfbe6843310b998955b07044",
            item.name
          ),
          "success",
          null,
          10000
        );
      });
  }
};

CustomEvent.register("newHour", (hour: number) => {
  GRAB_POS_LIST.map((item, id) => {
    if (
      typeof item.restoreWorldTime === "object" &&
      item.restoreWorldTime.includes(hour)
    ) {
      restore(id);
    }
    if (item.worldTime.find((q) => q[0] == hour)) {
      mp.players
        .toArray()
        .filter((player) => {
          const user = player.user;
          if (!user) return false;

          if (typeof item.fractions === "string") {
            if (item.fractions === "family") {
              if (!user.family || user.family.level < item.familyLevel)
                return false;
            }

            if (item.fractions !== "all") {
              if (item.fractions === "mafia" && !user.fractionData?.mafia)
                return false;
              if (item.fractions === "gang" && !user.fractionData?.gang)
                return false;
            } else {
              if (!user.fractionData?.mafia && !user.fractionData?.gang)
                return false;
            }
          } else {
            if (!item.fractions.includes(user.fraction)) return false;
          }
          return true;
        })
        .map((player) => {
          player.notify(
            player.user.LangString(
              "grab.zone.36127e093e1b571f89c56fa9bae31570",
              item.name
            ),
            "success",
            null,
            10000
          );
        });
    }
  });
});

mp.events.add("_userLoggedIn", (user: User) => {
  const player = user.player;
  exploded.forEach((item, id) => {
    if (item) CustomEvent.triggerClient(player, "grab:door:add", id, true);
  });
});

const notwork = (id: number) => {
  const cfg = GRAB_POS_LIST[id];
  if (!cfg) return;
  if (cfg.adminRun) {
    if (!adminGrabEnable.has(id))
      return langStringDefault("grab.zone.ca21b6028fce314c0168e80eda235cb0");
    else return null;
  }
  // if (cfg.online) {
  //     if (mp.config.announce && mp.players.length < cfg.online) return langStringDefault("grab.zone.225d470e60efcab7a53a257ecf73156f", cfg.online)
  // }
  if (cfg.online) {
    const policeOnline = mp.players
      .toArray()
      .filter((p) => p.user && p.user.is_gos).length;

    if (mp.config.announce && policeOnline < cfg.online) {
      return langStringDefault(
        "grab.zone.225d470e60efcab7a53a257ecf73156f",
        cfg.online
      );
    }
  }

  // if (cfg.gameTime) {
  //     if (weather.hour < cfg.gameTime[0] || weather.hour > cfg.gameTime[1]) return `Система работает с ${cfg.gameTime[0]} часов до ${cfg.gameTime[1]} игрового времени включительно`;
  // }
  if (cfg.worldTime) {
    const tm = new Date();
    if (mp.config.announce) {
      let access = false;
      cfg.worldTime.map((q) => {
        if (!access && tm.getHours() >= q[0] && tm.getHours() <= q[1])
          access = true;
      });
      if (!access)
        return langStringDefault("grab.zone.55157e86f059626103d8b51abc36de4d");
    }
  }
  if (cfg.days) {
    const tm = new Date();
    if (!cfg.days.includes(tm.getDate()))
      return langStringDefault(
        "grab.zone.0b5808f1d329c4bd3ac13cb50bb2712f",
        cfg.days.join(", ")
      );
  }
  return null;
};

CustomEvent.registerClient("admin:gamedata:restoregrab", (player) => {
  const user = player.user;
  if (!user) return;
  if (!user.hasPermission("admin:gamedata:restoregrab"))
    return player.notify(
      player.user.LangString("grab.zone.ff0eaf3347c47af107bbe6e744a4295f"),
      "error"
    );

  const m = menu.new(
    player,
    player.user.LangString("grab.zone.28161f5796588ea1ff82d461ee9e9240"),
    player.user.LangString("grab.zone.87abe1af135150cc461bbd2bc674c9f3")
  );

  GRAB_POS_LIST.map((item, id) => {
    m.newItem({
      name: item.name,
      more: `${system.numberFormat(currentMoney.get(id))}`,
      desc: player.user.LangString(
        "grab.zone.3a9c05278c16cde89041d5e7add8ea8e",
        item.door
          ? exploded.has(id)
            ? player.user.LangString(
                "grab.zone.441c13e4f5192dbf7c0c7674e3ec2a2a"
              )
            : player.user.LangString(
                "grab.zone.542d70120ccbe0a30269069bd805acd4"
              )
          : player.user.LangString("grab.zone.b0a774b70c07da55377cee42a9701091")
      ),
      onpress: () => {
        menu
          .accept(
            player,
            player.user.LangString("grab.zone.e37d19db6972d0194ff71277eca80af6")
          )
          .then((status) => {
            if (!status) return;
            restore(id);
            player.notify(
              player.user.LangString(
                "grab.zone.3d7df0889804a37344d21167e0276bb3"
              ),
              "success"
            );
          });
      },
    });
  });

  m.open();
});
