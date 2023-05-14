import axios from "axios";
import { load } from "cheerio";
import { z } from "zod";
import { DEFAULT_REQUEST_DELAY_IN_MS, PAGES, Profession } from "../constants";
import { ErrorData, getErrorData, PaginationResult, SinglePageResult } from "../errors-and-results";
import { composeUrl, delay, schemes } from "../utils";

export type CharacterRow = z.output<typeof characterRowSchema>;
export type CharactersLadder = z.output<typeof charactersLadderSchema>;

export const characterRowSchema = z.object({
  rank: schemes.rank,
  name: schemes.name,
  level: schemes.level,
  profession: schemes.profession,
  ph: schemes.ph,
  lastOnline: schemes.lastOnline,
  characterLink: schemes.characterLink,
});

export const charactersLadderSchema = z.array(characterRowSchema);

/**
 * Pobiera pojedynczą stronę listy postaci dla podanego serwera.
 */
export async function getServerCharactersLadderPage(required: {
  serverName: string;
  page: number;
}): Promise<SinglePageResult<CharactersLadder>> {
  try {
    const { serverName, page } = required;

    const { data } = await axios.get(
      composeUrl(`/ladder/players,${serverName}?page=${page}`),
    );
    const $ = load(data);

    const selectors = PAGES["/ladder/players"].selectors;

    const tableRows = $(selectors.tableBody).find("tr");

    const charactersLadder: CharactersLadder = new Array(tableRows.length);

    tableRows.each((rowIndex, row) => {
      const rowData = $(row).find("td");

      const rank = parseInt(rowData.eq(0).text(), 10);
      const name = rowData.eq(1).text().trim();
      const characterLink = rowData.eq(1).find("a").attr("href") as string;
      const level = parseInt(rowData.eq(2).text(), 10);
      const profession = rowData.eq(3).text().trim() as Profession;
      const ph = parseInt(rowData.eq(4).text());
      const lastOnline = rowData.eq(5).text().trim();

      const parsedCharacter = characterRowSchema.parse({
        rank,
        name,
        characterLink,
        level,
        profession,
        ph,
        lastOnline,
      });

      charactersLadder[rowIndex] = parsedCharacter;
    });

    return {
      success: true,
      data: charactersLadder,
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
 * Pobiera stronę po stronie wszystkie postacie z drabinki dla danego serwera.
 */
export async function getServerCharactersLadder(
  required: {
    serverName: string;
    onPageSuccess: (
      pageData: CharactersLadder,
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
    const { serverName, onPageSuccess, onPageError } = required;

    const { data } = await axios.get(
      composeUrl(`/ladder/players,${serverName}?page=1`),
    );
    const $ = load(data);

    const selectors = PAGES["/ladder/players"].selectors;

    let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10);
    let currentPage: number = 1;

    while (currentPage <= numberOfPages) {
      if (options.delayBetweenPagesInMs) {
        await delay(options.delayBetweenPagesInMs);
      }

      const result = await getServerCharactersLadderPage({
        serverName,
        page: currentPage,
      });

      if (result.success) {
        onPageSuccess(result.data, result.page);
      } else {
        onPageError(
          {
            errorName: result.errorName,
            cause: result.cause,
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
