---
title: Ranking otchłani
---

## Pobieranie wszystkich stron

```ts
import {
    type PvpCharacter,
    getSeasonPvpCharacters,
} from 'margonemski-harvester'
;(async () => {
    const ladder: PvpCharacter[] = []
    const successPages: number[] = []
    const errorPages: number[] = []

    const result = await getSeasonPvpCharacters({
        serverName: 'tempest',
        season: 5,
        onPageSuccess(pageData, currentPage) {
            ladder.push(...pageData)
            successPages.push(currentPage)
        },
        onPageError(errorData, currentPage) {
            console.error(errorData)
            errorPages.push(currentPage)
        },
    })

    if (result.success) {
        console.log({
            totalPages: result.totalPages,
        })
    } else {
        console.error({
            cause: result.cause,
            errorName: result.errorName,
        })
    }
})()
```

## Pobieranie jeden strony

```ts
import { getSeasonPvpCharactersPage } from 'margonemski-harvester'
;(async () => {
    const result = await getSeasonPvpCharactersPage({
        serverName: 'tempest',
        season: 5,
        page: 1,
    })

    if (result.success) {
        console.log(result.data)
    } else {
        console.error(result.cause)
    }
})()
```

## Walidacja i parsowanie

Pomyślna walidacja i parsowanie są wymagane do zwrócenia obiektu zawierającego pobrane dane, dlatego nie ma potrzeby ich ponownego wykonywania.

```ts
import {
    type PvpCharacter,
    pvpCharacterSchema,
    pvpCharactersSchema,
} from 'margonemski-harvester'

const pvpCharacter: PvpCharacter = {
    rank: 1,
    name: 'Łowcomir Kazrek',
    level: 93,
    profession: 'Łowca',
    lastOnline: '2 dni temu',
    winRatio: 25.12,
    wpr: '23 / 11 / 0',
    rankingPoints: 3200,
    characterLink: '/profile/view,7218282#char_467968,tempest',
}

const ladder: PvpCharacter[] = [pvpCharacter, pvpCharacter, pvpCharacter]

const parsedPvpCharacter = pvpCharacterSchema.parse(pvpCharacter)

const parsedLadder = pvpCharactersSchema.parse(ladder)
```
