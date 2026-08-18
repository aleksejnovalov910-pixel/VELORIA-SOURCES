import { langStringDefault } from "../../../../shared/lang";
import {colshapes} from "../../checkpoints";
import {PRISON_ENTER_MENU_COORDS, PRISON_TIME_FOR_WANTED_LEVEL} from "../../../../shared/prison/config";
import {menu} from "../../menu";
import {ARREST_MONEY} from "../../../../shared/economy";
import {prison} from "../index";
import {fractionCfg} from "../../fractions/main";

export function enterMenu() {
    colshapes.new(
        PRISON_ENTER_MENU_COORDS,
        langStringDefault("enterMenu.d7829db74263aa2d03dc5ee27013c4fe"),
        (player: PlayerMp, index) => {
            const user = player.user;
            if (!user) return;
            if (!user.is_police) return player.notify(player.user.LangString("enterMenu.11b3898ccb6847612fb8713e980af3e5"), "error");
            const m = menu.new(player, player.user.LangString("enterMenu.1d10136323e488130d9862c32b12eb0a"), player.user.LangString("enterMenu.1cef2ef53bdf065a4c2989f6b62ff949"));

            m.newItem({
                name: langStringDefault("enterMenu.1cda3efd065897dc4c0952317c8ab1f8"),
                onpress: () => {
                    const s = () => {
                        const submenu = menu.new(player, player.user.LangString("enterMenu.eaf1677f94554065d75d73554224c61a"), player.user.LangString("enterMenu.7db8745f6b1fe590e7b96959617cb7fb"));
                        mp.players.toArray().filter(target => target.user && target.user.prison && !target.user.prison.byAdmin).map(target => {
                            submenu.newItem({
                                name: `${target.user.name} (${target.user.id})`,
                                more: target.user.prison.time > 120 ? langStringDefault("enterMenu.023a0cc810e2b1ab36ab26da71686ef9", Math.floor(target.user.prison.time / 60)) : langStringDefault("enterMenu.a1712912b883e812054769dc671fda61", target.user.prison.time),
                                desc: langStringDefault("enterMenu.f86076b7bf749bc4054184ebbbe3cab5", target.user.prison.reason),
                                onpress: () => {
                                    if (player.user.id === target.user.id)
                                        return player.notify(player.user.LangString("enterMenu.ee2c92418f2e36d2473ce9a7964a8b3b"), "error");
                                    menu.accept(player, player.user.LangString("enterMenu.70f540f92c6f4e4ac362802750653751")).then(status => {
                                        if(!status) return s();
                                        if(!mp.players.exists(target)) return player.notify(player.user.LangString("enterMenu.791fa2f32c6b035bdb6987ab34371cb5"), "error");
                                        target.user.writeRpHistory(langStringDefault("enterMenu.90961bdc77d4c6b9b27ea509760c7aff", fractionCfg.getFractionName(player.user.fraction), player.user.id, target.user.prison.reason));
                                        user.log("gosJob", langStringDefault("enterMenu.75ac511f7f422a356083eb577e704264", target.user.prison.time, target.user.prison.reason), target);
                                        prison.unjail(player, target.user.id)
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

            // m.newItem({
            //     name: langStringDefault("enterMenu.e07f3f0a51789cc98d55990419936ac7"),
            //     onpress: async () => {
            //         const target = await user.selectNearestPlayer(5)
            //         if(!target) return;
            //         if (!target.user.cuffed) return player.notify(player.user.LangString("enterMenu.892609287d047b932775449191c73faa"), "error");
            //         // if (!target.user.wanted_level) return player.notify(player.user.LangString("enterMenu.69cef3c86f54f6a5b550d63c890d13dc"), "error");

            //         menu.input(player, player.user.LangString("enterMenu.276f7ad6df0267ae02b933d28e3bfe87"), target.user.wanted_reason, 30).then(val => {
            //             if(!val) return;
            //             if(!mp.players.exists(target)) return player.notify(player.user.LangString("enterMenu.c25b30bbb0ed695aa1ad51bb062177a0"), "error");
            //             if (!target.user.cuffed) return player.notify(player.user.LangString("enterMenu.1526e0248fd8b925f8d1bbfe66897a37"), "error");
            //             if (!target.user.wanted_level) return player.notify(player.user.LangString("enterMenu.ebf44110e383d6c0a348a0fcd2dd5d55"), "error");

            //             prison.jail(player, target, target.user.wanted_level * PRISON_TIME_FOR_WANTED_LEVEL, val);
            //             player.notify(player.user.LangString("enterMenu.7eebdad384a65865bc17c15ac26514ba"), "success")
            //         })
            //     }
            // })
            m.newItem({
                name: langStringDefault("enterMenu.e07f3f0a51789cc98d55990419936ac7"),
                onpress: async () => {
                    const target = await user.selectNearestPlayer(5)
                    if (!target) return;
                    if (!target.user.cuffed)
                        return player.notify(player.user.LangString("enterMenu.892609287d047b932775449191c73faa"), "error");

                    // 🟡 Nu mai verificam daca are wanted_level
                    // if (!target.user.wanted_level) return player.notify(...);

                    menu.input(
                        player,
                        player.user.LangString("enterMenu.276f7ad6df0267ae02b933d28e3bfe87"), // motivul
                        target.user.wanted_reason || "",
                        30 // limita de caractere
                    ).then(reason => {
                        if (!reason) return;
                        if (!mp.players.exists(target))
                            return player.notify(player.user.LangString("enterMenu.c25b30bbb0ed695aa1ad51bb062177a0"), "error");

                        if (!target.user.cuffed)
                            return player.notify(player.user.LangString("enterMenu.1526e0248fd8b925f8d1bbfe66897a37"), "error");

                        // 🟢 Cerem timpul in minute de la politist
                        menu.input(
                            player,
                            "Introdu timpul de inchisoare (in minute):",
                            "",
                            3 // limita de cifre, ex: max 999 minute
                        ).then(timeStr => {
                            const jailMinutes = parseInt(timeStr);
                            if (!jailMinutes || jailMinutes <= 0)
                                return player.notify("Timp invalid.", "error");

                            // Trimitem la jail cu timpul introdus
                            prison.jail(player, target, jailMinutes * 60, reason); // convertim in secunde dacă funcția jail așteaptă secunde

                            player.notify(player.user.LangString("enterMenu.7eebdad384a65865bc17c15ac26514ba"), "success");
                        });
                    });
                }
            })

            m.open();
    }, {
            color: [0, 0, 0, 0]
        })
}