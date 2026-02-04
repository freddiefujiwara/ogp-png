import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import * as api from '../services/api'

vi.mock('../services/api')

describe('App.vue integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all main components', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent({ name: 'AppHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'OgpForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'OgpDisplay' }).exists()).toBe(true)
  })

  it('completes the full flow: input -> create -> display -> download', async () => {
    const base64Data = 'test-data'
    api.fetchOgpImage.mockResolvedValueOnce({ png: base64Data })

    const wrapper = mount(App)

    // Input text
    const textarea = wrapper.find('textarea')
    await textarea.setValue('my ogp text')

    // Click create
    const createButton = wrapper.find('button')
    await createButton.trigger('click')

    // Wait for API and UI update
    await vi.waitFor(() => {
      if (!wrapper.find('img').exists()) throw new Error('Image not found')
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(`data:image/png;base64,${base64Data}`)

    // Download
    const downloadButton = wrapper.find('.download-btn')
    const link = {
      href: '',
      download: '',
      click: vi.fn()
    }
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(link)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})

    await downloadButton.trigger('click')

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(link.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })
})
