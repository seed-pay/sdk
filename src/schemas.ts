import * as v from 'valibot'

import { ASSET_META, ASSETS } from './assets'
import { isDestination } from './destinations'
import { ErrorCode } from './errors'
import { isIntent } from './intents'

// basic

export const uuidSchema = v.pipe(
  v.string(ErrorCode.INVALID_UUID),
  v.uuid(ErrorCode.INVALID_UUID)
)
export const assetSchema = v.picklist(ASSETS, ErrorCode.INVALID_ASSET)

export const amountSchema = v.pipe(
  v.string(ErrorCode.INVALID_AMOUNT),
  v.regex(/^(0|[1-9]\d*)(\.\d+)?$/, ErrorCode.INVALID_AMOUNT)
)
export const recipientSchema = v.pipe(
  v.string(ErrorCode.INVALID_RECIPIENT),
  v.nonEmpty(ErrorCode.INVALID_RECIPIENT)
)
export const affiliateSchema = v.optional(
  v.pipe(
    v.string(ErrorCode.INVALID_AFFILIATE),
    v.nonEmpty(ErrorCode.INVALID_AFFILIATE),
    v.excludes('|', ErrorCode.INVALID_AFFILIATE)
  )
)
export const refundRecipientSchema = v.pipe(
  v.string(ErrorCode.INVALID_REFUND_RECIPIENT),
  v.nonEmpty(ErrorCode.INVALID_REFUND_RECIPIENT)
)

export const assetInfoSchema = v.object({ asset: assetSchema, usd: v.number() })

export type AssetInfo = v.InferOutput<typeof assetInfoSchema>

// intent

const intentObjectSchema = v.object({
  asset: assetSchema,
  amount: amountSchema,
  recipient: recipientSchema,
  affiliate: affiliateSchema,
})

type IntentObject = v.InferOutput<typeof intentObjectSchema>

const isValidRecipient = (x: IntentObject): boolean =>
  isDestination(ASSET_META[x.asset].network, x.recipient)

const isValidAmount = (x: IntentObject): boolean => {
  const meta = ASSET_META[x.asset]
  const fraction = x.amount.split('.')[1]
  return !fraction || fraction.length <= meta.decimals
}

export const intentParamsSchema = v.pipe(
  intentObjectSchema,
  v.forward(
    v.check((x) => isValidRecipient(x), ErrorCode.INVALID_RECIPIENT),
    ['recipient']
  ),
  v.forward(
    v.check((x) => isValidAmount(x), ErrorCode.INVALID_AMOUNT),
    ['amount']
  )
)

export const intentSchema = v.pipe(
  v.object({
    id: uuidSchema,
    ...intentObjectSchema.entries,
  }),
  v.forward(
    v.check((x) => isValidRecipient(x), ErrorCode.INVALID_RECIPIENT),
    ['recipient']
  ),
  v.forward(
    v.check((x) => isValidAmount(x), ErrorCode.INVALID_AMOUNT),
    ['amount']
  )
)

//deposit

export const depositParamsSchema = v.pipe(
  v.object({
    intent: intentSchema,
    originAsset: assetSchema,
    refundRecipient: refundRecipientSchema,
  }),
  v.forward(
    v.check(({ intent }) => isIntent(intent), ErrorCode.INVALID_INTENT),
    ['intent']
  ),
  v.forward(
    v.check(
      ({ originAsset, refundRecipient }) =>
        isDestination(ASSET_META[originAsset].network, refundRecipient),
      ErrorCode.INVALID_REFUND_RECIPIENT
    ),
    ['refundRecipient']
  )
)
