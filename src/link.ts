import { SEEDPAY_URL } from './constants'

import type { Extra, Intent } from './types'

const PAY_URL = `${SEEDPAY_URL}/pay`

export const toLink = (
  intent: Intent,
  extra: Extra | null = {},
  url: string | null = PAY_URL
): string => {
  const base = url === null ? null : new URL(url)

  const params = new URLSearchParams(
    Object.entries({ ...intent, ...extra }).filter(
      (entry): entry is [string, string] => entry[1] != null && entry[1] !== ''
    )
  )

  if (!base) return `?${params}`

  params.forEach((value, key) => base.searchParams.set(key, value))

  return base.toString()
}
