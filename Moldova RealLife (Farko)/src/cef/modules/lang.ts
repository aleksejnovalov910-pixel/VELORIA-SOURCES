import { DEFAULT_SELECTED_LANG } from "../../shared/lang/default";
import { getAllLangs, langData, langString, langType } from "../../shared/lang";

export let currentLang: langType = DEFAULT_SELECTED_LANG;

export const SetLang = (lang: langType) => {
  currentLang = lang
}

export const LangString = (key: langData, ...args: (number | string | boolean)[]) => {
  return langString(currentLang, key, ...args);
};
