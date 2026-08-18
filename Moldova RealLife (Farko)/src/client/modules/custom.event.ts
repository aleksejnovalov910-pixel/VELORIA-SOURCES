import { LangString, langStringDefault } from "./lang";
import {CustomEventBase} from "../../shared/custom.event";
import {user} from "./user";
import { system } from "./system";

type serverEventHandle = (...args: any[]) => void
mp.events.add("setKey", (key: number) => {
    CustomEvent.key = key
})
mp.events.add("alerts:load", () => {
    CustomEvent.triggerCef("setKey", CustomEvent.key)
})
export class CustomEvent extends CustomEventBase {
    static callServerResponse = 1
    static requestServerHandle = new Map<number,(value?:any)=>any>()
    static callServerResponseCEF = 1
    static requestServerHandleCEF = new Map<number,(value?:any)=>any>()
    static registerServerEvents: [string, serverEventHandle][] = []
    static registerSocketEvents: [string, serverEventHandle][] = []

    static key: number
    static encryptEventName(eventName: string): string {
        return eventName
            .split("")
            .map(s => (s.charCodeAt(0) ^ CustomEvent.key).toString(16))
            .join("g")
    }

    static triggerServer(eventName:string, ...args:any[]) {
        mp.events.callRemote("trigger:client", CustomEvent.encryptEventName(eventName), JSON.stringify(args))
    }
    static callServer(eventName:string, ...args:any[]):Promise<any> {
        const requestID = CustomEvent.callServerResponse++;
        return new Promise((resolve, reject) => {
            CustomEvent.requestServerHandle.set(requestID, resolve)
            mp.events.callRemote("call:client", requestID, CustomEvent.encryptEventName(eventName), JSON.stringify(args))
        })
    }
    static triggerCef(eventName: string, ...args: any[]){
        const data = system.toBinary(JSON.stringify(args))
        mp.browsers.forEach(browser => {
            if(browser.eventReady)
            {
                browser.execute(`customevent.triggerCef('${eventName}', '${data}');`)
            }
        });
    }
    static forceTriggerCef(eventName: string, ...args: any[]){
        const data = system.toBinary(JSON.stringify(args))
        mp.browsers.forEach(browser => {
            browser.execute(`customevent.triggerCef('${eventName}', '${data}');`)
        });
    }
    static registerServer(eventName: string, handle: serverEventHandle){
        this.registerServerEvents.push([eventName, handle]);
    }
    static registerSocket(eventName: string, handle: serverEventHandle){
        this.registerSocketEvents.push([eventName, handle]);
    }
}
mp.events.add("socket:server", (event: string, ...data: any[]) => {
    CustomEvent.registerSocketEvents.filter(item => item[0] == event).map(item => {
        item[1](...data)
    })
})

mp.events.add("client:trigger:event", (eventname: string, argsstring: string) => triggerEvent(eventname, argsstring))

mp.events.add("toggleEventsLogging", () => {
    enableEventsLogging = !(!!enableEventsLogging);
});

let enableEventsLogging = mp.storage.data.enableEventsLoggin

const eventsCountMap = new Map<string, number>();
const triggerEvent = async (eventname: string, argsstring: string) => {

    if (!eventsCountMap.has(eventname)) {
        eventsCountMap.set(eventname, 0);
    }

    eventsCountMap.set(eventname, (eventsCountMap.get(eventname) + 1));

    const events = CustomEvent.registerServerEvents.filter(item => item[0] == eventname);


    if (enableEventsLogging) {
        mp.console.logInfo(LangString("custom.event.afbf9ee6e4ebbba10f10b0fa3e82cc99", eventname));
    }

    if (events.length == 0) return mp.console.logError(LangString("custom.event.a1b8cde1fbe87f4e7bcbe8e51cc8a5b4", eventname), true);
    events.map(q => {
        try {
            q[1](...(JSON.parse(argsstring)));
        } catch (error) {

            if (enableEventsLogging) {
                mp.console.logError(LangString("custom.event.608335956eb72dc40bfb6ab50f397025", eventname, error));
            }
        }
    });

    if (enableEventsLogging) {
        mp.console.logInfo(LangString("custom.event.a0e6331ef43a85e0edf053046aa60c11", eventname));
    }
}

let splitTrigger = new Map<string, string[]>();

mp.events.add("client:trigger:event:split", async (tid: number, index: number, last: boolean, eventname: string, argsstring: string) => {
    const events = CustomEvent.registerServerEvents.filter(item => item[0] == eventname);
    if (events.length == 0) return mp.console.logError(LangString("custom.event.ce22891e71595e47d2a0315687093552", eventname), true);
    if (!splitTrigger.has(`${tid}_${eventname}`)){
        splitTrigger.set(`${tid}_${eventname}`, []);
    }

    let d = splitTrigger.get(`${tid}_${eventname}`);
    d[index] = argsstring;
    if (last){
        triggerEvent(eventname, d.join(""));
    } else {
        splitTrigger.set(`${tid}_${eventname}`, d);
    }
})
mp.events.add("client:call:event", async (eventname: string, requestID: number, argsstring: string) => {
    try {
        let q = CustomEvent.registerServerEvents.find(item => item[0] == eventname);
        if (!q) mp.events.callRemote("client:call:event:result", requestID, null);
        let res = await q[1](...(JSON.parse(argsstring)));
        mp.events.callRemote("client:call:event:result", requestID, res)
    } catch (error) {
        mp.console.logError(error, true);
    }
})

mp.events.add("cef:trigger:event", (eventName: string, args:string) => {
    CustomEvent.triggerCef(eventName, ...JSON.parse(args))
})

mp.events.add("call:client:response", (requestID:number, res:any) => {
    let resolve = CustomEvent.requestServerHandle.get(requestID)
    if(!resolve) return;
    resolve(res);
});
mp.events.add("call:cef:response", (requestID:number, res:any) => {
    mp.browsers.forEach(browser => {
        if(browser.eventReady) browser.execute(`customevent.callServerResponseHandle(${requestID}, '${JSON.stringify(res)}');`)
    });
});

mp.events.add("call:server", (requestID:number, eventName: string, ...args:any[]) => mp.events.callRemote("call:cef", requestID, CustomEvent.encryptEventName(eventName), ...args))
mp.events.add("call:clientfromcef", async (requestID:number, eventName: string, ...args:any[]) => {
    const fnd = await CustomEvent.call(eventName, ...args)
    mp.browsers.forEach(browser => {
        if(browser.eventReady) browser.execute(`customevent.callClientResponseHandle(${requestID}, '${JSON.stringify(fnd)}');`)
    });
})

mp.events.add("trigger:server", (name:string, args:string) => mp.events.callRemote("trigger:cef", CustomEvent.encryptEventName(name), args));

mp.events.add("testDebug", () => {
    let max = { event: "none", count: -1 };
    for (let key of [...eventsCountMap.keys()]) {
        if (eventsCountMap.get(key) > max.count) {
            max = { event: key, count: eventsCountMap.get(key) }
        }
    }

    user.notify(`event with max count: ${max.event}, (${max.count})`);

    user.notify("test")
})
