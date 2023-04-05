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
