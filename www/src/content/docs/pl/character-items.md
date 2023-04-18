---
title: Przedmioty postaci
---

## Pobieranie

```ts
import { getCharacterItems } from 'margonemski-harvester'
;(async () => {
    const result = await getCharacterItems({
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
import {
    type Item,
    type ItemSet,
    itemSchema,
    itemsSetSchema,
} from 'margonemski-harvester'

const item: Item = {
    name: 'Korona z jadeitu',
    id: '827290617',
    hid: '08aea3e3777fcd0ce6313afc94ce8587af155d55ec1c5e554c30256bb6f67253',
    icon: 'hel/helm454.gif',
    cl: 15,
    pr: 52044,
    prc: 'zl',
    loc: 'z',
    tpl: 36856,
    stat: 'amount=3;cansplit=1;capacity=50;created=1637928227;expires=1638313200;opis=Możesz go wymienić u Madam Anraz na rynku w Ithan.[br][br]Czarny Weekend #YEAR# r.;permbound;rarity=legendary',
    enhancementPoints: 2720,
}

const itemsSet: ItemSet = {
    '827290617': item,
}

const parsedItem = itemSchema.parse(item)

const parsedItemsSet = itemsSetSchema.parse(itemsSet)
```
