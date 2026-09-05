import type { Certification } from './certifications.types';

// Sourced directly from the real LinkedIn certifications export (reverse-chronological,
// matching LinkedIn's own order). A few close-together, same-topic credentials are combined
// into one entry rather than listed separately — noted per entry below. Superseded renewals
// (e.g. an earlier Terraform Associate award before the current one) are dropped, keeping
// only the current credential.
export const certifications: Certification[] = [
	{ name: 'Azure Solutions Architect Expert', issuer: 'Microsoft', year: 2026 },
	{ name: 'Azure AI Apps and Agents Developer Associate', issuer: 'Microsoft', year: 2026 },
	{ name: 'Terraform Associate', issuer: 'HashiCorp', year: 2025 },
	{ name: 'Oracle Cloud Foundations Associate', issuer: 'Oracle', year: 2025 },
	// Combines three separate API Academy credentials issued the same month.
	{
		name: 'API Management Certifications (Product Manager, Security Architect, Designer)',
		issuer: 'API Academy',
		year: 2025
	},
	// Combines the Professional and Architect tiers of the same Gravitee credential.
	{
		name: 'Gravitee Event-Native API Management (Professional & Architect)',
		issuer: 'United Latino Students Association',
		year: 2025
	},
	{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'The Linux Foundation', year: 2025 },
	{ name: 'Azure Security Engineer Associate', issuer: 'Microsoft', year: 2023 },
	{ name: 'Lean Six Sigma White Belt', issuer: 'CSSC', year: 2023 },
	{ name: 'GitLab Certified CI/CD Associate', issuer: 'GitLab', year: 2023 },
	{ name: 'Azure Network Engineer Associate', issuer: 'Microsoft', year: 2023 },
	{ name: 'Azure AI Fundamentals', issuer: 'Microsoft', year: 2023 },
	{ name: 'Microsoft Certified Trainer (MCT)', issuer: 'Microsoft', year: 2022 },
	{ name: 'Azure DevOps Engineer Expert', issuer: 'Microsoft', year: 2021 },
	{ name: 'Azure Developer Associate', issuer: 'Microsoft', year: 2021 },
	{ name: 'Azure Architect Technologies (AZ-300)', issuer: 'Microsoft', year: 2019 },
	{ name: 'MCSA: Windows Server 2012', issuer: 'Microsoft', year: 2018 }
];
