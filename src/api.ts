import { ofetch } from 'ofetch'
import * as v from 'valibot'

import { API_BASE_URL } from './constants'
import {
  createIntentParamsSchema,
  quoteParamsSchema,
  quotePreviewParamsSchema,
} from './types'

import type { FetchOptions } from 'ofetch'
import type {
  ApiResponse,
  AssetInfo,
  CreateIntentParams,
  IntentInfo,
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
    getAssets: (): Promise<AssetInfo[]> => request<AssetInfo[]>('/v1/assets'),

    createIntent: (params: CreateIntentParams): Promise<IntentInfo> => {
      v.parse(createIntentParamsSchema, params)
      return request<IntentInfo>('/v1/intents', {
        method: 'POST',
        body: params,
      })
    },

    getIntent: (id: string): Promise<IntentInfo | null> =>
      request<IntentInfo>(`/v1/intents/${id}`).catch((error) => {
        if (error.status === 404) return null
        throw error
      }),

    previewQuote: (params: QuotePreviewParams): Promise<QuotePreview> => {
      v.parse(quotePreviewParamsSchema, params)
      return request<QuotePreview>('/v1/quotes/preview', { query: params })
    },

    createQuote: (params: QuoteParams): Promise<QuoteRef> => {
      v.parse(quoteParamsSchema, params)
      return request<QuoteRef>('/v1/quotes', { method: 'POST', body: params })
    },

    getQuote: (ref: string): Promise<Quote | null> =>
      request<Quote | null>(`/v1/quotes/${ref}`).catch((error) => {
        if (error.status === 404) return null
        throw error
      }),
  }
}
