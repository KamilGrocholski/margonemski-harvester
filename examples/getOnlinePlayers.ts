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

import {
    type ServersOnlinePlayers,
    onlinePlayersSchema,
} from 'margonemski-harvester'

const servers: ServersOnlinePlayers = [
    {
        serverName: 'Tempest',
        onlinePlayers: ['Ktoś', 'Thaomir Kazrek', 'Łowcosław Kazrekiewicz'],
    },
]

const onlinePlayers = onlinePlayersSchema.parse(servers)
