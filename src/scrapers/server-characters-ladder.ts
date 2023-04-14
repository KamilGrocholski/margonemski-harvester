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

export type CharacterRow = z.output<typeof characterRowSchema>
export type CharactersLadder = z.output<typeof charactersLadderSchema>

export const characterRowSchema = z.object({
    rank: schemes.rank,
    name: schemes.name,
    level: schemes.level,
    profession: schemes.profession,
    ph: schemes.ph,
    lastOnline: schemes.lastOnline,
    characterLink: schemes.characterLink,
})

export const charactersLadderSchema = z.array(characterRowSchema)

/**
 *
 * Pobiera pojedynczą stronę listy postaci dla podanego serwera.
 *
 * @param {object} required - obiekt z wymaganymi parametrami
 * @param {string} required.serverName - nazwa serwera
 * @param {number} required.page - numer strony
 * @returns {Promise<SinglePageResult<CharacterLadder>>} - obiekt Promise z wynikiem zawierającym obiekt
 * typu SinglePageResult, który jest jedną stroną listy postaci o typie CharacterLadder
 *
 * @typedef {Object} CharacterRow - Obiekt reprezentujący pojedynczy wiersz z informacją o postaci.
 * @property {string} rank - Ranga postaci.
 * @property {string} name - Nazwa postaci.
 * @property {string} characterLink - Link do profilu postaci.
 * @property {number} level - Poziom postaci.
 * @property {string} profession - Nazwa profesji postaci.
 * @property {string} ph - Punkty honoru postaci.
 * @property {string} lastOnline - Data ostatniego logowania postaci.
 * @typedef {CharacterRow[]} CharacterLadder - Tablica reprezentująca ranking postaci na serwerze.
 */
export async function getServerCharactersLadderPage(required: {
    serverName: string
    page: number
}): Promise<SinglePageResult<CharactersLadder>> {
    try {
        const { serverName, page } = required

        const { data } = await axios.get(
            composeUrl(`/ladder/players,${serverName}?page=${page}`)
        )
        const $ = load(data)

        const selectors = PAGES['/ladder/players'].selectors

        const tableRows = $(selectors.tableBody).find('tr')

        const charactersLadder: CharactersLadder = new Array(tableRows.length)

        tableRows.each((rowIndex, row) => {
            const rowData = $(row).find('td')

            const rank = parseInt(rowData.eq(0).text(), 10)
            const name = rowData.eq(1).text().trim()
            const characterLink = rowData.eq(1).find('a').attr('href') as string
            const level = parseInt(rowData.eq(2).text(), 10)
            const profession = rowData.eq(3).text().trim() as Profession
            const ph = parseInt(rowData.eq(4).text())
            const lastOnline = rowData.eq(5).text().trim()

            const parsedCharacter = characterRowSchema.parse({
                rank,
                name,
                characterLink,
                level,
                profession,
                ph,
                lastOnline,
            })

            charactersLadder[rowIndex] = parsedCharacter
        })

        return {
            success: true,
            data: charactersLadder,
            page,
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return {
            page: required.page,
            cause: errorData.cause,
            success: errorData.success,
            errorName: errorData.errorName,
        }
    }
}

/**
 *
 * Pobiera stronę po stronie wszystkie postacie z drabinki dla danego serwera.
 *
 * Po pobraniu każdej strony wykonuje callback onPageSuccess z danymi strony oraz numerem strony.
 * W przypadku błędu wykonuje callback onPageError z informacją o błędzie oraz numerem strony.
 * Zwraca informację o liczbie pobranych stron oraz liczbie postaci.
 * @param required - obiekt z wymaganymi parametrami
 * @param required.serverName - nazwa serwera
 * @param required.onPageSuccess - callback wywoływany po pobraniu jednej strony
 * @param required.onPageError - callback wywoływany w przypadku błędu pobierania strony
 * @param options - opcjonalne parametry
 * @param options.delayBetweenPagesInMs - opóźnienie między pobieraniem kolejnych stron (domyślnie 100 ms)
 * @returns informację o liczbie pobranych stron
 */
export async function getServerCharactersLadder(
    required: {
        serverName: string
        onPageSuccess: (
            pageData: CharactersLadder,
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
        const { serverName, onPageSuccess, onPageError } = required

        const { data } = await axios.get(
            composeUrl(`/ladder/players,${serverName}?page=1`)
        )
        const $ = load(data)

        const selectors = PAGES['/ladder/players'].selectors

        let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10)
        let currentPage: number = 1

        while (currentPage <= numberOfPages) {
            if (options.delayBetweenPagesInMs) {
                await delay(options.delayBetweenPagesInMs)
            }

            const result = await getServerCharactersLadderPage({
                serverName,
                page: currentPage,
            })

            if (result.success) {
                onPageSuccess(result.data, result.page)
            } else {
                onPageError(
                    {
                        errorName: result.errorName,
                        cause: result.cause,
                        success: result.success,
                    },
                    result.page
                )
            }

            currentPage++
        }

        return {
            success: true,
            totalPages: numberOfPages,
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}
