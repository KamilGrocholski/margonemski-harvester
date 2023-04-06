---
title: Postacie online
---

## Pobieranie

```ts
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
```

## Walidacja i parsowanie

Pomyślna walidacja i parsowanie są wymagane do zwrócenia obiektu zawierającego pobrane dane, dlatego nie ma potrzeby ich ponownego wykonywania.

```ts
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
```
