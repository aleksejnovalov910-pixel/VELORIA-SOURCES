import { langStringDefault } from "./lang/index";
export const ALERTS_SETTINGS = {
    boxgame: langStringDefault("alertsSettings.649cad1437141cf38a2f5533c300f17b"),
    background: langStringDefault("alertsSettings.c5a6d29fbff4f807c179a8ed83e296ec"),
    startVoice: langStringDefault("alertsSettings.0d695f77f0b3d99ba5c0838e875f5f63"),
    hudHotkeys: langStringDefault("alertsSettings.0cebed3499d01b10f5d690bc60b825a3"),
    opacityChat: langStringDefault("alertsSettings.85aa73ed64c894ea02d52a3ca0032b78"),
    questLines: langStringDefault("alertsSettings.0ffe2570016eb7461b7f06bf2610db06"),
    enableIntro: langStringDefault("alertsSettings.df177d54f951f175746ff0d268e6498e"),
    enableChat: langStringDefault("alertsSettings.77a14aebdf177d0e9b9873ca7f72dea3"),
    hitMaker: langStringDefault("alertsSettings.aef48ac03a5f910a44267a0d0f1b4df8"),
    personalHitMarker: langStringDefault("alertsSettings.6666909bbb801ceb24a84bacdc12285d")
}

export type StorageAlertData = Partial<Record<keyof typeof ALERTS_SETTINGS, boolean>>