import { getGlobalStatistics } from '../scrapers/global-statistics'

describe('global-statistics', () => {
    it('should not throw', async () => {
        const result = await getGlobalStatistics()

        expect(() => result).not.toThrow()
    })
})
