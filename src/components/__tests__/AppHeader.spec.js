import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'

describe('AppHeader.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.find('h1').text()).toBe('OGP Image Creator')
  })
})
