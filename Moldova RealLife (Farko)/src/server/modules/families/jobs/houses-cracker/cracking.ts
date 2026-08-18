import { langStringDefault } from "../../../../../shared/lang";
import {HouseEntity} from "../../../typeorm/entities/houses";
import {CustomEvent} from "../../../custom.event";
import {houses} from "../../../houses";
import {createRobberyCheckpoints} from "./robbering";
import {Family} from "../../family";
import {FamilyReputationType} from "../../../../../shared/family";
import {MinGovFamilyLevel, PicklockBrokeChance, PicklockItemId} from "./config";
import {system} from "../../../system";
import {inventory} from "../../../inventory";
import {setHouseRobbingNow} from "./index";
import { User } from "../../../user"
import {fractionCfg} from "../../../fractions/main";

export function createCrackPoint(player: PlayerMp, house: HouseEntity) {
    CustomEvent.triggerClient(player, "jobs:houseCracking:createCrackpoint", new mp.Vector3(house.x, house.y, house.z));
}

CustomEvent.registerClient("jobs:houseCracking:enterCrackpoint", crackHouse);
async function crackHouse(player: PlayerMp) {
    if (!player.user || !player.housesCrackerData) {
        return;
    }

    const house = player.housesCrackerData.house;
    if (!house.opened) {
    // Verificare: minim 3 polițiști online
    const onlinePoliceCount = mp.players.toArray().filter(u => u.user?.fractionData?.police).length;
    if (onlinePoliceCount < 3) {
        player.notify("Nu poti incepe jaful. Sunt necesari minim 3 politisti online.", "error");
        return; // oprește execuția jafului
    }

    // if (!house.opened) {
        if (inventory.getItemsCountById(player, PicklockItemId) < 1) {
            player.notify(player.user.LangString("cracking.d0f2533c5ff40843e15d30a463840108"), "error");
            return;
        }

        if (!player.housesCrackerData.isRobberyNotified) {
            sendRobberyNotifications(player, house);
        }

        const isSuccess = await CustomEvent.callClient(player, "jobs:houseCracking:startMinigame", house.name);

        if (!isSuccess) {
            inventory.deleteItemsById(player, PicklockItemId, 1);
            player.notify(player.user.LangString("cracking.c808ed47df46d10e5dec6387ff0cf2bd"), "error");
            return;
        }

        if (tryBrokePlayerPicklock(player)) {
            player.notify(player.user.LangString("cracking.d99eaae59a8c50009dfc378a7274ab2a"));
        }
    }

    createRobberyCheckpoints(player, house);
    houses.enterHouse(player, house);
    CustomEvent.triggerClient(player, "jobs:houseCracking:destroyCrackPoint");

    setHouseRobbingNow(player.dbid, house.id);
}

function sendRobberyNotifications(player: PlayerMp, house: HouseEntity) {
    mp.players.toArray().filter(u => u.user?.fractionData?.police).forEach(user => {
        user.notify(user.user.LangString("cracking.22634d338f054129aa44f4500c163725"), "warning")
    })

    player.housesCrackerData.govRobberyBlip = system.createDynamicBlip(`robbery_${house.id}`, 1, 3,
        { x: house.x, y: house.y, z: house.z }, langStringDefault("cracking.3d0ce83486b4aef519656e47651279b8"), {
            fraction: fractionCfg.policeFactions,
            shortRange: false
        });

    player.housesCrackerData.isRobberyNotified = true;
}

function tryBrokePlayerPicklock(player: PlayerMp) : boolean {
    if (Math.random() > PicklockBrokeChance) {
        return false;
    }

    inventory.deleteItemsById(player, PicklockItemId, 1);
    return true;
}