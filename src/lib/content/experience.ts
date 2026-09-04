import type { ExperienceRole } from './experience.types';

// Reverse-chronological.
export const experience: ExperienceRole[] = [
	{
		company: 'LexisNexis Risk Solutions',
		title: 'Principal Consultant – Cloud & SRE',
		startDate: '2026-01',
		endDate: 'present',
		location: 'Remote, India',
		summary:
			'Leading cloud security posture governance, CI/CD automation, and platform engineering with SRE best practices.',
		projects: [
			{
				title: 'Security Posture Modernization',
				description: 'Enterprise-wide security policies with automated compliance.',
				technologies: ['Terraform', 'Policy as Code'],
				impact: 'Significantly reduced security vulnerabilities and enforced continuous compliance.'
			},
			{
				title: 'CI/CD & Automation Overhaul',
				description: 'DevSecOps pipelines across the platform.',
				technologies: ['Python'],
				impact: 'Improved deployment velocity while ensuring zero-trust security principles.'
			}
		]
	},
	{
		company: 'McCain Foods',
		title: 'Cloud Engineer (A4 – Lead)',
		startDate: '2025-08',
		endDate: '2025-12',
		location: 'Gurugram, India',
		summary:
			'Cloud adoption program migrating 70+ on-prem applications with new governance frameworks.',
		projects: [
			{
				title: 'Enterprise Cloud Migration',
				description: 'Migrated 70+ on-prem applications to Azure.',
				technologies: ['Azure', 'Azure Migrate', 'Terraform'],
				impact: 'Minimal disruption, optimized cost.'
			},
			{
				title: 'Security Governance Framework',
				description: 'Org-wide cloud security governance.',
				technologies: ['Azure Policy', 'Defender for Cloud', 'Sentinel'],
				impact: 'Reduced risk surface.'
			}
		]
	},
	{
		company: 'EPAM Systems',
		title: 'Cloud Migration & DevOps Lead',
		startDate: '2022-06',
		endDate: '2025-08',
		location: 'Gurugram, Haryana, India',
		summary:
			'Led zero-downtime migration of a 30-component Java/C++ monolith to AKS serving 100K+ daily users.',
		projects: [
			{
				title: 'Monolith to Microservices (AKS)',
				description: 'Zero-downtime migration of a 30-component Java/C++ monolith to AKS.',
				technologies: ['AKS', 'Docker', 'Java', 'C++'],
				impact: '99.99% reliability for 100K+ daily users.'
			},
			{
				title: 'FinOps Optimization',
				description: 'Cloud cost optimization program.',
				technologies: ['Azure Cost Management', 'Kubecost'],
				impact: '$1.4M annual savings (25% cost reduction).'
			},
			{
				title: 'GitLab CI/CD & ArgoCD Pipeline',
				description: 'GitOps-based delivery pipeline.',
				technologies: ['GitLab', 'ArgoCD', 'Terraform'],
				impact: '70% faster provisioning, 94% faster deployments.'
			}
		]
	},
	{
		company: 'ITC Infotech',
		title: 'DevOps Engineer',
		startDate: '2018-10',
		endDate: '2022-06',
		location: 'Gurugram, Haryana, India',
		summary: 'Infrastructure standardization and automation across 15+ environments.',
		projects: [
			{
				title: 'Infrastructure Standardization',
				description: '50+ Terraform modules across 15+ environments.',
				technologies: ['Terraform', 'Azure'],
				impact:
					'50+ automated workflows, 60% efficiency gain, 45% faster releases via Azure DevOps.'
			},
			{
				title: 'Security Hardening',
				description: 'Automated security scanning and policy enforcement.',
				technologies: ['Trivy', 'Azure Policy'],
				impact: '40% fewer security incidents.'
			}
		]
	},
	{
		company: 'Collabera Technologies',
		title: 'Systems Engineer',
		startDate: '2017-04',
		endDate: '2018-10',
		location: 'New Delhi, India',
		summary: 'Branch infrastructure setup and operations across 200+ locations.',
		projects: [
			{
				title: 'Branch Infrastructure Setup',
				description: 'Led setup for 50+ new branch offices, deploying 100+ hardened servers.',
				technologies: ['Windows Server', 'Linux', 'Networking'],
				impact: '99.9% uptime across 200+ branch locations.'
			}
		]
	}
];
