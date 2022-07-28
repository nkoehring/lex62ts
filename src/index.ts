// Firepad lexicographic base62
// Based off ideas from http://www.zanopha.com/docs/elen.pdf
// Original by Tejesh Mehta (https://github.com/tjmehta/lex62)
// Updated and translated to Typescript by Norman Köhring (https://github.com/nkoehring/lex62.ts)

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const charMap: Record<string, number> = { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18, 'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25, 'Q': 26, 'R': 27, 'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33, 'Y': 34, 'Z': 35, 'a': 36, 'b': 37, 'c': 38, 'd': 39, 'e': 40, 'f': 41, 'g': 42, 'h': 43, 'i': 44, 'j': 45, 'k': 46, 'l': 47, 'm': 48, 'n': 49, 'o': 50, 'p': 51, 'q': 52, 'r': 53, 's': 54, 't': 55, 'u': 56, 'v': 57, 'w': 58, 'x': 59, 'y': 60, 'z': 61 }

// Prefix with length (starting at 'A' for length 1) to ensure the id's sort lexicographically.
function getPrefix (len: number, method: 'encode' | 'decode'): string {
  const index = len + 9
  if (index >= 62) throw new Error(`${method}: unsupported number (too large)`)
  return characters[index]
}

export function encode (base10: number): string {
  if (!Number.isSafeInteger(base10)) throw new Error('encode: invalid number (not a safe integer)')
  if (base10 < 0) throw new Error('encode: unsupported number (must be a positive integer or zero)')

  let result = base10 === 0 ? '0' : ''
  let digit: number

  while (base10 > 0) {
    digit = (base10 % characters.length)
    result = characters[digit] + result
    base10 -= digit
    base10 = base10 / characters.length
  }
  const prefix = getPrefix(result.length, 'encode')
  return prefix + result
}

export function decode (base62: string): number {
  // Ensure the revision has expected prefix and is not empty
  if (typeof base62 !== 'string') throw new Error('decode: invalid string (not a string)')

  let base62Char = base62[0]
  if (!(base62Char in charMap)) throw new Error(`decode: invalid string ("${base62}" not base62)`)

  const expectedPrefix = getPrefix(base62.length - 1, 'decode')
  if (base62Char !== expectedPrefix) throw new Error('decode: unsupported number (unexpected prefix)')
  if (base62[1] === '0' && expectedPrefix !== 'A') throw new Error('decode: unsupported number (unexpected zero)')

  let base10 = 0
  let base10Char: number

  for (let i = 1; i < base62.length; i++) {
    base10 *= characters.length
    base62Char = base62[i]
    if (!(base62Char in charMap)) throw new Error(`decode: invalid string ("${base62}" not base62)`)

    base10Char = charMap[base62Char]
    base10 += base10Char
  }
  return base10
}
