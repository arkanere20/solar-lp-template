export const propertyTypes = [
  'Independent house',
  'Bungalow / Villa',
  'Row house',
  'Apartment / Housing society',
  'Other',
] as const

export type LeadInput = {
  name: string
  mobile: string
  location: string
  monthlyBill: string
  propertyType: string
  consent: boolean
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>

/** Strips spaces, dashes and a leading +91 / 0 from an Indian mobile number. */
export function normaliseMobile(value: string) {
  let digits = value.replace(/[^\d]/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {}
  const name = input.name.trim()
  if (name.length < 2) errors.name = 'Please enter your full name.'
  else if (!/^[\p{L}\p{M} .'-]+$/u.test(name))
    errors.name = "Name can only contain letters, spaces and . ' -"

  if (!/^[6-9]\d{9}$/.test(normaliseMobile(input.mobile)))
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.'

  const location = input.location.trim()
  if (location.length < 2)
    errors.location = 'Enter your city or 6-digit PIN code.'
  else if (/^\d+$/.test(location) && !/^[1-9]\d{5}$/.test(location))
    errors.location = 'PIN code must be 6 digits.'

  const bill = Number(input.monthlyBill)
  if (!input.monthlyBill.trim() || !Number.isFinite(bill))
    errors.monthlyBill = 'Enter your average monthly bill in ₹.'
  else if (bill < 300) errors.monthlyBill = 'Bill should be at least ₹300.'
  else if (bill > 200000)
    errors.monthlyBill = 'Please enter an amount below ₹2,00,000.'

  if (!(propertyTypes as readonly string[]).includes(input.propertyType))
    errors.propertyType = 'Select your property type.'

  if (!input.consent) errors.consent = 'Please agree so we can contact you.'
  return errors
}
