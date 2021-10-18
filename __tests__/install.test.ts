import {install} from '../src/install'

test('Install latest', async () => {
    process.env["INPUT_WRANGLERVERSION"] = ''
    await install()
})

test('Install specific version', async () => {
    process.env["INPUT_WRANGLERVERSION"] = '1.19.3'
    await install()
})

test('Install bad', async () => {
    process.env["INPUT_WRANGLERVERSION"] = '-'
    expect(install()).rejects.toThrow('Error installing wrangler: ')
})