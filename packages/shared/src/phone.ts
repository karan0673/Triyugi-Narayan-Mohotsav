import { parsePhoneNumberFromString } from 'libphonenumber-js';

/** Returns E.164 (for example +919876543210) or null when invalid. Defaults to India. */
export function normalizePhone(input: string, defaultCountry: 'IN' = 'IN'): string | null {
  const parsed = parsePhoneNumberFromString(input.trim(), defaultCountry);
  return parsed && parsed.isValid() ? parsed.number : null;
}

/** wa.me expects digits only, with country code and no plus sign. */
export function toWaDigits(e164: string): string {
  return e164.replace(/\D/g, '');
}
