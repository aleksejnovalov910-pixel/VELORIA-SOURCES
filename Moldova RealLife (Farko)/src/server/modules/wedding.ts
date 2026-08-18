import {DivorceType, Person, WEDDING_NAME, WEDDING_POS, WEEDING_PAY} from "../../shared/wedding";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {User} from "./user";
import {saveEntity} from "./typeorm";
import {CustomEvent} from "./custom.event";
import {UserStatic} from "./usermodule/static";
import { LEVEL_PERMISSIONS } from "../../shared/level.permissions";

let weedingWas = new Map<number, boolean>();

function openWeddingMenu(player: PlayerMp) {
    if (player.user.partner) {
        player.user.setGui("marriage", "marriage:set", "Divorce");
    } else {
        const nearestPlayers = player.user
            .getNearestPlayers()
            .filter(p => !p.user.partner && p.user.is_male !== player.user.is_male)
            .map<Person>(p => {
                return {
                    name: p.user.name,
                    staticID: p.dbid
                }
            });

        player.user.setGui("marriage", "marriage:set", "Welcome", nearestPlayers);
    }
}

CustomEvent.registerCef("marriage::divorce", async (player, divorceType: DivorceType) => {
    if (!player || !player.user || !player.user.partner) {
        return;
    }

    if (divorceType === "money") {
        await divorceWithMoney(player);
    } else if (divorceType === "consent") {
        await divorceWithConsent(player);
    }
});

async function divorceWithConsent(player: PlayerMp) {
    const playerPartner = player.user.getNearestPlayers(2)
        .find(p => p.user && p.user.partner === player.user.id);

    if (!playerPartner) {
        const partnerText = player.user.male ? player.user.LangString("wedding.divorce.male") : player.user.LangString("wedding.divorce.female");
        return player.notify(player.user.LangString("wedding.divorce.notify", partnerText), "error");
    }

    player.notify(player.user.LangString("wedding.divorce.notify2"), "success");
    const partnerAnswer = await menu.accept(playerPartner, playerPartner.user.LangString("wedding.divorce.accept"));
    if (!mp.players.exists(player)) return;

    if (!partnerAnswer) {
        return player.notify(player.user.LangString("wedding.divorce.accept.fail"), "error");
    }

    player.user.setPartner(null);
    playerPartner.user.setPartner(null);

    player.notify(player.user.LangString("wedding.divorce.accept.ok"));
    playerPartner.notify(playerPartner.user.LangString("wedding.divorce.accept.ok"));
}

async function divorceWithMoney(player: PlayerMp) {
    const partnerUser = await User.getData(player.user.partner);
    if (!partnerUser) {
        return;
    }

    if (player.user.money < WEEDING_PAY) {
        return player.notify(player.user.LangString("wedding.divorce.nomoney"), "error");
    }

    player.user.removeMoney(WEEDING_PAY, true, "Geschieden");
    player.user.setPartner(null);

    partnerUser.partner = null;
    partnerUser.partnerId = 0;
    await saveEntity(partnerUser);

    player.notify(player.user.LangString("wedding.divorce.ok"), "success");
}

CustomEvent.registerCef("marriage::sendOffer", (player, targetId: number) => {
    const target = UserStatic.get(targetId);
    if (!target) {
        return;
    }

    if (isPlayerInMarriageProcess(target)) {
        return player.notify(player.user.LangString("wedding.marriage.busy"));
    }

    const playerData = [...player.user.name.split(" "), player.dbid];
    target.user.setGui("marriage", "marriage:set", "AcceptFrame", null, playerData);

    player.notify(player.user.LangString("wedding.marriage.notify", target.user.name));

    marriageProcesses.push({
        offerSender: player,
        senderSigned: false,
        offerTarget: target,
        targetSigned: false,
    });
});

function isPlayerInMarriageProcess(player: PlayerMp) {
    return marriageProcesses.some(process =>
        process.offerSender === player
        || process.offerTarget === player
    );
}

interface MarriageProcess {
    offerSender: PlayerMp,
    senderSigned: boolean,
    offerTarget: PlayerMp,
    targetSigned: boolean
}
const marriageProcesses: MarriageProcess[] = [];
CustomEvent.registerCef("marriage::accept", (player) => {
    const processIdx = marriageProcesses.findIndex(process => process.offerTarget === player);
    if (processIdx === -1) {
        return player.user.setGui(null);
    }

    if (!checkProcessValid(processIdx)) {
        return player.user.setGui(null);
    }

    const process = marriageProcesses[processIdx];
    process.offerSender.user.setGui("marriage", "marriage:set", "SignFrame");
    process.offerTarget.user.setGui("marriage", "marriage:set", "SignFrame");
});

CustomEvent.registerCef("marriage::decline", (player) => {
    const processIdx = marriageProcesses.findIndex(process => process.offerTarget === player);
    if (processIdx === -1) {
        return player.user.setGui(null);
    }

    if (!checkProcessValid(processIdx)) {
        return player.user.setGui(null);
    }

    const process = marriageProcesses[processIdx];
    process.offerTarget.user.setGui(null);
    process.offerSender.user.setGui(null);

    process.offerSender.notify(process.offerSender.user.LangString(player.user.is_male ? "wedding.marriage.decline.notify.female" : "wedding.marriage.decline.notify.male", player.user.name), "error");
    marriageProcesses.splice(processIdx);
});

function checkProcessValid(processIdx: number): boolean {
    const process = marriageProcesses[processIdx];
    if (mp.players.exists(process.offerTarget) && mp.players.exists(process.offerSender)) {
        return true;
    }

    marriageProcesses.splice(processIdx);
    return false;
}

CustomEvent.registerCef("marriage::confirmSign", (player) => {
    const processIdx = marriageProcesses.findIndex(process => process.offerTarget === player);
    if (processIdx === -1) {
        return player.user.setGui(null);
    }

    if (!checkProcessValid(processIdx)) {
        return player.user.setGui(null);
    }

    const process = marriageProcesses[processIdx];
    if (process.offerSender === player) {
        process.senderSigned = true;
    } else {
        process.targetSigned = true;
    }

    if (process.targetSigned && process.offerTarget) {
        const senderUser = process.offerSender.user;
        const targetUser = process.offerTarget.user;

        senderUser.setPartner(targetUser.entity)
        targetUser.setPartner(senderUser.entity);

        weedingWas.set(senderUser.id, true);
        weedingWas.set(targetUser.id, true);

        mp.players.toArray()
            .filter(q => q.user && q.user.exists)
            .forEach(usr => usr.outputChatBox(usr.user.LangString(senderUser.male ? "wedding.marriage.chat.male" : "wedding.marriage.chat.female", senderUser.name, targetUser.name)));

        senderUser.notify(senderUser.LangString(senderUser.male ? "wedding.marriage.n.male" : "wedding.marriage.n.female"))
        targetUser.notify(targetUser.LangString(targetUser.male ? "wedding.marriage.n.male" : "wedding.marriage.n.female"))

        const cefArgs = [
            "InfoFrame",
            null,
            [...senderUser.name.split(" "), senderUser.id],
            [...targetUser.name.split(" "), targetUser.id]
        ]

        senderUser.setGui("marriage", "marriage:set", ...cefArgs);
        targetUser.setGui("marriage", "marriage:set", ...cefArgs);

        marriageProcesses.splice(processIdx);
        return;
    }

    player.notify(player.user.LangString("wedding.marriage.confirm"));
});

CustomEvent.registerCef("marriage::closeMenu", (player) => {
    const processIdx = marriageProcesses.findIndex(process => process.offerTarget === player);
    if (processIdx === -1) {
        return player.user.setGui(null);
    }

    const process = marriageProcesses[processIdx];
    process.offerTarget.user.setGui(null);
    process.offerSender.user.setGui(null);

    marriageProcesses.splice(processIdx);
});

colshapes.new(WEDDING_POS, WEDDING_NAME, player => {
    if(!player.user) return;
    const user = player.user; // ✅ aici definim user corect
    // ✅ Verificare ore necesare pentru nunta
    if (user.playtime < LEVEL_PERMISSIONS.WEDDING) {
        return player.notify(`Ai nevoie de ${LEVEL_PERMISSIONS.WEDDING} ore jucate pentru a te putea casatori.`, 'error');
    }
    openWeddingMenu(player);
    return;
}, {
    color: [0,0,0,0]
})