import { LangString, langStringDefault } from "../lang";
import {system} from "../system";
import {ORDER_CAR_POS, ORDER_LOAD_COORDS, ORDER_MENU_POS} from "../../../shared/order.system";
import {ScaleformTextMp} from "../scaleform.mp";

ORDER_LOAD_COORDS.map((item, index) => {
    system.createBlipNearest(85, 26, item, LangString("order.zone.16ecbf0b89e44e130f27bc31ae459ccd", index+1), 100)
    new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1), LangString("order.zone.ea3da3b7cd944739884c3ef94182d521", index + 1), {
        range: 5,
        type: "front"
    })
})
ORDER_CAR_POS.map(item => {
    // Пожалуйста, не пропадай при мерджах
    system.createBlip(85, 1, item, LangString("order.zone.5b3d94afb4371d2d45462f7e0c79d37d"), 0);
    new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1), LangString("order.zone.8d18577420a6229ff38fa830690be7fc"), {
        range: 20,
        type: "front"
    })
})
ORDER_MENU_POS.map(item => {
    system.createBlip(616, 26, item, LangString("order.zone.94a4978da6a2caa6489d4ad80961de59"))
    new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1), LangString("order.zone.91784b17ef07b6d516736cf7b7f0911c"), {
        range: 25,
        type: "front"
    })
})
