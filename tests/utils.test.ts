import { describe, expect, test } from 'bun:test'

import { formatUnits, parseUnits } from '../src'

describe('Utils', () => {
  test('Parse and format units', () => {
    const units = parseUnits('12.345', 3)

    expect(units).toBe('12345')
    expect(formatUnits(units, 3)).toBe('12.345')
  })

  test('Format whole units without a fractional part', () => {
    expect(formatUnits(parseUnits('7', 4), 4)).toBe('7')
  })
})
