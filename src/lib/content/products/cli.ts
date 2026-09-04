import type { Product } from './product.types';

export const cli: Product = {
	slug: 'cli',
	name: 'Aicademy CLI',
	tagline: 'Spin up real, broken Kubernetes clusters on your own machine — and verify your fix.',
	description:
		'The Aicademy CLI launches and creates Aicademy Labs locally: it installs Docker, kind, and kubectl, spins up a deliberately broken cluster matching a specific lab scenario, and ships a verify command to check whether your solution actually fixed it.',
	highlights: [
		'Installs and configures Docker, kind, kubectl automatically',
		'Spins up a deliberately broken cluster per lab scenario',
		'`verify` command checks your solution against the lab objective'
	],
	links: [],
	installCommand: 'uv tool install aicademy'
};
