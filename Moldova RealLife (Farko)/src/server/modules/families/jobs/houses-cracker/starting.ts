import { langStringDefault } from "../../../../../shared/lang";
import {NpcSpawn} from "../../../npc";
import {MinGangFamilyLevel, QuestBlip, QuestBlipColor, QuestNpcParameters, RobberyTaskCooldownMinutes} from "./config";
import {FamilyReputationType} from "../../../../../shared/family";
import {menu} from "../../../menu";
import {houses} from "../../../houses";
import {getRandomInt} from "../../../../../shared/arrays";
import {HouseEntity} from "../../../typeorm/entities/houses";
import {createCrackPoint} from "./cracking";
import {system} from "../../../system";
import {inventory} from "../../../inventory";
import {inventoryShared, ITEM_TYPE} from "../../../../../shared/inventory";

// Ебучий костыль: без setTimeout выкидывает ошибку при старте сервера внутри NpcSpawn.Recreate(),
// мол createPed of undefined. (system блять undefined у него, ага)
// setTimeout(() => {
//     const questNpc = new NpcSpawn(QuestNpcParameters.Position, QuestNpcParameters.Heading, QuestNpcParameters.Model,
//         QuestNpcParameters.Name, handleInteractNpc);

//     mp.blips.new(QuestBlip, QuestNpcParameters.Position, {
//         color: QuestBlipColor,
//         shortRange: true,
//         name: langStringDefault("starting.a30237804ca046a3f08af3f57a5991fa")
//     })
// }, 10000);
setTimeout(() => {
    const questNpc = new NpcSpawn(
        QuestNpcParameters.Position,
        QuestNpcParameters.Heading,
        QuestNpcParameters.Model,
        QuestNpcParameters.Name,
        handleInteractNpc
    );

    // Blip-ul a fost eliminat complet pentru ca NPC-ul sa nu mai apara pe harta.
    // Daca doresti sa-l reactivezi, decomenteaza linia de mai jos.

    /*
    mp.blips.new(QuestBlip, QuestNpcParameters.Position, {
        color: QuestBlipColor,
        shortRange: true,
        name: langStringDefault("starting.a30237804ca046a3f08af3f57a5991fa")
    });
    */
}, 10000);
async function handleInteractNpc(player: PlayerMp) {
    if (!player.user) return;

    const isMafia = player.user.fractionData?.mafia;
    const isGangster = player.user.fractionData?.gang;

    if (!isMafia && !isGangster) {
        player.notify(player.user.LangString("starting.21a3951de4498fc7f3ad0972b76efa3b"), "error");
        return;
    }

    openJobMenu(player);
}


// async function handleInteractNpc(player: PlayerMp) {
//     if (!player.user) return;

//     openJobMenu(player);
// }
// async function handleInteractNpc(player: PlayerMp) {
//     if (!player.user) return;

//     if (!player.user.fractionData?.mafia) {
//         player.notify(player.user.LangString("starting.21a3951de4498fc7f3ad0972b76efa3b"), "error")
//         return;
//     }

//     openJobMenu(player);
// }

function openJobMenu(player: PlayerMp) {
    const jobMenu = menu.new(player, player.user.LangString("starting.dc2b9014bc59a0e198b6e504e7a98c9b"));

    jobMenu.newItem({
        name: langStringDefault("starting.65095a2dda628a345848cf12e8c8d700"),
        onpress: () => startJob(player)
    });

    jobMenu.open();
}

function startJob(player: PlayerMp) {
    if (player.housesCrackerData) {
        player.notify(player.user.LangString("starting.040bd59c366cfb6401d9d997af82282e"), "error");
        return;
    }

    const nextTaskTime = player.user.entity.robberyTask_nextAvailableTime;
    if (system.timestamp < nextTaskTime) {
        const canGetTaskInMinutes = Math.ceil((nextTaskTime - system.timestamp) / 60);
        player.notify(player.user.LangString("starting.d13407332a6139efade93fa9d49a6497", canGetTaskInMinutes), "error");
        return;
    }

    if (!isPlayerHaveBag(player)) {
        player.notify(player.user.LangString("starting.2e5dc3690cac1c5e30f14b8f80309700"), "error");
        return;
    }

    player.user.entity.robberyTask_nextAvailableTime = system.getTimeAfter({ minutes: RobberyTaskCooldownMinutes });
    player.user.save();

    const house = pickRandomHouse();
    player.housesCrackerData = {
        robbedPoints: 0,
        robbedItems: [],
        isRobberyNotified: false,
        isLeavingAreaCreated: false,
        house: house
    };

    createCrackPoint(player, house);

    player.user.setWaypoint(house.x, house.y, house.z);
    player.notify(player.user.LangString("starting.373a875636ae8a68450f8e9060b8328b"), "info");
}

function isPlayerHaveBag(player: PlayerMp): boolean {
    return player.user.allMyItems
        .some(item => inventoryShared.get(item.item_id).type === ITEM_TYPE.BAGS);
}

function pickRandomHouse(): HouseEntity {
    const availableHouses = [...houses.data.values()]
        .filter(h => h.forTp === 0);

    return availableHouses[getRandomInt(0, availableHouses.length - 1)];
}