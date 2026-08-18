import { langStringDefault } from "../../../shared/lang";
import {
    ISupplyWar, ISupplyWarFraction, ISupplyWarItem, SUPPLY_WAR_ALLOW_FRACTIONS, SUPPLY_WAR_ALLOW_VEHICLE_MODELS,
    SUPPLY_WAR_BLIP_COLOR,
    SUPPLY_WAR_BLIP_NAME,
    SUPPLY_WAR_BLIP_SCALE,
    SUPPLY_WAR_BLIP_SPRITE, SUPPLY_WAR_INTERACTION_MESSAGE, SUPPLY_WAR_INTERACTION_OPTIONS,
    SUPPLY_WAR_PREPARATION_TIME,
    SUPPLY_WAR_STEP
} from "../../../shared/supplyWar/config";
import {colshapeHandle, colshapes} from "../checkpoints";
import {fractionChest} from "../chest";
import {CustomEvent} from "../custom.event";
import {system} from "../system";

export class SupplyWar implements ISupplyWar {
    step: SUPPLY_WAR_STEP = SUPPLY_WAR_STEP.PREPARATION
    private _interaction: colshapeHandle
    protected _blip: BlipMp
    private readonly _pos: Vector3Mp
    private _timeout: number = null
    private vehiclesLoaded: number = 0
    private readonly maxVehiclesLoad: number
    private readonly _allowVehicleModels: string[] = SUPPLY_WAR_ALLOW_VEHICLE_MODELS;
    private readonly fractions: ISupplyWarFraction[] = SUPPLY_WAR_ALLOW_FRACTIONS;
    protected _cargoItems: ISupplyWarItem[];
    private fractionsInteractions: colshapeHandle[] = [];

    constructor(position: Vector3Mp, maxVehiclesLoad: number, items: ISupplyWarItem[]) {

        this._cargoItems = items;
        this.maxVehiclesLoad = maxVehiclesLoad + 1;
        this.createFractionsInteractions();

        this._pos = new mp.Vector3(
            position.x,
            position.y,
            position.z - 1
        );

        this._blip = mp.blips.new(
            SUPPLY_WAR_BLIP_SPRITE,
            this._pos,
            {
                color: SUPPLY_WAR_BLIP_COLOR,
                dimension: 0,
                scale: SUPPLY_WAR_BLIP_SCALE,
                shortRange: true,
                name: SUPPLY_WAR_BLIP_NAME
            }
        );

        this._timeout = setTimeout(
            this.setProcessStep,
            SUPPLY_WAR_PREPARATION_TIME * 1000
        );

        mp.events.add("supplyWar:finishLoading", this.finishLoadingHandler);
    }

    private createFractionsInteractions() {
        this.fractions.forEach(el => {
            const shape = colshapes.new(
                el.position,
                player => player?.user?.LangString("supplyWar.d893e840deacb28df51d8bcf4a93ac9e") ?? langStringDefault("supplyWar.d893e840deacb28df51d8bcf4a93ac9e"),
                (player: PlayerMp) => {
                    if (!player.vehicle)
                        return player.notify(player.user.LangString("supplyWar.74897df355ad4c224ba73f82ec1958b4"), "error");

                    if (!player.vehicle.fraction || player.vehicle.fraction !== el.id)
                        return player.notify(player.user.LangString("supplyWar.7173d30ad9af80f76539b3752941b430"), "error");

                    if (!player.vehicle.supplyWarCargo)
                        return player.notify(player.user.LangString("supplyWar.0468fc0f6ebf29d1a3e868ce32a7971f"), "error");

                    const cargo = [...player.vehicle.supplyWarCargo],
                        chest = fractionChest.getByFraction(el.id);

                    if (!chest[0]) return;


                    cargo.forEach(el => {
                        chest[0].addItem(el.itemId, el.count)
                    })

                    player.vehicle.supplyWarCargo = undefined;
                    player.notify(player.user.LangString("supplyWar.a73df2479a7c6fdfc5d045e7c5992e81"), "success");
                },
                SUPPLY_WAR_INTERACTION_OPTIONS
            )

            this.fractionsInteractions.push(shape);
        })
    }

    private loadingHandle = (player: PlayerMp): void => {
        console.log(this.vehiclesLoaded)
        if (!player.user) return;

        if (!player.vehicle)
            return player.notify(player.user.LangString("supplyWar.39d0f3aaf566545ea363331563a53f5f"), "error");

        if (this.vehiclesLoaded >= this.maxVehiclesLoad)
            return player.notify(player.user.LangString("supplyWar.12d63ada1437a691a89861ebe405b879"), "warning");

        if (!player.vehicle.fraction || this.fractions.find(el => player.vehicle.fraction === el.id) === undefined)
            return player.notify(player.user.LangString("supplyWar.73b15a19c00a296f85ce83e55bc2015d"), "error");

        if (!player.vehicle.modelname || this._allowVehicleModels.find(el => player.vehicle.modelname === el) === undefined)
            return player.notify(player.user.LangString("supplyWar.5d4b5677863befebacf41d61f3995f59"), "error");

        if (player.vehicle.supplyWarCargo)
            return player.notify(player.user.LangString("supplyWar.34bf3b93239be93629d171ebc4ab00e6"), "error");

        CustomEvent.triggerClient(player, "supplyWar:startLoading", player.vehicle.id);
    }

    private finishLoadingHandler = (player: PlayerMp, vehId: number): void => {
        if (!player.user) return;

        if (!player.vehicle)
            return player.notify(player.user.LangString("supplyWar.86eff934789c21f28094da559b379f90"), "error");

        if (this.vehiclesLoaded >= this.maxVehiclesLoad)
            return player.notify(player.user.LangString("supplyWar.63586f3426fcbc4e3a05543296056eab"), "warning");

        if (player.vehicle.id !== vehId) return player.notify(player.user.LangString("supplyWar.66700519dd3884f4d55aed375fb08220"));

        if (system.distanceToPos(player.position, this._pos) > 3.5)
            return player.notify(player.user.LangString("supplyWar.ef70e21f9d9eafb02123722d0f7992d8"), "error");



        this.vehiclesLoaded += 1;
        player.vehicle.supplyWarCargo = this._cargoItems;
        player.notify(player.user.LangString("supplyWar.7055352e60e2f5761c589f7870dd2fb5"), "success");

    }

    private setProcessStep = (): void => {
        if (this.step !== SUPPLY_WAR_STEP.PREPARATION) return;
        this._timeout = null;
        this.step = SUPPLY_WAR_STEP.PROCESS;

        this._interaction = colshapes.new(
            this._pos,
            SUPPLY_WAR_INTERACTION_MESSAGE,
            this.loadingHandle,
            SUPPLY_WAR_INTERACTION_OPTIONS
        );

        mp.players.forEach(p => {
            if (!p.user) return;
            if (p.user.fraction === 0) return;
            if (!this.fractionExistInList(p.user.fraction)) return;

            p.notify(p.user.LangString("supplyWar.9aafa14903e461acf8e66a643895a5b9"), "info");
        })
    }

    private fractionExistInList(fractionId: number) {
        return this.fractions.find(el => el.id === fractionId) !== undefined
    }


    public destroy = (): void => {
        if (this._timeout !== null) clearTimeout(this._timeout)
        if (this._interaction && this._interaction.exists) this._interaction.destroy()
        this.fractionsInteractions.forEach(el => {
            if (el.exists) el.destroy();
        })
        if (mp.blips.exists(this._blip)) this._blip.destroy();
        mp.events.remove("supplyWar:finishLoading", this.finishLoadingHandler);
    }
}