import {
    getGuildCharacters,
    guildCharacterSchema,
    type GuildCharacter,
} from '../src/scrapers/guild'

describe('guild', () => {
    it('should validate and return guild characters', async () => {
        const guildCharacters = await getGuildCharacters({
            serverName: 'Tempest',
            guildId: 2615,
        })
        expect(() => guildCharacters).not.toThrow()
    })

    it('should parse successfully using guildCharacterSchema', () => {
        const guildCharacter: GuildCharacter = {
            name: 'Thaomir Kazrek',
            level: 64,
            characterLink: '/profile/view,9327017#char_439176,Tempest',
            ph: 2311,
            profession: 'Wojownik',
            role: 'Virtutti margonemi',
            rank: 23,
        }

        expect(() => guildCharacterSchema.parse(guildCharacter)).not.toThrow()
    })

    it('should throw an error while parsing using guildCharacterSchema', () => {
        const guildCharacter: GuildCharacter = {
            name: 'Thaomir Kazrek',
            level: -2,
            characterLink: 'qweqw',
            ph: 2311,
            profession: 'Wojownik',
            role: 'Virtutti margonemi',
            rank: 23,
        }

        expect(() => guildCharacterSchema.parse(guildCharacter)).toThrow()
    })
})
