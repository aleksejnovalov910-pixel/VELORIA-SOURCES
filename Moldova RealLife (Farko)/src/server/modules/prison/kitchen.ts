import { langStringDefault } from "../../../shared/lang";
import {colshapes} from "../checkpoints";
import {PRISON_KITCHEN_DRINK, PRISON_KITCHEN_EAT, PRISON_KITCHEN_EATING} from "../../../shared/prison/config";
import {system} from "../system";

colshapes.new(PRISON_KITCHEN_EAT, player => player?.user?.LangString("kitchen.51ecde09b164c309d6b7ae028bc53b9f") ?? langStringDefault("kitchen.51ecde09b164c309d6b7ae028bc53b9f"), (player) => {
    if (!player.user) return;
    if (!player.user.prison)
        return player.notify(player.user.LangString("kitchen.eb4acfffc8d8501507bea85d2622c1b9"), "error");

    if (system.timestamp - player.user.prisonLastEat < PRISON_KITCHEN_EATING * 60)
        return player.notify(player.user.LangString("kitchen.7ae4174641a49451c93826df55b574db"), "error");

    player.user.prisonLastEat = system.timestamp;
    player.user.food += 200;
    player.user.playAnimation([["mp_player_inteat@burger", "mp_player_int_eat_burger_enter", 1], ["mp_player_inteat@burger", "mp_player_int_eat_burger", 1], ["mp_player_inteat@burger", "mp_player_int_eat_burger_fp", 1], ["mp_player_inteat@burger", "mp_player_int_eat_exit_burger", 1]], true, false);

    player.user.addAttachment("item_20");
    setTimeout(() => {
        if (mp.players.exists(player) && player.user) player.user.removeAttachment("item_20");
    }, 4000)
});

colshapes.new(PRISON_KITCHEN_DRINK, player => player?.user?.LangString("kitchen.e6f56602f52be5864692a8b755b83d80") ?? langStringDefault("kitchen.e6f56602f52be5864692a8b755b83d80"), (player) => {
    if (!player.user) return;
    if (!player.user.prison)
        return player.notify(player.user.LangString("kitchen.1cda3c7741bc92c3bb07801c52519545"), "error");

    if (system.timestamp - player.user.prisonLastDrink < PRISON_KITCHEN_EATING * 60)
        return player.notify(player.user.LangString("kitchen.736bd844a8a9b0b7d28accaadc7b4883"), "error");

    player.user.prisonLastDrink = system.timestamp;
    player.user.water += 500;
    player.user.playAnimation([["mp_player_intdrink", "intro_bottle", 1], ["mp_player_intdrink", "loop_bottle", 1], ["mp_player_intdrink", "outro_bottle", 1]], true, false);

    player.user.addAttachment("item_1");
    setTimeout(() => {
        if (mp.players.exists(player) && player.user) player.user.removeAttachment("item_1");
    }, 4000)
});