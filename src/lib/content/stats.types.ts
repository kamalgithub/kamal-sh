/** A string key, not a component reference — content data stays framework-agnostic (see buildCommands.ts's CommandIcon for the same pattern). */
export type StatIcon =
	'users' | 'play' | 'calendar' | 'graduationCap' | 'trendingUp' | 'checkCircle';

export interface Stat {
	label: string;
	value: string;
	icon: StatIcon;
	/** When a manually-tracked value was last verified. Omitted for derived stats, which are always current. */
	asOf?: string;
}
