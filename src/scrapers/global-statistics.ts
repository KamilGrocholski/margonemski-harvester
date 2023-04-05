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

export async function getGlobalStatistics(): Promise<GlobalStatistics> {
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
        newAccounts: newAccountsElement.text(),
    }

    return globalStatisticsSchema.parse(globalStatistics)
}
