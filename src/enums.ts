export const Provider = {
  near: 'near',
} as const

export const Network = {
  arbitrum: 'arbitrum',
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  tron: 'tron',
} as const

export const Asset = {
  // arbitrum
  'arbitrum.eth': 'arbitrum.eth',
  'arbitrum.usdc': 'arbitrum.usdc',
  // bitcoin
  'bitcoin.btc': 'bitcoin.btc',
  // ethereum
  'ethereum.eth': 'ethereum.eth',
  'ethereum.usdc': 'ethereum.usdc',
  // solana
  'solana.sol': 'solana.sol',
  'solana.usdt': 'solana.usdt',
  // tron
  'tron.trx': 'tron.trx',
  'tron.usdt': 'tron.usdt',
} as const satisfies { [K in `${Network}.${string}`]?: K }

export const IntentType = {
  exact_out: 'exact_out',
} as const

export const QuoteStatus = {
  waiting: 'waiting',
  incomplete: 'incomplete',
  processing: 'processing',
  success: 'success',
  refunded: 'refunded',
  failed: 'failed',
} as const

export type Asset = (typeof Asset)[keyof typeof Asset]
export type Provider = (typeof Provider)[keyof typeof Provider]
export type Network = (typeof Network)[keyof typeof Network]
export type IntentType = (typeof IntentType)[keyof typeof IntentType]
export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus]
