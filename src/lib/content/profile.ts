import type { Profile } from './profile.types';

export const profile: Profile = {
	name: 'Kamal Kumar',
	title: 'Builder — Cloud & DevOps Engineer',
	tagline: 'I build practical, hands-on tools and teach the way I wish I had been taught.',
	location: 'Delhi, India',
	timezone: 'UTC+05:30',
	email: 'kamal@kamal.sh',
	links: {
		linkedin: 'https://www.linkedin.com/in/kamal18',
		github: 'https://github.com/devcrypted',
		youtube: 'https://youtube.com/@aicademy-ac',
		booking: 'https://cal.com/kamalk'
	},
	socials: [
		{ label: 'GitHub', url: 'https://github.com/devcrypted' },
		{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/kamal18' },
		{ label: 'YouTube', url: 'https://youtube.com/@aicademy-ac' }
	],
	photo: { src: '/images/portrait.jpg', alt: 'Kamal Kumar' }
};
