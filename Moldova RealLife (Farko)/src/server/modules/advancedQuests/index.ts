import { langStringDefault } from "../../../shared/lang";
import {system} from "../system";
import {IQuestFactory} from "./interfaces/IQuestFactory";

export const QUESTS_ROUTE_BLIP_COLOR = 27;
export const QUESTS_ROUTE_BLIP_NAME = langStringDefault("index.70c64f8aa3aa619df8a0543685787357");

const registeredFactories = new Map<string, IQuestFactory>();
export function registerQuestFactory(questId: string, factory: IQuestFactory) {
    if (registeredFactories.has(questId)) {
        return system.debug.error(langStringDefault("index.70d2e935e88fe8a11cdd127c44a6ffe2", questId));
    }

    registeredFactories.set(questId, factory);
}

export function getQuestFactory(questId: string): IQuestFactory {
    return registeredFactories.get(questId);
}

