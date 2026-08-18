import { langStringDefault } from "../../../shared/lang";
import {ISirenPlace} from "../../../shared/siren/ISirenPlace";
import {MenuClass} from "../menu";
import {colshapeHandle, colshapes} from "../checkpoints";
import {CustomEvent} from "../custom.event";
import {Dispatch} from "../dispatch";
import {system} from "../system";
import {ISirenHistory} from "./ISirenHistory";

export class Siren {
    private config: ISirenPlace;
    private readonly shape: ColshapeMp;
    private readonly remote: colshapeHandle;
    private active: boolean = false;
    private lastStart: number = 0;
    private history: ISirenHistory[] = []

    constructor(sirenPlace: ISirenPlace) {
        this.config = sirenPlace;

        this.shape = mp.colshapes.newSphere(
            this.config.position.x,
            this.config.position.y,
            this.config.position.z,
            this.config.range,
            this.config.dimension
        );

        this.remote = colshapes.new(
            this.config.remote,
            player => player?.user?.LangString("Siren.9147857181d723a72748606aa207c13d") ?? langStringDefault("Siren.9147857181d723a72748606aa207c13d"),
            (player: PlayerMp) => {
                if (!player.user || !this.config.fractionIds.includes(player.user.fraction))
                    return player.notify(player.user.LangString("Siren.20bf217315d04575b4dcfc8a7169a92e"));
                this.openSirenMenu(player)
            }
        )

        mp.events.add("playerEnterColshape", this.playerEnter);
        mp.events.add("playerExitColshape", this.playerExit);
    }

    private startInterval = () => {
        const interval = setInterval(() => {
            if (this.active && system.timestamp - this.lastStart > this.config.time * 60) {
                this.disable();
                clearInterval(interval);
            }
        }, 5000);
    }

    public enable() {
        this.active = true;

        mp.players.forEachInRange(this.config.position, this.config.range + 500, (player) => {
            if (!this.shape.isPointWithin(player.position)) return;
            CustomEvent.triggerCef(
                player,
                "sound:play",
                "raid-siren",
                "raid-siren",
            );
        });
    }

    public disable() {
        this.active = false;

        mp.players.forEachInRange(this.config.position, this.config.range + 500, (player) => {
            if (!this.shape.isPointWithin(player.position)) return;
            CustomEvent.triggerCef(
                player,
                "sound:stop",
                "raid-siren"
            );
        });
    }


    private playerEnter = (player: PlayerMp, shape: ColshapeMp) => {
        if (!this.active) return;
        if (shape !== this.shape) return;

        CustomEvent.triggerCef(
            player,
            "sound:play",
            "raid-siren",
            "raid-siren",
        );
    }

    private playerExit = (player: PlayerMp, shape: ColshapeMp) => {
        if (!this.active) return;
        if (shape !== this.shape) return;
        CustomEvent.triggerCef(
            player,
            "sound:stop",
            "raid-siren"
        );
    }

    private openSirenMenu = (player: PlayerMp) => {
        const _menu = new MenuClass(player, player.user.LangString("Siren.0a73b11a1bcebced6ee0482f33cbce9d"), this.config.name);


        _menu.newItem({
            name: this.active ? langStringDefault("Siren.e4b73d5e820d54e271e0588eab4421ab") : langStringDefault("Siren.0fc7e31b22649941a2745db7c3e84f15"),
            desc: langStringDefault("Siren.c367524a6d1d024ecfbc1ea4480738eb"),
            onpress: () => {
                if (!this.active && system.timestamp - this.lastStart < this.config.turnOnFrequency * 60)
                    return player.notify(player.user.LangString("Siren.d659e2a3bc3093a36109873eccc6b042", this.config.turnOnFrequency), "error");
                if (!this.active) {
                    this.lastStart = system.timestamp;
                    this.startInterval();
                    if (this.config.dispatchFractionIds) {
                        Dispatch.new(
                            this.config.dispatchFractionIds,
                            langStringDefault("Siren.8058d68b4e7202e9f76d0457cd8f42c8", this.config.name),
                            {x: this.config.remote.x, y: this.config.remote.y}
                        );
                    }

                    this.history.unshift({
                        id: player.user.id,
                        name: player.user.name,
                        time: system.timestamp
                    })
                }

                player.notify(player.user.LangString("Siren.a9c71e40f16a65a95bd3fc2ebf7db049", this.active ? player.user.LangString("Siren.efa79a52abf2772a7c1f8c3120c45e9f") : player.user.LangString("Siren.2e74c818940fcc18372f0c351c05a0d1")));
                this.active ? this.disable() : this.enable();
                _menu.close();
            }
        })

        _menu.newItem({
            name: langStringDefault("Siren.261b9a178055252ccb17a5747855e826"),
            desc: langStringDefault("Siren.c3f586e8ef83cb8244b10771d40f8f11"),
            onpress: () => {
                const submenu = new MenuClass(player, player.user.LangString("Siren.fb25bb98a2868f11c14f7bdb2774cf26"), this.config.name);

                this.history.forEach(el => {
                    submenu.newItem({
                        name: `${system.timeStampString(el.time)}`,
                        desc: `${el.name} [${el.id}]`
                    })
                })

                submenu.open();
            }
        })

        _menu.open();
    }
}
