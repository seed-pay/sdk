import type { Asset } from './assets'

export type ApiResponse<T> = { data: T }

export type IntentParams = Omit<Intent, 'id'>

export type Intent = {
  id: string
  asset: Asset
  amount: string
  recipient: string
  affiliate?: string
}

export type QuoteParams = Intent

export type Quote = { intent: Intent; amount: string; time: number }

export enum DepositStatus {
  WAITING = 'WAITING',
  EXPIRED = 'EXPIRED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export type DepositParams = {
  intent: Intent
  refundRecipient: string
  originAsset: string
}

export type Deposit = DepositParams & {
  originAmount?: string
  originReference?: string
  destination: string
  amount: string
  deadline: string
  status: DepositStatus
}
