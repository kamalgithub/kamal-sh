import { describe, expect, it } from 'vitest';
import { buildResumeMarkdown } from './buildResumeMarkdown';
import type { ResumeData } from './resume.types';

const data: ResumeData = {
	profile: {
		name: 'Ada Lovelace',
		title: 'Analyst',
		tagline: 'Tagline',
		location: 'London, UK',
		timezone: 'UTC+00:00',
		email: 'ada@example.com',
		links: {
			linkedin: 'https://linkedin.com/in/ada',
			github: 'https://github.com/ada',
			youtube: 'https://youtube.com/@ada',
			booking: 'https://cal.com/ada'
		},
		socials: []
	},
	experience: [
		{
			company: 'Analytical Engines Ltd',
			title: 'Lead Analyst',
			startDate: '2020-01',
			endDate: 'present',
			location: 'London',
			summary: 'Wrote the first algorithm.',
			projects: []
		}
	],
	education: [],
	certifications: []
};

describe('buildResumeMarkdown', () => {
	it('renders a markdown heading per role and links back to the site', () => {
		const markdown = buildResumeMarkdown(data);

		expect(markdown).toContain('# Ada Lovelace');
		expect(markdown).toContain('### Lead Analyst, Analytical Engines Ltd');
		expect(markdown).toContain('[Full site](https://kamal.sh)');
		expect(markdown).toContain('[JSON](https://kamal.sh/resume.json)');
	});

	it('omits the certifications section when there are none', () => {
		const markdown = buildResumeMarkdown(data);
		expect(markdown).not.toContain('## Certifications');
	});
});
