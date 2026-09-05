/**
 * Serializes a JSON-LD object into a <script> tag ready for {@html}. Escapes every `<`
 * (not just `</script>`) so a value containing markup can never break out of the tag —
 * defense in depth even though every caller here only ever passes our own typed content.
 */
export function toJsonLdScript(data: object): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}
