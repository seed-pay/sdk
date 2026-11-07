import { ofetch, type FetchOptions } from 'ofetch'
import * as v from 'valibot'

import { API_BASE_URL } from './constants'
import {
  depositParamsSchema,
  intentParamsSchema,
  intentSchema,
  type AssetInfo,
} from './schemas'

import type {
  ApiResponse,
  Deposit,
  DepositParams,
  Intent,
  IntentParams,
  Quote,
  QuoteParams,
} from './types'

export const Seedpay = (baseURL: string = API_BASE_URL) => {
  const api = ofetch.create({ baseURL })

  const request = <T>(url: string, options?: FetchOptions<'json'>) =>
    api<ApiResponse<T>>(url, options).then(({ data }) => data)

  return {
    getAssets: (): Promise<AssetInfo[]> => request<AssetInfo[]>('/assets'),

    createIntent: (params: IntentParams) => {
      v.parse(intentParamsSchema, params)
      return request<Intent>('/intents', { method: 'POST', body: params })
    },

    createQuote: (params: QuoteParams) => {
      v.parse(intentSchema, params)
      return request<Quote>('/quotes', { method: 'POST', body: params })
    },

    createDeposit: (params: DepositParams) => {
      v.parse(depositParamsSchema, params)
      return request<Deposit>('/deposits', { method: 'POST', body: params })
    },

    getDeposit: (ref: string) => request<Deposit | null>(`/deposits/${ref}`),
  }
}
