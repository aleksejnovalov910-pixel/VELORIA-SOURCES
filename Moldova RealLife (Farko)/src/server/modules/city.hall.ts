import { langStringDefault } from "../../shared/lang";
import { colshapes } from "./checkpoints";
import { system } from "./system";
import { menu } from "./menu";
import { startDocumentCost, restoreDocumentCost } from "../../shared/economy";
import { inventory } from "./inventory";
import { OWNER_TYPES } from "../../shared/inventory";
import { ItemEntity } from "./typeorm/entities/inventory";
import { User } from "./user";
import { houses } from "./houses";
let pos = [
    new mp.Vector3(-554.69, -190.93, 37.23),
    // new mp.Vector3(-553.02, -187.37, 37.23),
]

setTimeout(() => {
    system.createBlip(419, 4, pos[0], langStringDefault("city.hall.0cba8ef77d4d7fa9d74fc38fa02ed68f"))
}, 100)


export const openCityHall = (player: PlayerMp) => {
    const user = player.user;
    const m = menu.new(player, "", player.user.LangString("city.hall.349ec75c4ea211b8c1299d7a8d277f35"));
    m.sprite = "suemurry_background_left";
    let cost = startDocumentCost;
    let name = langStringDefault("city.hall.c9ea3c97b963712862b9c434d57a1d32");
    let nameReason = langStringDefault("city.hall.80982273c742b8ea9741aff270c0aee5");
    let desc = langStringDefault("city.hall.8ee19c120491de5f1464bbe471c89c96");
    let notify = langStringDefault("city.hall.a7028f4cf2649d2cc1027d4a2af7521b");
    if (user.social_number){
        cost = restoreDocumentCost 
        name = langStringDefault("city.hall.7c4ba4f3af467945b529dcac64097366")
        nameReason = langStringDefault("city.hall.845cd9ac0957f91fe50492b569f4ad68")
        desc = langStringDefault("city.hall.a09c6f668aa10ec4975cd06a8b5121a7")
        notify = langStringDefault("city.hall.bfc5d66d9aacdfb5b3e3946752f7448a");
    }
    m.newItem({
        name: `${name} [Enter]`,
        icon: "Item_800",
        more: cost ? `$${system.numberFormat(cost)}` : "Gratis",
        desc,
        onpress: async () => {
            const sign = await user.getSignature('idcard')
            if (!sign) return player.notify('trebue sa te semnezi', "error", 'DIA_MIGRANT');
            if (cost) {
                if (!(await user.tryPayment(cost, "all", null, nameReason, "Primaria Los Santos"))) {
                    return;
                }
            }
            let number = system.getRandomInt(1000000000, 9000000000)
            user.social_number = number.toString();
            inventory.createItem({
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: user.id,
                item_id: 800,
                advancedString: `${user.name}`,
                advancedNumber: user.male ? 1 : 0,
                serial: user.id + "_" + number
            })
            player.notify(notify + user.name, "success", 'DIA_MIGRANT');
            m.close();
        }
    })
    m.open();
}

pos.map(item => colshapes.new(item, player => player?.user?.LangString("city.hall.44e1b9d713aa02b1cae283b747084c05") ?? langStringDefault("city.hall.44e1b9d713aa02b1cae283b747084c05"), player => openCityHall(player)))



export const getDocumentData = (item: ItemEntity): Promise<{ house:string, number: string, name: string, male: number, partner:string, age: number, id: number, level: number}> => {
    return new Promise(async (resolve, reject) => {
        if(!item) resolve(null);
        const acc = await User.getData(parseInt(item.serial.split('_')[0]));
        if(!acc) return resolve(null);
        if (acc.id + "_" + acc.social_number !== item.serial) return resolve(null);
        const house = houses.getByUserList(acc.id);
        const partner = acc.partnerId ? await User.getData(acc.partnerId) : null
        const partnerName = partner ? `${partner.rp_name} (#${partner.id}_${partner.social_number})` : null;
        resolve({ id: acc.id, house: house ? `${house.name} #${house.id}` : '', number: item.serial.split('_')[1], name: item.advancedString, male: item.advancedNumber, partner: partnerName, age: acc.age, level: acc.level })
    })
}