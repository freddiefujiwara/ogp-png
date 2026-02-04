import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchOgpImage } from '../api'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('api service', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('fetchOgpImage returns data on success', async () => {
    const mockData = { png: 'base64data' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const result = await fetchOgpImage('test')
    expect(result).toEqual(mockData)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('t=test'))
  })

  it('fetchOgpImage throws error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false
    })

    await expect(fetchOgpImage('test')).rejects.toThrow('Network response was not ok')
  })
})
