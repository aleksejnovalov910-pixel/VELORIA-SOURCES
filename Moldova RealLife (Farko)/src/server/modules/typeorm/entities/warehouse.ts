import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { UserEntity } from "./user";
import { colshapeHandle, colshapes } from "../../checkpoints";
import { menu } from "../../menu";
import { User } from "../../user";
import { system } from "../../system";
import { saveEntity } from "../index";
import {
  SELL_GOS_TAX_PERCENT,
  WAREHOUSE_MAX_TAX_DAYS_DEFAULT,
  WAREHOUSE_TAX_PERCENT,
  WAREHOUSE_TAX_PERCENT_DAY_MAX,
} from "@/shared/economy";
import { inventory } from "../../inventory";
import { OWNER_TYPES } from "@/shared/inventory";
import {
  WAREHOUSE_INTERIOR_HEADING,
  WAREHOUSE_INTERIOR_POS,
  WAREHOUSE_KEY_COST,
  WAREHOUSE_LOCK_CHANGE,
  WAREHOUSE_SLOTS_H_END,
  WAREHOUSE_SLOTS_H_START,
  WAREHOUSE_SLOTS_POS,
  WAREHOUSE_SLOTS_VARIANTS,
} from "@/shared/warehouse";
import { houses } from "../../houses";
import { Logs } from "../../logs";
import { getVipConfig } from "@/shared/vip";
import { CustomEvent } from "../../custom.event";

@Entity({ name: "warehouse_entity" })
export class WarehouseEntity extends BaseEntity {
  blip: BlipMp;

  static getByOwner(id: number) {
    return this.listArray.find((q) => q.userId === id);
  }
  static get(id: number) {
    return this.list.get(id);
  }

  static list = new Map<number, WarehouseEntity>();
  static get listArray() {
    return [...this.list].map((q) => q[1]);
  }

  @PrimaryGeneratedColumn()
  id: number;
  /** Координата X */
  @Column({ type: "float", default: 0 })
  x: number;
  /** Координата Y */
  @Column({ type: "float", default: 0 })
  y: number;
  /** Координата Z */
  @Column({ type: "float", default: 0 })
  z: number;
  /** Угол H */
  @Column({ type: "int", default: 0 })
  h: number;
  /** Измерение */
  @Column({ type: "int", default: 0 })
  d: number;
  /** Стоимость */
  @Column({ type: "int", default: 0 })
  price: number;
  /** Код ключа */
  @Column({ type: "int", default: 0 })
  key: number;
  /** Код ключа */
  @Column({ type: "int", default: 0 })
  tax: number;

  get taxDay() {
    return Math.min(
      (this.price / 100) * WAREHOUSE_TAX_PERCENT,
      WAREHOUSE_TAX_PERCENT_DAY_MAX
    );
  }

  get taxMax() {
    const maxDays =
      getVipConfig(this.user?.vip)?.taxPropertyMaxDays ??
      WAREHOUSE_MAX_TAX_DAYS_DEFAULT;
    return this.taxDay * maxDays;
  }

  /** Кому склад принадлежит */
  @ManyToOne((type) => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity;
  @RelationId((post: WarehouseEntity) => post.user) // you need to specify target relation
  userId: number;
  @Column({ type: "text" })
  private chestsData: string;
  colshape: colshapeHandle;

  get chests(): [number, string][] {
    return JSON.parse(this.chestsData || "[]");
  }
  set chests(val) {
    this.chestsData = JSON.stringify(val);
  }

  get position() {
    return new mp.Vector3(this.x, this.y, this.z);
  }
  set position(val) {
    this.x = val.x;
    this.y = val.y;
    this.z = val.z;
  }

  get onSell() {
    return !this.userId;
  }

  async setOwner(player: PlayerMp) {
    if (!this.userId) {
      this.chests = new Array(WAREHOUSE_SLOTS_POS.length).fill(null);
      this.tax = 0;
      this.key = system.randomNumber(6);
    }

    if (!player) {
      this.user = null;
      this.userId = null;
    } else {
      const playerOnline = User.get(this.user?.id);
      if (playerOnline)
        CustomEvent.triggerClient(player, "warehouseBlip:destroy");
      this.user = player.user.entity;
      this.userId = player.user.id;
      this.tax = this.taxDay * 2;
      CustomEvent.triggerClient(player, "warehouseBlip:create", this.position);
    }

    if (this.blip && mp.blips.exists(this.blip)) {
      this.blip.color = this.onSell ? 2 : 1;
      this.blip.dimension = this.onSell ? this.d : system.personalDimension;
    }
    WAREHOUSE_SLOTS_POS.map((_, index) => this.loadChest(index));
    await saveEntity(this);
  }

  canControl(player: PlayerMp) {
    const user = player.user;
    if (!user) return false;
    if (user.isAdminNow(6)) return true;
    return user.warehouse === this.id;
  }

  getChestParam(index: number) {
    return this.chests[index];
  }

  getChestConfig(index: number) {
    const cfg = this.getChestParam(index);
    if (!cfg) return null;
    return WAREHOUSE_SLOTS_VARIANTS[cfg[0]];
  }

  getSlotWeight(index: number) {
    return inventory.getWeightItems(inventory.getInventory(4 + index, this.id));
  }
  getSlotName(index: number) {
    const cfg = this.getChestParam(index);
    if (!cfg) return "Container gol";
    return cfg[1];
  }
  getSlotWeightMax(index: number) {
    const cfg = this.getChestParam(index);
    if (!cfg) return 0;
    if (!WAREHOUSE_SLOTS_VARIANTS[cfg[0]]) return 0;
    return WAREHOUSE_SLOTS_VARIANTS[cfg[0]].weight * 1000;
  }

  getAllSlotWeight() {
    let sum = 0;
    this.chests.map((item, index) => {
      if (item) sum += this.getSlotWeight(index);
    });
    return sum;
  }
  getAllSlotWeightMax() {
    let sum = 0;
    this.chests.map((item, index) => {
      if (item) sum += this.getSlotWeightMax(index);
    });
    return sum;
  }

  control(player: PlayerMp) {
    const user = player.user;
    if (!user) return;
    if (!this.canControl(player))
      return player.notify("Nu ai acces la gestionarea depozitului", "error");
    const m = menu.new(player, "Gestionare depozit");

    m.newItem({
      name: "Incarcare",
      more: `${(this.getAllSlotWeight() / 1000).toFixed(1)}/${(
        this.getAllSlotWeightMax() / 1000
      ).toFixed(1)} kg`,
    });
    m.newItem({
      name: "Inregistrari",
      more: ``,
      onpress: () => {
        Logs.open(player, `warehouse_${this.id}`, "Inregistrari");
      },
    });
    m.newItem({
      name: "Gestionare containere",
      onpress: () => {
        this.containersMenu(player);
      },
    });

    m.open();
  }
  containersMenu(player: PlayerMp) {
    const user = player.user;
    if (!user) return;
    if (!this.canControl(player))
      return player.notify("Nu ai acces la gestionarea depozitului", "error");

    const submenu = menu.new(player, "Gestionare containere");
    submenu.onclose = () => {
      this.control(player);
    };

    WAREHOUSE_SLOTS_POS.map((item, index) => {
      const cfg = this.getChestParam(index);
      submenu.newItem({
        name: cfg ? cfg[1] : `Loc liber`,
        more: cfg
          ? `${(this.getSlotWeight(index) / 1000).toFixed(1)}/${(
              this.getSlotWeightMax(index) / 1000
            ).toFixed(1)} kg`
          : `~g~Cumpara`,
        onpress: () => {
          if (!cfg && index && !this.getChestParam(index - 1))
            return player.notify(
              "Inainte de a ocupa acest loc, trebuie sa cumperi containerul din locul anterior",
              "error"
            );
          this.containerMenu(player, index);
        },
      });
    });

    submenu.open();
  }

  containerMenu(player: PlayerMp, index: number) {
    const user = player.user;
    if (!user) return;
    if (!this.canControl(player))
      return player.notify("Nu ai acces la gestionarea depozitului", "error");

    const m = menu.new(player, "Gestionare container #" + (index + 1));
    m.onclose = () => {
      this.containersMenu(player);
    };

    const cfg = this.getChestParam(index);

    if (cfg) {
      m.newItem({
        name: "Nume",
        more: `${cfg[1]}`,
        onpress: () => {
          menu.input(player, "Introdu un nume", cfg[1], 10).then((name) => {
            if (!name || name == cfg[1]) return;
            const old = [...this.chests];
            old[index][1] = system.filterInput(name);
            this.chests = [...old];
            this.loadChest(index);
            saveEntity(this);
            player.notify(`Container redenumit cu succes`, "success");
            this.containerMenu(player, index);
          });
        },
      });
      m.newItem({
        name: "Incarcare",
        more: `${(this.getSlotWeight(index) / 1000).toFixed(1)}/${(
          this.getSlotWeightMax(index) / 1000
        ).toFixed(1)} kg`,
      });
      const st = this.getChestConfig(index);
      if (st) {
        m.newItem({
          name: "Tip container",
          more: `${st.name}`,
        });
      }
    }

    m.newItem({
      name: cfg ? "~g~Alege un nou container" : "~b~Imbunatatire container",
    });

    WAREHOUSE_SLOTS_VARIANTS.map((item, i) => {
      m.newItem({
        name: item.name,
        more:
          !cfg || cfg[0] < i
            ? `${system.numberFormat(item.cost)} (${item.weight} kg)`
            : cfg[0] === i
            ? `~r~Deja instalat`
            : `~r~Ai instalat unul mai bun`,
        onpress: () => {
          if (cfg && cfg[0] >= i)
            return player.notify(
              "Deja ai instalat acest container sau unul mai bun",
              "error"
            );
          user
            .tryPayment(
              item.cost,
              "card",
              () => {
                return !cfg || cfg[0] < i;
              },
              `Cumparare container ${item.name} pentru depozit ${this.id}`,
              "Intretinere depozit"
            )
            .then((status) => {
              if (!status) return;
              const old = [...this.chests];
              old[index] = [i, item.name];
              this.chests = [...old];
              this.loadChest(index);
              player.notify(
                `Container ${cfg ? "achizitionat" : "imbunatatit"} cu succes`,
                "success"
              );
              saveEntity(this);
              this.containerMenu(player, index);
            });
        },
      });
    });

    m.open();
  }

  get sellGosSum() {
    return this.price - (this.price / 100) * SELL_GOS_TAX_PERCENT - this.tax;
  }

  sellToGos() {
    const taxRemove = this.tax >= this.taxMax;
    const reason = `${
      taxRemove ? "Confiscare depozit" : "Vanzare depozit catre stat"
    } ${this.id} ${taxRemove ? "din cauza neplatii taxelor" : ""}`;
    const returnSum = this.sellGosSum;

    for (let id = OWNER_TYPES.STOCK_1; id <= OWNER_TYPES.STOCK_15; id++)
      inventory.clearInventory(id, this.id);

    const player = User.get(this.userId);
    if (player) {
      const user = player.user;
      user.addBankMoney(returnSum, true, reason, "Serviciul Fiscal", true);
      if (taxRemove)
        player.notify(
          "Depozitul tau a fost confiscat de catre stat deoarece nu ai platit taxele la timp",
          "success"
        );
    } else {
      User.getData(this.userId).then((data) => {
        if (!data) return;
        if (data.bank_number) {
          data.bank_money += returnSum;
          User.writeBankNotify(
            data.id,
            "add",
            returnSum,
            reason,
            "Serviciul Fiscal"
          );
        } else {
          data.money += returnSum;
        }
        saveEntity(data);
      });
    }

    this.setOwner(null);
  }
  canEnter(player: PlayerMp) {
    const user = player.user;
    if (!user) return false;
    if (user.isAdminNow(6)) return true;
    return !!user.allMyItems.find(
      (itm) =>
        itm.item_id == houses.key_id &&
        itm.advancedNumber == this.key &&
        itm.advancedString == "warehouse"
    );
  }

  labels = new Map<number, TextLabelMp>();
  objects = new Map<number, ObjectMp>();
  loadChest(index: number) {
    const cfg = this.getChestParam(index);
    if (this.labels.get(index) && mp.labels.exists(this.labels.get(index)))
      this.labels.get(index).destroy();
    if (this.objects.get(index) && mp.objects.exists(this.objects.get(index)))
      this.objects.get(index).destroy();
    this.labels.delete(index);
    this.objects.delete(index);
    if (cfg) {
      const cr = WAREHOUSE_SLOTS_POS[index];
      if (!cr) return;
      const param = this.getChestConfig(index);

      if (param) {
        const pos = new mp.Vector3(cr[0], cr[1], cr[2] + param.z);
        const posLabel = new mp.Vector3(cr[3], cr[4], cr[2] + 0.3);
        this.labels.set(
          index,
          mp.labels.new(cfg[1], posLabel, {
            dimension: this.id,
            drawDistance: 6,
            font: 7,
          })
        );
        this.objects.set(
          index,
          mp.objects.new(param.model, pos, {
            dimension: this.id,
            rotation: new mp.Vector3(
              0,
              0,
              system.getRandomInt(
                WAREHOUSE_SLOTS_H_START,
                WAREHOUSE_SLOTS_H_END
              )
            ),
          })
        );
      }
    }
  }

  draw() {
    if (!WarehouseEntity.get(this.id)) WarehouseEntity.list.set(this.id, this);
    if (this.colshape && this.colshape.exists) this.colshape.destroy();
    if (!this.blip || !mp.blips.exists(this.blip)) {
      this.blip = system.createBlip(
        50,
        this.onSell ? 2 : 1,
        this.position,
        `Depozit`,
        this.d
      );
      this.blip.scale = system.blipBaseScale / 2;
      this.blip.dimension = this.onSell ? this.d : system.personalDimension;
    }
    WAREHOUSE_SLOTS_POS.map((_, index) => this.loadChest(index));
    this.colshape = colshapes.new(
      this.position,
      `Depozit ${this.id}`,
      async (player) => {
        const user = player.user;
        if (!user) return;
        const m = menu.new(player, `Depozit ${this.id}`);

        const ownerData = this.userId ? await User.getData(this.userId) : null;

        m.newItem({
          name: `Proprietar`,
          more: this.userId
            ? ownerData
              ? `${ownerData.rp_name}`
              : `~r~Necunoscut`
            : `~r~Se vinde`,
        });

        if (this.onSell) {
          m.newItem({
            name: `Pret`,
            more: system.numberFormat(this.price),
          });

          m.newItem({
            name: `~g~Cumpara`,
            onpress: () => {
              if (user.warehouseEntity)
                return player.notify("Detii deja un depozit", "error");
              user
                .tryPayment(
                  this.price,
                  "card",
                  () => this.onSell && !user.warehouseEntity,
                  `Achizitionare depozit ${this.id}`,
                  "Agentie imobiliara"
                )
                .then((status) => {
                  if (!status) return;
                  this.setOwner(player);
                  player.notify("Ai cumparat cu succes depozitul");
                });
            },
          });

          if (user.isAdminNow(6)) {
            m.newItem({
              name: `~r~Sterge depozitul`,
              onpress: () => {
                menu.accept(player).then((status) => {
                  if (!status) return;
                  m.close();
                  this.labels.forEach((item) => {
                    if (item && mp.labels.exists(item)) item.destroy();
                  });
                  this.objects.forEach((item) => {
                    if (item && mp.objects.exists(item)) item.destroy();
                  });
                  if (this.colshape && this.colshape.exists)
                    this.colshape.destroy();
                  if (this.blip && mp.blips.exists(this.blip))
                    this.blip.destroy();
                  WarehouseEntity.list.delete(this.id);
                  this.remove();
                  player.notify("Depozit sters cu succes");
                });
              },
            });
          }
        } else {
          m.newItem({
            name: "Intra in depozit",
            desc: "Pentru a intra in depozit trebuie sa detii cheia acestuia",
            onpress: () => {
              if (!this.canEnter(player))
                return player.notify("Nu ai acces la depozit", "error");
              user.teleport(
                WAREHOUSE_INTERIOR_POS.x,
                WAREHOUSE_INTERIOR_POS.y,
                WAREHOUSE_INTERIOR_POS.z,
                WAREHOUSE_INTERIOR_HEADING,
                this.id
              );
            },
          });

          if (this.canControl(player)) {
            m.newItem({
              name: "Creeaza duplicat chei",
              more: `$${system.numberFormat(WAREHOUSE_KEY_COST)}`,
              onpress: async () => {
                m.close();
                let haveAccess = false;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!haveAccess) {
                  haveAccess = await player.user.tryPayment(
                    WAREHOUSE_KEY_COST,
                    "card",
                    () => this.canControl(player),
                    `Plata pentru emitere duplicat chei pentru depozit #${this.id}`,
                    "Intretinere depozit"
                  );
                }
                if (!haveAccess) return;
                inventory.createItem({
                  owner_type: OWNER_TYPES.PLAYER,
                  owner_id: player.user.id,
                  item_id: 805,
                  advancedNumber: this.key,
                  advancedString: "warehouse",
                  serial: `Depozit #${this.id}`,
                });
                player.notify("Ai primit un duplicat de chei", "success");
              },
            });

            m.newItem({
              name: "Schimba incuietoarea",
              desc: "La schimbarea incuietorii, toate cheile existente nu vor mai functiona",
              more: `$${system.numberFormat(WAREHOUSE_LOCK_CHANGE)}`,
              onpress: async () => {
                m.close();
                let haveAccess = false;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!haveAccess) {
                  haveAccess = await player.user.tryPayment(
                    WAREHOUSE_KEY_COST,
                    "card",
                    () => this.canControl(player),
                    `Plata pentru schimbare incuietoare depozit #${this.id}`,
                    "Intretinere depozit"
                  );
                }
                if (!haveAccess) return;
                this.key = system.randomNumber(5);
                inventory.createItem({
                  owner_type: OWNER_TYPES.PLAYER,
                  owner_id: player.user.id,
                  item_id: 805,
                  advancedNumber: this.key,
                  advancedString: "warehouse",
                  serial: `Depozit #${this.id}`,
                });
                player.notify(
                  "Ai schimbat incuietoarea si ai primit un nou set de chei",
                  "success"
                );
              },
            });

            if (this.userId === user.id) {
              m.newItem({
                name: "~r~Vinde catre stat",
                more: `$${system.numberFormat(this.sellGosSum)}`,
                desc: "Toate obiectele din depozit vor fi sterse",
                onpress: () => {
                  menu.accept(player).then((status) => {
                    if (!status) return;
                    if (this.userId !== user.id) return;
                    if (!user.bank_have)
                      return player.notify(
                        "Trebuie sa ai un cont bancar",
                        "error"
                      );
                    this.sellToGos();
                    player.notify(
                      "Depozitul a fost vandut statului cu succes",
                      "success"
                    );
                  });
                },
              });

              const nearestPlayer = user.getNearestPlayer(2);
              if (nearestPlayer) {
                m.newItem({
                  name: "~r~Vinde jucatorului apropiat",
                  more: `${nearestPlayer.user.name} (${nearestPlayer.dbid})`,
                  onpress: () => {
                    menu.accept(player).then((status) => {
                      if (!status) return;
                      if (this.userId !== user.id) return;

                      menu
                        .input(player, "Introdu suma de vanzare", "", 8, "int")
                        .then((sum) => {
                          if (!sum || sum <= 0 || sum > 999999999) return;
                          if (
                            !nearestPlayer ||
                            !mp.players.exists(nearestPlayer) ||
                            system.distanceToPos(
                              player.position,
                              nearestPlayer.position
                            ) > 5
                          )
                            return player.notify(
                              "Jucatorul s-a indepartat prea mult",
                              "error"
                            );

                          menu
                            .accept(
                              nearestPlayer,
                              `Vrei sa cumperi depozitul pentru $${system.numberFormat(
                                sum
                              )}?`
                            )
                            .then((status) => {
                              if (!status) return;
                              if (
                                !player ||
                                !mp.players.exists(player) ||
                                system.distanceToPos(
                                  player.position,
                                  this.position
                                ) > 5
                              )
                                return;

                              if (
                                !nearestPlayer ||
                                !mp.players.exists(nearestPlayer) ||
                                system.distanceToPos(
                                  this.position,
                                  nearestPlayer.position
                                ) > 5
                              )
                                return;

                              if (this.userId !== user.id) return;
                              if (!nearestPlayer.user.bank_have)
                                return nearestPlayer.notify(
                                  "Trebuie sa ai cont bancar",
                                  "error"
                                );
                              if (!user.bank_have)
                                return player.notify(
                                  "Trebuie sa ai cont bancar",
                                  "error"
                                );
                              if (nearestPlayer.user.bank_money < sum)
                                return nearestPlayer.notify(
                                  "Nu ai suficienti bani in contul bancar pentru achizitie",
                                  "error"
                                );
                              if (nearestPlayer.user.warehouseEntity)
                                return nearestPlayer.notify(
                                  "Detii deja un depozit",
                                  "error"
                                );

                              nearestPlayer.user.removeBankMoney(
                                sum,
                                true,
                                `Achizitie depozit ${this.id} de la ${user.name} (${user.id})`,
                                "Serviciul Fiscal"
                              );

                              user.addBankMoney(
                                sum,
                                true,
                                `Vanzare depozit ${this.id} catre ${nearestPlayer.user.name} (${nearestPlayer.user.id})`,
                                "Serviciul Fiscal"
                              );

                              this.setOwner(nearestPlayer);
                            });
                        });
                    });
                  },
                });
              }
            }
          }
        }
        if (this.userId === user.id) {
          m.newItem({
            name: "Taxe platite",
            more: `$${system.numberFormat(this.tax)}`,
          });
        }

        m.open();
      },
      {
        radius: 1.5,
        dimension: this.d,
        drawStaticName: "scaleform",
      }
    );
  }
}
