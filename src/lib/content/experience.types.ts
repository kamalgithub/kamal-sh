export interface ExperienceProject {
	title: string;
	description: string;
	technologies: string[];
	impact: string;
}

export interface ExperienceRole {
	company: string;
	title: string;
	startDate: string;
	/** ISO 'YYYY-MM', or 'present' for the current role. */
	endDate: string;
	location: string;
	summary: string;
	projects: ExperienceProject[];
}
