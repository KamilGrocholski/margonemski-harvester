import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { DEFAULT_REQUEST_DELAY_IN_MS, PAGES, Profession } from '../constants'
import { composeUrl, delay, schemes } from '../utils'
import {
    ErrorData,
    PaginationResult,
    SinglePageResult,
    getErrorData,
} from '../errors-and-results'

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

export async function getSeasonPvpCharactersPage(required: {
    serverName: string
    season: number
    page: number
}): Promise<SinglePageResult<PvpCharacter[]>> {
    try {
        const { serverName, season, page } = required

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

        return {
            success: true,
            data: pvpCharactersSchema.parse(pvpCharacters),
            page,
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return {
            page: required.page,
            ...errorData,
        }
    }
}

export async function getSeasonPvpCharacters(
    required: {
        serverName: string
        season: number
        onPageSuccess: (
            pageData: PvpCharacter[],
            currentPage: number
        ) => Promise<void> | void
        onPageError: (
            errorData: ErrorData,
            currentPage: number
        ) => Promise<void> | void
    },
    options: { delayBetweenPagesInMs: number | undefined } = {
        delayBetweenPagesInMs: DEFAULT_REQUEST_DELAY_IN_MS,
    }
): Promise<PaginationResult> {
    try {
        const { serverName, season, onPageSuccess, onPageError } = required

        const { data } = await axios.get(
            composeUrl(
                `/ladder/players,${serverName},pvp?season=${season}&page=1`
            )
        )
        const $ = load(data)

        const selectors = PAGES['/ladder/players/pvp'].selectors

        let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10)
        let currentPage: number = 1

        while (currentPage <= numberOfPages) {
            if (options.delayBetweenPagesInMs !== undefined) {
                await delay(options.delayBetweenPagesInMs)
            }

            const result = await getSeasonPvpCharactersPage({
                serverName,
                page: currentPage,
                season,
            })

            if (result.success) {
                onPageSuccess(result.data, result.page)
            } else {
                onPageError(
                    {
                        cause: result.cause,
                        errorName: result.errorName,
                        success: result.success,
                    },
                    result.page
                )
            }

            currentPage++
        }

        return {
            success: true,
            message: `Pobrano wszystkie strony: [serverName: ${serverName}, season: ${season}]`,
            totalPages: numberOfPages,
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return {
            ...errorData,
            message: `Nie udało się pobrać wszystkich strony: [serverName: ${required.serverName}, season: ${required.season}]`,
        }
    }
}
