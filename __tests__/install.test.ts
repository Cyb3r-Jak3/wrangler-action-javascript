import {install} from '../src/install'

test('Install latest', async () => {
    await install('')
})

test('Install latest', async () => {
    await install('1.19.3')
})

test('Install bad', async () => {
    expect(install('-1')).rejects.toThrow('Error installing wrangler: ')
})