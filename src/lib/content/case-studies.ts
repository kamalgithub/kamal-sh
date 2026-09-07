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
			},
			{
				type: 'tradeoffs',
				heading: 'Constraints and tradeoffs',
				considered: [
					{
						option: 'A big-bang cutover — migrate everything in one release window',
						rejectedBecause:
							'For a 100K+ daily-user platform, one cutover turns any single migration defect into a full outage instead of a contained one. The zero-downtime requirement ruled this out by itself.'
					},
					{
						option: 'Lift-and-shift to VMs instead of Kubernetes',
						rejectedBecause:
							'Would have avoided the AKS learning curve, but kept the same deployment model that made independent scaling and independent deploys impossible in the first place — it treats the symptom, not the monolith.'
					},
					{
						option: 'Rewrite in a different language before migrating',
						rejectedBecause:
							'Combining a language rewrite with an infrastructure migration doubles the risk surface at once. The Java/C++ code stayed as-is; only the deployment unit changed.'
					}
				],
				whatIdChangeNow:
					"I'd invest earlier in the synthetic-traffic validation harness that checked each decomposed service before its cutover — it existed, but arrived a few services later than it should have."
			}
		],
		image: {
			src: '/images/case-studies/aks-migration.webp',
			darkSrc: '/images/case-studies/aks-migration-dark.webp',
			alt: 'Before/after diagram: a single 30-component Java/C++ monolith decomposed into independent services on AKS, with 99.99% reliability, 94% faster deployments, and 70% faster provisioning after migration.'
		}
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
			},
			{
				type: 'tradeoffs',
				heading: 'Constraints and tradeoffs',
				considered: [
					{
						option: 'An org-wide spending freeze',
						rejectedBecause:
							'A freeze buys time, not durable behavior change — the same cost drift returns the moment the freeze lifts.'
					},
					{
						option: 'Commit to reserved instances or savings plans immediately',
						rejectedBecause:
							'Committing to reserved capacity before rightsizing just locks in the waste at a discount. Visibility and rightsizing had to come first, or the reservation would have been sized against an inflated baseline.'
					}
				],
				whatIdChangeNow:
					"I'd tie the Kubecost dashboards to a per-team digest from day one instead of a monthly review — the fastest way to keep a cost win from eroding is making it visible to the people generating the spend, not just to the platform team."
			}
		],
		image: {
			src: '/images/case-studies/finops-savings.webp',
			darkSrc: '/images/case-studies/finops-savings-dark.webp',
			alt: 'Diagram of the FinOps program: Kubecost visibility, workload rightsizing, and sustained control via Azure Cost Management, resulting in $1.4M+ annual savings and a 25% cost reduction.'
		}
	}
];
