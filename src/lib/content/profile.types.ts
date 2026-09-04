export interface ProfileLinks {
	linkedin: string;
	github: string;
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
}
