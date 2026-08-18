import { langStringDefault } from "../../shared/lang";
import { CustomEvent } from "./custom.event";
import { JAIL_PC_COORDS, PRISON_DATA, TRY_RUN_ADD_TIME } from "../../shared/jail";
import { colshapes } from "./checkpoints";
import { menu } from "./menu";
import { User } from "./user";
import { ARREST_MONEY } from "../../shared/economy";
import { FamilyReputationType } from '../../shared/family'
import { inventory } from './inventory'
import { inventoryShared } from '../../shared/inventory'
import { Family } from './families/family'
import {fractionCfg} from "./fractions/main";

CustomEvent.registerClient('jail:sync', (player, time: number, admin: boolean) => {
    if (!player.user) return;
    const user = player.user;
    if (admin) {
        user.jail_time_admin = time;
    } else {
        user.jail_time = time;
    }
    if (time === 0) {
        if (admin) {
            player.notify(player.user.LangString("jail.265ff4880c444ba51d52f832f759e1c9"), 'success');
            user.jail_time_admin = 0;
            user.jail_reason_admin = "";
            user.returnToOldPos();
        } else {
            player.notify(player.user.LangString("jail.3fcb04981c064c492b531f6f432ab63b"), 'success');
            user.jail_time = 0;
            user.jail_reason = "";
            user.teleport(PRISON_DATA[2].x, PRISON_DATA[2].y, PRISON_DATA[2].z, 0, 0);
        }
        user.save();
    }
    user.adminRestore();
})

const jailSync = (player: PlayerMp, time: number, admin: boolean) => {
    if (!player.user) return;
    const user = player.user;
    if (admin) {
        user.jail_time_admin = time;
    } else {
        user.jail_time = time;
    }
    if (time === 0) {
        if (admin) {
            player.notify(player.user.LangString("jail.1ed2ec1c8df144c0d321bdbe96955f92"), 'success');
            user.jail_time_admin = 0;
            user.jail_reason_admin = "";
            user.returnToOldPos();
        } else {
            player.notify(player.user.LangString("jail.8e68e6bc2a9af46535f6f7a3e71b8c81"), 'success');
            user.jail_time = 0;
            user.jail_reason = "";
            user.teleport(PRISON_DATA[2].x, PRISON_DATA[2].y, PRISON_DATA[2].z, 0, 0);
        }
        user.save();
    }
    user.adminRestore();
}

CustomEvent.registerClient('jail:tryRun', player => {
    const user = player.user;
    if (!user) return;
    if (user.isAdminNow()){
        user.jail_time_admin = 0;
        user.jail_time = 0;
        user.jail_reason_admin = "";
        user.jail_reason = "";
        user.save();
        return CustomEvent.triggerClient(player, 'jail:clear');
    }
    if(user.jail_time_admin){
        user.jail_time_admin += TRY_RUN_ADD_TIME * 60;
        user.jailSync()
    } else if(user.jail_time){
        user.jail_time += TRY_RUN_ADD_TIME * 60;
        user.jailSync()
    }
})

/*
colshapes.new(JAIL_PC_COORDS, 'Регистрация арестанта', (player, index) => {
    const user = player.user;
    if (!user) return;
    const m = menu.new(player, "База заключённых", "Регистрация арестанта");
    if (user.is_police) {
        m.newItem({
            name: "Список текущих заключённых",
            onpress: () => {
                const s = () => {
                    const submenu = menu.new(player, "База заключённых", "Список текущих заключённых");
                    mp.players.toArray().filter(target => target.user && target.user.jail_time && !target.user.jail_time_admin).map(target => {
                        submenu.newItem({
                            name: `${target.user.name} (${target.user.id})`,
                            more: target.user.jail_time > 120 ? `${Math.floor(target.user.jail_time / 60)} мин.` : `${target.user.jail_time} сек.`,
                            desc: `Причина: ${target.user.jail_reason}`,
                            onpress: () => {
                                menu.accept(player, "Вы хотите освободить заключённого?").then(status => {
                                    if(!status) return s();
                                    if(!mp.players.exists(target)) return player.notify("Игрок куда то пропал", "error");
                                    user.log('gosJob', `Освободил из тюремного заключения. Данные по предыдущему заключению - ${target.user.jail_time} минут. Причина - ${target.user.jail_reason}`, target);
                                    target.user.jail_time = 0;
                                    target.user.jail_reason = "";
                                    CustomEvent.triggerClient(target, 'jail:clear');
                                    jailSync(target, 0, false);
                                    s();
                                })
                            }
                        })
                    })
                    submenu.open();
                }
                s();
            }
        })
        m.newItem({
            name: "Список адвокатов в сети",
            onpress: () => {
                const s = () => {
                    const submenu = menu.new(player, "Справочник", "Список адвокатов в сети");
                    mp.players.toArray().filter(target => target.user && target.user.fraction == 1 && target.user.tag && target.user.tag.toLowerCase().includes('адвокат') && !target.user.attachedToPlace).map(target => {
                        submenu.newItem({
                            name: `${target.user.name} (${target.user.id})`,
                            onpress: () => {
                                menu.accept(player, "Вы хотите вызвать адвоката?").then(status => {
                                    if(!status) return s();
                                    if(!mp.players.exists(target)) return player.notify("Адвокат куда то пропал", "error");
                                    const pos = {...player.position};
                                    // target.notifyWithPicture(`Поступил вызов для оказания услуг адвоката`, 'Диспетчер', text, 'CHAR_CHAT_CALL', 10000);
                                    menu.accept(target, 'Поступил вызов для оказания услуг адвоката', 'small', 30000).then(status => {
                                        if(!status) return;
                                        if (player) player.notify(`Адвокат ${target.user.id} принял вызов`);
                                        target.user.setWaypoint(pos.x, pos.y, 0, `Вызов для оказания услуг адвоката`, true);
                                    })
                                    s();
                                })
                            }
                        })
                    })
                    submenu.open();
                }
                s();
            }
        })
        m.newItem({
            name: "Зарегистрировать арестанта",
            onpress: async () => {
                const target = await user.selectNearestPlayer(5)
                if(!target) return;
                if (!target.user.cuffed) return player.notify("Арестант должен быть в наручниках", "error");
                if (!target.user.wanted_level) return player.notify("Арестант не подходит ни под одну из ориентировок", "error");
                if (target.user.wanted_level >= 4 && index !== 0) return player.notify("Особо опасных преступников необходимо конвоировать к тюрьме", 'error')
                menu.input(player, "Введите причину ареста", target.user.wanted_reason, 30).then(val => {
                    if(!val) return;
                    if(!mp.players.exists(target)) return player.notify("Арестант пропал", "error");
                    if (!target.user.cuffed) return player.notify("Арестант должен быть в наручниках", "error");
                    if (!target.user.wanted_level) return player.notify("Арестант не подходит ни под одну из ориентировок", "error");
                    if (target.user.wanted_level >= 4 && index !== 0) return player.notify("Особо опасных преступников необходимо конвоировать к тюрьме", 'error')
                    player.user.addMoney(ARREST_MONEY, true, 'Арест игрока '+target.user.name)
                    target.user.jail(player, val);
                    player.notify("Арестант доставлен в тюрьму", "success")
                })
            }
        })
    } 
    m.open();
})
 */

CustomEvent.registerCef('tablet:clearWanted', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    if(!user.is_police) return;
    const target = User.get(id);
    if(target){
        target.user.writeRpHistory(langStringDefault("jail.e050dac08abacc53cbbe727f304e3817", fractionCfg.getFractionName(player.user.fraction), player.user.id, target.user.wanted_level, target.user.wanted_reason))
        target.user.clearWanted()
    } else {
        User.getData(id).then(data => {
            if(!data) return;
            User.writeRpHistory(id,langStringDefault("jail.c4627dbcc864959803b16fbc199e7059", fractionCfg.getFractionName(player.user.fraction), player.user.id, data.wanted_level, data.wanted_reason))
            data.wanted_level = 0;
            data.wanted_reason = "";
            data.save();
        })
    }
})
CustomEvent.registerCef('tablet:setWanted', (player, id: number, lvl: number, reason: string) => {
    const user = player.user;
    if(!user) return;
    if(!user.is_police) return;
    const target = User.get(id);
    if(target){
        if(target.user.dead) return player.notify(player.user.LangString("jail.fa910de4ec34a6dd385cdd35123f8829"))
        target.user.giveWanted(lvl as any, reason, user)
    } else {
        User.getData(id).then(data => {
            if(!data) return;
            User.writeRpHistory(id,langStringDefault("jail.47052ee90a8b56a6d30a86d9e64241af", user.name, user.id, lvl, reason))
            data.wanted_level = lvl as any;
            data.wanted_reason = reason;
            data.save();
        })
    }
})