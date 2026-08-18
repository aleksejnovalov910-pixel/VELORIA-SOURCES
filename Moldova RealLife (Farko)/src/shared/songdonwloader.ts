export const YOUTUBE_LIMIT_ACCESS = {
    /** Die Anzahl der Likes ist ein Minimum */
    likesCount: 1,
    /** Anzahl der Ansichten Minimum */
    viewsCount: 1,
    /** Количество комментариев минимум */
    commentsCount: 1,
    /** Prozentsatz der Ablehnungen im Verhältnis zur Summe der Likes und Dislikes. Wenn der Wert über der angegebenen Zahl liegt, wird er nicht übersprungen. */
    dislikePercent: 20,
    /** Сколько секунд минимум должен длится ролик */
    durationMinSeconds: 20,
    /** Сколько секунд максимум должен длится ролик */
    durationMaxSeconds: 60 * 5,
}
/** Ordner mit Tondateien, nicht verändern */
export const SONG_FOLDER_NAME = "songs"
export const SONG_FOLDER = `./${SONG_FOLDER_NAME}/`
