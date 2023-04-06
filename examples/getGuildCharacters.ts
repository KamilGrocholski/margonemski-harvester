import { getGuildCharacters } from 'margonemski-harvester'
;(async () => {
    const result = await getGuildCharacters({
        serverName: 'tempest',
        guildId: 2615,
    })

    if (result.success) {
        console.log(result.data)
    } else {
        console.error({
            cause: result.cause,
            errorName: result.errorName,
        })
    }
})()

import {
    type GuildCharacter,
    guildCharacterSchema,
    guildCharactersSchema,
} from 'margonemski-harvester'

const character: GuildCharacter = {
    rank: 1,
    name: 'Łowcomir Kazrek',
    level: 93,
    profession: 'Łowca',
    ph: 1332,
    characterLink: '/profile/view,7218282#char_467968,tempest',
    role: 'Virtuti Margonemi',
}

const list: GuildCharacter[] = [character, character, character]

const parsedCharacter = guildCharacterSchema.parse(character)

const parsedList = guildCharactersSchema.parse(list)
