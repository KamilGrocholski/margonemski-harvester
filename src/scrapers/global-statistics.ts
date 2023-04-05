import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { PAGES } from '../constants'
import { composeUrl } from '../utils'
import { Result, getErrorData } from '../errors-and-results'

export type GlobalStatistics = z.output<typeof globalStatisticsSchema>

export const globalStatisticsSchema = z.object({
    online: z.string(),
    recordOnline: z.string(),
    players: z.string(),
    characters: z.string(),
    newAccounts: z.string(),
})

/**
 * Pobiera statystyki globalne.
 *
 * @returns {Promise<Result<GlobalStatistics>>} Obiekt typu Promise, który rozwiązuje się do wyniku operacji.
 * Wynik może zawierać obiekt GlobalStatistics lub ErrorData w przypadku błędu.
 *
 * @typedef GlobalStatistics
 * @property {string} online - Liczba użytkowników online.
 * @property {string} recordOnline - Rekordowa liczba użytkowników online.
 * @property {string} players - Liczba graczy w systemie.
 * @property {string} characters - Liczba postaci w systemie.
 * @property {string} newAccounts - Liczba nowych kont w systemie.
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
            newAccounts: newAccountsElement.text(),
        }

        return {
            success: true,
            data: globalStatisticsSchema.parse(globalStatistics),
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}
