---
title: Statystyki serwerów
---

## Pobieranie

```ts
import { getServersStatistics } from 'margonemski-harvester'
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
```

## Walidacja i parsowanie

Pomyślna walidacja i parsowanie są wymagane do zwrócenia obiektu zawierającego pobrane dane, dlatego nie ma potrzeby ich ponownego wykonywania.

```ts
import {
    type ServerStatistics,
    serverStatisticsSchema,
    serversStatisticsSchema,
} from 'margonemski-harvester'

const serverStatistics: ServerStatistics = {
    maxOnline: 2313,
    name: 'Tempest',
    online: 241,
    total: 10000,
}

const servers: ServerStatistics[] = [
    serverStatistics,
    serverStatistics,
    serverStatistics,
]

const parsedServerStatistics = serverStatisticsSchema.parse(serverStatistics)

const parsedServers = serversStatisticsSchema.parse(servers)
```
