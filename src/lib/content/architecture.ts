import type { ArchitectureNode } from './architecture.types';

export const architectureNodes: ArchitectureNode[] = [
	{
		id: 'gateway',
		label: 'Edge gateway',
		category: 'flow',
		icon: 'layers',
		summary:
			'Single entry point for every model call — auth, rate limiting, and routing live here, not scattered across services.',
		rationale:
			'Every consumer (an internal app, an agent, a batch job) talks to one stable interface regardless of which model or provider sits behind it. Swapping a provider becomes a routing-table change, not an application redeploy.',
		tradeoffs: [
			{
				considered: 'Let each service call model providers directly',
				rejectedBecause:
					'Auth, rate limits, and cost controls would need to be reimplemented per service, and a provider outage or key rotation becomes N incidents instead of one.'
			},
			{
				considered: 'Ship a shared SDK library instead of a network gateway',
				rejectedBecause:
					'A library still needs a new version shipped to every consumer on every policy change; a gateway changes behavior for all consumers by deploying once.'
			}
		]
	},
	{
		id: 'authn',
		label: 'AuthN / AuthZ',
		category: 'flow',
		icon: 'shield',
		summary:
			'Every request is attributed to a real caller — service identity or end user — before it reaches a model. No anonymous traffic past the edge.',
		rationale:
			'Cost attribution, audit trails, and per-team rate limits are only possible if every call carries a verifiable identity, checked once at a boundary rather than trusted by convention.',
		tradeoffs: [
			{
				considered: 'API keys per team, checked in application code',
				rejectedBecause:
					'Keys leak into logs and repos, and revocation means chasing down every service that embedded one.'
			}
		]
	},
	{
		id: 'guardrails-in',
		label: 'Input guardrails',
		category: 'flow',
		icon: 'shield',
		summary:
			'Prompt-injection detection, PII redaction, and policy checks run on the way in, before a token reaches a model provider.',
		rationale:
			'Rejecting a bad request at the edge is cheaper and safer than catching a bad response after the model already saw sensitive data or a jailbreak attempt.',
		tradeoffs: [
			{
				considered: "Rely on the model provider's own safety filters",
				rejectedBecause:
					"That couples your policy to a vendor's roadmap, and their filters don't know your organization's specific PII fields or compliance rules."
			}
		]
	},
	{
		id: 'router',
		label: 'Model router',
		category: 'flow',
		icon: 'gauge',
		summary:
			'Picks which model serves a request based on task type, cost ceiling, and latency budget — not a hardcoded model name in application code.',
		rationale:
			'Model quality and pricing shift every few months. The router is the one place that has to know about a new model; every calling application stays unchanged.',
		tradeoffs: [
			{
				considered: 'Hardcode a model per use case at the call site',
				rejectedBecause:
					'Every model upgrade becomes a find-and-replace across every application instead of one routing rule.'
			},
			{
				considered: 'Always route to the newest, largest model',
				rejectedBecause:
					"Most calls — classification, extraction, short completions — don't need frontier-model cost or latency. Routing by task keeps the median request cheap."
			}
		]
	},
	{
		id: 'providers',
		label: 'Model providers',
		category: 'flow',
		icon: 'layers',
		summary:
			'Multiple providers sit behind the router with a named fallback chain — not a single vendor as a single point of failure.',
		rationale:
			"A provider outage or a deprecated model shouldn't be a site-down incident; the router fails over to a documented secondary within the same request.",
		tradeoffs: [
			{
				considered: 'Single-provider commitment, for simplicity',
				rejectedBecause:
					'Simplicity today becomes an outage-shaped single point of failure the first time that one vendor has a bad day.'
			}
		]
	},
	{
		id: 'guardrails-out',
		label: 'Output guardrails',
		category: 'flow',
		icon: 'shield',
		summary:
			'The response is checked before it reaches the caller — schema validation, safety filtering, and a check against the original policy.',
		rationale:
			'A guardrail that only looks at the input misses failure modes that only appear in what the model generates — a hallucinated URL, a leaked system-prompt fragment, malformed structured output.',
		tradeoffs: [
			{
				considered: "Trust the model's structured-output mode alone",
				rejectedBecause:
					"Structured-output modes reduce malformed JSON; they don't guarantee the content inside that JSON is safe or correct."
			}
		]
	},
	{
		id: 'evals',
		label: 'Evals',
		category: 'cross-cutting',
		icon: 'checkCircle',
		summary:
			'Every prompt, model, or guardrail change ships against a versioned eval set before it reaches production traffic — the same discipline as a test suite for a compiler.',
		rationale:
			'Without a regression harness, "we improved the prompt" is a guess. Evals turn a subjective judgment call into a before/after number someone can review.',
		tradeoffs: [
			{
				considered: 'Ship prompt changes on developer judgment plus spot checks',
				rejectedBecause:
					'Spot checks catch obvious regressions, not the edge cases an eval set exists specifically to cover.'
			}
		]
	},
	{
		id: 'governance',
		label: 'Governance & cost',
		category: 'cross-cutting',
		icon: 'gauge',
		summary:
			'Per-team budgets, per-model cost attribution, and an approval path for adding a new model or provider — cost is a first-class control, not a monthly surprise in the cloud bill.',
		rationale:
			'In a multi-team org, the fastest way to lose executive trust in an AI platform is an unexplained cost spike with no owner.',
		tradeoffs: [
			{
				considered: 'Track spend after the fact in the cloud billing console',
				rejectedBecause:
					'Billing-console visibility arrives weeks after the spend happened — by then a runaway job has already run to completion.'
			}
		]
	},
	{
		id: 'observability',
		label: 'Observability',
		category: 'cross-cutting',
		icon: 'activity',
		summary:
			'Every request is traced end-to-end — gateway, guardrail verdicts, model call, guardrail verdicts, response — with token counts and latency at each hop.',
		rationale:
			"When a response is wrong, the trace has to show where in the pipeline it went wrong: which guardrail passed something it shouldn't have, or which model call actually ran a different prompt than expected after routing.",
		tradeoffs: [
			{
				considered: 'Log only the final request/response pair',
				rejectedBecause:
					'That answers what happened but never why — debugging a bad output means guessing which of several stages caused it.'
			}
		]
	}
];
