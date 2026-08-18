import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event";
import {gui} from "./gui";

let signatureIDS = 0;

let signaturePromises = new Map<number,(res: boolean) => any>()

export const getSignature = (document: string, info: string = LangString("signature.4a513b1b8b0f2e28ae21645e03df56e0")) => {
    return new Promise((resolve) => {
        gui.setGui("signature");
        signatureIDS++
        CustomEvent.triggerCef("signature:load", info, document, signatureIDS);
        signaturePromises.set(signatureIDS, resolve)
    })
}

CustomEvent.registerServer("signature:get", (document: string, info?: string) => {
    return getSignature(document, info);
})

mp.events.add("signature:save", (ids: number, status: boolean) => {
    if (!signaturePromises.has(ids)) return;
    signaturePromises.get(ids)(status);
    signaturePromises.delete(ids);

    mp.events.call("passport:image:start");
})