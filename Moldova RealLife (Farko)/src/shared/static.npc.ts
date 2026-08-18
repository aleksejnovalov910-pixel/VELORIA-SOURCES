import { langStringDefault } from "./lang/index";
import {QuestDialog} from "./quests";
import { HOSPITAL_TELEPORT_DIMENSION } from "./teleport.system";

export interface StaticNpcItem {
    x: number;
    y: number;
    z: number;
    h: number;
    d?: number;
    name: string;
    model: string;
    anim: string | [string, string];
    dialog?: QuestDialog;
    role?:string;
}


const autoschool: QuestDialog = [
  "Alege categoria pentru care doresti sa inveti:",
  {
    answers: [
      "Categoria B (Masina)",
      "Categoria A (Motocicleta)",
      "Categoria C (Camion)",
      "Categoria N (Barci)",
      "Categoria P (Aeriene)",
      "Reguli generale",
    ],
    onAnswer: (index) => {
      if (index === 0) {
        return [
          `Instructiuni pentru categoria B (Masina):\n\n• Trebuie sa opresti complet la semnul STOP.\n• Nu ai voie sa folosesti telefonul decat hands-free.\n• Pietonii au prioritate la treceri semnalizate.\n• Este interzis sa parchezi pe trecerea de pietoni.\n• Este obligatorie purtarea centurii de siguranta.\n• Nu se depaseste pe linie continua.\n• Alcoolemia legala este 0.0‰.\n• Semaforul galben intermitent indica prudenta si acordare de prioritate.`,
          { answers: ["Inapoi"], onAnswer: () => autoschool }
        ];
      }
      if (index === 1) {
        return [
          `Instructiuni pentru categoria A (Motocicleta):\n\n• Purtarea castii este obligatorie.\n• Este interzis transportul pasagerilor fara echipament.\n• Lumina farului trebuie folosita pe tot parcursul.\n• Atentie sporita la intersectii si viraje.\n• La accidente cu pagube materiale, raportati la politie in 24h.\n• Se semnalizeaza si se verifica oglinzile inainte de schimbarea benzii.\n• Pietonii au prioritate la treceri semnalizate.`,
          { answers: ["Inapoi"], onAnswer: () => autoschool }
        ];
      }
      if (index === 2) {
        return [
          `Instructiuni pentru categoria C (Camion):\n\n• Respectati limitele de viteza (ex: 60 km/h in oras).\n• Incarcaturile care depasesc trebuie semnalizate.\n• Evitati consumul de medicamente care provoaca somnolenta.\n• In caz de pana, reduceti viteza si trageti pe dreapta.\n• Oprirea totala include perceptie, reactie si franare.`,
          { answers: ["Inapoi"], onAnswer: () => autoschool }
        ];
      }
      if (index === 3) {
        return [
          `Instructiuni pentru categoria Barci:\n\n• Respectati semnalele si indicatoarele navale.\n• Prioritatea se acorda vaselor mai greoaie sau celor aflate in situatii speciale.\n• Oprirea si virajele trebuie facute cu atentie sporita.\n• Este interzisa navigarea sub influenta alcoolului.\n• Verificati echipamentele de salvare inainte de plecare.`,
          { answers: ["Inapoi"], onAnswer: () => autoschool }
        ];
      }
      if (index === 4) {
        return [
          `Instructiuni pentru categoria Aeriene:\n\n• Verificarea aparaturii de zbor este obligatorie inainte de decolare.\n• Purtarea castii si a centurii este necesara.\n• Comunicarea cu turnul de control trebuie mentinuta constant.\n• Viteza si altitudinea trebuie controlate corespunzator.\n• Zborul sub influenta substantelor este strict interzis.`,
          { answers: ["Inapoi"], onAnswer: () => autoschool }
        ];
      }
      if (index === 5) {
        return [
          `Reguli generale pentru toate categoriile:\n\n• Respectati indicatoarele rutiere si semnalele.\n• Nu folositi telefonul mobil in timpul conducerii.\n• Nu consumati alcool sau droguri inainte sau in timpul conducerii.\n• Respectati pietonii si ceilalti participanti la trafic.\n• Folositi centura de siguranta sau echipamentele obligatorii.\n• Respectati viteza legala.\n• Fiti mereu atenti si vigilenti.\n• Invatati si aplicati legislatia rutiera.`,
          { answers: ["Inapoi"], onAnswer: () => autoschool }
        ];
      }
    }
  }
];


// const autoschool: QuestDialog = [langStringDefault("static.npc.81631766f87ef56daf719e0a66dde51b"), {
//     answers: [langStringDefault("static.npc.5274369a33f49b42ff71c29f9ca41d6e"), langStringDefault("static.npc.b9b51ded5b193df92c8f3b8b3d07aad7"), langStringDefault("static.npc.5d27e51bd4dff00eab25aa878ad7cdf9"), langStringDefault("static.npc.299fcd16ee87a12daf03d4f5d7de71db"), langStringDefault("static.npc.e768951140581fd9d2c185ac04ccff58"), langStringDefault("static.npc.13f4d19bb7fcbd688c7b7ca35b82dfe3"), langStringDefault("static.npc.ca8c56efa64897b62ac603741d66567c")],
//     onAnswer: (index) => {

//         if (index === 0) {
//             return [langStringDefault("static.npc.a64f46dbd0bc52ce50d644b760afa562"),
//                 {
//                     answers: [langStringDefault("static.npc.1788e3418b121f9719c15f5bb0a24668")], onAnswer: () => autoschool

//                 }]
//         }
//         if (index === 1) {
//             return [langStringDefault("static.npc.4572fae929c458137dde62ac7bf29872"),
//                 {
//                     answers: [langStringDefault("static.npc.5d2f5cbc88223683eacd37f917e85550")], onAnswer: () => autoschool

//                 }]

//         }
//         if (index === 2) {
//             return [langStringDefault("static.npc.3ffcb83c0ed021746c5190d68de5b89d"),
//                 {
//                     answers: [langStringDefault("static.npc.32feddc7112700e285320db1e04b3ce3")], onAnswer: () => autoschool

//                 }]
//         }
//         if (index === 3) {
//             return [langStringDefault("static.npc.349cbb96640073eea597900a006c965f"),
//                 {
//                     answers: [langStringDefault("static.npc.56875c2df35ffdc82cef06761423ce1a")], onAnswer: () => autoschool

//                 }]
//         }
//         if (index === 4) {
//             return [langStringDefault("static.npc.a479e2c6172365f40d3c0f8aa592d992"),
//                 {
//                     answers: [langStringDefault("static.npc.ef5c1ab1527887560e13624b157581b8")], onAnswer: () => autoschool

//                 }]
//         }
//         if (index === 5) {
//             return [langStringDefault("static.npc.5bfbd387f1aa6151c43a66f6e639be2b"),
//                 {
//                     answers: [langStringDefault("static.npc.df4f910d333beb386520ea4ea4409317")], onAnswer: () => autoschool

//                 }]
//         }
//         if (index === 6) {
//             return [langStringDefault("static.npc.047f2c63d386778d11b8c6b3dab85e64"),
//                 {
//                     answers: [langStringDefault("static.npc.7c89539dd41f16a1ba452ccbeff975a7")], onAnswer: () => autoschool

//                 }]
//         }
//     }
// }];

const lcnmaff: QuestDialog = [langStringDefault("static.npc.da0adb793e991a4f19402c11d179d99d"), {
    answers: [langStringDefault("static.npc.39bd63fa90c3a41496cc689ecdff9b10"), langStringDefault("static.npc.11d4f16c5d8cca936d245338220febdb"), langStringDefault("static.npc.68ad4a052bfe24623ffdbd23377b3048"), langStringDefault("static.npc.5a67eeb0be624e759a0d8033a2880c08")],
    onAnswer: (index) => {

        if (index === 0) {
            return [langStringDefault("static.npc.357d16cbcc829139ed8f086f179f35ad"),
                {
                    answers: [langStringDefault("static.npc.07c37673e124412756be320bec559397")], onAnswer: () => lcnmaff
                }]
        }
        if (index === 1) {
            return [langStringDefault("static.npc.0068da1321bd21e1cffbaac97e076e7e"),
                {
                    answers: [langStringDefault("static.npc.b73b88fc0fb669fdfcec4ec9784c5872")], onAnswer: () => lcnmaff
                }]
        }
        if (index === 2) {
            return [langStringDefault("static.npc.b5c30641a2b5b04a59127c5edb4d75a1"),
                {
                    answers: [langStringDefault("static.npc.5d066020602597d96567ed66dfcb5498")], onAnswer: () => lcnmaff
                }]
        }
        if (index === 3) {
            return [langStringDefault("static.npc.8a1b97a5b5e8f7d7ec5fd83b9c55c5ab"),
                {
                    answers: [langStringDefault("static.npc.3b9dd94715bf20f6cbeaa80beb6c30ee")], onAnswer: () => lcnmaff
                }]

        }
    }
}];

const rmmaff: QuestDialog = [langStringDefault("static.npc.247d076c644810a3b99d2b9a0782e7cc"), {
    answers: [langStringDefault("static.npc.14fd27f7be729748aa7870d1c4fb802d"), langStringDefault("static.npc.86b75b5a418cd87e0a9afea86a9bf911"), langStringDefault("static.npc.7b894964ce7a5f9c6371e965fc075201"),],
    onAnswer: (index) => {

        if (index === 0) {
            return [langStringDefault("static.npc.b8170c47b2277102224a302592f13e37"),
                {
                    answers: [langStringDefault("static.npc.b386ef663c9b94c477d656b30baa65db")], onAnswer: () => rmmaff
                }]
        }
        if (index === 1) {
            return [langStringDefault("static.npc.e1485e0767f4db4c3939b2771d574b96"),
                {
                    answers: [langStringDefault("static.npc.b20b8a8395123b1d5b89b36d9701e247")], onAnswer: () => rmmaff
                }]
        }
        if (index === 2) {
            return [langStringDefault("static.npc.78dd12562765000a51562eb399a47dc9"),
                {
                    answers: [langStringDefault("static.npc.3d2fc0977ac9eb4d18f505511097f2aa")], onAnswer: () => rmmaff
                }]
        }
    }
}];

const carfamali: QuestDialog = [langStringDefault("static.npc.75513c99b10412e6f8ba44cdbeaaae1f"), {
    answers: [langStringDefault("static.npc.267c49a191112b3048251de47f815413"), langStringDefault("static.npc.d9a40929d60e96e334b08068fb616652")],
    onAnswer: (index) => {

        if (index === 0) {
            return [langStringDefault("static.npc.68762539d8dc428169019657d4265fb2"),
                {
                    answers: [langStringDefault("static.npc.dc0f8f5833f2c6ba074a77f674e87dfa")], onAnswer: () => carfamali
                }]
        }
        if (index === 1) {
            return [langStringDefault("static.npc.e3a19b5a24b6f3ce7b769f08756e2225"),
                {
                    answers: [langStringDefault("static.npc.c230d1d038259e7fcc5adf0a767c06e2")], onAnswer: () => carfamali
                }]
        }
    }
}];
const airportIntroDialog: QuestDialog = [
    "Bine ai venit in oras! cu ce te pot ajuta?",
    {
        answers: [
            "Unde pot merge prima data?",
            "Cum pot conduce o masina?",
            "Unde inchiriez un scooter?"
        ],
        onAnswer: (index) => {

            if (index === 0) {
                return [
                    "Mergi la Primarie pentru a-ti face buletinul – este necesar pentru majoritatea sistemelor din oras.",
                    {
                        answers: ["Inapoi"], onAnswer: () => airportIntroDialog
                    }
                ];
            }

            if (index === 1) {
                return [
                    "Dupa ce ti-ai facut buletinul la Primarie, iti recomandam sa mergi la Scoala de soferi. Acolo poti sustine examenul pentru permis si vei putea conduce legal vehicule in oras.",
                    {
                        answers: ["Inapoi"], onAnswer: () => airportIntroDialog
                    }
                ];
            }

            if (index === 2) {
                return [
                    "Poti inchiria un scooter la blipsul cu litera „R” de pe harta, chiar in stanga ta. Acolo vei gasi un punct de inchiriere unde poti lua un scooter pentru a te deplasa prin oras.",
                    {
                        answers: ["Inapoi"], onAnswer: () => airportIntroDialog
                    }
                ];
            }
        }
    }
];



export const STATIC_NPC_DATA: StaticNpcItem[] = [
    // bomj spawn
    { x: 666.79, y: -612.33, z: 18.35, h: 256, name: "", model: "a_m_o_acult_02", anim: ["amb@code_human_cower_stand@female@base", "base"] }, 
    { x: 666.98, y: -616.87, z: 18.33, h: 359, name: "", model: "a_m_m_afriamer_01", anim: ["amb@world_human_stand_guard@male@base", "base"] }, 
    { x: 671.68, y: -612.67, z: 18.72, h: 276, name: "", model: "a_m_o_beach_01", anim: ["", "base"] }, 
    { x: 673.47, y: -612.71, z: 18.85, h: 88, name: "", model: "u_m_m_bikehire_01", anim: ["", "base"] }, 
    { x: 685.41, y: -617.53, z: 19.65, h: 66, name: "", model: "a_c_cat_01", anim: ["", "base"] }, 
    { x: 684.74, y: -616.40, z: 19.62, h: 187, name: "", model: "a_m_m_indian_01", anim: ["", "base"] }, 
    { x: 692.42, y: -617.80, z: 20.12, h: 256, name: "", model: "a_m_m_eastsa_01", anim: ["", "base"] }, 
    { x: 695.50, y: -613.33, z: 20.54, h: 119, name: "", model: "a_c_chop", anim: ["", "base"] }, 
    { x: 700.95, y: -617.31, z: 18.84, h: 4, name: "", model: "a_c_husky", anim: ["", "base"] }, 
    // ghetto spawn
    { x: 20.14, y: -1300.51, z: 28.28, h: 205, name: "", model: "a_c_pug", anim: ["", "base"] },
    { x: 21.17, y: -1300.66, z: 29.19, h: 125, name: "", model: "ig_car3guy2", anim: ["", "base"] },
    { x: 8.21, y: -1300.84, z: 29.17, h: 85, name: "", model: "s_m_m_dockwork_01", anim: ["", "base"] },
    { x: 7.12, y: -1300.73, z: 29.18, h: 269, name: "", model: "s_m_y_dockwork_01", anim: ["", "base"] },
    { x: 21.01, y: -1312.66, z: 29.46, h: 15, name: "", model: "g_m_y_famfor_01", anim: ["", "base"] },
    { x: 22.04, y: -1311.54, z: 29.26, h: 145, name: "", model: "ig_g", anim: ["", "base"] },
    // police spawn
    { x: -1057.31, y: -868.33, z: 5.11, h: 38, name: "", model: "s_m_m_prisguard_01", anim: ["", "base"] },
    { x: -1068.41, y: -853.05, z: 4.87, h: 73, name: "", model: "s_f_y_cop_01", anim: ["", "base"] }, 
    { x: -1070.17, y: -853.82, z: 4.87, h: 330, name: "", model: "s_m_y_cop_01", anim: ["", "base"] },
    { x: -1070.16, y: -851.97, z: 4.87, h: 220, name: "", model: "csb_cop", anim: ["", "base"] },
    { x: -1068.14, y: -867.05, z: 4.87, h: 292, name: "", model: "s_m_y_hwaycop_01", anim: ["", "base"] },
    { x: -1067.71, y: -870.55, z: 4.92, h: 311, name: "", model: "s_m_y_ranger_01", anim: ["", "base"] },
    { x: -1047.52, y: -862.04, z: 4.92, h: 42, name: "", model: "s_f_y_ranger_01", anim: ["", "base"] }, 
    { x: -1067.31, y: -873.89, z: 4.36, h: 273, name: "", model: "a_c_husky", anim: ["", "base"] },
    // Аренды на начальных работах
    { x: -516.26, y: -1013.09, z: 23.45, h: 24, name: "", model: "cs_andreas", anim: ["", "base"] },
    { x: 2138.34, y: 4923.52, z: 41.04, h: 344, name: "", model: "cs_andreas", anim: ["", "base"] },
    { x: -1047.80, y: -874.36, z: 5.64, h: 168, name: "", model: "cs_andreas", anim: ["", "base"] },

    // Донат автосалон
    // { x: -796.91, y: -204.71, z: 37.25, h: 115, name: 'Наташа', model: "a_f_m_beach_01", anim: ["mini@strip_club@private_dance@part1", "priv_dance_p1"] },
    // { x: -799.12, y: -200.91, z: 37.25, h: 121, name: 'Таня', model: "s_f_y_stripper_01", anim: ["mini@strip_club@private_dance@part1", "priv_dance_p1"] },
    // Начальная работа сад
    { x: 2413.03, y: 4997.99, z: 46.63, h: 126, name: "", model: "u_m_y_mani", anim: ["", "base"] },
    // Стройка
    { x: -510.16, y: -1002.96, z: 23.55, h: 53, name: "", model: "s_m_m_gardener_01", anim: ["", "base"] },
    // Клининг служба
    {x: -1534.90, y: -453.81, z: 35.92, h: 317, name: "", model: "s_m_m_migrant_01", anim: ["", "base"]},
    // Гараж Тони
    {x: 1966.27, y: 5185.21, z: 47.88, h: 186, name: "", model: "ig_omega", anim: ["", "base"]},
    // EMS Быстрая выписка
    {x: 319.20, y: -574.70, z: 86.93, h: 295, name: langStringDefault("static.npc.2b84bab6c62e8de2f7223288a0b64888"), model: "s_f_y_scrubs_01", anim: ["", "base"]},
    {x: -251.92, y: 6335.87, z: 32.43, h: 172, name: langStringDefault("static.npc.5c28e7cd1df829589cd7228b3a8fb044"), model: "s_m_m_scientist_01", anim: ["", "base"]},
    // Автошкола теория
    //// job grupe
    { x: 484.49, y: -1094.08, z: 29.40, h: 178, name: "", model: "s_m_m_prisguard_01", anim: ["", "base"] },

    {
        x: -809.03,
        y: -1352.76,
        z: 5.15,
        h: 54,
        name: langStringDefault("static.npc.344555b269b7398aaf89dfeefa5b124a"),
        model: "u_m_m_bankman",
        anim: ["", "base"],
        dialog: autoschool
    },
    //Информации о заданиях у мафий
    {
        x: -1882.41, 
        y: 2050.37, 
        z: 140.99,
        h: 345,
        name: langStringDefault("static.npc.dbd1d42ce258f3679217b21949a81644"),
        model: "cs_carbuyer",
        anim: ["", "base"],
        dialog: lcnmaff

    },
    {
        x: -1346.94, 
        y: 53.83, 
        z: 55.25, 
        h: 84,
        name: langStringDefault("static.npc.243e8cc61132c7cdc287bd165bed4fcb"),
        model: "cs_carbuyer",
        anim: ["", "base"],
        dialog: rmmaff

    },
    // Информационный в карьере x: 2922.16, y: 2786.19, z: 40.42, h: 24
    {
        x: 2922.16, 
        y: 2786.19, 
        z: 40.42, 
        h: 24,
        name: langStringDefault("static.npc.cd27d35f194a07fa06770897239098b8"),
        model: "mp_m_weed_01",
        anim: ["", "base"],
        dialog: carfamali

    },
    {
        x: -1052.40, 
        y: -2745.02, 
        z: 21.36, 
        h: 162,
        name: "Informatie utila",
        model: "cs_bankman",
        anim: ["", "base"],
        dialog: airportIntroDialog

    },


    // Лицензии на транспорт
    // {x: -777.06, y: -1323.23, z: 5.15, h: 145, name: langStringDefault("static.npc.d0bfae02cb727ad57106f69ce2dd0ff6"), model: "s_f_y_shop_mid", anim: ["", "base"]},
    // {x: -1111.85, y: -2769.15, z: 21.36, h: 331, name: langStringDefault("static.npc.13bea5da0db5ecdf1c0c4ba6d1c8bf22"), model: "ig_stevehains", anim: ["", "base"]},
    {x: 1697.49, y: 3594.95, z: 35.62, h: 10, name: langStringDefault("static.npc.ee1475cb1e7e008e382fac14f5c0cfd4"), model: "u_m_o_taphillbilly", anim: ["", "base"]},
    // Лиц на оружие
    {x: 440.96, y: -974.44, z: 30.69, h: 209, name: langStringDefault("static.npc.e01c1f46e8ad29052c533f9ed0a75203"), model: "s_f_y_cop_01", anim: "WORLD_HUMAN_STAND_IMPATIENT_UPRIGHT"},
    // Лиц на ТС
    {x: -807.08, y: -1344.22, z: 5.15, h: 237, name: langStringDefault("static.npc.f89f441676ee0c48b70b548be9dbe07e"), model: "ig_bestmen", anim: ["", "base"]},
    // Лицензии правительство
    {x: -537.79, y: -195.99, z: 38.23, h: 120, name: langStringDefault("static.npc.9e1f3b2a117dcd8f54443b3cd91e74ae"), model: "s_m_y_barman_01", anim: ["", "base"]},
    // Лицензии ПД
    {x: 450.23, y: -973.09, z: 30.69, h: 172, name: langStringDefault("static.npc.62913efc71c98de6117448de855ab0a3"), model: "cs_debra", anim: ["", "base"]},
    // Лицензии болька город
    {x: 315.46, y: -588.17, z: 43.26, h: 106, name: langStringDefault("static.npc.367ee6214c88d123e9623442774f7d9e"), model: "s_m_m_doctor_01", anim: ["", "base"]},
    {x: 338.77, y: -593.97, z: 43.26, h: 337, name: langStringDefault("static.npc.367ee6214c88d123e9623442774f7d9e"), model: "s_m_m_doctor_01", anim: ["", "base"]},
    {x: 360.12, y: -585.44, z: 43.26, h: 70, name: langStringDefault("static.npc.367ee6214c88d123e9623442774f7d9e"), model: "s_m_m_doctor_01", anim: ["", "base"]},



    // ШД сенди
    {x: 1858.53, y: 3698.14, z: 34.27, h: 117, name: langStringDefault("static.npc.77144d3c21b7bffaea38331522ce5a5a"), model: "s_m_y_sheriff_01", anim: ["", "base"]},
    // ШД палето
    {x: -441.43, y: 6006.87, z: 31.72, h: 101, name: langStringDefault("static.npc.8790f46a11635abdc80113dc349d8130"), model: "s_f_y_sheriff_01", anim: ["", "base"]},
    // Лицензия старая болька 1
    {x: 230.78, y: -1366.30, z: 39.53, h: 272, name: langStringDefault("static.npc.d3cd4f7f2875d3ba794696ca492f5feb"), model: "a_f_y_femaleagent", anim: ["", "base"]},
     // Лицензия старая болька 1
     // {x: 259.63, y: -1359.69, z: 24.54, h: 318, name: 'Artem', model: "s_m_m_doctor_01", anim: ['', 'base']},
     // Центр регистрации брака в Сенди
     {x: -328.12, y: 2798.04, z: 60.18, h: 289, name: "", model: "cs_priest", anim: ["", "base"]},
     // Армия
     {x: -2353.79, y: 3264.34, z: 32.81, h: 234, name: "", model: "s_m_y_armymech_01", anim: ["", "base"]},
     // Casino
     {x: 1088.05, y: 221.42, z: -49.20, h: 180, name: langStringDefault("static.npc.52d1e4db5981f358fa3e52f9a7fbfa8c"), model: "a_f_y_femaleagent", anim: "WORLD_HUMAN_STAND_IMPATIENT_UPRIGHT", d: 1},
    // Больница, хирург
    {x: 300.02, y: -599.00, z: 43.26, h: 6, name: langStringDefault("static.npc.e60705d9392568a29d19fa4389c4e919"), model: "s_m_m_doctor_01", anim: "WORLD_HUMAN_CLIPBOARD_FACILITY"},
    // Удостоверение фиб
    {x: 2509.17, y: -444.64, z: 106.91, h: 323, name: langStringDefault("static.npc.d5e193cd97ff1528e17adfaea1e365b4"), model: "cs_barry", anim: "WORLD_HUMAN_CLIPBOARD_FACILITY"},
    // Центр регистрации брака в лос сантосе
    {x: -1669.04, y: -293.02, z: 52.62, h: 20, name: "", model: "cs_priest", anim: ["", "base"]},
    // Обследование ЕМС палето
    {x: -253.63, y: 6314.59, z: 32.43, h: 296, name: langStringDefault("static.npc.5fe277329754b7fb895cb1830bb432fb"), model: "s_m_m_doctor_01", anim: ["", "base"]},
    // Приемная больница в LS
    {x: 349.14, y: -587.48, z: 28.80, h: 247, name: langStringDefault("static.npc.a6c5f5cc7f31cec3a90a1537aca95a85"), model: "s_m_m_doctor_01", anim: ["", "base"]},
    // WZ
    {x: -586.46, y: -921.22, z: 23.87, h: 133, name: langStringDefault("static.npc.ef0468080ccf86a241047a2fd8eb9e90"), model: "cs_barry", anim: ["", "base"]},
    // Vito Andallini (Создание крайм семьи)
    {x: -799.55, y: 171.47, z: 72.30, h: 82, name: langStringDefault("static.npc.88511d257ba223525c7eabb365845626"), model: "cs_movpremmale", anim: "WORLD_HUMAN_SEAT_WALL"},
    // НПС на создании крайм семьи
    {x: -801.10, y: 169.04, z: 72.83, h: 13, name: "", model: "g_m_m_mexboss_01", anim: "WORLD_HUMAN_AA_SMOKE"},
    {x: -803.53, y: 178.50, z: 72.33, h: 173, name: "", model: "s_m_m_highsec_01", anim: "WORLD_HUMAN_SEAT_WALL"},
    {x: -800.18, y: 183.01, z: 72.61, h: 194, name: "", model: "s_f_m_maid_01", anim: ["amb@world_human_maid_clean@", "base"]},
    {x: -814.88, y: 177.71, z: 72.15, h: 20, name: "", model: "s_m_m_fiboffice_02", anim: ""},
    {x: -815.95, y: 180.50, z: 72.15, h: 201, name: "", model: "u_m_m_jewelsec_01", anim: ""},
    {x: -805.3, y: 178.75, z: 72.33, h: 198, name: "", model: "cs_martinmadrazo", anim: "WORLD_HUMAN_SEAT_WALL"},
    // Приемная больница в Sandy Shors
    {x: 1829.22, y: 3682.36, z: 34.27, h: 249, name: langStringDefault("static.npc.9c353ea960e3da3a70200b3f9ec716a7"), model: "s_m_m_doctor_01", anim: ["", "base"]},
    // Лицензия палето
    {x: 1830.10, y: 3673.16, z: 34.27, h: 294, name: langStringDefault("static.npc.784c1bb14e8b7bf7183ed08629b8b679"), model: "s_m_m_doctor_01", anim: ["", "base"]},
    //Лицензии палето
    {x: -250.25, y: 6311.43, z: 32.43, h: 3, name: langStringDefault("static.npc.c1deaf11209ce92fb5fb8d819acea692"), model: "s_m_m_doctor_01", anim: ["", "base"]},
    // License city hospital
    {x: 304.24, y: -571.24, z: 86.93, h: 250, name: langStringDefault("static.npc.61e8787bf330b769dda5ae38c80c2266"), model: "s_m_m_doctor_01", anim: ["", "base"]},

];
