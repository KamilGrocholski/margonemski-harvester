import { getCharacterItems } from '../src'

describe('character items', () => {
    it('should not throw', async () => {
        const items = await getCharacterItems({
            characterId: 202596,
            serverName: 'fobos',
        })

        expect(() => items).not.toThrow()
    })

  it('should throw', async () => {
    
  })
})


