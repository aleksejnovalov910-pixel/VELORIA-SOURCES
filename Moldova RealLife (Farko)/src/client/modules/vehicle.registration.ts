import { LangString } from "./lang";
import {VEHICLE_REGISTRATION_POS} from "../../shared/vehicle.registration";
import {colshapes} from "./checkpoints";
import {user} from "./user";
import {gui} from "./gui";
import {CustomEvent} from "./custom.event";


colshapes.new(VEHICLE_REGISTRATION_POS.map(item => new mp.Vector3(item.x, item.y, item.z)), "Imatriculare Vehicul", player => {
    if (!player.vehicle) return user.notify(LangString("vehicle.registration.3222d20befba5b2669ad055f6fdd21a7"), "error", "CHAR_TOM");
    if (player.vehicle.autosalon) return user.notify(LangString("vehicle.registration.63ecdd76b3c6aa5ed2713d354e18785a"), "error", "CHAR_TOM");
    const id = player.vehicle.getVariable("id");
    const owner = player.vehicle.getVariable("owner");
    const ownerFamily = player.vehicle.getVariable("ownerfamily");
    if (!id || (!owner && !ownerFamily)) return user.notify(LangString("vehicle.registration.317f02d95255ccb468e7bc2344c6ec4b"), "error", "CHAR_TOM");
    if ((owner && owner !== user.id) || (ownerFamily && (ownerFamily != user.family || user.familyRank != 4))) return user.notify(LangString("vehicle.registration.41c1645539417e8887966e52c2e2ffa1"), "error", "CHAR_TOM");
    gui.setGui("numberplate");
}, {
    type: 27,
    radius: 5
})

// TODO передавать в клиент лидер семьи ли игрок и в 16 проверять