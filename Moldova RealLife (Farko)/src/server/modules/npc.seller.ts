import { NPC_SELLERS_LIST } from "../../shared/npc.seller";
import { LicenseName } from "../../shared/licence";
import { menu } from "./menu";
import { getBaseItemNameById } from "../../shared/inventory";
import { system } from "./system";
import { CustomEvent } from "./custom.event";
import { MoneyChestClass } from "./money.chest";
import { inventory } from "./inventory";
import { NpcSpawn } from "./npc";
import { LEVEL_PERMISSIONS } from "../../shared/level.permissions";

const DIRTY_MONEY_ITEM_ID = 40157;

NPC_SELLERS_LIST.map(npc => {
    let current = npc.items.map(q => q.start);
    let currentC = npc.items.map(q =>
        typeof q.cost === "number"
            ? q.cost
            : system.getRandomIntStep(q.cost[0], q.cost[1], 10)
    );

    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if (!user) return;
        // ✅ Verificare ore necesare pentru acest magazin
        if (npc.name === "Job Pescar" && npc.minHours) {
            if (user.playtime < LEVEL_PERMISSIONS.PESCAR) {
                return player.notify(`Ai nevoie de ${LEVEL_PERMISSIONS.PESCAR} ore jucate pentru a fi pescar.`, 'error');
            }
        }
        // Verificari de acces
        if (npc.factions && !npc.factions.includes(user.fraction))
            return player.notify("Nu ai acces la acest vanzator", "error");
        if (npc.forFamily && !user.family)
            return player.notify("Trebuie sa fii membru al unei familii", "error");
        if (npc.license && !user.haveActiveLicense(npc.license))
            return player.notify(
                `Ai nevoie de licenta ${LicenseName[npc.license]} pentru a cumpara de aici.`,
                "error"
            );

        const m = menu.new(player, npc.name);

        npc.items.map((item, itemid) => {
            const cost = currentC[itemid];

            m.newItem({
                name: getBaseItemNameById(item.item),
                // Afisare in functie de tipul banilor
                more: item.dirtyMoney
                    ? `$${system.numberFormat(cost)} (Bani murdari)`
                    : `$${system.numberFormat(cost)}`,
                desc:
                    item.max && current[itemid] <= item.max
                        ? `Disponibil: ${current[itemid]} / ${item.max}`
                        : "",
                onpress: () => {
                    if (item.max && current[itemid] <= 0)
                        return player.notify("Stoc epuizat", "error");

                    const usesDirtyMoney = !!item.dirtyMoney;

                    if (usesDirtyMoney) {
                        // Bani murdari
                        const dirtyStacks = user.getArrayItem(DIRTY_MONEY_ITEM_ID);
                        const totalDirtyMoney = dirtyStacks.reduce(
                            (acc, i) => acc + i.count,
                            0
                        );

                        if (totalDirtyMoney < cost)
                            return player.notify("Nu ai destui bani murdari", "error");

                        if (!user.tryGiveItem(item.item, true, true)) return;

                        inventory.deleteItemsById(player, DIRTY_MONEY_ITEM_ID, cost);
                    } else {
                        // Bani curati (logica originala)
                        if (user.money < cost)
                            return player.notify("Nu ai destui bani", "error");

                        if (!user.tryGiveItem(item.item, true, true)) return;

                        user.removeMoney(
                            cost,
                            true,
                            `Cumparare ${getBaseItemNameById(item.item)}`
                        );
                    }

                    // Adaugare bani in seiful fractiunii
                    const sumToFraction = npc.partToFraction
                        ? (cost / 100) * npc.partToFraction
                        : 0;
                    if (sumToFraction && user.fraction) {
                        const safe = MoneyChestClass.getByFraction(user.fraction);
                        if (safe) safe.money += sumToFraction;
                    }

                    if (item.max) current[itemid]--;

                    player.notify(
                        `Ai cumparat ${getBaseItemNameById(item.item)}`,
                        "success"
                    );
                },
            });
        });

        m.open();
    });

    // Actualizare stoc si preturi la fiecare ora
    CustomEvent.register("newHour", () => {
        npc.items.map((item, itemid) => {
            if (item.max)
                current[itemid] = Math.min(
                    current[itemid] + item.perhour,
                    item.max
                );
        });
        currentC = npc.items.map(q =>
            typeof q.cost === "number"
                ? q.cost
                : system.getRandomIntStep(q.cost[0], q.cost[1], 10)
        );
    });
});
