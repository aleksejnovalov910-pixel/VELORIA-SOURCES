import { LangString, langStringDefault } from "../../lang";
import {CustomEvent} from "../../custom.event";
import {
    ADD_EXP,
    ELECTRICIAN_LEVELS,
    GameComponent,
    HOME_WORK_POSITIONS,
    LARGE_WORK_POSITIONS,
    STATION_WORK_POSITIONS, VEHICLE_SPAWN_BLIP,
    WORK_TYPE,
    WorkState
} from "../../../../shared/jobs/electrician/config";
import {colshapeHandle, colshapes} from "../../checkpoints";
import {gui} from "../../gui";
import {user} from "../../user";

let state: WorkState = {
    active: false
};

let spawnVehicleMarker: null | MarkerMp,
    spawnVehicleBlip: null | BlipMp,
    vehicleID: number = null;

function CreateActivePoint(type: WORK_TYPE, status: number): colshapeHandle {
    let arr: Vector3Mp[],
        game: GameComponent;

    if (type === WORK_TYPE.station) {
        arr = STATION_WORK_POSITIONS;
        game = "wires";
    }else if (type === WORK_TYPE.houses) {
        arr = HOME_WORK_POSITIONS
        game = "insulator";
    }else if (type === WORK_TYPE.large) {
        arr = LARGE_WORK_POSITIONS;
        game = "diagram";
    }

    return colshapes.new(arr[status], LangString("job.dc9e7042567968bf2cc5ff61f70dcd0b"), () => {
        OpenGame(game);
    }, {});
}

function CreateActiveBlip(type: WORK_TYPE, status: number): BlipMp {
    let arr: Vector3Mp[];

    if (type === WORK_TYPE.station) {
        arr = STATION_WORK_POSITIONS;
    }else if (type === WORK_TYPE.houses) {
        arr = HOME_WORK_POSITIONS
    }else if (type === WORK_TYPE.large) {
        arr = LARGE_WORK_POSITIONS;
    }

    const Blip = mp.blips.new(1, arr[status], {
        name: LangString("job.23a8b477b7e8f2c60adc90be193f8495"),
        scale: 0.75,
        color: 73
    })

    mp.game.invoke("0x4F7D8A9BFB0B43E9", Blip.handle, true);
    return Blip;
}

function OpenGame(component: GameComponent) {
    gui.setGui("electriciangames");
    CustomEvent.triggerCef("electricianGames:setComponent", component);
}

mp.events.add("electrician:gameComplete", (success: boolean) => {
    let arr: Vector3Mp[];

    if (state.type === WORK_TYPE.station) {
        arr = STATION_WORK_POSITIONS;
    } else if (state.type === WORK_TYPE.houses) {
        arr = HOME_WORK_POSITIONS;
    } else if (state.type === WORK_TYPE.large) {
        arr = LARGE_WORK_POSITIONS;
    }

    if (success) {
        // avansează ținta următoare
        if (state.type === WORK_TYPE.station) {
            state.status = (state.status + 1) % arr.length; // secvențial
        } else {
            state.status = Math.floor(Math.random() * arr.length); // aleator
        }

        // curăță markerul/blipul vechi
        state.activePoint.destroy();
        state.blip.destroy();

        // progres către EXP
        state.forEXP += 1;

        if (state.forEXP >= ADD_EXP) {
            state.forEXP = 0;
            CustomEvent.triggerServer("electrician:addExp");
            user.notify("Ai primit +1 EXP pentru munca depusa!");
        } else {
            const remaining = ADD_EXP - state.forEXP;
            user.notify(`Mai ai de terminat ${remaining} punct(e) pana primesti 1 EXP!`);
        }

        // creează următorul punct/blip
        state.activePoint = CreateActivePoint(state.type, state.status);
        state.blip = CreateActiveBlip(state.type, state.status);

        // plata + mesaj “mergi la următorul”
        CustomEvent.triggerServer("electrician:payment", state.sca);
        user.notify("Ai terminat punctul! mergi la urmatorul!");
    } else {
        user.notify("Ai fost electrocutat! ai pierdut 10 HP!");
        CustomEvent.triggerServer("electrician:damage");
    }
});


mp.events.add("playerEnterVehicle", (vehicle, seat) => {
    if (
        !vehicle.getVariable("electrician")
        || vehicle.getVariable("electrician") !== user.id
        || !vehicleID
        || vehicle.remoteId !== vehicleID
        || !spawnVehicleBlip
        || !spawnVehicleMarker
    ) return;

    spawnVehicleMarker.destroy();
    spawnVehicleBlip.destroy();

    vehicleID = null;
    spawnVehicleMarker = undefined;
    spawnVehicleBlip = undefined;
})

CustomEvent.registerServer("electrician:start", (type: WORK_TYPE, sca: string, vehID?: number, vehPos?: Vector3Mp) => {

    if (vehID && vehPos) {
        vehPos.z += 3;

        vehicleID = vehID
        spawnVehicleMarker = mp.markers.new(0, vehPos, 1, {
            color: [202, 0, 42, 255]
        });

        spawnVehicleBlip = mp.blips.new(VEHICLE_SPAWN_BLIP.sprite, vehPos, {
            color: VEHICLE_SPAWN_BLIP.color,
            name: VEHICLE_SPAWN_BLIP.name
        })

        user.notify("Dein Arbeitstransport wartet schon auf dich");
    }

    let arr;

    if (type === WORK_TYPE.station) {
        arr = STATION_WORK_POSITIONS
    }else if (type === WORK_TYPE.houses) {
        arr = HOME_WORK_POSITIONS
    }else if (type === WORK_TYPE.large) {
        arr = LARGE_WORK_POSITIONS
    }

    let status;

    if (state.type === WORK_TYPE.station) {
        status = 0;
    }else{
        status = Math.floor(Math.random()*arr.length);
    }

    state = {
        active: true,
        type,
        status: 0,
        activePoint: CreateActivePoint(type, status),
        blip: CreateActiveBlip(type, status),
        forEXP: 0,
        sca
    }
});

CustomEvent.registerServer("electrician:openEmployer", (exp: number) => {
    const type: WORK_TYPE | null = state.active === false ? null : state.type;
    gui.setGui("electrician");
    CustomEvent.triggerCef("electrician:employerLoad", exp, type);
});

mp.events.add("electrician:finish", () => {
    if (spawnVehicleMarker && spawnVehicleBlip && vehicleID) {
        spawnVehicleMarker.destroy();
        spawnVehicleBlip.destroy();
        vehicleID = null;
        spawnVehicleMarker = undefined;
        spawnVehicleBlip = undefined;
    }

    state.activePoint.destroy();
    state.blip.destroy();

    state = {
        active: false
    }

    CustomEvent.triggerServer("electrician:finishWork");
});