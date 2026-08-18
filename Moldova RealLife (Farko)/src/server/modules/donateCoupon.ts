import { langStringDefault } from "../../shared/lang";
import { gui } from './gui'
import fetch from 'node-fetch'
import { PAYMENT_SERVICE_USE_COUPON_PATH } from '../../shared/donate'
import { DEFAULT_SELECTED_LANG } from "../../shared/lang/default";

gui.chat.registerCommand("usecoupon", async (player, ...args) => {
    if (!player.user) return;
    
    const code = args.join(' ');
    const defaultLang = DEFAULT_SELECTED_LANG; // dome

    if (!code) return;
    
    await useCoupon(player, code, player.user.id.toString(), defaultLang);
})

const useCoupon = async (player: PlayerMp, code: string, activatorId: string, lang: string): Promise<void> => {
    const response = await fetch(PAYMENT_SERVICE_USE_COUPON_PATH, {
        method: 'POST',
        body: JSON.stringify({ code, activatorId, lang }), // hier dome
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseBody: IUseCouponResponse = await response.json()
    
    if (!responseBody.success)
        return player.notify(player.user.LangString("donateCoupon.4809c987c362bbc15eacdd63704807e7"))
    
    if (isNaN(responseBody.coinsAmount))
        return player.notify(player.user.LangString("donateCoupon.59a6a31eeaf59524066d81e85d4171cf"))
    
    player.user.addDonateMoney(responseBody.coinsAmount, player.user.LangString("donateCoupon.10591885783720fd8c1d848c4f38e7d0", code))
    player.notify(player.user.LangString("donateCoupon.c6f6bd5591f4183a2eb86641084fae97", responseBody.coinsAmount))
}

interface IUseCouponResponse {
    success: boolean
    coinsAmount: number
}