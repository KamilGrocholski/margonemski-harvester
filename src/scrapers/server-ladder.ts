import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import {
    DEFAULT_REQUEST_DELAY_IN_MS,
    PAGES,
    PROFESSIONS,
    Profession,
} from '../constants'
import { composeUrl, delay } from '../utils'

export type CharacterRow = z.output<typeof characterRowSchema>
export type CharactersLadder = z.output<typeof charactersLadderSchema>

export const characterRowSchema = z.object({
    rank: z.number().int().min(1),
    name: z.string().min(1),
    level: z.number().int().min(1),
    profession: z.string().refine(
        (value) => {
            return PROFESSIONS.includes(value as Profession)
        },
        {
            message:
                'Profesja jest nie poprawna albo została dodana nowa do Margonem i nie jest ona uwzględniona w liście `PROFESSIONS`.',
        }
    ) as z.ZodType<Profession>,
    ph: z.number().int().min(0),
    lastOnline: z.string().min(1),
})

export const charactersLadderSchema = z.array(characterRowSchema)

export function validateCharactersLadder(
    charactersLadder: unknown
): CharactersLadder {
    const parsedCharactersLadder =
        charactersLadderSchema.parse(charactersLadder)

    return parsedCharactersLadder
}

export async function getServerLadderPage(
    serverName: string,
    page: number,
    options: {
        shouldValidate: boolean
    } = { shouldValidate: true }
): Promise<CharactersLadder> {
    const { data } = await axios.get(
        composeUrl(`/ladder/players,${serverName}?page=${page}`)
    )
    const $ = load(data)

    const selectors = PAGES['/ladder/players'].selectors

    const tableRows = $(selectors.tableBody).find('tr')

    const charactersLadder: CharactersLadder = []

    tableRows.each((_, row) => {
        const rowData = $(row).find('td')

        const rank = parseInt(rowData.eq(0).text(), 10)
        const name = rowData.eq(1).text().trim()
        const level = parseInt(rowData.eq(2).text(), 10)
        const profession = rowData.eq(3).text().trim() as Profession
        const ph = parseInt(rowData.eq(4).text())
        const lastOnline = rowData.eq(5).text().trim()

        charactersLadder.push({
            rank,
            name,
            level,
            profession,
            ph,
            lastOnline,
        })
    })

    if (options.shouldValidate) {
        charactersLadderSchema.parse(charactersLadder)
    }

    return charactersLadder
}

export async function getServerLadder(
    serverName: string,
    onPageComplete: (
        pageData: CharactersLadder,
        currentPage: number
    ) => Promise<void> | void,
    delayBetweenPagesInMs: number = DEFAULT_REQUEST_DELAY_IN_MS
): Promise<void> {
    const { data } = await axios.get(
        composeUrl(`/ladder/players,${serverName}?page=1`)
    )
    const $ = load(data)

    const selectors = PAGES['/ladder/players'].selectors

    let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10)
    let currentPage: number = 1

    while (currentPage <= numberOfPages) {
        const { data } = await axios.get(
            composeUrl(`/ladder/players,${serverName}?page=${currentPage}`)
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

        const charactersLadder: CharactersLadder = []

        tableRows.each((_, row) => {
            const rowData = $(row).find('td')

            const rank = parseInt(rowData.eq(0).text(), 10)
            const name = rowData.eq(1).text().trim()
            const level = parseInt(rowData.eq(2).text(), 10)
            const profession = rowData.eq(3).text().trim() as Profession
            const ph = parseInt(rowData.eq(4).text())
            const lastOnline = rowData.eq(5).text().trim()

            charactersLadder.push({
                rank,
                name,
                level,
                profession,
                ph,
                lastOnline,
            })
        })

        onPageComplete(charactersLadder, currentPage)

        currentPage++

        await delay(delayBetweenPagesInMs)
    }
}
