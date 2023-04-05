import { getServersStatistics } from '../src'
;(async () => {
    const result = await getServersStatistics()

    if (result.success) {
        console.log(result.data)
    } else {
        console.error({
            cause: result.cause,
            errorName: result.errorName,
        })
    }
})()
