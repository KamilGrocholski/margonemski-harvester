import { getGuildCharacters } from '../src/scrapers/guild'

describe('account', () => {
    it('should return account info', async () => {
        const guildCharacters = await getGuildCharacters({
            serverName: 'Tempest',
            guildId: 2615,
        })
        expect(() => guildCharacters).not.toThrow()
    })
})
