import type { ArchitectureCopy } from './architecture.types';

export const architectureCopy: ArchitectureCopy = {
	heading: 'A reference architecture for an enterprise AI platform',
	intro:
		'My opinionated answer to "how would you build this for an enterprise" — a gateway, guardrails, governance, evals, and cost control treated as load-bearing parts of the system, not things bolted on after the first incident. This is a design artifact, not a description of a system running in production. Select a stage to see the decision behind it and the alternatives I\'d reject.',
	flowLabel: 'Request path',
	crossCuttingLabel: 'Applies to every request',
	rationaleLabel: 'Why it exists',
	tradeoffsLabel: 'Rejected alternatives'
};
