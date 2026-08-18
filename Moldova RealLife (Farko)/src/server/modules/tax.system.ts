import {business} from "./business";
import {SELL_GOS_TAX_PERCENT} from "../../shared/economy";
import {houses} from "./houses";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {User} from "./user";
import {saveEntity} from "./typeorm";
import {Family} from "./families/family";
import {DAYLY_ADD_MONEY} from "../../shared/business";
import {warehouses} from "./warehouse";
import {WarehouseEntity} from "./typeorm/entities/warehouse";
import {BusinessEntity} from "./typeorm/entities/business";
// import {agency} from "./houses/agency";
import { langStringDefault } from "../../shared/lang";


export const taxRun = async () => {
    await system.sleep(10000);

    if(!User.x2func.data[0].taxes) return;

    system.debug.info('----------------')
    system.debug.info('Steuerabschreibung')

    let resultSum = 0;
    const businessToSave = business.data.map(businessEntity => {
        if (!businessEntity.userId) return;
        if (!businessEntity.price) return;

        const taxSum = businessEntity.taxDay
        resultSum += taxSum;
        if (taxSum * DAYLY_ADD_MONEY > 0)
            business.addMoney(businessEntity, taxSum * DAYLY_ADD_MONEY, langStringDefault("tax.system.addMoney"), false, true, false, false)

        businessEntity.tax -= taxSum;

        if (businessEntity.tax <= 0) {
            const returnSum = (businessEntity.price - ((businessEntity.price / 100) * SELL_GOS_TAX_PERCENT));

            const player = User.get(businessEntity.userId);
            if (player) {
                const user = player.user;
                user.addBankMoney(returnSum, true, user.LangString("tax.system.addMoneyUser", businessEntity.id), 'Steuerdienst', true)
                player.notify(`Afacerea ta a fost confiscata de stat deoarece nu ti-ai platit taxele la timp`, 'success')
            } else {
                User.addBankMoney(businessEntity.userId, returnSum, langStringDefault("tax.system.addMoneyUser", businessEntity.id), 'Steuerdienst')
            }

            business.setOwner(businessEntity, null);
        }

        return businessEntity;
    })
        .filter(businessEntity => !!businessEntity);

    if (businessToSave.length > 0) {
        await Promise.all(businessToSave.map(biz => saveEntity(biz)))
    }

    system.debug.info(`De la afaceri au fost colectate taxe in valoare de $${system.numberFormat(resultSum)}`)

    resultSum = 0
    houses.data.forEach(async (house) => {
        if (!house.userId) return;
        if (!house.price || house.price < 100) return;
        // UKRANIANS LAST JOIN
        const user = await User.getData(house.userId);
        if (user && user.online < 1645812000) return;
        //

        const taxSum = house.taxDay;
        resultSum += taxSum;
        house.tax -= taxSum;
        if (house.tax <= 0) {
            const returnSum = (house.price - ((house.price / 100) * SELL_GOS_TAX_PERCENT) - house.tax);

            if (house.forFamily) {
                const fam = Family.getByID(house.familyId)
                if (fam) {
                    fam.addMoney(returnSum, null, langStringDefault("tax.system.fam.addMoney", house.name, house.id))
                }
            } else {
                User.addBankMoney(house.userId, returnSum, langStringDefault("tax.system.fam.addMoney", house.name, house.id), langStringDefault("tax.system.fam.addMoney.init"))
            }

            house.timeForPurchase = agency.getTimeForPurchase();
            houses.setOwner(house, null, false, true);
        } else {
            saveEntity(house);
        }
    })
    system.debug.info(`Von den Haushalten wurden Steuern in Höhe von $${system.numberFormat(resultSum)} genommen`)
    resultSum = 0

    const warehousesToSave = warehouses.list.map(warehouse => {
        if (warehouse.onSell) return;
        if (!warehouse.taxDay) return;

        warehouse.tax -= warehouse.taxDay;
        if (warehouse.tax <= 0)
            warehouse.sellToGos()

        return warehouse;
    })

    if(warehousesToSave.length > 0)
        await WarehouseEntity.save(warehousesToSave)
    
    system.debug.info('----------------')
}


CustomEvent.register('newDay', () => {
    taxRun();
})

CustomEvent.registerClient('tax:admin', (player) => {
    const user =  player.user;
    if(!user) return;
    if(!user.isAdminNow(6)) return;
    taxRun();
})