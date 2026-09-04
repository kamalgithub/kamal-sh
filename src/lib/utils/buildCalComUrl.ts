export function buildCalComUrl(username: string, durationMinutes: number, slot: Date): string {
	return `https://cal.com/${username}/${durationMinutes}min?slot=${encodeURIComponent(slot.toISOString())}`;
}
