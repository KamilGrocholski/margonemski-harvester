---
title: 'Globalne statystyki'
description: 'Docs intro'
---

## Pobieranie

```ts
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
```

## Walidacja i parsowanie

Pomyślna walidacja i parsowanie są wymagane do zwrócenia obiektu zawierającego pobrane dane, dlatego nie ma potrzeby ich ponownego wykonywania.

```ts
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
```
