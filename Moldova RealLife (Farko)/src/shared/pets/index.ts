export enum PetState {
    Sit,
    Stand,
    Follow
}

/**
 * Интерфейс определяет данные для синхронизация создания собаки
 */
export interface IPetFullData {
    id: number
    model: Hash
    position: Vector3Mp
    /**
     * ID игрока, "управляющего" состоянием собаки 
     */
    controllerId: number
    currentState: PetState
}

interface IPetConfig {
    itemId: number
    modelHash: string
}

export const petsConfig: IPetConfig[] = [
    { itemId: 150, modelHash: "a_c_chop" },
    { itemId: 150, modelHash: "a_c_husky" },
    { itemId: 150, modelHash: "a_c_poodle" },
    { itemId: 150, modelHash: "a_c_pug" },
    { itemId: 150, modelHash: "a_c_shepherd" },
    { itemId: 150, modelHash: "a_c_westy" },
    { itemId: 150, modelHash: "a_c_retriever" },
]