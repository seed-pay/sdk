import { ofetch } from 'ofetch'
import * as v from 'valibot'

import { API_BASE_URL } from './constants'
import {
  intentParamsSchema,
  quoteParamsSchema,
  quotePreviewParamsSchema,
} from './types'

import type { FetchOptions } from 'ofetch'
import type {
  ApiResponse,
  AssetInfo,
  Intent,
  IntentParams,
  Quote,
  QuoteParams,
  QuotePreview,
  QuotePreviewParams,
  QuoteRef,
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

    previewQuote: (params: QuotePreviewParams): Promise<QuotePreview> => {
      v.parse(quotePreviewParamsSchema, params)
      return request<QuotePreview>('/quotes/preview', {
        method: 'POST',
        body: params,
      })
    },

    createQuote: (params: QuoteParams): Promise<QuoteRef> => {
      v.parse(quoteParamsSchema, params)
      return request<QuoteRef>('/quotes', { method: 'POST', body: params })
    },

    getQuote: (ref: string): Promise<Quote | null> =>
      request<Quote | null>(`/quotes/${ref}`).catch((error) => {
        if (error.status === 404) return null
        throw error
      }),
  }
}
