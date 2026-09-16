import { countryCallingCodes } from '$lib/content/countryCodes';

/** E.164 allows at most 15 digits total (country code + subscriber number), so '+' plus
 *  up to 15 digits is the absolute ceiling — see ITU-T E.164. */
export const E164_PATTERN = /^\+[1-9]\d{1,14}$/;

/** Combines a country's calling code with a visitor-typed local number into a single
 *  E.164 string ('+<dialCode><digits>'). Strips everything but digits from the local
 *  part first — visitors type all sorts of formats (spaces, dashes, parens). Returns
 *  undefined if the country isn't recognized, the local number is empty, or the
 *  combined result doesn't fit E.164's own length limit. */
export function buildE164Phone(countryIso2: string, localNumber: string): string | undefined {
	const country = countryCallingCodes.find((c) => c.iso2 === countryIso2);
	if (!country) return undefined;

	const digits = localNumber.replace(/\D/g, '');
	if (!digits) return undefined;

	const combined = `+${country.dialCode}${digits}`;
	return E164_PATTERN.test(combined) ? combined : undefined;
}
