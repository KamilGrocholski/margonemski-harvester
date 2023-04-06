import { getGlobalStatistics } from 'margonemski-harvester'
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

import {
    type GlobalStatistics,
    globalStatisticsSchema,
} from 'margonemski-harvester'

const globalStatistics: GlobalStatistics = {
    characters: '758.3 tys.',
    newAccounts: '415',
    players: '200.9 tys.',
    recordOnline: '17 695',
    online: '5 169',
}

const parsedGlobalStatistics = globalStatisticsSchema.parse(globalStatistics)
