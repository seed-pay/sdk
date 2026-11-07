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
  Intent,
  IntentParams,
  Quote,
} from '../src'

const baseURL = 'https://example.com'
const api = Seedpay(baseURL)

const params: IntentParams = {
  recipient: '0x1111111111111111111111111111111111111111',
  asset: 'arbitrum.usdc',
  amount: '0.2',
} as const

const intent: Intent = createIntent(params)

const depositParams: DepositParams = {
  refundRecipient: '0x2222222222222222222222222222222222222222',
  originAsset: 'arbitrum.usdc',
  intent,
} as const

const quote: Quote = { intent, amount: '0.2', time: 30 }

const deposit: Deposit = {
  ...depositParams,
  destination: params.recipient,
  amount: '0.2',
  deadline: '2026-11-08T15:25:00.000Z',
  status: DepositStatus.WAITING,
} as const

const prices: AssetInfo[] = [{ asset: 'arbitrum.usdc', usd: 1 }] as const

beforeAll(() => fetchMock.mockGlobal())
afterAll(() => fetchMock.unmockGlobal())

afterEach(() => {
  fetchMock.removeRoutes()
  fetchMock.clearHistory()
})

describe('Api', () => {
  test('Create intent', async () => {
    fetchMock.post(`${baseURL}/intents`, { data: intent })

    expect(await api.createIntent(params)).toEqual(intent)
  })

  test('Get assets', async () => {
    fetchMock.get(`${baseURL}/assets`, { data: prices })

    expect(await api.getAssets()).toEqual(prices)
  })

  test('Get quote', async () => {
    fetchMock.post(`${baseURL}/quotes`, { data: quote })

    expect(await api.createQuote(intent)).toEqual(quote)
  })

  test('Create deposit', async () => {
    fetchMock.post(`${baseURL}/deposits`, { data: deposit })

    expect(await api.createDeposit(depositParams)).toEqual(deposit)
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
    expect(api.getDeposit('ref')).rejects.toThrow()
  })

  test('Validate intent params', () => {
    const call = () => api.createIntent({ ...params, amount: 'invalid' })

    expect(call).toThrow(ErrorCode.INVALID_AMOUNT)
  })

  test('Validate quote params', () => {
    const call = () => api.createQuote({ ...intent, recipient: 'invalid' })

    expect(call).toThrow(ErrorCode.INVALID_RECIPIENT)
  })

  test('Validate deposit params', () => {
    const call = () =>
      api.createDeposit({ ...depositParams, originAsset: 'invalid' as Asset })

    expect(call).toThrow(ErrorCode.INVALID_ASSET)
  })
})
