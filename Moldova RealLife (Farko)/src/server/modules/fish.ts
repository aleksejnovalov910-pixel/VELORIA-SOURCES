import { langStringDefault } from "../../shared/lang";
import {
    FISH_CATCH_CHANCE,
    FISH_POS,
    FishAnimTime,
    FISHES, getBestAvailabelFishByLevel,
    getFisherLevelByExp,
    IFish,
    IRod,
    RODS
} from "../../shared/fish";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {FISHING_TASK_MANAGER_EVENT} from "./battlePass/tasks/fishingTaskManager";
import { writeSpecialLog } from './specialLogs'
import { ItemEntity } from "./typeorm/entities/inventory";


CustomEvent.registerClient('fish:catch:start', (player, id: number, throwLength: number) => {
    let conf = FISH_POS[id];
    if (!conf) return false;
    const user = player.user;
    if (!user) return false;
    user.tempData.fishing = true;

    setTimeout(() => {
        if (mp.players.exists(player)) return false;
    }, FishAnimTime)

    if (conf.needLicense && !user.haveActiveLicense('fishrod')){
        player.notify(player.user.LangString("fish.6f9aea88323ef6d62f17016811cdec3b"), "error")
        return false
    }
    if (!user.haveFishRod) {
        player.notify(player.user.LangString("fish.060d8fde67371772e081c333a114e5ea"), "error");
        return false
    }

    const randomFish = getRandomFish(player, throwLength)
    user.tempData.fishToCatch = randomFish.itemId
    
    return randomFish
})
CustomEvent.registerClient("fish:consumeBait", (player: PlayerMp, item?: ItemEntity) => {
    if (!player?.user) return;

    const baitItem = item || player.user.inventory.find(i => i.item_id === 40159);
    if (!baitItem) return; // daca nu e gasit, iesim in liniste (fara erori)

    baitItem.useCount(1, player);
    player.notify("Ai consumat o momeala.", "info");
});


// CustomEvent.registerClient("fish:consumeBait", (player: PlayerMp, item: ItemEntity) => {
//     if (!player?.user) return;
//     if (item.item_id !== 40159) return;

//     // ✅ Consumă o bucată de momeală
//     item.useCount(1);
//     player.notify("Ai consumat o rama.", "info");
// });


CustomEvent.registerClient('fish:catch:done', (player, fishId: number) => {
    const user = player.user;
    if (!user) 
        return;

    const catchedFish = FISHES.find(f => f.itemId == fishId);
    
    if (!catchedFish || !player.user.rodInHandId || !player.user.tempData.fishing)
        return
    
    if (user.tempData.fishToCatch != catchedFish.itemId) {
        writeSpecialLog(langStringDefault("fish.bfdc0c33ff312bbf27880ba65084b691", user.tempData.fishToCatch, catchedFish.itemId), player)
    }

    user.tryGiveItem(fishId, true, true);
    // mp.events.call(FISHING_TASK_MANAGER_EVENT, player, fishId);

    player.user.addJobExp('fisher', catchedFish.expPerCatch);
    player.user.addFishStat(catchedFish);
    player.user.achiev.achievTickByType("fishCount");
     
    player.user.rodInHandId = 0
    player.user.tempData.fishing = false
})

const getRodImpactToFishCatchChance = (fishDefaultChance: number, rod: IRod): number => {
    return fishDefaultChance + rod.bestFishChanceIncrement
}

/**
 * Высчитать рандомную рыбу с учетом всех возможных бустов
 */
const getRandomFish = (player: PlayerMp, throwLength: number): IFish => {
    const fisherLevel = getFisherLevelByExp(player.user.getJobExp('fisher'))
    const fisherRod = RODS.find(r => r.itemId === player.user.rodInHandId)
    const bestAvailableFish = getBestAvailabelFishByLevel(fisherLevel)
    
    const chances: { fish: IFish, chance: number }[] = FISHES.map(fish => {
        return {
            fish: fish,
            // Если это лучшая рыба доступная на уровне, то к стандартному шансу поимки рыбы прибавляем влияние удочки 
            chance: fish.catchChances.get(fisherLevel)
                + (bestAvailableFish == fish ? getRodImpactToFishCatchChance(fish.catchChances.get(fisherLevel), fisherRod) + throwLength / 3 : 0)
        }
    })
    
    const randomNumber = system.getRandomInt(1, 100)

    let randomFish = chances[0]
    chances.forEach(fish => {
        if (fish.chance >= randomNumber) {
            randomFish = fish;
            return;
        }
    })
    
    return randomFish.fish
}

CustomEvent.registerClient('fish:cancel', (player) => {
    if (!player.user) 
        return
    
    player.user.rodInHandId = 0
})

CustomEvent.registerClient('fish:haveAccess', (player, id: number) => {
    const user = player.user;
    if (!user) return false;
    let conf = FISH_POS[id];
    if (!conf) return;
    const currentRod = RODS.find(r => r.itemId === player.user.rodInHandId)
    const fisherLvl = getFisherLevelByExp(player.user.getJobExp('fisher'))
    if (currentRod.minLevelToBuy > fisherLvl) {
        player.user.notify(player.user.LangString("fish.71586c53135ccfd90167760c01870963", currentRod.minLevelToBuy, fisherLvl), 'warning')
        return false
    } 
    return { rod: user.haveFishRod, license: !conf.needLicense || user.haveActiveLicense('fishrod')}
})