import { langStringDefault } from "../../shared/lang";
import {MINER_POSITIONS} from "../../shared/miner";
import {CustomEvent} from "./custom.event";
import {system} from "./system";

// import { User } from "../../user";
import {LEVEL_PERMISSIONS} from "../../shared/level.permissions";
import {colshapes} from "./checkpoints";
import {getBaseItemNameById} from "../../shared/inventory";
import {FamilyContractList} from "../../shared/family";

let currentItems = new Map<number, number>();
let currentItemsSplit = new Map<number, number[]>();
let currentBlock = new Map<number, boolean>();

MINER_POSITIONS.map((item, id) => {
    currentItems.set(id, item.amount_max);
    currentItemsSplit.set(id, new Array(item.pos.length).fill(Math.floor(item.amount_max / item.pos.length)));
    const count = (posid: number) => {
        if(item.split) return currentItemsSplit.get(id)[posid]
        return currentItems.get(id);
    }

    setInterval(() => {
        currentItems.set(id, Math.min(currentItems.get(id) + item.restore_tick, item.amount_max))
        let q = [...currentItemsSplit.get(id)];
        q.map((s, i) => {
            q[i] = Math.floor(Math.min(s + (item.restore_tick / item.pos.length), item.amount_max / item.pos.length))
        })
        currentItemsSplit.set(id, [...q])
    }, item.tick_interval_minutes * 60000)

    colshapes.new(item.pos.map(q => new mp.Vector3(q.x, q.y, q.z)), item.name, async (player, posid) => {
        const user = player.user;
        const uid = user.id;
    
        // ✅ Verificare ore jucate
        if (user.playtime < LEVEL_PERMISSIONS.MINER) {
            return player.notify(`Ai nevoie de minim ${LEVEL_PERMISSIONS.MINER} ore jucate pentru a face acest job.`, 'error');
        }
        if (currentBlock.has(uid)) return player.notify(player.user.LangString("farm.f83935a66d64519a0546aca1e33dd9fd"), 'error')

        if (item.needNotFraction && user.fraction)
            player.notify(player.user.LangString("farm.4b55200a968aface3fc92a3d2116ce14"), 'error');

        if (item.fraction && !item.family){
            if (!item.fraction.includes(user.fraction)) return player.notify(player.user.LangString("farm.e92547f1990570be703040607c227d38"), 'error');
        }

        if (item.family) {
            if (!user.family) return player.notify(player.user.LangString("farm.a2134042781efa9b981054024591b00f"), 'error');
        }

        if(item.needFamily && !user.family) return player.notify(player.user.LangString("farm.953d3dedacb7df031edb870d67646df5"), 'error');
        if(count(posid) <= 0) return player.notify(player.user.LangString("farm.4b1ee215616a41b1af969747c686699b"), 'error')
        const itemid = typeof item.item === "number" ? item.item : system.randomArrayElement(item.item)
        if(!user.canTakeItem(itemid)) return player.notify(player.user.LangString("farm.aa2f78b5e9e75a2df5df0f217d927f49", getBaseItemNameById(itemid)), 'error')
        if(item.anim){
             currentBlock.set(uid, true);
             const status = await user.playAnimationWithResult(item.anim.task, item.anim.seconds, item.anim.text, item.anim.heading, item.anim.minigame);
             currentBlock.delete(uid)
             if(!status) return;
        }
        if(count(posid) <= 0) return player.notify(player.user.LangString("farm.b42cffe9683a623a067a28cb17d5ce46"), 'error')
        if(!user.canTakeItem(itemid)) return player.notify(player.user.LangString("farm.ddac7940aa8bb9e3b5916e8ca26b1355", getBaseItemNameById(itemid)), 'error');
        user.giveItem(itemid);
        const itemName = getBaseItemNameById(itemid);

        // trimite notificare jucatorului
        player.notify(`Ai obtinut ${itemName}!`, 'success');

        // user.family.addContractValueIfExists(FamilyContractList.farmers, 1)
        //

        if(item.split){
            let q = [...currentItemsSplit.get(id)];
            q[posid] = Math.max(q[posid] - 1, 0);
            currentItemsSplit.set(id, q)
        } else {
            currentItems.set(id, Math.max(currentItems.get(id) - 1, 0))
        }


        if(item.cooldown){
            currentBlock.set(uid, true);
            setTimeout(() => {
                currentBlock.delete(uid);
            }, item.cooldown * 1000)
        }
    }, {
        type: item.markerType,
        dimension: item.d,
    })
})


