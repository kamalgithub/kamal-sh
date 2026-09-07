import type { Product } from './product.types';

export const spch: Product = {
	slug: 'spch',
	name: 'spch',
	tagline: 'Clone a voice, transcribe audio, synthesize speech — entirely on your own hardware.',
	description:
		'spch is a local-first command-line tool that does three things: builds a voice profile from a short audio or video sample, transcribes audio/video to text, and synthesizes speech in a cloned voice. No cloud APIs, no subscriptions, no data leaving your machine. It pairs F5-TTS for zero-shot voice cloning with faster-whisper for transcription, and optionally hooks into Ollama for LLM-powered transcript cleanup.',
	highlights: [
		'Voice profile creation from a 5–15 second sample — no training required',
		'Zero-shot voice cloning via F5-TTS',
		'Speech-to-text via faster-whisper — TXT, SRT, VTT, JSON output',
		'Optional Ollama-powered transcript cleanup',
		'Fully offline, GPU-accelerated (CUDA / Apple Silicon MPS)',
		'Atomic writes — a crash never leaves a half-written file'
	],
	links: [{ label: 'PyPI', url: 'https://pypi.org/project/spch/' }],
	installCommand: 'pip install spch',
	image: {
		src: '/images/products/spch.webp',
		darkSrc: '/images/products/spch-dark.webp',
		alt: 'spch overview: zero-shot voice cloning, speech-to-text, and text-to-speech, all running locally via F5-TTS and faster-whisper.'
	}
};
