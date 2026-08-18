import { langStringDefault } from "../../../shared/lang";
import {
    PRISON_ARREST_MONEY,
    PRISON_FREE_POSITION, PRISON_HOSPITAL_RESPAWN_POS,
    PRISON_MINUTES_FOR_RUN,
    PRISON_SPAWN_POSITIONS, PRISON_TASKS_CD, PRISONER_DRESS_FEMALE, PRISONER_DRESS_MALE, TASKS_TIME_DELETE
} from "../../../shared/prison/config";
import {tablet} from "../tablet";
import {CustomEvent} from "../custom.event";
import {IPrisonData} from "../../../shared/prison/IPrisonData";
import {User} from "../user";
import {UserEntity} from "../typeorm/entities/user";
import {addAdminStats} from "../admin.stats";
import {enterMenu} from "./interactions/enterMenu";
import {NpcSpawn} from "../npc";
import {system} from "../system";
import "./kitchen";
import {inventory} from "../inventory";

class Prison {
    private hashes: Map<number, string> = new Map<number, string>();

    constructor() {
        this.createTaskPed();
    }

    private taskPedHandler = (player: PlayerMp) => {
        if (!player.user) return;
        if (!player.user.prison) return player.notify(player.user.LangString("index.deba1a2df30cd202181d3c377f22301a"), "error");
        if (this.hashes.has(player.user.id)) return player.notify(player.user.LangString("index.5744c338d536fb1007910e2876e67d19"), "error");
        if (player.user.prison.taskTime && system.timestamp - player.user.prison.taskTime < PRISON_TASKS_CD)
            return player.notify(player.user.LangString("index.d514926cf43c7ba9d24ebe7e6c493767"), "error");

        const prisonData = {...player.user.prison};

        prisonData.taskTime = system.timestamp;

        player.user.prison = prisonData;

        const userHash = system.randomStr(8);

        this.hashes.set(player.user.id, userHash);

        CustomEvent.triggerClient(player, "prison:tasks:start", userHash);
    }

    private createTaskPed() {
        setTimeout(() => {
            new NpcSpawn(
                new mp.Vector3(1692.62, 2471.01, 45.59),
                1,
                "cs_casey",
                langStringDefault("index.c39e70b6ae5c07c93ad910f59e147cfd"),
                this.taskPedHandler
            )
        }, 5000)
    }

    public sync(player: PlayerMp) {
        if (!player || !player.user) return;
        player.user.cuffed = false;
        player.user.adminRestore();

        if (player.user.prison.byAdmin) inventory.removeAllWeapons(player);

        const randCoords = PRISON_SPAWN_POSITIONS[Math.floor(Math.random() * PRISON_SPAWN_POSITIONS.length)];
        player.user.setJobDress(player.user.male ? PRISONER_DRESS_MALE : PRISONER_DRESS_FEMALE);
        player.user.teleport(randCoords.x, randCoords.y, randCoords.z, 0, 0);
        CustomEvent.triggerClient(player, "prison:sync", player.user.prison);
    }

    public free(player: PlayerMp) {
        CustomEvent.triggerClient(player, "prison:clear");
        player.user.prison = null;
        player.user.setJobDress(null);
        player.user.teleport(PRISON_FREE_POSITION.x, PRISON_FREE_POSITION.y, PRISON_FREE_POSITION.z, 0, 0);
        player.user.adminRestore();
        player.user.notify(player.user.LangString("index.ecde2a5c693adb9aa15ad14c9ea9a7f6"), "success");
    }

    public jail(player: PlayerMp, target: PlayerMp, time: number, reason: string) {
        if (!target || !target.user) return;

        if (target.user.prison) return player.notify(player.user.LangString("index.0c808fcc0cadcb0d438e339db7211749"), "error");
        if (!target.user.cuffed) return player.notify(player.user.LangString("index.c5273fe7f38ab97fdd1a3a7f1817091b"), "error");
        // if (!target.user.wanted_level) return player.notify(player.user.LangString("index.734a27e8c6249d06e2f7c450f27ff80d"), "error");
        if (!player.user.is_gos) return player.notify(player.user.LangString("index.c87ae0e4e90c06a6b2f5e9851ebabdf2"), "error");


        if (player.user.is_gos) {
            const whoFraction = player.user.fractionData;
            target.user.writeRpHistory(langStringDefault("index.1bea8706f71ae306f4d014adc4d2696e", whoFraction.name, player.user.name, player.user.id, time / 60, reason));
        }

        player.user.addMoney(PRISON_ARREST_MONEY, true, player.user.LangString("index.c5f094933f1f23134db2b7be73aa730e", target.user.name));
        player.user.log("gosJob", langStringDefault("index.28db3eeeb4ee58850904b5d50f6a9884", time / 60, reason), target);

        // target.user.wanted_level = 0;
        // target.user.wanted_reason = "";

        tablet.gosSearchDataReload(target.user.id)
        target.user.prison = {
            time,
            reason,
            byAdmin: false,
            policeId: player.user.id
        };

        this.sync(target);
    }

    public async systemJail(entity: UserEntity, time: number, reason: string) {
        entity.prison = JSON.stringify({
            time: time * 60,
            reason,
            byAdmin: true
        });
    }

    public async jailAdmin(player: PlayerMp, targetId: number, time: number, reason: string) {
        if (!player.user) return;
        if (!player.user.admin_level) return player.notify(player.user.LangString("index.637bd0f564adb2d6bf39d497161c9626"), "error")

        let user = player.user;
        let target = User.get(targetId);
        let data: UserEntity;

        data = target && target.user ? target.user.entity : await User.getData(targetId)

        if (!mp.players.exists(player)) return;
        if (!data) return player.notify(player.user.LangString("index.1252e724cce79aad671cedbcd52480f6"), "error")
        if (mp.players.exists(target) && target.user.isAdminNow()) return player.notify(player.user.LangString("index.6dfc4f279cd48643be0ce5d201d9c1cc"), "error");

        const prisonData: IPrisonData = data.prison ? JSON.parse(data.prison) : {
            time: time * 60,
            reason,
            byAdmin: true,
            adminName: `${player.user.name} #${player.user.id}`
        };

        if (prisonData.byAdmin && data.prison) prisonData.time += time * 60;


        if (target && target.user) {
            target.user.prison = prisonData;
            this.sync(target);
        } else {
            data.prison = JSON.stringify(prisonData);
            data.save();
        }

        user.log("AdminJob", langStringDefault("index.b6965918ae3d33488d2c763253b32b37", time, reason), data.id);
        addAdminStats(user.id, "jail")

        const targetName = data.rp_name;

        mp.players.toArray().filter(p => p && p.user && p.user.isAdminNow()).forEach(p => {
            p.outputChatBox(p.user.LangString("index.a6910238babf75fc174ff3647ee1d6da", player.user.name, targetName, targetId, time, reason));
        })
    }


    public async unjail(player: PlayerMp, targetId: number) {
        let target = User.get(targetId);

        if (!mp.players.exists(player)) return;
        if (!target || !target.user)
            return player.notify(player.user.LangString("index.a467ce39a86d72585cd99dcd54273286"), "error");

        if (!target.user.prison)
            return player.notify(player.user.LangString("index.8a2bdbef0b309097b2da2186106d1a45"), "error");

        if (target.user.prison.byAdmin)
            return player.notify(player.user.LangString("index.99e8fb857ac4b99a9899b33d77b6020e"), "error");

        this.free(target);
    }

    public async unjailAdmin(player: PlayerMp, targetId: number) {
        let target = User.get(targetId);
        let data: UserEntity;

        data = target && target.user ? target.user.entity : await User.getData(targetId)

        if (!mp.players.exists(player)) return;
        if (!data) return player.notify(player.user.LangString("index.d69b848756571f48f313d151c0d7055e"), "error");

        if (target && target.user) {
            if (!target.user.prison)
                return player.notify(player.user.LangString("index.f70a7fef5cb5214ee4b12921f2bc30a3"), "error");

            this.free(target);
        } else {
            if (!data.prison) return player.notify(player.user.LangString("index.0dde212a510522af5d6c8361a4b405a7"), "error");
            data.prison = null;
            data.save();
        }
    }

    public playerDeath = (player: PlayerMp) => {
        if (!player || !player.user || !player.user.jailSyncHave) return;

        player.user.spawn(PRISON_HOSPITAL_RESPAWN_POS[Math.floor(Math.random() * PRISON_HOSPITAL_RESPAWN_POS.length)]);
        CustomEvent.triggerClient(player, "prison:hospital:start");
    }

    public removeTime = (player: PlayerMp, time: number) => {
        if (!player.user || !player.user.prison) return;


        CustomEvent.triggerClient(player, "prison:sync:time", time);
    }

    public tasksFinish = (player: PlayerMp, count: number, hash: string) => {
        if (!player.user) return false;
        if (!prison.hashes.has(player.user.id) || prison.hashes.get(player.user.id) !== hash) return false;
        prison.hashes.delete(player.user.id);

        const time = count * TASKS_TIME_DELETE;

        prison.removeTime(player, time);

        return true;
    }

    public playerLeave = (player: PlayerMp) => {
        if (!player || !player.user) return;

        const id = player.user.id;

        if (this.hashes.has(id)) this.hashes.delete(id);
    }
}

export const prison = new Prison();

enterMenu();

CustomEvent.registerClient("prison:sync:time", (player: PlayerMp, time: number) => {
    if (!player.user) return;

    if (time <= 0) {
        prison.free(player);
    } else {
        const data = {...player.user.prison};

        data.time = time;

        player.user.prison = data;
    }
})

CustomEvent.registerClient("prison:runaway", (player: PlayerMp, prisonData: IPrisonData) => {
    const data = {...player.user.prison};

    data.time = prisonData.time + PRISON_MINUTES_FOR_RUN * 60;

    player.notify(player.user.LangString("index.255fe573320ef7a76a38b8f60d534d32", PRISON_MINUTES_FOR_RUN));

    player.user.prison = data;

    prison.sync(player);
});

CustomEvent.registerClient("prison:tasks:finish", prison.tasksFinish);

mp.events.add("playerDeath", prison.playerDeath);
mp.events.add("playerQuit", prison.playerLeave);