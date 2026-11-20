/**
 * Builds the full colour palette from the two brand colours in
 * client.config.ts. The page's Tailwind classes use `forest-*` (primary) and
 * `sun-*` (accent) shades; these are emitted as CSS variables on <html> so a
 * new client needs only two hex codes.
 *
 * Shades are derived in OKLCH so hue stays true. Dark shades are clamped so
 * white text stays readable, and the accent is kept bright enough for dark
 * button text.
 */
type Oklch = { l: number; c: number; h: number }

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
const fromLinear = (v: number) =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055

export function hexToOklch(hex: string): Oklch {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) throw new Error(`Invalid hex colour: ${hex}`)
  const n = parseInt(m[1], 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    toLinear(v / 255),
  )
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const mm = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s
  return {
    l: L,
    c: Math.hypot(A, B),
    h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360,
  }
}

function oklchToRgb({ l, c, h }: Oklch) {
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map(fromLinear)
}

/** OKLCH → hex, reducing chroma until the colour fits in sRGB. */
export function oklchToHex(color: Oklch): string {
  let c = color.c
  let rgb = oklchToRgb({ ...color, c })
  while (rgb.some((v) => v < -0.001 || v > 1.001) && c > 0) {
    c = Math.max(0, c - 0.005)
    rgb = oklchToRgb({ ...color, c })
  }
  return (
    '#' +
    rgb
      .map((v) =>
        Math.round(Math.min(1, Math.max(0, v)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

/** Returns CSS custom properties for Tailwind's forest-* and sun-* colours. */
export function buildPalette(primary: string, accent: string) {
  const p = hexToOklch(primary)
  const a = hexToOklch(accent)
  // Base dark shade (forest-900) — never lighter than L 0.32.
  const pl = Math.min(p.l, 0.32)
  const pc = Math.max(p.c, 0.02)
  const dark = (dl: number, cm: number) =>
    oklchToHex({ l: clamp(pl + dl, 0, 1), c: Math.min(pc * cm, 0.2), h: p.h })
  const tint = (l: number, c: number) =>
    oklchToHex({ l, c: Math.min(pc * c, 0.03), h: p.h })
  // Accent base (sun-400) — kept bright so dark text on it stays readable.
  const al = Math.max(a.l, 0.68)
  const acc = (dl: number, cm: number) =>
    oklchToHex({ l: clamp(al + dl, 0, 0.99), c: a.c * cm, h: a.h })
  const accTint = (l: number, cm: number) =>
    oklchToHex({ l, c: a.c * cm, h: a.h })

  return {
    '--color-forest-950': dark(-0.061, 0.75),
    '--color-forest-900': dark(0, 1),
    '--color-forest-800': dark(0.057, 1.2),
    '--color-forest-700': dark(0.122, 1.47),
    '--color-forest-600': dark(0.2, 1.8),
    '--color-forest-100': tint(0.946, 0.31),
    '--color-forest-50': tint(0.974, 0.13),
    '--color-sun-500': acc(-0.048, 1),
    '--color-sun-400': acc(0, 1),
    '--color-sun-300': acc(0.036, 0.87),
    '--color-sun-100': accTint(0.966, 0.32),
    '--color-sun-50': accTint(0.985, 0.12),
  } as Record<string, string>
}
