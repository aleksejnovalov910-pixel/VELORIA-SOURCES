import {VOTE_POS} from "../../shared/vote";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {LEVEL_PERMISSIONS} from "../../shared/level.permissions";
import {VoteEntity, VoteList} from "./typeorm/entities/vote";
import {system} from "./system";

let votes = new Map<number, VoteEntity>();


export const loadAllVotes = () => {
    return new Promise(resolve => {
        VoteEntity.find().then(items => {
            items.map(item => {
                votes.set(item.id, item)
            })
            resolve(null)
        })
    })
}

colshapes.new(VOTE_POS, player => {
    return player.user?.LangString("vote.colshape")
}, (player) => {
    const user = player.user;
    if(!user) return;
    if(user.playtime < LEVEL_PERMISSIONS.VOTE) return player.notify(player.user.LangString("vote.colshape.errlevel", LEVEL_PERMISSIONS.VOTE), "error");
    const m = menu.new(player, user.LangString("vote.menu.title"));



    if([...votes].length > 0) m.newItem({name: user.LangString("vote.menu.list")})
    else m.newItem({name: user.LangString("vote.menu.list2")});

    votes.forEach(item => {
        m.newItem({
            name: item.name,
            more: `${item.end < system.timestamp ? user.LangString("vote.menu.tm1") : user.LangString("vote.menu.tm2", system.timeStampString(item.end))}`,
            desc: user.LangString("vote.menu.desc", system.timeStampString(item.start)),
            onpress: () => {
                openVote(player, item);
            }
        })
    })

    if(user.hasPermission("admin:vote")){

        m.newItem({
            name: user.LangString("vote.menu.admin"),
            onpress: () => {

                let name: string;
                let variants: string[] = [];
                let hours = 24;

                const z = () => {
                    const s = menu.new(player, user.LangString("vote.menu.admin.submenu.title"));
                    s.newItem({
                        name: user.LangString("vote.menu.admin.submenu.item1"),
                        more: name || user.LangString("vote.menu.admin.submenu.item1.more"),
                        onpress: () => {
                            menu.input(player, user.LangString("vote.menu.admin.submenu.item1.input"), name || "", 30, "text").then(n => {
                                if(!n) return;
                                name = n;
                                z();
                            })
                        }
                    })
                    s.newItem({
                        name: user.LangString("vote.menu.admin.submenu.item2"),
                        more: hours,
                        desc: user.LangString("vote.menu.admin.submenu.item2.desc", system.timeStampString(system.timestamp + (hours * 60 * 60))),
                        onpress: () => {
                            menu.input(player, user.LangString("vote.menu.admin.submenu.item2.input"), hours, 10, "int").then(n => {
                                if(!n) return;
                                if(isNaN(n) || n < 0 || n > 10000) return;
                                hours = n;
                                z();
                            })
                        }
                    })
                    s.newItem({
                        name: user.LangString("vote.menu.admin.submenu.item3"),
                        onpress: () => {
                            menu.input(player, user.LangString("vote.menu.admin.submenu.item3.input"), "", 20, "text").then(n => {
                                if(!n) return;
                                if(variants.includes(n)) return player.notify(user.LangString("vote.menu.admin.submenu.item3.input.err"), "error");
                                variants.push(n);
                                z();
                            })
                        }
                    })
                    variants.map((variant, i) => {
                        s.newItem({
                            name: variant,
                            onpress: () => {
                                variants.splice(i, 1)
                                player.notify(user.LangString("vote.menu.admin.submenu.rm"), "error")
                                z();
                            }
                        })
                    })
                    s.newItem({
                        name: user.LangString("vote.menu.admin.submenu.item4"),
                        onpress: () => {
                            menu.accept(player).then(status => {
                                if(!status) return;
                                if(!name) return player.notify(user.LangString("vote.menu.admin.submenu.item4.errname"), "error")
                                if(variants.length < 2) return player.notify(player.user.LangString("vote.menu.admin.submenu.item4.errlen"), "error")
                                menu.close(player)
                                let vote = new VoteEntity()
                                vote.name = name;
                                vote.closed = 0;
                                vote.start = system.timestamp
                                vote.end = vote.start + (hours * 60 * 60)
                                vote.variants = variants;
                                vote.variants_res = new Array(variants.length).fill(0)
                                vote.save().then(itm => {
                                    votes.set(itm.id, itm);
                                    player.notify(user.LangString("vote.menu.admin.submenu.item4.save"), "success");
                                })
                            })
                        }
                    })
                    s.open()
                }

                z();
            }
        })

    }

    m.open();
}, {
    type: 27,
    drawStaticName: "scaleform"
})

const openVote = (player: PlayerMp, item: VoteEntity) => {
    const user = player.user;
    if(!user) return;
    if(user.playtime < LEVEL_PERMISSIONS.VOTE) return player.notify(user.LangString("vote.colshape.errlevel", LEVEL_PERMISSIONS.VOTE), "error");
    VoteList.findOne({
        where: {
            user: user.id,
            vote: item.id
        }
    }).then(myvote => {
        const m = menu.new(player, user.LangString("vote.menu.title"), item.name);

        m.newItem({
            name: user.LangString("vote.menu.openVote.1"),
            more: system.timeStampString(item.start)
        })
        m.newItem({
            name: user.LangString("vote.menu.openVote.2"),
            more: system.timeStampString(item.end)
        })
        m.newItem({
            name: user.LangString("vote.menu.openVote.3"),
            more: (item.closed ? user.LangString("vote.menu.openVote.3.1") : (item.end < system.timestamp ? user.LangString("vote.menu.openVote.3.2") : user.LangString("vote.menu.openVote.3.3")))
        })
        const canVote = !item.closed && item.end > system.timestamp && !myvote;
        if(canVote){
            item.variants.map((variant, index) => {
                m.newItem({
                    name: user.LangString("vote.menu.openVote.item", variant),
                    onpress: () => {
                        menu.close(player)
                        menu.accept(player, user.LangString("vote.menu.openVote.item.accept", variant)).then(status => {
                            if(!status) return openVote(player, item);
                            VoteList.findOne({
                                where: {
                                    user: user.id,
                                    vote: item.id
                                }
                            }).then(status => {
                                if(status) return player.notify(user.LangString("vote.menu.openVote.item.accept.err"), "error"), openVote(player, item);
                                let newVote = new VoteList();
                                newVote.user = user.id;
                                newVote.name = user.name;
                                newVote.vote = item.id;
                                newVote.variant = index;
                                newVote.save().then(() => {
                                    player.notify(user.LangString("vote.menu.openVote.item.accept.notify"))
                                    const q = [...item.variants_res]
                                    q[index]++;
                                    item.variants_res = q;
                                    openVote(player, item);
                                    item.save();
                                })
                            })
                        })
                    }
                })
            })
        } else if(myvote){
            m.newItem({
                name: user.LangString("vote.menu.openVote.myvote"),
                more: item.variants[myvote.variant]
            })
        }

        m.newItem({
            name: !item.closed && item.end > system.timestamp ? user.LangString("vote.menu.openVote.active") : user.LangString("vote.menu.openVote.inactive")
        })

        item.variants.map((name, index) => {
            m.newItem({
                name: name,
                more: item.variants_res[index]
            })
        })

        if(user.hasPermission("admin:vote")){
            m.newItem({
                name: user.LangString((item.closed ? "vote.menu.openVote.admin.closed" : "vote.menu.openVote.admin.opened")),
                desc: user.LangString("vote.menu.openVote.admin.desc"),
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return;
                        item.closed = item.closed === 1 ? 0 : 1
                        item.save().then(() => {
                            openVote(player, item);
                        })
                    })
                }
            })

            m.newItem({
                name: user.LangString("vote.menu.openVote.admin2"),
                desc: user.LangString("vote.menu.openVote.admin2.desc"),
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return;
                        menu.close(player)
                        votes.delete(item.id);
                        item.remove()
                        VoteList.find({vote: item.id}).then(list => VoteList.remove(list))
                        player.notify(user.LangString("vote.menu.openVote.admin2.notify"), "success")
                    })
                }
            })
        }

        m.open();
    })

}