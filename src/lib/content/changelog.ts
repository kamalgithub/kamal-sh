import type { ChangelogEntry } from './changelog.types';

// A curated, public-facing summary of real changes to this site — not a raw git log
// dump (see git history for that level of detail). Reverse-chronological. An empty
// array is a valid state (see /postmortems for the same honest-empty-state pattern);
// this one just isn't empty yet.
export const changelog: ChangelogEntry[] = [
	{
		slug: 'short-links',
		date: '2026-09-05',
		title: 'One-line short links',
		description:
			'kamal.sh/linkedin, /github, /youtube and any future short redirect now come from a single data file instead of a hand-written route per link — adding a new one is a one-line change, not a new file.'
	},
	{
		slug: 'seo-and-humor',
		date: '2026-09-05',
		title: 'SEO tags and a little humor',
		description:
			'Open Graph and Twitter Card previews, canonical tags, a proper custom 404 page, and a small console easter egg for anyone who opens devtools.'
	},
	{
		slug: 'booking-calendar',
		date: '2026-09-05',
		title: 'A real booking calendar',
		description:
			"Replaced the contact page's placeholder date picker with an actual month-view calendar — out-of-window dates fade instead of just disappearing."
	},
	{
		slug: 'contact-form-hardening',
		date: '2026-09-05',
		title: 'Contact form: bot protection and rate limiting',
		description:
			'Cloudflare Turnstile plus a 2-messages-per-4-hours cap, enforced both client- and server-side, so the form stays usable without becoming a spam target.'
	},
	{
		slug: 'real-testimonials',
		date: '2026-09-05',
		title: 'Real testimonials, linked back to LinkedIn',
		description:
			"28 real recommendations, every one a genuine 5-star rating, most linked to the recommender's own LinkedIn profile."
	},
	{
		slug: 'editorial-redesign',
		date: '2026-09-05',
		title: 'An editorial visual redesign',
		description:
			'Replaced an earlier glassmorphism/gradient look with hairline-divided lists, a serif display face, and one restrained accent color — see /uses for the stack this runs on.'
	}
];
