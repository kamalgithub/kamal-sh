const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// RFC 5321's own limit on a full email address — a bound on the format check below, not a separate rule.
const EMAIL_MAX_LENGTH = 254;

/** A pragmatic format check, not full RFC 5321 validation — good enough to catch typos
 *  and garbage input before it reaches Mailjet, which does its own real validation. */
export function isValidEmail(email: string): boolean {
	return email.length > 0 && email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email);
}
