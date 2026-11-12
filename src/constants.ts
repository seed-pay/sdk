import { IntentType, Network, Provider, QuoteStatus } from './enums'

import type { Asset, AssetMeta } from './types'

export const API_BASE_URL = 'https://api.seedpay.io'
export const SEEDPAY_URL = 'https://seedpay.io'

export const DEPOSIT_WINDOW = 600_000 // 10 min

export const NETWORK_BUFFER = {
  [Network.bitcoin]: 3_600_000, // 60 min
  [Network.ethereum]: 600_000, /// 10 min
  [Network.arbitrum]: 300_000, /// 5 min
  [Network.solana]: 300_000, ///// 5 min
  [Network.tron]: 300_000, /////// 5 min
} as const satisfies Readonly<Record<Network, number>>

type IAsset = keyof typeof ASSET_META
type AssetRegistry = {
  [K in `${Network}.${string}`]?: Omit<AssetMeta, 'network'> & {
    network: K extends `${infer N}.${string}` ? N : never
  }
}

export const ASSET_META = {
  'bitcoin.btc': {
    network: Network.bitcoin,
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
  },
  'ethereum.eth': {
    network: Network.ethereum,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  'ethereum.usdc': {
    network: Network.ethereum,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  'arbitrum.eth': {
    network: Network.arbitrum,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  'arbitrum.usdc': {
    network: Network.arbitrum,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  'solana.sol': {
    network: Network.solana,
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
  },
  'solana.usdt': {
    network: Network.solana,
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
  },
  'tron.trx': {
    network: Network.tron,
    name: 'TRON',
    symbol: 'TRX',
    decimals: 6,
  },
  'tron.usdt': {
    network: Network.tron,
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
  },
} as const satisfies Readonly<AssetRegistry>

export const ASSET_REFERENCE = {
  'bitcoin.btc': 'bitcoin.btc',
  'ethereum.eth': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  'ethereum.usdc': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'arbitrum.eth': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  'arbitrum.usdc': '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  'solana.sol': '11111111111111111111111111111111',
  'solana.usdt': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'tron.trx': 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
  'tron.usdt': 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
} as const satisfies Readonly<Record<Asset, string>>

export const PROVIDERS = Object.keys(Provider) as [Provider]
export const NETWORKS = Object.keys(Network) as [Network]
export const ASSETS = Object.keys(ASSET_META) as [IAsset]
export const INTENT_TYPES = Object.keys(IntentType) as [IntentType]
export const QUOTE_STATUSES = Object.keys(QuoteStatus) as [QuoteStatus]
