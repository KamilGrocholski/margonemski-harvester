import { type ErrorData } from '../src'
import {
    getSeasonPvpCharacters,
    getSeasonPvpCharactersPage
} from '../src/scrapers/server-pvp-ladder'

describe('server-season-pvp-ladder-page', () => {
    it('should not throw, success', async () => {
        const season = 5
        const page = 1
        const result = await getSeasonPvpCharactersPage({
            serverName: 'Tempest',
            season,
            page
        })

        expect(() => result).not.toThrow()
        expect(result.success).toBe(true)
        expect(result.page).toBe(page)
    })

    it('should not throw, error', async () => {
        const season = 5
        const page = 1
        const invalidServerName = 'qwewqeqweqweqweqwewqewq'
        const result = await getSeasonPvpCharactersPage({
            serverName: invalidServerName,
            season,
            page
        })

        expect(() => result).not.toThrow()
        expect(result.success).toBe(false)
        expect(result.page).toBe(page)
    })
})

describe('server-guilds-ladder: partial', () => {
    const serverName = 'tempest'
    const season = 5
    const delayInMs = 120
    const maxPageIndexToTest = 20

    it('should not throw, success', async () => {
        const errors: { error: ErrorData; page: number }[] = []

        const result = new Promise((_, reject) => {
            try {
                getSeasonPvpCharacters(
                    {
                        serverName,
                        season,
                        onPageSuccess: ({ currentPage }) => {
                            if (currentPage >= maxPageIndexToTest) {
                                throw reject()
                            }
                        },
                        onPageError: ({ errorData, currentPage }) => {
                            if (currentPage >= maxPageIndexToTest) {
                                throw reject()
                            }
                            errors.push({
                                error: errorData,
                                page: currentPage
                            })
                        }
                    },
                    {
                        delayBetweenPagesInMs: delayInMs
                    }
                )
            } catch (err) {
                // it should do nothing
            }
        })

        console.log(errors)
        expect(() => result).not.toThrow()
        expect(errors.length).toBe(0)
    })
})
