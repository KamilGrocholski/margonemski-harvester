---
title: 'Jak to działa'
---
## Użyte biblioteki

-   Cheerio:
    [![GitHub](https://img.shields.io/github/stars/cheeriojs/cheerio.svg?style=social)](https://github.com/cheeriojs/cheerio)

-   Zod:
    [![GitHub](https://img.shields.io/github/stars/colinhacks/zod.svg?style=social)](https://github.com/colinhacks/zod)

- Axios: 
    [![Axios](https://img.shields.io/github/stars/cheeriojs/cheerio.svg?style=social)](https://github.com/axios/axios)

## Wyniki pobierania danych

<p>
Każda funkcja, zwraca obiekt w postaci jednego z poniższych typów.
</p>

### Główny typ wyniku funkcji pobierającej dane

```typescript
export type Result<T> = SuccessResult<T> | ErrorResult

export type SuccessResult<T> = {
    success: true
    data: T
}

export type ErrorResult = ErrorData

export type ErrorData = {
    success: false
    errorName: ErrorName
    cause: unknown
}
```

### Typ wyniku funkcji, która pobiera jedną stronę, np. tablicy

```typescript
export type PaginationResult = PaginationSuccessResult | PaginationErrorResult

export type PaginationSuccessResult = {
    success: true
    totalPages: number
}

export type PaginationErrorResult = {} & ErrorData

export type SinglePageResult<T> =
    | SinglePageSuccessResult<T>
    | SinglePageErrorResult

export type SinglePageSuccessResult<T> = {
    success: true
    data: T
    page: number
}

export type SinglePageErrorResult = {
    page: number
} & ErrorData
```
