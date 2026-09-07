import type { UsesCategory } from './uses.types';

// Real, verifiable tooling only — either what this site is literally built with (see
// package.json) or what src/lib/content/experience.ts and certifications.ts already
// name for day-job cloud/DevOps work. No invented hardware, editor, or terminal
// specifics — add those by hand if/when they're worth naming.
export const usesCategories: UsesCategory[] = [
	{
		heading: 'Cloud & DevOps',
		tools: [
			{ name: 'Azure', detail: 'Primary cloud, day to day — AKS, Azure DevOps, Azure Policy.' },
			{ name: 'Terraform', detail: 'Infrastructure as code across every environment I run.' },
			{ name: 'Kubernetes / AKS', detail: 'Container orchestration for production workloads.' },
			{ name: 'ArgoCD', detail: 'GitOps-based delivery.' },
			{ name: 'GitLab CI/CD', detail: 'Pipeline automation.' },
			{ name: 'Kubecost', detail: 'Per-workload cloud cost visibility.' }
		]
	},
	{
		heading: 'Building kamal.sh',
		tools: [
			{ name: 'SvelteKit / Svelte 5', detail: 'This site’s framework, runes mode throughout.' },
			{ name: 'TypeScript', detail: 'Strict mode, no `any`.' },
			{ name: 'Tailwind CSS v4', detail: 'CSS-first config, no tailwind.config.js.' },
			{ name: 'Cloudflare Workers', detail: 'Hosting, via @sveltejs/adapter-cloudflare.' },
			{ name: 'bun', detail: 'Package manager and script runner.' },
			{
				name: 'Claude Code',
				detail: 'This entire site is built and maintained through AI-agent pairing sessions.'
			}
		]
	}
];
