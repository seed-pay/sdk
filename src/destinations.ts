import { validateWalletAddress } from 'blockchain-wallet-validator'

import { Network } from './enums'

const map: Record<Network, string> = {
  [Network.bitcoin]: 'btc',
  [Network.ethereum]: 'evm',
  [Network.arbitrum]: 'evm',
  [Network.solana]: 'sol',
  [Network.tron]: 'tron',
} as const

export const isDestination = (network: Network, destination: string): boolean =>
  validateWalletAddress(destination, { network: [map[network]] }, true).isValid
