export interface ArchitectureTradeoff {
	considered: string;
	rejectedBecause: string;
}

/** 'flow' nodes sit on the request path, left to right; 'cross-cutting' nodes apply to every request. */
export type ArchitectureNodeCategory = 'flow' | 'cross-cutting';

/**
 * A string key, not a component reference — content data stays framework-agnostic.
 * ArchitectureDiagram.svelte owns the key-to-icon mapping. Reused across nodes on
 * purpose where it's true (e.g. 'shield' on every protective boundary) — it's meant
 * to let a reader visually group node types at a glance, not a one-off decoration.
 */
export type ArchitectureNodeIcon = 'layers' | 'shield' | 'gauge' | 'checkCircle' | 'activity';

export interface ArchitectureNode {
	id: string;
	label: string;
	category: ArchitectureNodeCategory;
	icon: ArchitectureNodeIcon;
	summary: string;
	rationale: string;
	tradeoffs: ArchitectureTradeoff[];
}
