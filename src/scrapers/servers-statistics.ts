import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { PAGES } from '../constants'
import { composeUrl } from '../utils'

export type ServersStatistics = z.output<typeof serversStatisticsSchema>

export const serversStatisticsSchema = z.array(
    z.object({
        name: z.string().min(1),
        maxOnline: z.number().positive().int(),
        total: z.number().positive().int(),
        online: z.number().positive().int(),
    })
)

export function validateServersStatistics(
    serversStatistics: unknown
): ServersStatistics {
    const parsedServerStatistics =
        serversStatisticsSchema.parse(serversStatistics)

    return parsedServerStatistics
}

export async function getServersStatistics(
    shouldValidate: boolean = true
): Promise<ServersStatistics> {
    const { data } = await axios.get(composeUrl('/stats'))
    const $ = load(data)

    const serversStatisticsElements = $(
        PAGES['/stats'].selectors.serversStatistics.list
    )

    const serversStatistics: ServersStatistics = []

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

    if (shouldValidate) {
        serversStatisticsSchema.parse(serversStatistics)
    }

    return serversStatistics
}
