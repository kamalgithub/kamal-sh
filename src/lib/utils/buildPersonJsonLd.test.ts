import { describe, expect, it } from 'vitest';
import { buildPersonJsonLd } from './buildPersonJsonLd';
import type { Profile } from '$lib/content/profile.types';

const BASE_PROFILE: Profile = {
	name: 'Ada Lovelace',
	title: 'Engineer',
	tagline: 'Builds things.',
	location: 'London',
	timezone: 'UTC+0',
	email: 'ada@example.com',
	links: {
		linkedin: 'https://linkedin.com/in/ada',
		github: 'https://github.com/ada',
		youtube: 'https://youtube.com/@ada',
		booking: 'https://cal.com/ada',
		resumePdf: '/resume.pdf'
	},
	socials: [{ label: 'GitHub', url: 'https://github.com/ada' }]
};

describe('buildPersonJsonLd', () => {
	it('includes the real photo as the Person image when one is set', () => {
		const jsonLd = buildPersonJsonLd({
			...BASE_PROFILE,
			photo: { src: '/images/portrait.jpg', alt: 'Ada' }
		}) as { '@graph': Array<{ '@type': string; image?: string }> };

		const person = jsonLd['@graph'].find((entry) => entry['@type'] === 'Person');
		expect(person?.image).toBe('https://kamal.sh/images/portrait.jpg');
	});

	it('omits the image field entirely when no photo is set', () => {
		const jsonLd = buildPersonJsonLd(BASE_PROFILE) as {
			'@graph': Array<{ '@type': string; image?: string }>;
		};

		const person = jsonLd['@graph'].find((entry) => entry['@type'] === 'Person');
		expect(person?.image).toBeUndefined();
	});
});
