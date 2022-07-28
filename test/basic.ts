import tap from 'tap'
import { encode, decode } from '../src'

tap.test('lex62', t => {
  const base10 = [
    0,
    62,
    100,
    1000,
    10000000,
    10000000000,
  ]
  const base62 = [
    'A0',
    'B10',
    'B1c',
    'BG8',
    'DfxSK',
    'FAukyoa',
  ]

  t.test('encode', t => {
    base10.forEach((value, index) => {
      t.equal(encode(value), base62[index], `should encode ${value}`)
    })

    t.test('errors', t => {
      const invalidBase10 = [
        'yo',
        -10,
        1.1,
        1e90
      ]
      const expectedErrors = [
        new Error('encode: invalid number (not an integer)'),
        new Error('encode: unsupported number (must be a positive integer or zero)'),
        new Error('encode: invalid number (not an integer)'),
        new Error('encode: unsupported number (too large)'),
      ]

      invalidBase10.forEach((value, index) => {
        t.throws(
          /* @ts-expect-error */
          () => encode(value),
          expectedErrors[index],
          `should throw error for ${value}`,
        )
      })
      t.end()
    })
    t.end()
  })

  t.test('decode', t => {
    base62.forEach((value, index) => {
      t.equal(decode(value), base10[index], `should decode ${value}`)
    })

    t.test('errors', t => {
      const invalidBase62 = [
        2,
        '.',
        'A,',
        'B0',
        'B00',
        'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'
      ]
      const expectedErrors = [
        new Error('decode: invalid string (not a string)'),
        new Error('decode: invalid string ("." not base62)'),
        new Error('decode: invalid string ("A," not base62)'),
        new Error('decode: unsupported number (unexpected prefix)'),
        new Error('decode: unsupported number (unexpected zero)'),
        new Error('decode: unsupported number (too large)'),
      ]

      invalidBase62.forEach((value, index) => {
        t.throws(
          /* @ts-expect-error */
          () => decode(value),
          expectedErrors[index],
          `should throw error for ${value}`,
        )
      })
      t.end()
    })

    t.end()
  })
  t.end()
})
