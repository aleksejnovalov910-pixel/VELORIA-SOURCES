import { langStringDefault } from "../../../../shared/lang";
import { TicketDescription, TicketFullData } from "../../../../shared/ticket"
import { AdminDialogEntity } from "../../typeorm/entities/adminLogs"
import { dbLogsConnection } from "../../typeorm/logs"
import { CustomEvent } from "../../custom.event"
import { User } from "../../user"
import { Family } from "../../families/family"
import { system } from "../../system"
import { cmute, vmute } from "../../admin"
import {fractionCfg} from "../../fractions/main";
import {IPrisonData} from "../../../../shared/prison/IPrisonData";

export class Ticket {
    private readonly _data: TicketFullData
    public get description(): TicketDescription {
        return this._data.description
    }

    constructor(data: TicketFullData) {
        this._data = data
    }

    public takeByAdmin(admin: PlayerMp): void {
        this._data.description.adminName = admin.user.name

        this.triggerUpdate()
    }
    
    public resetAdmin(): void {
        this._data.description.adminName = null

        this.triggerUpdate()
    }

    public async close(): Promise<void> {
        this.triggerClose()

        const log = new AdminDialogEntity()
        log.name = langStringDefault("ticket.7b3634b206ba4699711aacab8d20ea80", this.description.creatorName, this.description.adminName ?? "-")
        log.time = this.description.createTime
        log.byAdmin = true
        log.messages = JSON.stringify([this._data.description.message, ...this._data.answers])
        log.creator = this.description.creatorId

        await dbLogsConnection.getRepository(AdminDialogEntity).insert(log)
    }

    private triggerClose(): void {
        mp.players.toArray().filter(q => q.user && q.ticketPage && q.user.isAdminNow()).map(target => {
            CustomEvent.triggerCef(target, "ticket:close", this.description.id)
        })
    }

    private triggerUpdate(): void {
        mp.players.toArray().filter(q => q.user && q.ticketPage && q.user.isAdminNow()).map(target => {
            CustomEvent.triggerCef(target, "ticket:updateDescr", this.description)
        })
    }

    public addAnswer(message: string): void {
        this._data.answers.push(message)

        const player = User.get(this.description.creatorId)

        if (player?.user) {
            player.outputChatBox(player.user.LangString("ticket.d78379669d4a04c0718f39c88940abaa", this._data.description.adminName, message))

            player.notify(player.user.LangString("ticket.13ff9cf83ec4ff17752f800e1d0d37ff"), "info")
            CustomEvent.triggerCef(player, "playSound", "admans")
        }
    }

    public getFulldata(): TicketFullData {
        let userInfo: [string, any][] = [];
        const target = User.get(this.description.creatorId);

        if (target?.user) {
            const data = target.user.entity
            const prison: IPrisonData = data.prison ? JSON.parse(data.prison) : null;

            userInfo.push([langStringDefault("ticket.9a1af03ed93eb5f3abf7d28766ce279a"), data.rp_name]);
            userInfo.push([langStringDefault("ticket.03d2df0647d20d991207fbb75ef07f1a"), data.level]);
            userInfo.push([langStringDefault("ticket.ae25aced5c11666690f75f52d50adfaf"), `${data.fraction ? langStringDefault("ticket.f8c956dd03fc4c7ad5a48e088fa3534d", fractionCfg.getFractionName(data.fraction), data.rank) : langStringDefault("ticket.9f767d6285a9cbdbc82ce1f9af663a6a")}`]);
            userInfo.push([langStringDefault("ticket.f732319ed28fa9edf866058d1d61155f"), `${data.family ? `${Family.getByID(data.family)?.name} (ID: ${data.family})` : langStringDefault("ticket.4bfdbd0f32582e6459d3daa00d5595d4")}`]);
            userInfo.push([langStringDefault("ticket.8b80713af0d63a308df46d002b51f0c0"), `$${system.numberFormat(data.money)}`]);
            userInfo.push([langStringDefault("ticket.b744166212d47a7f3300c6823e9d4719"), `$${system.numberFormat(data.bank_money)}`]);
            userInfo.push([langStringDefault("ticket.b3888f061174f31e69d64ac8ab3b5daa"), `${system.numberFormat(data.chips)}`]);
            userInfo.push([langStringDefault("ticket.b6e1585c8f6e933a5c60529ddb0d4121"), `${prison ? langStringDefault("ticket.29c32e2f305ddea983152724836497ee", Math.floor(prison.time / 60), prison.byAdmin ? " [A]" : "") : langStringDefault("ticket.2c2681e1ec9df910082ea26d18097aae")}`]);
            userInfo.push(["Ban", `${data.ban_end && data.ban_end > system.timestamp ? langStringDefault("ticket.642f8cb7f446bbe0d0b480bc135298dd", system.timeStampString(data.ban_end)) : langStringDefault("ticket.3212e0334212204f73d0453bdbee2de5")}`]);
            userInfo.push([langStringDefault("ticket.fe7b8ba82237572bcb4b6d9841614337"), `${data.warns.length}`]);
            userInfo.push(["CMute", `${cmute.get(this.description.creatorId) ? system.timeStampString(cmute.get(this.description.creatorId)) : langStringDefault("ticket.48f1aa57df50abb6ad093e81495653a3")}`]);
            userInfo.push(["VMute", `${vmute.get(this.description.creatorId) ? system.timeStampString(vmute.get(this.description.creatorId)) : langStringDefault("ticket.5df26088940cc065a21c8c53875130b3")}`]);
            if (target) {
                userInfo.push([langStringDefault("ticket.325951564760cfa598ddcdc29b8a25cb"), `${target.user.health.toFixed(0)}`]);
                userInfo.push([langStringDefault("ticket.6a2ac88b2e20143bdc5943a2aaa0322c"), `${target.armour.toFixed(0)}`]);
                userInfo.push([langStringDefault("ticket.978e643e81426e08fd1778da75eb27fc"), `${target.ping}`]);
                userInfo.push([langStringDefault("ticket.3c8da446f71ce0395c9f1b8fd63576ba"), `${target.packetLoss}`]);
            }
        } else userInfo.push([langStringDefault("ticket.13279b0a0aef5e5a20c1ba753a2e93c2"), langStringDefault("ticket.698bdb22489fe5e71330d1849d4e2627")]);

        return {
            description: this._data.description,
            answers: this._data.answers,
            userInfo: userInfo
        }
    }
}