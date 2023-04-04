import { z } from 'zod'
import { load } from 'cheerio'
import axios from 'axios'
import { PAGES, Profession } from '../constants'
import { composeUrl, schemes } from '../utils'

export type GuildCharacter = z.output<typeof guildCharacterSchema>

export const guildCharacterSchema = z.object({
    rank: schemes.rank,
    name: schemes.name,
    characterLink: schemes.characterLink,
    level: schemes.level,
    profession: schemes.profession,
    ph: schemes.ph,
    role: z.string().min(1),
})

export const guildCharactersSchema = z.array(guildCharacterSchema)

export function validateGuildCharacters(
    guildCharacters: unknown
): GuildCharacter[] {
    const parsedGuildCharacters = guildCharactersSchema.parse(guildCharacters)

    return parsedGuildCharacters
}

export async function getGuildCharacters(
    serverName: string,
    page: number,
    options: {
        shouldValidate: boolean
    } = { shouldValidate: true }
): Promise<GuildCharacter[]> {
    const { data } = await axios.get(
        composeUrl(`/ladder/players,${serverName}?page=${page}`)
    )
    const $ = load(data)

    const selectors = PAGES['/ladder/players'].selectors

    const tableRows = $(selectors.tableBody).find('tr')

    const guildCharacters: GuildCharacter[] = []

    tableRows.each((_, row) => {
        const rowData = $(row).find('td')

        const rank = parseInt(rowData.eq(0).text(), 10)
        const name = rowData.eq(1).text().trim()
        const characterLink = rowData.eq(1).attr('href') as string
        const level = parseInt(rowData.eq(2).text(), 10)
        const profession = rowData.eq(3).text().trim() as Profession
        const ph = parseInt(rowData.eq(4).text())
        const role = rowData.eq(5).text().trim()

        guildCharacters.push({
            rank,
            name,
            characterLink,
            level,
            profession,
            ph,
            role,
        })
    })

    if (options.shouldValidate) {
        guildCharactersSchema.parse(guildCharacters)
    }

    return guildCharacters
}
