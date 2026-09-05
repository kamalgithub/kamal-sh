export interface Testimonial {
	name: string;
	role: string;
	date: string;
	/** Verbatim, from the real LinkedIn recommendation — see sourceUrl. */
	quote: string;
	sourceUrl: string;
}
