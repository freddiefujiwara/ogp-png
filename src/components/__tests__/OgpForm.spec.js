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
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('66')
    expect(wrapper.find('button').text()).toBe('Create')
  })

  it('updates modelValue on input', async () => {
    const wrapper = mount(OgpForm, {
      props: {
        modelValue: '',
        isLoading: false
      }
    })
    await wrapper.find('textarea').setValue('test')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test'])
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
