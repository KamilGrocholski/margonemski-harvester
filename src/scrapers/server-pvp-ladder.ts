import { z } from 'zod';
import { load } from 'cheerio';
import axios from 'axios';
import { DEFAULT_REQUEST_DELAY_IN_MS, PAGES, Profession } from '../constants';
import { composeUrl, delay, schemes } from '../utils';
import {
    ErrorData,
    PaginationResult,
    SinglePageResult,
    getErrorData,
} from '../errors-and-results';

export type PvpCharacter = z.output<typeof pvpCharacterSchema>;

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
});

export const pvpCharactersSchema = z.array(pvpCharacterSchema);

/**
 *
 * Pobiera określoną stronę z rankingu pvp dla danego sezonu i serwera.
 *
 * @param {Object} required - Wymagane parametry.
 * @param {string} required.serverName - Nazwa serwera, dla którego pobieramy dane.
 * @param {number} required.season - Numer sezonu, dla którego pobieramy dane.
 * @param {number} required.page - Numer strony, którą pobieramy.
 *
 * Interfejs reprezentujący pojedynczą postać w rankingu PvP sezonu.
 * @typedef {Object} PvpCharacter
 * @property {string} lastOnline - Data ostatniego logowania postaci.
 * @property {number} level - Poziom postaci.
 * @property {string} name - Nazwa postaci.
 * @property {string} rank - Ranga postaci.
 * @property {string} characterLink - Link do profilu postaci.
 * @property {string} profession - Nazwa profesji postaci.
 * @property {number} rankingPoints - Liczba punktów rankingowych postaci.
 * @property {number} winRatio - Współczynnik zwycięstw postaci.
 * @property {string} wpr - wygrane/przegrane/remis.
 *
 * @returns {Promise<SinglePageResult<PvpCharacter[]>>} Tablica reprezentujący wynik pobierania jednej strony z listą postaci PvP.
 */
export async function getSeasonPvpCharactersPage(required: {
    serverName: string;
    season: number;
    page: number;
}): Promise<SinglePageResult<PvpCharacter[]>> {
    try {
        const { serverName, season, page } = required;

        const { data } = await axios.get(
            composeUrl(
                `/ladder/players,${serverName},pvp?season=${season}&page=${page}`,
            ),
        );
        const $ = load(data);

        const selectors = PAGES['/ladder/players'].selectors;

        const tableRows = $(selectors.tableBody).find('tr');

        const pvpCharacters: PvpCharacter[] = new Array(tableRows.length);

        tableRows.each((rowIndex, row) => {
            const rowData = $(row).find('td');

            const rank = parseInt(rowData.eq(0).text(), 10);
            const name = rowData.eq(1).text().trim();
            const characterLink = rowData
                .eq(1)
                .find('a')
                .attr('href') as string;
            const level = parseInt(rowData.eq(2).text(), 10);
            const profession = rowData.eq(3).text().trim() as Profession;
            const rankingPoints = parseInt(rowData.eq(4).text());
            const winRatio = parseInt(
                rowData.eq(5).text().trim().slice(0, -1),
                10,
            );
            const wpr = rowData.eq(6).text().trim();
            const lastOnline = rowData.eq(7).text().trim();

            const parsedPvpCharacter = pvpCharacterSchema.parse({
                rank,
                name,
                characterLink,
                level,
                profession,
                rankingPoints,
                winRatio,
                wpr,
                lastOnline,
            });

            pvpCharacters[rowIndex] = parsedPvpCharacter;
        });

        return {
            success: true,
            data: pvpCharacters,
            page,
        };
    } catch (error) {
        const errorData = getErrorData(error);

        return {
            page: required.page,
            cause: errorData.cause,
            success: errorData.success,
            errorName: errorData.errorName,
        };
    }
}

/**
 * Pobiera pełną listę drabinki pvp dla określonego serwera i sezonu.
 * Funkcja pobiera strony pojedynczo i po każdej z nich wywołuje callback z danymi strony lub błędem.
 *
 * @param required.serverName Nazwa serwera, z którego pobierana jest lista postaci.
 * @param required.season Numer sezonu, dla którego pobierana jest lista postaci.
 * @param required.onPageSuccess Funkcja, która zostanie wykonana po pobraniu każdej strony z listy postaci.
 *                               Przyjmuje dwa argumenty: dane strony (tablica postaci) oraz numer bieżącej strony.
 * @param required.onPageError Funkcja, która zostanie wykonana w przypadku błędu podczas pobierania strony.
 *                             Przyjmuje dwa argumenty: dane błędu oraz numer bieżącej strony.
 * @param options.delayBetweenPagesInMs Opcjonalny parametr określający opóźnienie (w milisekundach) pomiędzy kolejnymi
 *                                      zapytaniami do serwera. Domyślnie ustawione na wartość DEFAULT_REQUEST_DELAY_IN_MS.
 * @returns Obiekt zawierający informacje o pobranych stronach oraz łącznej liczbie postaci.
 */
export async function getSeasonPvpCharacters(
    required: {
        serverName: string;
        season: number;
        onPageSuccess: (
            pageData: PvpCharacter[],
            currentPage: number,
        ) => Promise<void> | void;
        onPageError: (
            errorData: ErrorData,
            currentPage: number,
        ) => Promise<void> | void;
    },
    options: { delayBetweenPagesInMs: number | undefined } = {
        delayBetweenPagesInMs: DEFAULT_REQUEST_DELAY_IN_MS,
    },
): Promise<PaginationResult> {
    try {
        const { serverName, season, onPageSuccess, onPageError } = required;

        const { data } = await axios.get(
            composeUrl(
                `/ladder/players,${serverName},pvp?season=${season}&page=1`,
            ),
        );
        const $ = load(data);

        const selectors = PAGES['/ladder/players/pvp'].selectors;

        let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10);
        let currentPage: number = 1;

        while (currentPage <= numberOfPages) {
            if (options.delayBetweenPagesInMs !== undefined) {
                await delay(options.delayBetweenPagesInMs);
            }

            const result = await getSeasonPvpCharactersPage({
                serverName,
                page: currentPage,
                season,
            });

            if (result.success) {
                onPageSuccess(result.data, result.page);
            } else {
                onPageError(
                    {
                        cause: result.cause,
                        errorName: result.errorName,
                        success: result.success,
                    },
                    result.page,
                );
            }

            currentPage++;
        }

        return {
            success: true,
            totalPages: numberOfPages,
        };
    } catch (error) {
        const errorData = getErrorData(error);

        return errorData;
    }
}
