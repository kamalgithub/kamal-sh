export type HomeRole = 'recruiter' | 'engineer';
export type HomeSection = 'stats' | 'building' | 'testimonials';

/** The prerendered default — what a crawler or a visitor with no `?for=` param sees. */
const DEFAULT_ORDER: HomeSection[] = ['stats', 'building', 'testimonials'];

const ROLE_ORDERS: Record<HomeRole, HomeSection[]> = {
	// A recruiter scanning in six seconds wants proof of scale before proof of output.
	recruiter: ['stats', 'testimonials', 'building'],
	// An engineer evaluating craft wants to see the work itself first.
	engineer: ['building', 'stats', 'testimonials']
};

function isHomeRole(value: string): value is HomeRole {
	return value in ROLE_ORDERS;
}

/** Pure so it's trivially testable — the caller supplies the raw `?for=` value, nothing more. */
export function getHomeSectionOrder(forParam: string | null): HomeSection[] {
	if (forParam !== null && isHomeRole(forParam)) return ROLE_ORDERS[forParam];
	return DEFAULT_ORDER;
}
