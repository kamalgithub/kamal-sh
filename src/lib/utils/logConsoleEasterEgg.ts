/**
 * A small, hidden hello for anyone who opens devtools — zero footprint on the page
 * itself, so it can't compete with or distract from anything else. The one place on
 * this site humor is allowed to show up unprompted, aimed squarely at the one audience
 * (developers poking at the console) it'll actually land with.
 */
export function logConsoleEasterEgg(): void {
	const promptStyle = 'color:#5c82ff; font-family:ui-monospace,monospace; font-weight:600;';
	const textStyle = 'font-family:ui-monospace,monospace;';

	console.log('%c$ whoami', promptStyle);
	console.log('%cJust a portfolio site. No tracking pixels hiding in here.', textStyle);
	console.log('%cSince you’re already here: `curl kamal.sh` works too.', textStyle);
}
