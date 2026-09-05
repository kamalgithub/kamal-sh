/** Shared shape for every image-carrying content field (profile photo, case-study diagram, product screenshot). */
export interface ContentImage {
	src: string;
	alt: string;
	/** Shown when the visitor is in dark mode. Omit for images that don't need a separate variant — `src` covers both. */
	darkSrc?: string;
}
