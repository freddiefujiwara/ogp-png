import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useOgp } from '../useOgp'
import * as api from '../../services/api'

vi.mock('../../services/api')

describe('useOgp composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default values', () => {
    const { inputText, isLoading, imageData, error } = useOgp()
    expect(inputText.value).toBe('')
    expect(isLoading.value).toBe(false)
    expect(imageData.value).toBe(null)
    expect(error.value).toBe(null)
  })

  it('generateImage sets imageData on success', async () => {
    const { inputText, imageData, generateImage, isLoading } = useOgp()
    inputText.value = 'hello'
    api.fetchOgpImage.mockResolvedValueOnce({ png: 'test-image' })

    const promise = generateImage()
    expect(isLoading.value).toBe(true)
    await promise

    expect(imageData.value).toBe('test-image')
    expect(isLoading.value).toBe(false)
    expect(api.fetchOgpImage).toHaveBeenCalledWith('hello')
  })

  it('generateImage truncates ASCII text to 66 characters', async () => {
    const { inputText, generateImage } = useOgp()
    const longText = 'a'.repeat(100)
    inputText.value = longText
    api.fetchOgpImage.mockResolvedValueOnce({ png: 'test-image' })

    await generateImage()

    expect(api.fetchOgpImage).toHaveBeenCalledWith('a'.repeat(66))
  })

  it('generateImage truncates full-width text to 40 characters', async () => {
    const { inputText, generateImage } = useOgp()
    const longText = 'あ'.repeat(50)
    inputText.value = longText
    api.fetchOgpImage.mockResolvedValueOnce({ png: 'test-image' })

    await generateImage()

    expect(api.fetchOgpImage).toHaveBeenCalledWith('あ'.repeat(40))
  })

  it('generateImage does nothing if inputText is empty', async () => {
    const { inputText, generateImage } = useOgp()
    inputText.value = '  '
    await generateImage()
    expect(api.fetchOgpImage).not.toHaveBeenCalled()
  })

  it('generateImage sets error on failure', async () => {
    const { inputText, error, generateImage } = useOgp()
    inputText.value = 'hello'
    api.fetchOgpImage.mockRejectedValueOnce(new Error('API Error'))

    await generateImage()

    expect(error.value).toBe('Failed to create image. Please try again.')
    expect(api.fetchOgpImage).toHaveBeenCalled()
  })

  it('downloadImage creates a link and clicks it', () => {
    const { imageData, downloadImage } = useOgp()
    imageData.value = 'test-data'

    const link = {
      href: '',
      download: '',
      click: vi.fn()
    }
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(link)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})

    downloadImage('test.png')

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(link.href).toBe('data:image/png;base64,test-data')
    expect(link.download).toBe('test.png')
    expect(appendChildSpy).toHaveBeenCalledWith(link)
    expect(link.click).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalledWith(link)

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('downloadImage does nothing if no imageData', () => {
    const { downloadImage } = useOgp()
    const createElementSpy = vi.spyOn(document, 'createElement')
    downloadImage()
    expect(createElementSpy).not.toHaveBeenCalled()
    createElementSpy.mockRestore()
  })
})
