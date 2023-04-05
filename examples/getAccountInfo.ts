import { getAccountInfo } from '../src'
;(async () => {
    const result = await getAccountInfo({
        bucketId: 7218282,
        characterId: 467968,
        serverName: 'tempest',
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
