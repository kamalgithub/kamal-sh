import { site } from '$lib/content/site';
import type { ResumeData } from './resume.types';

function formatDateRange(startDate: string, endDate: string): string {
	return endDate === 'present' ? `${startDate} to present` : `${startDate} to ${endDate}`;
}

/** Markdown résumé for /resume.md — agent/LLM-retrieval surface, same data as buildResumeText. */
export function buildResumeMarkdown({
	profile,
	experience,
	education,
	certifications
}: ResumeData): string {
	const lines: string[] = [];

	lines.push(`# ${profile.name}`, '', profile.title, '', `${profile.location} — ${profile.email}`);

	lines.push('', '## Experience');
	for (const role of experience) {
		lines.push('', `### ${role.title}, ${role.company}`);
		lines.push(`${formatDateRange(role.startDate, role.endDate)} — ${role.location}`, '');
		lines.push(role.summary);
		for (const project of role.projects) {
			lines.push(`- **${project.title}**: ${project.impact}`);
		}
	}

	lines.push('', '## Education');
	for (const entry of education) {
		lines.push('', `### ${entry.degree}, ${entry.institution}`);
		lines.push(`${formatDateRange(entry.startDate, entry.endDate)} — ${entry.gpa}`);
	}

	if (certifications.length > 0) {
		lines.push('', '## Certifications');
		for (const cert of certifications) {
			lines.push(`- ${cert.name} — ${cert.issuer}, ${cert.year}`);
		}
	}

	lines.push('', `[Full site](${site.url}) · [JSON](${site.url}/resume.json)`);

	return lines.join('\n') + '\n';
}
