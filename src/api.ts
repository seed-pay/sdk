import { ofetch } from 'ofetch'
import * as v from 'valibot'

import { API_BASE_URL } from './constants'
import {
  depositParamsSchema,
  intentParamsSchema,
  quoteParamsSchema,
} from './types'

import type { FetchOptions } from 'ofetch'
import type {
  ApiResponse,
  AssetInfo,
  Deposit,
  DepositParams,
  DepositRef,
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

    createIntent: (params: IntentParams): Promise<Intent> => {
      v.parse(intentParamsSchema, params)
      return request<Intent>('/intents', { method: 'POST', body: params })
    },

    getIntent: (id: string): Promise<Intent | null> =>
      request<Intent>(`/intents/${id}`).catch((error) => {
        if (error.status === 404) return null
        throw error
      }),

    createQuote: (params: QuoteParams): Promise<Quote> => {
      v.parse(quoteParamsSchema, params)
      return request<Quote>('/quotes', { method: 'POST', body: params })
    },

    createDeposit: (params: DepositParams): Promise<DepositRef> => {
      v.parse(depositParamsSchema, params)
      return request<DepositRef>('/deposits', { method: 'POST', body: params })
    },

    getDeposit: (ref: string): Promise<Deposit | null> =>
      request<Deposit | null>(`/deposits/${ref}`).catch((error) => {
        if (error.status === 404) return null
        throw error
      }),
  }
}
