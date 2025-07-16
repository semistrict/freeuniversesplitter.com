<script lang="ts">
	import { onMount } from 'svelte';

	export let processingMessage = '';
	export let fontSize = '18pt';
	export let isSpinning = false;

	let displayChar = 'Ψ';
	let corruptionInterval: ReturnType<typeof setInterval> | undefined;

	// Spinner corruption characters
	const corruptChars = [
		'Ω',
		'Φ',
		'Θ',
		'Λ',
		'Π',
		'Σ',
		'Δ',
		'█',
		'▓',
		'▒',
		'░',
		'╬',
		'※',
		'◊',
		'●',
		'◢',
		'◤'
	];

	function startCorruption() {
		// Start corruption effects
		corruptionInterval = setInterval(() => {
			if (Math.random() < 0.7) {
				// 70% chance to corrupt
				displayChar = corruptChars[Math.floor(Math.random() * corruptChars.length)];
				setTimeout(() => {
					displayChar = 'Ψ'; // Reset to normal after brief corruption
				}, 200 + Math.random() * 400);
			}
		}, 150);
	}

	function stopCorruption() {
		if (corruptionInterval) {
			clearInterval(corruptionInterval);
			corruptionInterval = undefined;
		}
		displayChar = 'Ψ';
	}

	// React to isSpinning prop changes
	$: if (isSpinning) {
		startCorruption();
	} else {
		stopCorruption();
	}

	// Cleanup on component destroy
	onMount(() => {
		return () => {
			stopCorruption();
		};
	});
</script>

<div style="text-align: center; font-size: {fontSize};">
	{#if processingMessage}
		<div style="font-size: 14pt; margin-bottom: 10px; opacity: 0.8;">
			{processingMessage}
		</div>
	{/if}
	<span class="spinner-container">
		<span class="spinner">{displayChar}</span>
	</span>
</div>

<style>
	.spinner-container {
		display: inline-block;
		width: 1.5em;
		height: 1.5em;
		position: relative;
		margin-left: 10px;
		vertical-align: middle;
	}

	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		animation: spin 1s linear infinite;
		display: block;
		width: 1.5em;
		height: 1.5em;
		text-align: center;
		line-height: 1.5em;
	}

	@keyframes spin {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		25% {
			transform: translate(-50%, -50%) rotate(90deg);
		}
		50% {
			transform: translate(-50%, -50%) rotate(180deg);
		}
		75% {
			transform: translate(-50%, -50%) rotate(270deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>
