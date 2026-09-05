import type { CaseStudy } from '$lib/content/case-studies.types';
import { site } from '$lib/content/site';

export function buildCaseStudyJsonLd(study: CaseStudy): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: study.title,
		about: study.company,
		description: study.summary,
		keywords: study.technologies.join(', '),
		url: `${site.url}/work/${study.slug}`,
		author: { '@id': `${site.url}/#person` }
	};
}
