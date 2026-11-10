import * as v from 'valibot'

import { ASSET_META, ASSETS } from './constants'
import { isDestination } from './destinations'
import { ErrorCode } from './errors'
import { isIntent } from './intents'

import { DepositStatus, IntentType, Network, Provider } from './enums'

// basic

export const uuidSchema = v.pipe(
  v.string(ErrorCode.INVALID_UUID),
  v.uuid(ErrorCode.INVALID_UUID)
)

export const amountSchema = v.pipe(
  v.string(ErrorCode.INVALID_AMOUNT),
  v.regex(/^(0|[1-9]\d*)(\.\d+)?$/, ErrorCode.INVALID_AMOUNT)
)

export const recipientSchema = v.pipe(
  v.string(ErrorCode.INVALID_RECIPIENT),
  v.nonEmpty(ErrorCode.INVALID_RECIPIENT)
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

const isValidRecipient = (x: IntentObject): boolean =>
  isDestination(ASSET_META[x.asset].network, x.recipient)

const isValidAmount = (x: IntentObject): boolean => {
  const meta = ASSET_META[x.asset]
  const fraction = x.amount.split('.')[1]
  return !fraction || fraction.length <= meta.decimals
}

export const intentTypeSchema = v.enum(IntentType)

export const intentParamsSchema = v.pipe(
  intentParamsObject,
  v.forward(v.check(isValidRecipient, ErrorCode.INVALID_RECIPIENT), [
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
    v.check((input) => isValidRecipient(input), ErrorCode.INVALID_RECIPIENT),
    ['recipient']
  ),
  v.forward(
    v.check((x) => isValidAmount(x), ErrorCode.INVALID_AMOUNT),
    ['amount']
  )
)

// quote

export const quoteParamsSchema = v.pipe(
  v.object(
    {
      intent: intentSchema,
      originAsset: assetSchema,
    },
    ErrorCode.INVALID_PARAMS
  ),
  v.forward(
    v.check(({ intent }) => isIntent(intent), ErrorCode.INVALID_INTENT),
    ['intent']
  )
)

export const quoteSchema = v.pipe(
  v.object({
    intent: intentSchema,
    provider: providerShema,
    originAsset: assetSchema,
    originAmount: amountSchema,
    estimatedTime: v.number(),
  })
)

// deposit

export const depositStatusSchema = v.enum(DepositStatus)

export const depositParamsSchema = v.pipe(
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
      ErrorCode.INVALID_RECIPIENT
    ),
    ['refundRecipient']
  )
)

export const depositRefSchema = v.pipe(
  v.object({
    ref: v.string(),
    signature: v.optional(v.string()),
  })
)

export const depositSchema = v.pipe(
  v.object({
    intent: intentSchema,
    provider: providerShema,
    originAsset: assetSchema,
    originAmount: amountSchema,
    originReference: v.nullable(v.string()),
    depositDetails: v.string(),
    depositedAmount: v.nullable(amountSchema),
    refundRecipient: v.string(),
    refundAmount: v.nullable(amountSchema),
    signature: v.nullable(v.string()),
    createdAt: v.pipe(v.string(), v.isoTimestamp()),
    deadlineAt: v.pipe(v.string(), v.isoTimestamp()),
    status: depositStatusSchema,
  })
)

// types

export type UUID = v.InferOutput<typeof uuidSchema>
export type Amount = v.InferOutput<typeof amountSchema>
export type Asset = v.InferOutput<typeof assetSchema>
export type AssetMeta = v.InferOutput<typeof assetMetaSchema>
export type AssetInfo = v.InferOutput<typeof assetInfoSchema>
export type Recipient = v.InferOutput<typeof recipientSchema>

export type IntentParams = v.InferOutput<typeof intentParamsSchema>
export type Intent = v.InferOutput<typeof intentSchema>

export type QuoteParams = v.InferOutput<typeof quoteParamsSchema>
export type Quote = v.InferOutput<typeof quoteSchema>

export type DepositParams = v.InferOutput<typeof depositParamsSchema>
export type DepositRef = v.InferOutput<typeof depositRefSchema>
export type Deposit = v.InferOutput<typeof depositSchema>

export type ApiResponse<T> = { data: T }
