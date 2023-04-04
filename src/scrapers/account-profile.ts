import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { composeUrl, schemes } from '../utils'
import { PAGES } from '../constants'

export type ProfileCharacter = z.output<typeof profileCharacterSchema>
export type AccountInfo = z.output<typeof accountInfoSchema>

export const profileCharacterSchema = z.object({
    id: z.number().int().nonnegative(),
    characterName: schemes.name,
    level: schemes.level,
    profession: schemes.profession,
    server: z.string().min(1),
    guildName: z.string().min(1),
    guildId: z.number().int().nonnegative(),
    guildLink: schemes.guildLink,
    gender: z.literal('Kobieta').or(z.literal('Mężczyzna')),
    lastOnline: schemes.lastOnline,
})

export const accountInfoSchema = z.object({
    accountName: z.string().min(1),
    role: z.string().min(1),
    accountCreatedAt: z.string().min(10),
    daysInGame: z.number().int().nonnegative(),
    forumPosts: z.number().int().nonnegative(),
    reputation: z.number().int(),
    reputationRatio: z.number(),
})

export async function getAccountInfo(
    bucketId: number,
    characterId: number,
    serverName: string,
    options: { shouldValidate: boolean } = { shouldValidate: true }
): Promise<AccountInfo> {
    const { data } = await axios.get(
        composeUrl(
            `/profile/view,${bucketId}#char_${characterId},${serverName}`
        )
    )

    const $ = load(data)

    const selectors = PAGES['/profile/view'].selectors

    const accountName = $(selectors.accountName).text()
    const role = $(selectors.role).text()
    const accountCreatedAt = $(selectors.accountCreatedAt).text()
    const daysInGame = parseInt($(selectors.daysInGame).text(), 10)
    const forumPosts = parseInt($(selectors.forumPosts).text(), 10)
    const reputation = parseInt($(selectors.reputation).text(), 10)
    const reputationRatio = parseFloat($(selectors.reputationRatio).text())

    const accountInfo: AccountInfo = {
        accountName,
        role,
        accountCreatedAt,
        daysInGame,
        forumPosts,
        reputation,
        reputationRatio,
    }

    if (options.shouldValidate) {
        accountInfoSchema.parse(accountInfo)
    }

    return accountInfo
}
