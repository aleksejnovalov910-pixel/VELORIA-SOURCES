import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event";
import {DialogInput, MenuClass} from "./menu";
import {
    generateClothData,
    getComponent,
    oldClothData,
    resetCloth,
    resetClothData,
    setComponent,
    undress
} from "./cloth";
import {user} from "./user";
import {system} from "./system";
const player = mp.players.local;

let components = [107, 106, 102, 101, 100, 7, 1, 6, 4, 3, 8, 11];

const getCurrent = (): [number, number, number][] => {
    return components.map(component => [component, getComponent(component).drawable, getComponent(component).texture])
}



CustomEvent.registerServer("jobdress:edit", (id:number, index?:number, data?: [number, number, number][], name?:string) => {
    if (oldClothData.length == 0) generateClothData();
    // resetCloth();
    undress()
    if(data) data.map(item => setComponent(item[0], item[1], item[2]));

    const pos = {...player.position}



    let int = setInterval(() => {
        if(system.distanceToPos(player.position, pos) > 5){
            close();
        }
    }, 1000)

    const close = () => {
        resetCloth();
        resetClothData();
        clearInterval(int)
        CustomEvent.triggerServer("job:dress:clear")
        MenuClass.closeMenu()
    }

    const q = (z = 0) => {

        let m = new MenuClass("", typeof index === "number" ? LangString("job.dress.76ecd5fc0a1deea137ad21574b777ed0") : LangString("job.dress.557986b18da7ffaf4891efe3165e1abd"));
        m.onclose = () => {
            close();
        }
        m.exitProtect = true;

        m.newItem({
            name: LangString("job.dress.b1667d09aac5e3a18a7ecef80cf69470"),
            more: name,
            onpress: (_, i) => {
                DialogInput(LangString("job.dress.5a9dd541134e73a0d37c8345da75090f"), name || "", 10).then(val => {
                    if(!val) return;
                    name = system.filterInput(val);
                    q(i);
                })
            }
        })

        getCurrent().map((item, i) => {
            m.newItem({name: LangString("job.dress.5ee83b5395089ddbee637488b39475bb")})
            m.newItem({
                name: LangString("job.dress.1db0b52781d14aafec173cfd7869a1d1"),
                more: item[0],
            })
            m.newItem({
                name: LangString("job.dress.9295f0150b530df6aecccd5fea060f5b"),
                type: "range",
                rangeselect: [-1, 9999],
                listSelected: item[1] + 1,
                onchange: (val) => {
                    item[1] = val - 1;
                    setComponent(item[0], item[1], item[2]);
                },
                onpress: (_, i) => {
                    DialogInput(LangString("job.dress.2c4afebfdd4d2bd3c87436b9ea2fe9b8"), item[1], 4, "int").then(val => {
                        if(typeof val !== "number") return;
                        item[1] = val;
                        setComponent(item[0], item[1], item[2]);
                        q(i);
                    })
                }
            })
            m.newItem({
                name: LangString("job.dress.3f968277e6ba44b79ffced35fbcb6926"),
                type: "range",
                rangeselect: [-1, 9999],
                listSelected: item[2] + 1,
                onchange: (val) => {
                    item[2] = val - 1;
                    setComponent(item[0], item[1], item[2]);
                },
                onpress: (_, i) => {
                    DialogInput(LangString("job.dress.bf64c5759e9d8dd8ad6ab3bb0aa6618a"), item[1], 4, "int").then(val => {
                        if(typeof val !== "number") return;
                        item[2] = val;
                        setComponent(item[0], item[1], item[2]);
                        q(i);
                    })
                }
            })
        })

        m.newItem({
            name: LangString("job.dress.c56ed52aa28434c1d384257b06e47c87"),
            onpress: () => {
                if(!name) return user.notify(LangString("job.dress.8c3051f6f33f83cd0eec5ceed0b6d01d"), "error")
                const current = getCurrent();
                close();
                CustomEvent.triggerServer("job:dress:save", id, index, current, name)

            }
        })

        m.open(z);
    }
    q();

})