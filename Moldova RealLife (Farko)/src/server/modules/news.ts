import { langStringDefault } from "../../shared/lang";
import {CustomEvent} from "./custom.event";
import {getCategoryName, NEWS_CATEGORY, NEWS_POST_COST} from "../../shared/news";
import {system} from "./system";
import {User} from "./user";
import {inventory} from "./inventory";
import {OWNER_TYPES} from "../../shared/inventory";
import {gui} from "./gui";
import {MoneyChestClass} from "./money.chest";
import {SEND_AD_PLAYER_EVENT} from "./advancedQuests/impl/MultiStepQuest/sendAdQuestStep";

let orderListId = 1
export let orderList = new Map<number, {
    id: number,
    ids: number,
    name: string,
    time: number,
    cat: string,
    text: string,
    number: number,
    res?: string,
}>();

let news: {
    id: number,
    name: string,
    time: number,
    cat: string,
    text: string,
    number: number,
}[] = [];

gui.chat.registerCommand("allnews", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    console.log(news)
})

gui.chat.registerCommand("allnewsorders", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    console.log([...orderList].map(q => q[1]))
})

gui.chat.registerCommand("clearnews", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    news = [];
})

gui.chat.registerCommand("clearnewsorders", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    orderList = new Map();
})

export const getOrderListArray = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return [];
    const accessFull = user.isAdminNow(3) || user.fraction === 5
    let data = [...orderList].map(q => q[1])
    if(!accessFull) data = data.filter(q => q.id === user.id);
    return data
}

CustomEvent.registerCef('news:new', (player, cat: string, text: string, number: number) => {
    const user = player.user;
    if(!user) return;
    if (!NEWS_CATEGORY.find(q => q[0] === cat)) return user.LangString("news.e68f4f55b1fe3a1f7fa581d9d6cbd3da");
    const free = cat === "news"
    if (cat === "news" && (!user.fraction || !user.fractionData.gos)) return user.LangString("news.4350b46620c0f634c139034e71d6f275")
    if (!text || text.length < 5) return user.LangString("news.fb280e529237f4da54a7285238333968");
    if (text.length > 100) return user.LangString("news.b09ca75ac126f8268058a5d1c4788a4c");
    if (!user.bank_have) return user.LangString("news.6e62d12495775e437c9dd893a6364671");
    if (!free){
        if (!inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).find(item => item.item_id === 850 && item.advancedNumber === number)) return user.LangString("news.39de62738702eb601f09812a9abdbd7d");
        if (user.bank_money < NEWS_POST_COST){
            user.bankLog("reject", NEWS_POST_COST, user.LangString("news.2105a129956fc7c4e7464ef30d3973f6"), 'LifeInvader')
            return user.LangString("news.b41d4c66dafdb3a95fd61a82856a832d")
        }
        user.removeBankMoney(NEWS_POST_COST, false, user.LangString("news.74a9fe8d7830a15aa3df4940bd4343fc"), 'LifeInvader');
    }
    orderListId++;
    if ([...orderList].length > 20){
        const q = [...orderList].find(q => q[1].res);
        if(q){
            orderList.delete(q[0]);
        }
    }
    orderList.set(orderListId, { ids: orderListId, id: user.id, name: user.name, cat, text: system.filterInput(text), number, time: system.timestamp});
    if (free) pushNews(orderList.get(orderListId));
    else {
        mp.players.toArray().filter(q => q && q.user && q.user.fraction === 5 && q.user.exists).map(target => target.outputChatBox(target.user.LangString("news.7bfc2743201230d332d4877c2d99b387")))
    }
    return ""
})

CustomEvent.registerCef('news:setOrder', (player, id: number, status: boolean, reason?: string) => {
    const user = player.user;
    if (!user) return;
    if (user.fraction !== 5) return;
    let item = orderList.get(id);
    if(!item) return;
    if(!item.res){
        if(item.id === user.id && !user.isAdminNow()) return player.notify(player.user.LangString("news.36099a112937696fee30f8bedb30d332"), "error");
        if(status){
            pushNews(item, user);
        } else {
            item.res = langStringDefault("news.c068dfeb102001ad46c73b721b67f155", user.name, user.id, system.filterInput(reason))
            let target = User.get(item.id);
            if(target){
                target.user.addBankMoney(NEWS_POST_COST * 0.9, true, target.user.LangString("news.d6d94f41158f29bf322f0d8e62d12616"), 'LifeInvader')
            }
        }
        system.saveLog('news', langStringDefault("news.292b463163afa018b8df45d8ccc789b5", id, item.name, item.id, getCategoryName(item.cat), item.text, item.res), user.entity)
        User.filterByFraction(5).map(target => {
            CustomEvent.triggerCef(target, 'news:setOrderStatus', id, item.res)
        })

        const forPlayer = NEWS_POST_COST * 0.8
        user.addMoney(forPlayer, true, user.LangString("news.f78ac5380e9564b0c89009bcb8f2e45b"))
        const chest = MoneyChestClass.getByPlayer(player);
        if(chest) chest.addMoney(player, NEWS_POST_COST - forPlayer, false)
    }
})

CustomEvent.registerCef('news:editOrder', (player, id: number, status: boolean, newText?: string) => {
    const user = player.user;
    if (!user) return;
    if (user.fraction !== 5) return;
    let item = orderList.get(id);
    if(!item) return;
    if (!newText || newText.length < 5) return player.user.LangString("news.78d2c4f23449602cfda7609865c5f794");
    if (newText.length > 100) return player.user.LangString("news.1f5593281f82e5ce17ced728877e3163");
    if(!item.res){
        if(item.id === user.id && !user.isAdminNow()) return player.notify(player.user.LangString("news.f2c8907b81c6988ad76c6ddba0f5d252"), "error");

        item.res = langStringDefault("news.b0afcff7540ac3196fc2c88178ee4a18", user.name, user.id, system.filterInput(item.text))

        item.text = system.filterInput(newText)
        pushNews(item, user);
        system.saveLog('news', langStringDefault("news.462de18cef89fac237a7861c2b428f72", id, item.name, item.id, getCategoryName(item.cat), item.text, item.res), user.entity)
        User.filterByFraction(5).map(target => {
            CustomEvent.triggerCef(target, 'news:setOrderStatus', id, item.res, item.text)
        })

        const forPlayer = NEWS_POST_COST * 0.8
        user.addMoney(forPlayer, true, user.LangString("news.7f97fff354833d25c8ef07297347740d"))
        const chest = MoneyChestClass.getByPlayer(player);
        if(chest) chest.addMoney(player, NEWS_POST_COST - forPlayer, false)
    }
})


export const pushNews = (item: {
    id: number;
    ids: number;
    name: string;
    time: number;
    cat: string;
    text: string;
    number: number;
    res?: string;
}, user?: User) => {
    mp.events.call(SEND_AD_PLAYER_EVENT, item.id)
    let title = `${getCategoryName(item.cat)}`;
    let text = `${item.text}`;
    if(!item.res) {
        if(user){
            text += langStringDefault("news.b773d9a47eb29f77ec4cbdd05378bcc9", item.name, item.id)
            item.res = langStringDefault("news.ee4001a2d1bfaaab98a63ff594541561", user.name, user.id)
        } else {
            item.res = langStringDefault("news.80ad2944aa54f1e4e772ea35f4a0e353")
        }
    }
    news.push({
        id: item.id,
        name: item.name,
        time: item.time,
        cat: item.cat,
        text: item.text,
        number: item.number,
    });
    if (news.length > 30) news.splice(0, 1)
    CustomEvent.triggerCefAll('tablet:addnews', [{
        id: item.id,
        name: item.name,
        time: item.time,
        cat: item.cat,
        text: item.text,
        number: item.number,
    }])
    User.notifyWithPictureToAll(item.cat === 'news' ? langStringDefault("news.0d1a4dadc3b7a91785c654117a63f4c7") : langStringDefault("news.70511ef694c9642fc1726c870b09c077"), title, text, item.cat === 'news' ? 'WEAZEL' : 'WEAZEL');
}

mp.events.add('_userLoggedIn', (user: User) => {
    const player = user.player;
    CustomEvent.triggerCef(player, 'tablet:addnews', news);
})