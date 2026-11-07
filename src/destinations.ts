import { validateWalletAddress } from 'blockchain-wallet-validator'

import { Network } from './assets'

import type { NetworkType } from './types'

const map: Record<NetworkType, string> = {
  [Network.bitcoin]: 'btc',
  [Network.ethereum]: 'evm',
  [Network.arbitrum]: 'evm',
  [Network.solana]: 'sol',
  [Network.tron]: 'tron',
} as const

export const isDestination = (
  network: NetworkType,
  destination: string
): boolean =>
  validateWalletAddress(destination, { network: [map[network]] }, true).isValid
