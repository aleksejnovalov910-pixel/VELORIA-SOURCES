import { langStringDefault } from "../../shared/lang";
import {getJobData, getLevelByExp, jobData, JobId, jobsList} from "../../shared/jobs";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {quests} from "./quest";
import {QUESTS_DATA} from "../../shared/quests";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";
import {AchievementItemJob, getAchievConfigByType} from "../../shared/achievements";
import {JOB_MONEY_PER_HOUR_MULTIPLE, PAYDAY_MONEY_PER_HOUR_MULTIPLE} from "../../shared/economy";
import {getX2Param} from "./usermodule/static";
import {getVipConfig} from "../../shared/vip";
import {JOB_TASK_MANAGER_EVENT} from "./battlePass/tasks/jobTaskManager";
import { LEVEL_PERMISSIONS } from "../../shared/level.permissions";



CustomEvent.registerClient('job:success', (player, key: string) => {
    const user = player.user;
    if (!user) return;
    if (!key) return;
    if (!user.job) return;
    if (typeof user.jobtask !== "number") return;
    if (user.jobkey !== key) return;
    const job = getJobData(user.job);
    if(!job) return;
    const task = job.tasks[user.jobtask];
    if(!task) return;
    const level = getLevelByExp(user.getJobExp(user.job));
    if(task.level && level < task.level){
        system.debug.error(`${user.id} ${user.name} try run task without level`);
        player.notify(player.user.LangString("jobs.2fd58e1a8563f9054ce0d3d902e708d4"), "error");
        return;
    }
    const mon = task.money;
    user.quests.map(quest => {
        if (quest[2]) return;
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if(task.type === "jobFarm" && (!task.job || task.job === job.id)){
                user.addQuestTaskVal(quest[0], taskindex, mon)
            }
        })
    })
    let sum = getX2Param('job') ? task.money * 2 : task.money
    const tm = user.getDaylyOnline
    if(tm && JOB_MONEY_PER_HOUR_MULTIPLE[tm]) sum = sum * JOB_MONEY_PER_HOUR_MULTIPLE[tm]

    const vipPaymentMultiplier = getVipConfig(user.vip)?.jobPaymentMultiplier ?? 1;
    sum *= vipPaymentMultiplier;

    user.addMoney(sum, true, langStringDefault("jobs.f4eec84204b2803c16b5a3b1f36661b1") + task.name + langStringDefault("jobs.d5ea7e1a59acc817794797f63c2c4bfc") + job.name);
    // if (job.id === 'builder') mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'builder');
    // if (job.id === 'cleaning') mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'cleaning');
    // if (job.id === 'garden') mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'garden');

    let exp = task.exp || 1;
    if (getX2Param('job')) exp *= 2;
    user.achiev.achievTickJob('jobexp', job.id, exp)
    user.achiev.achievTickJob('jobmoney', job.id, sum)
    user.addJobExp(job.id, exp)
    ///////////// notificare 
})

CustomEvent.registerCef('job:task:stop', (player) => {
    const user = player.user;
    if(!user) return;
    user.jobkey = null;
    user.jobtask = null;
    user.setJobDress(null);
    CustomEvent.triggerClient(player, 'job:stop')
})

CustomEvent.registerCef('job:task', (player, jobid: JobId, taskid: number) => {
    const user = player.user;
    if(!user) return;
    const item = getJobData(jobid);
    if(!item) return;
    const task = item.tasks[taskid];
    if(!task) return;
    const level = getLevelByExp(user.getJobExp(item.id))
    const dress = user.male ? item.dressMale : item.dressFemale
    if(dress) user.setJobDress(dress);
    if (task.level && level < task.level) return player.notify(player.user.LangString("jobs.adf20075b2e3359519c051061b725017", task.level), "error", 'CHAR_MP_BIKER_BOSS');
    player.notify(player.user.LangString("jobs.b4c516b77e6bb90504ac406e63856d3c"), "success", 'CHAR_MP_BIKER_BOSS');
    user.jobkey = system.randomStr(5)
    user.jobtask = taskid
    CustomEvent.triggerClient(player, 'job:start', item.id, taskid, user.jobkey)
})

CustomEvent.registerCef('job:join', (player, job: JobId) => {
    const user = player.user;
    if(!player.user.mp_character) return player.notify(player.user.LangString("jobs.cfbed5ac3a7f4ed06cce2bcfcfc346cc"), 'error')
    // ✅ Doar pentru job-ul "marihuana"
    // if (job === "marihuana") {
    //     if (user.playtime < LEVEL_PERMISSIONS.MARIHUANA) {
    //         return player.notify(`Ai nevoie de minim ${LEVEL_PERMISSIONS.MARIHUANA} ore jucate pentru a lucra aici.`, 'error');
    //     }
    // }
    if (player.user.jobtask != null) {
        player.notify(player.user.LangString("jobs.98b07b63eef17511fbb37e3aff1bb96b"));
        return;
    }

    player.user.job = job;
    player.notify(player.user.LangString("jobs.5b295296193e7c85432082ed7eeede8e"), 'error', 'CHAR_MP_BIKER_BOSS', 15000);
})

CustomEvent.registerCef('job:leave', (player, job: JobId) => {
    const user = player.user;
    if(!user) return;
    user.job = null;
    user.jobkey = null;
    user.jobtask = null;
    user.setJobDress(null);
    player.notify(player.user.LangString("jobs.ee10efb1d00858e13499aabf23412f6c"), 'error', 'CHAR_MP_BIKER_BOSS');
    CustomEvent.triggerClient(player, 'job:stop')
})



jobsList.map(item => {
    const pos = new mp.Vector3(item.pos.x, item.pos.y, item.pos.z)
    colshapes.new(pos, item.name, player => {
        reloadJobCef(player, item);
    }, {
        radius: MARKERS_SETTINGS.JOBS.r,
        color: MARKERS_SETTINGS.JOBS.color
    })
})


const reloadJobCef = (player: PlayerMp, item: jobData) => {
    const user = player.user;
    if(!user) return;
    if (item.quest && user.job !== item.id){
        const qwcfg = QUESTS_DATA.find(q => q.id)
        const qw = user.quests.find(q => q[0] === item.quest.id);
        if (!qw) return player.notify(player.user.LangString("jobs.fc0127698e20c439ec30f12a0b24f485", qwcfg.name), "error", 'CHAR_MP_BIKER_BOSS');
        if(item.quest.completed != 2){
            if (item.quest.completed === 0 && qw[2]) return player.notify(player.user.LangString("jobs.bcdcf5eeeb14e95b1cdadf05c45cd97c", qwcfg.name), "error", 'CHAR_MP_BIKER_BOSS');
            if (item.quest.completed === 1 && !qw[2]) return player.notify(player.user.LangString("jobs.59d2d752edb164488e91135c3246d7d4", qwcfg.name), "error", 'CHAR_MP_BIKER_BOSS');
        }
    }
    CustomEvent.triggerClient(player, 'job:data', item.id, user.job, user.job === item.id ? user.jobtask : null, user.getJobExp(item.id), false, false)
}
