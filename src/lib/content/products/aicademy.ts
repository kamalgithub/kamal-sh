import type { Product } from './product.types';

export const aicademy: Product = {
	slug: 'aicademy',
	name: 'Aicademy',
	tagline: 'Practical-only learning for AI Engineers and Cloud practitioners.',
	description:
		'Aicademy is an ed-tech platform built entirely around hands-on practice: 400+ projects across an AI Engineer track (50 projects) and an AI Architect track (50 projects), plus Aicademy Labs — around 100 hands-on labs each for CKA, CKS, and CKAD, and still growing. Weekend workshops are instructed live by Kamal.',
	highlights: [
		'50 hands-on projects — AI Engineer track',
		'50 hands-on projects — AI Architect track',
		'100 labs each for CKA, CKS, CKAD (growing)',
		'Weekend workshops, instructed live'
	],
	links: [
		{ label: 'Labs', url: 'https://www.aicademy.ac/labs' },
		{ label: 'YouTube', url: 'https://youtube.com/@aicademy-ac' },
		{ label: 'Blog', url: 'https://blog.aicademy.ac' }
	],
	primaryCta: { label: 'Workshops', url: 'https://www.aicademy.ac/workshops' },
	image: {
		src: '/images/products/aicademy.webp',
		darkSrc: '/images/products/aicademy-dark.webp',
		alt: 'Aicademy overview: 50 hands-on projects each in the AI Engineer and AI Architect tracks, 100+ hands-on labs each for CKA, CKS, and CKAD, and live weekend workshops.'
	}
};
