import { schemes } from '../src/utils'
import { PROFESSIONS } from '../src/constants'

describe('schemes', () => {
    describe('guildLink', () => {
        it('should accept valid guild links', () => {
            const validGuildLink = '/guilds/view,tempest,1234'
            expect(() => schemes.guildLink.parse(validGuildLink)).not.toThrow()
        })

        it('should reject invalid guild links', () => {
            const invalidGuildLink = '/characters/view,1234'
            expect(() => schemes.guildLink.parse(invalidGuildLink)).toThrow()
        })
    })

    describe('characterLink', () => {
        it('should accept valid character links', () => {
            const validCharacterLink =
                '/profile/view,9327017#char_439176,tempest'
            expect(() =>
                schemes.characterLink.parse(validCharacterLink)
            ).not.toThrow()
        })

        it('should reject invalid character links', () => {
            const invalidCharacterLink = '/guilds/view,1234'
            expect(() =>
                schemes.characterLink.parse(invalidCharacterLink)
            ).toThrow()
        })
    })

    describe('rank', () => {
        it('should accept positive integers', () => {
            const validRank = 1
            expect(() => schemes.rank.parse(validRank)).not.toThrow()
        })

        it('should reject negative integers', () => {
            const invalidRank = -1
            expect(() => schemes.rank.parse(invalidRank)).toThrow()
        })

        it('should reject non-integer numbers', () => {
            const invalidRank = 1.5
            expect(() => schemes.rank.parse(invalidRank)).toThrow()
        })
    })

    describe('level', () => {
        it('should accept non-negative integers', () => {
            const validLevel = 0
            expect(() => schemes.level.parse(validLevel)).not.toThrow()
        })

        it('should reject negative integers', () => {
            const invalidLevel = -1
            expect(() => schemes.level.parse(invalidLevel)).toThrow()
        })

        it('should reject non-integer numbers', () => {
            const invalidLevel = 1.5
            expect(() => schemes.level.parse(invalidLevel)).toThrow()
        })
    })

    describe('name', () => {
        it('should accept non-empty strings', () => {
            const validName = 'John Doe'
            expect(() => schemes.name.parse(validName)).not.toThrow()
        })

        it('should reject empty strings', () => {
            const invalidName = ''
            expect(() => schemes.name.parse(invalidName)).toThrow()
        })
    })

    describe('ph', () => {
        it('should accept non-negative integers', () => {
            const validPh = 0
            expect(() => schemes.ph.parse(validPh)).not.toThrow()
        })

        it('should reject negative integers', () => {
            const invalidPh = -1
            expect(() => schemes.ph.parse(invalidPh)).toThrow()
        })

        it('should reject non-integer numbers', () => {
            const invalidPh = 1.5
            expect(() => schemes.ph.parse(invalidPh)).toThrow()
        })
    })

    describe('profession', () => {
        it('should accept valid professions', () => {
            expect(() => {
                PROFESSIONS.map((profession) => {
                    schemes.profession.parse(profession)
                })
            }).not.toThrow()
        })

        it('should reject invalid professions', () => {
            expect(() => {
                schemes.profession.parse('niepoprawna profesja')
            }).toThrow()
        })
    })

    describe('lastOnline', () => {
        it('should accept valid lastOnline', () => {
            const validLastOnline = '2 dni temu'
            expect(() =>
                schemes.lastOnline.parse(validLastOnline)
            ).not.toThrow()
        })
        it('should reject invalid lastOnline', () => {
            const invalidLastOnline = ''
            expect(() => schemes.lastOnline.parse(invalidLastOnline)).toThrow()
        })
    })

    describe('gender', () => {
        it('should accept valid gender', () => {
            expect(() => {
                schemes.gender.parse('Kobieta')
                schemes.gender.parse('Mężczyzna')
            }).not.toThrow()
        })

        it('should reject invalid gender', () => {
            expect(() => {
                schemes.gender.parse('kobieta')
                schemes.gender.parse('mężczyzna')
                schemes.gender.parse('m')
                schemes.gender.parse('k')
            }).toThrow()
        })
    })

    describe('HH:MM format', () => {
        it('should accept valid format', () => {
            expect(() => {
                schemes['HH:MM'].parse('03:12')
            }).not.toThrow()
        })

        it('should reject invalid format', () => {
            expect(() => {
                schemes['HH:MM'].parse('1:11')
            }).toThrow()
        })
    })

    describe('HH:MM DD-MM-YY format', () => {
        it('should accept valid format', () => {
            expect(() => {
                schemes['HH:MM DD-MM-YY'].parse('03:12 12-03-2023')
            }).not.toThrow()
        })

        it('should reject invalid format', () => {
            expect(() => {
                schemes['HH:MM DD-MM-YY'].parse('3:12 12-03-2023')
            }).toThrow()
        })
    })
})
