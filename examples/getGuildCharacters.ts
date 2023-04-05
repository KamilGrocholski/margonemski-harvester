import { getGuildCharacters } from '../src'
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
