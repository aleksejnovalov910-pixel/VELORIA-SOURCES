import { langStringDefault } from "../../shared/lang";
import {HouseEntity} from "./typeorm/entities/houses";
import {houses, isPlayerHasHouseKey} from "./houses";
import {
    calculateMiningFarmData,
    COIN_SELL_POS,
    getMiningLevel,
    MINING_ALGORITHMS_LEVELS,
    MINING_CPUS,
    MINING_POWERSS,
    MINING_RAMS,
    MINING_SELL_COEFFICIENT,
    MINING_TF_INDEX_BASE_COIN,
    MINING_TICK_INTERVAL,
    MINING_VIDEOCARDS,
    MiningHouseDefault
} from "../../shared/mining";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {getInteriorHouseById, interriors} from "../../shared/inrerriors";
import {inventory} from "./inventory";
import {getBaseItemNameById, getItemName, inventoryShared, ITEM_TYPE, OWNER_TYPES} from "../../shared/inventory";
import {ItemEntity} from "./typeorm/entities/inventory";
import {saveEntity} from "./typeorm";
import {CustomEvent} from "./custom.event";
import {SocketSyncWeb} from "./socket.sync.web";
import PhoneCryptoData from "../../shared/phone/phoneCryptoData";
import {CryptoTransactionType} from "../../shared/phone/cryptoTransactionType.enum";
import {AccountEntity} from "./typeorm/entities/account";
import {UserEntity} from "./typeorm/entities/user";
import {UserStatic} from "./usermodule/static";
import { taxRun } from './tax.system'
import { UserStats } from './usermodule/stats'
import { gui } from './gui'


let cryptoCost = 100;

export class MiningStats {
    /** Число крипты выведенной за день */
    public static cryptoDailyWithdrawal: number = 0;  
}

export const calculatePowerForCoin = () => {
    const items = houses.dataArray.filter(q => q.miningData);
    let sum = 0;
    items.map(q => {
        const data = calculateMiningFarmData(q.miningData);
        sum += data.tf
    })
    let res = sum / items.length
    currentPowerForCoin = (res / MINING_TF_INDEX_BASE_COIN) || 100
}

interriors.map(int => {
    if(int.type !== 'house') return;
    if(!int.mining) return;
    colshapes.new(new mp.Vector3(int.mining.x, int.mining.y, int.mining.z), player => player?.user?.LangString("mining.8b468f709665e520cb8c028cc6cd6484") ?? langStringDefault("mining.8b468f709665e520cb8c028cc6cd6484"), player => {
        if(!player.dimension) return;
        const item = houses.get(player.dimension)
        if(!item) return;
        miningMenu(player, item)
    }, {
        // radius: int.type == "house" ? 1 : 3,
        dimension: -1,
        color: [0,0,0,0],
        radius: 2
    })
})


let miningProps = new Map<number, ObjectMp>();


export const getMiningCefData = (player: PlayerMp, item: HouseEntity) => {
    const user = player.user;
    if(!user) return null;
    const ids = [...MINING_ALGORITHMS_LEVELS, ...MINING_CPUS, ...MINING_RAMS, ...MINING_VIDEOCARDS, ...MINING_POWERSS].map(q => q.item);
    const items = user.allMyItems.filter(q => ids.includes(q.item_id)).map(q => {
        return [q.id, q.item_id]
    })
    return JSON.stringify({...item.miningData, items})
}

CustomEvent.registerCef('mining:component:insert', (player, id: number, upgradeComponent: "videocards" | "cpu" | "powers" | "alghoritm" | "rams", itemid: number) => {
    const user = player.user;
    if(!user) return;
    const item = houses.get(id);
    if(!item) return;
    let data = item.miningData;
    if(!data) return;
    const cfg = getMiningLevel(data.level)
    if(upgradeComponent === "cpu" && data.cpu) return player.notify(player.user.LangString("mining.22f806f5d84b7c50dae3319d89e8a28d"), 'error')
    if(upgradeComponent === "alghoritm" && data.algorithm) return player.notify(player.user.LangString("mining.c9417d8a3841fe4e96acff80f75022fe"), 'error')
    if(upgradeComponent === "videocards" && data.cards.filter(q => q).length >= cfg.max_cards) return player.notify(player.user.LangString("mining.954968e567588bfc4388800e40f506b7"), 'error')
    if(upgradeComponent === "powers" && data.powers.filter(q => q).length >= cfg.max_additional_power_blocks) return player.notify(player.user.LangString("mining.b76efd294041925f552d1333f880237b"), 'error')
    if(upgradeComponent === "rams" && data.ram.filter(q => q).length >= cfg.max_ram_count) return player.notify(player.user.LangString("mining.31fe5e64205f43686d73446bf31907c7"), 'error')
    let filterList: number[] = []
    if(upgradeComponent === 'cpu') filterList = MINING_CPUS.map(q => q.item)
    if(upgradeComponent === 'alghoritm') filterList = MINING_ALGORITHMS_LEVELS.map(q => q.item)
    if(upgradeComponent === 'videocards') filterList = MINING_VIDEOCARDS.map(q => q.item)
    if(upgradeComponent === 'powers') filterList = MINING_POWERSS.map(q => q.item)
    if(upgradeComponent === 'rams') filterList = MINING_RAMS.map(q => q.item)
    const itm = user.allMyItems.find(q => q.id === itemid);
    if(!itm) return player.notify(player.user.LangString("mining.c15b5505cc0f0f89e813d8afd1f15f7e"), 'error');
    if(!filterList.includes(itm.item_id)) return player.notify(player.user.LangString("mining.f9c49beb586d37ad1cee78fd1c2f6c41"), 'error');
    if(upgradeComponent === 'cpu') data.cpu = itm.item_id;
    if(upgradeComponent === 'alghoritm') data.algorithm = itm.item_id;
    if(upgradeComponent === 'videocards') data.cards.push(itm.item_id);
    if(upgradeComponent === 'powers') data.powers.push(itm.item_id);
    if(upgradeComponent === 'rams') data.ram.push(itm.item_id);

    itm.useCount(1, player);
    item.miningData = {...data};
    saveEntity(item);

    fireSocket(item)

})

const fireSocket = (item: HouseEntity) =>
    SocketSyncWeb.getfire(`mining_${item.id}`).map(player =>
        SocketSyncWeb.fireTarget(player, `mining_${item.id}`, getMiningCefData(player, item)))


CustomEvent.registerCef('mining:component:remove', async (player, id: number, upgradeComponent: "videocards" | "cpu" | "powers" | "alghoritm" | "rams", index: number) => {
    const user = player.user;
    if(!user) return;
    const item = houses.get(id);
    if(!item) return;
    let data = item.miningData;
    if(!data) return;
    const cfg = getMiningLevel(data.level)
    if(upgradeComponent === "cpu" && !data.cpu) return player.notify(player.user.LangString("mining.c9c3c53024f092216572722c3f83ee06"), 'error')
    if(upgradeComponent === "alghoritm" && !data.algorithm) return player.notify(player.user.LangString("mining.66e5735774e4999b76f3784c7982137a"), 'error')
    if(upgradeComponent === "videocards" && !data.cards[index]) return player.notify(player.user.LangString("mining.b87018bb7e0a2c98e05c19c5eaa53722"), 'error')
    if(upgradeComponent === "powers" && !data.powers[index]) return player.notify(player.user.LangString("mining.9a6dec2dc3e3cb3bf3f434b8a6939efa"), 'error')
    if(upgradeComponent === "rams" && !data.ram[index]) return player.notify(player.user.LangString("mining.e39ec9e741c9fe96eada55e24285f41d"), 'error')
    let itemid: number;

    if(upgradeComponent === "cpu") itemid = data.cpu;
    if(upgradeComponent === "alghoritm") itemid = data.algorithm;
    if(upgradeComponent === "videocards") itemid = data.cards[index];
    if(upgradeComponent === "powers") itemid = data.powers[index];
    if(upgradeComponent === "rams") itemid = data.ram[index];

    if(!itemid) {
        console.log('incorrect select item when remove')
        return;
    } else {
        console.log(`give ${itemid}`)
    }

    if (!user.canTakeItem(itemid, 1, 1)) {
        player.notify(player.user.LangString("mining.e386719f0df4421f2f8f3064eddfd937", getBaseItemNameById(itemid)), "error");
        return;
    }

    if(upgradeComponent === "cpu") data.cpu = null;
    else if(upgradeComponent === "alghoritm") data.algorithm = 0;
    else if(upgradeComponent === "videocards") data.cards[index] = 0;
    else if(upgradeComponent === "powers") data.powers[index] = 0;
    else if(upgradeComponent === "rams") data.ram[index] = 0;

    data.cards = data.cards.filter(q => q)
    data.powers = data.powers.filter(q => q)
    data.ram = data.ram.filter(q => q)

    item.miningData = {...data};
    saveEntity(item);
    fireSocket(item)

    await user.giveItem(itemid);
})

CustomEvent.registerCef('mining:sell', (player) => {
    const user = player.user;
    if (!user) return;
    if (!player.user.house) return;
    if (!player.user.houseEntity.miningData) return;
    if (!player.user.houseEntity.miningData.amount) return player.notify(player.user.LangString("mining.9c7c7d557c19526579637d0efa90444d"), 'error');

    const house: HouseEntity = player.user.houseEntity;
    const interiorConfig = getInteriorHouseById(house.interrior);

    let amountToWithdraw = house.miningData.amount;
    let electricityTax = 0;
    if (interiorConfig.cryptoWithdrawalTax) {
        electricityTax = amountToWithdraw * interiorConfig.cryptoWithdrawalTax;
    }

    const taxNoticeText = (electricityTax > 0) ? player.user.LangString("mining.80aefc75c5c7399fd5f47343b745406f", electricityTax) : '';
    user.setGui(null)
    menu.accept(player, player.user.LangString("mining.2bd94ffe1adbd66fddf6b73136f0d1a9", player.user.houseEntity.miningData.amount, taxNoticeText))
        .then(status => {
            if (!user) return;
            if (!player.user.house) return;
            if (!player.user.houseEntity.miningData) return;
            if (!player.user.houseEntity.miningData.amount) return;

            if (status) {
                player.user.houseEntity.miningData.amount = 0;
                if (!user.crypto_number) user.newCryptoNumber();
                
                user.addCryptoMoney(amountToWithdraw - electricityTax, true, user.LangString("mining.ac4983eb65b7ba1fc37792150b85a2af"));
                player.user.houseEntity.miningData = {...player.user.houseEntity.miningData, amount: 0};
                saveEntity(player.user.houseEntity);
                player.notify(player.user.LangString("mining.51a3b1293d297b293c967258c6eb767b"), 'success');
            }
    });
})

CustomEvent.registerCef('mining:exchange', async (player, amount: number, type: CryptoTransactionType) => {
    if (!player.user || !player.user.crypto_number || !amount) return;
    if (type === CryptoTransactionType.WITHDRAW)
        sellCrypto(player, amount);
    else await buyCrypto(player, amount);
    const cryptoData: PhoneCryptoData = { cryptoBalance: player.user.crypto, dailyWithdrawal: MiningStats.cryptoDailyWithdrawal }
    CustomEvent.triggerCef(player, 'mining:updateAmount', cryptoData)
})

CustomEvent.registerCef('mining:update', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    const item = houses.get(id);
    if(!item) return;
    if (!item.miningData) return player.notify(player.user.LangString("mining.acc0f0e048e6019654688acac2b3cd3e"), 'error');
    if (!(user.isAdminNow(6) || item.userId == user.id)) return player.notify(player.user.LangString("mining.96a949ab42feff46219ff96c20a76e9d"), 'error');
    const cfg = getMiningLevel(item.miningData.level);
    if (!cfg) return;
    const nextLevel = cfg.next;
    if (!nextLevel) return player.notify(player.user.LangString("mining.2599fb3f963f6ea5f9491c8828a73ba5"), 'error');
    const cfgNext = getMiningLevel(nextLevel);
    if (!cfgNext) return;
    if (cfgNext.requireMoney && user.money < cfgNext.requireMoney) return player.notify(player.user.LangString("mining.8e28f0923b7f2e2b5024a7619aae8d6e", system.numberFormat(cfgNext.requireMoney)), 'error')
    let allhave = true;
    if (cfgNext.requireItems) cfgNext.requireItems.map(q => {
        if (allhave && !user.haveItem(q)) {
            allhave = false;
            player.notify(player.user.LangString("mining.fb05147d936ed73bbed3d9f17849b764", getBaseItemNameById(q)), 'error')
        }
    })
    if (!allhave) return;
    if (cfgNext.requireMoney) user.removeMoney(cfgNext.requireMoney, true, user.LangString("mining.17972a53384f0943b86d1a186fec01f9"));
    let items: ItemEntity[] = []
    if (cfgNext.requireItems) cfgNext.requireItems.map(q => {
        const itemq = user.haveItem(q)
        if (itemq) items.push(itemq)
    })
    if (items.length > 0) inventory.deleteItems(...items);
    item.miningData = {...item.miningData, level: nextLevel};
    item.save();
    player.notify(player.user.LangString("mining.6f7e482baf7b492e608dd77b3a92db24"), 'success');

    fireSocket(item)
})

export const miningMenu = (player: PlayerMp, item: HouseEntity) => {
    const user = player.user;
    if (!item.userId || (!user.isAdminNow(6) && item.userId != user.id)) return player.notify(player.user.LangString("mining.1b3f1cebad23745e35d3907b49c1e543"))
    if (!item.miningData) {
        const m = menu.new(player, player.user.LangString("mining.3c3aadb7e71a2b319b50e444ae602828"), `${item.name} №${item.id}`)
        m.newItem({
            name: langStringDefault("mining.e35a59fa51101aa56ed1aad84470d275"),
            onpress: async () => {
                if (item.miningData) return player.notify(player.user.LangString("mining.92fa4dafdac1bfdbf6a604e9ad53ff6f"), 'error');
                if (!(user.isAdminNow(6) || item.userId == user.id)) return player.notify(player.user.LangString("mining.b44207eb0345e623ac7a6c678b374c5d"), 'error');
                
                let canInstall = true;
                const usersInAccount = await UserEntity.find({ account: player.user.account });
                usersInAccount.map(u => {
                    const house = houses.getByOwner(u.id);
                    if (house && house.miningData) canInstall = false;
                });
                if (!canInstall) return player.notify(player.user.LangString("mining.ada5b4acb74e864c3ea532d77236571b"), 'error');
                
                const itemInt = user.haveItem(3001)
                if (!itemInt) return player.notify(player.user.LangString("mining.b1028affe503095a0e4eb74c19e9e4de", getBaseItemNameById(3001)), 'error');
                m.close()
                itemInt.useCount(1, player);
                item.miningData = {...MiningHouseDefault};
                item.save();
                player.notify(player.user.LangString("mining.117866067a3dbc7847877772d21d116d"), 'success');
                miningMenu(player, item)
            }
        })
        m.open()
    } else {
        if(!mp.config.announce && user.isAdminNow(6)){
            inventoryShared.items.filter(q => q.type == ITEM_TYPE.MINING).map(q => {
                if(!user.haveItem(q.item_id)) inventory.createItem({item_id: q.item_id, owner_type: OWNER_TYPES.PLAYER, owner_id: user.id, temp: 1});
            })
        }
        user.setGui('mining', 'mining:data', item.id, JSON.parse(getMiningCefData(player, item)));
        return;
    }
}

export const sendMiningData = (player: PlayerMp, house: HouseEntity) => {
    if(!house) return;
    const miningData = house.miningData;
    CustomEvent.triggerClient(player, 'mining:data', house.id, house.interrior, miningData ? miningData.cards : null, miningData ? miningData.powers : null);
}

const sellCrypto = (player: PlayerMp, amount: number) => {
    const user = player.user;
    if (!user) return;
    if (!amount || amount < 0 || amount > 999999) return;
    if (amount > user.crypto) return player.notify(player.user.LangString("mining.076cba8f62d1527e9b7d28e8c638357c"), 'error');
    const cost = amount * MINING_SELL_COEFFICIENT;
    user.removeCryptoMoney(amount, true, user.LangString("mining.e27eaa9f6d9d871b8faec02e22b9c8c9"));
    user.addMoney(cost, true, user.LangString("mining.0f491bee2556cea914f224e77423e779"));
    menu.close(player);
}

const buyCrypto = async (player: PlayerMp, amount: number) => {
    const user = player.user;
    if (!user) return;
    const cost = amount * cryptoCost;
    const status = await user.tryPayment(cost, 'all', () => true, user.LangString("mining.fe245bd74bd36492a13dd8c7c5aa67d3"), user.LangString("mining.8b2e6d67c1a5256ed1382b07ab3fddfb"));
    if (!status) return;
    user.addCryptoMoney(amount, true, user.LangString("mining.485044e9d72b728c6c4f23f2ac5c6ad8"));
}

setTimeout(() => {
    calculatePowerForCoin();
}, 10000)
setInterval(() => {
    calculatePowerForCoin();
}, MINING_TICK_INTERVAL * 60000 * 10)

let currentPowerForCoin = 100;


colshapes.new(COIN_SELL_POS, player => player?.user?.LangString("mining.cf6d1e412d42e448a46626ee60ea3541") ?? langStringDefault("mining.cf6d1e412d42e448a46626ee60ea3541"), player => {
    const user = player.user;
    if(!user) return;
    if(!user.crypto_number) user.newCryptoNumber()
    const m = menu.new(player, player.user.LangString("mining.97a1940b070cb3f20797387fa6ba09bf"));
    m.newItem({
        name: langStringDefault("mining.80bd33fadb6e8236f770868b75679e5f"),
        more: `${system.numberFormat(user.crypto)}`,
    })
    m.newItem({
        name: langStringDefault("mining.d08213a0519d9e7bd14127eb5fc66717"),
        more: langStringDefault("mining.3f60a7edc9b20f68e178112822dc9095", system.numberFormat(cryptoCost)),
    })
    m.newItem({
        name: langStringDefault("mining.ed20b3e53fbf666ad8e7f4352a4cec11"),
        more: langStringDefault("mining.2f75468fc208f3a4cedab9b58799395a", MINING_SELL_COEFFICIENT),
        desc: langStringDefault("mining.ad6664f54e58397a49e44ed050c6ba33")
    })
    m.newItem({
        name: langStringDefault("mining.d477f72b3c03cbffa9e287177dbb0981"),
        onpress: () => {
            menu.input(player, player.user.LangString("mining.64e6d0bd08c74c7995d5146f691aef53"), '', 6, 'int').then(sum => {
                buyCrypto(player, sum)
            })
        }
    })
    m.newItem({
        name: langStringDefault("mining.b15699dc01633f26c2ee1d9674c4c7e5"),
        onpress: () => {
            menu.input(player, player.user.LangString("mining.144424d3cc15f5626fca78b40c1f6767"), '', 6, 'int').then(sum => {
                sellCrypto(player, sum);
            })
        }
    })

    m.open();
}, {
    type: 27,
    radius: 3,
})

export const miningTick = (item: HouseEntity) => {
    const miningData = item.miningData;
    if(!miningData) return 0;
    const data = calculateMiningFarmData(miningData);
    if(!data || data.power.current > data.power.max) return 0;

    if (UserStatic.get(item.userId)) {
        const coins = data.tf / currentPowerForCoin;
        item.miningData = {...item.miningData, amount: item.miningData.amount + coins};
        fireSocket(item);
    }

    return data.tf;
}

CustomEvent.register('newDay1', () => {
    const date = new Date()
    const dayOfTheMonth = date.getDate()
    
    if (dayOfTheMonth % 2) {
        houses.data.forEach(item => {
            if (item.userId) {
                const playedHours = UserStats.monthlyOnline.data.find(o => o.id === item.userId)?.hours
                const averagePlayed = playedHours / dayOfTheMonth
                const randomLimit = system.getRandomInt(5, 12)
                
                if (averagePlayed > randomLimit) {
                    const randomComponent = system.randomArrayElement(["videocards", "cpu", "powers", "alghoritm", "rams"])
                    const data = item.miningData
                    
                    if (randomComponent === "cpu") data.cpu = null;
                    else if (randomComponent === "alghoritm") data.algorithm = 0;
                    else if (randomComponent === "videocards" && data.cards[0]) data.cards[0] = 0;
                    else if (randomComponent === "powers" && data.powers[0]) data.powers[0] = 0;
                    else if (randomComponent === "rams" && data.ram[0]) data.ram[0] = 0;
                    
                    item.miningData = {...data};
                    saveEntity(item);
                }
            }
        })
    } 
})

gui.chat.registerCommand('testmining', (player) => {
    if (!player.user || !player.user.isAdminNow(7)) return
    
    const date = new Date()
    const dayOfTheMonth = date.getDate()

    houses.data.forEach(item => {
        if (item.userId) {
            const playedHours = UserStats.monthlyOnline.data.find(o => o.id === item.userId)?.hours ?? 0
            const averagePlayed = playedHours / dayOfTheMonth
            const randomLimit = system.getRandomInt(5, 12)

            if (averagePlayed > randomLimit) {
                const randomComponent = system.randomArrayElement(["videocards", "cpu", "powers", "alghoritm", "rams"])
                const data = item.miningData

                if (randomComponent === "cpu" && data.cpu) {
                    player.outputChatBox('alg ' + item.id)
                }
                else if (randomComponent === "alghoritm" && data.algorithm) player.outputChatBox('alg ' + item.id);
                else if (randomComponent === "videocards" && data.cards[0]) player.outputChatBox('videocards ' + item.id);
                else if (randomComponent === "powers" && data.powers[0]) player.outputChatBox('powers ' + item.id);
                else if (randomComponent === "rams" && data.ram[0]) player.outputChatBox('rams ' + item.id);
            }
        }
    })
})


gui.chat.registerCommand('resetmining', (player) => {
    if (!player.user || !player.user.isAdminNow(7)) return

    const date = new Date()
    const dayOfTheMonth = date.getDate()
    
    houses.data.forEach(item => {
        if (item.userId) {
            const playedHours = UserStats.monthlyOnline.data.find(o => o.id === item.userId)?.hours
            const averagePlayed = playedHours / dayOfTheMonth
            const randomLimit = system.getRandomInt(5, 12)

            if (averagePlayed > randomLimit) {
                const randomComponent = system.randomArrayElement(["videocards", "cpu", "powers", "alghoritm", "rams"])
                const data = item.miningData

                if (randomComponent === "cpu" && data.cpu) data.cpu = null;
                else if (randomComponent === "alghoritm" && data.algorithm) data.algorithm = 0;
                else if (randomComponent === "videocards" && data.cards[0]) data.cards[0] = 0;
                else if (randomComponent === "powers" && data.powers[0]) data.powers[0] = 0;
                else if (randomComponent === "rams" && data.ram[0]) data.ram[0] = 0;

                item.miningData = {...data};
                saveEntity(item);
            }
        }
    })
})

setInterval(() => {
    let sum = 0;
    houses.data.forEach(item => {
        const q = miningTick(item);
        if(q) sum += q;
    })
    if(sum > 0) currentPowerForCoin = MINING_TF_INDEX_BASE_COIN / sum;
}, 60000 * MINING_TICK_INTERVAL)