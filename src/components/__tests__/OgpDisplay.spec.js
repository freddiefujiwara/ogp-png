import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OgpDisplay from '../OgpDisplay.vue'

describe('OgpDisplay.vue', () => {
  it('renders loading state', () => {
    const wrapper = mount(OgpDisplay, {
      props: {
        isLoading: true
      }
    })
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('renders error state', () => {
    const wrapper = mount(OgpDisplay, {
      props: {
        error: 'Failed message'
      }
    })
    expect(wrapper.find('.error').text()).toBe('Failed message')
  })

  it('renders image and download button', () => {
    const wrapper = mount(OgpDisplay, {
      props: {
        imageData: 'test-data',
        isLoading: false
      }
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('data:image/png;base64,test-data')
    expect(wrapper.find('.download-btn').exists()).toBe(true)
  })

  it('emits download on button click', async () => {
    const wrapper = mount(OgpDisplay, {
      props: {
        imageData: 'test-data',
        isLoading: false
      }
    })
    await wrapper.find('.download-btn').trigger('click')
    expect(wrapper.emitted('download')).toBeTruthy()
  })

  it('does not render image if loading', () => {
    const wrapper = mount(OgpDisplay, {
      props: {
        imageData: 'test-data',
        isLoading: true
      }
    })
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
