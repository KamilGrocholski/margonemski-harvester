import { getServerCharactersLadderPage } from '../src/scrapers/server-characters-ladder'

describe('server-characters-ladder-page', () => {
    it('should not throw, success', async () => {
        const page = 1
        const result = await getServerCharactersLadderPage({
            serverName: 'tempest',
            page,
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
            page,
        })

        expect(() => result).not.toThrow()
        expect(result.success).toBe(false)
        expect(result.page).toBe(page)
    })
})
