import { langStringDefault } from "../../../../../shared/lang";
import {registerHookHandler} from "../../../../../shared/hooks";
import {INVENTORY_USE_ITEM_HOOK} from "../../../inventory";
import {ItemEntity} from "../../../typeorm/entities/inventory";
import {ITEM_TYPE, itemConfig} from "../../../../../shared/inventory";
import {PotionType} from "../../../../../shared/events/halloween.potions";
import {CustomEvent} from "../../../custom.event";
import {system} from "../../../system";
import {ANIMS_LIST} from "../../../../../shared/anim";

const healPotions = new Map<PotionType, number>([
    [PotionType.HEALTH_DWARF, 10],
    [PotionType.HEALTH_GIANT, 50],
    [PotionType.HEALTH, 70],
    [PotionType.HEALTH_COCKROACH, 100]
])

registerHookHandler(INVENTORY_USE_ITEM_HOOK, (player: PlayerMp, item: ItemEntity, itemConfig: itemConfig) => {
    if (itemConfig.type !== ITEM_TYPE.POTION) {
        return;
    }

    if (player.user.isInCombat) {
        player.notify(player.user.LangString("item.use.hook.54a420a7bda20443360caaf0154d6c03"), "error");
        return;
    }

    if (healPotions.has(item.item_id)) {
        player.user.health += healPotions.get(item.item_id);
    }
    else if (item.item_id === PotionType.ARMOR_BUG) {
        player.notify(player.user.LangString("item.use.hook.60992465b0072a3e033e73688183ff5c"));
        player.user.giveDamageResist(0.05, 120);
    }
    else if (item.item_id === PotionType.MANTIS) {
        player.notify(player.user.LangString("item.use.hook.deaf9339601cf29712da81e32620d9a0"));
        player.user.health = 0;
        item.useCount(1);
        return;
    }
    else if (item.item_id === PotionType.SOFA_CRITIC) {
        player.notify(player.user.LangString("item.use.hook.ebc1767e4b999245393e5aca3531f7cd"));

        // Пиво
        player.user.giveItem({
            item_id: 201
        });

        // Чипсы
        player.user.giveItem({
            item_id: 21
        });

    }
    else if (item.item_id === PotionType.UNKNOWN) {
        player.user.addIll("narko", itemConfig.drugMultiple || 1);
        CustomEvent.triggerClient(player, "drug:use", system.biggestNumber(30, itemConfig.drugMultiple * 0.3))

    }
    else if (item.item_id === PotionType.ALPHA) {
        let count = itemConfig.default_count ? itemConfig.default_count : item.count;
        count = system.smallestNumber(count, 45);
        player.user.addIll("alco", count);
        CustomEvent.triggerClient(player, "drug:use", system.biggestNumber(10, count), true)

    }
    else if (item.item_id === PotionType.DANCER) {
        const dancesAnims = ANIMS_LIST.find(a => a.id === "4");
        const animToPlay = system.randomArrayElement(dancesAnims.anims).seq[0];

        if (typeof animToPlay === "string") {
            return;
        }

        player.user.playAnimationWithResult([animToPlay[0], animToPlay[1], true], 5000, player.user.LangString("item.use.hook.057b250fcde39cd3f292108f40870300"));

        item.useCount(1);
        return;
    }
    else if (item.item_id === PotionType.LOGAN) {
        player.notify(player.user.LangString("item.use.hook.4c99a50c9421c49a0526f8135021190c"))
        player.user.setRegeneration(10, 120, 15);
    }

    player.user.playAnimation([
        ["mp_player_intdrink", "intro_bottle", 1],
        ["mp_player_intdrink", "loop_bottle", 1],
        ["mp_player_intdrink", "outro_bottle", 1]
    ], true, false);
    item.useCount(1);
});