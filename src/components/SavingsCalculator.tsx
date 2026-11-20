import { useId, useState } from 'react'
import { assumptions, estimateSavings, formatINR } from '../lib/solar'
import { site } from '../data/site'

const presets = [1500, 2500, 4000, 6000]

export function SavingsCalculator() {
  const [bill, setBill] = useState(2500)
  const id = useId()
  const e = estimateSavings(bill)
  const remaining = Math.max(0, e.monthlyBill - e.monthlySavings)
  const savedPct = e.monthlyBill
    ? Math.round((e.monthlySavings / e.monthlyBill) * 100)
    : 0

  return (
    <div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-40px_rgba(4,36,27,0.5)] ring-1 ring-forest-900/5 lg:grid-cols-2">
      <div className="p-6 sm:p-8">
        <label htmlFor={`${id}-bill`} className="field-label text-base">
          Your average monthly electricity bill
        </label>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-forest-800">₹</span>
          <input
            id={`${id}-bill-number`}
            aria-label="Monthly bill in rupees"
            type="number"
            inputMode="numeric"
            min={500}
            max={20000}
            step={100}
            value={bill}
            onChange={(ev) =>
              setBill(
                Math.min(20000, Math.max(0, Number(ev.target.value) || 0)),
              )
            }
            className="w-40 border-b-2 border-forest-100 bg-transparent text-4xl font-extrabold text-forest-950 focus:border-forest-600 focus:outline-none"
          />
        </div>
        <input
          id={`${id}-bill`}
          type="range"
          min={500}
          max={20000}
          step={100}
          value={Math.max(500, bill)}
          onChange={(ev) => setBill(Number(ev.target.value))}
          className="mt-6 w-full accent-forest-700"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>₹500</span>
          <span>₹20,000</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setBill(p)}
              aria-pressed={bill === p}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                bill === p
                  ? 'border-forest-700 bg-forest-700 text-white'
                  : 'border-gray-200 text-forest-900 hover:border-forest-600'
              }`}
            >
              {formatINR(p)}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-forest-950">
            Your bill, before and after
          </p>
          <div className="mt-3 space-y-3 text-sm">
            <Bar
              label="Today"
              value={e.monthlyBill}
              pct={100}
              tone="bg-gray-300"
            />
            <Bar
              label="With solar"
              value={remaining}
              pct={100 - savedPct}
              tone="bg-sun-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-forest-900 p-6 text-white sm:p-8" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-300">
          Estimated savings
        </p>
        <p className="mt-2 text-5xl font-extrabold tracking-tight">
          {formatINR(e.monthlySavings)}
          <span className="text-lg font-semibold text-white/70"> /month</span>
        </p>
        <p className="mt-1 text-sm text-white/70">
          About {savedPct}% off your bill with a {e.systemKw} kW system
        </p>
        <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/10 pt-6">
          <Item label="Suggested system size" value={`${e.systemKw} kW`} />
          <Item
            label="Monthly generation"
            value={`~${e.monthlyGeneration} units`}
          />
          <Item label="Yearly savings" value={formatINR(e.annualSavings)} />
          <Item
            label={`${assumptions.lifetimeYears}-year savings`}
            value={formatINR(e.lifetimeSavings)}
          />
          <Item
            label="PM Surya Ghar subsidy"
            value={formatINR(e.subsidy)}
            highlight
          />
          <Item
            label="Roof area needed"
            value={`~${Math.round(e.systemKw * 100)} sq ft`}
          />
        </dl>
        <a href="#get-quote" className="btn-sun mt-8 w-full">
          Get my exact quote
        </a>
        <p className="mt-4 text-xs leading-relaxed text-white/60">
          Indicative only. Assumes ~₹{assumptions.tariffPerUnit}/unit average
          tariff, ~{assumptions.unitsPerKwPerMonth} units per kW per month and
          that fixed charges remain. Actual results depend on roof, shading,
          usage and {site.discom} tariff.
        </p>
      </div>
    </div>
  )
}

function Bar({
  label,
  value,
  pct,
  tone,
}: {
  label: string
  value: number
  pct: number
  tone: string
}) {
  return (
    <div className="grid grid-cols-[80px_1fr_70px] items-center gap-3">
      <span className="text-gray-600">{label}</span>
      <span className="h-3 overflow-hidden rounded-full bg-gray-100">
        <span
          className={`block h-full rounded-full ${tone} transition-all duration-500`}
          style={{ width: `${Math.max(3, pct)}%` }}
        />
      </span>
      <span className="text-right font-bold text-forest-950">
        {formatINR(value)}
      </span>
    </div>
  )
}

function Item({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <dt className="text-xs text-white/60">{label}</dt>
      <dd
        className={`mt-0.5 text-lg font-bold ${highlight ? 'text-sun-300' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}
