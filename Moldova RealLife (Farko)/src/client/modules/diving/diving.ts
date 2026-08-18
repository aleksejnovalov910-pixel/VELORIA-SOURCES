import { LangString, langStringDefault } from "../lang";
import {CustomEvent} from "../custom.event";
import {gui} from "../gui";
import {DiveManager} from "./diveManager";
import {DEFAULT_CHESTS, MAP_CHESTS} from "../../../shared/diving/chests.config";
import {user} from "../user";
import {colshapes} from "../checkpoints";
import {CHEST_PROP} from "../../../shared/diving/work.config";
import {system} from "../system";

CustomEvent.registerServer("diving:debug:chests", () => {
    DEFAULT_CHESTS.map(el => {
        colshapes.new(
            new mp.Vector3(
                el.chestData.position.x,
                el.chestData.position.y,
                el.chestData.position.z - 1),
            LangString("diving.90c42d98596e19cf0ade7e1064ba1306"),
            () => {},
            {
                color: [255, 0, 0, 255],
                radius: 2.5
            }
        );

        mp.objects.new(CHEST_PROP, el.chestData.position, {
            rotation: el.chestData.rotation
        })

        system.createBlip(
            351,
            6,
            el.chestData.position,
            LangString("diving.fdbb1ae066cc7a343145637c239d9a42"),
            0,
            true
        )
    });
})

export class Diving {
    private isWorking: boolean = false;
    private diveManager: DiveManager | null;
    private interval: number;

    constructor() {
        mp.events.add("diving:switcher", () => this.switcherHandle());

        CustomEvent.registerServer("diving:openEmployer", () => {
            gui.setGui("divingEmployer");
            CustomEvent.triggerCef("divingEmployer:setIsWorking", this.isWorking);
        })
        CustomEvent.registerServer("diving:nextCheckpoint", (nextLocation) => {
            if (!this.isWorking) return;

            // Distruge checkpointul vechi dacă există
            if (this.diveManager) {
                this.diveManager.destroy();
                this.diveManager = undefined;
            }

            // Creează noul checkpoint cu locația primită
            this.diveManager = new DiveManager(nextLocation);
            user.notify("Urmatoarea locatie de scufundare a fost setata!", "info");
            if (this.diveManager) this.diveManager.dive();
        });

        CustomEvent.registerServer("diving:createMission", () => this.createMissionHandle());

        CustomEvent.registerServer("diving:useMap", (item_id: number) => {
            if (!this.isWorking) return user.notify(LangString("diving.63a05a572cdf6f16826f5cb0255c0255"), "error");
            if (this.diveManager) return user.notify(LangString("diving.668577f3a9655abb5d3ad2055362f385"), "error");

            this.diveManager = new DiveManager(MAP_CHESTS[Math.floor(Math.random() * MAP_CHESTS.length)]);
            CustomEvent.triggerServer("diving:deleteMapItem", item_id);
        });

        mp.events.add("diving:clearDiveManager", () => {
            this.diveManager = undefined;
        });

        mp.events.add("diving:unfreeze", () => {
            mp.players.local.freezePosition(false);
        });

        mp.events.add("diving:startDive", () => {
            if (this.diveManager) this.diveManager.dive();
        });
        mp.events.add("diving:chestGame:finish", (success) => {
            if (this.diveManager) this.diveManager.chestGameFinishHandle(success);
        });
        mp.events.add("diving:collectGame:finish", () => {
            if (this.diveManager) this.diveManager.collectGameFinishHandle();
        });
    }

    private switcherHandle() {
        this.isWorking ? this.onFinish() : this.onStart();
    }

    private onStart() {
        user.notify(LangString("diving.de902d609e47565ade5154e4f20c191a"), "info");
        this.isWorking = true;
        CustomEvent.triggerServer("diving:canCreateChest");
        this.interval = setInterval(() => {
            if (!this.diveManager) CustomEvent.triggerServer("diving:canCreateChest");
        }, 60000);
    }

    private onFinish() {
        user.notify(LangString("diving.39d42ed64c1450e0d47e247bd08f67d9"), "info");
        clearInterval(this.interval);
        try {
            if (this.diveManager) this.diveManager.destroy();
            clearInterval(this.diveManager._interval);
            this.diveManager = undefined;
        }
        catch (e) {
            CustomEvent.triggerServer("srv:log", e);
        }
        this.isWorking = false;
    }

    private createMissionHandle() {
        if (!this.isWorking) return;
        if (this.diveManager) return;

        this.diveManager = new DiveManager(DEFAULT_CHESTS[Math.floor(Math.random() * DEFAULT_CHESTS.length)]);
    }
}