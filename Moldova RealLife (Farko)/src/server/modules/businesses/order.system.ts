import { langStringDefault } from "../../../shared/lang";
import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE} from "../../../shared/business";
import {system} from "../system";
import {business, businessCatalogItemName, businessDefaultCostItem} from "../business";
import {
    ORDER_CAR_HEADING,
    ORDER_CAR_MODELS,
    ORDER_CAR_POS,
    ORDER_CONFIG,
    ORDER_LOAD_COORDS,
    ORDER_MENU_POS
} from "../../../shared/order.system";
import {colshapes} from "../checkpoints";
import {Vehicle} from "../vehicles";
import {User} from "../user";
import {LEVEL_PERMISSIONS} from "../../../shared/level.permissions";
import {MenuItem} from "../../../shared/menu";
import {JOB_TASK_MANAGER_EVENT} from "../battlePass/tasks/jobTaskManager";


export const order_list: { sum: number, comission: number, id: number, biz: number, items: [number, number][], time: number, deliver: number, fake?:true }[] = []

const createFakeOrder = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (order_list.find(item => !item.deliver && !item.fake)) return player.notify(user.LangString("order.system.1736d0632949dc0dc25d8ad434de31c5"), "error", player.user.LangString("order.system.37d7fcd1527c8ba8a816fac0b9754cef"));
    if (order_list.find(q => q.deliver === user.id)) return player.notify(player.user.LangString("order.system.1b1a9d19854ebc7248c6ec3d43c390e9"), "error", player.user.LangString("order.system.e8bff8c437538c83c238838e24b9a8b2"));
    const commission = system.getRandomInt(ORDER_CONFIG.NPC_DELIVER_COST_MIN, ORDER_CONFIG.NPC_DELIVER_COST_MAX);

    const biz = system.randomArrayElement(
        business.data
            .filter(b => [
                    BUSINESS_TYPE.FUEL,
                    BUSINESS_TYPE.DRESS_SHOP,
                    BUSINESS_TYPE.ITEM_SHOP,
                    BUSINESS_TYPE.BAR,
                    BUSINESS_TYPE.BARBER
                ].includes(b.type)
            )
            .filter(b => b.dimension === 0)
    );

    if(!biz) return;
    let deposit = ((commission / 100) * ORDER_CONFIG.ZALOG)
    if (!user.tryRemoveBankMoney(deposit, true, user.LangString("order.system.c8b5b0a89ec67f6421e542328a6a9439"), user.LangString("order.system.e91179b930e28261b4f73b9e0e6a89f2"))) return;
    player.notify(player.user.LangString("order.system.90884857436c9521aaf8fa51f588330a"), "success", player.user.LangString("order.system.7210d913c40e6ec174c060e118136580"));
    menu.close(player);
    order_list.push({
        sum: 0,
        comission: commission,
        id: system.personalDimension,
        biz: biz.id,
        items: [],
        time: system.timestamp,
        deliver: user.id,
        fake: true
    })
}

colshapes.new(ORDER_CAR_POS, player => player?.user?.LangString("order.system.63e7cbde4bb97c0b19fb53f41ea2c40b") ?? langStringDefault("order.system.63e7cbde4bb97c0b19fb53f41ea2c40b"), (player, index) => {
    const user = player.user;
    if (!user) return;
    if (user.playtime < LEVEL_PERMISSIONS.DELIVER) return player.notify(player.user.LangString("order.system.c44292a6d9da2df75cea51ddb817d401", LEVEL_PERMISSIONS.DELIVER))
    const m = menu.new(player, player.user.LangString("order.system.e9d6f1efa7f4dbac99680a6503ef6961"), player.user.LangString("order.system.b87c67b26c80d65e87b8adb6e57f133c"));
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;

    if (user.deliverJobCar) {
        m.newItem({
            name: langStringDefault("order.system.3b7d0f03c1cc5812ad1dbb0fd06e46a7"),
            more: `$${system.numberFormat(ORDER_CONFIG.VEHICLE_RENT_RETURN)}`,
            onpress: () => {
                if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
                if (!user.deliverJobCar) return player.notify(player.user.LangString("order.system.6b62bc9177ba15a77f7010d268486916"), "error");
                if (user.deliverJobLoaded) return player.notify(player.user.LangString("order.system.ad101cf57dca5410ed213b344f80472e"), "error");
                user.addBankMoney(ORDER_CONFIG.VEHICLE_RENT_RETURN, true, user.LangString("order.system.69b49d433745e983442bed636c85cc8d"), user.LangString("order.system.deae59263487311327b4480caa64b7d1"))
                if (user.deliverJobCar && mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar.destroy();
                user.deliverJobCar = null
                user.deliverJobLoaded = false
                m.close();
            }
        })
    } else {
        ORDER_CAR_MODELS.map(([model, cost, level]) => {
            const name = Vehicle.getName(model);
            m.newItem({
                name,
                more: `$${system.numberFormat(cost)}`,
                desc: langStringDefault("order.system.0098fdd290eedfcfbca8696b8bf42f16", level),
                onpress: () => {
                    //if (user.fraction) return player.notify("Нельзя работать в службе доставки работая в организации", 'error')
                    if (user.deliverJobCar) return player.notify(player.user.LangString("order.system.386d3587f4c6c38b1fd364fce3148e7c"), "error");
                    if (!user.bank_have) return player.notify(player.user.LangString("order.system.29a5ef53bce22e1460abc941b3c78fa7"), "error");
                    if(level && player.user.entity.deliver_level < level) return player.notify(player.user.LangString("order.system.6bb5711859f171d01b99a36b244cf730"), "error");
                    if (!user.tryRemoveBankMoney(cost, true, user.LangString("order.system.f72fde050307774506d0470f20e8411c"), user.LangString("order.system.fa26248c5fcfaa87e7389cced8457957"))) return;

                    menu.close(player);
                    user.deliverJobCar = Vehicle.spawn(model, new mp.Vector3(ORDER_CAR_POS[index].x, ORDER_CAR_POS[index].y, ORDER_CAR_POS[index].z + 1), ORDER_CAR_HEADING, 0, true, false);
                    user.deliverJobLoaded = false
                    setTimeout(() => {
                        if (!mp.players.exists(player)) return;
                        if (!mp.vehicles.exists(user.deliverJobCar)) return;
                        player.user.putIntoVehicle(user.deliverJobCar, 0);
                    }, 500)
                }
            })
        })
    }

    m.open();
}, {
    radius: 3,
    type: 27
})

export const needUnload = (player: PlayerMp, biz: BusinessEntity) => {
    const user = player.user;
    if (!user) return false;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    let item = order_list.find(q => q.deliver === user.id);
    if(!item) return false;
    if(item.biz !== biz.id) return false;

    return true;
}

export const deliverSet = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    if (!user.deliverJobCar) return player.notify(player.user.LangString("order.system.4abeed9c76805032fa78829ac3a2f02c"), "error", player.user.LangString("order.system.4c19f55d1bfe700c7c4bb9cb5a962d85"));
    if (!user.deliverJobLoaded) return player.notify(player.user.LangString("order.system.fab5827737745609f1a54c2359306d6f"), "error", player.user.LangString("order.system.ae73270da815fab6e3a386c74389a2fb"));
    if(player.dimension == 0 && system.distanceToPos(user.deliverJobCar.position, player.position) > 60) return player.notify(player.user.LangString("order.system.17be9edd2fcd283d716f16fd3ea27fd7"), "error");
    let item = order_list.find(q => q.deliver === user.id);
    if (!item) return player.notify(player.user.LangString("order.system.96b1bb3fdc8a313ea396b0447076aa36"), "error", player.user.LangString("order.system.802511e38a8d0766666da35172a5e3e6"));
    const biz = business.get(item.biz);
    if (!biz) return;
    if(!item.fake){
        biz.reserve_money -= item.sum;
        const catalog = [...biz.catalog];
        item.items.map(([id, count]) => {
            const q = catalog.find(s => s.item === id);
            if(q) q.count+=count;
        })
        biz.catalog = catalog;
        if (biz.userId){
            const owner = User.get(biz.userId);
            if (owner) owner.notify(owner.user.LangString("order.system.9dc02a229fb1befb20e83b2f49475a03"), "success", owner.user.LangString("order.system.82e36c714f45d411241ecc454a7a054b"));
        }
        biz.save();
    }
    let zalog = ((item.comission / 100) * ORDER_CONFIG.ZALOG)
    let comission = item.comission;
    let multiple = 0;
    if(player.user.entity.deliver_level > 0) multiple = (comission / 100 * (ORDER_CONFIG.PERCENT_COST_ADD_PER_LEVEL * player.user.entity.deliver_level))
    player.user.entity.deliver_total++;
    player.user.entity.deliver_current++;
    if(player.user.entity.deliver_current >= ORDER_CONFIG.LEVEL_STEP){
        player.user.entity.deliver_current = 0;
        player.user.entity.deliver_level = player.user.entity.deliver_level + 1;
    }
    player.user.achiev.achievTickByType("deliverCount")
    player.user.achiev.achievTickByType("deliverSum", comission)
    mp.events.call(JOB_TASK_MANAGER_EVENT, player, "trucker")
    user.addBankMoney(comission, true, user.LangString("order.system.acc6b60d7853b619bd48b8729adaf835"), user.LangString("order.system.5b0448528bca968bb1a5d3067298c9b6"))
    setTimeout(() => {
        if(multiple){
            user.addBankMoney(multiple, true, user.LangString("order.system.fe6bb1c49eb9597f4dd35e00631cb5b1"), user.LangString("order.system.6176cffa25df8fafe49dd97c1d06f2a7"))
        }
        user.addBankMoney(zalog, true, user.LangString("order.system.ab3641519a682c5d33510b72d64115be"), user.LangString("order.system.b7319a648e89b085f43ad5945df75caa"))
    }, 3000)
    user.deliverJobLoaded = false
    if(order_list.findIndex(q => q.id === item.id) > -1)order_list.splice(order_list.findIndex(q => q.id === item.id), 1);
}


colshapes.new(ORDER_MENU_POS, langStringDefault("order.system.0bf9d23c1e27ca0a299563ef5e72db42"), player => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    const m = menu.new(player, player.user.LangString("order.system.30f825fa89e9c32465d9d5b3d02d0f20"), player.user.LangString("order.system.feb6670da671c1d263a0795ed3eba785"));
    m.newItem({
        name: langStringDefault("order.system.9b33f5db7bd9cefdcd7bf81d7f027f34"),
        more: langStringDefault("order.system.63d627ff5db6cc70fde2f7e65274bbca", user.entity.deliver_level, player.user.entity.deliver_current, ORDER_CONFIG.LEVEL_STEP)
    })
    m.newItem({
        name: langStringDefault("order.system.2ea69b4e3d3d4bfa4d3ad405c5b76107"),
        desc: langStringDefault("order.system.f832914836cacd2636d4baca34f15009", system.numberFormat((ORDER_CONFIG.NPC_DELIVER_COST_MIN)), system.numberFormat(ORDER_CONFIG.NPC_DELIVER_COST_MAX), ORDER_CONFIG.ZALOG),
        onpress: () => {
            if (!user.deliverJobCar) return player.notify(player.user.LangString("order.system.257232e1259168d42154a22251c3ac88"), "error", player.user.LangString("order.system.47943ae4c2af38dd7732f1d39803f66f"));
            createFakeOrder(player)
        }
    })
    order_list.map(item => {
        if (item.deliver) return;
        if (item.fake) return;
        if ((item.time + (ORDER_CONFIG.AFK_TIME * 50)) < system.timestamp) return;

        const biz = business.get(item.biz);
        if (!biz) return;
        let zalog = ((item.comission / 100) * ORDER_CONFIG.ZALOG)
        m.newItem({
            name: `${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]}`,
            more: langStringDefault("order.system.ab89a6a482dba9a59fa894141f69948c", system.numberFormat(item.comission)),
            desc: langStringDefault("order.system.9b910351a8ef91e7bd4630a037669cad", system.numberFormat(zalog)),
            onpress: () => {
                if (!user.deliverJobCar) return player.notify(player.user.LangString("order.system.32b1d236aa228e6ef139e6fc8eb72ef0"), "error", player.user.LangString("order.system.8b1497c19361faf3aee3684689c04ce9"));
                if (item.deliver) return player.notify(player.user.LangString("order.system.66657c5fac4290949d2b0db2f8a9aeb9"), "error", player.user.LangString("order.system.36a5c39f836099233faada8d4b9bcf58"));
                if (order_list.find(q => q.deliver === user.id)) return player.notify(player.user.LangString("order.system.296976dac0f6513c5f77247711ce7096"), "error", player.user.LangString("order.system.9a448d322d87f91a1e29e23745b94446"));
                if (!user.tryRemoveBankMoney(zalog, true, user.LangString("order.system.60f0e0a2a8d62f2de70d3c05e605677d"), user.LangString("order.system.11701a23344d63b838e3213d955c7eae"))) return;
                item.deliver = user.id;
                player.notify(player.user.LangString("order.system.cd0107fdf37675c2957a4d95b237bceb"), "success", player.user.LangString("order.system.9fa9e8f84ff2035b1d9cc38e7da0a0a1"));
                menu.close(player);
            }
        })

    })

    m.open();
}, {
    radius: 3,
    type: 27
})

colshapes.new(ORDER_LOAD_COORDS, langStringDefault("order.loadingArea"), (player, index) => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    if (!user.deliverJobCar) return player.notify(player.user.LangString("order.system.aeae4124dcb12a145176054efc7c1560"), "error", player.user.LangString("order.system.fdabaadc8aacdfb173a76b2c502070e9"));
    const veh = user.deliverJobCar;
    if(user.deliverJobLoaded) return player.notify(player.user.LangString("order.system.82e670a17c54ef804c7587dea54f0631"), "error")
    if(mp.labels.toArray().find(q => q.deliver === index)) return player.notify(player.user.LangString("order.system.e5ea55bf392f5861fefa688364084cab"), "error")
    const check = () => {
        if(!mp.players.exists(player)) return false;
        if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
        if (!user.deliverJobCar){
            player.notify(player.user.LangString("order.system.a57a966d59a63658809f0f65e9b4903f"), "error", player.user.LangString("order.system.01df83cfae87d96792427c4c5dea574b"));
            return false
        }
        let item = order_list.find(q => q.deliver === user.id);
        if (!item) {
            player.notify(player.user.LangString("order.system.ce3c5d94db1e06510b7bbc2cbdf05c5e"), "error", player.user.LangString("order.system.52c82882b69ef838c5d3bae11457e1a8"));
            return false;
        }
        if (user.deliverJobLoaded){
            player.notify(player.user.LangString("order.system.734ddcafa19d77ce21f0a197d0cb59e7"), "error", player.user.LangString("order.system.6de85eeff7efeb695ca9185456d02c62"));
            return false;
        }
        if(!mp.vehicles.exists(veh)){
            player.notify(player.user.LangString("order.system.2b3336ac3333ad8b1e9d660a4a494d42"), "error", player.user.LangString("order.system.10c98cb9a358553807d52ddac64bec79"));
            return false;
        }
        if (system.distanceToPos2D(veh.position, ORDER_LOAD_COORDS[index]) > 5){
            player.notify(player.user.LangString("order.system.bbd77ab72f664c6287944233d775b85b"), "error", player.user.LangString("order.system.db0024ddcd0aa8ffb4f2611329bc976a"));
            return false;
        }
        return true;
    }
    if (!check()) return;
    player.notify(player.user.LangString("order.system.ce20016eb2aeeb04a08dfe82695e4483"), "error");
    let t = 30;
    let text = mp.labels.new(langStringDefault("order.system.bd837ad2ff9b2386e874b6a32e1633fc", t), ORDER_LOAD_COORDS[index], {
        dimension: player.dimension,
        drawDistance: 5,
        los: false
    })
    text.deliver = index
    let int = setInterval(() => {
        let q = check();
        t--;
        if (mp.labels.exists(text)) text.text = langStringDefault("order.system.f9f82d50a5f6a0a334b12e42f2fae843", t);
        if (t <= 0 || !q){
            if (mp.labels.exists(text)) text.destroy();
            clearInterval(int);
            if(!t){
                user.deliverJobLoaded = true;
                const biz = business.get(order_list.find(q => q.deliver === user.id).biz);
                if(!biz) return player.notify(player.user.LangString("order.system.41616aa175b13f69a16cd5cc920a58aa"), "error");
                player.notify(player.user.LangString("order.system.3b0e43bd64fc8aabcff841d60ba84aca"), "success");
                user.setWaypoint(biz.positions[0].x, biz.positions[0].y, biz.positions[0].z, user.LangString("order.system.0bf9d23c1e27ca0a299563ef5e72db42"), true);
            }
        }
    }, 1000)
}, {
    radius: 5,
    type: 27
})

mp.events.add("playerQuit", player => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar.destroy();
    const index = order_list.findIndex(q => q.deliver === user.id)
    if(index == -1) return;
    let item = order_list[index];
    if(!item) return;
    if(item.fake) order_list.splice(index, 1)
    else order_list[index].deliver = null;
})


const getOrderSum = (biz: BusinessEntity, order: Map<number, number>) => {
    const items: [number, number][] = [];
    order.forEach((count, id) => {
        items.push([id, count])
    });

    let sum = 0;
    items.map(([item, count]) => {
        if (count == 0) return;
        let cost = businessDefaultCostItem(biz, item, count)
        sum += cost
    })
    if(biz.upgrade > 0 && [BUSINESS_TYPE.BAR, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.FUEL, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.TUNING].includes(biz.type)){
        sum = sum - (sum / 100 * (biz.upgrade * 10))
    }
    return sum
}

type BusinessCatalogFilterFunc = (
    businessEntity: BusinessEntity,
    catalog: typeof BusinessEntity.prototype.catalog
) => typeof BusinessEntity.prototype.catalog;

function createFilterByItemName(itemName: string): BusinessCatalogFilterFunc {
    const lowerCaseName = itemName.toLowerCase();

    return function (
        businessEntity: BusinessEntity,
        catalog: typeof BusinessEntity.prototype.catalog
    ) {
        return catalog.filter(item =>
            businessCatalogItemName(businessEntity, item.item)
                .toLowerCase().includes(lowerCaseName)
        )
    }
}

function createFilterByCountOnStock(lessThenCount: number): BusinessCatalogFilterFunc {
    return function (
        businessEntity: BusinessEntity,
        catalog: typeof BusinessEntity.prototype.catalog
    ) {
        return catalog.filter(item => item.count <= lessThenCount);
    }
}

export const orderDeliverMenu = (player: PlayerMp, biz: BusinessEntity) => {
    const user = player.user;
    if (!user) return;
    if (order_list.find(q => q.biz === biz.id && !q.fake)) return player.notify(player.user.LangString("order.system.b3e2c63221000a95205bc37f56176cdf"), "error")
    let order = new Map<number, number>();
    let catalogFilter: BusinessCatalogFilterFunc = null;

    const sm = () => {
        const m = menu.new(player, player.user.LangString("order.system.6ddb1eea740ba551708b8c4299712dc6"), "");

        const orderSumMenuItem: MenuItem = {
            name: langStringDefault("order.system.44b4c70236fab68ee281ad0ce5e24042"),
            more: `$${getOrderSum(biz, order)}`
        };

        const updateOrderSum = () => {
            orderSumMenuItem.more = `$${getOrderSum(biz, order)}`;
            m.updateItem(orderSumMenuItem);
        };

        const catalog = catalogFilter == null
            ? biz.catalog
            : catalogFilter(biz, biz.catalog);

        m.newItem({
            name: langStringDefault("order.system.e8b4376cf2fb8548bcd31344c237668e"),
            onpress: () => {
                menu.input(player, player.user.LangString("order.system.15f82bf990cbd0f6c47938cb3e5c548c"), 0, 6, "int").then(count => {
                    catalogFilter = createFilterByCountOnStock(count);
                    sm();
                });
            }
        });

        m.newItem({
            name: langStringDefault("order.system.f7c1152eeb4bf1a460cbb17d4dd1073c"),
            onpress: () => {
                menu.input(player, player.user.LangString("order.system.e67e64ba04551abef57ded6c85559cb8"), "", 20, "text").then(name => {
                    catalogFilter = createFilterByItemName(name);
                    sm();
                });
            }
        });

        m.newItem({
            name: langStringDefault("order.system.4aa2075dfdba28c4bded21c64dfe4738"),
            onpress: () => {
                catalogFilter = null;
                sm();
            }
        });

        catalog.map(item => {
            const canMax = item.max_count - item.count
            let name = businessCatalogItemName(biz, item.item)
            m.newItem({
                name,
                type: "range",
                desc: langStringDefault("order.system.a1066d0572b632bf1baa0751edd7a4b7", item.count, item.max_count),
                rangeselect: [0, canMax],
                listSelected: order.has(item.item) ? order.get(item.item) : 0,
                onchange: (val) => {
                    if (val) order.set(item.item, val)
                    else order.delete(item.item);

                    updateOrderSum();
                },
                onpress: () => {
                    menu.input(player, player.user.LangString("order.system.aa48126c3fc2c11227fc9beaa0ace5e7"), order.has(item.item) ? order.get(item.item) : 0, 6, "int").then(count => {
                        if(typeof count !== "number") return;
                        if(!count && count !== 0) return;
                        if(count < 0) return;
                        if(count > canMax) return;
                        if(count) order.set(item.item, count)
                        else order.delete(item.item)
                        sm();
                    })
                }
            })
        })

        m.newItem(orderSumMenuItem);

        m.newItem({
            name: langStringDefault("order.system.bfe5448ceaa9a9a6f91e92bc21899556"),
            desc: langStringDefault("order.system.b4dae2372e5cee62c8f633b5778f3a72"),
            onpress: () => {
                const sum = getOrderSum(biz, order);
                if (!sum) return player.notify(player.user.LangString("order.system.df8217f7b31922515db71b2c63bfb07c"), "error");
                if (sum < 10000) return player.notify(player.user.LangString("order.system.2c35d00c30d72f665714b6101fdea143"), "error");
                if (order_list.find(q => q.biz === biz.id)) return player.notify(player.user.LangString("order.system.20de05e99c4000beb48eec0c83b79afb"), "error"), menu.close(player);
                const submenu = menu.new(player, player.user.LangString("order.system.cc5f4ad653cc49e8231dc0ccbadf61bd"), player.user.LangString("order.system.8801324b00078d16d33557892ffdd44f"));
                const comission = ((sum / 100) * ORDER_CONFIG.COMISSION)
                submenu.newItem({
                    name: langStringDefault("order.system.34b59216ea66bc718a7e747516a7c07e"),
                    more: `$${system.numberFormat(sum)}`
                })
                submenu.newItem({
                    name: langStringDefault("order.system.3b8ec88e1b5d87b29a966d5932b3ef69"),
                    more: `$${system.numberFormat(comission)}`
                })
                submenu.newItem({
                    name: langStringDefault("order.system.8cd61c581a5a096b4f60c7a635eccb97"),
                    more: `$${system.numberFormat(sum + comission)}`
                })

                const resItems: [number, number][] = [];
                order.forEach((count, id) => {
                    resItems.push([id, count])
                });

                submenu.newItem({
                    name: langStringDefault("order.system.800c9d7a2460e69ac29e2be35e108c27"),
                    onpress: () => {
                        if (order_list.find(q => q.biz === biz.id)) return player.notify(player.user.LangString("order.system.fd7b6101e37f2e15d508bade5d22a47e"), "error"), menu.close(player);
                        if (biz.money < sum) return player.notify(player.user.LangString("order.system.085b5b5e0a1830a77623342e08de7fd2"), "error")
                        order_list.push({
                            sum: sum + comission,
                            comission,
                            id: system.personalDimension,
                            biz: biz.id,
                            items: resItems,
                            time: system.timestamp,
                            deliver: 0
                        })
                        business.removeMoney(biz, sum + comission, business.user.LangString("order.system.a1ec18e3f81fae72fcaacb6ed8d1978c"), true)
                        menu.close(player);
                        player.notify(player.user.LangString("order.system.8515dd48b0522e9eec79943c36ff7776"), "success");
                    }
                })

                submenu.open();
            }
        })

        m.open();
    }

    sm();

}

setInterval(() => {
    const current = system.timestamp;
    order_list.map((item, index) => {
        if (item.deliver) return;
        if ((item.time + (ORDER_CONFIG.AFK_TIME * 60)) < current) {
            if(!item.fake){
                const biz = business.get(item.biz);
                if (!biz) return;
                biz.reserve_money -= item.sum;
                const catalog = [...biz.catalog];
                item.items.map(([id, count]) => {
                    const q = catalog.find(s => s.item === id);
                    if (q) q.count += count;
                })
                biz.catalog = catalog;
                if (biz.userId) {
                    const owner = User.get(biz.userId);
                    if (owner) owner.notify(owner.user.LangString("order.system.92a575a8abbe960c8abf997036c83b29"), "success", "CHAR_BARRY");
                }
            }
            order_list.splice(index, 1)
        }
    })
}, 60000)