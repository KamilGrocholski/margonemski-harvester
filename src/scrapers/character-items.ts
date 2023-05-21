import axios from 'axios'
import { z } from 'zod'
import { BASE_GARMORY_CDN_URL, HASH_FUNCTION_DIVISOR } from '../constants'
import { getErrorData, type Result } from '../errors-and-results'

function getBucketId(characterId: number): number {
    return characterId % HASH_FUNCTION_DIVISOR
}

function composeUrlToCharacterItems(
    characterId: number,
    bucketId: number,
    serverName: string
): `${typeof BASE_GARMORY_CDN_URL}/${string}/${number}/${number}.json` {
    return `${BASE_GARMORY_CDN_URL}/${serverName}/${bucketId}/${characterId}.json`
}

export type Item = z.output<typeof itemSchema>
export type ItemsSet = z.output<typeof itemsSetSchema>
export type ItemsSetInput = z.input<typeof itemsSetSchema>
export type ItemInput = z.input<typeof itemSchema>

export const itemSchema = z.object({
    name: z.string(),
    id: z.string(),
    hid: z.string(),
    icon: z.string().endsWith('.gif'),
    cl: z.number().int().nonnegative(),
    pr: z.number().int(),
    prc: z.string(),
    loc: z.string(),
    tpl: z.number(),
    // stat: z.record(z.string().or(z.undefined())),
    enhancementPoints: z.number().positive().int().optional(),
    stat: z.string().transform((value) => {
        const split = value.split(';') as string[]
        const pairs: Record<string, string | undefined> = {}

        split.forEach((pair) => {
            const [key, value] = pair.split('=') as [string, string | undefined]

            pairs[key] = value
        })

        return pairs
    })
})

export const itemsSetSchema = z.record(itemSchema)

/**
 * Pobiera założone przedmioty postaci.
 * Jest to wrapper dla api margonem.
 */
export async function getCharacterItems(required: {
    serverName: string
    characterId: number
}): Promise<Result<ItemsSet>> {
    try {
        const { serverName, characterId } = required

        const bucketId = getBucketId(characterId)

        const { data } = await axios.get(
            composeUrlToCharacterItems(characterId, bucketId, serverName)
        )

        Object.keys(data).forEach((key) => {
            // add `id` to properties
            data[key].id = key

            // const stat = data[key].stat as string
            // const split = stat.split(';') as string[]
            // const pairs: Record<string, string | undefined> = {}
            //
            // split.forEach((pair) => {
            //     const [key, value] = pair.split('=') as [
            //         string,
            //         string | undefined,
            //     ]
            //
            //     pairs[key] = value
            // })
            //
            // data[key].stat = pairs
        })

        return {
            success: true,
            data: itemsSetSchema.parse(data)
        }
    } catch (error) {
        const errorData = getErrorData(error)

        return errorData
    }
}
