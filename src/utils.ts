import {
  formatUnits as formatUnitsBigInt,
  parseUnits as parseUnitsBigInt,
} from 'micro-eth-signer/utils.js'

export const formatUnits = (value: string, precision: number) =>
  formatUnitsBigInt(BigInt(value), precision)

export const parseUnits = (value: string, precision: number) =>
  String(parseUnitsBigInt(value, precision))
