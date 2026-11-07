import type { Asset, AssetMeta, NetworkType } from './types'

type IAsset = keyof typeof ASSET_META
type AssetRegistry = {
  [K in `${NetworkType}.${string}`]?: Omit<AssetMeta, 'network'> & {
    network: K extends `${infer N}.${string}` ? N : never
  }
}

export const Network = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  arbitrum: 'arbitrum',
  solana: 'solana',
  tron: 'tron',
} as const

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
} as const satisfies AssetRegistry

export const ASSETS = Object.keys(ASSET_META) as readonly IAsset[]

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
