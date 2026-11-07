import * as v from 'valibot'

import { sha256 } from '@noble/hashes/sha2.js'
import { concatBytes, utf8ToBytes } from '@noble/hashes/utils.js'
import { parseUnits } from 'micro-eth-signer/utils.js'
import { parse, stringify, v7 } from 'uuid'

import { ASSET_META, ASSET_REFERENCE } from './assets'
import { intentParamsSchema, intentSchema } from './schemas'

import type { Intent, IntentParams } from './types'

const HASH_BYTES = 5
const NONCE_BYTES = 11
const SEPARATOR = '|'

const hashIntent = (params: IntentParams, nonce: Uint8Array): Uint8Array => {
  const { asset, amount, recipient, affiliate } = params
  const { decimals } = ASSET_META[asset]

  const payload = utf8ToBytes(
    [
      ASSET_REFERENCE[asset],
      String(parseUnits(amount, decimals)),
      recipient,
      affiliate ?? '',
    ].join(SEPARATOR)
  )

  return sha256(concatBytes(payload, nonce)).slice(0, HASH_BYTES)
}

export const createIntent = (params: IntentParams): Intent => {
  const input = v.parse(intentParamsSchema, params)

  const idBytes = parse(v7())
  const nonce = idBytes.slice(0, NONCE_BYTES)
  const hash = hashIntent(input, nonce)

  idBytes.set(hash, NONCE_BYTES)

  return { id: stringify(idBytes), ...input }
}

export const isIntent = (intent: Intent): boolean => {
  try {
    const params = v.parse(intentSchema, intent)
    const { id, ...input } = params
    const idBytes = parse(id)
    const nonce = idBytes.slice(0, NONCE_BYTES)
    const hash = hashIntent(input, nonce)

    const valid = hash.every((x, index) => x === idBytes[NONCE_BYTES + index])

    return valid
  } catch {
    return false
  }
}
