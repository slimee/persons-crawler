const urlStore = require('../services/stores/newUrlStore')

describe('redis url store', () => {
  test('should init, add and peek values', async () => {
    await urlStore.init('one')
    await urlStore.add('two')
    await urlStore.add('two')
    await urlStore.add('three')
    await urlStore.add('two')
    await urlStore.add('three')
    await urlStore.add('three')

    const actualResults = []
    actualResults.push(await urlStore.peek())
    actualResults.push(await urlStore.peek())
    actualResults.push(await urlStore.peek())
    actualResults.push(await urlStore.peek())
    actualResults.push(await urlStore.peek())
    actualResults.push(await urlStore.peek())

    const expectedResults = ['one', 'two', 'three', null, null, null]

    expect(actualResults.sort()).toStrictEqual(expectedResults.sort())
  })
})
