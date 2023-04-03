import { type Page, BASE_URL, DEFAULT_REQUEST_DELAY_IN_MS } from './constants'

export function composeUrl(
    page: Page,
    baseURL = BASE_URL
): `${typeof BASE_URL}${Page}` {
    return `${baseURL}${page}`
}

export const delay = (timeInMs: number = DEFAULT_REQUEST_DELAY_IN_MS) =>
    new Promise((res) => setTimeout(res, timeInMs))
