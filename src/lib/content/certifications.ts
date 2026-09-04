import type { Certification } from './certifications.types';

// Always read the count via certifications.length — never hardcode it elsewhere.
export const certifications: Certification[] = [
	{ name: 'Terraform Associate', issuer: 'HashiCorp', year: 2024 },
	{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', year: 2024 },
	{ name: 'Azure Security Engineer Associate (AZ-500)', issuer: 'Microsoft', year: 2023 },
	{ name: 'Azure DevOps Expert (AZ-400)', issuer: 'Microsoft', year: 2023 },
	{ name: 'Azure Developer Associate (AZ-204)', issuer: 'Microsoft', year: 2023 },
	{ name: 'Azure Network Engineer Associate (AZ-700)', issuer: 'Microsoft', year: 2023 },
	{ name: 'Azure Administrator Associate (AZ-104)', issuer: 'Microsoft', year: 2023 },
	{ name: 'Solutions Architect Technologies (AZ-300)', issuer: 'Microsoft', year: 2021 }
];
