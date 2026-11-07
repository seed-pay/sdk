import type { Intent } from './types'

export const buildUrl = (
  query: Intent & Partial<Record<string, string>>,
  url: string | null = null
): string => {
  const base = url === null ? null : new URL(url)
  const params = new URLSearchParams(
    Object.entries(query).filter(
      (entry): entry is [string, string] => entry[1] != null && entry[1] !== ''
    )
  )
  if (!base) return `?${params}`
  params.forEach((value, key) => base.searchParams.set(key, value))
  return base.toString()
}
