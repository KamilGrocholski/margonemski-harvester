export type Page =
    | '/art/world'
    | '/stats'
    | `/ladder/players,${string}?page=${number}`

export const BASE_URL = 'https://www.margonem.pl' as const

export const DEFAULT_REQUEST_DELAY_IN_MS = 100 as const

export const PAGES = {
    '/art/world': {
        selectors: {
            statistics: {
                online: 'body > div.background-logged-wrapper > div > div.body-container > div > div > div.col-12.col-lg-4.body-right-container > div > div:nth-child(2) > div > div.server-stats-info > div:nth-child(1) > div.server-stat-value',
                onlineRecord:
                    'body > div.background-logged-wrapper > div > div.body-container > div > div > div.col-12.col-lg-4.body-right-container > div > div:nth-child(2) > div > div.server-stats-info > div:nth-child(2) > div.server-stat-value',
                players:
                    'body > div.background-logged-wrapper > div > div.body-container > div > div > div.col-12.col-lg-4.body-right-container > div > div:nth-child(2) > div > div.server-stats-info > div:nth-child(3) > div.server-stat-value',
                characters:
                    'body > div.background-logged-wrapper > div > div.body-container > div > div > div.col-12.col-lg-4.body-right-container > div > div:nth-child(2) > div > div.server-stats-info > div:nth-child(4) > div.server-stat-value',
                newAccount:
                    'body > div.background-logged-wrapper > div > div.body-container > div > div > div.col-12.col-lg-4.body-right-container > div > div:nth-child(2) > div > div.server-stats-info > div:nth-child(5) > div.server-stat-value',
            },
        },
    },
    '/stats': {
        selectors: {
            serversStatistics: {
                list: 'div[data-name][data-maxonline][data-total][data-online]',
            },
        },
    },
    '/ladder/players': {
        selectors: {
            worldName:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > h2 > span',
            tableBody:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody',
            numberOfPages:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.pagination > div > div.total-pages > a',
        },
    },
} as const

export type Profession = (typeof PROFESSIONS)[number]

export const PROFESSIONS = [
    'Wojownik',
    'Łowca',
    'Tancerz ostrzy',
    'Paladyn',
    'Mag',
    'Tropiciel',
] as const
