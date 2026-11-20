import {
  Asset,
  IntentType,
  Network,
  Provider,
  QuoteStatus,
  TransactionStatus,
} from './enums'

import type { AssetMeta, NetworkMeta } from './types'

export const API_BASE_URL = 'https://api.seedpay.io'
export const SEEDPAY_URL = 'https://seedpay.io'

export const DEPOSIT_WINDOW = 900_000 // 15 min

export const NETWORK_META: Record<Network, NetworkMeta> = {
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ARB',
    asset: 'arbitrum.eth',
    buffer: 300_000, // 5 min
  },
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    asset: 'bitcoin.btc',
    buffer: 3_600_000, // 60 min
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    asset: 'ethereum.eth',
    buffer: 600_000, // 10 min
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    asset: 'solana.sol',
    buffer: 300_000, // 5 min
  },
  tron: {
    name: 'Tron',
    symbol: 'TRX',
    asset: 'tron.trx',
    buffer: 300_000, // 5 min
  },
} as const

export const ASSET_META: Record<Asset, AssetMeta> = {
  'arbitrum.eth': {
    network: Network.arbitrum,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    ref: 'arbitrum.eth',
  },
  'arbitrum.usdc': {
    network: Network.arbitrum,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    ref: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  'bitcoin.btc': {
    network: Network.bitcoin,
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    ref: 'bitcoin.btc',
  },
  'ethereum.eth': {
    network: Network.ethereum,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    ref: 'ethereum.eth',
  },
  'ethereum.usdc': {
    network: Network.ethereum,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    ref: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  'solana.sol': {
    network: Network.solana,
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    ref: 'solana.sol',
  },
  'solana.usdt': {
    network: Network.solana,
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    ref: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  },
  'tron.trx': {
    network: Network.tron,
    name: 'TRON',
    symbol: 'TRX',
    decimals: 6,
    ref: 'tron.trx',
  },
  'tron.usdt': {
    network: Network.tron,
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    ref: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  },
} as const

export const PROVIDERS = Object.keys(Provider) as [Provider]
export const NETWORKS = Object.keys(Network) as [Network]
export const ASSETS = Object.keys(Asset) as [Asset]
export const INTENT_TYPES = Object.keys(IntentType) as [IntentType]
export const QUOTE_STATUSES = Object.keys(QuoteStatus) as [QuoteStatus]
export const TX_STATUSES = Object.keys(TransactionStatus) as [TransactionStatus]
