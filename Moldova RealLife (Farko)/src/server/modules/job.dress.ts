import { langStringDefault } from "../../shared/lang";
import {JobDressEntity} from "./typeorm/entities/job.dress";
import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {ScaleformTextMp} from "./scaleform.mp";
import {dress} from "./customization";
import {CustomEvent} from "./custom.event";
import {getJobData, JobId} from "../../shared/jobs";
import {testOneOfBooleans} from "../../shared/utilities";
import {Family} from "./families/family";
import {fractionCfg} from "./fractions/main";


CustomEvent.registerClient('job:dress:clear', (player) => {
    player.user.reloadSkin()
})
CustomEvent.registerClient('job:dress:save', (player, id, index, data:[number, number, number][], name: string) => {
    const user = player.user;
    if(!user) return;
    const item = JobDress.get(id);
    if(!item) return;
    if(!item.fraction && !item.family) return;
    if(!item.haveEditAccess(player)) return;
    const z = [...item.data.dress];
    if(typeof index === 'number' && z.find(q => q.id === index)){
        z.find(q => q.id === index).data = data;
        z.find(q => q.id === index).name = system.filterInput(name);
    } else {
        z.push({data, name, male: user.male, rank: 1, id: system.timestampMS })
    }
    item.data.dress = z;
    item.save()
    player.notify(player.user.LangString("job.dress.574ccd49238432f4cd8b1e4b09c39b8f"), 'success');
    item.menu(player);
})

export class JobDress {
    static pool: JobDress[] = [];
    static get(id: number){
        return this.pool.find(q => q.id === id)
    }
    static getIndex(id: number){
        return this.pool.findIndex(q => q.id === id)
    }
    static create(name: string, position: Vector3Mp, dimension = 0, fraction = 0, job: any = "", family: number = null){
        const item = new JobDressEntity();
        item.name = name;
        item.x = position.x;
        item.y = position.y;
        item.z = position.z;
        item.d = dimension;
        item.fraction = fraction;
        item.job = job || "";
        item.family = family;
        item.dress = [];
        item.save().then(data => {
            this.load(data);
        })
    }
    static createMenu(player: PlayerMp){
        let name: string;
        let fraction: number;
        let job: JobId;
        let family: number;
        const s = () => {
            const m = menu.new(player, player.user.LangString("job.dress.614fe910c5d9efb89de71c473ee37d21"));

            m.newItem({
                name: player.user.LangString("job.dress.a5ada45caac68f4531456e904e1b047b"),
                more: name ? player.user.LangString("job.dress.0ab30d31f84bd19d3c7da2aa630aed68") : player.user.LangString("job.dress.6391e79ceafac86e7a23dc124affe2ac"),
                desc: name || "",
                onpress: () => {
                    menu.input(player, player.user.LangString("job.dress.b7321a667df549bbe32b5601a6acf170"), name || "", 30).then(n => {
                        if(!n) return s();
                        name = n;
                        s();
                    })
                }
            })

            m.newItem({
                name: player.user.LangString("job.dress.6e70d0bcb99c58b7d9e2f7a05c095754"),
                more: fraction ? fractionCfg.getFractionName(fraction) : player.user.LangString("job.dress.20a1c0030b677d133519b147b1954cb2"),
                onpress: () => {
                    menu.selectFraction(player, "all", fraction).then(n => {
                        if(!n){
                            fraction = null;
                            return s();
                        }
                        fraction = n;
                        s();
                    })
                }
            })

            m.newItem({
                name: player.user.LangString("job.dress.fa0972d9ce41ca068b1da810e7b3373a"),
                more: job ? getJobData(job).name : player.user.LangString("job.dress.2668764f237823e81138b36aa6cc8f1e"),
                onpress: () => {
                    menu.selectJob(player, job).then(n => {
                        if(!n){
                            job = null;
                            return s();
                        }
                        job = n;
                        s();
                    })
                }
            })

            m.newItem({
                name: player.user.LangString("job.dress.ca147ba5206ba3db9cb659ee8b645c4b"),
                more: family ? Family.getByID(family).name : player.user.LangString("job.dress.958868d3271b5221eaf928bd28c00c33"),
                onpress: () => {
                    menu.selectFamily(player).then(id => {
                        if(!id){
                            family = null;
                            return s();
                        }
                        family = id;
                        s();
                    })
                }
            })

            m.newItem({
                name: player.user.LangString("job.dress.13d70f5ef010c3944028f0f0d2b562b1"),
                desc: player.user.LangString("job.dress.e615d92f6cc1c1894623c5dfd2a82458"),
                onpress: () => {
                    if(!fraction && !job && !family) return player.notify(player.user.LangString("job.dress.c93e12c32a152d42705f86dff618c568"), 'error');
                    if(!testOneOfBooleans(!!fraction, !!job, !!family)) return player.notify(player.user.LangString("job.dress.6413f3d203c11decd03d7ec9ef481efb"), 'error');
                    if(!name) return player.notify(player.user.LangString("job.dress.2069cd2232dfbd8f03854e19c75a5530"), 'error');
                    menu.close(player);
                    player.user.log("AdminJob", langStringDefault("job.dress.4048b13270b045641917eee643f86207", name));
                    this.create(name, new mp.Vector3(player.position.x, player.position.y, player.position.z - 1), player.dimension, fraction, job, family);
                    player.notify(player.user.LangString("job.dress.76c7f691094b6544ae032dca013877d3"), 'success')
                }
            })

            m.open();
        }
        s();
    }
    static loadAll(){
        return JobDressEntity.find().then(data => data.map(item => this.load(item)))
    }
    static load(item: JobDressEntity){
        new JobDress(item);
    }
    readonly data: JobDressEntity;
    private colshape: colshapeHandle;
    private scaleform: ScaleformTextMp;
    get id(){
        return this.data.id
    }
    get fraction(){
        return this.data.fraction
    }
    get job(){
        return this.data.job
    }
    get family(){
        return this.data.family
    }
    get position(){
        return new mp.Vector3(this.data.x, this.data.y, this.data.z);
    }
    set position(val){
        this.data.x = val.x;
        this.data.y = val.y;
        this.data.z = val.z;
    }
    get dimension(){
        return this.data.d
    }
    set dimension(val){
        this.data.d = val;
    }
    get name(){
        return this.data.name
    }
    set name(val){
        this.data.name = val;
    }
    save(){
        return this.data.save()
    }
    create(){
        this.clear()
        this.colshape = colshapes.new(this.position, this.name, player => this.menu(player), { dimension: this.dimension });
        this.scaleform = new ScaleformTextMp(new mp.Vector3(this.position.x, this.position.y, this.position.z + 1), this.name, {
            dimension: this.dimension,
            range: 7
        })
    }
    clear(){
        if(this.colshape && this.colshape.exists){
            this.colshape.destroy();
            this.colshape = null;
        }
        if(this.scaleform && ScaleformTextMp.exists(this.scaleform)){
            this.scaleform.destroy();
            this.scaleform = null;
        }
    }
    move(position: Vector3Mp, dimension: number){
        this.position = position;
        this.dimension = dimension;
        this.create();
        this.save();
    }
    delete(player: PlayerMp){
        player.user.log("AdminJob", langStringDefault("job.dress.2bdec67894f4490369aa2a09d8ef23d1", this.name, this.id));
        system.debug.debug('Garderobe', this.name, this.id, 'wurde gelöscht');
        this.data.remove()
        this.clear();
        JobDress.pool.splice(JobDress.getIndex(this.id), 1);
    }
    haveEditAccess(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if(user.hasPermission('admin:jobdress')) return true;
        return false;
    }
    haveAccess(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if(user.hasPermission('admin:jobdress')) return true;
        if(this.fraction && user.fraction === this.fraction) return true;
        if(!!this.job && this.job === user.job) return true;
        if (this.family && this.family === user.familyId) return true;
        return false;
    }
    dressEditMenu(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        if(!this.haveEditAccess(player)) return;
        const m = menu.new(player, player.user.LangString("job.dress.3c31b62b209fc28d5a7e3a03eebf19dc"));
        m.newItem({
            name: player.user.LangString("job.dress.3604bc9286aaf7c55f71ce88126c6887"),
            onpress: () => {
                CustomEvent.triggerClient(player, 'jobdress:edit', this.id, null, null, null)
            }
        })
        if(user.isAdminNow(5)){
            m.newItem({
                name: player.user.LangString("job.dress.a855f74c65b430f968ebc74a29cf8fce"),
                desc: player.user.LangString("job.dress.254362760470ba10c40fcbae76c4c546"),
                onpress: () => {
                    menu.input(player, player.user.LangString("job.dress.8c5e68ae85199a923f94f331ef874635"), '', 6, 'int').then(id => {
                        if(!id) return;
                        const l = JobDress.get(id);
                        if(!l) return player.notify(player.user.LangString("job.dress.4d95534cc72121a0d9873aade6ebef1a"), 'error');
                        const dressData = [...this.data.dress]
                        dressData.push(...l.data.dress)
                        this.data.dress = dressData;
                        this.save();
                        player.notify(player.user.LangString("job.dress.984490d2e3577a574c5b8be8e84eebfd"))
                    })
                }
            })
        }
        const dressData = [...this.data.dress]
        dressData.map((item,itemid) => {
            m.newItem({
                name: item.name,
                more: `${item.male ? player.user.LangString("job.dress.8e10ca3889a2a9536718c9cce1d2c373") : player.user.LangString("job.dress.f9ff6309f3a6ff873069b19229e12681")}`,
                onpress: () => {
                    const qw = () => {
                        const submenu = menu.new(player, item.name);
                        submenu.onclose = () => { this.dressEditMenu(player) };
                        submenu.newItem({
                            name: player.user.LangString("job.dress.f4c0e20799b415a8bed2a502b673e702"),
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if(!status) return;
                                    const d = [...this.data.dress];
                                    d.splice(itemid, 1);
                                    this.data.dress = d;
                                    this.save()
                                    player.notify(player.user.LangString("job.dress.571c80962585abd86c1a47f4f509420d"), 'success');
                                    this.dressEditMenu(player);
                                })
                            }
                        })

                        submenu.newItem({
                            name: player.user.LangString("job.dress.0f8cc1241a4426839068289b17e50d36"),
                            onpress: () => {
                                if(user.male !== item.male) return player.notify(player.user.LangString("job.dress.ccc4b2fce02775c4f70291cd433b1f29"), 'error');
                                CustomEvent.triggerClient(player, 'jobdress:edit', this.id, item.id, item.data, item.name)
                            }
                        })

                        submenu.newItem({
                            name: player.user.LangString("job.dress.ea54bd1d216b9092bb5502a97645c2b5"),
                            more: item.name,
                            onpress: () => {
                                menu.input(player, player.user.LangString("job.dress.1e90843dad1d3d2e4cd49fe3ec590dcc"), item.name, 20, 'text').then(val => {
                                    if(!val) return this.dressEditMenu(player);
                                    const q = [...this.data.dress]
                                    q.find(z => z.id === item.id).name = system.filterInput(val);
                                    this.data.dress = [...q]
                                    this.save().then(() => {
                                        qw();
                                    });
                                })
                            }
                        });
                        if(this.fraction){
                            submenu.newItem({
                                name: player.user.LangString("job.dress.7c95bf7bfb11e2589f51b3e131f2e104"),
                                more: fractionCfg.getRankName(this.fraction, item.rank),
                                onpress: () => {
                                    menu.selectRank(player, this.fraction, item.rank).then(rank => {
                                        if(!rank || rank === item.rank) return;
                                        const q = [...this.data.dress]
                                        q.find(z => z.id === item.id).rank = rank;
                                        this.data.dress = [...q]
                                        this.save().then(() => {
                                            player.notify(player.user.LangString("job.dress.672576a126754cf773abcb4d4063259c"))
                                            qw();
                                        });
                                    })
                                }
                            });
                        }

                        submenu.newItem({
                            name: player.user.LangString("job.dress.d789e386e374c4ad30f1a850fc0d7b0a"),
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if(!status) return;
                                    const q = [...this.data.dress]
                                    const i = q.findIndex(z => z.id === item.id)
                                    q.splice(i, 1);
                                    this.data.dress = [...q]
                                    this.save().then(() => {
                                        qw();
                                    });
                                })
                                menu.input(player, player.user.LangString("job.dress.889383a100475b2033c09270e826c538"), item.name, 20, 'text').then(val => {
                                    if(!val) return this.dressEditMenu(player);
                                    const q = [...this.data.dress]
                                    q.find(z => z.id === item.id).name = val;
                                    this.data.dress = [...q]
                                    this.save().then(() => {
                                        qw();
                                    });
                                })
                            }
                        });

                        submenu.open();
                    }
                    qw();

                }
            })
        })
        m.open();
    }
    getDress(player: PlayerMp){
        return this.getAllDress(player)[0]
    }
    getAllDress(player: PlayerMp){
        const user = player.user;
        if(!user) return [];
        return this.data.dress.filter(q => q.male == user.male && (!this.fraction || !q.rank || q.rank <= user.rank))
    }
    dressUp(player: PlayerMp, item: [number, number, number][]){
        const user = player.user;
        if(!user) return;
        if(!item) return user.setJobDress(null);
        user.setJobDress(item);
        user.jobdressId = this.id;
    }
    menu(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        if(!this.haveAccess(player)) return player.notify(player.user.LangString("job.dress.db93bb5c33d29975c62a9fdec06247c9"), 'error');
        const m = menu.new(player, this.name);



        if(user.getJobDress){
            m.newItem({
                name: player.user.LangString("job.dress.94374db12d8af02d0fd1e01674eee321"),
                onpress: () => {
                    if(!user.mp_character) return player.notify(player.user.LangString("job.dress.22642303f324f87b47a8289b5ce54b2c"), 'error')
                    user.setJobDress(null);
                    player.notify(player.user.LangString("job.dress.8cd3c9ea4ea5764f32da3e732f5581ad"), 'success')
                    this.menu(player);
                }
            })
        }

        this.getAllDress(player).map(item => {
            m.newItem({
                name: item.name,
                onpress: () => {
                    if(!user.mp_character) return player.notify(player.user.LangString("job.dress.ac7db43a0667060956d1e74328677537"), 'error')
                    this.dressUp(player, item.data);
                    player.notify(player.user.LangString("job.dress.aefcd649d4f1ff901b918bf144035dab"), 'success');
                    this.menu(player);
                }
            })
        })

        if(this.haveEditAccess(player)){
            m.newItem({
                name: player.user.LangString("job.dress.536483d8ca304c1f20fcd56b414d4ba4"),
                onpress: () => {
                    this.dressEditMenu(player);
                }
            })
        }

        if(user.hasPermission('admin:jobdress')){
            m.newItem({
                name: player.user.LangString("job.dress.e6dce74c8ba5141f0128431eaf656f2d")
            })
            if(user.isAdminNow(5)){
                m.newItem({
                    name: player.user.LangString("job.dress.f66c0857a87823bd884ff139d5e93540"),
                    more: this.id
                })
            }
            m.newItem({
                name: player.user.LangString("job.dress.2483622ea320d9a66057a112d313e086"),
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player);
                        menu.close(player)
                        this.move(new mp.Vector3(player.position.x, player.position.y, player.position.z - 1), player.dimension)
                        player.notify(player.user.LangString("job.dress.f7dc99b49512a46c960a0ad04c56de99"), 'success');
                    })
                }
            })

            m.newItem({
                name: player.user.LangString("job.dress.761f132eb47585b1674546bcf74f29a4"),
                desc: player.user.LangString("job.dress.5fee9a54e054e8fddcfab9690ede4961"),
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player);
                        menu.close(player)
                        this.delete(player)
                        player.notify(player.user.LangString("job.dress.a080a7b8a1d96f7890ea2595eba24a77"), 'success');
                    })
                }
            })
        }
        m.open();
    }
    constructor(item: JobDressEntity) {
        this.data = item;
        let q:typeof item.dress = [];
        item.dress.map(z => {
            if(z.id) q.push(z)
        })
        item.dress = [...q];
        this.create()
        JobDress.pool.push(this);
    }
}


CustomEvent.registerClient('garderob:new', player => {
    const user = player.user;
    if(!user) return;
    if(user.hasPermission('admin:jobdress')) JobDress.createMenu(player)
})