import { error } from '@sveltejs/kit';
import { caseStudies } from '$lib/content/case-studies';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => caseStudies.map((study) => ({ slug: study.slug }));

export const load: PageLoad = ({ params }) => {
	const study = caseStudies.find((s) => s.slug === params.slug);
	if (!study) error(404, 'Case study not found');
	return { study };
};
