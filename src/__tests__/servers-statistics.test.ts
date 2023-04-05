import { getServersStatistics } from '../scrapers/servers-statistics'

describe('servers-statistics', () => {
    it('should not throw', async () => {
        const result = await getServersStatistics()

        expect(() => result).not.toThrow()
    })
})
