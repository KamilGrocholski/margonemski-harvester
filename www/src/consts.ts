export const SITE = {
    title: 'margonemski-harvester',
    description:
        'Można sobie pobrać dane z tej wspaniałej strony -> https://www.margonem.pl',
    defaultLanguage: 'pl-PL',
} as const

export const OPEN_GRAPH = {
    image: {
        src: 'https://github.com/withastro/astro/blob/main/.github/assets/banner.png?raw=true',
        alt:
            'astro logo on a starry expanse of space,' +
            ' with a purple saturn-like planet floating in the right foreground',
    },
    twitter: 'astrodotbuild',
}

export const KNOWN_LANGUAGES = {
    English: 'pl',
} as const
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES)

export const GITHUB_REPO_URL = `https://github.com/KamilGrocholski/margonemski-harvester`
export const GITHUB_EDIT_URL = `https://github.com/KamilGrocholski/margonemski-harvester/tree/main/www/docs`

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
    indexName: 'XXXXXXXXXX',
    appId: 'XXXXXXXXXX',
    apiKey: 'XXXXXXXXXX',
}

export type Sidebar = Record<
    (typeof KNOWN_LANGUAGE_CODES)[number],
    Record<string, { text: string; link: string }[]>
>
export const SIDEBAR: Sidebar = {
    pl: {
        Wprowadzenie: [
            { text: 'Jak to działa', link: 'pl/how-it-works' },
            { text: 'Obsługa błędów', link: 'pl/error-handling' },
        ],
        Przykłady: [
            {
                text: 'Ranking postaci',
                link: 'pl/server-characters-ladder',
            },
            { text: 'Ranking klanów', link: 'pl/server-guilds-ladder' },
            { text: 'Ranking otchłani', link: 'pl/server-season-pvp-ladder' },
            { text: 'Lista postaci klanu', link: 'pl/guild-characters' },
            { text: 'Informacje konta', link: 'pl/account-info' },
            { text: 'Globalne statystyki', link: 'pl/global-statistics' },
            { text: 'Statystyki serwerów', link: 'pl/servers-statistics' },
            { text: 'Przedmioty postaci	', link: 'pl/character-items' },
        ],
    },
}
