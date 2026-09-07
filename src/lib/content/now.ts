import type { NowStatus } from './now.types';

// Update by hand whenever what's actually true here changes — see /now's honest,
// infrequently-updated framing in copy/now.ts. Only real, current facts belong here,
// never a plausible-sounding placeholder.
export const nowStatus: NowStatus = {
	updatedAt: '2026-09-05',
	items: [
		{
			label: 'Day job',
			detail: 'Principal Consultant – Cloud & SRE at LexisNexis Risk Solutions, remote from India.'
		},
		{
			label: 'Building',
			detail: 'This site — kamal.sh, mostly through AI-agent pairing sessions, in the open.'
		},
		{
			label: 'Teaching',
			detail: 'Running Aicademy — practical cloud and DevOps courses, plus a YouTube channel.'
		}
	]
};
