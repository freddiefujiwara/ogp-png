import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OgpForm from '../OgpForm.vue'

describe('OgpForm.vue', () => {
  it('renders input and button', () => {
    const wrapper = mount(OgpForm, {
      props: {
        modelValue: '',
        isLoading: false
      }
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Create')
  })

  it('updates modelValue on input and enforces weighted limit', async () => {
    const wrapper = mount(OgpForm, {
      props: {
        modelValue: '',
        isLoading: false
      }
    })
    const textarea = wrapper.find('textarea')

    // ASCII limit
    await textarea.setValue('a'.repeat(100))
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['a'.repeat(66)])

    // Full-width limit
    await textarea.setValue('あ'.repeat(100))
    expect(wrapper.emitted('update:modelValue')[1]).toEqual(['あ'.repeat(40)])
  })

  it('replaces newlines with spaces', async () => {
    const wrapper = mount(OgpForm, {
      props: {
        modelValue: '',
        isLoading: false
      }
    })
    const textarea = wrapper.find('textarea')

    await textarea.setValue('line1\nline2\r\nline3')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['line1 line2 line3'])
    expect(textarea.element.value).toBe('line1 line2 line3')
  })

  it('emits submit on button click', async () => {
    const wrapper = mount(OgpForm, {
      props: {
        modelValue: 'test',
        isLoading: false
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('disables button when loading', () => {
    const wrapper = mount(OgpForm, {
      props: {
        modelValue: 'test',
        isLoading: true
      }
    })
    expect(wrapper.find('button').element.disabled).toBe(true)
    expect(wrapper.find('button').text()).toBe('Creating...')
  })

  it('disables button when input is empty', () => {
    const wrapper = mount(OgpForm, {
      props: {
        modelValue: '  ',
        isLoading: false
      }
    })
    expect(wrapper.find('button').element.disabled).toBe(true)
  })
})
