import {run, set_creds} from '../src/main'

beforeEach(() => {
  Object.keys(process.env).forEach(function (key) {
    if (key.startsWith('CF_') || key.startsWith("INPUT_")) {
      delete process.env[key];
    }
  });
});

test('Empty Test', async () => {
  expect(set_creds).rejects.toThrow(
    'Need to have either an apiToken or apiKey with email set'
  )
})

test('Half Legacy Auth', async () => {
  process.env['INPUT_APITOKEN'] = '4'
  expect(set_creds).rejects.toThrow(
    'Need email set when using global api email'
  )
  expect(process.env['CF_API_TOKEN']).toEqual('4')
})

test('Legacy Auth', async () => {
  process.env['INPUT_APIKEY'] = '3'
  process.env['INPUT_EMAIL'] = 'admin@example.com'
  await set_creds()
  expect(process.env['CF_EMAIL']).toEqual('admin@example.com')
  expect(process.env['CF_API_KEY']).toEqual('3')
})