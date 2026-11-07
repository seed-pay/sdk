import { describe, expect, test } from 'bun:test'

import { buildUrl, createIntent } from '../src'

const intent = createIntent({
  recipient: '0x1111111111111111111111111111111111111111',
  asset: 'arbitrum.usdc',
  amount: '0.2',
})

describe('Url', () => {
  test('Build query string without url', () => {
    const result = buildUrl(intent)

    expect(result.startsWith('?')).toBe(true)
    expect(Object.fromEntries(new URLSearchParams(result))).toEqual(intent)
  })

  test('Build URL with query params', () => {
    const result = new URL(buildUrl(intent, 'https://example.com'))

    expect(result.origin).toBe('https://example.com')
    expect(result.searchParams.get('id')).toBe(intent.id)
    expect(result.searchParams.get('asset')).toBe(intent.asset)
    expect(result.searchParams.get('amount')).toBe(intent.amount)
    expect(result.searchParams.get('recipient')).toBe(intent.recipient)
  })

  test('Preserve existing query params', () => {
    const result = new URL(buildUrl(intent, 'https://example.com?theme=dark'))

    expect(result.searchParams.get('theme')).toBe('dark')
    expect(result.searchParams.get('id')).toBe(intent.id)
  })

  test('Override existing query params', () => {
    const result = new URL(buildUrl(intent, 'https://example.com?amount=100'))

    expect(result.searchParams.get('amount')).toBe(intent.amount)
  })

  test('Include additional params', () => {
    const result = buildUrl({ ...intent, theme: 'dark' })

    expect(new URLSearchParams(result).get('theme')).toBe('dark')
  })

  test('Exclude undefined params', () => {
    const result = buildUrl({ ...intent, affiliate: undefined, empty: '' })

    expect(new URLSearchParams(result).has('affiliate')).toBe(false)
    expect(new URLSearchParams(result).has('empty')).toBe(false)
  })
})
