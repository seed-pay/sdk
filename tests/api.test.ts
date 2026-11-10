import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from 'bun:test'
import fetchMock from 'fetch-mock'

import { createIntent, DepositStatus, ErrorCode, Seedpay } from '../src'

import type {
  Asset,
  AssetInfo,
  Deposit,
  DepositParams,
  DepositRef,
  Intent,
  IntentParams,
  Quote,
  QuoteParams,
} from '../src'

const baseURL = 'https://example.com'
const api = Seedpay(baseURL)

const params: IntentParams = {
  recipient: '0x1111111111111111111111111111111111111111',
  asset: 'arbitrum.usdc',
  amount: '0.2',
} as const

const intent: Intent = createIntent(params)

const quoteParams: QuoteParams = {
  originAsset: 'ethereum.eth',
  intent,
}

const quote: Quote = {
  intent,
  provider: 'near',
  originAsset: 'ethereum.eth',
  originAmount: '0.2',
  estimatedTime: 30,
}

const depositParams: DepositParams = {
  intent,
  originAsset: 'arbitrum.usdc',
  refundRecipient: '0x2222222222222222222222222222222222222222',
} as const

const depositRef: DepositRef = {
  ref: 'ref',
} as const

const deposit: Deposit = {
  ...depositParams,
  provider: 'near',
  refundAmount: null,
  originAmount: '0.2',
  originReference: null,
  depositDetails: params.recipient,
  depositedAmount: '0.2',
  createdAt: '2026-11-08T15:25:00.000Z',
  deadlineAt: '2026-11-08T15:25:00.000Z',
  signature: 'signature',
  status: DepositStatus.waiting,
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

  test('Get quote', async () => {
    fetchMock.post(`${baseURL}/quotes`, { data: quote })

    expect(await api.createQuote(quoteParams)).toEqual(quote)
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

  test('Create deposit', async () => {
    fetchMock.post(`${baseURL}/deposits`, { data: depositRef })

    expect(await api.createDeposit(depositParams)).toEqual(depositRef)
  })

  test('Get deposit', async () => {
    fetchMock.get(`${baseURL}/deposits/ref`, { data: deposit })

    expect(await api.getDeposit('ref')).toEqual(deposit)
  })

  test('Get not found deposit', async () => {
    fetchMock.get(`${baseURL}/deposits/ref`, {
      body: { data: null },
      status: 404,
    })

    expect(await api.getDeposit('ref')).toEqual(null)
  })

  test('Get deposit throws on error', async () => {
    fetchMock.get(`${baseURL}/deposits/ref`, { status: 502 })

    expect(api.getDeposit('ref')).rejects.toThrow()
  })

  test('Validate intent params', () => {
    const call = () => api.createIntent({ ...params, amount: 'invalid' })

    expect(call).toThrow(ErrorCode.INVALID_AMOUNT)
  })

  test('Validate quote params', () => {
    const invalid = { ...intent, amount: '90' }
    const call = () => api.createQuote({ ...quoteParams, intent: invalid })

    expect(call).toThrow(ErrorCode.INVALID_INTENT)
  })

  test('Validate deposit params', () => {
    const call = () =>
      api.createDeposit({ ...depositParams, originAsset: 'invalid' as Asset })

    expect(call).toThrow(ErrorCode.INVALID_ASSET)
  })
})
