import { SEEDPAY_URL } from './constants'

import { extraSchema, type Extra, type Intent } from './types'

import * as v from 'valibot'

const PAY_URL = `${SEEDPAY_URL}/pay`

export type LinkParams = {
  intent: Intent
  extra?: Extra | null
  url?: string | null
}

export const toLink = ({
  intent,
  extra = null,
  url = PAY_URL,
}: LinkParams): string => {
  const validatedExtra = v.parse(extraSchema, extra ?? {})
  const isRelative = url !== null && url.startsWith('/')
  const base = url === null ? null : new URL(url, SEEDPAY_URL)

  const params = new URLSearchParams(
    Object.entries({ ...intent, ...validatedExtra }).filter(
      (entry): entry is [string, string] => entry[1] != null && entry[1] !== ''
    )
  )

  if (!base) return `?${params}`

  params.forEach((value, key) => base.searchParams.set(key, value))

  return isRelative ? `${base.pathname}${base.search}` : base.toString()
}
