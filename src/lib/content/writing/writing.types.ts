export interface WritingPost {
	title: string;
	link: string;
	pubDate: string;
	slug: string;
	/** Inferred by convention, not guaranteed to exist — handle a failed image load gracefully. */
	thumbnail: string;
}
