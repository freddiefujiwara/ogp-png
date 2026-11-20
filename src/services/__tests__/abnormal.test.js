import { describe, it, expect, vi, beforeEach } from 'vitest'
import { truncateToWeightedLength, replaceNewlines } from '../textUtils'
import { fetchOgpImage } from '../api'

// Abnormal-case tests: deformed inputs reaching the text-shaping layer.
// The title text is typed/pasted by the user (arbitrary Unicode) and the
// helpers are also fed values whose shapes are not guaranteed, so every
// case asserts graceful behaviour (no throw, sane fallback), not merely
// "does not crash".

const hasLoneSurrogate = (s) => {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    if (c >= 0xd800 && c <= 0xdbff) {
      if (i + 1 >= s.length) return true
      const next = s.charCodeAt(i + 1)
      if (next < 0xdc00 || next > 0xdfff) return true
      i++
    } else if (c >= 0xdc00 && c <= 0xdfff) {
      return true
    }
  }
  return false
}

describe('truncateToWeightedLength (abnormal inputs)', () => {
  it('does not split a surrogate pair at the weight boundary', () => {
    // 39 full-width chars weigh 64.35; one emoji (a surrogate pair) weighs
    // 3.3, which does not fit in the remaining 1.65, so it must be dropped
    // whole instead of emitting half of it.
    const result = truncateToWeightedLength('あ'.repeat(39) + '🎉'.repeat(5), 66)
    expect(result).toBe('あ'.repeat(39))
    expect(hasLoneSurrogate(result)).toBe(false)
    // The truncated text is fed to encodeURIComponent in the API layer;
    // a lone surrogate makes it throw URIError and generation fail.
    expect(() => encodeURIComponent(result)).not.toThrow()
  })

  it('never leaves a lone surrogate when the budget cuts through an emoji', () => {
    // Budget 68 fits 20 whole emoji (66) plus the first half of the 21st
    // (67.65) but not the whole pair (69.3).
    const result = truncateToWeightedLength('🎉'.repeat(30), 68)
    expect(result).toBe('🎉'.repeat(20))
    expect(hasLoneSurrogate(result)).toBe(false)
    expect(() => encodeURIComponent(result)).not.toThrow()
  })

  it('returns empty for an array of numbers instead of throwing', () => {
    expect(truncateToWeightedLength([1, 2, 3], 66)).toBe('')
  })

  it('returns empty for an array of strings instead of joining elements', () => {
    expect(truncateToWeightedLength(['a', 'b'], 66)).toBe('')
  })

  it('returns empty for an object with a length property instead of throwing', () => {
    expect(truncateToWeightedLength({ length: 2, 0: 'a' }, 66)).toBe('')
  })

  it('returns empty for number, boolean, null and undefined inputs', () => {
    expect(truncateToWeightedLength(42, 66)).toBe('')
    expect(truncateToWeightedLength(true, 66)).toBe('')
    expect(truncateToWeightedLength(null, 66)).toBe('')
    expect(truncateToWeightedLength(undefined, 66)).toBe('')
  })

  it('returns empty for an object whose toString is not a function', () => {
    expect(truncateToWeightedLength({ toString: [] }, 66)).toBe('')
  })

  it('does not leak past the limit when maxWeight is a numeric string', () => {
    // A string limit must never let the whole text through: "3" used to be
    // concatenated with the epsilon and compared as 30.0001.
    expect(truncateToWeightedLength('hello world', '3')).toBe('')
  })

  it('does not leak past the limit when maxWeight is a boolean', () => {
    expect(truncateToWeightedLength('hello', true)).toBe('')
  })

  it('returns empty for a NaN maxWeight', () => {
    expect(truncateToWeightedLength('hello', NaN)).toBe('')
  })

  it('handles a very long title', () => {
    expect(truncateToWeightedLength('あ'.repeat(10000), 66)).toBe('あ'.repeat(40))
  })
})

describe('replaceNewlines (abnormal inputs)', () => {
  it('returns empty for a number instead of throwing', () => {
    expect(replaceNewlines(42)).toBe('')
  })

  it('returns empty for a boolean instead of throwing', () => {
    expect(replaceNewlines(true)).toBe('')
  })

  it('returns empty for an array instead of throwing', () => {
    expect(replaceNewlines(['a\nb'])).toBe('')
  })

  it('returns empty for a plain object instead of throwing', () => {
    expect(replaceNewlines({})).toBe('')
  })

  it('returns empty for an object whose toString is not a function', () => {
    expect(replaceNewlines({ toString: [] })).toBe('')
  })

  it('folds every newline variant in a mixed title', () => {
    expect(replaceNewlines('x\ny\r\nz')).toBe('x y z')
  })
})

describe('fetchOgpImage (abnormal inputs)', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    mockFetch.mockReset()
    global.fetch = mockFetch
  })

  it('encodes Japanese text and emoji into the request URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ png: 'base64data' })
    })

    await fetchOgpImage('タイトル 🎉')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`t=${encodeURIComponent('タイトル 🎉')}`)
    )
  })
})
