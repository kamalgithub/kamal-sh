import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ArchitectureDiagram from './ArchitectureDiagram.svelte';
import type { ArchitectureNode } from '$lib/content/architecture.types';
import type { ArchitectureCopy } from '$lib/content/copy/architecture.types';

const copy: ArchitectureCopy = {
	heading: 'Heading',
	intro: 'Intro',
	flowLabel: 'Request path',
	crossCuttingLabel: 'Cross-cutting',
	rationaleLabel: 'Why it exists',
	tradeoffsLabel: 'Rejected alternatives'
};

const nodes: ArchitectureNode[] = [
	{
		id: 'gateway',
		label: 'Gateway',
		category: 'flow',
		summary: 'Gateway summary',
		rationale: 'Gateway rationale',
		tradeoffs: [{ considered: 'Direct calls', rejectedBecause: 'No shared policy' }]
	},
	{
		id: 'evals',
		label: 'Evals',
		category: 'cross-cutting',
		summary: 'Evals summary',
		rationale: 'Evals rationale',
		tradeoffs: []
	}
];

describe('ArchitectureDiagram.svelte', () => {
	it('shows the first node selected by default', async () => {
		await render(ArchitectureDiagram, { nodes, copy });
		await expect.element(page.getByText('Gateway rationale')).toBeInTheDocument();
	});

	it('switches the detail panel when a different node is selected', async () => {
		await render(ArchitectureDiagram, { nodes, copy });
		await page.getByRole('button', { name: 'Evals' }).click();

		await expect.element(page.getByText('Evals rationale')).toBeInTheDocument();
		await expect.element(page.getByText('Gateway rationale')).not.toBeInTheDocument();
	});

	it('omits the rejected-alternatives section when a node has none', async () => {
		await render(ArchitectureDiagram, { nodes, copy });
		await page.getByRole('button', { name: 'Evals' }).click();

		await expect.element(page.getByText('Rejected alternatives')).not.toBeInTheDocument();
	});
});
