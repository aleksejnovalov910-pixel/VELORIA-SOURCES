import { langStringDefault } from "../../../../shared/lang";
import "./hiring";
import "./sort";
import {SanitationSquad} from "./squad";
import {CustomEvent} from "../../custom.event";
import {ILobbyDTO} from "../../../../shared/jobs/sanitation/dto";


class Sanitation {
    private squads: Map<number, SanitationSquad> = new Map<number, SanitationSquad>();
    private vehicle: VehicleMp;

    constructor() {
        CustomEvent.register("sanitation:deleteSquad", this.deleteSquadHandler);

        CustomEvent.registerCef("sanitation:createSquad", this.createSquadHandler);
        CustomEvent.registerCef("sanitation:joinSquad", this.joinSquadHandler);
        CustomEvent.registerCef("sanitation:leaveSquad", this.leaveSquadHandler);

        CustomEvent.registerCef("sanitation:getSessions", this.getSessionsHandler);

        setInterval(this.intervalHandler, 10000);
    }

    private getSessionsHandler = (player: PlayerMp) => {
        CustomEvent.triggerCef(player, "sanitation:setComponent", "sessions");

        const lobbies: ILobbyDTO[] = [];

        this.squads.forEach((el, key) => {
            if (el.membersLength() >= 2) return;

            lobbies.push({
                id: key,
                name: el.name,
                isPublic: el.password === null
            })
        })

        CustomEvent.triggerCef(player, "sanitation:setSessions", lobbies)
    }

    private createSquadHandler = (player: PlayerMp, isPublic: boolean) => {
        const id = this.getIdForSquad();
        this.squads.set(id, new SanitationSquad(player, isPublic, id))
        this.openMyLobby(player, id)
    }

    private deleteSquadHandler = (id: number) => {
        if (!this.squads.has(id)) return;
        this.squads.delete(id);
    }

    private joinSquadHandler = (player: PlayerMp, squadId: number, password: string) => {
        if (player.user.sanitationSquad)
            return player.notify(player.user.LangString("index.5ddfe640b083df8be6c97bedcb4fede3"), "error");

        if (!this.squads.has(squadId))
            return player.notify(player.user.LangString("index.eccf4a70ca453aa86a297a4d44d5df10"), "error");

        if (this.squads.get(squadId).password !== password)
            return player.notify(player.user.LangString("index.a0767144ca3b21162de9178566663e42"), "error");

        this.squads.get(squadId).addPlayer(player);
        this.openMyLobby(player);
    }

    private leaveSquadHandler = (player: PlayerMp) => {
        if (!player.user.sanitationSquad)
            return player.notify(player.user.LangString("index.dbb360fe7abb240f12b308f4113e6f68"), "error");

        if (!this.squads.has(player.user.sanitationSquad))
            return player.notify(player.user.LangString("index.9ff82db37bc280827daa648a4a50b0b8"), "error");

        this.squads.get(player.user.sanitationSquad).removePlayer(player);
        CustomEvent.triggerCef(player, "sanitation:setComponent", "enter");
    }

    private getIdForSquad() {
        if (this.squads.size === 0) return 1;
        return [...this.squads][this.squads.size - 1][0] + 1
    }

    private openMyLobby(player: PlayerMp, id?: number) {
        if (!id) id = player.user.sanitationSquad;
        if (!this.squads.has(id)) return;

        const mySquad = this.squads.get(id);
        CustomEvent.triggerCef(player, "sanitation:setComponent", "yourSession");
        CustomEvent.triggerCef(player, "sanitation:setMyLobby", {
            id,
            players: mySquad.getPlayersNames(),
            ownerName: mySquad.name
        });
    }

    private intervalHandler = () => {
        this.squads.forEach(el => el.intervalHandler());
    }

    public openInterface(player: PlayerMp) {
        if (!player.user) return;

        player.user.setGui(langStringDefault("index.ce96a20202acd257cf26ac63eabadaac"));
        if (player.user.sanitationSquad) {
            this.openMyLobby(player);
        } else {
            CustomEvent.triggerCef(player, "sanitation:setComponent", "enter");
        }
    }
}


export const sanitation = new Sanitation();