import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('App.vue', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('renders textarea and create button', () => {
    const wrapper = mount(App)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Create')
  })

  it('shows loading message when create button is clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => new Promise(resolve => setTimeout(() => resolve({ png: 'test' }), 100))
    })

    const wrapper = mount(App)
    await wrapper.find('textarea').setValue('hello')
    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Creating...')
  })

  it('displays image and download button after successful fetch', async () => {
    const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ png: base64Data })
    })

    const wrapper = mount(App)
    await wrapper.find('textarea').setValue('hello')
    await wrapper.find('button').trigger('click')

    // Wait for fetch to complete and UI to update
    await vi.waitFor(() => {
      if (!wrapper.find('img').exists()) throw new Error('Image not found')
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(`data:image/png;base64,${base64Data}`)
    expect(wrapper.find('.download-btn').exists()).toBe(true)
  })

  it('disables create button when textarea is empty', async () => {
    const wrapper = mount(App)
    const button = wrapper.find('button')

    expect(button.element.disabled).toBe(true)

    await wrapper.find('textarea').setValue('  ')
    expect(button.element.disabled).toBe(true)

    await wrapper.find('textarea').setValue('hello')
    expect(button.element.disabled).toBe(false)
  })
})
