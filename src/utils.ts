import { z } from 'zod'
import { type Page, BASE_URL, PROFESSIONS, type Profession } from './constants'

export function composeUrl(
    page: Page,
    baseURL = BASE_URL
): `${typeof BASE_URL}${Page}` {
    return `${baseURL}${page}`
}

export const delay = (timeInMs: number) =>
    new Promise((res) => setTimeout(res, timeInMs))

export type Schemes = {
    [Key in keyof typeof schemes]: z.output<(typeof schemes)[Key]>
}

export const schemes = {
    guildLink: z.string().startsWith('/guilds/view,').or(z.literal('')),
    characterLink: z.string().startsWith('/profile/view,'),
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
    gender: z.literal('Mężczyzna').or(z.literal('Kobieta')),
}
