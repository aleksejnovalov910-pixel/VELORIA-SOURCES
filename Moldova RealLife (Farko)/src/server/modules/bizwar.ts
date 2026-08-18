import { langStringDefault } from "../../shared/lang";
import {BusinessEntity} from "./typeorm/entities/business";
import {Family} from "./families/family";
import {system} from "./system";
import {DeathMath} from "./deadmatch";
import {User} from "./user";
import {CustomEvent} from "./custom.event";
import {
    ATTACKS_DAILY_LIMIT,
    BIZWAR_EXIT_TIMEOUT_MINUTES,
    BIZWAR_POINTS,
    BIZWAR_PREPARATION_TIME, BIZWAR_TIME, COOLDOWN_BEETWEN_BIZWARS, DEFENSES_DAILY_LIMIT,
    DIFFERENCE_BETWEEN_TEAMS_LIMIT,
    IBizWarPoint
} from "../../shared/bizwar";
import {gui} from "./gui";
import {UserEntity} from "./typeorm/entities/user";
import {MenuClass} from "./menu";
import {fraction, fractionCfg} from "./fractions/main";
import {FRACTION_RIGHTS} from "../../shared/fractions/ranks";
import {BUSINESS_SUBTYPE_NAMES} from "../../shared/business";

export enum WAR_STAGE {
    PREPARATION,
    WAR
}

export class BizWar {
    public static currentBizWars: BizWar[] = [];
    
    private _preparationStartedTime: number;
    private _preparationTimeout: number;
    private _currentStage: WAR_STAGE;
    
    // (Id фракции, кол-во атак)
    public static attacks: Map<number, number> = new Map<number, number>()   
    public static defences: Map<number, number> = new Map<number, number>()   
    
    constructor(
        public readonly business: BusinessEntity,
        public readonly pretender: number,
        private readonly _battlePoint: IBizWarPoint,
    ) {
        this.startPreparation();
    }
    
    private canPlayerJoin(user: User): boolean {
        return this._currentStage == WAR_STAGE.PREPARATION && (user.fraction == this.business.mafiaOwner || user.fraction == this.pretender)
            && user.hasPermission('fraction:bizwar:join')
    }
    
    private getDefendersCount(): number {
        return mp.players
            .toArray()
            .filter(p => p.user && p.user.fraction && p.user.fraction === this.business.mafiaOwner
                && p.user.hasPermission('fraction:bizwar:join') && system.distanceToPos2D(p.position, this._battlePoint) <= this._battlePoint.r).length;
    }
    
    private getAttackersCount(): number {
        return mp.players
            .toArray()
            .filter(p => p.user && p.user.fraction && p.user.fraction === this.pretender
                && p.user.hasPermission('fraction:bizwar:join') && system.distanceToPos2D(p.position, this._battlePoint) <= this._battlePoint.r).length;
    }
    
    private getMembers(): PlayerMp[] {
        return mp.players
            .toArray()
            .filter(p => p.user && p.user.fraction && this.canPlayerJoin(p.user));
    }
    
    /** Начать подготовку к бизвару */
    public startPreparation(): void {
        this._currentStage = WAR_STAGE.PREPARATION;
        this._preparationStartedTime = system.timestamp;
        this._battlePoint.busy = true;
        
        this.getMembers().forEach(player => {
            CustomEvent.triggerClient(player, 'family:bizWar:readyStart', `${BUSINESS_SUBTYPE_NAMES[this.business.type][this.business.sub_type]} ${this.business.id}`,
                BIZWAR_PREPARATION_TIME * 60, this._battlePoint);
        })
        
        this._preparationTimeout = setTimeout(() => {
            const attackersCount = this.getAttackersCount();
            const defendersCount = this.getDefendersCount();
            if (Math.max(defendersCount, attackersCount) / Math.min(defendersCount, attackersCount) * 100 <= DIFFERENCE_BETWEEN_TEAMS_LIMIT)
                this.startWar();
            else {
                this._battlePoint.busy = false;
                if (attackersCount > defendersCount) {
                    this.business.mafiaOwner = this.pretender;
                    this.business.save();
                    this.getMembers().forEach(m => m.notify(langStringDefault("bizwar.4e82133ff4ee48a290bb82c9c91b3671", fractionCfg.getFraction(this.pretender)?.name ?? langStringDefault("bizwar.74bdc761a3705fedc4fce5ecbb5d9053"), this.business.name)))
                }
                BizWar.currentBizWars.splice(BizWar.currentBizWars.indexOf(this), 1);
            }
        }, BIZWAR_PREPARATION_TIME * 60 * 1000)
    }
    
    /** Füge einen Spieler in Vorbereitung auf den Bizwar hinzu */
    public addPlayer(player: PlayerMp): void {
        if (!player.user || !this.canPlayerJoin(player.user)) return;
        CustomEvent.triggerClient(player, 'family:bizWar:readyStart', `${BUSINESS_SUBTYPE_NAMES[this.business.type][this.business.sub_type]} ${this.business.id}`,
            BIZWAR_PREPARATION_TIME * 60 - (system.timestamp - this._preparationStartedTime), this._battlePoint)
    }
    
    private startWar(): void {
        BizWar.attacks.set(this.pretender, (BizWar.attacks.get(this.pretender) ?? 0) + 1)
        BizWar.defences.set(this.business.mafiaOwner, (BizWar.attacks.get(this.business.mafiaOwner) ?? 0) + 1)

        const pos = new mp.Vector3(this._battlePoint.x, this._battlePoint.y, this._battlePoint.z);
        const targets = this.getMembers().filter(member => system.distanceToPos2D(member.position, this._battlePoint) <= this._battlePoint.r);
        
        const team1 = targets.filter(q => q.user.fraction === this.business.mafiaOwner);
        const team2 = targets.filter(q => q.user.fraction === this.pretender);
        const dm = new DeathMath(pos, this._battlePoint.r);
        team1.map(q => dm.insertPlayer(q, 1));
        team2.map(q => dm.insertPlayer(q, 2));
        dm.name = langStringDefault("bizwar.b59936145c20d502347a01719013bea4", this.business.name);
        dm.team1_name = fractionCfg.getFraction(this.business.mafiaOwner)?.name ?? langStringDefault("bizwar.1bd35c5b6a0a4d37fd0f252146b434a4");
        dm.team2_name = fractionCfg.getFraction(this.pretender)?.name ?? langStringDefault("bizwar.d65c38629dc9fa39de2480d505505b31");
        dm.team1_image = '';
        dm.team2_image = '';
        // dm.team1_start = cfg.opponentPos
        // dm.team2_start = cfg.ownerPos
        dm.exitTimeout = BIZWAR_EXIT_TIMEOUT_MINUTES * 60;
        dm.time = BIZWAR_TIME * 60
        dm.hospital = true;
        dm.wait_freeze = false;
        dm.handler((winner) => {
            winner === 1 ? this.handleWarFinish(this.business.mafiaOwner) : this.handleWarFinish(this.pretender)
        })
        dm.start()
        this._currentStage = WAR_STAGE.WAR;
    }
    
    private handleWarFinish(winner: number): void {
        this._currentStage = WAR_STAGE.PREPARATION;
        this._battlePoint.busy = false;
        if (winner === this.pretender) {
            this.business.mafiaOwner = this.pretender;
            this.business.save();
            this.getMembers().forEach(m => m.notify(langStringDefault("bizwar.9284af29e811e0dff6abd75390bb75b3", fractionCfg.getFraction(this.pretender)?.name, this.business.name)))
        } 
        else this.getMembers().forEach(m => m.notify(langStringDefault("bizwar.6d9b6898461e14f40de1cea5cb472b9b", fractionCfg.getFraction(this.business.mafiaOwner)?.name, this.business.name)))
        BizWar.currentBizWars.splice(BizWar.currentBizWars.indexOf(this), 1);
    }
    /** Остановить бизвар */
    public stop(): void {
        if (this._preparationTimeout) clearInterval(this._preparationTimeout);
        
        if (this._currentStage === WAR_STAGE.PREPARATION) {
            this.getMembers().forEach(player => {
                CustomEvent.triggerClient(player, 'family:bizWar:readyStop');
            })
        }
        this._battlePoint.busy = false;
        //todo: дописать логику остановки для начавшегося боя
    }
}

/** Начать войну за бизнес между семьями
 * @param {BusinessEntity} business - Бизнес за который начать войну
 * @param creator - Игрок запускающий бизвар
 * @param forceStart - Запустить войну без проверок на лимиты */
export const startBizWar = (business: BusinessEntity, pretender: User, creator: User, forceStart: boolean = false): void => {
    if (BizWar.currentBizWars.find(b => b.business.id === business.id)) return creator.notify(langStringDefault("bizwar.0bac8cadc7b3791eaafc125e199ca19a"), 'error');
    if (business.price <= 0) return creator.notify(langStringDefault("bizwar.3a1a5e45db99bc3b2b25e30e918bd1ef"), 'error');
    if (!pretender.fractionData?.mafia) return
    
    const owner = fractionCfg.getFraction(business.mafiaOwner)
    if (!owner) {
        if (BizWar.attacks.has(pretender.fractionData.id) && BizWar.attacks.get(pretender.fractionData.id) >= ATTACKS_DAILY_LIMIT)
            return creator.notify(langStringDefault("bizwar.6080881c6a4195afc56376ec15222f1d"), 'error');
        
        business.mafiaOwner = pretender.fractionData.id;
        BizWar.attacks.set(pretender.fractionData.id, (BizWar.attacks.get(pretender.fractionData.id) ?? 0) + 1)
        business.save();
        creator.notify(langStringDefault("bizwar.d71c05054277c76208867a497eb341d2"));
        return;
    }
    
    if (owner.id === pretender.fraction) return creator.notify(langStringDefault("bizwar.e63bf09ae1ee86351793653287053c95"), 'error');

    if (BizWar.currentBizWars.find(b => b.pretender == pretender.fraction || b.business.mafiaOwner == pretender.fraction
        || b.pretender == business.mafiaOwner || b.business.mafiaOwner == business.mafiaOwner))
        return creator.notify(langStringDefault("bizwar.e4c01a3ecf1398d065d4e68aac273e42"), 'error');
    
    if (canAttack(pretender.fraction) && canDefend(owner.id)) {
        const bizWarPoint = getRandomFreeBizWarPoint();
        if (!bizWarPoint) return creator.notify(langStringDefault("bizwar.1105ec28e9b236668292d4924bdbf4d7"), 'error');
        
        BizWar.currentBizWars.push(new BizWar(business, pretender.fraction, bizWarPoint));
    }
    else return creator.notify(langStringDefault("bizwar.baf50da67bc2c18c717b85e3762990b9"), 'error');
}

const canAttack = (fractionId: number) => {
    return !BizWar.attacks.has(fractionId) || (BizWar.attacks.has(fractionId) && BizWar.attacks.get(fractionId) < ATTACKS_DAILY_LIMIT)
}

const canDefend = (fractionId: number) => {
    return !BizWar.defences.has(fractionId) || (BizWar.defences.has(fractionId) && BizWar.defences.get(fractionId) < DEFENSES_DAILY_LIMIT)
}

gui.chat.registerCommand("bizwar", async (player, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    let id = parseInt(str);
    const business = await BusinessEntity.findOne(id);
    
    startBizWar(business, player.user, player.user, true);
})

const getRandomFreeBizWarPoint = (): IBizWarPoint => {
    return BIZWAR_POINTS.filter(b => !b.busy)[system.getRandomInt(0, BIZWAR_POINTS.length - 1)];
}

/** Добавить пункт с началом бизвара в существующее меню управления бизнесом */
export const createBizMenuBizWarItem = (user: User, menu: MenuClass, biz: BusinessEntity) => {
    if (canUserStartBizWar) {
        menu.newItem({
            name: user.LangString("bizwar.f6f56f5fddb84aece541eda19e73b443"),
            onpress: () => {
                startBizWar(biz, user, user);
            }
        })
    }
}

export const canUserStartBizWar = (user: User) =>
    fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.BIZWAR)