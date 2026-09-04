import type { Testimonial } from './testimonials.types';

const RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/kamal18/details/recommendations';

// `quote` fields are paraphrased summaries, not verbatim text — swap in real
// quoted text (from RECOMMENDATIONS_URL) whenever it's available.
export const testimonials: Testimonial[] = [
	{
		name: 'Vathsa A S',
		role: 'Senior Technologist DevOps, Refinitiv/LSEG',
		date: '2025-08-11',
		quote:
			"Praises the depth of Kamal's cloud migration and architecture work, and his clear communication.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Srinaveen Srikakolapu',
		role: 'Cloud Platform Engineer',
		date: '2025-07-30',
		quote: "Highlights Kamal's technical depth, problem-solving, and collaborative spirit.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Subhasis Mukherjee',
		role: 'MultiCloud Data Architect / Engineering Manager',
		date: '2025-07-30',
		quote: "Calls out Kamal's DevOps/infra know-how and reliability as a technical leader.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Chitwan Singh Dhadwal',
		role: 'DevOps Engineer, EPAM',
		date: '2025-07-25',
		quote: "Notes Kamal's calm leadership and problem-solving mindset under pressure.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Babula Parida',
		role: 'Lead Cloud Platform Engineer',
		date: '2025-07-20',
		quote: "Describes Kamal's deep Azure understanding and strength as a mentor and collaborator.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Mikhail Lavoshnikov',
		role: 'Senior IT Project & Delivery Manager',
		date: '2025-07-18',
		quote:
			"Points to Kamal's combination of technical depth, operational discipline, and mentorship.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Navlesh Agarwal',
		role: 'Cloud Developer / Architect',
		date: '2025-07-18',
		quote: 'Calls Kamal reliable, forward-thinking, and calm under pressure.',
		sourceUrl: RECOMMENDATIONS_URL
	}
];
