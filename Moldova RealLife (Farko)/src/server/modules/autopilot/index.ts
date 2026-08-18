import { langStringDefault } from "../../../shared/lang";
import { CustomEvent } from "../custom.event";

CustomEvent.registerClient("autopilot:isInstalled", (player) => {
    if (!player.vehicle)
        return player.notify(player.user.LangString("index.538ceeef6a16b0e50dce60c5b888a5f9"), "error");

    if (player.seat !== 0)
        return player.notify(player.user.LangString("index.55e45940c70427874da63cd64f8090f2"), "error");

    if (!player.vehicle.engine)
        return player.notify(player.user.LangString("index.b4467af1da91c11de5805f182a254095"), "error");

    if (!player.vehicle?.entity?.data)
        return player.notify(player.user.LangString("index.42624c2d7218bd677418262c264edbcc"), "error");

    if (!player.vehicle.entity.data.isAutopilotInstalled)
        return player.notify(player.user.LangString("index.99ca2d20b7c0cc98b270f2d29e34f30f"), "error");

    CustomEvent.triggerClient(player, "autopilot:toggle");
});