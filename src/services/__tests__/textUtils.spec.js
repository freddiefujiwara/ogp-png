import { describe, it, expect } from 'vitest'
import { truncateToWeightedLength, replaceNewlines } from '../textUtils'

describe('textUtils', () => {
  describe('truncateToWeightedLength', () => {
    it('truncates ASCII correctly', () => {
      expect(truncateToWeightedLength('a'.repeat(100), 66)).toBe('a'.repeat(66))
    })

    it('truncates full-width correctly', () => {
      expect(truncateToWeightedLength('あ'.repeat(100), 66)).toBe('あ'.repeat(40))
    })

    it('truncates mixed string correctly', () => {
      // 60 ASCII + 10 full-width = 60 + 16.5 = 76.5 > 66
      // should allow 60 ASCII and 3 full-width (60 + 4.95 = 64.95)
      // 4th full-width would be 64.95 + 1.65 = 66.6 > 66
      const str = 'a'.repeat(60) + 'あ'.repeat(10)
      const expected = 'a'.repeat(60) + 'あ'.repeat(3)
      expect(truncateToWeightedLength(str, 66)).toBe(expected)
    })
  })

  describe('replaceNewlines', () => {
    it('returns empty string for empty input', () => {
      expect(replaceNewlines('')).toBe('')
      expect(replaceNewlines(null)).toBe('')
    })

    it('replaces \n with space', () => {
      expect(replaceNewlines('hello\nworld')).toBe('hello world')
    })

    it('replaces \r\n with space', () => {
      expect(replaceNewlines('hello\r\nworld')).toBe('hello world')
    })

    it('replaces multiple newlines', () => {
      expect(replaceNewlines('line1\nline2\r\nline3')).toBe('line1 line2 line3')
    })
  })
})
