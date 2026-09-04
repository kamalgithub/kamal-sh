import type { CaseStudy } from './case-studies.types';

export const caseStudies: CaseStudy[] = [
	{
		slug: 'aks-migration',
		title: 'Zero-downtime migration of a 30-component monolith to AKS',
		company: 'EPAM Systems',
		summary:
			'Migrating a 30-component Java/C++ monolith to Kubernetes without downtime, for a platform serving 100K+ daily users.',
		technologies: ['AKS', 'Docker', 'Java', 'C++', 'ArgoCD', 'Terraform'],
		blocks: [
			{
				type: 'narrative',
				heading: 'The problem',
				body: 'A 30-component Java/C++ monolith was the single point of failure for a platform used by 100K+ people daily. Every deploy carried real downtime risk, and scaling meant scaling the whole system at once.'
			},
			{
				type: 'stat-grid',
				stats: [
					{ label: 'Reliability post-migration', value: '99.99%' },
					{ label: 'Deployment speed', value: '94% faster' },
					{ label: 'Provisioning speed', value: '70% faster' }
				]
			},
			{
				type: 'narrative',
				heading: 'The approach',
				body: 'Decomposed the monolith into independently deployable services on AKS, backed by a GitLab CI/CD and ArgoCD GitOps pipeline, with infrastructure defined in Terraform end to end.'
			}
		]
	},
	{
		slug: 'finops-savings',
		title: '$1.4M in annual cloud savings without sacrificing reliability',
		company: 'EPAM Systems',
		summary: 'A FinOps program that cut cloud spend by 25% while reliability targets held steady.',
		technologies: ['Azure Cost Management', 'Kubecost'],
		blocks: [
			{
				type: 'narrative',
				heading: 'The problem',
				body: 'Cloud spend had grown alongside the platform without a corresponding cost-governance discipline — the usual story of infrastructure that scaled faster than its cost visibility.'
			},
			{
				type: 'stat-grid',
				stats: [
					{ label: 'Annual savings', value: '$1.4M+' },
					{ label: 'Cost reduction', value: '25%' }
				]
			},
			{
				type: 'narrative',
				heading: 'The approach',
				body: 'Introduced per-workload cost visibility with Kubecost, rightsized resources against real usage, and used Azure Cost Management to keep the gains from eroding after the initial cleanup.'
			}
		]
	}
];
