<h1 align="center">
    <img src="https://micc.garmory-cdn.cloud/obrazki/npc/mez/npc249.gif"/>
    Dla margonemskich świrów
    <img src="https://micc.garmory-cdn.cloud/obrazki/npc/mez/npc249.gif"/>
</h1>

<p align="center">
  Można sobie pobierać dane z tej wspaniałej strony -> https://www.margonem.pl
</p>

<p align='center'>
    <img src="https://micc.garmory-cdn.cloud/obrazki/npc/kol/bazyliszek.gif" />
</p>
<p align='center'>
    Regulus, jak ja go nienawidzę...
</p>

## Ranking postaci serwera

```ts
import { CharactersLadder, getServerCharactersLadder } from '../src'
;(async () => {
    const ladder: CharactersLadder = []
    const successPages: number[] = []
    const errorPages: number[] = []

    const result = await getServerCharactersLadder({
        serverName: 'tempest',
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
            message: result.message,
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

## Informacje o koncie

```ts
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
```

## Globalne statystyki

```ts
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
```

## Lista postaci z klanu

```ts
import { getGuildCharacters } from '../src'
;(async () => {
    const result = await getGuildCharacters({
        serverName: 'tempest',
        guildId: 2615,
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
```

## Postacie online według serwera

```ts
import { getOnlinePlayers } from '../src'
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

## Statystyki wszystkich serwerów

```ts
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
```
