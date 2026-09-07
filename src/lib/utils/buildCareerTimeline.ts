import type { ExperienceRole } from '$lib/content/experience.types';
import type { EducationEntry } from '$lib/content/education.types';
import type { Certification } from '$lib/content/certifications.types';

export interface CareerTimelineEntry {
	kind: 'experience' | 'education' | 'certification';
	/** 'YYYY-MM', descending-sortable as a plain string — never parsed as a real Date. */
	sortKey: string;
	year: string;
	label: string;
}

function formatYearRange(startDate: string, endDate: string): string {
	const startYear = startDate.slice(0, 4);
	return endDate === 'present'
		? `${startYear} to present`
		: `${startYear} to ${endDate.slice(0, 4)}`;
}

/**
 * Merges experience, education, and certifications into one reverse-chronological
 * overview — a fast "career at a glance" view. `ExperienceTimeline`, `EducationList`,
 * and `CertificationsGrid` remain the detailed, domain-specific views elsewhere on the
 * site; this is a summary, not a replacement for any of them.
 */
export function buildCareerTimeline(
	experience: ExperienceRole[],
	education: EducationEntry[],
	certifications: Certification[]
): CareerTimelineEntry[] {
	const entries: CareerTimelineEntry[] = [
		...experience.map((role) => ({
			kind: 'experience' as const,
			sortKey: role.startDate,
			year: formatYearRange(role.startDate, role.endDate),
			label: `${role.title}, ${role.company}`
		})),
		...education.map((entry) => ({
			kind: 'education' as const,
			sortKey: entry.startDate,
			year: formatYearRange(entry.startDate, entry.endDate),
			label: `${entry.degree}, ${entry.institution}`
		})),
		...certifications.map((cert) => ({
			kind: 'certification' as const,
			sortKey: `${cert.year}-01`,
			year: String(cert.year),
			label: `${cert.name}, ${cert.issuer}`
		}))
	];

	return entries.sort((a, b) => (a.sortKey < b.sortKey ? 1 : a.sortKey > b.sortKey ? -1 : 0));
}
