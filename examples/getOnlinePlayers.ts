import { getOnlinePlayers } from 'margonemski-harvester'
;(async () => {
    const result = await getOnlinePlayers()

    if (result.success) {
        console.log(result.data)
    } else {
        console.error({
            cause: result.cause,
            errorName: result.errorName,
        })
    }
})()
