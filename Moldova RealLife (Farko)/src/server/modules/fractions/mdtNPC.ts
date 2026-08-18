import { menu } from "../menu";
import { NpcSpawn } from "../npc";
import MDT from './mdt';

const NPC_DATA = {
  pos: new mp.Vector3(445.51, -974.16, 30.69),
  heading: 180,
  model: "s_m_y_devinsec_01",
  name: "Plata caziere"
}

const CRIMINAL_PAY_PRICE = 1000;

class MDTNPC {
  constructor() {
    this.init();
  }

  private init() {
    new NpcSpawn(NPC_DATA.pos, NPC_DATA.heading, NPC_DATA.model, NPC_DATA.name, (player: PlayerMp) => {
      this.getMenu(player);
    })
  }

  private getMenu(player: PlayerMp) {
    const m = menu.new(player, NPC_DATA.name);
    m.newItem({
      name: "Lista caziere",
      onpress: async () => {
        const s = menu.new(player, NPC_DATA.name);

        const list = await MDT.getPlayerUnpaidCriminals(player);
        if (!list) return;

        list.forEach((criminal) => {
          s.newItem({
            name: criminal.description,
            onpress: () => {
              const j = menu.new(player, NPC_DATA.name);
              j.newItem({
                name: "Pay",
                onpress: async () => {
                  if (player.user.money < CRIMINAL_PAY_PRICE) return;
                  
                  const isPayed = await MDT.payCriminalRecord(player, criminal.id);
                  if (!isPayed) return;

                  player.user.removeMoney(CRIMINAL_PAY_PRICE, true, "Pay by Criminal Record");
                  await MDT.reloadCriminals(player);

                  await player.user.entity.save();
                }
              })

              j.newItem({
                name: "Back",
                onpress: () => {
                  s.open();
                }
              })
              j.open();
            }
          })
        })

        s.open();
      }
    })

    m.open();
  }
}

export default new MDTNPC();