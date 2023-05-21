import axios from 'axios'
import { load } from 'cheerio'
import { z } from 'zod'
import { PAGES } from '../constants'
import { getErrorData, Result } from '../errors-and-results'
import { composeUrl } from '../utils'

export type GlobalStatistics = z.output<typeof globalStatisticsSchema>

export const globalStatisticsSchema = z.object({
    online: z.string(),
    recordOnline: z.string(),
    players: z.string(),
    characters: z.string(),
    newAccounts: z.string()
})

/**
 * Pobiera statystyki globalne.
 */
export async function getGlobalStatistics(): Promise<Result<GlobalStatistics>> {
    try {
        const { data } = await axios.get(composeUrl('/art/world'))
        const $ = load(data)

        const selectors = PAGES['/art/world'].selectors.statistics

        const onlineElement = $(selectors.online)
        const recordOnlineElement = $(selectors.onlineRecord)
        const playersElement = $(selectors.players)
        const charactersElement = $(selectors.characters)
        const newAccountsElement = $(selectors.newAccount)

        const globalStatistics: GlobalStatistics = {
            online: onlineElement.text(),
            recordOnline: recordOnlineElement.text(),
            players: playersElement.text(),
            characters: charactersElement.text(),
            newAccounts: newAccountsElement.text()
        }

        return {
            success: true,
            data: globalStatisticsSchema.parse(globalStatistics)
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}
