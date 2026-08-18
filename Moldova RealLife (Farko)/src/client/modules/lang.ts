// Lang file ready
import { DEFAULT_SELECTED_LANG } from "../../shared/lang/default";
import { getAllLangs, langData, langString, langType, langStringDefault as q } from "../../shared/lang";

let currentLang: langType = DEFAULT_SELECTED_LANG;

export const GetCurrentLang = (): langType => {
    return currentLang
}
export const SetCurrentLang = (lang: langType) => {
    currentLang = lang;
}

export const LangString = (key: langData, ...args: any[]) => {
    return langString(currentLang, key, ...args)
}

export const langStringDefault = q;



