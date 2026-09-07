export interface NowItem {
	label: string;
	detail: string;
}

export interface NowStatus {
	/** ISO 'YYYY-MM-DD' — shown so a visitor knows how stale this page might be. */
	updatedAt: string;
	items: NowItem[];
}
