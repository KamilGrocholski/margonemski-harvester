import { getSeasonPvpCharactersPage } from '../scrapers/server-pvp-ladder'

describe('server-season-pvp-ladder-page', () => {
    it('should not throw', async () => {
        const result = await getSeasonPvpCharactersPage({
            serverName: 'tempest',
            season: 5,
            page: 1,
        })

        expect(() => result).not.toThrow()
    })
})
