/** Allow numbers and common phone number separators */
const ALLOWED_INPUT = /^[0-9\s\-().]+$/;

export type ThaiTelephoneResult =
  | { ok: true; normalized: string }
  | { ok: false; message: string };

/**
 * Validate Thai phone number: must be digits, start with 0, length 9 or 10 (including leading 0)
 */
export function validateThaiTelephone(raw: string): ThaiTelephoneResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, message: 'Please enter phone number' };
  }
  if (!ALLOWED_INPUT.test(trimmed)) {
    return {
      ok: false,
      message: 'Phone number must be numbers only (hyphens and spaces allowed)',
    };
  }
  const digits = trimmed.replace(/\D/g, '');
  if (!digits.startsWith('0')) {
    return {
      ok: false,
      message: 'Phone number must start with 0 (e.g., 08xxxxxxxx or 02-xxx-xxxx)',
    };
  }
  if (digits.length !== 9 && digits.length !== 10) {
    return {
      ok: false,
      message: 'Thai phone number must be 9 or 10 digits including leading 0',
    };
  }
  return { ok: true, normalized: digits };
}
