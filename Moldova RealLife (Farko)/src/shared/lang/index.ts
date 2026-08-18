import en from "./en.json";

export const langs = {
    ["en"]: { // english localization
        ...en,
    },
};

export type LangIdName = keyof typeof langs;

export type langData = keyof (typeof langs)[keyof typeof langs];

export type langType = keyof typeof langs;

export const langString = (
    lang: keyof typeof langs,
    id: langData,
    ...args: (number | string | boolean)[]
) => {
    if (!lang) {
        lang = "en";
    }

    return langStringSystem(lang, id, true, ...args);
};

export const langStringDefault = (
    id: langData,
    ...args: (number | string | boolean)[]
) => {
    return langString("en", id, ...args)
};

export const langStringExist = (key: string) => {
    return !!(langs[getAllLangs()[0]] as any)[key as any];
};

const langStringSystem = (
    lang: keyof typeof langs,
    id: langData,
    deep: boolean,
    ...args: (number | string | boolean)[]
) => {
    if (!getAllLangs().includes(lang)) {
        lang = "en";
    }

    let string = langs[lang][id] as string;

    if (!string) {
        return "";
    }

    args.map((q, ii) => {
        const i = ii + 1;
        const reg = new RegExp(`%${i}%`, "gi");

        string = string.replace(reg, String(q));
    });

    // if (deep) {
    //     const test = string.match(new RegExp("%[a-zA-Z-_0-9]+%", "gi"));

    //     test?.forEach((value, i) => {
    //         const res = langStringSystem(
    //             lang,
    //             value.replace(new RegExp("%", "gi"), "") as any,
    //             false,
    //             ...args,
    //         );

    //         if (res) {
    //             string = string.replace(value, res);
    //         }
    //     });
    // }

    if (deep) {
        const matches = string.match(/%[a-zA-Z0-9_-]+%/g);
    
        matches?.forEach((placeholder) => {
            const key = placeholder.slice(1, -1) as langData;
            const resolved = langStringSystem(lang, key, false, ...args);
    
            if (resolved) {
                string = string.replace(placeholder, resolved);
            }
        });
    }
    
    return string;
};

export const allLangStrings = (id: langData, ...args: (number | string | boolean)[]) => {
    const res: string[] = [];

    Object.values(langs).forEach((data) => {
        let string = data[id] as string;

        if (!string) {
            return "";
        }

        // args.map((q, ii) => {
        //     const i = ii + 1;
        //     const reg = new RegExp(`%${i}%`, "gi");

        //     string = string.replace(reg, String(q));
        // });

        args.forEach((arg, index) => {
            const pattern = new RegExp(`%${index + 1}%`, "gi");
            string = string.replace(pattern, String(arg));
        });        

        res.push(string);
    });

    return res;
};

export const getAllLangsKeys = () => {
    const res: langData[] = [];

    Object.values(langs).forEach((data) => {
        (Object.keys(data) as any).forEach((key: langData) => {
            if (!res.includes(key)) {
                res.push(key);
            }
        });
    });

    console.log("DEBUG:" + res);
    return res;
};

export const getAllLangs = () => {
    return Object.keys(langs) as langType[];
};

export const getAllLangData = () => {
    return langs;
};
