import { site } from '$lib/content/site';
import type { ResumeData } from './resume.types';

function formatDateRange(startDate: string, endDate: string): string {
	return endDate === 'present' ? `${startDate} to present` : `${startDate} to ${endDate}`;
}

/** Plain-text résumé for `curl kamal.sh/resume` — ASCII-only, no unicode punctuation that can mis-render in a terminal. */
export function buildResumeText({
	profile,
	experience,
	education,
	certifications
}: ResumeData): string {
	const lines: string[] = [];

	lines.push(profile.name.toUpperCase());
	lines.push(profile.title);
	lines.push(`${profile.location} | ${profile.email}`);
	lines.push(
		[profile.links.github, profile.links.linkedin]
			.map((url) => url.replace(/^https?:\/\//, ''))
			.join(' | ')
	);

	lines.push('', 'EXPERIENCE');
	for (const role of experience) {
		lines.push('', `${role.title}, ${role.company}`);
		lines.push(`${formatDateRange(role.startDate, role.endDate)} | ${role.location}`);
		lines.push(role.summary);
		for (const project of role.projects) {
			lines.push(`  - ${project.title}: ${project.impact}`);
		}
	}

	lines.push('', 'EDUCATION');
	for (const entry of education) {
		lines.push('', `${entry.degree}, ${entry.institution}`);
		lines.push(`${formatDateRange(entry.startDate, entry.endDate)} | ${entry.gpa}`);
	}

	if (certifications.length > 0) {
		lines.push('', 'CERTIFICATIONS');
		for (const cert of certifications) {
			lines.push(`${cert.name} - ${cert.issuer}, ${cert.year}`);
		}
	}

	lines.push('', `Full site: ${site.url}`);
	lines.push(`Machine-readable: ${site.url}/resume.json`);

	return lines.join('\n') + '\n';
}
