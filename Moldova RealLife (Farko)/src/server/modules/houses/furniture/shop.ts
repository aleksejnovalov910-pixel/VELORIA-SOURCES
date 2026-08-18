import { langStringDefault } from "../../../../shared/lang";
import {
    FURNITURE_SHOP_BLIP_COLOR,
    FURNITURE_SHOP_BLIP_SPRITE,
    FURNITURE_SHOP_HEADING,
    FURNITURE_SHOP_NPC_MODEL,
    FURNITURE_SHOP_POSITION, FURNITURE_SHOP_VIEW_DIMENSION
} from "../../../../shared/houses/furniture/shop.config";
import {NpcSpawn} from "../../npc";
import {CustomEvent} from "../../custom.event";

setTimeout(() => {
    new NpcSpawn(
        FURNITURE_SHOP_POSITION,
        FURNITURE_SHOP_HEADING,
        FURNITURE_SHOP_NPC_MODEL,
        langStringDefault("shop.e54dfbd645e3b328edadff8688497b3d"),
        (player: PlayerMp) => {
            if (!player.user) return;
            player.dimension = FURNITURE_SHOP_VIEW_DIMENSION;
            CustomEvent.triggerClient(player, "furnitureShop:open");
        },
        1
    )
}, 1000)

mp.blips.new(
    FURNITURE_SHOP_BLIP_SPRITE,
    FURNITURE_SHOP_POSITION,
    {
        color: FURNITURE_SHOP_BLIP_COLOR,
        shortRange: true,
        dimension: 0,
        name: langStringDefault("shop.06b1526a5b20a22235c338bc4cbdf29b")
    }
)

CustomEvent.registerClient("furnitureShop:exit", (player) => {
    if (!player.user) return;
    player.dimension = 0;
})
