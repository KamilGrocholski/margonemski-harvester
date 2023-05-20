import axios from 'axios'
import { CheerioAPI, Element, load } from 'cheerio'
import { z } from 'zod'
import { PAGES, Profession, SERVER_TYPES } from '../constants'
import { getErrorData, InternalError, Result } from '../errors-and-results'
import { composeUrl, Schemes, schemes } from '../utils'

export type ProfileCharacter = z.output<typeof profileCharacterSchema>
export type AccountInfo = z.output<typeof accountInfoSchema>

export const profileCharacterSchema = z.object({
    id: z.number().int().nonnegative(),
    name: schemes.name,
    level: schemes.level,
    profession: schemes.profession,
    serverName: z.string(),
    guildName: z.string(),
    guildId: z.number().int().nonnegative(),
    guildLink: schemes.guildLink.or(z.literal('')),
    gender: schemes.gender,
    lastOnline: z.number().int().nonnegative()
})

export const accountInfoSchema = z.object({
    accountName: z.string(),
    role: z.string(),
    accountCreatedAt: schemes['DD-MM-YY'],
    lastLogin: schemes['HH:MM DD-MM-YY'],
    daysInGame: z.number().int().nonnegative(),
    forumPosts: z.number().int().nonnegative(),
    reputation: z.number().int(),
    reputationRatio: z.number(),
    deputy: z.string().min(1),
    public: z.array(profileCharacterSchema),
    private: z.array(profileCharacterSchema)
})

/**
 * Pobiera informacje o koncie na określonym serwerze.
 *
 * @param required - Obiekt zawierający wymagane parametry dla zapytania:
 *   - bucketId: ID WIADRAAA, w którym przechowywane są dane postaci.
 *   - characterId: ID postaci, dla której należy pobrać informacje o koncie.
 *   - serverName: Nazwa serwera, na którym znajduje się postać.
 */
export async function getAccountInfo(required: {
    bucketId: number
    characterId: number
    serverName: string
}): Promise<Result<AccountInfo>> {
    try {
        const { bucketId, characterId, serverName } = required
        const { data } = await axios.get(
            composeUrl(
                `/profile/view,${bucketId}#char_${characterId},${serverName}`
            )
        )

        const $ = load(data)

        const selectors = PAGES['/profile/view'].selectors

        const accountName = $(selectors.accountName).text().trim()
        const role = $(selectors.role).text().trim()
        const accountCreatedAt = $(selectors.accountCreatedAt).text().trim()

        let lastLogin = $(selectors.lastLogin).text().trim()
        lastLogin = lastLogin.slice(0, 5) + ' ' + lastLogin.slice(5)

        const daysInGame = parseInt($(selectors.daysInGame).text(), 10)
        const deputy = $(selectors.deputy).text().trim()
        const forumPosts = parseInt($(selectors.forumPosts).text(), 10)
        const reputation = parseInt($(selectors.reputation).text(), 10)
        const reputationRatio = parseFloat($(selectors.reputationRatio).text())

        const charactersLists = $(selectors.listOfCharacters)

        let publicCharacters: ProfileCharacter[] = []
        let privateCharacters: ProfileCharacter[] = []

        charactersLists.each((_, list) => {
            const serverType = $(list).find('h3').text().trim()
            const charactersList = $(list).find('li')

            const characters: ProfileCharacter[] = new Array(
                charactersList.length
            )

            charactersList.each((characterIndex, element) => {
                const character = getCharacter($, element)
                characters[characterIndex] = character
            })

            if (serverType === SERVER_TYPES.public) {
                publicCharacters = characters
            } else if (serverType === SERVER_TYPES.private) {
                privateCharacters = characters
            } else {
                throw new InternalError('Niepoprawny typ świata')
            }
        })

        const accountInfo: AccountInfo = {
            accountName,
            role,
            accountCreatedAt,
            lastLogin,
            daysInGame,
            forumPosts,
            reputation,
            reputationRatio,
            deputy,
            public: publicCharacters,
            private: privateCharacters
        }

        return {
            success: true,
            data: accountInfoSchema.parse(accountInfo)
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}

function getCharacter($: CheerioAPI, character: Element): ProfileCharacter {
    const characterRow = PAGES['/profile/view'].selectors.charactersRow

    const id = parseInt(
        $(character).find(characterRow.id).attr('value') as string,
        10
    )
    const name = $(character).find(characterRow.name).attr('value') as string
    const level = parseInt(
        $(character).find(characterRow.level).attr('value') as string,
        10
    )
    const profession = $(character)
        .find(characterRow.profession)
        .attr('value') as Profession
    const serverName = $(character)
        .find(characterRow.serverName)
        .attr('value') as string
    const guildName = $(character)
        .find(characterRow.guildName)
        .attr('value') as string
    const guildId = parseInt(
        $(character).find(characterRow.guildId).attr('value') as string,
        10
    )
    const guildLink = $(character)
        .find(characterRow.guildLink)
        .attr('value') as string
    const gender = $(character)
        .find(characterRow.gender)
        .attr('value') as Schemes['gender']
    const lastOnline = parseInt(
        $(character).find(characterRow.lastOnline).attr('value') as string,
        10
    )

    return {
        id,
        name,
        level,
        serverName,
        guildId,
        guildLink,
        lastOnline,
        gender,
        guildName,
        profession
    }
}
