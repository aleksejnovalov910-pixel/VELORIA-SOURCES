import { langStringDefault } from "../../../shared/lang";
import {CustomEvent} from "../custom.event";
import {openPromocodesAdminMenu} from "./adminMenu";
import {Promocode1xUse, Promocodes1x} from "../typeorm/entities/promocodes1x";
import {system} from "../system";
import {promocodeBonuses} from "./bonuses";
import {User} from "../user";
import {gui} from "../gui";

export interface BonusData {
    type: string,
    data: any
}

gui.chat.registerCommand("promocode", (player, promocode: string) => {
    promocodes1x.activate(player, promocode);
});

CustomEvent.registerClient("admin:onetimePromo", (player) => {
    if (!player.user.hasPermission("admin:1xPromocodes:manage")) {
        return;
    }

    openPromocodesAdminMenu(player);
});

const promocodeActivations: Map<number, Promocode1xUse[]> = new Map<number, Promocode1xUse[]>();

mp.events.add("_userLoggedIn", async (user: User) => {
    const userActivations = await Promocode1xUse.find({
        where: {
            userId: user.account.id
        }
    });

    promocodeActivations.set(user.account.id, userActivations);
});

mp.events.add("playerQuit", (player: PlayerMp) => {
    if (!player || !player.user) {
        return;
    }

    promocodeActivations.delete(player.user.account.id);
});

const promocodesPool: Promocodes1x[] = [];

/** Одноразовые промокоды */
export const promocodes1x = {
    load: async () => {
        const promocodes = await Promocodes1x.find();
        promocodesPool.push(...promocodes);
    },

    create: async (name: string, expirationTimeHours: number, bonuses: BonusData[]) => {
        name = name.toLowerCase();

        if (promocodesPool.some(promocode => promocode.name === name && promocode.expiredAt > system.timestamp)) {
            return langStringDefault("index.cbef5771bda0877d3d7d076fee71ed02");
        }

        const promocode = Promocodes1x.create({
            name: name,
            expiredAt: system.timestamp + expirationTimeHours * 60 * 60,
            bonuses: JSON.stringify(bonuses)
        });

        await promocode.save();
        promocodesPool.push(promocode);
    },

    delete: (promocodeId: number) => {
        const promocodeIdx = promocodesPool.findIndex(promocode => promocode.id === promocodeId);
        if (promocodeIdx === -1) {
            return;
        }

        const promocode = promocodesPool[promocodeIdx];
        Promocodes1x.delete(promocode.id);

        promocodesPool.splice(promocodeIdx, 1);
    },

    isActive: (promocodeName: string): boolean => {
        return promocodesPool.some(promocode => promocode.name === promocodeName && promocode.expiredAt > system.timestamp);
    },

    activate: (player: PlayerMp, promocodeName: string) => {
        promocodeName = promocodeName.toLowerCase();

        if (!promocodes1x.isActive(promocodeName)) {
            return player.notify(player.user.LangString("index.9b31196592760059b8ef3a1c8eebd14e"), "error");
        }

        if (!promocodeActivations.has(player.user.account.id)) {
            return player.notify(player.user.LangString("index.a1753becaf7a2a99522614befcc081ee"), "error");
        }

        const promocode = promocodesPool.find(promocode => promocode.name === promocodeName && promocode.expiredAt > system.timestamp);

        const activatedPromocodes = promocodeActivations.get(player.user.account.id);
        if (activatedPromocodes.some(promocodeActivation => promocodeActivation.promocodeId === promocode.id)) {
            return player.notify(player.user.LangString("index.c65b4546a89d47cc89664c0a465bedcc"), "error");
        }

        const bonusesData: BonusData[] = JSON.parse(promocode.bonuses);

        bonusesData.forEach(bonusData => {
            const bonus = promocodeBonuses.types.find(bonus => bonus.type === bonusData.type).bonus;
            if (!bonus) {
                return system.debug.error(langStringDefault("index.ded03bd875b4355fb3d27be709146fe0", promocodeName, bonusData.type));
            }

            bonus.activate(player, promocodeName, bonusData.data);
        });

        const promocodeActivation = Promocode1xUse.create({
            userId: player.user.account.id,
            promocodeId: promocode.id
        });

        activatedPromocodes.push(promocodeActivation);
        promocodeActivation.save();

        player.notify(player.user.LangString("index.227940e7dd3dfc860c41b03260a8eda2", promocodeName.toUpperCase()));
    },

    getAll: () => {
        return [...promocodesPool]
    }
}
