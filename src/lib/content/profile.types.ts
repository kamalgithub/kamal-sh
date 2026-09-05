import type { ContentImage } from './image.types';

export interface ProfileLinks {
	linkedin: string;
	github: string;
	youtube: string;
	booking: string;
	resumePdf: string;
}

export interface ProfileSocial {
	label: string;
	url: string;
}

export interface Profile {
	name: string;
	title: string;
	tagline: string;
	location: string;
	timezone: string;
	email: string;
	links: ProfileLinks;
	socials: ProfileSocial[];
	/** Absent until a real portrait is dropped in — Hero renders a placeholder instead of skipping the slot. */
	photo?: ContentImage;
}
