import type { CostLineItem } from './costs.types';

// Engineering estimates from each vendor's published pricing, not invoice data —
// see copy/costs.ts's intro for why this is a forecast rather than a bill.
export const costLineItems: CostLineItem[] = [
	{
		label: 'Domain (kamal.sh)',
		monthlyEstimate: '~$2',
		note: 'Annual registration amortized monthly — .sh domains typically run $20–30/year.'
	},
	{
		label: 'Hosting (Cloudflare Workers)',
		monthlyEstimate: '$0',
		note: 'Free tier covers 100,000 requests/day, far beyond what a personal site needs.'
	},
	{
		label: 'Static assets & edge caching',
		monthlyEstimate: '$0',
		note: 'Included in the same Cloudflare Workers free tier as hosting.'
	},
	{
		label: 'Transactional email (Mailgun)',
		monthlyEstimate: '$0 (est.)',
		note: "Contact-form volume is low enough to stay on Mailgun's free tier. Account setup is still pending, so this is a forecast, not a bill."
	},
	{
		label: 'Fonts (Fraunces, Switzer)',
		monthlyEstimate: '$0',
		note: 'Self-hosted under the SIL Open Font License and a free Fontshare license — no font-hosting service in the loop.'
	},
	{
		label: 'Booking (Cal.com)',
		monthlyEstimate: '$0',
		note: "Cal.com's free tier. This site only links out to it — no paid API calls."
	}
];
