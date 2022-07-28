# lex62ts ![Build Status](https://github.com/nkoehring/lex62ts/actions/workflows/ci.yml/badge.svg) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
Fast, [lexicographic](https://en.wikipedia.org/wiki/Lexicographical_order) base62 encode and decode

# Installation
```sh
# using npm
npm i --save lex62ts
# or using yarn
yarn add -D lex62ts
```

# Design notes
 * ideas from http://www.zanopha.com/docs/elen.pdf
 * lexigraphical order: A < Z < a < z < 0 < 9
 * ensures lexicographical order by appending an alphabetic prefix (based on number of digits).
 * `decode` will only work with base64 numbers that have an expected prefix (alphabetic prefix appended to ensure lexigraphic order).
 * `encode` should work with any safe positive integer (and zero) as long as it is not _very_ large ~> 1e90 (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

# Typescript

This library is written in and therefore fully supports Typescript. The commonjs module is compiled for Node16 and tested with Node14, 16 and 18.

# Usage
##### encode
```ts
import { encode } from 'lex62ts'

encode(0) // 'A0'
encode(1) // 'A1'
encode(9) // 'A9'
encode(10) // 'AA'
encode(35) // 'AZ'
encode(36) // 'Aa'
encode(61) // 'Az'
encode(62) // 'B10'
encode(123) // 'B1z'
encode(3843) // 'Bzz'
encode(3844) // 'C100'
encode(238327) // 'Czzz'

// errors
encode('yo')
// throws [Error: 'encode: invalid number (not an integer)']
encode(-10)
// throws [Error: 'encode: unsupported number (must be a positive integer or zero)']
encode(1e90)
// throws [Error: 'encode: unsupported number (too large)']
```

##### decode
* decode only works w/ base62 numbers which follow the format outputted by encode.
```js
import { decode } from 'lex62ts'

decode('A0') // 0
decode('A1') // 1
decode('A9') // 9
decode('AA') // 10
decode('AZ') // 35
decode('Aa') // 36
decode('Az') // 61
decode('B10') // 62
decode('B1z') // 123
decode('Bzz') // 3843
decode('C100') // 3844
decode('Czzz') // 238327

// errors
decode('A*')
// throws [Error: 'decode: invalid string ("A*" not base62)']
decode('B0')
// throws [Error: 'decode: unsupported number (unexpected prefix)']
decode('B00')
// throws [Error: 'decode: unsupported number (unexpected zero)']
decode('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
// throws [Error: 'decode: unsupported number (too large)']
```

# License
MIT
