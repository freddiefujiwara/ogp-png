import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { truncateToWeightedLength, replaceNewlines } from '../textUtils'

// Property-based tests for the title-shaping helpers.
//
// Generator domains: titles are built from an alphabet covering ASCII,
// full-width Japanese, half-width katakana, astral characters (emoji),
// combining marks, and whitespace/control characters. Lone surrogates are
// deliberately not generated: text that reaches these helpers comes from a
// textarea, whose value is well-formed, and a lone surrogate already in
// the raw input cannot be repaired by truncation anyway. JSON-domain
// values (plus an object whose toString is not a function, which
// fc.jsonValue rarely produces in the field that matters) cover the
// non-string input family.

const titleChar = fc.constantFrom(
  'a', 'B', '7', ' ', 'あ', '漢', 'ア', 'ｱ', '🎉', '😀',
  'e', '́', 'か', '゙', '\n', '\r', '\t', 'é'
)
const title = fc.array(titleChar, { maxLength: 120 }).map((chars) => chars.join(''))

const limit = fc.oneof(
  fc.integer({ min: 0, max: 200 }),
  fc.double({ min: 0, max: 200, noNaN: true })
)

// The documented weighting: ASCII and half-width katakana weigh 1,
// everything else weighs 1.65, counted per UTF-16 code unit.
const weightOf = (s) => {
  let w = 0
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    w += (c >= 0x0000 && c <= 0x007f) || (c >= 0xff61 && c <= 0xff9f) ? 1 : 1.65
  }
  return w
}

const jsonDomainValue = fc.oneof(fc.jsonValue(), fc.constant({ toString: [] }))

describe('truncateToWeightedLength (properties)', () => {
  it('never throws and always returns a string', () => {
    fc.assert(
      fc.property(title, limit, (s, max) => {
        const result = truncateToWeightedLength(s, max)
        return typeof result === 'string'
      }),
      { numRuns: 100 }
    )
  })

  it('always returns a prefix of the input', () => {
    fc.assert(
      fc.property(title, limit, (s, max) => {
        return s.startsWith(truncateToWeightedLength(s, max))
      }),
      { numRuns: 100 }
    )
  })

  it('never exceeds the weighted limit', () => {
    fc.assert(
      fc.property(title, limit, (s, max) => {
        return weightOf(truncateToWeightedLength(s, max)) <= max + 0.0001
      }),
      { numRuns: 100 }
    )
  })

  it('returns the input unchanged when the limit covers its weight', () => {
    fc.assert(
      fc.property(title, (s) => {
        return truncateToWeightedLength(s, weightOf(s)) === s
      }),
      { numRuns: 100 }
    )
  })

  it('is idempotent', () => {
    fc.assert(
      fc.property(title, limit, (s, max) => {
        const once = truncateToWeightedLength(s, max)
        return truncateToWeightedLength(once, max) === once
      }),
      { numRuns: 100 }
    )
  })

  it('never introduces a lone surrogate and stays URI-encodable', () => {
    fc.assert(
      fc.property(title, limit, (s, max) => {
        // Throws URIError on a lone surrogate — exactly what the API
        // layer does with the truncated title.
        encodeURIComponent(truncateToWeightedLength(s, max))
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('never throws and returns a string for JSON-domain inputs', () => {
    fc.assert(
      fc.property(jsonDomainValue, limit, (value, max) => {
        const result = truncateToWeightedLength(value, max)
        return typeof result === 'string'
      }),
      { numRuns: 100 }
    )
  })
})

describe('replaceNewlines (properties)', () => {
  it('output contains no LF and the fold is idempotent', () => {
    fc.assert(
      fc.property(title, (s) => {
        const once = replaceNewlines(s)
        return !once.includes('\n') && replaceNewlines(once) === once
      }),
      { numRuns: 100 }
    )
  })

  it('never throws and returns a string for JSON-domain inputs', () => {
    fc.assert(
      fc.property(jsonDomainValue, (value) => {
        const result = replaceNewlines(value)
        return typeof result === 'string'
      }),
      { numRuns: 100 }
    )
  })
})
