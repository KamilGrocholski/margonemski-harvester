import { getServerCharactersLadderPage } from '../scrapers/server-characters-ladder'

describe('server-characters-ladder-page', () => {
    it('should not throw', async () => {
        const result = await getServerCharactersLadderPage({
            serverName: 'tempest',
            page: 1,
        })

        expect(() => result).not.toThrow()
    })
})
