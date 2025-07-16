<script lang="ts">
	import TeletypeText from '$lib/TeletypeText.svelte';
	import Spinner from '$lib/Spinner.svelte';
	import { generateHexagram, type Hexagram } from '$lib/ichingLib';
	import { setUrlState, getUrlState, type IChingState } from '$lib/urlState';
	import ResultDialogButtons from '$lib/ResultDialogButtons.svelte';
	import BackButton from '$lib/BackButton.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let universeWasSplitDialog: HTMLDialogElement;
	let isSpinning = false;
	let teletypeRef: any;
	let processingMessage = '';
	let currentResult: Hexagram | undefined;
	let textPhase = false;
	let tabletPhase = false;

	const sentences = [
		'Quiet your mind.',
		'Contemplate your situation.',
		'When ready,',
		'seek guidance from the ancient oracle.'
	];

	let currentSentenceIndex = -1;
	let sentenceVisible = false;
	let instructionTimeouts: number[] = [];

	function skipToTablet() {
		// Clear all timeouts
		instructionTimeouts.forEach(clearTimeout);
		instructionTimeouts = [];

		// Immediately transition to tablet phase
		sentenceVisible = false;
		currentSentenceIndex = -1;
		setTimeout(() => {
			textPhase = false;
			tabletPhase = true;
		}, 500);
	}

	// Fade in animation sequence
	onMount(() => {
		// Check for shared state first
		const sharedState = getUrlState<IChingState>();
		if (sharedState && sharedState.type === 'iching') {
			// Look up hexagram data by number
			import('$lib/hexagrams.json').then((hexagramsData) => {
				const hexData = hexagramsData.hexagrams[sharedState.hexagramNumber.toString()];
				if (hexData) {
					currentResult = {
						number: sharedState.hexagramNumber,
						name: hexData.name,
						reading: hexData.reading,
						symbol: hexData.symbol,
						lines: [] // We don't store lines for sharing, just the result
					};
					universeWasSplitDialog.showModal();
				}
			});
			return;
		}

		// Normal animation sequence
		textPhase = true;
		// Show each sentence with 2-second intervals, replacing the previous one
		sentences.forEach((_, index) => {
			const timeout = setTimeout(() => {
				// Fade out current sentence
				if (index > 0) {
					sentenceVisible = false;
					setTimeout(() => {
						currentSentenceIndex = index;
						sentenceVisible = true;
					}, 500); // Half second fade out, then change and fade in
				} else {
					currentSentenceIndex = index;
					sentenceVisible = true;
				}
			}, 500 + index * 2000);
			instructionTimeouts.push(timeout);
		});

		// Fade out all text after all sentences have appeared
		const fadeOutDelay = 500 + sentences.length * 2000 + 2000;
		const finalTimeout = setTimeout(() => {
			sentenceVisible = false;
			setTimeout(() => {
				currentSentenceIndex = -1;
				// End text phase and start tablet phase
				setTimeout(() => {
					textPhase = false;
					tabletPhase = true;
				}, 500);
			}, 500);
		}, fadeOutDelay);
		instructionTimeouts.push(finalTimeout);
	});

	async function castIChingReading() {
		isSpinning = true;
		processingMessage = 'CONSULTING THE ANCIENT ORACLE...';

		// Generate hexagram using proper yarrow stick method
		currentResult = await generateHexagram();
		isSpinning = false;
		processingMessage = '';

		// Save state to URL
		const state: IChingState = {
			type: 'iching',
			hexagramNumber: currentResult.number,
			timestamp: Date.now()
		};
		setUrlState(state);

		universeWasSplitDialog.showModal();

		// Reset the teletype component for the new result
		if (teletypeRef) {
			teletypeRef.reset();
		}
	}

	function handleTabletKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			castIChingReading();
		}
	}

	function handleTextKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			skipToTablet();
		}
	}
</script>

<svelte:head>
	<title>I Ching - Free Universe Splitter</title>
	<meta
		property="og:description"
		content="Quantum I Ching: Ancient Wisdom Through the Multiverse!"
	/>
</svelte:head>

<BackButton />

{#if textPhase}
	<div class="text-container" on:click={skipToTablet} on:keydown={handleTextKeydown} tabindex="0">
		<div class="instruction">
			{#if currentSentenceIndex >= 0}
				<div class="sentence" class:visible={sentenceVisible}>
					{sentences[currentSentenceIndex]}
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if tabletPhase}
	<div class="tablet-container">
		<div
			class="oracle-tablet"
			on:click={castIChingReading}
			on:keydown={handleTabletKeydown}
			tabindex="0"
		>
			<div class="trigrams">
				☰<br />
				☷
			</div>
			<div class="oracle-text">Heaven & Earth</div>
		</div>

		<div class="spinner-section">
			{#if isSpinning}
				<Spinner {processingMessage} {isSpinning} />
			{/if}
		</div>
	</div>
{/if}

<dialog bind:this={universeWasSplitDialog}>
	<div>The ancient oracle speaks:</div>

	{#if currentResult}
		<div class="hexagram-display">{currentResult.symbol}</div>
		<div class="hexagram-name">#{currentResult.number} - {currentResult.name}</div>
		<div style="font-size: 18pt; text-align: center; padding: 20px;">
			<TeletypeText bind:this={teletypeRef} text={currentResult.reading} speed={30} delay={500} />
		</div>
	{/if}

	<ResultDialogButtons
		shareTitle="I Ching Reading"
		shareText={currentResult
			? `The ancient oracle speaks: #${currentResult.number} - ${currentResult.name}: ${currentResult.reading}`
			: ''}
		onClose={() => {
			universeWasSplitDialog.close();
			goto('/');
		}}
	/>
</dialog>

<style>
	.text-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: calc(100vh - 80px);
		padding: 40px;
		box-sizing: border-box;
	}

	.tablet-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 20px 40px 40px 40px;
		box-sizing: border-box;
	}

	.oracle-tablet:hover {
		transform: scale(1.05);
	}

	.oracle-tablet:active {
		transform: scale(0.95);
	}

	.trigrams {
		font-size: 36pt;
		color: #41ff00;
		text-shadow: 0 0 10px #41ff00;
		text-align: center;
		line-height: 1.1;
	}

	.oracle-text {
		font-size: 10pt;
		color: #41ff00;
		text-align: center;
		margin-top: 8px;
		opacity: 0.8;
		font-style: italic;
	}

	.instruction {
		font-size: 16pt;
		text-align: center;
		max-width: 600px;
		line-height: 1.4;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.sentence {
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
		margin-bottom: 8px;
	}

	.sentence.visible {
		opacity: 0.9;
	}

	.oracle-tablet {
		width: 280px;
		height: 200px;
		min-width: 280px;
		min-height: 200px;
		max-width: 280px;
		max-height: 200px;
		background: linear-gradient(135deg, #1a4a1a, #000, #1a4a1a);
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 30px;
		border: 3px solid #41ff00;
		box-shadow: 0 0 20px #41ff00;
		cursor: pointer;
		transition: transform 0.1s ease;
		flex-shrink: 0;
		padding: 20px;
		box-sizing: border-box;
	}

	.spinner-section {
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.hexagram-display {
		font-size: 64pt;
		margin-bottom: 20px;
		text-align: center;
	}

	.hexagram-name {
		font-size: 24pt;
		margin-bottom: 15px;
		text-align: center;
		text-decoration: underline;
	}
</style>
