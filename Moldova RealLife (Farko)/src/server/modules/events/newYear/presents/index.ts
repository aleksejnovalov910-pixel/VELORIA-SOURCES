import { langStringDefault } from "../../../../../shared/lang";
import {
    COLLECT_PRESENT_ANIM, MAX_LOLLIPOPS_IN_PRESENT,
    Present,
    PRESENT_PROP_NAME,
    PRESENTS_COORDS,
    PRESENTS_SPAWN_COUNT, PRESENTS_START_TEXT, PRESENTS_STOP_TEXT
} from "../../../../../shared/events/newYear/presents.config";
import {colshapes} from "../../../checkpoints";
import {system} from "../../../system";

export class Presents {
    public active: boolean = false;
    private presentsList: Present[] = [];
    private lastSwitch: number = 0;

    public switcher(player: PlayerMp): void {
        if (system.timestamp - this.lastSwitch < 10)
            return player.notify(player.user.LangString("index.58d19a1b0154f3f3616f9bc205aec484"), "error");

        this.lastSwitch = system.timestamp;

        this.active ? this.stop() : this.start();
        player.notify(player.user.LangString("index.5242796a80feba89c46d63e246b1c100", this.active ? player.user.LangString("index.d876bfd08e5b83cc9c24fb766d0d9f09") : player.user.LangString("index.f1c0e313e5d82e0e2ca8dfe51c081af0")), "info");
    }

    private start(): void {
        this.active = true;

        mp.players.forEach((p) => {
            p.outputChatBox(PRESENTS_START_TEXT);
        });

        const coords = PRESENTS_COORDS[Math.floor(Math.random() * PRESENTS_COORDS.length)];

        coords.forEach((el, index) => this.presentsList.push(this.createPresent(index, el)));
    }

    private stop(): void {
        this.active = false;

        mp.players.forEach((p) => {
            p.outputChatBox(PRESENTS_STOP_TEXT);
        });

        this.presentsList.forEach((item) => {
            const obj = item.ObjectEntity;
            if (mp.objects.exists(obj)) obj.destroy();
           item.InteractionEntity.destroy();
        });

        this.presentsList = [];
    }

    private presentInteractionHandle(player: PlayerMp, id: number) {
        player.user.playAnimation([[COLLECT_PRESENT_ANIM.dictionary, COLLECT_PRESENT_ANIM.name]]);
        this.finishInteraction(player, id)
    }

    private createPresent(id: number, pos: Vector3Mp): Present {
        return {
            id,
            InteractionEntity: colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z - 1), player => player?.user?.LangString("index.82f577bfa680226f7e46897485ca0c52") ?? langStringDefault("index.82f577bfa680226f7e46897485ca0c52"),
                (player) => this.presentInteractionHandle(player, id),
                {color: [0, 0, 0, 0], radius: 2.5}),

            ObjectEntity: mp.objects.new(mp.joaat(PRESENT_PROP_NAME), new mp.Vector3(pos.x, pos.y, pos.z - 1))
        }
    }

    private finishInteraction(player: PlayerMp, id: number) {
        const index = this.presentsList.findIndex(item => item.id === id);

        if (index === -1) return player.notify(player.user.LangString("index.89c1aa4e9d63ee53ae573dd2ad1dbce2"), "error");

        const obj = this.presentsList[index].ObjectEntity;

        if (mp.objects.exists(obj)) obj.destroy();

        this.presentsList[index].InteractionEntity.destroy();

        this.presentsList.splice(index, 1);

        const lollipops = system.getRandomInt(1, MAX_LOLLIPOPS_IN_PRESENT);

        player.notify(player.user.LangString("index.830121d74e9052c0374fae845aa38eb0", lollipops));
        player.user.log("lollipops", langStringDefault("index.14ddb8f7ef6243813e69a7e26aa704e3", lollipops));
        if (player.user.admin_level && player.user.admin_level > 0)
            player.user.log("AdminJob", langStringDefault("index.b0eb221ac2d1e157f0cb520aefc83174", player.user.isAdminNow(1) ? langStringDefault("index.00393b94ad704d1fe5219671b6ba3eff") : langStringDefault("index.5050ce9ff434770a7c9bc31f5308b700")));
        player.user.giveLollipops(lollipops);
    }


}
