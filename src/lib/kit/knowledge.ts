import type { ModuleId, ScenarioId } from "./types";

export const SCENARIOS: {
  id: ScenarioId;
  name: string;
  flow: string;
  stayGo: string;
  first15: string[];
  key: string[];
  missed: string[];
  related: string[];
}[] = [
  {
    id: "flood",
    name: "Powódź / ewakuacja z domu",
    flow: "Ostrzeżenie → 2–12 h na wyjście → hala lub rodzina → powrót po kilku dniach.",
    stayGo: "Wychodzisz, gdy woda zbliża się do parteru, służby każą, albo jedyna droga zaraz stanie się rzeką. Nie czekaj na garaż.",
    first15: [
      "Dokumenty, leki, gotówka, telefon — do worka wodoodpornego.",
      "Zamknij gaz i prąd, jeśli masz czas i suchą podłogę.",
      "Zwierzęta do transportera. Nikt nie wraca «na chwilę po laptop».",
      "Idź w górę terenu, nie przez zalane przejścia podziemne.",
    ],
    key: [
      "Dokumenty w worku wodoodpornym",
      "Gotówka — bankomaty mogą nie działać",
      "Apteczka i leki osobiste",
      "Woda + tabletki (kran skażony po powrocie)",
      "Powerbank, mapa papierowa",
      "Śpiwór / koc — w hali bywa zimno",
    ],
    missed: [
      "Ksero i skany na pendrive",
      "Numer konta na kartce",
      "Lista telefonów na papierze",
      "Transporter i karma dla zwierząt",
    ],
    related: ["dokumenty", "woda", "powrot", "zwierzeta"],
  },
  {
    id: "fire",
    name: "Pożar budynku / okolicy",
    flow: "Alarm → ewakuacja w minuty → nie wracasz po rzeczy.",
    stayGo: "Wychodzisz natychmiast. Drzwi zamykasz, nie zamykasz na klucz jeśli ktoś jeszcze może być w środku. Nie windą.",
    first15: [
      "Sprawdź drzwi grzbietem dłoni. Gorące — inne wyjście albo okno od strony klatki.",
      "Nisko pod dymem. Mokry ręcznik na twarz, jeśli jest pod ręką.",
      "Zabierz tylko to, co stoi przy drzwiach: telefon, klucze, apteczkę.",
      "Zbiórka w umówionym miejscu, nie na klatce.",
    ],
    key: [
      "Apteczka: oparzenia, szkło, duszność",
      "Maseczki FFP2 / FFP3 — dym",
      "Czołówka — gęsty dym to ciemność",
      "Gwizdek dla ratowników",
      "Woda do picia i chłodzenia oparzeń",
      "Okulary ochronne",
    ],
    missed: [
      "Maseczki dla wszystkich domowników",
      "Mokry ręcznik do oddychania",
      "Numer ubezpieczyciela na kartce",
    ],
    related: ["czerwony", "dokumenty", "lacznosc"],
  },
  {
    id: "blackout",
    name: "Blackout",
    flow: "Prąd pada na 12 h – 3 dni. Brak światła, ogrzewania, wody z pomp, płatności.",
    stayGo: "Zostajesz w domu. Wyjście ma sens, gdy zimą temperatura spada poniżej bezpiecznej, kończą się leki albo służby każą.",
    first15: [
      "Czy to tylko Twoje mieszkanie, klatka, czy cała ulica — spójrz przez okno, włącz radio.",
      "Nie otwieraj lodówki. Każde otwarcie to stracone godziny chłodu.",
      "Napełnij wanny, garnki, bidony, jeśli woda jeszcze leci.",
      "Wyjmij latarkę, radio, powerbank. Nie świeć telefonem «na zapas».",
    ],
    key: [
      "Radio na baterie / korbkę",
      "Powerbank + kabel (+ panel)",
      "Latarki i zapas baterii",
      "Woda + tabletki — pompy stoją",
      "Jedzenie bez gotowania albo kuchenka + kartusz",
      "Gotówka — terminale nie działają",
    ],
    missed: [
      "Zapas baterii do radia",
      "Kuchenka w domu, nie tylko w plecaku",
      "Koc na okna zimą",
      "Plan chłodzenia insuliny",
    ],
    related: ["lacznosc", "woda", "czad", "jedzenie", "powrot"],
  },
  {
    id: "highway",
    name: "Korek na autostradzie (zima)",
    flow: "Stoisz 4–12 h. Silnik gaśnie, mróz, brak jedzenia.",
    stayGo: "Zostajesz w aucie. Piechotą w zamieć giną ludzie. Silnik odpalasz co godzinę na krótko, z wolnym wydechem od śniegu.",
    first15: [
      "Trójkąt, światła awaryjne. Nie wychodź na jezdnię bez kamizelki.",
      "Zostaw szczelinę w oknie. Rura wydechowa musi być wolna od śniegu.",
      "Jedna osoba czuwa. Reszta pod kocem, nie na gołym siedzeniu.",
      "Telefon oszczędzaj — jeden SMS do rodziny ważniejszy niż scroll.",
    ],
    key: [
      "Koc / śpiwór — grzanie bez silnika",
      "Czapka, rękawiczki, skarpety",
      "Termos, batony, czekolada",
      "Powerbank",
      "Łopata składana, linka, kable",
      "Mapa papierowa objazdów",
    ],
    missed: [
      "Termos z herbatą przed wyjazdem",
      "Łopata w aucie, nie w garażu",
      "Pełny bak przed zimową trasą",
    ],
    related: ["waga", "lacznosc", "jedzenie"],
  },
  {
    id: "work",
    name: "Ewakuacja z pracy / szkoły",
    flow: "Alarm → wyjście bez rzeczy → powrót pieszo lub komunikacją.",
    stayGo: "Wychodzisz ze wszystkimi. Do domu wracasz umówioną trasą, nie na skróty przez zamknięte tunele.",
    first15: [
      "Buty z szuflady, nie szpilki. Kurtka, jeśli wisi przy biurku.",
      "Telefon, dokumenty, gotówka z szuflady — nic więcej.",
      "Punkt zbiórki na zewnątrz. Dzieci — lista odbioru, nie «poczekaj w sali».",
      "SMS do domu: «wychodzę, idę X». Potem oszczędzaj baterię.",
    ],
    key: [
      "Woda 0,5 L i baton",
      "Powerbank + kabel",
      "Mini apteczka, czołówka",
      "Gotówka, dokumenty, telefon z ICE",
      "Wygodne buty",
    ],
    missed: [
      "Buty w biurze — szpilki na 8 km to dramat",
      "Numer rodziny na kartce",
    ],
    related: ["dzieci", "dokumenty", "lacznosc"],
  },
  {
    id: "heating",
    name: "Awaria ogrzewania zimą",
    flow: "Brak ciepła 12–48 h. Temperatura w domu spada do kilku stopni.",
    stayGo: "Zostajesz, jeśli macie śpiwory i jedną ogrzewaną izbę. Wyjście do rodziny, gdy w sypialni spada poniżej 10 °C albo ktoś jest chory.",
    first15: [
      "Jedna izba. Drzwi zamknięte, koc na oknie, ręcznik na progu.",
      "Warstwy ubrań, czapka do snu. Nie ogrzewaj kuchenką ani grillem.",
      "Gorąca woda w butelkach / termosach, jeśli gaz jeszcze działa.",
      "Czujnik czadu musi być na baterie — sieciowy w blackoucie milczy.",
    ],
    key: [
      "Śpiwory i koce dla wszystkich",
      "Kuchenka gazowa tylko do gotowania",
      "Termosy z gorącą wodą",
      "Czapki i rękawiczki domowe",
      "Koc na okna i drzwi",
      "Czujnik czadu — absolutnie",
    ],
    missed: [
      "Nigdy nie ogrzewaj pokoju kuchenką — tlenek węgla",
      "Plan noclegu u rodziny, jeśli dłużej",
    ],
    related: ["czad", "dzieci", "blackout"],
  },
  {
    id: "storm",
    name: "Wichura / burza",
    flow: "Ostrzeżenie → kilka godzin → dach, drzewa na drogach, brak prądu.",
    stayGo: "Zostajesz z dala od okien. Auto pod drzewem to zły pomysł. Po burzy nie ruszaj leżących przewodów.",
    first15: [
      "Odsuń łóżka od okien. Zabawki z balkonu, donice, gril.",
      "Naładuj powerbanki, napełnij wodę, zanim padnie prąd.",
      "Radio i latarka na stół, nie w szufladzie.",
      "Nie parkuj pod lipą. Nie wychodź «sprawdzić dach» w porywie.",
    ],
    key: [
      "Radio, powerbank",
      "Apteczka — szkło, odłamki",
      "Woda + tabletki",
      "Multitool",
      "Worki na śmieci",
      "Mapa papierowa",
    ],
    missed: ["FFP2 przy pyłach po zniszczeniach"],
    related: ["lacznosc", "woda", "czerwony"],
  },
];

export const DONT_PACK = [
  {
    title: "Ciężkie i zbędne",
    rows: [
      ["6 L wody w plecaku", "6 kg, nie do noszenia", "2 L + tabletki / filtr"],
      ["Słoje szklane", "Tłuką się, ciężkie", "Puszki / liofilizaty"],
      ["Pełny szampon 250 ml", "Za dużo na 72 h", "Kostka mydła"],
      ["Zestaw 10 narzędzi", "Waga i duplikaty", "Multitool"],
      ["Śpiwór zimowy latem", "Kilogram zbędnie", "Koc NRC + polar"],
    ],
  },
  {
    title: "Niepraktyczne w 72 h",
    rows: [
      ["Namiot ekspedycyjny 4-os.", "Ciężki, ewakuacja krótka", "Tarp albo hala"],
      ["Łóżko polowe", "Karimata wystarczy", "Karimata cienka"],
      ["Książka survival 500 s.", "W stresie nie czytasz", "Laminowana kartka"],
      ["Generator prądu", "Ciężar, hałas, paliwo", "Powerbank + radio"],
    ],
  },
  {
    title: "Fałszywe poczucie bezpieczeństwa",
    rows: [
      ["Broń i amunicja", "W PL nielegalne bez pozwolenia", "Unikaj eskalacji"],
      ["Hełm i tarcza taktyczna", "Niepotrzebne w ewakuacji", "Czołówka i gwizdek"],
      ["Maska gazowa wojskowa", "Przeterminowane filtry, ciężka", "FFP3 na dym i pył"],
      ["Noże bojowe, kamizelki", "Przyciągają uwagę, ważą", "Multitool, zwykły plecak"],
    ],
  },
  {
    title: "Niebezpieczne",
    rows: [
      ["Kuchenka do ogrzewania pokoju", "Tlenek węgla — śmiertelne", "Koce, termos, czujnik czadu"],
      ["Leki bez ulotek i dat", "Trucizna po terminie", "Przegląd co 6 miesięcy"],
      ["Zużyte baterie z nowymi", "Wyciek, zepsuty sprzęt", "Jedna puszka, oznaczona"],
      ["Uszkodzony powerbank", "Pożar li-ion", "Sprawny, w obudowie"],
    ],
  },
];

export const PACK_LAYERS = [
  {
    id: "bottom" as const,
    name: "Dół",
    why: "Ciężkie, rzadko używane",
    items: "Woda, racje, kuchenka, śpiwór",
  },
  {
    id: "mid" as const,
    name: "Środek, blisko pleców",
    why: "Ciężkie, ale potrzebne",
    items: "Powerbank, radio, zapasowa woda",
  },
  {
    id: "top" as const,
    name: "Góra",
    why: "Często i szybko",
    items: "Apteczka, poncho, dokumenty",
  },
  {
    id: "pocket" as const,
    name: "Kieszenie",
    why: "Bez zdejmowania plecaka",
    items: "1 L wody, baton, gwizdek, mapa, czołówka",
  },
];

export const INTRO_PARAS = [
  "Plecak kryzysowy to zestaw na pierwsze 72 godziny — czas, w którym służby zwykle dopiero się zbierają. Nie jest to ekwipunek na koniec świata. Jest na powódź, pożar, blackout, korek zimą i nagłe wyjście z domu.",
  "W tych trzech dobach musisz pić, jeść, utrzymać ciepło, opatrzyć rany, nie złapać zarazy z braku higieny i mieć jak się odezwać. Reszta jest balastem.",
  "Cztery kolorowe worki — czerwony, szary, niebieski, czarny — po to, żeby w ciemności i stresie nie szukać. Ta aplikacja liczy wagę, pilnuje dat i układa listę pod Twój dom, nie pod sklep survivalowy.",
];

export const GRAB_STEPS = [
  {
    id: "docs",
    title: "Dokumenty i gotówka",
    body: "Worek wodoodporny: dowód, polisa, ksero, numery ICE, drobne i średnie nominały.",
  },
  {
    id: "phone",
    title: "Telefon, powerbank, kable",
    body: "Telefon z ICE. Powerbank naładowany. Kabel, który pasuje. Radio, jeśli stoi obok.",
  },
  {
    id: "meds",
    title: "Leki osobiste",
    body: "To, bez czego nie wytrzymasz 3 dni. Ulotka. EpiPen albo insulina, jeśli dotyczy.",
  },
  {
    id: "kit",
    title: "Czerwony worek — apteczka",
    body: "Cały moduł pierwszej pomocy. Ma być na wierzchu, nie pod śpiworem.",
  },
  {
    id: "water",
    title: "Woda do ręki",
    body: "Przynajmniej litr w kieszeni bocznej. Reszta w plecaku.",
  },
  {
    id: "people",
    title: "Domownicy i zwierzęta",
    body: "Dzieci, seniorzy, transporter, smycz. Nikt nie wraca «na chwilę».",
  },
  {
    id: "wear",
    title: "Kurtka, buty, klucze",
    body: "Wygodne buty. Kurtka. Klucze do domu i auta. Latarka czołowa na głowie.",
  },
  {
    id: "bag",
    title: "Plecak i wyjście",
    body: "Zamknij gaz i wodę, jeśli masz 30 sekund. Nie szukaj pamiątek. Idź.",
  },
];

export const HELPLINES = [
  { num: "112", name: "Alarmowy", when: "Życie, pożar, wypadek, zaginięcie" },
  { num: "999", name: "Pogotowie", when: "Nagłe zachorowanie, uraz" },
  { num: "998", name: "Straż pożarna", when: "Pożar, powódź, chemia, drzewo na dachu" },
  { num: "997", name: "Policja", when: "Zagrożenie, kradzież, porządek" },
  { num: "991", name: "Energetyka", when: "Brak prądu, zerwany przewód" },
  { num: "992", name: "Gaz", when: "Zapach gazu, uszkodzona instalacja" },
  { num: "994", name: "Wodociągi", when: "Brak wody, pęknięta rura" },
  { num: "986", name: "Straż miejska", when: "Lokalne, nie nagłe" },
] as const;

export const FACTS = [
  { k: "2 L", v: "wody w plecaku, reszta z tabletek" },
  { k: "2000", v: "kcal na osobę na dobę — minimum" },
  { k: "6 mies.", v: "przegląd leków, racji i baterii" },
  { k: "112", v: "działa bez karty SIM i bez zasięgu operatora" },
] as const;

export const FAQ = [
  {
    q: "Ile wody naprawdę nosić?",
    a: "W plecaku 2 litry na osobę plus tabletki albo filtr. Trzy litry na dobę to norma picia i higieny w upale, ale 9 litrów na trzy doby nie uniesiesz ze schodów. W domu trzymaj kanistry osobno.",
  },
  {
    q: "Czy kuchenka ogrzeje pokój?",
    a: "Nie. Kuchenka turystyczna i grill produkują tlenek węgla. W zamkniętym mieszkaniu to śmierć we śnie. Ciepło: koce, jedna izba, termos, wyjście do rodziny. Czujnik czadu na baterie.",
  },
  {
    q: "Co z lodówką po blackoucie?",
    a: "Zamknięta lodówka trzyma ~4 h, zamrażarka pełna ~48 h, pusta ~24 h. Nie otwieraj «sprawdzić». Po odmrożeniu mięso i nabiał wyrzuć. Słoje i suche racje zostają.",
  },
  {
    q: "Czy Alert RCB zastępuje radio?",
    a: "Nie. SMS-y RCB potrzebują sieci. Radio FM / DAB na baterie albo korbkę działa, gdy padną BTS-y. Miej oba. Numerów ICE nie trzymaj tylko w telefonie.",
  },
  {
    q: "Jak często przeglądać plecak?",
    a: "Co 6 miesięcy minimum. Zimą i latem zmień warstwę ubrań. Po każdym użyciu osusz, uzupełnij, zważ. Daty leków i racji — w tej aplikacji, na tym urządzeniu.",
  },
  {
    q: "Dziecko w szkole, ja w pracy. Co wtedy?",
    a: "Umów punkt zbiórki i osobę, która odbiera. Kartka z numerami w piórniku. Dziecko nie czeka w pustej sali. W tej aplikacji wpisz ICE i punkt zbiórki — wydrukuj raz.",
  },
  {
    q: "Insulina, EpiPen, leki na receptę?",
    a: "To jedyne rzeczy, bez których zestaw nie istnieje. Chłodzenie insuliny: termos, wkład chłodzący, cień. EpiPen — data, trening. W profilu zaznacz, checklista dociąga resztę.",
  },
  {
    q: "Czy ten zestaw jest na wojnę albo apokalipsę?",
    a: "Nie. Jest na 72 godziny powodzi, pożaru, blackoutu i nagłego wyjścia. Dłuższe scenariusze to już zapasy w domu, nie plecak. Ciężki «survival» na plecach utrudnia ucieczkę.",
  },
] as const;

export const MODULE_GUIDES: Record<
  Exclude<ModuleId, "inne">,
  { why: string; doList: string[]; dont: string[]; tip: string }
> = {
  czerwony: {
    why: "W 72 h rany, oparzenia, alergie i leki osobiste nie czekają na SOR. Apteczka ma być na wierzchu.",
    doList: [
      "Leki na receptę w oryginalnych opakowaniach, z ulotką i datą.",
      "Rękawiczki, gaza, bandaż elastyczny, plaster, chusta, koc NRC.",
      "Środki na oparzenia i biegunkę — po powodzi to standard.",
      "EpiPen / insulina, jeśli ktoś w domu tego potrzebuje. Bez «później dokupię».",
    ],
    dont: [
      "Nie ładuj 40 rodzajów tabletek «na wszelki wypadek».",
      "Nie chowaj apteczki pod śpiworem — pierwsze 60 sekund decyduje.",
    ],
    tip: "Raz na pół roku wyrzuć wszystko po dacie. Plastry wysychają, gaza żółknie, leki kłamią.",
  },
  szary: {
    why: "Po katastrofie zabija zakażenie i odwodnienie z biegunki, nie sam wstrząs. Higiena waży mało, ratuje dużo.",
    doList: [
      "Kostka mydła, żel na ręce, chusteczki, papier, worki na odchody.",
      "Podpaski / tampon / wkładki — bez «jakoś to będzie».",
      "Worki na śmieci i na brudne rzeczy. Oddziel suche od mokrego.",
      "Krem na otarcia. Mokre skarpety zdzierają stopy w jedną dobę.",
    ],
    dont: [
      "Nie pakuj pełnych butelek szamponu i żelu pod prysznic.",
      "Nie licz na toaletę w hali. Worki i żel są planem A.",
    ],
    tip: "Jedna kostka mydła myje ludzi, naczynia i rany lepiej niż trzy specjalistyczne płyny.",
  },
  niebieski: {
    why: "Bez wody reszta zestawu to rekwizyt. Pijesz, gotujesz tabletki, płuczesz rany. Kalorie są na drugim miejscu.",
    doList: [
      "2 L w plecaku, kanister w domu. Tabletki albo filtr, nie trzecia butelka.",
      "Racje, które jesz na sucho: batony, puszki z wieczkiem, liofilizat.",
      "Kuchenka i kartusz tylko jeśli uniesiesz. Zapałki w worku, nie luzem.",
      "Łyżka, otwieracz, kociołek. Kubek metalowy grzeje herbatę i zupę.",
    ],
    dont: [
      "Nie noś 6 litrów. Kręgosłup nie jest magazynem.",
      "Nie pakuj słoików. Szkło i 72 h nie idą w parze.",
    ],
    tip: "Po powodzi kran kłamie. Gotuj albo tabletka, nawet gdy «woda wróciła».",
  },
  czarny: {
    why: "Ciepło, światło, głos, papiery, narzędzie. To, co trzyma Cię przy rodzinie i przy służbach.",
    doList: [
      "Czołówka + zapas. Radio na baterie albo korbkę.",
      "Powerbank naładowany, kabel który pasuje, nie «uniwersalny prawie».",
      "Dokumenty w worku, gotówka, mapa papierowa, ołówek.",
      "Multitool, taśma, worki, gwizdek, koc / poncho.",
    ],
    dont: [
      "Nie pakuj generatora, siekiery i trzech noży.",
      "Nie trzymaj skanów tylko w chmurze — w blackoucie jej nie ma.",
    ],
    tip: "Powerbank bez kabla jest cegłą. Sprawdź wtyk przy przeglądzie, nie przy alarmie.",
  },
};

export type KnowledgeArticle = {
  slug: string;
  title: string;
  kicker: string;
  minutes: number;
  related: string[];
  sections: { heading?: string; paras: string[] }[];
};

export const ARTICLES: KnowledgeArticle[] = [
  {
    slug: "filozofia",
    title: "Cztery worki, jeden plecak",
    kicker: "Podstawy",
    minutes: 4,
    related: ["waga", "woda", "czerwony"],
    sections: [
      {
        paras: [
          "Podział na kolory nie jest ozdobą. W stresie tracisz drobne motorykę i pamięć. Sięgasz do czerwonego po krew, do niebieskiego po wodę. Przy latarce czołowej kolor worka jest szybszy niż etykieta.",
        ],
      },
      {
        heading: "Co jest w kolorach",
        paras: [
          "Czerwony: pierwsza pomoc. Szary: higiena — po katastrofie zabija zakażenie, nie sam wstrząs. Niebieski: woda i kalorie. Czarny: ciepło, światło, narzędzie, głos, papiery.",
          "Czwarty worek «inne» to sam nośnik, worki i skany. Nie mieszaj w nim bandaży z zupą.",
        ],
      },
      {
        heading: "Czego ten plecak nie jest",
        paras: [
          "Nie pakuj «wszystkiego, co może się przydać». Pakuj to, czego użyjesz w 72 godziny i uniesiesz po schodach z dzieckiem na ręku.",
          "To nie zestaw na wojnę, bunkier ani miesiąc w lesie. Służby w Polsce zwykle ruszają w tych trzech dobach. Twoja robota: dotrwać, nie zginąć z zimna, pragnienia albo zakażenia, i dać się znaleźć.",
        ],
      },
    ],
  },
  {
    slug: "waga",
    title: "Każdy gram niesiesz Ty",
    kicker: "Pakowanie",
    minutes: 4,
    related: ["woda", "filozofia"],
    sections: [
      {
        paras: [
          "Powyżej 10–12 kg na jedną osobę dorosłą plecak przestaje być pomocą przy ewakuacji po schodach. Dziecko na ręku odejmij od budżetu. Woda to zwykle 40% wagi — dlatego nosisz 2 l i tabletki, nie sześć butelek.",
        ],
      },
      {
        heading: "Warstwy",
        paras: [
          "Dół: woda, racje, kuchenka, śpiwór. Środek przy plecach: powerbank i radio. Góra: apteczka, poncho, dokumenty. Kieszenie: litr, baton, gwizdek, mapa, czołówka.",
          "Ciężar blisko pleców, nie na zewnątrz. Luźne taśmy uderzają w biodra i kradną siły.",
        ],
      },
      {
        heading: "Test",
        paras: [
          "Trzy godziny spaceru z pełnym zestawem. Jeśli po godzinie chcesz go rzucić — jest za ciężki albo źle ułożony. Poprawka: mniej wody w plecaku, więcej tabletek, cieńsza karimata.",
        ],
      },
    ],
  },
  {
    slug: "przeglad",
    title: "Co sześć miesięcy, albo nigdy",
    kicker: "Rotacja",
    minutes: 3,
    related: ["jedzenie", "woda", "czerwony"],
    sections: [
      {
        paras: [
          "Leki, racje, woda butelkowana, baterie, tabletki do uzdatniania, chusteczki i plastry mają datę. Bez przeglądu cały zestaw jest teatrem. Rodzina ufa, a Ty nosisz puste opakowania.",
        ],
      },
      {
        heading: "Rytm",
        paras: [
          "Wiosna i jesień: jedz najstarsze racje, dokładaj nowe. Zimą dociągnij czapki i koc. Latem wyjmij puch, sprawdź filtr.",
          "Po każdym użyciu — nawet «na próbę» — osusz, uzupełnij, zważ. Mokry śpiwór w worku to pleśń na drugi weekend.",
        ],
      },
      {
        heading: "Gdzie są daty",
        paras: [
          "Ta aplikacja trzyma daty u Ciebie na urządzeniu. Nic nie idzie w chmurę — w blackoucie i tak nie będzie serwera. Kopia JSON na pendrive w worku z dokumentami.",
        ],
      },
    ],
  },
  {
    slug: "woda",
    title: "Pić, nie dźwigać cysterny",
    kicker: "Woda",
    minutes: 5,
    related: ["jedzenie", "waga", "powrot", "niebieski"],
    sections: [
      {
        paras: [
          "Dorosły pije 2–3 litry na dobę. W upale i przy biegunce więcej. Higiena i gotowanie dokładają resztę. W domu to kanister. W plecaku to dwa litry i sposób, by zrobić kolejne.",
        ],
      },
      {
        heading: "Co działa",
        paras: [
          "Tabletki chlorowe albo dwutlenek chloru: lekki, pewny, brzydki smak. Filtr mechaniczny: szybszy, nie zabija wirusów sam z siebie — czytaj kartę. Gotowanie: minuta po zagotowaniu na nizinach.",
          "Po powodzi i awarii rur kran jest podejrzany nawet gdy «woda wróciła». Ścieki wchodzą do sieci. Tabletka albo czajnik, nie wiara.",
        ],
      },
      {
        heading: "Czego nie robić",
        paras: [
          "Nie pij z kałuży, fontanny i gorącego bojlera bez uzdatnienia. Nie noś sześciu petów — 6 kg to całe dziecko.",
          "Wodę butelkowaną wymieniaj według daty. Przeterminowana nie jest trucizną z dnia na dzień, ale butelka pęka i smakuje plastikiem.",
        ],
      },
    ],
  },
  {
    slug: "jedzenie",
    title: "Kalorie, które otworzysz w ciemności",
    kicker: "Wyżywienie",
    minutes: 4,
    related: ["woda", "przeglad", "niebieski"],
    sections: [
      {
        paras: [
          "Na 72 h nie gotujesz restauracji. Dorosły: min. 2000 kcal/dobę. Dziecko: lżejsze racje, musy, batony, ok. 1500 kcal. Niemowlę: mleko, które pije na co dzień, i woda do rozrobienia — nie liofilizat z menażki. Pies: własna karma i woda; czekolada i ksylitol są trujące. Liczy się to, co otworzysz jedną ręką, bez prądu.",
        ],
      },
      {
        heading: "Co pakować",
        paras: [
          "Puszki z wieczkiem, batony, orzechy, liofilizat, kasza błyskawiczna, czekolada. Łyżka i otwieracz. Kuchenka jest bonusem, nie warunkiem.",
          "Jedz to, co i tak jesz. Egzotyczny gulasz liofilizowany, którego nie ruszyłeś od dwóch lat, zostanie w plecaku przy wymiotach ze stresu.",
        ],
      },
      {
        heading: "Alergie i mali",
        paras: [
          "Dziecko z alergią nie «jakoś przeżyje batona z orzechami». Osobna racja, opisana. Niemowlę: mleko, które pije na co dzień, woda do rozrobienia, analgezja ustna uzgodniona z lekarzem. Zwierzę nie dzieli puszki z Tobą — pakuj karmę, miskę i wodę osobno.",
        ],
      },
    ],
  },
  {
    slug: "lacznosc",
    title: "Głos, gdy sieć pada",
    kicker: "Łączność",
    minutes: 5,
    related: ["dokumenty", "numery", "czarny"],
    sections: [
      {
        paras: [
          "Telefon to latarka, mapa, portfel i książka telefoniczna w jednym — dopóki ma prąd i BTS. Blackout i tłumy kładą sieć w godzinę. Plan B jest analogowy.",
        ],
      },
      {
        heading: "Co mieć",
        paras: [
          "Powerbank naładowany, kabel właściwy, radio FM na baterie albo korbkę. ICE w telefonie (ICE1, ICE2) i te same numery na kartce w worku.",
          "SMS przechodzi, gdy głos nie. Jeden krótki: gdzie jesteś, dokąd idziesz, czy ktoś ranny. Potem tryb samolot i radio.",
        ],
      },
      {
        heading: "Alert RCB",
        paras: [
          "Rządowe SMS-y ostrzegają o burzy, powodzi, skażeniu. Nie wyłączaj. Nie zastępują radia — gdy padnie nadajnik komórkowy, RCB milczy, a Trójka i program regionalny jeszcze grają.",
          "112 łączy bez karty SIM i bez zasięgu Twojego operatora, jeśli w ogóle jest jakiś maszt. Ucz dzieci, że to nie numer do żartów i nie do «sprawdzania».",
        ],
      },
    ],
  },
  {
    slug: "dokumenty",
    title: "Papier, który przeżyje wodę",
    kicker: "Dokumenty",
    minutes: 4,
    related: ["lacznosc", "numery", "powrot"],
    sections: [
      {
        paras: [
          "Dowód, karta pobytu, polisa, numer konta, recepty, książeczka zdrowia dziecka, dokumenty psa. Oryginały w worku wodoodpornym. Ksero w drugim miejscu — u rodziny albo w aucie.",
        ],
      },
      {
        heading: "Cyfra nie wystarczy",
        paras: [
          "Pendrive z PDF-ami w worku. Chmura jest bezużyteczna bez sieci. Hasła do banku nie zapisuj obok skanu dowodu.",
          "Gotówka: drobne i dwudziestki. Terminale padają z prądem. 200–400 zł na osobę na trzy doby to rozsądny start, nie fortuna w kieszeni.",
        ],
      },
      {
        heading: "ICE i zbiórka",
        paras: [
          "Na kartce: imię, grupa krwi jeśli znasz, alergie, leki, telefony. Punkt zbiórki — konkretny sklep, kościół, parking, nie «jakoś się znajdziemy przy ratuszu».",
        ],
      },
    ],
  },
  {
    slug: "numery",
    title: "Kogo wołać i kiedy",
    kicker: "Numery",
    minutes: 3,
    related: ["lacznosc", "czad", "dokumenty"],
    sections: [
      {
        paras: [
          "112 jest pierwszy, gdy ktoś ginie, pali się, tonie albo nie oddycha. Reszta numerów jest po to, by nie zatykać 112 gazem w kuchenkach i brakiem prądu na osiedlu.",
        ],
      },
      {
        heading: "Służby",
        paras: [
          "999 pogotowie, 998 straż, 997 policja. 991 energetyka — zerwany przewód to ich, nie Twoja drążka. 992 gaz — wyjść, nie szukać nieszczelności zapałką. 994 wodociągi.",
          "Mów krótko: gdzie, co, ile osób, czy ktoś ranny, czy jest gaz / prąd / woda. Słuchawkę trzymasz, aż każą odłożyć.",
        ],
      },
      {
        heading: "Co nie jest numerem alarmowym",
        paras: [
          "Facebook grupy osiedla, sąsiad z agregatem, «pan z energetyki na priv». Po informację: radio, Alert RCB, strona RCB. Po pomoc medyczną: 112.",
        ],
      },
    ],
  },
  {
    slug: "czad",
    title: "Nie ogrzewaj kuchenką",
    kicker: "Bezpieczeństwo",
    minutes: 4,
    related: ["heating", "blackout", "numery"],
    sections: [
      {
        paras: [
          "Tlenek węgla nie pachnie, nie widać go, usypia. Kuchenka turystyczna, grill, agregat w łazience, piecyk na gaz bez przewodu — to klasyczna śmierć zimą przy awarii ogrzewania.",
        ],
      },
      {
        heading: "Zasady",
        paras: [
          "Kuchenka tylko do gotowania, przy uchylonym oknie, nigdy do grzania izby. Agregat — na zewnątrz, wydech od ścian.",
          "Czujnik czadu na baterie, nie tylko sieciowy. Test przy każdym przeglądzie plecaka. Jeden na sypialnię, jeden przy piecu.",
        ],
      },
      {
        heading: "Objawy i ruch",
        paras: [
          "Ból głowy, mdłości, «grypa», senność, czerwone usta. Otwórz okna, wyjdź, wołaj 112. Nie kładź się «na chwilę».",
          "Ciepło bez ognia: jedna izba, koce, czapka do snu, termos, wyjście do rodziny. To nuda. Nuda nie zabija.",
        ],
      },
    ],
  },
  {
    slug: "dzieci",
    title: "Mali nie poczekają w sali",
    kicker: "Rodzina",
    minutes: 4,
    related: ["zwierzeta", "dokumenty", "work"],
    sections: [
      {
        paras: [
          "Dziecko w żłobku nie ma Twojego plecaka. Ma kartkę, osobę do odbioru i umowę, kto idzie po nie, gdy Ciebie nie ma. Szkoła po alarmie nie jest przechowalnią.",
        ],
      },
      {
        heading: "Co w piórniku i w domu",
        paras: [
          "Kartka: imię, alergie, telefony mamy, taty, sąsiada. Ulubiony koc i pluszak ważą 200 g i gaszą panikę lepiej niż wykład.",
          "Niemowlę: pieluchy na 72 h, mleko które pije, woda, chusteczki, kocyk, leki uzgodnione z lekarzem. Wózek nie wejdzie po schodach zalanych — nosidło tak.",
        ],
      },
      {
        heading: "Rozmowa bez horroru",
        paras: [
          "Ćwiczenie: «gdy gwizdek, idziemy tu, trzymasz się kurtki». Bez filmów o apokalipsie. Dziecko, które zna punkt zbiórki, nie biegnie w dym.",
        ],
      },
    ],
  },
  {
    slug: "zwierzeta",
    title: "Nie zostawiaj za miską",
    kicker: "Rodzina",
    minutes: 3,
    related: ["dzieci", "flood", "dokumenty"],
    sections: [
      {
        paras: [
          "Pies i kot nie «jakoś przeżyją trzy dni». Transporter, smycz, kaganiec jeśli wymagany, karma na 72 h, woda, worki, kocyk. Numer chipa na kartce obok Twojego ICE.",
        ],
      },
      {
        heading: "Hale i drogi",
        paras: [
          "Nie każda hala przyjmie zwierzę. Miej plan B: rodzina, hotel animal-friendly, auto. W powodzi zwierzęta giną w piwnicach, bo «zaraz wrócimy».",
          "Leki weterynaryjne i książeczka szczepień — jak Twoja apteczka. Bez tego schronisko i wet w nocy kręcą głową.",
        ],
      },
    ],
  },
  {
    slug: "powrot",
    title: "Dom po wodzie i po ciemności",
    kicker: "Po zdarzeniu",
    minutes: 5,
    related: ["woda", "czad", "jedzenie", "flood"],
    sections: [
      {
        paras: [
          "Wracasz, gdy służby powiedzą. Nie gdy ciekawość. Zalane gniazdko, przewód na trawniku, zapach gazu — zostajesz na zewnątrz i dzwonisz 112 albo 992.",
        ],
      },
      {
        heading: "Woda i jedzenie",
        paras: [
          "Kran po powodzi jest ściekiem, dopóki wodociągi nie potwierdzą. Tabletka, gotowanie, woda butelkowana. Lodówka po blackoucie: patrz FAQ. Wyrzuć bez żalu.",
        ],
      },
      {
        heading: "Papiery i głowa",
        paras: [
          "Zdjęcia szkód, zanim wyrzucisz sofy. Numer polisy z worka. Sąsiadom pomagasz, nie wchodzisz w ciemne piwnice sam.",
          "Dzieci wracają do rytmu: jedzenie, sen, rozmowa. Plecak osuszasz, przeglądasz, pakujesz od nowa. To nie wstyd, to kolejna zmiana.",
        ],
      },
    ],
  },
];

export function articleLead(article: KnowledgeArticle): string {
  return article.sections[0]?.paras[0] ?? "";
}

export function findArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function relatedArticles(slugs: string[]) {
  return slugs
    .map((s) => findArticle(s))
    .filter((a): a is KnowledgeArticle => Boolean(a));
}
