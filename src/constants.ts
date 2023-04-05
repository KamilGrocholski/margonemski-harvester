export type Page =
    | '/art/world'
    | '/stats'
    | `/ladder/players,${string}?page=${number}`
    | `/ladder/guilds,${string}?page=${number}`
    | `/ladder/players,${string},pvp?season=${number}&page=${number}`
    | `/guilds/view,${string},${number}`
    | `/profile/view,${number}#char_${number},${string}`

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
            onlinePlayersPopups:
                'div.light-brown-box.news-container.no-footer[class$="-popup"]',
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
    '/ladder/guilds': {
        selectors: {
            tableBody:
                'body > div.background-logged-wrapper > div > div.body-container > div.ranking-container.full-table > div > div > table > tbody',
            numberOfPages:
                'body > div.background-logged-wrapper > div > div.body-container > div.pagination > div > div.total-pages > a',
        },
    },
    '/ladder/players/pvp': {
        selectors: {
            tableBody:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody ',
            numberOfPages:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.pagination > div > div.total-pages > a',
        },
    },
    '/profile/view': {
        selectors: {
            listOfCharacters: 'div.character-list',
            charactersRow: {
                id: '.chid',
                name: '.chnick',
                level: '.chlvl',
                profession: '.chprofname',
                serverName: '.chworld',
                guildName: '.chguild',
                guildId: '.chguildid',
                guildLink: '.chguildurl',
                gender: '.chgenderparsed',
                lastOnline: '.chlast',
            },
            accountName:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > h2 > span:nth-child(2)',
            role: 'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > div.profile-header-data-container > div.profile-header-data.profile-header-capitalized > div.value > span',
            accountCreatedAt:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > div.profile-header-data-container > div:nth-child(5) > div.value',
            daysInGame:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > div.profile-header-data-container > div:nth-child(8) > div.value',
            forumPosts:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > div.profile-header-data-container > div:nth-child(3) > div.value',
            reputation:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > div.profile-header-data-container > div:nth-child(6) > div.value',
            reputationRatio:
                'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > div.profile-header-data-container > div:nth-child(9) > div.value',
            deputy: 'body > div.background-logged-wrapper > div > div.body-container > div > div.brown-box.profile-header.mb-4 > div.profile-header-data-container > div:nth-child(4) > div.value',
        },
    },
    '/guilds/view': {
        selectors: {
            tableBody:
                'body > div.background-logged-wrapper > div > div.body-container > div > div > div.guild-members-container > table > tbody',
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
