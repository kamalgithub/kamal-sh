export interface Testimonial {
	name: string;
	role: string;
	date: string;
	/** A paraphrased summary, not a verbatim quote — see sourceUrl for the real text. */
	quote: string;
	sourceUrl: string;
}
