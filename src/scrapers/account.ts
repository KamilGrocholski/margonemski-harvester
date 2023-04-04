import { z } from 'zod'
import { Element, load } from 'cheerio'
import axios from 'axios'
import { Schemes, composeUrl, schemes } from '../utils'
import { PAGES, Profession } from '../constants'

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
    guildLink: schemes.guildLink,
    gender: schemes.gender,
    lastOnline: z.number().nonnegative(),
})

export const accountInfoSchema = z.object({
    accountName: z.string().min(1),
    role: z.string().min(1),
    accountCreatedAt: z.string().min(10),
    daysInGame: z.number().int().nonnegative(),
    forumPosts: z.number().int().nonnegative(),
    reputation: z.number().int(),
    reputationRatio: z.number(),
    deputy: z.string().min(1),
    public: z.array(profileCharacterSchema),
    private: z.array(profileCharacterSchema),
})

export async function getAccountInfo(
    required: {
        bucketId: number
        characterId: number
        serverName: string
    },
    options: { shouldValidate: boolean } = { shouldValidate: true }
): Promise<AccountInfo> {
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
    const daysInGame = parseInt($(selectors.daysInGame).text(), 10)
    const deputy = $(selectors.deputy).text().trim()
    const forumPosts = parseInt($(selectors.forumPosts).text(), 10)
    const reputation = parseInt($(selectors.reputation).text(), 10)
    const reputationRatio = parseFloat($(selectors.reputationRatio).text())

    const characterRow = selectors.charactersRow

    function getCharacter(character: Element): ProfileCharacter {
        const id = parseInt(
            $(character).find(characterRow.id).attr('value') as string,
            10
        )
        const name = $(character)
            .find(characterRow.name)
            .attr('value') as string
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
            profession,
        }
    }

    const charactersLists = $(selectors.listOfCharacters)

    let publicCharacters: ProfileCharacter[] = []
    let privateCharacters: ProfileCharacter[] = []

    charactersLists.each((_, list) => {
        const serverType = $(list).find('h3').text().trim()
        const charactersList = $(list).find('li')

        const characters: ProfileCharacter[] = []

        charactersList.each((_, element) => {
            const character = getCharacter(element)
            console.log(character)
            characters.push(character)
        })

        if (serverType === 'Światy publiczne') {
            publicCharacters = characters
        } else if (serverType === 'Światy prywatne') {
            privateCharacters = characters
        } else {
            throw new Error(
                'Niepoprawny typ świata, dostępne opcje to: `Światy publiczne`, `Światy prywatne`'
            )
        }
    })

    const accountInfo: AccountInfo = {
        accountName,
        role,
        accountCreatedAt,
        daysInGame,
        forumPosts,
        reputation,
        reputationRatio,
        deputy,
        public: publicCharacters,
        private: privateCharacters,
    }

    if (options.shouldValidate) {
        accountInfoSchema.parse(accountInfo)
    }

    return accountInfo
}