import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from 'bun:test'
import fetchMock from 'fetch-mock'

import { createIntent, ErrorCode, QuoteStatus, Seedpay } from '../src'

import type {
  Asset,
  AssetInfo,
  Intent,
  IntentParams,
  Quote,
  QuoteParams,
  QuotePreview,
  QuotePreviewParams,
  QuoteRef,
} from '../src'

const baseURL = 'https://example.com'
const api = Seedpay(baseURL)

const params: IntentParams = {
  recipient: '0x1111111111111111111111111111111111111111',
  asset: 'arbitrum.usdc',
  amount: '10000000',
} as const

const intent: Intent = createIntent(params)

const quotePreviewParams: QuotePreviewParams = {
  originAsset: 'ethereum.eth',
  intent,
}

const quotePreview: QuotePreview = {
  intent,
  provider: 'near',
  originAsset: 'ethereum.eth',
  originAmount: '10000000',
  estimatedTime: 30,
}

const quoteParams: QuoteParams = {
  intent,
  originAsset: 'arbitrum.usdc',
  refundRecipient: '0x2222222222222222222222222222222222222222',
} as const

const quoteRef: QuoteRef = {
  ref: 'ref',
} as const

const quote: Quote = {
  ...quoteParams,
  provider: 'near',
  refundAmount: null,
  originAmount: '10000000',
  originReferences: [],
  depositDetails: params.recipient,
  depositedAmount: '2000',
  createdAt: '2026-11-08T15:25:00.000Z',
  deadlineAt: '2026-11-08T15:25:00.000Z',
  signature: 'signature',
  status: QuoteStatus.waiting,
} as const

const prices: AssetInfo[] = [{ asset: 'arbitrum.usdc', usd: 1 }] as const

beforeAll(() => fetchMock.mockGlobal())
afterAll(() => fetchMock.unmockGlobal())

afterEach(() => {
  fetchMock.removeRoutes()
  fetchMock.clearHistory()
})

describe('Api', () => {
  test('Get assets', async () => {
    fetchMock.get(`${baseURL}/assets`, { data: prices })

    expect(await api.getAssets()).toEqual(prices)
  })

  test('Create intent', async () => {
    fetchMock.post(`${baseURL}/intents`, { data: intent })

    expect(await api.createIntent(params)).toEqual(intent)
  })

  test('Get intent', async () => {
    fetchMock.get(`${baseURL}/intents/ref`, { data: intent })

    expect(await api.getIntent('ref')).toEqual(intent)
  })

  test('Get not found intent', async () => {
    fetchMock.get(`${baseURL}/intents/ref`, {
      body: { data: null },
      status: 404,
    })

    expect(await api.getIntent('ref')).toEqual(null)
  })

  test('Get intent throws on error', async () => {
    fetchMock.get(`${baseURL}/intents/ref`, { status: 502 })

    expect(api.getIntent('ref')).rejects.toThrow()
  })

  test('Preview quote', async () => {
    fetchMock.post(`${baseURL}/quotes/preview`, { data: quotePreview })

    expect(await api.previewQuote(quotePreviewParams)).toEqual(quotePreview)
  })

  test('Create quote', async () => {
    fetchMock.post(`${baseURL}/quotes`, { data: quoteRef })

    expect(await api.createQuote(quoteParams)).toEqual(quoteRef)
  })

  test('Get quote', async () => {
    fetchMock.get(`${baseURL}/quotes/ref`, { data: quote })

    expect(await api.getQuote('ref')).toEqual(quote)
  })

  test('Get not found quote', async () => {
    fetchMock.get(`${baseURL}/quotes/ref`, {
      body: { data: null },
      status: 404,
    })

    expect(await api.getQuote('ref')).toEqual(null)
  })

  test('Get quote throws on error', async () => {
    fetchMock.get(`${baseURL}/quotes/ref`, { status: 502 })

    expect(api.getQuote('ref')).rejects.toThrow()
  })

  test('Validate intent params', () => {
    const call = () => api.createIntent({ ...params, amount: 'invalid' })

    expect(call).toThrow(ErrorCode.INVALID_AMOUNT)
  })

  test('Validate quote preview params', () => {
    const invalid = { ...intent, amount: '90' }
    const call = () =>
      api.previewQuote({ ...quotePreviewParams, intent: invalid })

    expect(call).toThrow(ErrorCode.INVALID_INTENT)
  })

  test('Validate quote params', () => {
    const call = () =>
      api.createQuote({ ...quoteParams, originAsset: 'invalid' as Asset })

    expect(call).toThrow(ErrorCode.INVALID_ASSET)
  })
})
