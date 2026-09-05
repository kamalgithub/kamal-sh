import { describe, expect, it } from 'vitest';
import { buildResumeText } from './buildResumeText';
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
			booking: 'https://cal.com/ada',
			resumePdf: '/resume.pdf'
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
			projects: [
				{
					title: 'Bernoulli Numbers',
					description: 'Computed via the Engine.',
					technologies: ['Engine'],
					impact: 'First published algorithm.'
				}
			]
		}
	],
	education: [
		{
			degree: 'Mathematics',
			institution: 'Home tutoring',
			location: 'London',
			startDate: '1835',
			endDate: '1840',
			gpa: 'N/A'
		}
	],
	certifications: [{ name: 'Royal Society Fellow', issuer: 'Royal Society', year: 1840 }]
};

describe('buildResumeText', () => {
	it('includes identity, every role, and every education/certification entry', () => {
		const text = buildResumeText(data);

		expect(text).toContain('ADA LOVELACE');
		expect(text).toContain('Lead Analyst, Analytical Engines Ltd');
		expect(text).toContain('2020-01 to present');
		expect(text).toContain('Bernoulli Numbers: First published algorithm.');
		expect(text).toContain('Mathematics, Home tutoring');
		expect(text).toContain('Royal Society Fellow - Royal Society, 1840');
	});

	it('omits a certifications section entirely when there are none', () => {
		const text = buildResumeText({ ...data, certifications: [] });
		expect(text).not.toContain('CERTIFICATIONS');
	});
});
