---
title: 'Informacje konta'
---

## Pobieranie

```ts
import { getAccountInfo } from 'margonemski-harvester'
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

## Walidacja i parsowanie

Pomyślna walidacja i parsowanie są wymagane do zwrócenia obiektu zawierającego pobrane dane, dlatego nie ma potrzeby ich ponownego wykonywania.

```ts
import { type AccountInfo, accountInfoSchema } from 'margonemski-harvester'

const accountInfo: AccountInfo = {
    accountName: 'Łowca głów z psk',
    daysInGame: 1231,
    deputy: 'Brak',
    forumPosts: 2,
    role: 'Gracz',
    reputation: -23,
    reputationRatio: -0.231,
    private: [],
    public: [
        {
            gender: 'Mężczyzna',
            guildId: 2615,
            guildName: 'Wojownicy z Okolicy',
            guildLink: '/guilds/view,tempest,2615',
            id: 467968,
            level: 93,
            lastOnline: 1680741042,
            name: 'Łowcomir Kazrek',
            profession: 'Łowca',
            serverName: 'Tempest',
        },
    ],
    accountCreatedAt: '16-03-2020',
    lastLogin: '14:45 06-04-2023',
}

const parsedAccountInfo = accountInfoSchema.parse(accountInfo)
```
