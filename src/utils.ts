import { z } from 'zod'
import { type Page, BASE_URL, PROFESSIONS, Profession } from './constants'

export function composeUrl(
    page: Page,
    baseURL = BASE_URL
): `${typeof BASE_URL}${Page}` {
    return `${baseURL}${page}`
}

export const delay = (timeInMs: number) =>
    new Promise((res) => setTimeout(res, timeInMs))

export const schemes = {
    guildLink: z.string().min(1),
    characterLink: z.string().min(1),
    rank: z.number().int().min(1),
    level: z.number().int().nonnegative(),
    name: z.string().min(1),
    ph: z.number().int().nonnegative(),
    profession: z.string().refine(
        (value) => {
            return PROFESSIONS.includes(value as Profession)
        },
        {
            message:
                'Profesja jest nie poprawna albo została dodana nowa do Margonem i nie jest ona uwzględniona w liście `PROFESSIONS`.',
        }
    ) as z.ZodType<Profession>,
    lastOnline: z.string().min(1),
}
