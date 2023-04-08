import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { PAGES } from '../constants'
import { composeUrl, schemes } from '../utils'
import { Result, getErrorData } from '../errors-and-results'

export type ServerStatistics = z.output<typeof serverStatisticsSchema>
export type ServersOnlinePlayers = z.output<typeof onlinePlayersSchema>

export const serverStatisticsSchema = z.object({
    name: z.string().min(1),
    maxOnline: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    online: z.number().int().nonnegative(),
})

export const onlinePlayersSchema = z.array(
    z.object({
        serverName: z.string().min(1),
        onlinePlayers: z.array(schemes.name),
    })
)

export const serversStatisticsSchema = z.array(serverStatisticsSchema)

/**
 * Pobiera nazwy graczy online ze wszystkich serwerów.
 *
 * @returns Promise zawierająca obiekt Result z danymi graczy online typu ServersOnlinePlayer.
 * @description Funkcja wykorzystuje schemat serverStatisticsSchema do walidacji i deserializacji danych pobranych z serwera.
 * Obiekt Result zawiera informacje o sukcesie lub błędzie zwróconym przez serwer oraz dane typu ServersOnlinePlayer.
 */
export async function getOnlinePlayers(): Promise<
    Result<ServersOnlinePlayers>
> {
    try {
        const { data } = await axios.get(composeUrl('/stats'))
        const $ = load(data)

        const selectors = PAGES['/stats'].selectors

        const popupsElements = $(selectors.onlinePlayersPopups)

        const servers: ServersOnlinePlayers = new Array(popupsElements.length)

        popupsElements.each((popupIndex, popup) => {
            const serverName = $(popup)
                .attr('class')
                ?.split(' ')
                .find((value) => value.endsWith('-popup'))
                ?.replace(/-popup$/, '') as string

            const namesList = $(`div.${serverName}-popup`).find(
                '.statistics-rank'
            )

            const names: string[] = new Array(namesList.length)

            namesList.each((nameIndex, element) => {
                const name = $(element).text()
                names[nameIndex] = name
            })

            servers[popupIndex] = {
                serverName,
                onlinePlayers: names,
            }
        })

        return {
            success: true,
            data: onlinePlayersSchema.parse(servers),
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}

/**
 *
 * Pobiera statystyki wszystkich serwerów.
 *
 * @typedef {Object} ServerStatistics - Obiekt reprezentujący statystyki pojedynczego serwera.
 * @property {name} - Nazwa serwera.
 * @property {maxOnline} - Rekord liczby graczy, jaka była online w jednej momencie.
 * @property {total} - Całkowita liczba graczy.
 * @property {online} - Aktualna liczba graczy online na serwerze.
 *
 * @returns {Result<ServerStatistics[]>}
 */
export async function getServersStatistics(): Promise<
    Result<ServerStatistics[]>
> {
    try {
        const { data } = await axios.get(composeUrl('/stats'))
        const $ = load(data)

        const serversStatisticsElements = $(
            PAGES['/stats'].selectors.serversStatistics.list
        )

        const serversStatistics: ServerStatistics[] = new Array(
            serversStatisticsElements.length
        )

        serversStatisticsElements.each(
            (serversStatisticsIndex, { attribs }) => {
                const name = (attribs['data-name'] as `#${string}`).slice(1)
                const maxOnline = parseInt(
                    attribs['data-maxonline'] as string,
                    10
                )
                const total = parseInt(attribs['data-total'] as string, 10)
                const online = parseInt(attribs['data-online'] as string, 10)

                serversStatistics[serversStatisticsIndex] = {
                    name,
                    maxOnline,
                    total,
                    online,
                }
            }
        )

        return {
            success: true,
            data: serversStatisticsSchema.parse(serversStatistics),
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}
