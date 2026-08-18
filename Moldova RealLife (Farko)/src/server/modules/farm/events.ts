import { langStringDefault } from "../../../shared/lang";
import { CustomEvent } from "../custom.event"
import Farm from "./models/farm"
import { ACTIVITY_RENT_COST } from "../../../shared/farm/progress.config"
import { User } from "../user"

export const FARM_COLLECT_EVENT = "farm:collectItem";
export const FARM_LAND_EVENT = "farm:landItem";

CustomEvent.registerClient("farm:workPoint:enter", (player, pointIdx: number) => {
    if (!player.farmWorker) return
    player.farmWorker.activity.onPlayerEnterWorkPoint(player, pointIdx)
})

CustomEvent.registerCef("farm:work:start", (player, id: number) => {
    if (!player.user) return;
    const activity = Farm.instance.activities.find(a => a.id === id)
    activity.startWorkForPlayer(player)
    player.user.setGui(null)
})

CustomEvent.registerCef("farm:work:leave", (player) => {
    if (!player.user) return;
    player.farmWorker?.activity.stopWorkForPlayer(player)
})

CustomEvent.registerCef("farm:rent", (player, id: number) => {
    if (!player.user) return;
    const activity = Farm.instance.activities.find(a => a.id === id)
    activity.rentTo(player)
})

CustomEvent.registerCef("farm:rent:stop", (player, id: number) => {
    if (!player.user) return;
    const activity = Farm.instance.activities.find(a => a.id === id)
    activity.stopRent()
    player.user.setGui(null)
})

CustomEvent.registerCef("farm:capital:add", (player, sum: number) => {
    if (!player.user) return;
    const activity = player.farmWorker?.activity
    
    if (!activity || activity.owner != player.user.id) 
        return player.notify(player.user.LangString("events.1d129a92b8db2d3fa205765ec2e545a5"), "error")
    if (isNaN(sum) || sum <= 0 || sum > 999999)
        return player.notify(player.user.LangString("events.9fc022f6c702aa6c3a83375c3f535ef1"), "error")
    if (player.user.money < sum || !player.user.removeMoney(sum, false, player.user.LangString("events.07578e7b705b6a076fb184bc704c9875")))
        return player.notify(player.user.LangString("events.645f31d6c6a18c5e07c6c3568603d1df"), "warning")
    
    activity.capital += sum
    
    player.user.setGui(null)
})

mp.events.add("playerQuit", player => {
     if (!player.farmWorker) return;
     player.farmWorker.activity.stopWorkForPlayer(player)
})

mp.events.add("_userLoggedIn", (user: User) => {
    const activity = Farm.instance.activities.find(a => a.owner == user.id)
    if (!activity) return
    
    activity.startWorkForPlayer(user.player)
})