export const SITE = {
  title: "margonemski-harvester",
  description: "Można sobie pobrać dane z tej wspaniałej strony -> https://www.margonem.pl",
  defaultLanguage: "pl-PL",
} as const;

export const OPEN_GRAPH = {
  image: {
    src: "https://a.allegroimg.com/original/1ef1b6/5557c8af4dcfb696ee765c0062ea",
    alt: "napis margonem na tle mapy z gry",
  },
};

export const KNOWN_LANGUAGES = {
  Polish: "pl",
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_REPO_URL = `https://github.com/KamilGrocholski/margonemski-harvester`;
export const GITHUB_EDIT_URL = `https://github.com/KamilGrocholski/margonemski-harvester/tree/main/www/docs`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: "XXXXXXXXXX",
  appId: "XXXXXXXXXX",
  apiKey: "XXXXXXXXXX",
};

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  pl: {
    Wprowadzenie: [
      { text: "Jak to działa", link: "pl/how-it-works" },
    ],
    Przykłady: [
      {
        text: "Ranking postaci",
        link: "pl/server-characters-ladder",
      },
      { text: "Ranking klanów", link: "pl/server-guilds-ladder" },
      { text: "Ranking otchłani", link: "pl/server-season-pvp-ladder" },
      { text: "Lista postaci klanu", link: "pl/guild-characters" },
      { text: "Informacje konta", link: "pl/account-info" },
      { text: "Globalne statystyki", link: "pl/global-statistics" },
      { text: "Statystyki serwerów", link: "pl/servers-statistics" },
      { text: "Postacie online", link: "pl/online-players" },
      { text: "Przedmioty postaci	", link: "pl/character-items" },
    ],
  },
};
