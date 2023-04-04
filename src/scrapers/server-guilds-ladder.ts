import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { DEFAULT_REQUEST_DELAY_IN_MS, PAGES } from '../constants'
import { composeUrl, delay, schemes } from '../utils'

export type GuildRow = z.output<typeof guildRowSchema>
export type GuildsLadder = z.output<typeof guildsLadderSchema>

export const guildRowSchema = z.object({
    power: z.string().min(1),
    players: z.number().int().nonnegative(),
    guildLink: schemes.guildLink,
    rank: schemes.rank,
    name: schemes.name,
    level: schemes.level,
    ph: schemes.ph,
})

export const guildsLadderSchema = z.array(guildRowSchema)

export function validateGuildsLadder(guildsLadder: unknown): GuildsLadder {
    const parsedGuildsLadder = guildsLadderSchema.parse(guildsLadder)

    return parsedGuildsLadder
}

export async function getServerGuildsLadderPage(
    serverName: string,
    page: number,
    options: {
        shouldValidate: boolean
    } = { shouldValidate: true }
): Promise<GuildsLadder> {
    const { data } = await axios.get(
        composeUrl(`/guilds/view,${serverName},${page}`)
    )
    const $ = load(data)

    const selectors = PAGES['/ladder/guilds'].selectors

    const tableRows = $(selectors.tableBody).find('tr')

    const guildsLadder: GuildsLadder = []

    tableRows.each((_, row) => {
        const rowData = $(row).find('td')

        const rank = parseInt(rowData.eq(0).text(), 10)
        const name = rowData.eq(1).text().trim()
        const guildLink = rowData.eq(1).attr('href') as string
        const power = rowData.eq(2).text()
        const players = parseInt(rowData.eq(2).text(), 10)
        const level = parseInt(rowData.eq(2).text(), 10)
        const ph = parseInt(rowData.eq(4).text())

        guildsLadder.push({
            rank,
            name,
            guildLink,
            power,
            players,
            level,
            ph,
        })
    })

    if (options.shouldValidate) {
        guildsLadderSchema.parse(guildsLadder)
    }

    return guildsLadder
}

export async function getServerGuildsLadder(
    serverName: string,
    onPageComplete: (
        pageData: GuildsLadder,
        currentPage: number
    ) => Promise<void> | void,
    delayBetweenPagesInMs: number = DEFAULT_REQUEST_DELAY_IN_MS
): Promise<void> {
    const { data } = await axios.get(composeUrl(`/guilds/view,${serverName},1`))
    const $ = load(data)

    const selectors = PAGES['/ladder/guilds'].selectors

    let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10)
    let currentPage: number = 1

    while (currentPage <= numberOfPages) {
        const { data } = await axios.get(
            composeUrl(`/guilds/view,${serverName},${currentPage}`)
        )
        const $ = load(data)

        const currentNumberOfPages = parseInt(
            $(selectors.numberOfPages).text(),
            10
        )

        if (currentNumberOfPages < currentPage) {
            return
        }

        numberOfPages = currentNumberOfPages

        const tableRows = $(selectors.tableBody).find('tr')

        const guildsLadder: GuildsLadder = []

        tableRows.each((_, row) => {
            const rowData = $(row).find('td')

            const rank = parseInt(rowData.eq(0).text(), 10)
            const name = rowData.eq(1).text().trim()
            const guildLink = rowData.eq(1).attr('href') as string
            const power = rowData.eq(2).text()
            const players = parseInt(rowData.eq(2).text(), 10)
            const level = parseInt(rowData.eq(2).text(), 10)
            const ph = parseInt(rowData.eq(4).text())

            guildsLadder.push({
                rank,
                name,
                guildLink,
                power,
                players,
                level,
                ph,
            })
        })

        onPageComplete(guildsLadder, currentPage)

        currentPage++

        await delay(delayBetweenPagesInMs)
    }
}
