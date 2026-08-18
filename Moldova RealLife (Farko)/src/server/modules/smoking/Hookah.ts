import { langStringDefault } from "../../../shared/lang";
import {ItemEntity} from "../typeorm/entities/inventory";
import {colshapeHandle, colshapes} from "../checkpoints";
import {MAX_PUFFS, PROP_NAME, PUFFS_IN_ONE_FILL} from "../../../shared/smoking/hookah";
import {inventory} from "../inventory";
import {OWNER_TYPES} from "../../../shared/inventory";
import {HOOKAH_CHARCOAL, HOOKAH_ITEM_ID, HOOKAH_TOBACCO} from "../../../shared/smoking/items";
import {MenuClass} from "../menu";
import {CustomEvent} from "../custom.event";
import {system} from "../system";

export class Hookah {

    position: Vector3Mp
    dimension: number
    ownerId: number

    prop: ObjectMp
    interaction: colshapeHandle
    puffs: number = 0


    constructor(owner: PlayerMp, item: ItemEntity) {
        this.position = new mp.Vector3(
            owner.position.x,
            owner.position.y,
            owner.position.z - 1
        );

        this.dimension = owner.dimension;
        this.ownerId = owner.user.id;

        this.puffs = item.advancedNumber;

        inventory.deleteItem(item, OWNER_TYPES.PLAYER, owner.user.id, true);

        this.prop = mp.objects.new(
            mp.joaat(PROP_NAME),
            this.position,
            {
                dimension: this.dimension
            }
        );

        this.interaction = colshapes.new(this.position, player => player?.user?.LangString("Hookah.ad4bf74f5e1152de3330069c41f326e0") ?? langStringDefault("Hookah.ad4bf74f5e1152de3330069c41f326e0"), this.interactionHandler, {
            dimension: this.dimension,
            radius: 1.5,
            type: -1
        })
    }

    interactionHandler = (player: PlayerMp) => {
        const menu = new MenuClass(player, player.user.LangString("Hookah.6cc4137f36b436be5c8b22d84132d65e"));

        menu.newItem({
            name: langStringDefault("Hookah.759da44da8c3593fda200ad9ebff10ff"),
            onpress: () => {
                this.use(player)
            }
        })

        menu.newItem({
            name: langStringDefault("Hookah.e9d3f4d2a778d9b9ce1cee8b3e93ab17"),
            more: `${this.puffs}`,
            onpress: () => {
                this.fill(player);
            }
        })

        if (player.user.isAdminNow() || player.user.id === this.ownerId) {
            menu.newItem({
                name: langStringDefault("Hookah.c9167a3c48399079052932ed30be41da"),
                onpress: () => {
                    this.remove(player);
                }
            })
        }

        menu.open();
    }

    use (player: PlayerMp) {
        if (system.timestamp - player.user.lastSmoke < 5)
            return player.notify(player.user.LangString("Hookah.85e5a1088077db8959378ae6e0a06ab3"), "error");

        if (this.puffs === 0)
            return player.notify(player.user.LangString("Hookah.f3e06cd34826faa79bd26bca4da47784"));
        this.puffs -= 1;

        player.user.lastSmoke = system.timestamp;
        CustomEvent.triggerClient(player, "smoking:useHookah");
    }

    fill (player: PlayerMp) {
        if (this.puffs + PUFFS_IN_ONE_FILL > MAX_PUFFS)
            return player.notify(player.user.LangString("Hookah.aed947f2e71648f7ddabe78bc9f3812a"), "error");

        const items: ItemEntity[] = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id);

        const charcoal: boolean = items.find(el => el.item_id === HOOKAH_CHARCOAL) !== undefined;

        if (!charcoal)
            return player.notify(player.user.LangString("Hookah.d18d730140ebc637c2be5f2ab70de431"), "error");

        const tobacco = items.find(el => HOOKAH_TOBACCO.includes(el.item_id));

        if (!tobacco)
            return player.notify(player.user.LangString("Hookah.7366ace2a9d4076cfc77e839b64fa388"), "error");

        inventory.deleteItemsById(player, tobacco.item_id, 1);
        inventory.deleteItemsById(player, HOOKAH_CHARCOAL, 1);

        this.puffs += PUFFS_IN_ONE_FILL;
        player.notify(player.user.LangString("Hookah.a03090d5a7621a43a2232f2f397547ca"), "success");
    }

    remove(player: PlayerMp) {
        if (player.user.id !== this.ownerId && !player.user.isAdminNow())
            return player.notify(player.user.LangString("Hookah.0c5c043b59eeb93ee64e1685cfca57fc"), "error");

        this.interaction.destroy();
        this.prop.destroy();

        inventory.createItem({
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: player.user.id,
            item_id: HOOKAH_ITEM_ID,
            advancedNumber: this.puffs
        })
    }
}