import { describe, expect, it } from 'vitest';
import { toJsonLdScript } from './jsonLd';

describe('toJsonLdScript', () => {
	it('wraps the serialized data in a JSON-LD script tag', () => {
		const html = toJsonLdScript({ '@type': 'Person', name: 'Ada' });
		expect(html).toBe(
			'<script type="application/ld+json">{"@type":"Person","name":"Ada"}</script>'
		);
	});

	it('escapes every "<" so a value can never close the script tag early', () => {
		const html = toJsonLdScript({ name: '</script><script>alert(1)</script>' });
		expect(html).not.toContain('</script><script>alert');
		expect(html.match(/<script/g)).toHaveLength(1);
	});
});
