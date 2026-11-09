export const Provider = {
  near: 'near',
} as const

export const Network = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  arbitrum: 'arbitrum',
  solana: 'solana',
  tron: 'tron',
} as const

export const IntentType = {
  exact_out: 'exact_out',
} as const

export const DepositStatus = {
  waiting: 'waiting',
  expired: 'expired',
  processing: 'processing',
  success: 'success',
  refunded: 'refunded',
  failed: 'failed',
} as const

export type Provider = (typeof Provider)[keyof typeof Provider]
export type Network = (typeof Network)[keyof typeof Network]
export type IntentType = (typeof IntentType)[keyof typeof IntentType]
export type DepositStatus = (typeof DepositStatus)[keyof typeof DepositStatus]
