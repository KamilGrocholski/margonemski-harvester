import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { DEFAULT_REQUEST_DELAY_IN_MS, PAGES, Profession } from '../constants'
import { composeUrl, delay, schemes } from '../utils'

export type PvpCharacter = z.output<typeof pvpCharacterSchema>

export const pvpCharacterSchema = z.object({
    lastOnline: schemes.lastOnline,
    level: schemes.level,
    name: schemes.name,
    rank: schemes.rank,
    characterLink: schemes.characterLink,
    profession: schemes.profession,
    rankingPoints: z.number().int().nonnegative(),
    winRatio: z.number().nonnegative(),
    wpr: z.string().min(1),
})

export const pvpCharactersSchema = z.array(pvpCharacterSchema)

export function validatePvpCharacters(pvpCharacters: unknown): PvpCharacter[] {
    const parsedPvpCharacters = pvpCharactersSchema.parse(pvpCharacters)

    return parsedPvpCharacters
}

export async function getSeasonPvpCharactersPage(
    serverName: string,
    season: number,
    page: number,
    options: {
        shouldValidate: boolean
    } = { shouldValidate: true }
): Promise<PvpCharacter[]> {
    const { data } = await axios.get(
        composeUrl(
            `/ladder/players,${serverName},pvp?season=${season}&page=${page}`
        )
    )
    const $ = load(data)

    const selectors = PAGES['/ladder/players'].selectors

    const tableRows = $(selectors.tableBody).find('tr')

    const pvpCharacters: PvpCharacter[] = []

    tableRows.each((_, row) => {
        const rowData = $(row).find('td')

        const rank = parseInt(rowData.eq(0).text(), 10)
        const name = rowData.eq(1).text().trim()
        const characterLink = rowData.eq(1).attr('href') as string
        const level = parseInt(rowData.eq(2).text(), 10)
        const profession = rowData.eq(3).text().trim() as Profession
        const rankingPoints = parseInt(rowData.eq(4).text())
        const winRatio = parseInt(rowData.eq(5).text().trim().slice(0, -1), 10)
        const wpr = rowData.eq(6).text().trim()
        const lastOnline = rowData.eq(7).text().trim()

        pvpCharacters.push({
            rank,
            name,
            characterLink,
            level,
            profession,
            rankingPoints,
            winRatio,
            wpr,
            lastOnline,
        })
    })

    if (options.shouldValidate) {
        pvpCharactersSchema.parse(pvpCharacters)
    }

    return pvpCharacters
}

export async function getSeasonPvpCharacters(
    serverName: string,
    season: number,
    onPageComplete: (
        pageData: PvpCharacter[],
        currentPage: number
    ) => Promise<void> | void,
    options: { delayBetweenPagesInMs: number | undefined } = {
        delayBetweenPagesInMs: DEFAULT_REQUEST_DELAY_IN_MS,
    }
): Promise<void> {
    const { data } = await axios.get(
        composeUrl(`/ladder/players,${serverName},pvp?season=${season}&page=1`)
    )
    const $ = load(data)

    const selectors = PAGES['/ladder/players/pvp'].selectors

    let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10)
    let currentPage: number = 1

    while (currentPage <= numberOfPages) {
        const { data } = await axios.get(
            composeUrl(
                `/ladder/players,${serverName},pvp?season=${season}&page=${currentPage}`
            )
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

        const pvpCharacters: PvpCharacter[] = []

        tableRows.each((_, row) => {
            const rowData = $(row).find('td')

            const rank = parseInt(rowData.eq(0).text(), 10)
            const name = rowData.eq(1).text().trim()
            const characterLink = rowData.eq(1).attr('href') as string
            const level = parseInt(rowData.eq(2).text(), 10)
            const profession = rowData.eq(3).text().trim() as Profession
            const rankingPoints = parseInt(rowData.eq(4).text())
            const winRatio = parseInt(
                rowData.eq(5).text().trim().slice(0, -1),
                10
            )
            const wpr = rowData.eq(6).text().trim()
            const lastOnline = rowData.eq(7).text().trim()

            pvpCharacters.push({
                rank,
                name,
                characterLink,
                level,
                profession,
                rankingPoints,
                winRatio,
                wpr,
                lastOnline,
            })
        })

        onPageComplete(pvpCharacters, currentPage)

        currentPage++

        if (options.delayBetweenPagesInMs !== undefined) {
            await delay(options.delayBetweenPagesInMs)
        }
    }
}
