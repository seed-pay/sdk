import * as v from 'valibot'

import { ASSET_META, ASSETS } from './constants'
import { isDestination } from './destinations'
import { ErrorCode } from './errors'
import { isIntent } from './intents'

import { IntentType, Network, Provider, QuoteStatus } from './enums'

// basic

export const urlSchema = v.pipe(
  v.string(ErrorCode.INVALID_URL),
  v.uuid(ErrorCode.INVALID_URL)
)

export const uuidSchema = v.pipe(
  v.string(ErrorCode.INVALID_UUID),
  v.uuid(ErrorCode.INVALID_UUID)
)

export const amountSchema = v.pipe(
  v.string(ErrorCode.INVALID_AMOUNT),
  v.regex(/^(0|[1-9]\d*)$/, ErrorCode.INVALID_AMOUNT)
)

export const displayAmountSchema = v.pipe(
  v.string(ErrorCode.INVALID_AMOUNT),
  v.regex(/^(0|[1-9]\d*)(\.\d+)?$/, ErrorCode.INVALID_AMOUNT)
)

export const recipientSchema = v.pipe(
  v.string(ErrorCode.INVALID_DESTINATION),
  v.nonEmpty(ErrorCode.INVALID_DESTINATION)
)

// network

export const providerShema = v.enum(Provider)

export const networkSchema = v.enum(Network)

// asset

export const assetSchema = v.picklist(ASSETS, ErrorCode.INVALID_ASSET)

export const assetMetaSchema = v.object({
  network: networkSchema,
  name: v.string(),
  symbol: v.string(),
  decimals: v.number(),
})

export const assetInfoSchema = v.object({ asset: assetSchema, usd: v.number() })

// intent

const intentParamsObject = v.object(
  {
    asset: assetSchema,
    amount: amountSchema,
    recipient: recipientSchema,
  },
  ErrorCode.INVALID_PARAMS
)

type IntentObject = v.InferOutput<typeof intentParamsObject>

const isValidDestination = (x: IntentObject): boolean =>
  isDestination(ASSET_META[x.asset].network, x.recipient)

const isValidAmount = (x: IntentObject): boolean => {
  const meta = ASSET_META[x.asset]
  const fraction = x.amount.split('.')[1]
  return !fraction || fraction.length <= meta.decimals
}

export const intentTypeSchema = v.enum(IntentType)

export const intentParamsSchema = v.pipe(
  intentParamsObject,
  v.forward(v.check(isValidDestination, ErrorCode.INVALID_DESTINATION), [
    'recipient',
  ]),
  v.forward(v.check(isValidAmount, ErrorCode.INVALID_AMOUNT), ['amount'])
)

export const intentSchema = v.pipe(
  v.object(
    {
      id: uuidSchema,
      ...intentParamsObject.entries,
    },
    ErrorCode.INVALID_PARAMS
  ),
  v.forward(
    v.check(
      (input) => isValidDestination(input),
      ErrorCode.INVALID_DESTINATION
    ),
    ['recipient']
  ),
  v.forward(
    v.check((x) => isValidAmount(x), ErrorCode.INVALID_AMOUNT),
    ['amount']
  )
)

// quote

export const quoteStatusSchema = v.enum(QuoteStatus)

export const quotePreviewParamsSchema = v.pipe(
  v.object(
    {
      originAsset: assetSchema,
      destinationAsset: assetSchema,
      amount: amountSchema,
    },
    ErrorCode.INVALID_PARAMS
  )
)

export const quotePreviewSchema = v.pipe(
  v.object({
    amount: amountSchema,
    estimatedTime: v.number(),
    provider: providerShema,
  })
)

export const quoteParamsSchema = v.pipe(
  v.object(
    {
      intent: intentSchema,
      originAsset: assetSchema,
      refundRecipient: recipientSchema,
    },
    ErrorCode.INVALID_PARAMS
  ),
  v.forward(
    v.check(({ intent }) => isIntent(intent), ErrorCode.INVALID_INTENT),
    ['intent']
  ),
  v.forward(
    v.check(
      ({ originAsset, refundRecipient }) =>
        isDestination(ASSET_META[originAsset].network, refundRecipient),
      ErrorCode.INVALID_DESTINATION
    ),
    ['refundRecipient']
  )
)

export const quoteRefSchema = v.pipe(
  v.object({
    ref: v.string(),
    signature: v.optional(v.string()),
  })
)

export const quoteSchema = v.pipe(
  v.object({
    intent: intentSchema,
    provider: providerShema,
    originAsset: assetSchema,
    originAmount: amountSchema,
    originReferences: v.array(v.string()),
    depositDetails: v.string(),
    depositedAmount: v.nullable(amountSchema),
    refundRecipient: v.string(),
    refundAmount: v.nullable(amountSchema),
    signature: v.nullable(v.string()),
    createdAt: v.pipe(v.string(), v.isoTimestamp()),
    deadlineAt: v.pipe(v.string(), v.isoTimestamp()),
    status: quoteStatusSchema,
  })
)

// link

export const extraSchema = v.object({
  method: v.optional(assetSchema),
  label: v.optional(v.string()),
  symbol: v.optional(v.string()),
  return: v.optional(urlSchema),
  displayAmount: v.optional(displayAmountSchema),
})

// types

export type UUID = v.InferOutput<typeof uuidSchema>
export type Amount = v.InferOutput<typeof amountSchema>
export type Asset = v.InferOutput<typeof assetSchema>
export type AssetMeta = v.InferOutput<typeof assetMetaSchema>
export type AssetInfo = v.InferOutput<typeof assetInfoSchema>
export type Recipient = v.InferOutput<typeof recipientSchema>

export type IntentParams = v.InferOutput<typeof intentParamsSchema>
export type Intent = v.InferOutput<typeof intentSchema>

export type QuotePreviewParams = v.InferOutput<typeof quotePreviewParamsSchema>
export type QuotePreview = v.InferOutput<typeof quotePreviewSchema>
export type QuoteParams = v.InferOutput<typeof quoteParamsSchema>
export type QuoteRef = v.InferOutput<typeof quoteRefSchema>
export type Quote = v.InferOutput<typeof quoteSchema>

export type Extra = v.InferOutput<typeof extraSchema>
export type ApiResponse<T> = { data: T }
