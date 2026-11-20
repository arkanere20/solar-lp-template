import { describe, expect, it } from 'vitest'
import { estimateSavings, pmSuryaGharSubsidy } from './solar'
import { normaliseMobile, validateLead } from './validation'
import { buildPalette, hexToOklch } from './theme'
import { site, t } from '../data/site'

const valid = {
  name: 'Rahul Patil',
  mobile: '+91 98765 43210',
  location: '416416',
  monthlyBill: '2500',
  propertyType: 'Independent house',
  consent: true,
}

describe('validateLead', () => {
  it('accepts a complete lead', () => {
    expect(validateLead(valid)).toEqual({})
  })
  it('rejects bad mobile, PIN, bill and missing consent', () => {
    const errors = validateLead({
      ...valid,
      mobile: '12345',
      location: '4164',
      monthlyBill: '',
      consent: false,
    })
    expect(Object.keys(errors).sort()).toEqual([
      'consent',
      'location',
      'mobile',
      'monthlyBill',
    ])
  })
  it('normalises Indian mobile formats', () => {
    expect(normaliseMobile('+91 98765-43210')).toBe('9876543210')
    expect(normaliseMobile('09876543210')).toBe('9876543210')
  })
})

describe('solar maths', () => {
  it('follows PM Surya Ghar slabs', () => {
    expect(pmSuryaGharSubsidy(1)).toBe(30000)
    expect(pmSuryaGharSubsidy(2)).toBe(60000)
    expect(pmSuryaGharSubsidy(3)).toBe(78000)
    expect(pmSuryaGharSubsidy(5)).toBe(78000)
  })
  it('suggests a sensible system size', () => {
    const e = estimateSavings(2500)
    expect(e.systemKw).toBe(2.5)
    expect(e.monthlySavings).toBeLessThanOrEqual(2500)
  })
})

describe('client theme', () => {
  it('reproduces the demo palette from two colours', () => {
    const p = buildPalette('#073527', '#ffc629')
    expect(p['--color-forest-900']).toBe('#073527')
    expect(p['--color-sun-400']).toBe('#ffc629')
  })
  it('darkens a light primary so white text stays readable', () => {
    const p = buildPalette('#7dd3fc', '#f97316')
    expect(hexToOklch(p['--color-forest-900']).l).toBeLessThanOrEqual(0.33)
  })
})

describe('copy tokens', () => {
  it('fills client tokens', () => {
    expect(t('{name} in {city}')).toBe(`${site.name} in ${site.location.city}`)
    expect(t('{unknown}')).toBe('{unknown}')
  })
})
