export interface CaseStudyNarrativeBlock {
	type: 'narrative';
	heading: string;
	body: string;
}

export interface CaseStudyStat {
	label: string;
	value: string;
}

export interface CaseStudyStatGridBlock {
	type: 'stat-grid';
	stats: CaseStudyStat[];
}

export type CaseStudyBlock = CaseStudyNarrativeBlock | CaseStudyStatGridBlock;

export interface CaseStudy {
	slug: string;
	title: string;
	company: string;
	summary: string;
	technologies: string[];
	blocks: CaseStudyBlock[];
}
