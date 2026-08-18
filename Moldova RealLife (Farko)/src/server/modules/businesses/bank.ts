import { langStringDefault } from "../../../shared/lang";
import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {system} from "../system";
import {inventory} from "../inventory";
import {account, User} from "../user";
import {
    BANK_CARD_NAME_LIST, bankAccountClose,
    bankCardCostCreate,
    bankCardMax,
    bankMaxPercent,
    newBankCardCost,
    REMOVAL_BANK_MONEY_PERCENT
} from "../../../shared/economy";
import {OWNER_TYPES} from "../../../shared/inventory";
import {CustomEvent} from "../custom.event";
import {business} from "../business";
import {createBizMenuBizWarItem} from "../bizwar";
import {BankTax, BankTaxes} from "../../../shared/atm";
import {Vehicle} from "../vehicles";

CustomEvent.registerCef("pin:check", async (player, card: string, pin: string) => {
    const user = player.user;

    if (user.bank_number != card) return false;
    if (!user.verifyBankCardPay(pin)) return false;
    
    return true;
})

CustomEvent.registerCef("atm:takeCash", (player, sum: number) => {
    const user = player.user;
    if (!user) return;
    if (player.user.isBlockedByCriminals) return player.notify("You are blocked by criminals", "error");
    if (user.tryRemoveBankMoney(sum, true, user.LangString("bank.c03932a0833961f4b377ee191e3417c7"), user.LangString("bank.ea6cc979ae03eb86afb1dd00f1e83e49"))){
        const tax = ((sum / 100) * REMOVAL_BANK_MONEY_PERCENT);
        sum = sum - tax
        user.addMoney(sum, false, user.LangString("bank.b37f6a60e49f3cd2fa7268babe117389"));
        const mybank = user.myBank;
        if(mybank){
            business.addMoney(mybank, tax, langStringDefault("bank.df8420f89032dfae6329a824df2743ad"))
        }
    }
})

CustomEvent.registerCef("atm:changePin", (player, card: string, oldPin: string, newPin: string) => {
    const user = player.user;
    if(!user) return;
    if(!user.bank_number) return player.notify(player.user.LangString("bank.ddd9fe9d450887cbfd267c2dcf797744"), "error");
    if(user.bank_number != card) return player.notify(player.user.LangString("bank.09e0fd6c2529e8da85bba90cc79a4cb5"), "error");
    if(!user.verifyBankCardPay(oldPin)) return player.notify(player.user.LangString("bank.323e3fe5d119544ebf93290417a3850b"), "error");
    if(oldPin == newPin) return player.notify(player.user.LangString("bank.7b7219685a753edf69a3056dfb61def2"), "error");
    player.notify(player.user.LangString("bank.2eb4f945ff73e546db0f0cdae0370070"), "success");
    user.setNewBankPassword(newPin.toString());
})

CustomEvent.registerCef("bank:changeCard", (player, newCardIdx: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.bank_number) return player.notify(player.user.LangString("bank.e83e8145493b9bd1a33fa3f78c5629b8"), "error");
    if (isNaN(newCardIdx) || newCardIdx < 0 || newCardIdx > 2) return player.notify(player.user.LangString("bank.da434b0ee325c7a8fbc136a66cf55b19"), "error")
    const cost = bankCardCostCreate[newCardIdx]
    if (!cost || !user.tryRemoveBankMoney(cost, true, user.LangString("bank.ec5a93bef631b82c9bc7a481f87c423c", BANK_CARD_NAME_LIST[newCardIdx]), user.LangString("bank.018c37c0bf587309c71c96f7dc85fe57"))) 
        return player.notify(player.user.LangString("bank.7cabcd5cfe3f34f13a4dacb060a82f00"), "error");
    user.bank_tarif = newCardIdx;
    player.notify(player.user.LangString("bank.780401734056bc31dda5b92542a198b1"));
})

CustomEvent.registerClient("atm:load", async player => {
    const user = player.user;
    if (!user) return;
    if (!user.bank_have && mp.players.exists(player)) player.notify(player.user.LangString("bank.fc5e11c27a627c64a45163656c5be975"), "error")
    const history = await user.getBankHistory();
    if (mp.players.exists(player)) {
        user.setGui("atm")
        CustomEvent.triggerCef(player, "atm:load", user.bank_number, history);
    }
})

CustomEvent.registerCef("bank:transfer", (player, sum: number, number: string) => {
    if (player.user.isBlockedByCriminals) return player.notify("You are blocked by criminals", "error");
    User.sendMoney(player, sum, number)
});
CustomEvent.registerCef("bank:reissue", (player, pin: string) => {
    const user = player.user;
    if (user.money < newBankCardCost) return player.notify(player.user.LangString("bank.e3ce5e3f1020e443ebc4b02e9ca2bdab"), "error")

    user.removeMoney(newBankCardCost, true, user.LangString("bank.1b86bad64bf22f07fc0a77124239588e"));

    let cardq = [...inventory.data].filter(q => q[1].serial === user.bank_number).map(it => {
        it[1].extra = null
        it[1].advancedNumber = 0
        it[1].save();
    });
    inventory.createItem({
        item_id: 801, owner_type: OWNER_TYPES.PLAYER, owner_id: user.id, serial: user.bank_number, extra: account.hashPassword(pin.toString()), advancedNumber: user.id
    });
    player.notify(player.user.LangString("bank.a7d242fc4fe60735383b903c17a6b9a9"), "success")
});

CustomEvent.registerCef("bank:witdraw", async (player, bankId: number, sum: number) => {
    const user = player.user;
    if (player.user.isBlockedByCriminals) return player.notify("You are blocked by criminals", "error");
    const item = await BusinessEntity.findOne(bankId);
    if (!sum) return;
    if (isNaN(sum) || sum < 0 || sum > 99999999) return player.notify(player.user.LangString("bank.922b7df25937423d07040325826fb2e8"), "error");
    if (sum > user.bank_money) return player.notify(player.user.LangString("bank.0d37da2c58b63867d85ac87081e20be2"), "error");
    user.removeBankMoney(sum, true, user.LangString("bank.b15908cec5230823a24727e9824d5fcd"), item.name);
    sum = sum - ((sum / 100) * REMOVAL_BANK_MONEY_PERCENT)
    user.addMoney(sum, false, user.LangString("bank.2d224f55759a0d933a396a24b1380cfb"));
    player.notify(player.user.LangString("bank.a99179d0047e1a9a5078d6bcf0f4c015"), "success");
});

CustomEvent.registerCef("bank:deposit", async (player, bankId: number, sum: number) => {
    const user = player.user;
    if (player.user.isBlockedByCriminals) return player.notify("You are blocked by criminals", "error");
    const item = await BusinessEntity.findOne(bankId);
    if (!sum) return;
    if (isNaN(sum) || sum < 0 || sum > 99999999) return player.notify(player.user.LangString("bank.bac957a57de7f2ed8e5334f21a29acd2"), "error");
    if (sum > user.money) return player.notify(player.user.LangString("bank.6a91b37f1bdfae9c36d6faea1c3380b4"), "error");
    if (bankCardMax[user.bank_tarif] && bankCardMax[user.bank_tarif] < (user.bank_money + sum)) return player.notify(player.user.LangString("bank.c935e5f3abbe896a8be80aa42058a5ac"), "error");
    user.removeMoney(sum, true, user.LangString("bank.8ccf258669deb98abe0736ce908a1265"));
    user.addBankMoney(sum, true, user.LangString("bank.3dabdc37bb72268ca26b03c5f2ed7bda"), item.name);
    player.notify(player.user.LangString("bank.99540fb83cb547967072cd236895dc20"), "success");
});

CustomEvent.registerCef("bank:closeCard", (player) => {
    const user = player.user

    if (!user.tryRemoveBankMoney(bankAccountClose, true, user.LangString("bank.397e6b077784fe57c25b0e34dad62c1a"), user.LangString("bank.971973978112bf8156cc9c80b8e589e6")))
        return player.notify(player.user.LangString("bank.767b299305725dbd670dfad73af02492", bankAccountClose), "error");

    user.setGui(null)
    menu.accept(player, player.user.LangString("bank.44a810afc619b56f1ce25065fbb00b16")).then(status => {
        if (status) {
            if (user.bank_money) user.addMoney(user.bank_money, true, user.LangString("bank.dd71f10655cd7a1ec0fa6c60211f7088"));
            let cardq = [...inventory.data].find(q => q[1].serial === user.bank_number);
            if (cardq) {
                let card = cardq[1];
                card.extra = null
                card.advancedNumber = 0

                card.save();
            }
            user.bank_number = "";
            user.bank_tarif = 0;
            user.bank_money = 0;
            player.notify(player.user.LangString("bank.f0477d8eb8e5b43a2c5db87cd2f1efb4"), "error")
        }
    })
});

CustomEvent.registerCef("bank:payTax", async (player, id: number, taxType: keyof BankTaxes) => {
    const user = player.user;
    if (player.user.isBlockedByCriminals) return player.notify("You are blocked by criminals", "error");
    switch (taxType) {
        case "houses": {
            const house = user.house === id ? user.houseEntity : user.family?.house
            if (!house || house.tax === house.taxMax) return;

            const withdrawAmount = house.taxMax - house.tax;

            if (withdrawAmount <= 0) return player.notify(player.user.LangString("bank.cd08ab6fdd81a0740d9c61a8dc291e64"), "error");

            if (!user.tryRemoveBankMoney(withdrawAmount, true, user.LangString("bank.177fc42b53a63789ea5757b07c37ec0d", house.id), user.LangString("bank.e123b660c1388d3aa0c91c57e0703a65")))
                return player.notify(player.user.LangString("bank.a7f1cc9ce1580a75b63eb109b324ffcb"), "error");
            house.tax = house.taxMax;
            await house.save()
            break;
        }
        case "businesses": {
            if (!user.business || user.business.tax === user.business.taxMax) return;

            const withdrawAmount = user.business.taxMax - user.business.tax;

            if (withdrawAmount <= 0) return player.notify(player.user.LangString("bank.f7dfb4c139b0bfecf6f5c5736730aa4a"), "error");

            if (!user.tryRemoveBankMoney(withdrawAmount, true, user.LangString("bank.0470616e9075f7656c9ebcd8eb1778e5", user.business.id), user.LangString("bank.5ed4a2dffcb93114bb8346cc9465c5c2")))
                return player.notify(player.user.LangString("bank.f23e533029c4ba7e501b1f9f37852b52"), "error");
            user.business.tax = user.business.taxMax;

            await user.business.save();
            break;
        }
        case "warehouse": {
            if (!user.warehouse || !user.warehouseEntity.tax) return;

            const withdrawAmount = user.warehouseEntity.taxMax - user.warehouseEntity.tax;

            if (withdrawAmount <= 0) return player.notify(player.user.LangString("bank.5dd5d22c47bd3a31ca75a67c92558000"), "error");

            if (!user.tryRemoveBankMoney(withdrawAmount, false, user.LangString("bank.94485cbfb6b074f8dc2e5e648e246eba", user.warehouseEntity.id), user.LangString("bank.f55d7c078446f769cb6d058445c9e698")))
                return player.notify(player.user.LangString("bank.b7beac8d56eafa55cd47a8816034a9d8"), "error");

            user.warehouseEntity.tax = user.warehouseEntity.taxMax;
            await user.warehouseEntity.save();
            break;
        }
    }
    CustomEvent.triggerCef(player, "bank:updateTax", id, taxType)
})

const getPlayerAvailableTaxes = (player: PlayerMp): BankTaxes => {
    const user = player.user;
    const taxes: BankTaxes = { houses: [], businesses: [], warehouse: [] }
    
    const personalHouse = user.houseEntity;
    if (personalHouse) taxes.houses.push({ id: personalHouse.id, name: langStringDefault("bank.b6df69b3b40f2e8e58f8953031591f82"), maxTaxAmount: personalHouse.taxMax, taxAmountLeft: personalHouse.tax, address: personalHouse.name })

    const familyHouse = user.family?.house;
    if (familyHouse) taxes.houses.push({ id: familyHouse.id, name: langStringDefault("bank.ec746742308ec164f1cd80184c743a60"), maxTaxAmount: familyHouse.taxMax, taxAmountLeft: familyHouse.tax, address: familyHouse.name })

    const warehouse = user.warehouseEntity;
    if (warehouse) taxes.warehouse.push({ id: warehouse.id, name: langStringDefault("bank.ad64a36c8d059d068dfc6f616a9347f0"), maxTaxAmount: warehouse.taxMax, taxAmountLeft: warehouse.tax })
    
    return taxes;
}

export const bankMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    let haveBankAcc = false;
    let haveBankAccInThisBank = false;
    let haveBankAccInSameBank = false;
    if (player.user.bank_number) {
        haveBankAcc = true;
        const [sub_type, bank_id, bank_tarif] = player.user.bank_number.toString().split("A").map(i => parseInt(i))
        if (sub_type == (item.sub_type + 1)) haveBankAccInSameBank = true;
        if (bank_id == item.id) haveBankAccInThisBank = true;
    }
    let m = menu.new(player, "", "");
    let sprite: "pacific" | "maze" | "fleeca" | "blane";
    switch (item.sub_type) {
        case 0:
            sprite = "pacific";
            break;
        case 1:
            sprite = "maze";
            break;
        case 2:
            sprite = "fleeca";
            break;
        case 3:
            sprite = "blane";
            break;
    }
    m.sprite = sprite;
    if (haveBankAccInThisBank) {
        player.user.setGui(
            "bank", 
            "bank:loadData", 
            item.id, 
            player.user.bank_tarif, 
            player.user.bank_number,
            getPlayerAvailableTaxes(player)
        )
    } else {
        m.newItem({
            name: langStringDefault("bank.7ae49d2bacf5e0b030fa9f0daa375abc"),
            more: "",
            onpress: () => {
                if (haveBankAcc) {
                    menu.close(player);
                    if (haveBankAccInSameBank) return player.notify(player.user.LangString("bank.ea5952bc05fd3d1a229602ed07a1d356"), "error");
                    else return player.notify(player.user.LangString("bank.4cc5c2de0aa20ad3441ef9d90a96276c"), "error");
                }
                let submenu = menu.new(player, "", player.user.LangString("bank.5a12b15863d134ee7570cf2a6b78c20b"));
                submenu.sprite = sprite;
                
                BANK_CARD_NAME_LIST.map((q, index) => {
                    let tarif = index;
                    let cost = bankCardCostCreate[index];

                    submenu.newItem({
                        name: q,
                        desc: langStringDefault("bank.6b6527f40f0fae482650be0f2618ff76", cost ? `$${system.numberFormat(cost)}` : langStringDefault("bank.eee0db23e3c2546038c5e77d041f8ccd"), bankCardMax[tarif] ? system.numberFormat(bankCardMax[tarif]) : langStringDefault("bank.64505521a273d7e51c9ac439a11a3d4d")),
                        icon: `bank_card_${tarif + 1}`,
                        onpress: () => {
                            menu.input(player, player.user.LangString("bank.9b7b08311edd6083dcf6cfc56633623a"), "", 4, "passwordNumber").then(pin => {
                                if (!(/^\d+$/.test(pin))) return player.notify(player.user.LangString("bank.48b1a0c9a1f4268fd15b8710c887389f"), "error")
                                if(pin.length !== 4) return player.notify(player.user.LangString("bank.ef55f70af0596a43d6ee864ec2eb0f8c"), "error")
                                if (cost && user.money < cost) return player.notify(player.user.LangString("bank.eec70ad2a547e47900842a41307297a7"), "error");
                                if (cost) user.removeMoney(cost, true, user.LangString("bank.8f5f2f2ca6d1e0d5107e1f8d7be584fc", item.id))
                                let bank_number = (`${item.sub_type + 1}A${item.id}A${tarif}A${system.getRandomInt(1000000, 9999999)}`)
                                user.bank_number = bank_number
                                user.bank_tarif = tarif
                                inventory.createItem({
                                    item_id: 801, owner_type: OWNER_TYPES.PLAYER, owner_id: user.id, serial: bank_number, extra: account.hashPassword(pin), advancedNumber: user.id
                                });
                                player.notify(player.user.LangString("bank.1b3c7795484a81cd92364fa0b583b43e"));
                                submenu.close();
                            })
                        }
                    })
                })

                submenu.open();
            }
        })
    }
    if(item.userId === user.id || user.isAdminNow(6)){
        m.newItem({
            name: langStringDefault("bank.211d517e8ab13aad9940cc2a686ff970")
        })
        let percentList:string[] = [];
        if (item.param1 > bankMaxPercent){
            item.param1 = bankMaxPercent;
            item.save();
        }
        for (let q = 0; q < (bankMaxPercent + 1); q++) percentList.push(`${q}%`);
        m.newItem({
            name: langStringDefault("bank.059dd156df10404e7f0e9ffb5ddfb28b"),
            type: "list",
            list: percentList,
            listSelected: item.param1,
            onpress: (itm) => {
                item.param1 = itm.listSelected;
                item.save();
                player.notify(player.user.LangString("bank.2adc84b29dbfe5958d4a89f27b5842e8"), "success");
            }
        })
    }

    createBizMenuBizWarItem(user, m, item);

    m.open();
}