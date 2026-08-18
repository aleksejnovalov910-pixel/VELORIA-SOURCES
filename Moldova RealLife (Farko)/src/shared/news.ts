/** Стоиомость подачи объявления */
export const NEWS_POST_COST = 300

export const NEWS_CATEGORY = [
    ["other", "Altele"],
    ["veh", "Vehicule"],
    ["house", "Imobiliare"],
    ["business", "Afaceri"],
    ["job", "Joburi"],
    ["news", "Stiri"],    
]

export const getCategoryName = (cat: string) => {
    return NEWS_CATEGORY.find(q => q[0] === cat)[1]
}