import { langStringDefault } from "../../../../../shared/lang";
import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_EXCHANGE_DIALOG_ID,
    NEW_YEAR_EXCHANGE_NPC_ID, NEW_YEAR_EXCHANGE_NPC_NAME,
    NEW_YEAR_EXCHANGE_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/exchange.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";
import {FuncAnswer} from "../../../advancedNpc/dialogs/impl/funcAnswer";
import {NEW_YEAR_EXCHANGE_ACTIVE} from "../../../../../shared/events/newYear/main.config";
import {
    DressConfigDto,
    ExchangeClothesItem, ExchangeInventoryItem, ExchangeItem,
    ExchangeItemType
} from "../../../../../shared/events/halloween.exchange";
import {EXCHANGE_ITEMS} from "../../../../../shared/events/newYear/exchange.config";
import {dress} from "../../../customization";
import {CustomEvent} from "../../../custom.event";
import {menu} from "../../../menu";


export class Exchange {
    constructor() {
        this.spawnExchangeNPC();
        this.createNPCDialog();

        CustomEvent.registerCef("new-year:exchange:buy",
            (player, id: number) => this.buyItemHandle(player, id));
    }

    spawnExchangeNPC() {
        new ServerNpc(NEW_YEAR_EXCHANGE_NPC_ID, NEW_YEAR_EXCHANGE_NPC_PARAMETERS, NEW_YEAR_EXCHANGE_DIALOG_ID);
    }

    createNPCDialog() {
        registerDialog({
            id: NEW_YEAR_EXCHANGE_DIALOG_ID,
            characterName: NEW_YEAR_EXCHANGE_NPC_NAME,
            nodes: [
                {
                    id: 0,
                    npcReplies: [
                        { text: langStringDefault("index.786f4e56a345e97b38329757242d3c6a") }
                    ],
                    answers: [
                        {
                            text: langStringDefault("index.b86fcf2ec0ce680acdacf7c4f7d163f6"),
                            toNode: NEW_YEAR_EXCHANGE_ACTIVE ? 2 : 1
                        }
                    ]
                },

                {
                    id: 1,
                    npcReplies: [
                        { text: langStringDefault("index.2f53656fb0cf5a2d0c1fb85b06c90ed6") },
                        { text: langStringDefault("index.e1b24bf3738db955bb16d3cdda8287e0") }
                    ],
                    answers: [
                        { text: langStringDefault("index.35d08afcaa2147437b7d1cda14672501"), isExit: true }
                    ]
                },

                {
                    id: 2,
                    npcReplies: [
                        { text: langStringDefault("index.2b03638c9cb63adbb71c63706b7ccd04") }
                    ],
                    answers: [
                        { text: langStringDefault("index.d812913eacbab47c4af1b04754dbcf5f"), isExit: true, onReply: new FuncAnswer((player) => this.openMenuHandle(player))  }
                    ]
                }
            ]
        })
    }

    openMenuHandle(player: PlayerMp) {
        setTimeout(() => {
            const dressDtos = EXCHANGE_ITEMS
                .filter(item => item.itemType === ExchangeItemType.CLOTHES)
                .map<DressConfigDto>(item => {
                    const exchangeDressItem = item as ExchangeClothesItem;
                    const dressCfg = dress.get(exchangeDressItem.dressConfigId);

                    return {
                        id: exchangeDressItem.dressConfigId,
                        name: dressCfg.name,
                        isMale: dressCfg.male === 1
                    }
                });

            player.user.setGui("lollipopsExchanger", "new-year:exchange:open",
                player.user.lollipops,
                player.user.male,
                dressDtos
            );
        }, 500);
    }

    async buyItemHandle(player: PlayerMp, itemIdx: number) {
        if (!player || !player.user || !mp.players.exists(player)) {
            return;
        }

        const item = EXCHANGE_ITEMS[itemIdx];
        if (!item) return;

        if (player.user.lollipops < item.price) return player.notify(player.user.LangString("index.07684b0d7889d5cd355824b1a8cfce24"));

        player.user.setGui(null);

        const isAccepted = await menu.accept(player);

        if (!isAccepted) return;

        player.user.lollipops -= item.price;

        this.givePlayerExchangeItem(player, item);
        CustomEvent.triggerCef(player, "new-year:exchange:setBalance", player.user.lollipops);
    }

    givePlayerExchangeItem(player: PlayerMp, item: ExchangeItem) {
        if (item.itemType === ExchangeItemType.INVENTORY_ITEM) {
            player.user.giveItem((item as ExchangeInventoryItem).configItemId, true);
        } else if (item.itemType === ExchangeItemType.CLOTHES) {
            const dressId = (item as ExchangeClothesItem).dressConfigId;
            const dressConfig = dress.get(dressId);

            if (dressConfig.category == 107) player.user.setDressValueById(959, dressId);
            if (dressConfig.category == 106) player.user.setDressValueById(957, dressId);
            if (dressConfig.category == 102) player.user.setDressValueById(956, dressId);
            if (dressConfig.category == 101) player.user.setDressValueById(955, dressId);
            if (dressConfig.category == 100) player.user.setDressValueById(954, dressId);
            if (dressConfig.category == 7) player.user.setDressValueById(958, dressId);
            if (dressConfig.category == 6) player.user.setDressValueById(953, dressId);
            if (dressConfig.category == 4) player.user.setDressValueById(952, dressId);
            if (dressConfig.category == 3) player.user.setDressValueById(951, dressId);
            if (dressConfig.category == 1) player.user.setDressValueById(950, dressId);
        }
    }
}