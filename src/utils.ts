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

export const myRegex = {
    HH_MM: /^([01][0-9]|2[0-3]):[0-5][0-9]$/,
    DD_MM_YY: /^0?[1-9]|[12]\d|3[01]-^0?[1-9]|1[0-2]$-^\d{4}$/,
    'HH:MM DD-MM-YY':
        /^([01]\d|2[0-3]):([0-5]\d)\s(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
}

export type Schemes = {
    [Key in keyof typeof schemes]: z.output<(typeof schemes)[Key]>
}

export const schemes = {
    guildLink: z
        .string()
        .regex(/^\/guilds\/view,(\w+),(\d+)$/, 'Niepoprawny link do klanu'),
    characterLink: z
        .string()
        .regex(
            /^\/profile\/view,(\d+)#char_(\d+),(\w+)$/,
            'Niepoprawny link do postaci'
        ),
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
    'HH:MM': z.string().regex(myRegex.HH_MM, 'HH-MM niepoprawna'),
    'DD-MM-YY': z.string().regex(myRegex.DD_MM_YY, 'DD-MM-YY niepoprawny'),
    'HH:MM DD-MM-YY': z
        .string()
        .regex(
            new RegExp(myRegex['HH:MM DD-MM-YY']),
            'Niepoprawny format czasu i daty - `HH:MM DD-MM-YY`'
        ),
}
