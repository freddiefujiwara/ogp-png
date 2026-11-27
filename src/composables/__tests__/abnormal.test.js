import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useOgp } from '../useOgp'
import * as api from '../../services/api'

vi.mock('../../services/api')

// Abnormal-case tests for the composable boundary: the GAS /exec response
// is input from outside, so a deformed JSON body must land in the error
// state instead of silently blanking the result or wedging the flow.

describe('useOgp (abnormal inputs)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generateImage sets error when the response has no png', async () => {
    const { inputText, imageData, error, generateImage } = useOgp()
    inputText.value = 'hello'
    api.fetchOgpImage.mockResolvedValueOnce({})

    await generateImage()

    expect(error.value).toBe('Failed to create image. Please try again.')
    expect(imageData.value).toBe(null)
  })

  it('generateImage sets error when png is a number', async () => {
    const { inputText, imageData, error, generateImage } = useOgp()
    inputText.value = 'hello'
    api.fetchOgpImage.mockResolvedValueOnce({ png: 12345 })

    await generateImage()

    expect(error.value).toBe('Failed to create image. Please try again.')
    expect(imageData.value).toBe(null)
  })

  it('generateImage sets error when png is an object', async () => {
    const { inputText, imageData, error, generateImage } = useOgp()
    inputText.value = 'hello'
    api.fetchOgpImage.mockResolvedValueOnce({ png: { base64: 'x' } })

    await generateImage()

    expect(error.value).toBe('Failed to create image. Please try again.')
    expect(imageData.value).toBe(null)
  })

  it('generateImage sets error when the response itself is null', async () => {
    const { inputText, imageData, error, generateImage } = useOgp()
    inputText.value = 'hello'
    api.fetchOgpImage.mockResolvedValueOnce(null)

    await generateImage()

    expect(error.value).toBe('Failed to create image. Please try again.')
    expect(imageData.value).toBe(null)
  })

  it('generateImage ignores a non-string inputText instead of throwing', async () => {
    const { inputText, generateImage } = useOgp()
    inputText.value = 42

    await expect(generateImage()).resolves.not.toThrow()
    expect(api.fetchOgpImage).not.toHaveBeenCalled()
  })

  describe('downloadImage share fallback', () => {
    let createElementSpy
    let appendChildSpy
    let removeChildSpy
    let link

    beforeEach(() => {
      // Pretend to be a mobile device with Web Share support.
      Object.defineProperty(window.navigator, 'userAgentData', {
        value: { mobile: true },
        configurable: true
      })
      Object.defineProperty(window.navigator, 'share', {
        value: vi.fn().mockResolvedValue(undefined),
        configurable: true
      })
      Object.defineProperty(window.navigator, 'canShare', {
        value: vi.fn(() => true),
        configurable: true
      })

      link = { href: '', download: '', click: vi.fn() }
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(link)
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})
    })

    afterEach(() => {
      delete window.navigator.userAgentData
      delete window.navigator.share
      delete window.navigator.canShare
      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })

    it('does not download when sharing is cancelled', async () => {
      const { imageData, downloadImage } = useOgp()
      imageData.value = btoa('test image')
      window.navigator.share.mockRejectedValueOnce(new DOMException('Cancelled', 'AbortError'))

      await downloadImage()

      expect(window.navigator.share).toHaveBeenCalledOnce()
      expect(createElementSpy).not.toHaveBeenCalledWith('a')
      expect(link.click).not.toHaveBeenCalled()
    })

    it('still downloads after a non-abort share failure', async () => {
      const { imageData, downloadImage } = useOgp()
      imageData.value = btoa('test image')
      window.navigator.share.mockRejectedValueOnce(new DOMException('Failed', 'DataError'))

      await downloadImage('fallback.png')

      expect(window.navigator.share).toHaveBeenCalledOnce()
      expect(link.click).toHaveBeenCalledOnce()
      expect(link.download).toBe('fallback.png')
    })

    it('falls back to a link download when the image data is not valid base64', async () => {
      const { imageData, downloadImage } = useOgp()
      imageData.value = '!!!not-base64!!!'

      // atob() throws on this payload; the share path must not wedge the
      // download — the plain link download is the documented fallback.
      await expect(downloadImage()).resolves.not.toThrow()
      expect(link.click).toHaveBeenCalled()
      expect(link.href).toBe('data:image/png;base64,!!!not-base64!!!')
    })
  })
})
