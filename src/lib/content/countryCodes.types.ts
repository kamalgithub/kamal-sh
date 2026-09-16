export interface CountryCallingCode {
	/** ISO 3166-1 alpha-2, used as the option value/key — stable even if a country renames. */
	iso2: string;
	/** E.164 calling code, digits only, no leading '+' (e.g. '91' for India). */
	dialCode: string;
	name: string;
}
