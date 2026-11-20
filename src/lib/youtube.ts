/**
 * Reads the video id from any common YouTube link:
 *   youtube.com/watch?v=ID · youtu.be/ID · youtube.com/shorts/ID
 *   youtube.com/embed/ID · youtube.com/live/ID · m.youtube.com/...
 * Returns null when the link is not a YouTube video.
 */
export function parseYouTube(
  url: string,
): { id: string; vertical: boolean } | null {
  let u: URL
  try {
    u = new URL(url.trim())
  } catch {
    return null
  }
  const host = u.hostname.replace(/^(www\.|m\.|music\.)/, '')
  let id: string | null = null
  let vertical = false
  if (host === 'youtu.be') id = u.pathname.split('/')[1] ?? null
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, kind, value] = u.pathname.split('/')
    if (kind === 'watch') id = u.searchParams.get('v')
    else if (kind === 'shorts') {
      id = value ?? null
      vertical = true
    } else if (kind === 'embed' || kind === 'live' || kind === 'v')
      id = value ?? null
  }
  return id && /^[\w-]{11}$/.test(id) ? { id, vertical } : null
}

export const youTubeThumb = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

export const youTubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
