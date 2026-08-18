export interface IPokerPlayerDTO {
    /** ID игрока из БД */
    userId: number

    // Текущий баланс фишек за столом игрока 
    balance: number

    /** Anzahl der Chips, die vor dem Spieler liegen (während der aktuellen Phase) */
    currentStageBet: number

    /** Находится ли игрок в игре (текущая раздача) */
    inGame: boolean
}