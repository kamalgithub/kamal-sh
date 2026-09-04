/// <reference types="bun" />

/** Pretty-prints data as JSON and writes it to path, matching the repo's formatting. */
export async function writeGeneratedJson(path: string, data: unknown): Promise<void> {
	await Bun.write(path, `${JSON.stringify(data, null, '\t')}\n`);
}
