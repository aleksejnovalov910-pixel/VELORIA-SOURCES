
//2 3 1 3 3 3 1 4 2 2 1 2 2 2
interface DrivingSchoolListItem {
  text: string;
  img: boolean | number;
  ans: string[];
  correct: number;
}

interface DrivingSchoolList {
  car: DrivingSchoolListItem[];
  moto: DrivingSchoolListItem[];
  truck: DrivingSchoolListItem[];
  boat: DrivingSchoolListItem[];
  air: DrivingSchoolListItem[];
}


export const list: DrivingSchoolList = {
  'car': [
    {
      text: "Ce semn opreste complet un vehicul la o intersectie?",
      img: false,
      ans: [
        "Semnul STOP",
        "Semnul Cedeaza Trecerea",
        "Semnul de Ocolire",
      ],
      correct: 1,
    },
    {
      text: "Ce culoare are semaforul cand trebuie sa opresti?",
      img: false,
      ans: [
        "Verde",
        "Rosu",
        "Galben",
      ],
      correct: 2,
    },
    {
      text: "Este legal sa conduci fara centura?",
      img: false,
      ans: [
        "Da",
        "Numai in oras",
        "Nu",
      ],
      correct: 3,
    },
    {
      text: "La trecerea de pietoni trebuie sa:",
      img: false,
      ans: [
        "Claxonezi",
        "Ocolesti pietonii",
        "Acordezi prioritate",
      ],
      correct: 3,
    },
    {
      text: "Cand semaforul este verde, poti trece?",
      img: false,
      ans: [
        "Da, dar cu atentie",
        "Nu, niciodata",
        "Doar daca vin masini din stanga",
      ],
      correct: 1,
    },
    {
      text: "Ce trebuie sa faci inainte sa schimbi banda?",
      img: false,
      ans: [
        "Te uiti in oglinda si semnalizezi",
        "Claxonezi",
        "Accelerezi",
      ],
      correct: 1,
    },
    {
      text: "Pe ce parte se depaseste in mod legal?",
      img: false,
      ans: [
        "Pe stanga",
        "Pe dreapta",
        "Pe trotuar",
      ],
      correct: 1,
    },
    {
      text: "Cand este permis sa folosesti telefonul la volan?",
      img: false,
      ans: [
        "Cand stai in coloana",
        "Niciodata fara hands-free",
        "Oricand",
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie sa incetinesti?",
      img: false,
      ans: [
        "La curbe, treceri de pietoni sau semne de avertizare",
        "Pe autostrada",
        "Cand esti singur in trafic",
      ],
      correct: 1,
    },
    {
      text: "Ce inseamna semnul triunghi cu rosu si varf in jos?",
      img: false,
      ans: [
        "Drum inchis",
        "Cedeaza trecerea",
        "Parcare interzisa",
      ],
      correct: 2,
    },
    {
      text: "Este permis sa stationezi pe trecerea de pietoni?",
      img: false,
      ans: [
        "Da, daca e noapte",
        "Nu",
        "Da, daca nu sunt pietoni",
      ],
      correct: 2,
    },
    {
      text: "Care este limita de viteza in localitate?",
      img: false,
      ans: [
        "50 km/h",
        "90 km/h",
        "120 km/h",
      ],
      correct: 1,
    },
    {
      text: "Cand folosesti luminile de intalnire?",
      img: false,
      ans: [
        "Pe timp de zi doar in afara localitatii",
        "Pe timp de noapte si in conditii meteo slabe",
        "Niciodata",
      ],
      correct: 2,
    },
    {
      text: "Ce faci cand politia are semnalele pornite in spate?",
      img: false,
      ans: [
        "Continui drumul",
        "Claxonezi",
        "Tragi pe dreapta si opresti",
      ],
      correct: 3,
    },
    {
      text: "Ce trebuie sa ai la tine cand conduci?",
      img: false,
      ans: [
        "Act de identitate, permis si asigurare",
        "Umbrela si sacou",
        "Cheile si o sticla de apa",
      ],
      correct: 1,
    },
    {
      text: "Cand este voie sa folosesti avariile?",
      img: false,
      ans: [
        "Cand stationezi neregulamentar",
        "Cand esti in pericol sau avertizezi altii",
        "Cand vrei sa opresti pentru pauza",
      ],
      correct: 2,
    },
  ],
  'moto': [
    {
      text: "Este obligatoriu sa porti casca atunci cand conduci o motocicleta?",
      img: false,
      ans: [
        "Doar in afara orasului.",
        "Da, tot timpul.",
        "Numai daca esti incepator."
      ],
      correct: 2,
    },
    {
      text: "In ce situatie NU ai voie sa circuli cu motocicleta?",
      img: false,
      ans: [
        "Cand ploua.",
        "Fara permis de conducere.",
        "Pe drum drept."
      ],
      correct: 2,
    },
    {
      text: "Care este pozitia corecta a mainilor pe ghidon?",
      img: false,
      ans: [
        "Cu o singura mana.",
        "Cu ambele maini.",
        "Nu conteaza."
      ],
      correct: 2,
    },
    {
      text: "Ce faci inainte sa schimbi directia?",
      img: false,
      ans: [
        "Semnalizezi si te asiguri.",
        "Claxonezi.",
        "Reduci viteza si accelerezi brusc."
      ],
      correct: 1,
    },
    {
      text: "Este voie sa transporti pasager pe motocicleta?",
      img: false,
      ans: [
        "Nu, niciodata.",
        "Da, daca motocicleta este echipata corespunzator.",
        "Numai daca pasagerul are permis."
      ],
      correct: 2,
    },
    {
      text: "Cum trebuie sa circuli intr-un viraj?",
      img: false,
      ans: [
        "Cu viteza constanta si control asupra motocicletei.",
        "Pe mijlocul drumului.",
        "Fara sa franezi deloc."
      ],
      correct: 1,
    },
    {
      text: "Cand trebuie sa folosesti luminile motocicletei?",
      img: false,
      ans: [
        "Numai noaptea.",
        "Tot timpul pe drum public.",
        "Doar cand ploua."
      ],
      correct: 2,
    },
    {
      text: "Este legal sa folosesti telefonul cand conduci o motocicleta?",
      img: false,
      ans: [
        "Doar daca ai casti audio.",
        "Nu, niciodata fara sistem hands-free.",
        "Da, daca mergi incet."
      ],
      correct: 2,
    },
    {
      text: "Inainte de plecare, ce trebuie verificat?",
      img: false,
      ans: [
        "Nivelul uleiului si franele.",
        "Culoarea motocicletei.",
        "Numarul de kilometri parcursi."
      ],
      correct: 1,
    },
    {
      text: "Cand ai voie sa depasesti pe linie continua cu motocicleta?",
      img: false,
      ans: [
        "Cand nu vine nimeni.",
        "Niciodata.",
        "Daca este liber si mergi repede."
      ],
      correct: 2,
    },
    {
      text: "Ce faci cand te apropii de o trecere de pietoni si vezi pietoni?",
      img: false,
      ans: [
        "Reduci viteza si claxonezi.",
        "Ocolesti pietonii.",
        "Opresti si acorzi prioritate."
      ],
      correct: 3,
    },
    {
      text: "Ce echipament este obligatoriu pentru motociclisti?",
      img: false,
      ans: [
        "Casca de protectie.",
        "Manusi de piele.",
        "Ochelari de soare."
      ],
      correct: 1,
    },
    {
      text: "Cum se franeaza corect cu o motocicleta?",
      img: false,
      ans: [
        "Brusc, doar cu frana fata.",
        "Progresiv, folosind ambele frane.",
        "Numai cu frana de picior."
      ],
      correct: 2,
    },
    {
      text: "Ce trebuie sa faci cand politia iti face semn sa opresti?",
      img: false,
      ans: [
        "Continui drumul.",
        "Te opresti imediat in siguranta.",
        "Ignori semnalul."
      ],
      correct: 2,
    },
    {
      text: "Este permis sa circuli intre doua benzi de masini oprite in coloana?",
      img: false,
      ans: [
        "Nu, este interzis.",
        "Da, daca esti grabit.",
        "Numai noaptea."
      ],
      correct: 1,
    },
    {
      text: "Ce trebuie sa faci daca pierzi controlul motocicletei intr-un viraj?",
      img: false,
      ans: [
        "Inchizi ochii si te lasi dus.",
        "Tii ghidonul ferm si reduci viteza controlat.",
        "Apesi acceleratia la maxim."
      ],
      correct: 2,
    }
  ],
  'truck': [
    {
      text: "Ce anume ar trebui sa faceti daca intampinati o defectiune a unei anvelope?",
      img: false,
      ans: [
        "Sa va continuati deplasarea.",
        "Sa reduceti viteza si sa trageti pe dreapta",
        "Sa nu atingeti pedala de frana."
      ],
      correct: 2,
    },
    {
      text: "Steaguri sau lumini sunt necesare pe incarcaturile care se extind",
      img: false,
      ans: [
        "Da",
        "Nu",
        "Nu conteaza"
      ],
      correct: 1,
    },
    {
      text: "Care dintre aceste valori reprezinta distanta totala de oprire?",
      img: false,
      ans: [
        "Distanta de reactie + distanta de franare",
        "Distanta de perceptie + distanta de reactie + distanta de franare",
        "Distanta de perceptie + distanta de reactie"
      ],
      correct: 2,
    },
    {
      text: "Pentru a va ajuta sa ramaneti vigilent si in siguranta in timpul conducerii, trebuie sa",
      img: false,
      ans: [
        "evitati medicamentele care cauzeaza somnolenta.",
        "beti un whisky pentru curaj.",
        "coborati geamurile pentru aer rece."
      ],
      correct: 1,
    },
    {
      text: "Care este limita de viteza admisa pe drumurile publice in interiorul orasului?",
      img: false,
      ans: [
        "30 km/h",
        "60 km/h",
        "120 km/h",
        "Toate cele de mai sus"
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie sa folosesti frana de motor la un camion greu?",
      img: false,
      ans: [
        "Cand mergi pe drum drept.",
        "La coborari lungi si abrupte.",
        "Doar in oras."
      ],
      correct: 2,
    },
    {
      text: "Cum transporti in siguranta o incarcatura grea?",
      img: false,
      ans: [
        "Fara a o fixa, daca drumul e liber.",
        "Folosind chingi si sisteme de fixare omologate.",
        "Lasand-o sa se sprijine pe peretii camionului."
      ],
      correct: 2,
    },
    {
      text: "In ce conditii poti depasi cu un camion?",
      img: false,
      ans: [
        "Daca esti pe drum cu prioritate.",
        "Daca ai vizibilitate si linie discontinua.",
        "Oricand, daca ceilalti sunt mai lenti."
      ],
      correct: 2,
    },
    {
      text: "Este permis sa folosesti telefonul in timp ce conduci un camion?",
      img: false,
      ans: [
        "Da, cu o singura mana.",
        "Numai daca folosesti sistem hands-free.",
        "Da, cand nu e trafic."
      ],
      correct: 2,
    },
    {
      text: "La ce distanta minima trebuie sa stationezi fata de o trecere de pietoni?",
      img: false,
      ans: [
        "10 metri",
        "1 metru",
        "5 metri"
      ],
      correct: 3,
    },
    {
      text: "Ce trebuie sa faci daca ramai fara frane pe o panta?",
      img: false,
      ans: [
        "Claxonezi si accelerezi.",
        "Tragi pe dreapta si folosesti frana de mana progresiv.",
        "Opresti brusc cu frana de picior."
      ],
      correct: 2,
    },
    {
      text: "Care este semnalul corect pentru a schimba banda cu camionul?",
      img: false,
      ans: [
        "Semnalizare si asigurare in oglinzi.",
        "Claxon si accelerare.",
        "Fara semnal, daca e liber."
      ],
      correct: 1,
    },
    {
      text: "Cand este interzisa stationarea cu camionul?",
      img: false,
      ans: [
        "Pe marginea drumului drept.",
        "La mai putin de 25 metri de o intersectie.",
        "In zonele industriale."
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie verificata incarcatura?",
      img: false,
      ans: [
        "Numai la inceputul cursei.",
        "La fiecare oprire sau pauza.",
        "Niciodata, daca e bine legata."
      ],
      correct: 2,
    },
    {
      text: "Cum se verifica corect presiunea in anvelope?",
      img: false,
      ans: [
        "Dupa ce ai parcurs 20 km.",
        "Cand anvelopele sunt reci.",
        "Dupa ce ai spalat masina."
      ],
      correct: 2,
    },
    {
      text: "De ce este important sa respecti masa maxima autorizata?",
      img: false,
      ans: [
        "Pentru a consuma mai putin combustibil.",
        "Pentru a preveni deteriorarea drumurilor si a franelor.",
        "Pentru a merge mai repede."
      ],
      correct: 2,
    }
  ],
  "boat": [
    {
      text: "Este obligatoriu sa porti vesta de salvare pe barca?",
      img: false,
      ans: [
        "Nu, doar pasagerii.",
        "Da, toti cei aflati la bord.",
        "Numai in larg."
      ],
      correct: 2,
    },
    {
      text: "Cine are prioritate pe apa?",
      img: false,
      ans: [
        "Ambarcatiunile rapide.",
        "Ambarcatiunile care vireaza la dreapta.",
        "Ambarcatiunile care nu pot manevra usor."
      ],
      correct: 3,
    },
    {
      text: "Ce culoare are lumina de pozitie de pe partea dreapta (tribord)?",
      img: false,
      ans: [
        "Rosu",
        "Verde",
        "Alb"
      ],
      correct: 2,
    },
    {
      text: "Este permis sa conduci barca sub influenta alcoolului?",
      img: false,
      ans: [
        "Da, daca mergi incet.",
        "Nu, este interzis.",
        "Doar pe timp de zi."
      ],
      correct: 2,
    },
    {
      text: "Ce faci daca motorul barcii se opreste brusc in larg?",
      img: false,
      ans: [
        "Sari in apa.",
        "Ancorezi barca si soliciti ajutor.",
        "Pornesti luminile si claxonezi."
      ],
      correct: 2,
    },
    {
      text: "Cum trebuie sa semnalizezi o urgenta pe apa?",
      img: false,
      ans: [
        "Fluturi o batista.",
        "Pornesti semnalul sonor si aprinzi luminile de semnalizare.",
        "Claxonezi de 3 ori."
      ],
      correct: 2,
    },
    {
      text: "Care este semnul pentru pericol pe apa?",
      img: false,
      ans: [
        "Bandiera rosie.",
        "Doi conuri cu varfurile opuse.",
        "O vesta galbena agatata."
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie folosita ancora?",
      img: false,
      ans: [
        "Cand vrei sa dormi pe barca.",
        "Cand te opresti si vrei sa ramai pe loc.",
        "Doar noaptea."
      ],
      correct: 2,
    },
    {
      text: "In ce situatie poti naviga fara permis?",
      img: false,
      ans: [
        "Pe orice barca sub 15 CP, in zone autorizate.",
        "Niciodata.",
        "Doar daca ai vesta pe tine."
      ],
      correct: 1,
    },
    {
      text: "Ce faci daca vezi o alta barca venind direct spre tine?",
      img: false,
      ans: [
        "Intorci rapid barca.",
        "Reduci viteza si virezi la dreapta.",
        "Te opresti complet."
      ],
      correct: 2,
    },
    {
      text: "Este permis sa transporti pasageri peste capacitatea barcii?",
      img: false,
      ans: [
        "Da, daca toti au vesta.",
        "Nu, este interzis.",
        "Numai in apropiere de mal."
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie sa ai la bord un stingator de incendii?",
      img: false,
      ans: [
        "Doar pe timp de noapte.",
        "Pe orice barca cu motor.",
        "Numai pe lacuri."
      ],
      correct: 2,
    },
    {
      text: "Cum te asiguri ca barca este pregatita de plecare?",
      img: false,
      ans: [
        "Verifici motorul, nivelul de combustibil si echipamentele de salvare.",
        "Pornesti motorul si pleci imediat.",
        "Verifici culoarea apei."
      ],
      correct: 1,
    },
    {
      text: "Ce inseamna semnalul sonor lung pe apa?",
      img: false,
      ans: [
        "Ocolire la stanga.",
        "Pericol.",
        "Atentie, schimbare de directie."
      ],
      correct: 2,
    },
    {
      text: "Poti lasa barca nesupravegheata ancorata in larg?",
      img: false,
      ans: [
        "Da, daca nu este vant.",
        "Nu, este periculos.",
        "Doar ziua."
      ],
      correct: 2,
    },
    {
      text: "Ce trebuie sa faci daca vremea se schimba brusc in rau?",
      img: false,
      ans: [
        "Pornesti luminile si reduci viteza.",
        "Continui drumul.",
        "Navighezi catre cel mai apropiat mal in siguranta."
      ],
      correct: 3,
    }
  ],
  "air": [
    {
      text: "Este permis sa zbori fara sa anunti turnul de control?",
      img: false,
      ans: [
        "Da, daca esti incepator.",
        "Nu, comunicarea este obligatorie.",
        "Doar daca e vreme buna."
      ],
      correct: 2,
    },
    {
      text: "Ce trebuie sa verifici inainte de zbor?",
      img: false,
      ans: [
        "Nivelul combustibilului, sistemele de control si vremea.",
        "Daca ai pasageri.",
        "Culoarea elicopterului."
      ],
      correct: 1,
    },
    {
      text: "Ce trebuie sa faci daca apare o defectiune in aer?",
      img: false,
      ans: [
        "Sari cu parasuta.",
        "Pastrezi calmul si incerci o aterizare de urgenta.",
        "Inchizi motorul."
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie aprinse luminile de navigatie?",
      img: false,
      ans: [
        "Numai la sol.",
        "Numai in zbor.",
        "Tot timpul in zbor si pe timpul noptii."
      ],
      correct: 3,
    },
    {
      text: "Ce faci daca vezi un alt elicopter apropiindu-se din fata?",
      img: false,
      ans: [
        "Il ignori.",
        "Cobori brusc.",
        "Te deplasezi la dreapta si mentii altitudinea."
      ],
      correct: 3,
    },
    {
      text: "Este permis sa zbori sub influenta alcoolului?",
      img: false,
      ans: [
        "Da, daca zbori singur.",
        "Nu, este interzis.",
        "Doar in afara orasului."
      ],
      correct: 2,
    },
    {
      text: "Ce culoare are lumina din partea stanga (babord) a unei aeronave?",
      img: false,
      ans: [
        "Verde",
        "Rosu",
        "Alb"
      ],
      correct: 2,
    },
    {
      text: "Cand poti ateriza pe o pista privata?",
      img: false,
      ans: [
        "Cand nu e nimeni in zona.",
        "Doar cu permisiune.",
        "Oricand."
      ],
      correct: 2,
    },
    {
      text: "Ce faci daca sistemul de comunicatie nu functioneaza?",
      img: false,
      ans: [
        "Continui zborul fara griji.",
        "Tentezi o aterizare in siguranta si semnalizezi manual.",
        "Te intorci imediat la baza."
      ],
      correct: 2,
    },
    {
      text: "Cand ai voie sa zbori sub 300 de metri altitudine?",
      img: false,
      ans: [
        "Niciodata.",
        "Numai in situatii de urgenta sau instructaj.",
        "Doar pe timp de noapte."
      ],
      correct: 2,
    },
    {
      text: "Ce trebuie sa faci inainte de decolare?",
      img: false,
      ans: [
        "Verifici pasagerii.",
        "Faci verificarile tehnice si contactezi turnul.",
        "Inchizi usile si pornesti motoarele."
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie sa folosesti castile cu microfon in zbor?",
      img: false,
      ans: [
        "Doar la decolare.",
        "Tot timpul in zbor pentru comunicare.",
        "Numai daca ai pasageri."
      ],
      correct: 2,
    },
    {
      text: "Ce faci daca o pasare loveste rotorul?",
      img: false,
      ans: [
        "Continui zborul normal.",
        "Tentezi o aterizare de urgenta.",
        "Te ridici mai sus."
      ],
      correct: 2,
    },
    {
      text: "Este permis sa transporti pasageri fara licenta valabila?",
      img: false,
      ans: [
        "Da, daca zbori jos.",
        "Nu, este interzis.",
        "Numai daca sunt prieteni."
      ],
      correct: 2,
    },
    {
      text: "Cand trebuie sa consulti prognoza meteo?",
      img: false,
      ans: [
        "Doar daca vezi nori.",
        "Intotdeauna inainte de zbor.",
        "Numai iarna."
      ],
      correct: 2,
    },
    {
      text: "Este permis sa zbori pe timp de noapte fara lumini?",
      img: false,
      ans: [
        "Da, daca vezi bine.",
        "Nu, este periculos si ilegal.",
        "Numai in zone fara obstacole."
      ],
      correct: 2,
    }
  ]
};
