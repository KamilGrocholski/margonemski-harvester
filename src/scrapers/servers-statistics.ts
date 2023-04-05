import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { PAGES } from '../constants'
import { composeUrl } from '../utils'
import { Result, getErrorData } from '../errors-and-results'

export type ServerStatistics = z.output<typeof serverStatisticsSchema>

export const serverStatisticsSchema = z.object({
    name: z.string().min(1),
    maxOnline: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    online: z.number().int().nonnegative(),
})

export const serversStatisticsSchema = z.array(serverStatisticsSchema)

export function validateServersStatistics(
    serversStatistics: unknown
): ServerStatistics[] {
    const parsedServerStatistics =
        serversStatisticsSchema.parse(serversStatistics)

    return parsedServerStatistics
}

export async function getServersStatistics(): Promise<
    Result<ServerStatistics[]>
> {
    try {
        const { data } = await axios.get(composeUrl('/stats'))
        const $ = load(data)

        const serversStatisticsElements = $(
            PAGES['/stats'].selectors.serversStatistics.list
        )

        const serversStatistics: ServerStatistics[] = []

        serversStatisticsElements.map((_, { attribs }) => {
            const name = (attribs['data-name'] as `#${string}`).slice(1)
            const maxOnline = parseInt(attribs['data-maxonline'] as string, 10)
            const total = parseInt(attribs['data-total'] as string, 10)
            const online = parseInt(attribs['data-online'] as string, 10)

            serversStatistics.push({
                name,
                maxOnline,
                total,
                online,
            })
        })

        return {
            success: true,
            data: serversStatisticsSchema.parse(serversStatistics),
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}
