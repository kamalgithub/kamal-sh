export interface ArchitectureTradeoff {
	considered: string;
	rejectedBecause: string;
}

/** 'flow' nodes sit on the request path, left to right; 'cross-cutting' nodes apply to every request. */
export type ArchitectureNodeCategory = 'flow' | 'cross-cutting';

export interface ArchitectureNode {
	id: string;
	label: string;
	category: ArchitectureNodeCategory;
	summary: string;
	rationale: string;
	tradeoffs: ArchitectureTradeoff[];
}
