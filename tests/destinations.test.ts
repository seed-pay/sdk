import { describe, expect, test } from 'bun:test'
import { isDestination, Network } from '../src'

const validAddresses: Record<Network, string> = {
  [Network.bitcoin]: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  [Network.ethereum]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  [Network.arbitrum]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  [Network.solana]: 'So11111111111111111111111111111111111111112',
  [Network.tron]: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
}

const addresses = Object.entries(validAddresses)

describe('Destinations', () => {
  test.each(addresses)('Valid %s address', (network, address) => {
    expect(isDestination(network as Network, address)).toBe(true)
  })

  test.each(addresses)('Invalid %s address', (network) => {
    expect(isDestination(network as Network, 'example')).toBe(false)
  })

  test('EVM checksum', () => {
    const valid = validAddresses.ethereum
    const invalid = validAddresses.ethereum.toLowerCase()
    expect(isDestination(Network.ethereum, valid)).toBe(true)
    expect(isDestination(Network.ethereum, invalid)).toBe(false)
  })
})
