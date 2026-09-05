import type { Profile } from '$lib/content/profile.types';
import type { ExperienceRole } from '$lib/content/experience.types';
import type { EducationEntry } from '$lib/content/education.types';
import type { Certification } from '$lib/content/certifications.types';

/** Shared input shape for every /resume.* output format — one content source, three renderers. */
export interface ResumeData {
	profile: Profile;
	experience: ExperienceRole[];
	education: EducationEntry[];
	certifications: Certification[];
}
