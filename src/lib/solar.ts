/**
 * Indicative rooftop solar savings maths. All assumptions live here so they can
 * be tuned in one place. Results are estimates, not quotations.
 */
import { client } from '../client.config'

export const assumptions = {
  /** Average effective residential tariff (₹ per unit) incl. charges. */
  tariffPerUnit: client.calculator.tariffPerUnit,
  /** Typical generation per kW per month in the client's region. */
  unitsPerKwPerMonth: client.calculator.unitsPerKwPerMonth,
  /** Share of the bill that is fixed charges and cannot be offset. */
  fixedShare: 0.1,
  /** Smallest / largest residential system suggested by the calculator. */
  minKw: 1,
  maxKw: 10,
  /** Assumed system life in years for long-term savings. */
  lifetimeYears: 25,
}

/**
 * PM Surya Ghar: Muft Bijli Yojana central financial assistance for
 * individual residential homes, per published scheme guidelines:
 * ₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000.
 */
export function pmSuryaGharSubsidy(kw: number) {
  if (kw <= 0) return 0
  const firstTwo = Math.min(kw, 2) * 30000
  const third = Math.max(0, Math.min(kw, 3) - 2) * 18000
  return Math.round(Math.min(firstTwo + third, 78000))
}

export type SavingsEstimate = {
  monthlyBill: number
  monthlyUnits: number
  systemKw: number
  monthlyGeneration: number
  monthlySavings: number
  annualSavings: number
  lifetimeSavings: number
  subsidy: number
}

export function estimateSavings(monthlyBill: number): SavingsEstimate {
  const a = assumptions
  const bill = Math.max(0, monthlyBill)
  const monthlyUnits = bill / a.tariffPerUnit
  const offsettableUnits = monthlyUnits * (1 - a.fixedShare)
  // Round up to the nearest 0.5 kW within limits.
  const rawKw = offsettableUnits / a.unitsPerKwPerMonth
  const systemKw = Math.min(
    a.maxKw,
    Math.max(a.minKw, Math.ceil(rawKw * 2) / 2),
  )
  const monthlyGeneration = systemKw * a.unitsPerKwPerMonth
  const monthlySavings = Math.round(
    Math.min(monthlyGeneration, offsettableUnits) * a.tariffPerUnit,
  )
  return {
    monthlyBill: bill,
    monthlyUnits: Math.round(monthlyUnits),
    systemKw,
    monthlyGeneration: Math.round(monthlyGeneration),
    monthlySavings,
    annualSavings: monthlySavings * 12,
    lifetimeSavings: monthlySavings * 12 * a.lifetimeYears,
    subsidy: pmSuryaGharSubsidy(systemKw),
  }
}

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
