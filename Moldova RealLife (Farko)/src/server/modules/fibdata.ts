import { langStringDefault } from "../../shared/lang";
import {FIB_DATA_POS, FIB_DATA_RANK} from "../../shared/fibdata";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {FACTION_ID} from "../../shared/fractions";
import {FractionChestEntity} from "./typeorm/entities/chest";
import {fractionChest} from "./chest";
import {Logs} from "./logs";
import {MoneyChestClass} from "./money.chest";
import {fractionCfg} from "./fractions/main";

if (FIB_DATA_POS.length > 0) {
    colshapes.new(FIB_DATA_POS, player => player?.user?.LangString("fibdata.f797010c2f949db2aaa307a0a6a83861") ?? langStringDefault("fibdata.f797010c2f949db2aaa307a0a6a83861"), player => {
        main(player)
    }, {
        type: 27,
        drawStaticName: 'scaleform'
    })
}

const main = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (user.fraction !== FACTION_ID.FIB) return player.notify(player.user.LangString("fibdata.25354b00f7f022afaaa5b7d915892957"), 'error');
    if (user.rank < FIB_DATA_RANK) return player.notify(player.user.LangString("fibdata.dd0cc58f30d642c1939640f5fdfe4c1a", fractionCfg.getRankName(FACTION_ID.FIB, FIB_DATA_RANK)), 'error');
    const m = menu.new(player, player.user.LangString("fibdata.df15f7f20d2a0ca9e2ef078c3a04ad80"))

    const fractions = [...fractionCfg.list.map(q => q.id)]

    fractions.map(id => {
        const cfg = fractionCfg.getFraction(id);
        if (!cfg) return;
        m.newItem({
            name: player.user.LangString("fibdata.e9591646add1ce9f5ee2efb7b6fa95ba", cfg.name),
            onpress: () => {
                data(player, id);
            }
        })
    })

    m.open();
}

const data = (player: PlayerMp, id: FACTION_ID) => {
    const cfg = fractionCfg.getFraction(id);
    if (!cfg) return;
    const user = player.user;
    if (!user) return;
    if (user.fraction !== FACTION_ID.FIB) return player.notify(player.user.LangString("fibdata.961145428bada706d767b4395d028e35"), 'error');
    if (user.rank < FIB_DATA_RANK) return player.notify(player.user.LangString("fibdata.e67f451a3a0cbde2ff969d6e90c69d23", fractionCfg.getRankName(FACTION_ID.FIB, FIB_DATA_RANK)), 'error');


    const m = menu.new(player, player.user.LangString("fibdata.6541aaeee720cbd864dfe0d3730c13c1", cfg.name))
    m.onclose = () => {
        main(player);
    }

    const items = fractionChest.getByFraction(id);
    if(!items.length){
        m.newItem({
            name: player.user.LangString("fibdata.2473c17c4a9ebdb8eacf41fcfea7236f"),
            more: player.user.LangString("fibdata.fbf04f1bcd09d8fba5087284ee0a9fb3")
        })
    } else {
        items.map(item => {
            m.newItem({
                name: player.user.LangString("fibdata.5dc3ba0c18634d9bcf5cf732f5247515", item.id),
                onpress: () => {
                    Logs.open(player, `chest_${item.id}`, langStringDefault("fibdata.3fbfa2be6529f3f168ed88729341ae30"))
                }
            })
        })
    }

    const mitems = MoneyChestClass.getAllByFraction(id);
    if(!mitems.length){
        m.newItem({
            name: player.user.LangString("fibdata.bfb662f23d15628787a2742390d0c1a4"),
            more: player.user.LangString("fibdata.5bfc673d9b90128bd534987bae6fd4cf")
        })
    } else {
        mitems.map(item => {
            m.newItem({
                name: player.user.LangString("fibdata.436e3f655fd378135aeb9bc5dd697fb5", item.id),
                onpress: () => {
                    Logs.open(player, `money_${item.id}`, langStringDefault("fibdata.d31ad87f013b0e2965c8c54c3662a488"))
                }
            })
        })
    }


    m.open()
}