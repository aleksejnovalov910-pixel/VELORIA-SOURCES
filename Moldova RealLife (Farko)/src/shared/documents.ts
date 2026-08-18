import { langStringDefault } from "./lang/index";
import { systemUtil } from "./system";

/** Список тегов
 * @id ID игрока, которому он выдан,
 * @name RP Имя игрока
 * @social Social Number игрока (номер ID карты)
 * @idCreator ID игрока, который выдал,
 * @nameCreator RP Имя игрока, который выдал
 * @socialCreator Social Number игрока (номер ID карты), который выдал
 * @code Уникальный длинный код, который у каждого документа свой
 * @date Полная дата
 * @n - Использовать для переноса текста
 * 
 */


export type DocumentId = "weapon_theory" | "mental_examination_ok" | "mental_examination_middle" | "mental_examination_fail" | "phisical_examination_ok"
export const getDocumentName = (id: DocumentId) => {
    const i = document_templates.find(q => q.id === id)
    return i ? i.typeShort : null
}
export const document_templates: {
    /** Уникальный ID для каждого документа */
    id: DocumentId,
    /** Короткая строка для дополнения к названию предмета в инвентаре */
    typeShort: string,
    /** Заголовок просматриваемого документа */
    title: string,
    /** Текст просматриваемого документа */
    text: string
}[] = [
        { id: "weapon_theory", typeShort: langStringDefault("documents.6cbaaf1e9aac81f7b086dbf9d5382c0e"), title: langStringDefault("documents.17318f3ed0ad7c48d978b55725a7d2ed"), text: langStringDefault("documents.92db845a5a1e5ea3a1231d95502500a3") },
        { id: "mental_examination_ok", typeShort: langStringDefault("documents.a27a94c20d45ddb296133603e276b0aa"), title: langStringDefault("documents.f09e8a825aa7e48983ee53723e7f7a34"), text: langStringDefault("documents.e0c871ff6df5a35163ebc0d751efb201") },
        { id: "mental_examination_middle", typeShort: langStringDefault("documents.daf99176a2229f0a9d36d71867d6d7f7"), title: langStringDefault("documents.193c18f3c36417092100cee96e497777"), text: langStringDefault("documents.cc69d24b4a28ddf58928ed88bbf10233") },
        { id: "mental_examination_fail", typeShort: langStringDefault("documents.9f6424760ede6d052940228598f80beb"), title: langStringDefault("documents.2811fdc72a7bb39e49ed93d5b6928537"), text: langStringDefault("documents.d3f58ef9efd5ebcb1f14b14c3bbafa83") },

        { id: "phisical_examination_ok", typeShort: langStringDefault("documents.9efdd1db3eba3d169687116eecd4599b"), title: langStringDefault("documents.86125f21867e8c67568627180efdb2c8"), text: langStringDefault("documents.cd0f29d52c66923cfe3985bbdec65f8f") },
    ]

const fakeStringCheck = ["a", "o", "w", "j", "i", "o", "v", "y", "u", "l"]
const fakeStringReplace = ["o", "a", "v", "l", "l", "a", "y", "u", "v", "i"]

export const getFakeSignText = (text: string) => {
    let res:string[] = [];
    text.split("").map(q => {
        const indx = fakeStringCheck.findIndex(s => s === q);
        if(indx > -1){
            q = q.replace(q, fakeStringReplace[indx])
        }
        res.push(q);
    })
    return res.join("")
}

export const getDocumentData = (document: string, date: string, code: string, id: string, name: string, social: string, idCreator: string, nameCreator: string, socialCreator: string, realStr: string) => {
    const replace = (text: string) => {
        text = text.replace(/@date/g, systemUtil.timeStampString(parseInt(date), true) || langStringDefault("documents.55fb2633c4abd553a6627de2276ac3c8"));
        text = text.replace(/@code/g, code || langStringDefault("documents.875acb9572f117180937c5cef3e0a3e6"));
        text = text.replace(/@idCreator/g, idCreator || langStringDefault("documents.ca8b2ef660f54d85a3e7b33cf7f23377"));
        text = text.replace(/@nameCreator/g, nameCreator || langStringDefault("documents.5004cff7305871716d1920b4577feb9d"));
        text = text.replace(/@socialCreator/g, socialCreator || langStringDefault("documents.679ee9981b0dc5fa825b395d28f61810"));
        text = text.replace(/@id/g, id || langStringDefault("documents.bc5acc5de077690224cacd7bf9c899db"));
        text = text.replace(/@name/g, name || langStringDefault("documents.322e2918b8ec409fe113cbe5c3e33034"));
        text = text.replace(/@social/g, social || langStringDefault("documents.107b7d9aac3b00c4a3cb2d92bc8016e1"));
        return text
    }
    const cfg = document_templates.find(q => q.id === document);
    if (!cfg) return null;
    let title = replace(cfg.title)
    let text = replace(cfg.text)
    return { title, text, real: realStr === "true" }
}