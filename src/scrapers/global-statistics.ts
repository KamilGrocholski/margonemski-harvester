import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { PAGES } from '../constants'
import { composeUrl } from '../utils'

export type GlobalStatistics = z.output<typeof globalStatisticsSchema>

export const globalStatisticsSchema = z.object({
    online: z.string(),
    recordOnline: z.string(),
    players: z.string(),
    characters: z.string(),
    newAccounts: z.string(),
})

export function validateGlobalStatistics(
    globalStatistics: unknown
): GlobalStatistics {
    const parsedGlobalstatistics =
        globalStatisticsSchema.parse(globalStatistics)

    return parsedGlobalstatistics
}

export async function getGlobalStatistics(
    options: {
        shouldValidate: boolean
    } = { shouldValidate: true }
): Promise<GlobalStatistics> {
    const { data } = await axios.get(composeUrl('/art/world'))
    const $ = load(data)

    const onlineElement = $(PAGES['/art/world'].selectors.statistics.online)
    const recordOnlineElement = $(
        PAGES['/art/world'].selectors.statistics.onlineRecord
    )
    const playersElement = $(PAGES['/art/world'].selectors.statistics.players)
    const charactersElement = $(
        PAGES['/art/world'].selectors.statistics.characters
    )
    const newAccountsElement = $(
        PAGES['/art/world'].selectors.statistics.newAccount
    )

    const globalStatistics: GlobalStatistics = {
        online: onlineElement.text(),
        recordOnline: recordOnlineElement.text(),
        players: playersElement.text(),
        characters: charactersElement.text(),
        newAccounts: newAccountsElement.text(),
    }

    if (options.shouldValidate) {
        globalStatisticsSchema.parse(globalStatistics)
    }

    return globalStatistics
}
