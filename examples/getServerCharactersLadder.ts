import {
    type CharactersLadder,
    getServerCharactersLadder,
    getServerCharactersLadderPage,
    CharacterRow,
} from 'margonemski-harvester'
;(async () => {
    const result = await getServerCharactersLadderPage({
        serverName: 'tempest',
        page: 1,
    })

    if (result.success) {
        console.log(result.data)
    } else {
        console.error(result.cause)
    }
})()
;(async () => {
    const ladder: CharactersLadder = []
    const successPages: number[] = []
    const errorPages: number[] = []

    const result = await getServerCharactersLadder({
        serverName: 'tempest',
        onPageSuccess(pageData, currentPage) {
            ladder.push(...pageData)
            successPages.push(currentPage)
        },
        onPageError(errorData, currentPage) {
            console.error(errorData)
            errorPages.push(currentPage)
        },
    })

    if (result.success) {
        console.log({
            message: result.message,
            totalPages: result.totalPages,
        })
    } else {
        console.error({
            cause: result.cause,
            errorName: result.errorName,
        })
    }
})()

import {
    charactersLadderSchema,
    characterRowSchema,
} from 'margonemski-harvester'

const character: CharacterRow = {
    rank: 1,
    name: 'Łowcomir Kazrek',
    level: 93,
    profession: 'Łowca',
    lastOnline: '2 dni temu',
    ph: 1332,
    characterLink: '/profile/view,7218282#char_467968,tempest',
}

const ladder = [character, character, character]

const parsedCharacter = characterRowSchema.parse(character)

const parsedLadder = charactersLadderSchema.parse(ladder)
