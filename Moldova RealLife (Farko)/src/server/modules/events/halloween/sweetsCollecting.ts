import { langStringDefault } from "../../../../shared/lang";
import {registerHookHandler} from "../../../../shared/hooks";
import {MenuItem} from "../../../../shared/menu";
import {HALLOWEEN_MANAGE_MENU_HOOK} from "./adminPanel";
import {houses, HOUSES_ENTER_MENU_HOOK, HOUSES_LOADED_EVENT} from "../../houses";
import {HouseEntity} from "../../typeorm/entities/houses";
import {isHalloweenEnabled} from "./index";
import {inventory} from "../../inventory";
import {HALLOWEEN_BASKET_ITEM_ID} from "../../../../shared/inventory";
import {MenuClass} from "../../menu";
import {system} from "../../system";
import {ServerNpc} from "../../advancedNpc";
import {NpcParameters} from "../../npc";
import {registerDialog} from "../../advancedNpc/dialogs/dialogs";
import {INodeCondition} from "../../advancedNpc/dialogs/interfaces/INodeCondition";
import {IAnswerAction} from "../../advancedNpc/dialogs/interfaces/IAnswerAction";
import {Dialog} from "../../advancedNpc/dialogs/interfaces/dialog";
import {
    HALLOWEEN_SWEET_NPC_ID,
    HALLOWEEN_SWEET_NPC_NAME,
    HALLOWEEN_SWEET_NPC_PARAMETERS
} from "../../../../shared/events/halloween.config";
import {getRandomInt} from "../../../../shared/arrays";

const TAKE_SWEETS_COOLDOWN_MINUTE = 15;
const SWEETS_PER_HOUSE_MAX = 5;
const SWEETS_PER_HOUSE_MIN = 15;
const HALLOWEEN_PUMPKIN_MODEL = "halloween_props_pumpkin_003";
let housesPumpkins: { houseId: number, sweetsTakenTime: number }[] = [];

let isCollectingEnabled = false;

mp.events.add(HOUSES_LOADED_EVENT, loadHousesPumpkins);
function loadHousesPumpkins(houses: HouseEntity[]) {
    for (let house of houses) {
        housesPumpkins.push({ houseId: house.id, sweetsTakenTime: 0 });
    }
}
function unloadHousesPumpkins() {
    housesPumpkins = [];
}

/**
 * Выдает игроку хэллоунский костюм и корзину
 */
function giveSweetCollectorSet(player: PlayerMp) {
    player.user.giveItem({
        item_id: HALLOWEEN_BASKET_ITEM_ID
    });
}
function isPlayerHasSweetCollectorSet(player: PlayerMp): boolean {
    return inventory.getItemsCountById(player, HALLOWEEN_BASKET_ITEM_ID) > 0;
}

registerHookHandler(HOUSES_ENTER_MENU_HOOK, (player: PlayerMp, house: HouseEntity, menu: MenuClass, updateMenu: () => void) => {
    if (!isCollectingEnabled) {
        return;
    }

    menu.newItem({
        name: langStringDefault("sweetsCollecting.5b83e21327c7c6a1b0167d0ee6aa9780"),
        onpress: () => {
            const housePumpkin = housesPumpkins.find(pumpkin => pumpkin.houseId === house.id);
            if (!housePumpkin) {
                return player.notify(player.user.LangString("sweetsCollecting.d48e94889cbcfa1343d36e88e8a721b2"), "error");
            }

            if (!player.user.hasAttachment(`item_${HALLOWEEN_BASKET_ITEM_ID}`)) {
                return player.notify(player.user.LangString("sweetsCollecting.6ac13240fd17120410244efce7901c1b"));
            }

            if (housePumpkin.sweetsTakenTime + TAKE_SWEETS_COOLDOWN_MINUTE * 60 > system.timestamp) {
                return player.notify(player.user.LangString("sweetsCollecting.8d2d60b250dc29188f09bd7379dff377"));
            }

            housePumpkin.sweetsTakenTime = system.timestamp;

            const candiesAmount = getRandomInt(SWEETS_PER_HOUSE_MIN, SWEETS_PER_HOUSE_MAX);
            player.user.giveCandies(candiesAmount);
            player.user.log("candiesAdd", langStringDefault("sweetsCollecting.e3bd3cefe1f2b0ecf5de7838e1200b73", candiesAmount));

            player.user.playAnimation([["random@domestic", "pickup_low"]], true)
        }
    })
});

registerHookHandler(HALLOWEEN_MANAGE_MENU_HOOK, (player: PlayerMp, menu: MenuClass, updateMenu: () => void) => {
    menu.newItem({
        name: langStringDefault("sweetsCollecting.fa265a36f353ef2d38e33801412d3c64", isCollectingEnabled ? langStringDefault("sweetsCollecting.4794a88aabc444596a176d9cda2526af") : langStringDefault("sweetsCollecting.7c4dae213cb7698ed569e73d6587a601")),
        onpress: () => {
            isCollectingEnabled = !isCollectingEnabled;
            player.notify(player.user.LangString("sweetsCollecting.884aca42735d83dada6a0d7980ee34f2", isCollectingEnabled ? player.user.LangString("sweetsCollecting.74a8b143e2c7518fe5bae35dc02ebf48") : player.user.LangString("sweetsCollecting.f3bab7a2fb2f7ad82702030539702bf8")));

            updateMenu();
        }
    });
});



const HALLOWEEN_SWEET_NPC_DIALOG = "halloween-sweet-npc-dialog";

const sweetNpc = new ServerNpc(HALLOWEEN_SWEET_NPC_ID, HALLOWEEN_SWEET_NPC_PARAMETERS, HALLOWEEN_SWEET_NPC_DIALOG);

class HasBasketCondition implements INodeCondition {
    private readonly _hasNodeId: number;
    private readonly _hasNotNodeId: number;

    constructor(hasNodeId: number, hasNotNodeId: number) {
        this._hasNodeId = hasNodeId;
        this._hasNotNodeId = hasNotNodeId;
    }

    getNextNode(player: PlayerMp): number {
        return isPlayerHasSweetCollectorSet(player) ? this._hasNodeId : this._hasNotNodeId;
    }

}

class GiveBasketAction implements IAnswerAction {
    handle(player: PlayerMp, dialog: Dialog): void {
        giveSweetCollectorSet(player);
    }
}

registerDialog({
    id: HALLOWEEN_SWEET_NPC_DIALOG,
    characterName: HALLOWEEN_SWEET_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: langStringDefault("sweetsCollecting.fd115d00e1ccb45e5b8ef6b574bdbbe0") }
            ],
            answers: [
                { text: langStringDefault("sweetsCollecting.2574bdd7ba8d7b4f610f5318839317ea"), toNode: new HasBasketCondition(1, 2) }
            ]
        },

        {
            id: 1,
            npcReplies: [
                { text: langStringDefault("sweetsCollecting.b5fcfa8c45b4421a2554b73ec5d37d52") }
            ],
            answers: [
                { text: langStringDefault("sweetsCollecting.803b583d935767a51637a79d8da2515c"), isExit: true }
            ]
        },

        {
            id: 2,
            npcReplies: [
                { text: langStringDefault("sweetsCollecting.93e1335129c0b16ecad384961d78760f") },
                { text: langStringDefault("sweetsCollecting.4ff29bab58c07a6c406aae3c6f06a107") }
            ],
            answers: [
                { text: langStringDefault("sweetsCollecting.4176d2548fa2d06896679a96db748aae"), isExit: true, onReply: new GiveBasketAction() }
            ]
        }
    ]
});

