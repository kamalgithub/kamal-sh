import type { Profile } from '$lib/content/profile.types';
import { site } from '$lib/content/site';

/** Person + WebSite in one @graph — sourced entirely from profile.ts, never duplicated content. */
export function buildPersonJsonLd(profile: Profile): object {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': `${site.url}/#person`,
				name: profile.name,
				jobTitle: profile.title,
				url: site.url,
				email: `mailto:${profile.email}`,
				address: { '@type': 'PostalAddress', addressLocality: profile.location },
				sameAs: profile.socials.map((social) => social.url),
				...(profile.photo ? { image: `${site.url}${profile.photo.src}` } : {})
			},
			{
				'@type': 'WebSite',
				'@id': `${site.url}/#website`,
				url: site.url,
				name: profile.name,
				description: profile.tagline,
				author: { '@id': `${site.url}/#person` }
			}
		]
	};
}
