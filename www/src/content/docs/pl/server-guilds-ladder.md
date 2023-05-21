---
title: Ranking klanów serwera
---

## Pobieranie wszystkich stron

```ts
import { type GuildsLadder, getServerGuildsLadder } from 'margonemski-harvester'
;(async () => {
    const ladder: GuildsLadder = []
    const successPages: number[] = []
    const errorPages: number[] = []

    const result = await getServerGuildsLadder({
        serverName: 'Tempest', // dla stron rankingu klanów nazwa świata musi być z wielkiej litery, 'https://www.margonem.pl/ladder/guilds,Tempest?page=2'
        onPageSuccess({ data, currentPage }) {
            ladder.push(...data)
            successPages.push(currentPage)
        },
        onPageError({ errorData, currentPage }) {
            console.error(errorData)
            errorPages.push(currentPage)
        }
    })

    if (result.success) {
        console.log({
            totalPages: result.totalPages
        })
    } else {
        console.error({
            cause: result.cause,
            errorName: result.errorName
        })
    }
})()
```

## Pobieranie jednej strony

```ts
import { getServerGuildsLadderPage } from 'margonemski-harvester'
;(async () => {
    const result = await getServerGuildsLadderPage({
        serverName: 'Tempest', // dla stron rankinu klanów nazwa świata musi być z wielkiej litery, 'https://www.margonem.pl/ladder/guilds,Tempest?page=2'
        page: 1
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
    GuildRow,
    GuildsLadder,
    guildRowSchema,
    guildsLadderSchema
} from 'margonemski-harvester'

const guild: GuildRow = {
    rank: 1,
    name: 'Wojownicy z Okolicy',
    level: 22,
    ph: 231313,
    players: 100,
    power: '9m',
    guildLink: '/guilds/view,Tempest,2615'
}

const ladder: GuildsLadder = [guild, guild, guild]

const parsedGuild = guildRowSchema.parse(guild)

const parsedLadder = guildsLadderSchema.parse(ladder)
```
