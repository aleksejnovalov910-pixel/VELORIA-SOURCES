import { CustomEvent } from "./custom.event";
import {colshapeHandle, colshapes} from "./checkpoints";

import { ALLOWED_DRUG_FACTIONS, METAPHETAMIN_SPAWN_COORDS, METAPHEMATIN_PROP_NAME, METAPHEMATIN_COLLECTION_TIME, METAPHEMATIN_RESET_TIME_MAX, METAPHEMATIN_RESET_TIME_MIN, DRUG_CULTIVATION_TIME } from "../../shared/drugFarm";
import { ObjectManager } from "modules/houses/furniturePlace/objectManager";
import { ItemEntity } from "./typeorm/entities/inventory";
import { UserAnimation } from "./usermodule/animation";


interface IBarrel {
  id: number;
  object: ObjectMp;
  colshape: colshapeHandle;
}

interface ISeed {
  id: number;
  timeout: NodeJS.Timeout;
  owner: number;

  type: "WEED" | "COCA";
  state: "inprogress" | "done"

  object?: ObjectMp,
  colshape: colshapeHandle;
}

class DrugFarm {
  private cayoPericoColshape: ColshapeMp;

  private seeds: ISeed[];
  private barrels: IBarrel[];

  private lastId = 0;

  public init() {
    this.cayoPericoColshape = mp.colshapes.newTube(5060.68, -5162.07, -50, 2000, 1000);

    this.barrels = [];
    this.seeds = [];

    this.lastId = 0;

    METAPHETAMIN_SPAWN_COORDS.forEach((pos: { x: number, y: number, z: number, h: number }) => {
      this.createBarel(pos);
    })
  }

  private createBarel(pos: { x: number, y: number, z: number, h: number }) {
    const object = this.loadBarrel(pos);
    if (!object) return;

    const colshape = this.createBarrelColshape(pos, this.lastId);
    if (!colshape) return;


    this.barrels.push({
      id: this.lastId,
      object: object,
      colshape: colshape,
    })

    this.lastId++;
  }

  private loadBarrel(pos: { x: number, y: number, z: number, h: number }) {
    const object = mp.objects.new(mp.joaat(METAPHEMATIN_PROP_NAME), new mp.Vector3(pos.x, pos.y, pos.z), {
      dimension: 0,
      alpha: 255,
      rotation: new mp.Vector3(0, 0, pos.h),
    })

    if (!object) return false;

    return object;
  }

  private createBarrelColshape(pos: { x: number, y: number, z: number, h: number }, id: number) {
    const shape = colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z), "Cisterna cu chimicale", async (player: PlayerMp) => {
      if (!player.user.fraction) return;
      if (!ALLOWED_DRUG_FACTIONS.includes(player.user.fraction)) return;

      player.user.playAnimation([["amb@world_human_gardener_plant@male@base", "base"]], false, true);

      setTimeout(() => {
        if (!player.user || !mp.players.exists(player)) return;

        UserAnimation.stopAnimation(player);
        player.stopAnimation();
        const barrel = this.barrels.find((barrel) => barrel.id === id);
        if (!barrel) return;

        player.user.giveItem(40100, false, false, 1);
        this.destroyBarrel(id);
        
        setTimeout(() => {
          this.createBarel(pos);
        }, Math.floor(Math.random() * (METAPHEMATIN_RESET_TIME_MAX - METAPHEMATIN_RESET_TIME_MIN + 1) + METAPHEMATIN_RESET_TIME_MIN));

      }, METAPHEMATIN_COLLECTION_TIME)
    }, {
      radius: 2
    })

    return shape;
  }
  
  private destroyBarrel(id: number) {
    const barrel = this.barrels.find((barrel) => barrel.id === id);
    if (!barrel) return;

    barrel.object && mp.objects.exists(barrel.object) && barrel.object.destroy();
    barrel.colshape && barrel.colshape.exists && barrel.colshape.destroy();

    this.barrels = this.barrels.filter((barrel) => barrel.id !== id);

    return true;
  }

  public async useWeed(player: PlayerMp, item: ItemEntity) {
    const isValid = await this.validation(player);
    if (!isValid) return player.notify("Nu poti planta aceste seminte aici", 'error');

    if (item.item_id != 40103) return false;

    player.user.playAnimation([["amb@world_human_gardener_plant@male@base", "base"]], false, true);

    setTimeout(() => {
      if (!player.user || !mp.players.exists(player)) return;

      UserAnimation.stopAnimation(player);
      player.stopAnimation();

      const id = this.lastId;

      const pos = new mp.Vector3(player.position.x, player.position.y, player.position.z - 1.05);

      const timeout = setTimeout(() => {
        let seed = this.seeds.find((i) => i.id == id);
        if (!seed) return;

        if (seed.state != "inprogress") return;

        seed.state = "done";

        const object = mp.objects.new(mp.joaat("prop_weed_01"), pos, {
          alpha: 255, dimension: 0
        })

        seed.object = object;
      }, DRUG_CULTIVATION_TIME);

      const shape = this.createSeedColshape(id, pos);

      const data: ISeed = {
        id: id,
        owner: player.user.id,
        timeout: timeout,
        type: "WEED",
        colshape: shape,
        state: "inprogress"
      }

      item.useCount(1);

      this.seeds.push(data);

      this.lastId++;
    }, 10000)
  }

  public async usePlantCane(player: PlayerMp, item: ItemEntity) {
    const isValid = await this.validation(player);
    if (!isValid) return player.notify("Nu poti planta aceste seminte aici", 'error');

    if (item.item_id != 40104) return false;

    player.user.playAnimation([["amb@world_human_gardener_plant@male@base", "base"]], false, true);

    setTimeout(() => {
      if (!player.user || !mp.players.exists(player)) return;

      UserAnimation.stopAnimation(player);
      player.stopAnimation();

      const id = this.lastId;

      const pos = new mp.Vector3(player.position.x, player.position.y, player.position.z - 1.05);

      const timeout = setTimeout(() => {
        let seed = this.seeds.find((i) => i.id == id);
        if (!seed) return;

        if (seed.state != "inprogress") return;

        seed.state = "done";

        const object = mp.objects.new(mp.joaat("prop_plant_cane_02b"), pos, {
          alpha: 255, dimension: 0
        })

        seed.object = object;
      }, DRUG_CULTIVATION_TIME);

      const shape = this.createSeedColshape(id, pos);

      const data: ISeed = {
        id: id,
        owner: player.user.id,
        timeout: timeout,
        type: "COCA",
        colshape: shape,
        state: "inprogress"
      }

      item.useCount(1);

      this.seeds.push(data);

      this.lastId++;
    }, 10000)
  }

  private createSeedColshape(id: number, pos: Vector3Mp) {
    const shape = colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z), "Seminte", async (player: PlayerMp) => {
      if (!player.user.fraction) return;
      if (!ALLOWED_DRUG_FACTIONS.includes(player.user.fraction)) return;


      if (!player.user.inventory.find((i) => i.item_id == 40105)) return player.notify("Nu aveti o foarfeca", "error");

      const seed = this.seeds.find((i) => i.id == id);
      if (!seed || seed.owner != player.user.id) return player.notify("Nu este planta ta", "error");
      if (seed.state != "done") return player.notify("Planta nu este înca crescuta", "error");

      player.user.playAnimation([["amb@world_human_gardener_plant@male@base", "base"]], false, true);

      const type = seed.type;

      setTimeout(() => {
        if (!player.user || !mp.players.exists(player)) return;

        UserAnimation.stopAnimation(player);
        player.stopAnimation();
        const seed = this.seeds.find((i) => i.id === id);
        if (!seed || seed.owner != player.user.id) return;

        player.user.giveItem(type == "WEED" ? 40101 : 40102, false, false, 1);

        seed.object && mp.objects.exists(seed.object) && seed.object.destroy();
        seed.colshape && seed.colshape.exists && seed.colshape.destroy();
      }, METAPHEMATIN_COLLECTION_TIME)
    }, {
      radius: 1
    })

    return shape;
  }

  private async validation(player: PlayerMp) {
    if (!player.user.fraction) return false
    if (!ALLOWED_DRUG_FACTIONS.includes(player.user.fraction)) return false;
    if (!this.cayoPericoColshape.isPointWithin(player.position)) return false;

    const res = await CustomEvent.callClient(player, "client::drugFarm:isInGround");
    console.log(res);
    if (!res) return false;

    return true;
  }
}

export default new DrugFarm()