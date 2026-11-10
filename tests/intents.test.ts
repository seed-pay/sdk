import { describe, expect, test } from 'bun:test'
import { v7, validate, version } from 'uuid'

import { createIntent, ErrorCode, isIntent, type Asset } from '../src'

const params = {
  asset: 'arbitrum.usdc',
  amount: '0.2',
  recipient: '0x1111111111111111111111111111111111111111',
  affiliate: '@affiliate',
} as const

describe('Intent', () => {
  test('Create intent', () => {
    const intent = createIntent(params)

    expect(validate(intent.id)).toBe(true)
    expect(version(intent.id)).toBe(7)
    expect(intent.asset).toBe(params.asset)
    expect(intent.amount).toBe(params.amount)
    expect(intent.recipient).toBe(params.recipient)
    expect(isIntent(intent)).toBe(true)
  })

  test('Create intent generates unique ids', () => {
    const first = createIntent(params)
    const second = createIntent(params)

    expect(isIntent(first)).toBe(true)
    expect(isIntent(second)).toBe(true)
    expect(first.id).not.toBe(second.id)
    expect(validate(first.id)).toBe(true)
    expect(validate(second.id)).toBe(true)
  })

  test('Create intent normalizes amount', () => {
    const intent = createIntent(params)

    expect(isIntent({ ...intent, amount: '0.20' })).toBe(true)
    expect(isIntent({ ...intent, amount: '0.200000' })).toBe(true)
  })

  test('Reject invalid amount', () => {
    const amounts = ['-1', 'abc', '1e3', '', '0.1234567']

    amounts.forEach((amount) => {
      const call = () => createIntent({ ...params, amount })
      expect(call).toThrow(ErrorCode.INVALID_AMOUNT)
    })
  })

  test('Reject invalid asset', () => {
    const asset = 'invalid.asset' as Asset
    const call = () => createIntent({ ...params, asset })

    expect(call).toThrow(ErrorCode.INVALID_ASSET)
  })

  test('Reject invalid recipient', () => {
    const recipient = 'invalid'
    const call = () => createIntent({ ...params, recipient })

    expect(call).toThrow(ErrorCode.INVALID_RECIPIENT)
  })

  test('Reject modified id', () => {
    const intent = { ...createIntent(params), id: v7() }

    expect(isIntent(intent)).toBe(false)
    expect(isIntent({ ...createIntent(params), id: 'x' })).toBe(false)
  })

  test('Reject modified amount', () => {
    const intent = createIntent(params)
    const invalidIntent = { ...intent, amount: '0.3' }

    expect(isIntent(invalidIntent)).toBe(false)
  })

  test('Reject modified asset', () => {
    const intent = createIntent(params)
    const asset: Asset = 'ethereum.usdc'
    const invalidIntent = { ...intent, asset }

    expect(isIntent(invalidIntent)).toBe(false)
  })

  test('Reject modified recipient', () => {
    const recipient = '0x2222222222222222222222222222222222222222'
    const intent = createIntent(params)
    const invalidIntent = { ...intent, recipient }

    expect(isIntent(invalidIntent)).toBe(false)
  })
})
