import {run, set_creds} from '../src/main'

// test('Empty Test', async () => {
//   expect(run()).rejects.toThrow(
//     '::error::Need to have either an apitoken or apikey with email set'
//   )
// })

test('Empty Test', async () => {
  expect(set_creds).rejects.toThrow(
    'Need to have either an apitoken or apikey with email set'
  )
})

test('Half Legacy Auth', async () => {
  process.env['INPUT_APITOKEN'] = '4'
  expect(set_creds).rejects.toThrow(
    'Need email set when using global token'
  )
})
