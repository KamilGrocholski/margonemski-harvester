import { getServerGuildsLadderPage } from '../scrapers/server-guilds-ladder'

describe('server-guilds-ladder-page', () => {
    it('should not throw', async () => {
        const result = await getServerGuildsLadderPage({
            serverName: 'tempest',
            page: 1,
        })

        expect(() => result).not.toThrow()
    })
})
