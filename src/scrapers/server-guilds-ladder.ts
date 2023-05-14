import axios from "axios";
import { load } from "cheerio";
import { z } from "zod";
import { DEFAULT_REQUEST_DELAY_IN_MS, PAGES } from "../constants";
import { ErrorData, getErrorData, PaginationResult, SinglePageResult } from "../errors-and-results";
import { composeUrl, delay, schemes } from "../utils";

export type GuildRow = z.output<typeof guildRowSchema>;
export type GuildsLadder = z.output<typeof guildsLadderSchema>;

export const guildRowSchema = z.object({
  power: z.string().min(1),
  players: z.number().int().nonnegative(),
  guildLink: schemes.guildLink,
  rank: schemes.rank,
  name: schemes.name,
  level: schemes.level,
  ph: schemes.ph,
});

export const guildsLadderSchema = z.array(guildRowSchema);

/**
 * Funkcja pobierająca jedną stronę rankingu klanu dla określonego serwera z gry.
 */
export async function getServerGuildsLadderPage(required: {
  serverName: string;
  page: number;
}): Promise<SinglePageResult<GuildsLadder>> {
  try {
    const { serverName, page } = required;

    const { data } = await axios.get(
      composeUrl(`/ladder/guilds,${serverName}?page=${page}`),
    );
    const $ = load(data);

    const selectors = PAGES["/ladder/guilds"].selectors;

    const tableRows = $(selectors.tableBody).find("tr");

    const guildsLadder: GuildsLadder = new Array(tableRows.length);

    tableRows.each((rowIndex, row) => {
      const rowData = $(row).find("td");

      const rank = parseInt(rowData.eq(0).text(), 10);
      const name = rowData.eq(1).text().trim();
      const guildLink = rowData.eq(1).find("a").attr("href") as string;
      const power = rowData.eq(2).text();
      const players = parseInt(rowData.eq(2).text(), 10);
      const level = parseInt(rowData.eq(2).text(), 10);
      const ph = parseInt(rowData.eq(4).text());

      const parsedGuildRow = guildRowSchema.parse({
        rank,
        name,
        guildLink,
        power,
        players,
        level,
        ph,
      });

      guildsLadder[rowIndex] = parsedGuildRow;
    });

    return {
      success: true,
      data: guildsLadder,
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
 * Pobiera pełną listę klanów dla określonego serwera. Funkcja pobiera strony pojedynczo i po każdej z nich wywołuje callback z danymi strony lub błędem.
 */
export async function getServerGuildsLadder(
  required: {
    serverName: string;
    onPageSuccess: (
      pageData: GuildsLadder,
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
    const { serverName, onPageError, onPageSuccess } = required;

    const { data } = await axios.get(
      composeUrl(`/ladder/guilds,${serverName}?page=1`),
    );
    const $ = load(data);

    const selectors = PAGES["/ladder/guilds"].selectors;

    let numberOfPages = parseInt($(selectors.numberOfPages).text(), 10);
    let currentPage: number = 1;

    while (currentPage <= numberOfPages) {
      if (options.delayBetweenPagesInMs !== undefined) {
        await delay(options.delayBetweenPagesInMs);
      }

      const result = await getServerGuildsLadderPage({
        serverName,
        page: currentPage,
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
