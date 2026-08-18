import { langStringDefault } from "../../../../shared/lang";
import {CustomEvent} from "../../custom.event";
import {colshapeHandle, colshapes} from "../../checkpoints";
import {CASINO_DIMENSION, WHEEL_INTERACTION_POSITION} from "../../../../shared/casino/wheel";
import {Wheel} from "./wheel";
import { RouletteManager } from "../../donate/roulette/rouletteManager";
import {gui} from "../../gui";
import {system} from "../../system";
import {drops} from "../../../../shared/donate/donate-roulette/main";
import { createDropByData } from "../../donate/roulette/dropFactory";
import { MoneyDropData } from "../../../../shared/donate/donate-roulette/Drops/moneyDrop";
import { CoinsDropData } from "../../../../shared/donate/donate-roulette/Drops/coinsDrop";
import { InventoryDropData } from "../../../../shared/donate/donate-roulette/Drops/inventoryDrop";
import { VehicleDropData } from "../../../../shared/donate/donate-roulette/Drops/vehicleDrop";
import { XpDropData } from "../../../../shared/donate/donate-roulette/Drops/xpDrop";
import { DressDropData } from "../../../../shared/donate/donate-roulette/Drops/dressDrop";
import { ArmorDropData } from "../../../../shared/donate/donate-roulette/Drops/armorDrop";
import { VipDropData } from "../../../../shared/donate/donate-roulette/Drops/vipDrop";


class LuckyWheel {
    wheel: Wheel
    interaction: colshapeHandle
    private locked: boolean = false
    private lastRoll: number | null;

    constructor() {
        this.wheel = new Wheel();

        this.interaction = colshapes.new(WHEEL_INTERACTION_POSITION, player => player?.user?.LangString("index.33e1d9cb4126e7a1b7666b70b44bfb96") ?? langStringDefault("index.33e1d9cb4126e7a1b7666b70b44bfb96"), (player: PlayerMp) => {
            if (this.locked) return player.notify(player.user.LangString("index.99842c6a03eb4c856feab5db6fda0676"), "warning");
            if (system.timestamp - player.user.account.lucky_wheel < 86400)
                return player.notify(player.user.LangString("index.b24e217b05e179418e5b55983047f0e5"), "warning");

            this.checkResetOccupator();

            if (this.wheel.occupator !== null) return player.notify(player.user.LangString("index.a8a5e18e4b6305986bb494f5e4a13851"), "error");
            this.wheel.occupator = player.user.id;
            CustomEvent.triggerClient(player, "casino:wheel:towheel");
            this.lastRoll = system.timestamp;
        }, {
            dimension: CASINO_DIMENSION,
            radius: 1.5,
            color: [0, 0, 0, 0]
        });

        gui.chat.registerCommand("luckywheel", (player) => {
            if (!player.user.isAdminNow(7)) return player.notify(player.user.LangString("index.5176e26b6f4a5efda2e071297a8cbb95"), "error");
            this.locked = !this.locked;
            player.notify(this.locked ? player.user.LangString("index.1b1c455a1eb149d01e3b768ce2eadb6c") : player.user.LangString("index.f17ffbf0fe6b59b34a9aff5c02bea7b3"), "info");
        });

        CustomEvent.registerClient("casino:wheel:readyForSpin", (player) => {
            if (this.wheel.occupator === null || this.wheel.occupator !== player.user.id)
                return player.notify(player.user.LangString("index.51a1adf014b9226143c207075ac67a87"));

            player.user.account.lucky_wheel = system.timestamp;
            const rand = this.getRandom();
            player.user.wheelPrize = rand;
            this.wheel.spin(player, rand);

            player.user.account.save();
        });

        CustomEvent.registerClient("casino:wheel:prize", (player, prize: number, rot: number) => {
            if (player.user.wheelPrize === null) return;
            player.user.wheelPrize = null;

            this.wheel.setFinishRot(rot);
            this.wheel.occupator = null;

            const item = drops.find(el => el.dropId === 20000 + prize)
            if (!item) return player.notify(`Item not found`, "error");

            const drop = createDropByData(item);
            if (!drop) return player.notify(`Drop not found`, "error");

            drop.activate(player);

            let itemName = "";

            if (item instanceof MoneyDropData) {
                itemName = item.name + `(${item.count}$)`;
            } else if (item instanceof CoinsDropData) {
                itemName = item.name + `(${item.count} DP)`;
            } else if (item instanceof InventoryDropData) {
                itemName = item.name;
            } else if (item instanceof VehicleDropData) {
                itemName = item.name;
            } else if (item instanceof XpDropData) {
                itemName = item.name + `(${item.count} EXP)`;
            } else if (item instanceof DressDropData) {
                itemName = item.name;
            } else if (item instanceof ArmorDropData) {
                itemName = item.name;
            } else if (item instanceof VipDropData) {
                itemName = item.name;
            } else {
                itemName = item.name;
            }

            player.notify(`You won prize - ${itemName}, it was sent to your account.`, 'success');
            
            // RouletteManager.addDrop(player, 20000 + prize);
            
            
            // player.notify(player.user.LangString("index.67b5bdc25163a7901abdaac18f956166", itemName ? itemName : ""));
        })

        mp.events.add("playerQuit", (player) => {
            if (player.user && player.user.id === this.wheel.occupator) this.wheel.occupator = null;
        });
    }

    checkResetOccupator() {
        if (system.timestamp  - this.lastRoll > 25) this.wheel.occupator = null;
    }

    getRandom(): number {
        const rand = Math.floor(Math.random() * 10000);

        if (rand < 6) {
            return 11;
        }
        else if (rand >= 6 && rand < 11) {
            return 1;
        }
        else if (rand >= 11 && rand < 31) {
            return 19;
        }
        else if (rand >= 31 && rand < 61) {
            return 12;
        }
        else if (rand >= 61 && rand < 101) {
            return 9;
        }
        else if (rand >= 101 && rand < 151) {
            return 2;
        }
        else if (rand >= 151 && rand < 201) {
            return 4;
        }
        else if (rand >= 201 && rand < 291) {
            return 14;
        }
        else if (rand >= 291 && rand < 591) {
            return 18;
        }
        else if (rand >= 591 && rand < 891) {
            return 8;
        }
        else if (rand >= 891 && rand < 1291) {
            return 10;
        }
        else if (rand >= 1291 && rand < 1791) {
            return 17;
        }
        else if (rand >= 1791 && rand < 2291) {
            return 16;
        }
        else if (rand >= 2291 && rand < 2791) {
            return 6;
        }
        else if (rand >= 2791 && rand < 3391) {
            return 15;
        }
        else if (rand >= 3391 && rand < 4391) {
            return 7;
        }
        else if (rand >= 4391 && rand < 5391) {
            return 5;
        }
        else if (rand >= 5391 && rand < 6491) {
            return 13;
        }
        else if (rand >= 6491 && rand < 7991) {
            return 0;
        }
        else if (rand >= 7991 && rand <= 10000) {
            return 3;
        }
    }
}

new LuckyWheel();
