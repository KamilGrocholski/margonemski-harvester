import { ErrorData } from '../dist'
import {
    getServerCharactersLadder,
    getServerCharactersLadderPage
} from '../src/scrapers/server-characters-ladder'

describe('server-characters-ladder-page', () => {
    it('should not throw, success', async () => {
        const page = 1
        const result = await getServerCharactersLadderPage({
            serverName: 'Tempest',
            page
        })

        expect(() => result).not.toThrow()
        expect(result.success).toBe(true)
        expect(result.page).toBe(page)
    })

    it('should not throw, error', async () => {
        const page = 1
        const invalidServerName = 'qwewqeqweqweqweqwewqewq'
        const result = await getServerCharactersLadderPage({
            serverName: invalidServerName,
            page
        })

        expect(() => result).not.toThrow()
        expect(result.success).toBe(false)
        expect(result.page).toBe(page)
    })
})

describe('server-characters-ladder: partial', () => {
    const serverName = 'tempest'
    const delayInMs = 120
    const maxPageIndexToTest = 20

    it('should not throw, success', async () => {
        const errors: { error: ErrorData; page: number }[] = []

        const result = new Promise((_, reject) => {
            try {
                getServerCharactersLadder(
                    {
                        serverName,
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
