import { describe, it, expect } from 'vitest'
import { getWeightedLength, truncateToWeightedLength } from '../textUtils'

describe('textUtils', () => {
  describe('getWeightedLength', () => {
    it('returns 0 for empty string', () => {
      expect(getWeightedLength('')).toBe(0)
    })

    it('counts ASCII characters as 1', () => {
      expect(getWeightedLength('abc')).toBe(3)
    })

    it('counts full-width characters as 1.65', () => {
      // 40 full-width chars should be 66
      const fullWidthStr = 'あ'.repeat(40)
      expect(getWeightedLength(fullWidthStr)).toBeCloseTo(66)
    })

    it('handles mixed characters', () => {
      // 10 ASCII + 10 full-width = 10 + 16.5 = 26.5
      expect(getWeightedLength('a'.repeat(10) + 'あ'.repeat(10))).toBeCloseTo(26.5)
    })
  })

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
})
