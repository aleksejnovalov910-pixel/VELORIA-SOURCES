import { CustomEvent } from "./custom.event";

const player = mp.players.local;

CustomEvent.register("cef:getVehicleSpecs", (model: string) => {

    // @ts-ignore
    const speed = Number((mp.game.vehicle.getVehicleModelMaxSpeed(mp.game.joaat(model)) * 3.6).toFixed());
    // @ts-ignore
    const traction = Number(mp.game.vehicle.getModelMaxTraction(mp.game.joaat(model)).toFixed(2));
    const acceleration = Number(mp.game.vehicle.getVehicleModelAcceleration(mp.game.joaat(model)).toFixed(2));
    const braking = Number(mp.game.vehicle.getVehicleModelMaxBraking(mp.game.joaat(model)).toFixed(2));

    const specs = {
        speed,
        traction,
        acceleration,
        braking
    };
    mp.console.logInfo(JSON.stringify(specs));
    return specs;
});


