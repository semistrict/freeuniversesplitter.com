<script lang="ts">
	import { onMount } from 'svelte';

	export let text = '';
	export let speed = 50; // characters per second
	export let delay = 0; // initial delay in ms

	let visibleCount = 0;
	let isTyping = false;
	let hasTyped = false;

	onMount(() => {
		if (text && !hasTyped) {
			typeText();
		}
	});

	async function typeText() {
		if (hasTyped) return;

		isTyping = true;
		hasTyped = true;
		visibleCount = 0;

		if (delay > 0) {
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		const chars = text.split('');
		const intervalTime = 1000 / speed;

		for (let i = 0; i < chars.length; i++) {
			visibleCount = i + 1;
			await new Promise((resolve) => setTimeout(resolve, intervalTime));
		}

		isTyping = false;
	}

	// Re-type when text changes (only if we haven't typed yet)
	$: if (text && !hasTyped) {
		typeText();
	}

	// Export reset function for external use
	export function reset() {
		hasTyped = false;
		isTyping = false;
		visibleCount = 0;
		if (text) {
			typeText();
		}
	}
</script>

<span class="teletype-text"
	>{#each text.split('') as char, i}<span class="char" class:visible={i < visibleCount}
			>{#if i === visibleCount - 1 && isTyping}<span class="cursor">_</span
				>{:else if i < visibleCount}{char}{:else}{char}{/if}</span
		>{/each}<span class="final-cursor" class:show={!isTyping && hasTyped}>_</span></span
>

<style>
	.teletype-text {
		display: inline;
		font-size: inherit;
		line-height: inherit;
	}

	.char {
		visibility: hidden;
		font-size: inherit;
		line-height: inherit;
		word-spacing: inherit;
		letter-spacing: inherit;
	}

	.char.visible {
		visibility: visible;
	}

	.cursor {
		animation: blink 1s infinite;
	}

	.final-cursor {
		visibility: hidden;
		animation: blink 1s infinite;
	}

	.final-cursor.show {
		visibility: visible;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}
</style>
