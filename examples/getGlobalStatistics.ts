import { getGlobalStatistics } from '../src'
;(async () => {
    const result = await getGlobalStatistics()

    if (result.success) {
        console.log(result.data)
    } else {
        console.error({
            cause: result.cause,
            errorName: result.errorName,
        })
    }
})()
