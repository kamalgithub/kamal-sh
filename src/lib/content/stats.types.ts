export interface Stat {
	label: string;
	value: string;
	/** When a manually-tracked value was last verified. Omitted for derived stats, which are always current. */
	asOf?: string;
}
