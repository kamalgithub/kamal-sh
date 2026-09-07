export interface UsesTool {
	name: string;
	detail: string;
}

export interface UsesCategory {
	heading: string;
	tools: UsesTool[];
}
