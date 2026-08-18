import { langStringDefault } from "../../shared/lang";
import { CustomEvent } from "./custom.event";
import { User } from "./user";
import { system } from "./system";
import { MAFIA_CLEAN_WANTED_CONFIG } from "../../shared/mafia.clean.wanted";
import { DIRTY_MONEY_ITEM_ID } from "../../shared/inventory";

CustomEvent.registerClient('mafia:wanted:data', (player, id: number) => {
    const user = player.user;
    if(!user) return false;
    const target = User.get(id);
    if (!target) return 'NOT_FND';
    if (system.distanceToPos(player.position, target.position) > 5) return 'NOT_NEAR';
    if (player.dimension != target.dimension) return 'NOT_NEAR';
    return target.user.wanted_level
})
CustomEvent.registerClient('mafia:wanted:clear', (player, id: number, itemid: number) => {
    const user = player.user;
    if (!user) return false;

    const cfg = MAFIA_CLEAN_WANTED_CONFIG[itemid];
    if (!cfg) return;

    if (!user.fractionData?.mafia) {
        return user.notify(user.LangString("mafia.clean.wanted.2862ff9c0569e60ae4dbc962ddb98e4c"), 'error');
    }

    const target = User.get(id);
    if (!target) {
        return user.notify(user.LangString("mafia.clean.wanted.2e00e823ac1486641324ebb6bfa57e99"), 'error');
    }

    if (system.distanceToPos(player.position, target.position) > 5) {
        return user.notify(user.LangString("mafia.clean.wanted.2a6bbb089d505724fec86b7bc88562fd"), 'error');
    }

    if (player.dimension != target.dimension) {
        return user.notify(user.LangString("mafia.clean.wanted.1742fa77167c18ece882d1d274a51914"), 'error');
    }

    if (target.user.wanted_level === 0) return;

    const sum = target.user.wanted_level * cfg.costPerStar;

    if (sum > 0) {
        const hasEnough = user.hasItemAmount(DIRTY_MONEY_ITEM_ID, sum);
        if (!hasEnough) {
            return player.notify(user.LangString("mafia.clean.wanted.8f628aa51e2f953865e08cec62973426"), 'error');
        }

        const removed = user.removeItemAmount(DIRTY_MONEY_ITEM_ID, sum);
        if (!removed) {
            return player.notify("Eroare la eliminarea banilor murdari.", "error");
        }

        // Notificare de tranzactie
        player.notify(user.LangString("mafia.clean.wanted.a8b9fd3fd48a632e049619be85693699", target.user.wanted_level, target.user.name, target.user.id), 'info');
    }

    target.user.clearWanted();

    player.notify(player.user.LangString("mafia.clean.wanted.0947e570f4b30851b776e5a76bca2226"), 'success');
    target.notify(target.user.LangString("mafia.clean.wanted.18dff4911126ee1070eafbbcc838b0d2"), 'success');
});

// CustomEvent.registerClient('mafia:wanted:clear', (player, id: number, itemid: number) => {
//     const user = player.user;
//     if(!user) return false;
//     const cfg = MAFIA_CLEAN_WANTED_CONFIG[itemid];
//     if (!cfg) return;
//     if (!user.fractionData?.mafia) return user.notify(user.LangString("mafia.clean.wanted.2862ff9c0569e60ae4dbc962ddb98e4c"), 'error');
//     const target = User.get(id);
//     if (!target) return user.notify(user.LangString("mafia.clean.wanted.2e00e823ac1486641324ebb6bfa57e99"), 'error');
//     if (system.distanceToPos(player.position, target.position) > 5) return user.notify(user.LangString("mafia.clean.wanted.2a6bbb089d505724fec86b7bc88562fd"), 'error');
//     if (player.dimension != target.dimension) return user.notify(user.LangString("mafia.clean.wanted.1742fa77167c18ece882d1d274a51914"), 'error');
//     if (target.user.wanted_level === 0) return;
//     const sum = target.user.wanted_level * cfg.costPerStar;
//     if(sum > 0){
//         if(user.money < sum) return player.notify(user.LangString("mafia.clean.wanted.8f628aa51e2f953865e08cec62973426"), 'error');
//         user.removeMoney(sum, true, user.LangString("mafia.clean.wanted.a8b9fd3fd48a632e049619be85693699", target.user.wanted_level, target.user.name, target.user.id))
//     }
//     target.user.clearWanted();
//     player.notify(player.user.LangString("mafia.clean.wanted.0947e570f4b30851b776e5a76bca2226"), 'success');
//     target.notify(target.user.LangString("mafia.clean.wanted.18dff4911126ee1070eafbbcc838b0d2"), 'success');

// })