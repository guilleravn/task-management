const LEGACY_DICEBEAR_PATTERN = /^https:\/\/avatars\.dicebear\.com\/api\/([^/]+)\/([^/.]+)\.svg$/

export function normalizeAvatarUrl(url: string | null | undefined): string {
  if (!url) return ''

  const match = url.match(LEGACY_DICEBEAR_PATTERN)
  if (!match) return url

  const [, style, seed] = match
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
}
