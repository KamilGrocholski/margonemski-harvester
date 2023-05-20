import {
    getOnlinePlayers,
    getServersStatistics
} from '../src/scrapers/servers-statistics'

describe('servers-statistics', () => {
    describe('servers-statistics', () => {
        it('should not throw', async () => {
            const result = await getServersStatistics()

            expect(() => result).not.toThrow()
        })
    })

    describe('online players', () => {
        it('should not throw', async () => {
            const result = await getOnlinePlayers()

            expect(() => result).not.toThrow()
        })
    })
})
