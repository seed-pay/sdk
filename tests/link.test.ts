import { describe, expect, test } from 'bun:test'

import { createIntent, toLink } from '../src'

const intent = createIntent({
  recipient: '0x1111111111111111111111111111111111111111',
  asset: 'arbitrum.usdc',
  amount: '10000000',
})

describe('Utils', () => {
  test('Build query string without url', () => {
    const result = toLink(intent, null, null)

    expect(result.startsWith('?')).toBe(true)
    expect(Object.fromEntries(new URLSearchParams(result))).toEqual(intent)
  })

  test('Build URL with query params', () => {
    const result = new URL(toLink(intent, null, 'https://example.com'))

    expect(result.origin).toBe('https://example.com')
    expect(result.searchParams.get('id')).toBe(intent.id)
    expect(result.searchParams.get('asset')).toBe(intent.asset)
    expect(result.searchParams.get('amount')).toBe(intent.amount)
    expect(result.searchParams.get('recipient')).toBe(intent.recipient)
  })

  test('Preserve existing query params', () => {
    const result = new URL(
      toLink(intent, null, 'https://example.com?theme=dark')
    )

    expect(result.searchParams.get('theme')).toBe('dark')
    expect(result.searchParams.get('id')).toBe(intent.id)
  })

  test('Override existing query params', () => {
    const result = new URL(
      toLink(intent, null, 'https://example.com?amount=100')
    )

    expect(result.searchParams.get('amount')).toBe(intent.amount)
  })

  test('Include additional params', () => {
    const result = toLink(intent, { method: 'solana.sol' })

    expect(new URLSearchParams(result).get('method')).toBe('solana.sol')
  })

  test('Exclude undefined params', () => {
    const result = toLink(intent, { method: undefined, label: '' })

    expect(new URLSearchParams(result).has('method')).toBe(false)
    expect(new URLSearchParams(result).has('label')).toBe(false)
  })
})
