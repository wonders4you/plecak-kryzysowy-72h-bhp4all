/**
 * Kategorie sklepu KAMS (tylko URL-e /k… z https://kams.com.pl/sitemap.php).
 * Bez kart produktów /p… — przy pozycji jest kategoria, nie pojedynczy towar.
 */
const K = (slug: string) => `https://kams.com.pl/${slug}`;

export const KAMS_SHOP: Record<string, { url: string; label: string }> = {
  apteczka: { url: K("k45,apteczki.html"), label: "Apteczki" },
  bandaze: { url: K("k45,apteczki.html"), label: "Apteczki" },
  gaza: { url: K("k45,apteczki.html"), label: "Apteczki" },
  plastry: { url: K("k45,apteczki.html"), label: "Apteczki" },
  "tasma-med": { url: K("k45,apteczki.html"), label: "Apteczki" },
  nozyczki: { url: K("k45,apteczki.html"), label: "Apteczki" },
  peseta: { url: K("k45,apteczki.html"), label: "Apteczki" },
  tourniquet: { url: K("k45,apteczki.html"), label: "Apteczki" },
  "syrop-dziecko": { url: K("k45,apteczki.html"), label: "Apteczki" },
  rekawiczki: {
    url: K("k262,rekawice-nitrylowe.html"),
    label: "Rękawice nitrylowe",
  },
  "koc-nrc": { url: K("k243,koc-ratunkowy.html"), label: "Koce ratunkowe" },
  ffp2: { url: K("k48,maseczki-przylbice.html"), label: "Maseczki" },
  "instrukcja-pp": {
    url: K("k93,instrukcje-bhp.html"),
    label: "Instrukcje BHP",
  },
  mydlo: { url: K("k57,mydlo.html"), label: "Mydło" },
  zel: { url: K("k56,pasty-bhp.html"), label: "Pasty BHP" },
  chusteczki: {
    url: K("k55,srodki-czystosci-akcesoria.html"),
    label: "Środki czystości",
  },
  recznik: { url: K("k6,reczniki.html"), label: "Ręczniki" },
  papier: { url: K("k171,papier-toaletowy.html"), label: "Papier toaletowy" },
  "worki-smieci": { url: K("k166,kosze-na-smieci.html"), label: "Kosze" },
  czolowka: { url: K("k211,latarki.html"), label: "Latarki" },
  latarka: { url: K("k211,latarki.html"), label: "Latarki" },
  baterie: { url: K("k211,latarki.html"), label: "Latarki" },
  multitool: { url: K("k183,narzedzia.html"), label: "Narzędzia" },
  paracord: { url: K("k54,liny-zabezpieczajace.html"), label: "Liny" },
  radio: { url: K("k144,radiotelefony-radia.html"), label: "Radia" },
  poncho: {
    url: K("k227,odziez-przeciwdeszczowa.html"),
    label: "Odzież przeciwdeszczowa",
  },
  warstwa: { url: K("k247,skarpety-robocze.html"), label: "Skarpety" },
  okulary: { url: K("k44,okulary-ochronne.html"), label: "Okulary ochronne" },
  "czujnik-czadu": {
    url: K("k189,detektory-gazu.html"),
    label: "Detektory gazu",
  },
  lopatka: { url: K("k187,narzedzia-ogrodowe.html"), label: "Narzędzia ogrodowe" },
  "buty-biuro": { url: K("k3,buty-robocze.html"), label: "Buty robocze" },
  plecak: {
    url: K("k219,linki-narzedziowe-worki-torby-plecaki.html"),
    label: "Torby i plecaki",
  },
  "worki-kolor": {
    url: K("k219,linki-narzedziowe-worki-torby-plecaki.html"),
    label: "Worki i torby",
  },
};
