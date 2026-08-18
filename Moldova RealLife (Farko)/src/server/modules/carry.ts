import { langStringDefault } from "../../shared/lang";
import {CARRY_LIST} from "../../shared/carry";
import {InterractionMenu} from "./interactions/InterractionMenu";
import {system} from "./system";
import {menu} from "./menu";
import {gui} from "./gui";

import {CustomEvent} from "./custom.event";
import {CARRY_PLAYER_EVENT} from "./advancedQuests/impl/MultiStepQuest/carryPlayerQuestStep";

interface CarryInfo {
    carryPlayer: PlayerMp,
    carriedPlayer: PlayerMp,
    carryCfgIdx: number
}

class CarrySystem {
    private _carryMap = new Map<number, CarryInfo>();

    carryTarget(player: PlayerMp, target: PlayerMp, carryCfgIdx: number) {
        if (this.isPlayerCarry(player) || this.isPlayerCarried(player)) {
            throw new Error(`Player already carry someone or have been carried by someone (dbid: ${player?.dbid})`);
        }

        if (this.isPlayerCarry(target) || this.isPlayerCarried(target)) {
            throw new Error(`Target player already carry someone or have been carried by someone (dbid: ${player?.dbid})`);
        }
        
        if (player.vehicle || target.vehicle) {
            return;
        }

        const carryInfo: CarryInfo = {
            carryPlayer: player,
            carriedPlayer: target,
            carryCfgIdx
        };

        this._carryMap.set(player.id, carryInfo);
        this._carryMap.set(target.id, carryInfo);

        mp.events.call(CARRY_PLAYER_EVENT, player);
        player.setVariable('carry:target', JSON.stringify({ targetId: target.id, carryCfgIdx: carryCfgIdx }));
    }

    resetCarry(player: PlayerMp) {
        const carryInfo = this._carryMap.get(player.id);
        if (!carryInfo) {
            return;
        }

        carryInfo.carryPlayer.setVariable('carry:target', undefined);

        this._carryMap.delete(carryInfo.carryPlayer.id);
        this._carryMap.delete(carryInfo.carriedPlayer.id);
    }

    isPlayerCarried(player: PlayerMp): boolean {
        const carryInfo = this._carryMap.get(player.id);
        return carryInfo && carryInfo.carriedPlayer === player;
    }

    isPlayerCarry(player: PlayerMp): boolean {
        const carryInfo = this._carryMap.get(player.id);
        return carryInfo && carryInfo.carryPlayer === player;
    }

    getCarriedTarget(player: PlayerMp): PlayerMp {
        return this._carryMap.get(player.id)?.carriedPlayer;
    }
    
    onPlayerQuit(player: PlayerMp): void {
        const carryInfo = this._carryMap.get(player.id);
        if (!carryInfo) {
            return;
        }

        this._carryMap.delete(carryInfo.carryPlayer.id);
        this._carryMap.delete(carryInfo.carriedPlayer.id);
    }
}

CustomEvent.register('player:teleport:start', (player: PlayerMp, x?:any, y?:any, z?:any, h?:any, d?:number) => {
    if (!Carry.isPlayerCarry(player)) {
        return;
    }

    const target = Carry.getCarriedTarget(player);
    if (!target || !mp.players.exists(target)) {
        Carry.resetCarry(player);
        return;
    }

    target.user.teleport(x, y, z, h, d);
});

mp.events.add('interaction:openPlayer', (
    player: PlayerMp,
    target: PlayerMp,
    interactionMenu: InterractionMenu
) => {
    if (target.user.dead) {
        return;
    }

    CARRY_LIST.forEach((cfg, idx) => {
        interactionMenu.add(cfg.name, langStringDefault("carry.063ff24db13431053255102dc3a611f7"), 'handcuffs', async () => {
            player.notify(player.user.LangString("carry.870a5269d6d43e5fd7d54b822faa8953", target.user.name, cfg.name));

            const isAccepted = await menu.accept(target, target.user.LangString("carry.6e2ec6b17b3bdbb8c429718c4ce42603", player.user.name, cfg.name), 'small');
            if (!isAccepted) {
                return player.notify(player.user.LangString("carry.4871d5df53ad49aefeaa6cb13231ee75", target?.user?.name), 'error');
            }

            if (system.distanceToPos(player.position, target.position) > 3) {
                player.notify(player.user.LangString("carry.c29bb7c6a2b1edfe4d8ee2177b21692e", target?.user?.name), 'error');
                target.notify(target.user.LangString("carry.104af36692ad4ad10b0970228da69a2d"), 'error');
                return;
            }

            Carry.carryTarget(player, target, idx);
        });
    });
});

CustomEvent.registerClient('carry:endCarry', (player) => {
    Carry.resetCarry(player);
});

mp.events.add('playerQuit', (player) => {
    if (!player.user) {
        return;
    }

    Carry.onPlayerQuit(player);
});

mp.events.add('playerDeath', (player) => {
    if (!player.user) {
        return;
    }

    Carry.resetCarry(player);
});

export const Carry = new CarrySystem();


// gui.chat.registerCommand("carry", async (player: PlayerMp) => {
//     if (!player?.user) return;

//     if (Carry.isPlayerCarry(player)) {
//         Carry.resetCarry(player);
//         player.notify("Ai incetat sa mai cari jucatorul.", "info");
//         return;
//     }

//     const nearest = [...mp.players.toArray()]
//         .filter(p => p !== player && p.user && p.dimension === player.dimension)
//         .sort((a, b) => system.distanceToPos(player.position, a.position) - system.distanceToPos(player.position, b.position))[0];

//     if (!nearest || system.distanceToPos(player.position, nearest.position) > 3)
//         return player.notify("Nu este niciun jucator aproape de tine.", "error");

//     if (nearest.user.dead)
//         return player.notify("Nu poti cara un jucator mort.", "error");

//     const accepted = await menu.accept(nearest, `${player.user.name} vrea sa te ia in brate.`, "small");

//     if (!accepted)
//         return player.notify(`${nearest.user.name} a refuzat sa fie carat.`, "error");

//     if (system.distanceToPos(player.position, nearest.position) > 3) {
//         player.notify("Jucatorul s-a indepartat prea mult.", "error");
//         nearest.notify("Jucatorul care te cara s-a indepartat.", "error");
//         return;
//     }

//     const carryCfgIdx = 0; // prima animatie (in brate)
//     Carry.carryTarget(player, nearest, carryCfgIdx);

//     player.notify(`L-ai luat pe ${nearest.user.name} in brate.`, "success");
//     nearest.notify(`${player.user.name} te-a luat in brate.`, "info");
// });

gui.chat.registerCommand("carry", async (player: PlayerMp) => {
    if (!player?.user) return;

    // dacă deja cară pe cineva → oprește carry-ul
    if (Carry.isPlayerCarry(player)) {
        Carry.resetCarry(player);
        player.notify("Ai incetat sa mai cari jucatorul.", "info");
        return;
    }

    // caută cel mai apropiat jucător
    const nearest = [...mp.players.toArray()]
        .filter(p => p !== player && p.user && p.dimension === player.dimension)
        .sort((a, b) => system.distanceToPos(player.position, a.position) - system.distanceToPos(player.position, b.position))[0];

    if (!nearest || system.distanceToPos(player.position, nearest.position) > 3)
        return player.notify("Nu este niciun jucator aproape de tine.", "error");

    if (nearest.user.dead)
        return player.notify("Nu poti cara un jucator mort.", "error");

    // ✅ Notificare către cel care propune carry-ul
    player.notify("Ai trimis o cerere de carry.", "info");

    // trimitem cererea și așteptăm acceptul
    const accepted = await menu.accept(
        nearest,
        "Un jucator vrea sa te ia in brate.",
        "small"
    );

    // dacă a refuzat
    if (!accepted)
        return player.notify("Cererea de carry a fost refuzata.", "error");

    // verificăm distanța din nou
    if (system.distanceToPos(player.position, nearest.position) > 3) {
        player.notify("Jucatorul s-a indepartat prea mult.", "error");
        nearest.notify("Jucatorul care te cara s-a indepartat.", "error");
        return;
    }

    // activăm carry-ul (prima animație - în brațe)
    const carryCfgIdx = 0;
    Carry.carryTarget(player, nearest, carryCfgIdx);

    // notificări finale
    player.notify("Ai luat un jucator in brate.", "success");
    nearest.notify("Ai fost luat in brate.", "info");
});
