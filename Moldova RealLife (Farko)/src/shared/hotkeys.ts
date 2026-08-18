import { langStringDefault } from "./lang/index";
export const defaultHotkeys = {
    invopen: 9,
    mmenu: 77,
    cursor: 192,
    voice: 78,
    radio: 96,
    lockveh: 76,
    engineveh: 79,
    hidehud: 120,
    stopanim: 121,
    anim: 57,
    gpress: 71,
    seatbelt: 66,
    vreload: 118,


    flashlight: 74,

    radarEnable: 104,
    // radarFreeze: 101,


    invslot1: 49,
    invslot2: 50,
    invslot3: 51,
    invslot4: 52,
    invslot5: 53,
    
    phoneSlot: 38,
    tabletSlot: 40,

    ten0: 96,
    megaphone: 191,
    report: 117,

    toggleChat: 116,
    
    cuff: 54,
    uncuff: 55,
    follow: 90,
    
    admin: 56,
    autopilot: 100,
    // snowball: 113,
    petControl: 89,
    duckWalk: 20,
    mdt: 119,
    handsup: 88
}

/** [Название, Можно редактировать, Удержание] */
export const hotkeysTasks:{
    [task:string]:[string, boolean?, boolean?];
} = {
    invopen: [langStringDefault("hotkeys.4f7a7490955657cb3f8d3527cc8a971d")],
    mmenu: [langStringDefault("hotkeys.a7289d6e5f73695d676b4fc5052e86c3")],
    cursor: [langStringDefault("hotkeys.1dfb3f4c4aa197d2352a2a27ea872df7")],
    lockveh: [langStringDefault("hotkeys.4b4a4e60753fd10743cb95cbd95affc1")],
    engineveh: [langStringDefault("hotkeys.082db3fa057e77a0cda4ec82a6f021fc")],
    voice: [langStringDefault("hotkeys.f5052c8ec253339892f732dbdb9cea30"), false, true],
    radio: [langStringDefault("hotkeys.b9e5ba2fab5684ff82a906096b9e79f9"), false, true],
    hidehud: [langStringDefault("hotkeys.c0f7db0568f9b3b4755556ad626acc13")],
    stopanim: [langStringDefault("hotkeys.695f196b5f3a2eacb6ed2a897eaf85e0")],
    anim: [langStringDefault("hotkeys.cb92079fa2962b387fec95182dcfdd42")],
    gpress: [langStringDefault("hotkeys.0419d33a121cd7e3b510995c76865bec")],
    seatbelt: [langStringDefault("hotkeys.1bb7cc0f7ddc86d85adae682c96ad3d2")],
    vreload: [langStringDefault("hotkeys.47ca90c646fc9c64a0a9352a173381d9")],

    flashlight: [langStringDefault("hotkeys.943f5b7da92678e6efde7c168ae93ecc")],

    radarEnable: [langStringDefault("hotkeys.c12a4c24e9ea60dc36118ceb2519571c")],
    // radarFreeze: ["Заморозить Скоростной радар"],
    
    invslot1: [langStringDefault("hotkeys.a3d6324ac3b816d4cc5fec1f0c17b296")],
    invslot2: [langStringDefault("hotkeys.8370f002588451e6d1f900307d0812aa")],
    invslot3: [langStringDefault("hotkeys.91ef74f94f80afa462439d88a28e1d18")],
    invslot4: [langStringDefault("hotkeys.36e1a0206dd25e176a36bad89a8091d8")],
    invslot5: [langStringDefault("hotkeys.c8aef695a739c3371ad6d776db9c191d")],
    
    phoneSlot: [langStringDefault("hotkeys.9404e7e58f0cd00d0a2a5c2f2404ea98")],
    tabletSlot: [langStringDefault("hotkeys.8eab76a82eff1c62fd6390f9071207f7")],

    ten0: [langStringDefault("hotkeys.d4400719d94a2609872b2c0e3a9fc83f")],
    megaphone: [langStringDefault("hotkeys.a41fd4aae20893dc6dfa7fdffed8d19c")],
    report: [langStringDefault("hotkeys.bd0d9b3c3498de8117d7381c0239f56b")],
    
    toggleChat: [langStringDefault("hotkeys.a795e3d9c3d42152a60ffa73d5be10ea"), true],

    admin: [langStringDefault("hotkeys.343df2c273666831461a96d2210531d5"), true],
    
    cuff: [langStringDefault("hotkeys.58a8f75dd1b59df9a90fb885b09bc2cc")],
    uncuff: [langStringDefault("hotkeys.52742e11282eb81394baa959c7f7b22a")],
    follow: [langStringDefault("hotkeys.c805c554561cfc74db0acc6443248291")],
    autopilot: [langStringDefault("hotkeys.7a270439c5743ac9626a3af7b1afd21c")],
    // snowball: [langStringDefault("hotkeys.22aae68a0b706d4598a3ea2b88161276")],
    petControl: [langStringDefault("hotkeys.acf857691c663561c7bb78d145f2c54d")],
    duckWalk: [langStringDefault("hotkeys.dcbd56d9303c524ea212101ee2271d21")],
    mdt: ["MDT", true],
    handsup: ["Hands up", true]
}

interface IHotkeyCategory {
    name: string
    keys: string[]
}

export const hotkeyCategories: IHotkeyCategory[] = [
    {
        name: langStringDefault("hotkeys.604d657470cb42288c9ccf2c423c9be7"),
        keys: ["invopen", "invslot1", "invslot2", "invslot3", "invslot4", "invslot5"]
    },
    {
        name: langStringDefault("hotkeys.fbf0a8873b58012894b9a8681dd6fd3a"),
        keys: ["autopilot", "engineveh", "lockveh", "seatbelt"] /// "autopilot", 
    },
    {
        name: langStringDefault("hotkeys.5cf72f8809adbef0bfa6ca9afcb1409e"),
        keys: ["duckWalk", "gpress", "anim", "stopanim", "petControl", "cuff", "uncuff", "follow", "flashlight", "handsup"] /// , "snowball"
    },
    {
        name: langStringDefault("hotkeys.69aad441040efd811d36e5f431b63146"),
        keys: ["report", "phoneSlot", "tabletSlot", "vreload", "hidehud", "toggleChat", "radio", "voice", "cursor"]
    },
    {
        name: langStringDefault("hotkeys.ef4bc0a5a01d4be693ecee48aca8a32a"),
        keys: ["admin", "report" ]
    },
    {
        name: langStringDefault("hotkeys.8f3ed5edebc46eed507b571933682861"),
        keys: ["ten0", "megaphone", "radarEnable", "mdt" ]
    }

]

export const getHotkeysName = (task:string) => {
    const cfg = hotkeysTasks[task];
    if(!cfg) return;
    return cfg[0]
}

export const getHotkeysCanEdit = (task:string) => {
    const cfg = hotkeysTasks[task];
    if(!cfg) return;
    return !(!!cfg[1])
}

export const getHotkeysNeedHold = (task:string) => {
    const cfg = hotkeysTasks[task];
    if(!cfg) return;
    return (!!cfg[2])
}

export const generateHotkeysButtonsArray = () => {
    let data:[number,string][] = [];
    for (let key in hotkeysAllowed){
        data.push([key as any, (hotkeysAllowed as any)[key]])
    }
    return data;
}

export const getKeyName = (key:number):string => {
    return (hotkeysAllowed as any)[key];
}

export const hotkeysAllowed = {
    8: "BackSpace",
    9: "Tab",
    // 16: "Shift",
    // 17: "Ctrl",
    18: "Alt",
    20: "CapsLock",
    33: "PageUP",
    34: "PageDown",
    35: "End",
    36: "Home",
    45: "Insert",
    46: "Delete",
    145: "Scroll Lock",
    192: "~",
    191: "/",

    37: langStringDefault("hotkeys.eb106f6cd472f5b0add1aac74229f1ba"),
    38: langStringDefault("hotkeys.57d37b769188cf319ff0ee628570ee14"),
    39: langStringDefault("hotkeys.4410a8089988c13dd2a6fb4a19aae9b7"),
    40: langStringDefault("hotkeys.9b2d3dd1c18523468862d4a5d09d8f4a"),
    44: langStringDefault("hotkeys.3316fdefc146f6a5875049f533f86a34"),

    48: langStringDefault("hotkeys.bf032e1f89867197b8ae29ec6d85208b"),
    49: langStringDefault("hotkeys.80af0278d79069948c9617dd394475de"),
    50: langStringDefault("hotkeys.5b13a8e492546953e6dcba237853202a"),
    51: langStringDefault("hotkeys.0e0d0adddc98a7a74f56966495b1bdcc"),
    52: langStringDefault("hotkeys.96f40865f29713359e8a69097a36a5e0"),
    53: langStringDefault("hotkeys.0767e1d82fab864d3b99d7f5979e5d83"),
    54: langStringDefault("hotkeys.e77cf1cf53714bfce0785578e8b4304a"),
    55: langStringDefault("hotkeys.643d41b5ce6d921b761a596c95abcee2"),
    56: langStringDefault("hotkeys.6ce46ae86da0eaac64215063e7cec639"),
    57: langStringDefault("hotkeys.16dc3e544d8f109e0aa79b78e76c44d2"),

    66: "B",
    67: "C",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    84: "T",
    85: "U",
    88: "X",
    89: "Y",
    90: "Z",

    96: "NumPad 0",
    97: "NumPad 1",
    98: "NumPad 2",
    99: "NumPad 3",
    100: "NumPad 4",
    101: "NumPad 5",
    102: "NumPad 6",
    103: "NumPad 7",
    104: "NumPad 8",
    105: "NumPad 9",

    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
}