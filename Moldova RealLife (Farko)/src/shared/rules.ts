import { langStringDefault } from "./lang/index";
import { DEFAULT_VEHICLE_PLAYER_LIMIT } from "./economy";

export type rulesType = "ban" | "kick" | "mute" | "warn" | "jail";
export type rulesTimeType = "m" | "h" | "d";
export type ruleItem = [number, string, rulesType, rulesTimeType, number]
export const rules: string [] = [langStringDefault("rules.600ddafe8ca0201a14e62d5fd97456f9")
    
]


//! Настройки стартового диалога. Этот диалог покажется лишь однажды игроку после первого создания персонажа
/** Текст стартового диалога */
export const START_DIALOG = langStringDefault("rules.6477e4853c4bf62b325101c640512da7")
// export const START_DIALOG = `Bine ai venit pe Stage RP!

// Înainte de a începe aventura ta, asigură-te că ai citit și înțeles regulile serverului.
// Regulamentul complet poate fi citit aici:
// wiki.stage-rp.ro

// Accesează panoul jucătorului pentru gestionarea contului tău:
// panel.stage-rp.ro

// Mult succes și distracție plăcută pe Stage RP!`;

/** Сколько минут будет показыватся текст */
export const START_DIALOG_CLOSE_TIME = 10;
/** Текст на кнопке */
export const START_DIALOG_ACCEPT = langStringDefault("rules.a249a047c1f259757989a19cc913707a");


// export const helpInfo: [string, string][] = [
    
//     [langStringDefault("rules.83b1ac4da196633f8314fd6fc3b30a05"), langStringDefault("rules.7c76b96a99abdd01c70f4915412d2589")],
    
//     [langStringDefault("rules.8678987077bb1211f4bca2a11d933214"),langStringDefault("rules.3211a8c58c43135252890a6df98807e0")],
    
//     [langStringDefault("rules.63532f467301dcf87a4b07ca1b5b5857"), langStringDefault("rules.68464697fe58738f557bbac275bb0b6d")],

//     [langStringDefault("rules.e1f65e736a2d32a41307e60215a57c35"), langStringDefault("rules.b1261785fdc593fc66c0d3c7f735a609", DEFAULT_VEHICLE_PLAYER_LIMIT)],

//     [langStringDefault("rules.0192e1618273996650834739aebca409"), langStringDefault("rules.d7b785aff67bd330a9634b8e87b39f84")],

//     [langStringDefault("rules.c605e43a67f1fc2b5ad41f88f7b32119"),langStringDefault("rules.96c67dd4aec8c0edb3d3935e656962ac") ],
    
//     [langStringDefault("rules.e865f2f78d222289e47d6260b52b82f2"), langStringDefault("rules.0c80ab6a7b18d914be5f2eda542a0bd7")],

//     [langStringDefault("rules.cc7787af001808ea396e4ac491617738"), langStringDefault("rules.06ec900d8e891b9746842302a32add5e")],

//     [langStringDefault("rules.506ed0fc81a0101eadafb985cd7c660a"),langStringDefault("rules.636e43e55645f0dc444ffb829ed1c655")],


// ]

export const helpInfo: [string, string][] = [
  [
    "General",
    `
Actiuni disponibile pe server:
- daca joci timp de 5 ore, vei primi 3 de SC in contul tau. Actiunea este valabila in fiecare zi. Poti vedea actiunea apasand pe butonul M - Profil.
Serverul are urmatoarele evenimente de sistem, cum ar fi:
- Family Loads incep la: 14:30, 15:30, 17:30, 18:30, 19:30, 21:30
- Evenimentul „Battle Royale” 16:00 si 20:00
- Evenimentul „Take the Bag” 14:00, 18:00, 22:00
`
],
[
  "Shop",
  `Serverul nostru are un sistem de donatii cu un curs de schimb actual si servicii de donatii disponibile in sectiunea Shop.
   In meniul principal nu exista optiunea de a cumpara vehicule, dar in sectiunea "Shop" din serviciile de donatii poti selecta "In magazin". Astfel vei primi automat o locatie catre Autoshop-ul de donatii sau magazinul de haine de donatii, unde poti cumpara direct pe server folosind moneda de donatie SC.
   Masinile cumparate cu SC nu pot fi vandute altor jucatori. Le poti vinde inapoi si vei primi 100% din valoare in $ conform cursului de schimb SC->$, sau 25% din valoarea vehiculului inapoi in SC.`
],
  [
    "Licente",
    `Licentele pot fi obtinute la Scoala auto.
Costurile licentelor:
 - Vehicul 2000$
 - Moto 1000$
 - Barci 4000$
 - Tir 5000$
 - Avioane 15000$
Asigurarea de sanatate si certificatul de sanatate mintala pot fi obtinute de la angajatii SMURD:
 - Certificat de sanatate mintala 5000$
 - Asigurare medicala 15000$
Pentru a obtine un permis de arme, trebuie mai intai sa obtii un certificat de absolvire cu succes a partii teoretice a personalului Politia Los Santos, costul este de 10000$, apoi sa mergi la centrul de arme licentiate de la poligonul de tragere si sa treci partea practica, iar in caz de succes, sa platesti costul acesteia de 10000$.
Licentele pentru pescuit si avocat pot fi obtinute de la personalul primariei:
 - Licenta de vanzare peste 5000$
 - Licenta de pescuit 5000$
 - Licenta de avocat 35000$.`
  ],
  [
    "Transport",
    `Poti cumpara convenabil un vehicul si sa-l parchezi intr-un loc de parcare convenabil, contra cost.
Toate modelele de transport vor fi disponibile intr-un numar limitat.
Fiecare vehicul este potrivit pentru un anumit tip de combustibil. Fiecare jucator are un garaj cu mai mult de ${DEFAULT_VEHICLE_PLAYER_LIMIT} locuri, iar fiecare masina cumparata are chei, din care poti face o copie (stand in vehicul prin meniul de pe G) si le poti transmite altor jucatori.
L - Deschide/inchide vehicul
O - Porneste vehiculul
B - Pune centura de siguranta`
  ],
  [
    "Business",
    `Pentru a cumpara o afacere, trebuie sa mergi la Arcadius Center, sa selectezi afacerea dorita si sa intri in birou pentru a o cumpara.
In birou, poti vinde afacerea primariei sau unui jucator.
Unele afaceri pot fi imbunatatite prin reducerea pretului bunurilor achizitionate sau prin cresterea procentajului serviciilor oferite.
Poti verifica taxele neplatite si schimba banca care gestioneaza transferurile tale.
Pe tableta ta, vei gasi o lista cu toate tranzactiile din afacere, suma din sold si taxa totala. Direct in afacerea in sine, poti schimba preturile bunurilor si comanda produse.
Desigur, trebuie sa platesti un procent pentru livrare catre un camionist. Daca afacerea ramane fara bunuri, acestea vor fi vandute la pretul de achizitie fara adaosul proprietarului.`
  ],
  [
  "Famili",
  `Familiile pe server sunt grupuri de jucatori care pot colabora pentru a-si mari influenta si resursele.  
Pentru a crea o familie, trebuie sa mergi la primarie.  

Membrii unei familii pot:

- Invita alti jucatori in familie prin tableta.
- Finaliza taskuri speciale pentru a obtine recompense si a concura cu alte familii.
- Cumpara proprietati pentru familie, cum ar fi apartamente sau afaceri.
- Imbunatati familia prin diverse actiuni in tableta (ex: cresterea bonusurilor sau resurselor disponibile).
- Participa la jafuri: jafuri mari (banci, casino, army, magazine etc).
- Colabora cu ganguri sau mafii pentru a obtine avantaje in activitati ilegale.
- Participa la evenimente speciale dedicate familiilor.
- Participa la Cargo Battle Family: pentru a incepe, este nevoie de minim 2 familii cu un numar minim de membri fiecare. Castigatorii pot obtine iteme valoroase si bonusuri speciale pentru familie.
`
],

  [
    "Mafie",
    `Mafia pe serverul nostru sunt grupuri criminale cu o mare influenta si un mod neconventional de a atinge scopurile.
Sursa principala de venit a Mafiei este, de obicei, santajul! Pe serverul nostru, exista un sistem unic de razboi pentru afaceri - Bizwars.
Fiecare afacere individuala este o sursa unica de venit pentru Mafie. Prin controlul afacerii, acestia primesc un anumit procent din valoarea acesteia in grupul comun zilnic, cu cat valoarea afacerii este mai mare, cu atat mai multi bani provin din aceasta. Numarul de afaceri controlate este afisat pe tableta.
Indicare cu sageata asupra Bizwar trebuie sa fie pe afacerea insasi. Razboiul este razboi, dar optiunea de relatii comerciale nu este exclusa. Oricare mafiot care controleaza o afacere poate sa o tranzactioneze cu un alt grup sau sa o vanda acestuia.
- Mafie poate produce biofuel si vin, pe care il poate vinde la piata pentru profit suplimentar.

`
],
[
  "Gang",
  `Gangurile sunt grupari criminale care functioneaza ca sprijin pentru mafioti. Ele pot cumpara seminte de droguri de la Vadim si le pot planta pe insula Cayo Perico pentru a produce si vinde droguri.
   Membrii de gang pot participa la activitati ilegale, pot controla teritorii si pot colabora cu mafiile pentru a-si creste influenta.`

],
  [
  "Factiuni",
    `Politia Los Santos este responsabila cu mentinerea pacii in oras. Ofiterii raspund la diverse apeluri prin tableta, protejeaza cetatenii de infractiuni.
Politia Paleto mentin ordinea in Blaine County, avand acces la vehicule speciale, patrule si tablete.
Smurd. Medicii trateaza cetatenii si emit documente medicale.
Guvern. Elibereaza licente, ajuta noii jucatori, organizeaza evenimente si mitinguri.
Armata. Intervine in situatii critice, detine vehicule blindate si poligon propriu.
WeazelNews. Factiune media care publica stiri si anunturi de la cetateni.`
  ],
  [
    "Banci si Taxe",
    `Exista un sistem bancar si un sistem de taxe simplu.
Taxa se bazeaza pe valoarea proprietatii tale.`
  ],
  [
    "Telefon",
    `Pentru a folosi telefonul, activeaza cartela SIM.
Apasa sageata sus pentru telefon, jos pentru tableta.
Aplicatii: contacte, banca, GPS, istoric, mesaje.`
  ],
[
  "Jafuri",
  `Pe server exista mai multe tipuri de jafuri cu intervale orare fixe si conditii speciale:

- Jaf Pacific Bank: 19:00 - 20:00 (minim 7 politisti online, disponibil pentru ganguri, mafii si familii)
- Jaf Casino: 19:00 - 20:00 (minim 7 politisti online, disponibil pentru ganguri, mafii si familii)
- Jaf Fleeca Bank: 17:00 - 21:00 (minim 4 politisti online, disponibil pentru ganguri, mafii si familii)
- Jaf Army: 17:00 - 21:00 (minim 4 politisti online, disponibil pentru ganguri, mafii si familii)
- Jaf Magazin: se poate face oricand; daca a fost efectuat, se poate repeta dupa 2 ore (minim 3 politisti online, disponibil pentru ganguri, mafii si familii)
- Jaf Vehicule: poate fi facut de toti jucatorii, nu necesita apartenenta la gang, mafie sau familie (minim 2 politisti online)
- Jaf Case: poate fi facut o data in ora disponibil pentru ganguri, mafii
Respecta intervalele orare si numarul minim de politisti online pentru a putea incepe un jaf.`
]

];


