import { profile } from './profile';
import type { Testimonial } from './testimonials.types';

// Derived from the same LinkedIn URL already in profile.ts, not duplicated as a new constant.
const RECOMMENDATIONS_URL = `${profile.links.linkedin}/details/recommendations`;

// Verbatim text from real LinkedIn recommendations (reverse-chronological, matching
// LinkedIn's own order). Role labels are trimmed to the clearest identifying part of
// each person's LinkedIn headline — a couple of headlines have since changed to an
// unrelated field, so those use a plain "Former Manager"/role-at-the-time label instead.
export const testimonials: Testimonial[] = [
	{
		name: 'Aditya Shah',
		role: 'Software Engineer, McCain GDTC',
		date: '2026-02-06',
		rating: 5,
		quote:
			'I had the pleasure of working with Kamal at McCain Foods, where he consistently demonstrated exceptional skills as a Cloud & DevSecOps Engineer. He is an excellent engineer with strong problem solving skills, approaching cloud and infrastructure challenges with clarity, efficiency, and a solid understanding of real world systems. Along with his technical expertise, he was an excellent mentor who took the time to guide me through core cloud and DevSecOps concepts, reviews, and real world best practices. His willingness to share knowledge and provide constructive feedback had a huge impact on my learning and growth. Any team would be fortunate to have someone with his depth of expertise, leadership, and collaborative mindset.',
		profileUrl: 'https://www.linkedin.com/in/adityashah2004',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Vani Rao',
		role: 'Software Development Engineer, McCain GTDC',
		date: '2026-01-25',
		rating: 5,
		quote:
			'I worked with Kamal at McCain, where we collaborated on provisioning Azure resources using Terraform. He has strong expertise in cloud and Terraform. What truly sets him apart is his teaching style — patient, structured, and practical. He ensures concepts are not just explained but genuinely understood, making him an excellent mentor and technical collaborator.',
		profileUrl: 'https://www.linkedin.com/in/vani-rao-2a833b230',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Trilok Tater',
		role: 'Senior DevSecOps, Platform & Agentic AI Engineer',
		date: '2026-01-24',
		rating: 5,
		quote:
			'I worked with Kamal for a short duration, during which he demonstrated strong knowledge of cloud technologies best practices and Terraform. He is professional, self-motivated, and a pleasure to work with.',
		profileUrl: 'https://www.linkedin.com/in/trilok-tater',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Vathsa A S',
		role: 'Senior Technologist DevOps, Refinitiv (an LSEG Business)',
		date: '2025-08-11',
		rating: 5,
		quote:
			'I had the pleasure of working with Kamal in my current role at London Stock Exchange Group. His depth of knowledge in cloud migration and architecture provides us with different perspectives that help in finalizing a scalable architecture which is highly scalable and reliable. His communication is very clear at all times, leaving no scope for ambiguity. He would be a great asset to any company or team he is part of.',
		profileUrl: 'https://www.linkedin.com/in/vathsa-a-s-0a281148',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Srinaveen Srikakolapu',
		role: 'Cloud DevOps Engineer',
		date: '2025-07-30',
		rating: 5,
		quote:
			'Working alongside Kamal has been truly rewarding. As a DevOps engineer, he brings remarkable technical depth, innovative problem-solving approaches, and an unwavering commitment to delivering exceptional results. His collaborative spirit and knowledge-sharing make him an invaluable team asset.',
		profileUrl: 'https://www.linkedin.com/in/srinaveen-srikakolapu',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Subhasis Mukherjee',
		role: 'MultiCloud Data Strategist / Engineering Manager',
		date: '2025-07-30',
		rating: 5,
		quote:
			"I had the chance to work with Kamal in a critical cloud migration journey for a leading stock exchange client. I was impressed with Kamal's know-how of the DevOps and Infra domain. He is knowledgeable in his craft and can seamlessly integrate pieces of technology together to build an end to end solution/platform. He is always ready to extend a helping hand, be it your first day at a project or your general curiosity about something in his domain. I recommend him for roles where DevOps and Infra is a critical factor. He is a reliable tech leader who can pull off things with ingenuity and responsibility.",
		profileUrl: 'https://www.linkedin.com/in/subhasismukherjee85',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Chitwan Singh Dhadwal',
		role: 'DevOps Engineer, EPAM Systems',
		date: '2025-07-25',
		rating: 5,
		quote:
			"I've had the pleasure of working closely with Kamal, and I can confidently say he is one of the most talented and dependable DevOps leaders I've come across in the cloud technology space. His depth of knowledge across cloud infrastructure, CI/CD pipelines, and automation is truly impressive, but what sets Kamal apart is his calm leadership, problem-solving mindset, and unwavering commitment to excellence. Whether it's optimizing deployments, driving cost-effective cloud strategies, or mentoring team members, Kamal consistently delivers results with precision and integrity. If you're looking for a DevOps expert who combines deep expertise with strong leadership and reliability, Kamal is your guy.",
		profileUrl: 'https://www.linkedin.com/in/chitwan-singh-dhadwal-58a292176',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Babula Parida',
		role: 'Lead Cloud Platform Engineer',
		date: '2025-07-20',
		rating: 5,
		quote:
			"I had the pleasure of working with Kamal during my tenure in EPAM. His expertise in Azure, Azure DevOps, and Terraform consistently delivered exceptional results for our team. Kamal's deep understanding of Azure services enabled him to architect scalable solutions that perfectly aligned with our business requirements. His mastery of Azure DevOps and Terraform allowed us to implement robust CI/CD pipelines. Beyond his technical skills, Kamal is an excellent collaborator who communicates clearly and is always willing to mentor team members.",
		profileUrl: 'https://www.linkedin.com/in/babulaparida',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Mikhail Lavoshnikov',
		role: 'Project Manager, Enterprise Modernization',
		date: '2025-07-18',
		rating: 5,
		quote:
			'I had the pleasure of working with Kamal Kumar on a large-scale cloud transformation initiative, where he served as our Lead DevOps Engineer. Kamal brought a rare combination of technical depth, operational discipline, and team mentorship that made a significant impact on the success of our migration efforts. Kamal consistently delivered high-quality infrastructure and automation solutions using technologies such as Azure, Terraform, Kubernetes, and Azure DevOps, and played a pivotal role in designing and implementing secure, scalable, and reusable cloud infrastructure. Any organization would be fortunate to have Kamal on board.',
		profileUrl: 'https://www.linkedin.com/in/mikhlavo',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Navlesh Agarwal',
		role: 'AI Architect, Solution Architect and Azure Integration Architect',
		date: '2025-07-18',
		rating: 5,
		quote:
			"I had the pleasure of working closely with Kamal during a large-scale cloud migration project, and I can confidently say they are one of the most reliable and forward-thinking DevOps engineers I've worked with. Kamal played a pivotal role in designing and implementing CI/CD pipelines, automating infrastructure with IaC (Terraform, PowerShell and Azure CLI), and ensuring our deployments to Azure were both secure and efficient. What stood out the most was Kamal's calm, solution-oriented mindset even under pressure — they proactively identified risks in early migration phases and implemented smart rollback and validation mechanisms that saved us from potential downtime.",
		profileUrl: 'https://www.linkedin.com/in/navlesh-agarwal',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Tushar Singh',
		role: 'Associate, BlackRock',
		date: '2025-03-16',
		rating: 5,
		quote:
			'I had the privilege of working with Kamal Kumar for nearly four years and was consistently impressed by his professionalism, technical expertise, and deep knowledge of cloud architecture and DevOps. He excels in designing scalable cloud solutions, optimizing system performance, and driving automation to enhance efficiency. Kamal is a proactive problem-solver, a great team player, and a dependable professional who collaborates effectively across teams.',
		profileUrl: 'https://www.linkedin.com/in/tushar-singh-93b19782',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Mariia Streltsova',
		role: 'Project Manager / Scrum Master, EPAM Systems',
		date: '2025-02-19',
		rating: 5,
		quote:
			"I worked together with Kamal in one team over the course of 3 years. I've had the privilege to witness his remarkable professional evolution. Starting as an engineer, Kamal has matured into a pivotal leader within our team, ended up being a Technical Lead. His journey has been marked by a consistent expansion in skills, confidence, and leadership abilities, making him a central figure in both our team and in the eyes of our customers.",
		profileUrl: 'https://www.linkedin.com/in/mariia-streltsova-3150b01a7',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Ajay Tiwari',
		role: 'Azure Cloud, AI & DevOps and Databricks Architect',
		date: '2025-02-14',
		rating: 5,
		quote:
			"I had the pleasure of working with Kamal on the EPAM side and also on the LSEG project, where he consistently demonstrated exceptional expertise in Azure, Terraform, Governance, and DevOps. His deep technical knowledge, combined with his ability to solve complex problems quickly and effectively, made a significant impact on the project's success. Kamal is not just technically strong — he is also highly collaborative, fostering a culture of shared learning within the team.",
		profileUrl: 'https://www.linkedin.com/in/ajayvtiwari',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Riyaj Shaikh',
		role: 'GenAI Architect',
		date: '2025-02-13',
		rating: 5,
		quote:
			"I've had the pleasure of working with Kamal, and he has always been my go-to person for anything related to Azure. His deep expertise, problem-solving skills, and willingness to help make him an invaluable asset to any team. His dedication and enthusiasm are truly inspiring.",
		profileUrl: 'https://www.linkedin.com/in/riyaj-shaikh-01a64a141',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Adrian Tupling',
		role: 'Azure Specialist',
		date: '2025-02-12',
		rating: 5,
		quote:
			'I had the pleasure of working with Kamal on several projects, he was an invaluable member of the team. His professionalism, deep technical knowledge, and unwavering support made a real impact on our work. Beyond his expertise, Kamal brought a collaborative spirit that made working with him both productive and enjoyable — a credit to the team, and I have no doubt he will continue to be for any company lucky enough to have him.',
		profileUrl: 'https://www.linkedin.com/in/adriantupling',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Chandresh Patel',
		role: 'Former Manager',
		date: '2025-02-09',
		rating: 5,
		quote:
			"I had the privilege of managing Kamal during his time as a Senior DevOps Engineer, and I can confidently say that he is one of the most talented and dedicated professionals I have ever worked with. Kamal's ability to solve complex problems and optimise systems was awe-inspiring. What truly sets Kamal apart, however, is his professionalism and his dedication to mentoring others — his patience, clarity, and willingness to help others grow were instrumental in elevating the team's performance.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Preeti Singh',
		role: 'Senior DevOps Engineer',
		date: '2025-02-08',
		rating: 5,
		quote:
			'I highly recommend Kamal because of his outstanding DevOps/Sec Engineering abilities and teamwork. He constantly impressed me with his ability to work well under pressure and clearly explain difficult technical ideas. With a thorough understanding of Python, Terraform, Ansible, networking, Kubernetes, and Azure cloud, Kamal played a key role in automating the CI/CD pipeline, implementing security hardening, and improving the efficiency of our infrastructure.',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Praveen Pydimarri',
		role: 'Senior Cloud Platform Engineer',
		date: '2025-02-04',
		rating: 5,
		quote:
			'Kamal is an outstanding team lead and a valuable asset to the organization. His technical expertise in Azure and Terraform, combined with his proactive approach, makes him a strong leader. He consistently supports team members, takes ownership of challenges, and ensures customer satisfaction.',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Dan Chambers',
		role: 'Senior Platform Engineer, CGI',
		date: '2025-02-01',
		rating: 5,
		quote:
			'Kamal has a unique ability to listen to client requests and map out solutions that adhere to their requirements almost exactly. He is able to question and determine what the client desires rather quickly and then produce a workable PoC that will showcase the solution in action. He is amazingly polite, has a lot of patience and communicates in a calm, professional manner with clients and colleagues alike.',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Sandeep Sharma',
		role: 'Vice President, BlackRock',
		date: '2025-01-31',
		rating: 5,
		quote:
			'I had the pleasure of managing Kamal and was consistently impressed by his skills and dedication. Kamal has exceptional expertise in PowerShell, using it to automate complex tasks efficiently. Beyond technical skills, he is a critical thinker and a natural problem solver, always approaching challenges with creativity and innovative ideas.',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'James Complin',
		role: 'VP of Platform Engineering, YouLend',
		date: '2025-01-31',
		rating: 5,
		quote:
			"I've had the privilege of working with Kamal at LSEG, and his leadership and dedication have been evident from day one. Kamal consistently goes above and beyond, taking on challenges with enthusiasm and a clear focus on achieving results. What truly stands out is his ability to embrace change, adapt quickly, and bring others along on the journey.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Himesh Bhojwani',
		role: 'Azure / DevOps / Infrastructure',
		date: '2025-01-30',
		rating: 5,
		quote:
			"Kamal is an exceptional technical lead in our team with a deep understanding of cloud engineering, architecture, governance, and security. At LSEG, he played a crucial role in optimizing cloud infrastructure and automating processes. His problem-solving skills, attention to detail, and willingness to mentor made a huge impact on the team's success.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Abhishek Pathak',
		role: 'UC & Collaboration Engineer',
		date: '2025-01-30',
		rating: 5,
		quote:
			'Kamal is very capable, self-motivated, and an effective professional with sound professional knowledge — excellent in DevOps in cloud computing with great relationship building. He maintains a positive outlook, leads with confidence, and stands by his convictions. A great fellow worker and friend I always look forward to working with.',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Smriti Bajaj',
		role: 'Financial Control Associate, NatWest Group',
		date: '2025-01-30',
		rating: 5,
		quote:
			"Kamal is one of the most knowledgeable and dependable engineers I've worked with. At BlackRock, he was the go-to person for solving tough challenges. His expertise in various development and cloud fields made a huge impact on our projects. Highly recommend working with him!",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Manya Singhal',
		role: 'Cloud & DevOps Engineer',
		date: '2025-01-30',
		rating: 5,
		quote:
			'I had the pleasure of working closely with Kamal, and I can confidently say that he is an exceptional professional. Throughout our time working together, Kamal consistently demonstrated outstanding technical expertise, communication and problem-solving. One of the things that sets Kamal apart is his ability to tackle complex challenges with solutions, collaborate seamlessly across teams with incredible attention to detail.',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Sandeep Jain',
		role: 'Vice President, Technology Lead',
		date: '2025-01-29',
		rating: 5,
		quote:
			"Kamal is a talented DevOps Engineer with a keen eye for detail and a dedication to excellence. It was a pleasure working with him. He's a collaborative and innovative professional who consistently delivers results.",
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Roshan Thamallore',
		role: 'Senior Azure Cloud and DevOps Professional',
		date: '2025-01-29',
		rating: 5,
		quote:
			'I have worked closely with Kamal and can recommend him as a highly skilled tech lead. He has shown an incredible ability to analyze and break down complex tasks. He has also shown great ability to lead and mentor teammates.',
		sourceUrl: RECOMMENDATIONS_URL
	},
	{
		name: 'Sraddhananda Jetty',
		role: 'Principal Cloud Platform Architect, LSEG',
		date: '2025-01-29',
		rating: 5,
		quote:
			'I wholeheartedly recommend Kamal Kumar as a highly focused and energetic Platform Engineer. Kamal is a truly agile engineer, demonstrating an impressive ability to quickly adapt and embrace new challenges and technologies in our ever-evolving field. Notably, Kamal effectively assumed Tech Lead responsibilities when I transitioned within the organization, showcasing remarkable leadership potential and technical expertise.',
		sourceUrl: RECOMMENDATIONS_URL
	}
];
