import { LangString, langStringDefault } from "../lang";
import {CustomEvent} from "../custom.event";
import {systemUtil} from "../../../shared/system";
import {SELLER_POSITION_RADIUS} from "../../../shared/market/config";
import {user} from "../user";
import {guiNames} from "../../../shared/gui";

let sellerPosition: Vector3Mp = null;
CustomEvent.registerServer("market:setSellerPosition", (position: Vector3Mp) => {
    sellerPosition = position;
});

CustomEvent.registerServer("market:calledByCop", () => {
    moveToSellerPos();
    user.notify(LangString("index.d0bdcaa0755370b65ffbbaa0d383393b"), "warning");
});

function checkPlayerPosition() {
    if (sellerPosition === null) {
        return;
    }

    const playerPos = mp.players.local.position;
    if (systemUtil.distanceToPos(playerPos, sellerPosition) < SELLER_POSITION_RADIUS) {
        return;
    }

    moveToSellerPos();
    user.notify(LangString("index.02f558e58d89f86d0b38a325820e00eb"), "warning");
}

function moveToSellerPos() {
    mp.players.local.taskGoStraightToCoord(sellerPosition.x, sellerPosition.y, sellerPosition.z,
        4.0, 5000, 0, 0);
}

setInterval(checkPlayerPosition, 3000);

mp.events.add("gui:menuClosed", (closedGui: guiNames) => {
    if (closedGui != "market") {
        return;
    }

    CustomEvent.triggerServer("market:closed");
});
