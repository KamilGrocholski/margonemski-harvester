import { getServerGuildsLadderPage } from '../src/scrapers/server-guilds-ladder'

describe('server-guilds-ladder-page', () => {
    it('should not throw, success', async () => {
        const page = 1
        const result = await getServerGuildsLadderPage({
            serverName: 'tempest',
            page,
        })

        expect(() => result).not.toThrow()
        expect(result.page).toBe(page)
        expect(result.success).toBe(true)
    })

    it('should not throw, error', async () => {
        const page = 1
        const invalidServerName = 'qwewqeqweqweqweqwewqewq'
        const result = await getServerGuildsLadderPage({
            serverName: invalidServerName,
            page,
        })

        expect(() => result).not.toThrow()
        expect(result.success).toBe(false)
        expect(result.page).toBe(page)
    })
})
