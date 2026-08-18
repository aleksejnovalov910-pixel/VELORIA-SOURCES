import { langStringDefault } from "../../../shared/lang";
import {CustomEvent} from "../custom.event";
import {tempPromo} from "../admin";
import {AccountEntity} from "../typeorm/entities/account";
import {MEDIA_PROMOCODE} from "../../../shared/economy";
import {PromocodeList, PromocodeUseEntity} from "../typeorm/entities/promocodes";
import {system} from "../system";
import {PROMO_VIP_ID, VIP_PROMO_USE_DAYS, VIP_START_DAYS, VIP_TARIFS} from "../../../shared/vip";
import {User} from "../user";


CustomEvent.registerCef("promocode:use:media", async (player, code: string) => {
    promoUseMedia(player, code)
})
CustomEvent.registerCef("promocode:use", async (player, code: string) => {
    promoUseMedia(player, code);
})


let enterPromoBlock = new Map<number, boolean>();

export const promoUseMedia = async (player: PlayerMp, code: string) => {
    const user = player.user;
    if (!user) return;
    if (enterPromoBlock.has(user.id)) return player.notify(player.user.LangString("promocode.c35f32095487e685303427d2a23492ee"));
    enterPromoBlock.set(user.id, true);
    const uid = user.id;
    setTimeout(() => {
        enterPromoBlock.delete(uid)
    }, 5000);
    if(tempPromo.get(code.toUpperCase())){
        const promo = tempPromo.get(code.toUpperCase());
        if(!promo) return;
        user.addMoney(promo.sum, true, user.LangString("promocode.167f740d7ce5d8150a8724ffa899d7e1"))
        tempPromo.delete(code.toUpperCase())
        return;
    }
    const media = await AccountEntity.findOne({promocode_my: code.toLowerCase()});
    if (!media) return promoUse(player, code);
    if (user.level > MEDIA_PROMOCODE.LEVEL_MAX) return player.notify(player.user.LangString("promocode.4960b8da6236f04466419c3274bad1f5"), "error");
    if (MEDIA_PROMOCODE.BLOCK_MULTIPLE) {
        const cnt = await PromocodeUseEntity.count({accountId: user.account.id, media: 1});
        if (cnt) return player.notify(player.user.LangString("promocode.c40441796dde0301f468cf133e6e0a67"), "error");
    }
    if (user.account.promocode) return player.notify(player.user.LangString("promocode.03b417607f9ee26fcf4f3c9720df03ab"), "error");

    user.account.promocode = code.toLowerCase();
    user.account.save();
    const online = mp.players.toArray().find(q => q.user && q.user.account.id === media.id);
    if (online) {
        if (MEDIA_PROMOCODE.GIVE_DONATE_MEDIA) online.user.addDonateMoney(MEDIA_PROMOCODE.GIVE_DONATE_MEDIA, online.user.LangString("promocode.bd225fbb60bd179d9e456f1263a1d13a", player.user.name))
        if (MEDIA_PROMOCODE.NOTIFY) online.notify(online.user.LangString("promocode.5ded16407a4579b8a094ff4ed106f95d", player.user.name), "success");
    } else {
        if (MEDIA_PROMOCODE.GIVE_DONATE_MEDIA) {
            media.donate = media.donate + MEDIA_PROMOCODE.GIVE_DONATE_MEDIA
            media.save();
        }
    }
    if (MEDIA_PROMOCODE.GIVE_DONATE_PLAYER) user.addDonateMoney(MEDIA_PROMOCODE.GIVE_DONATE_PLAYER, user.LangString("promocode.972420a0cbe125c52fc7d036a359b45f", code))
    if (MEDIA_PROMOCODE.GIVE_MONEY_PLAYER) user.addMoney(MEDIA_PROMOCODE.GIVE_MONEY_PLAYER, true, user.LangString("promocode.015d572dcac20751cae8cfc546264fdc", code));

    if (!user.vip) {
        //const vip = system.randomArrayElement(VIP_TARIFS.filter(q => q.start))
        user.giveVip(PROMO_VIP_ID, VIP_PROMO_USE_DAYS);
        player.notify(player.user.LangString("promocode.9c6f79115dfdf305faef7832260b7bf6"), "success");
    }

    let q = new PromocodeUseEntity()
    q.code = code;
    q.media = 1;
    q.time = system.timestamp
    q.accountId = user.account.id;
    q.user = user.entity;
    q.save();
}
const promoUse = async (player: PlayerMp, code: string) => {
    const user = player.user;
    if (!user) return;

    const promo = await PromocodeList.findOne({code})

    if (!promo) return player.notify(player.user.LangString("promocode.ec6486892965f11dfb6526e1282f8cff"), "error");
    if (promo.time_end && (promo.time_end == 1 || system.timestamp > promo.time_end)) return player.notify(player.user.LangString("promocode.c70c1859c9d91feb48a7e2426933c8a4"))
    const cnt = await PromocodeUseEntity.count({user: {id: user.id}, code});
    if (cnt) return player.notify(player.user.LangString("promocode.064161416681d44b19340fb44831771d"), "error");

    user.addMoney(promo.money, true, user.LangString("promocode.371683692ca7644bd0fd9f345627c3a0", code));
    //user.giveVip(PROMO_VIP_ID, VIP_PROMO_USE_DAYS);
    let q = new PromocodeUseEntity()
    q.code = code;
    q.media = 0;
    q.time = system.timestamp
    q.accountId = user.account.id;
    q.user = user.entity;
    q.save();
}
