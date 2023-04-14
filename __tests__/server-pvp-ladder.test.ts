import { getSeasonPvpCharactersPage } from '../src/scrapers/server-pvp-ladder'

describe('server-season-pvp-ladder-page', () => {
    it('should not throw, success', async () => {
        const season = 5
        const page = 1
        const result = await getSeasonPvpCharactersPage({
            serverName: 'Tempest',
            season,
            page,
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
            page,
        })

        expect(() => result).not.toThrow()
        expect(result.success).toBe(false)
        expect(result.page).toBe(page)
    })
})
