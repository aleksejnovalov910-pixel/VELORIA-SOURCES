import { langStringDefault } from "../../../../../shared/lang";
import { colshapes } from "../../../checkpoints"
import { CustomEvent } from "../../../custom.event"
import { UserGiftEntity } from "../../../typeorm/entities/userGift"
import { inventory } from "../../../inventory"
import { inventoryShared, OWNER_TYPES } from "../../../../../shared/inventory"
import { User } from "../../../user"

class NewYearGifts {
    public init(): void {
        colshapes.new(new mp.Vector3(-503.43, -229.03, 36.45), player => player.user.LangString("index.a7c878b3d0a6e2ebaf84f8c8d148d54f"), async player => {
            const playerGifts = await UserGiftEntity.find({
                where: {userToId: player.user.id}
            })
            
            if (playerGifts.length == 0) {
                return player.user.notify(player.user.LangString("index.a7c878b3d0a6e2ebaf84f8c8d148d54f"))
            }

            const data: [number, string][] = []
        
            await Promise.all(playerGifts.map(async giftEntity => {
                if (inventoryShared.get(giftEntity.item_id)?.blockMove)
                    return
                
                const userFrom = await User.getData(giftEntity.userFromId)
                data.push([giftEntity.item_id, langStringDefault("index.5cba9f9084763c9a007ec72f09214862", userFrom.rp_name)])
            }))
            player.user.setGui("newYearsGift")

            CustomEvent.triggerCef(player, "newYearsGift:setGifts", data)
        }, { type: -1, radius: 8 })
    }

    /**
     * Добавить подарок в очередь на отправку
     */
    public async addGiftToQueue(player: PlayerMp, itemId: number, targetId: number): Promise<void> {
        if (!player.user.inventory.some(i => i.item_id === itemId))
            return player.user.notify(player.user.LangString("index.a805e40b6875c116c2cb66b0112b32b3"), "warning")
        
        if (isNaN(itemId) || isNaN(targetId) || targetId <= 0 || itemId <= 0)
            return player.user.notify(player.user.LangString("index.811a141ee886fd24fec52fed30307203"), "warning")
        
        if (targetId == player.user.id)
            return player.user.notify(player.user.LangString("index.a133427c0019a08f6b829bd3d58fc60e"), "error")
        
        player.user.setGui(null)
        player.user.notify(player.user.LangString("index.cd3969916089bcd07a2cdc628b887697"), "success")
        inventory.deleteItemsById(player, itemId, 1)
        await UserGiftEntity.insert({
            item_id: itemId, 
            userFromId: player.user.id,
            userToId: targetId
        })
    }
    
    public async giveGiftToPlayer(player: PlayerMp): Promise<void> {
        const playerGifts = await UserGiftEntity.find({
            where: {userToId: player.user.id}
        })
        
        playerGifts.forEach(gift => {
            UserGiftEntity.delete(gift.id)
            inventory.createItem({
                item_id: gift.item_id, owner_type: OWNER_TYPES.PLAYER, owner_id: player.user.id
            })
        })
    }
}

export const newYearGiftsManager = new NewYearGifts()

//newYearGiftsManager.init()

CustomEvent.registerCef("newYearsGift:send", newYearGiftsManager.addGiftToQueue)
CustomEvent.registerCef("newYearsGift:get", newYearGiftsManager.giveGiftToPlayer)