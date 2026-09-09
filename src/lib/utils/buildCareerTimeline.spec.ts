import { describe, expect, it } from 'vitest';
import { buildCareerTimeline } from './buildCareerTimeline';
import type { ExperienceRole } from '$lib/content/experience.types';
import type { EducationEntry } from '$lib/content/education.types';
import type { Certification } from '$lib/content/certifications.types';

function role(overrides: Partial<ExperienceRole> = {}): ExperienceRole {
	return {
		company: 'Acme',
		title: 'Engineer',
		startDate: '2020-01',
		endDate: 'present',
		location: 'Remote',
		summary: '',
		projects: [],
		...overrides
	};
}

function education(overrides: Partial<EducationEntry> = {}): EducationEntry {
	return {
		degree: 'BSc',
		institution: 'State University',
		location: 'Somewhere',
		startDate: '2015-08',
		endDate: '2019-06',
		gpa: '3.8',
		...overrides
	};
}

function cert(overrides: Partial<Certification> = {}): Certification {
	return { name: 'Cert', issuer: 'Issuer', year: 2021, ...overrides };
}

describe('buildCareerTimeline', () => {
	it('merges all three domains into one list', () => {
		const timeline = buildCareerTimeline([role()], [education()], [cert()]);
		expect(timeline).toHaveLength(3);
		expect(timeline.map((entry) => entry.kind).sort()).toEqual([
			'certification',
			'education',
			'experience'
		]);
	});

	it('sorts every entry newest-first by sortKey, across domains', () => {
		const timeline = buildCareerTimeline(
			[role({ startDate: '2022-06', company: 'Newer Co' })],
			[education({ startDate: '2015-08', institution: 'Older Uni' })],
			[cert({ year: 2019, name: 'Middle Cert' })]
		);

		expect(timeline.map((entry) => entry.label)).toEqual([
			'Engineer, Newer Co',
			'Middle Cert, Issuer',
			'BSc, Older Uni'
		]);
	});

	it('formats an ongoing role as "start to present"', () => {
		const [entry] = buildCareerTimeline(
			[role({ startDate: '2023-03', endDate: 'present' })],
			[],
			[]
		);
		expect(entry.year).toBe('2023 to present');
	});

	it('formats a finished role/education entry as "startYear to endYear"', () => {
		const [entry] = buildCareerTimeline(
			[],
			[education({ startDate: '2015-08', endDate: '2019-06' })],
			[]
		);
		expect(entry.year).toBe('2015 to 2019');
	});

	it('renders a certification as just its year, with a YYYY-01 sortKey', () => {
		const [entry] = buildCareerTimeline([], [], [cert({ year: 2022 })]);
		expect(entry.year).toBe('2022');
		expect(entry.sortKey).toBe('2022-01');
	});

	it('returns an empty list when given no data in any domain', () => {
		expect(buildCareerTimeline([], [], [])).toEqual([]);
	});
});
