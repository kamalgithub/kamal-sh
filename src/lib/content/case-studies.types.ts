import type { ContentImage } from './image.types';

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

export interface CaseStudyTradeoff {
	option: string;
	rejectedBecause: string;
}

export interface CaseStudyTradeoffsBlock {
	type: 'tradeoffs';
	heading: string;
	considered: CaseStudyTradeoff[];
	whatIdChangeNow: string;
}

export type CaseStudyBlock =
	CaseStudyNarrativeBlock | CaseStudyStatGridBlock | CaseStudyTradeoffsBlock;

export interface CaseStudy {
	slug: string;
	title: string;
	company: string;
	summary: string;
	technologies: string[];
	blocks: CaseStudyBlock[];
	/** Absent until a real architecture diagram/screenshot is dropped in. */
	image?: ContentImage;
}
