export interface ProductLink {
	label: string;
	url: string;
}

export interface ProductCta {
	label: string;
	url: string;
}

export interface ProductImage {
	src: string;
	alt: string;
}

export interface Product {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	highlights: string[];
	/** Real hyperlinks only — an install command is not a link, see installCommand. */
	links: ProductLink[];
	/** Shown as an unlinked code snippet, not a hyperlink, e.g. "pip install spch". */
	installCommand?: string;
	/** Not every product has one — the primary call-to-action button, when there is one. */
	primaryCta?: ProductCta;
	/** Absent until a real screenshot/logo is dropped in. */
	image?: ProductImage;
}
