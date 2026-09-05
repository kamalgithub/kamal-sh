export interface Testimonial {
	name: string;
	role: string;
	date: string;
	/** Every recommendation on file is a genuine 5-star one — not a computed average,
	 *  a deliberate content decision (see docs/conventions.md's "Adding a new testimonial"). */
	rating: 5;
	/** Verbatim, from the real LinkedIn recommendation — see sourceUrl. */
	quote: string;
	/** The person's own LinkedIn profile, when known — absent is valid, never guessed. */
	profileUrl?: string;
	sourceUrl: string;
}
