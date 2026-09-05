import { site } from '$lib/content/site';
import type { ResumeData } from './resume.types';

// Kept to bold/one-accent-color, deliberately — "should not look cluttered." Only ever
// used when the caller explicitly opts in (see options.color below); the default output
// stays plain ASCII so redirecting to a file or piping through a non-ANSI-aware tool
// never shows raw escape sequences. There is no reliable server-side way to detect
// whether a client's stdout is even a terminal, so this can never be an automatic default.
const ANSI_BOLD = '\x1b[1m';
const ANSI_BOLD_ACCENT = '\x1b[1;94m';
const ANSI_RESET = '\x1b[0m';

function bold(text: string, color: boolean): string {
	return color ? `${ANSI_BOLD}${text}${ANSI_RESET}` : text;
}

function boldAccent(text: string, color: boolean): string {
	return color ? `${ANSI_BOLD_ACCENT}${text}${ANSI_RESET}` : text;
}

function formatDateRange(startDate: string, endDate: string): string {
	return endDate === 'present' ? `${startDate} to present` : `${startDate} to ${endDate}`;
}

export interface BuildResumeTextOptions {
	/** ANSI bold/color on the name and section headers. Off by default — see the note above. */
	color?: boolean;
}

/** Plain-text résumé for `curl kamal.sh/resume` — ASCII-only by default, no unicode punctuation that can mis-render in a terminal. */
export function buildResumeText(
	{ profile, experience, education, certifications }: ResumeData,
	{ color = false }: BuildResumeTextOptions = {}
): string {
	const lines: string[] = [];

	lines.push(boldAccent(profile.name.toUpperCase(), color));
	lines.push(profile.title);
	lines.push(`${profile.location} | ${profile.email}`);
	lines.push(
		[profile.links.github, profile.links.linkedin]
			.map((url) => url.replace(/^https?:\/\//, ''))
			.join(' | ')
	);

	lines.push('', bold('EXPERIENCE', color));
	for (const role of experience) {
		lines.push('', `${role.title}, ${role.company}`);
		lines.push(`${formatDateRange(role.startDate, role.endDate)} | ${role.location}`);
		lines.push(role.summary);
		for (const project of role.projects) {
			lines.push(`  - ${project.title}: ${project.impact}`);
		}
	}

	lines.push('', bold('EDUCATION', color));
	for (const entry of education) {
		lines.push('', `${entry.degree}, ${entry.institution}`);
		lines.push(`${formatDateRange(entry.startDate, entry.endDate)} | ${entry.gpa}`);
	}

	if (certifications.length > 0) {
		lines.push('', bold('CERTIFICATIONS', color));
		for (const cert of certifications) {
			lines.push(`${cert.name} - ${cert.issuer}, ${cert.year}`);
		}
	}

	lines.push('', `Full site: ${site.url}`);
	lines.push(`Machine-readable: ${site.url}/resume.json`);

	return lines.join('\n') + '\n';
}
