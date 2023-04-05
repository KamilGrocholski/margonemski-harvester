import { getCharacterItems } from '../src/scrapers/character-items'
;(async () => {
    const result = await getCharacterItems({
        characterId: 202596,
        serverName: 'fobos',
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
