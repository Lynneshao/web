import { describe, expect, it } from 'vitest'
import { defineIcon, iconRegistry } from './index'

describe('@kweaver-web/icons', () => {
  it('registers icons in the shared registry', () => {
    const initialSize = iconRegistry.length
    const icon = defineIcon({
      name: 'test-icon',
      source: '<svg />',
      kind: 'svg',
    })

    expect(icon).toEqual({
      name: 'test-icon',
      source: '<svg />',
      kind: 'svg',
    })
    expect(iconRegistry[initialSize]).toBe(icon)
  })
})
