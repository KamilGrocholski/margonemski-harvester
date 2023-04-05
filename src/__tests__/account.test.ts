import { getGuildCharacters } from '../scrapers/guild'

describe('account', () => {
    it('should return account info', async () => {
        const guildCharacters = await getGuildCharacters({
            serverName: 'tempest',
            guildId: 2615,
        })
        expect(() => guildCharacters).not.toThrow()
    })
})
