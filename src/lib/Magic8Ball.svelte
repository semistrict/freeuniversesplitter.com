<script lang="ts">
	import { getRand } from '../random';
	import TeletypeText from '$lib/TeletypeText.svelte';
	import Spinner from '$lib/Spinner.svelte';
	import { setUrlState, getUrlState, type Magic8BallState } from '$lib/urlState';
	import ResultDialogButtons from '$lib/ResultDialogButtons.svelte';
	import BackButton from '$lib/BackButton.svelte';
	import { onMount } from 'svelte';

	let universeWasSplitDialog: HTMLDialogElement;
	let isSpinning = false;
	let teletypeRef: TeletypeText;
	let processingMessage = '';
	let currentResult: string | undefined;

	// Magic 8 Ball responses
	const magic8BallResponses = [
		'It is certain',
		'Reply hazy, try again',
		"Don't count on it",
		'It is decidedly so',
		'Ask again later',
		'My reply is no',
		'Without a doubt',
		'Better not tell you now',
		'My sources say no',
		'Yes definitely',
		'Cannot predict now',
		'Outlook not so good',
		'You may rely on it',
		'Concentrate and ask again',
		'Very doubtful',
		'As I see it, yes',
		'Most likely',
		'Outlook good',
		'Yes',
		'Signs point to yes'
	];

	// Check for shared state on mount
	onMount(() => {
		const sharedState = getUrlState<Magic8BallState>();
		if (sharedState && sharedState.type === 'magic8ball') {
			currentResult = sharedState.response;
			universeWasSplitDialog.showModal();
		}
	});

	async function askMagic8Ball() {
		isSpinning = true;
		processingMessage = 'PROCESSING QUANTUM DATA...';

		// Dispatch event to start signal lost effects
		window.dispatchEvent(new CustomEvent('universe-split-start'));

		let randomNum = await getRand();
		isSpinning = false;
		processingMessage = '';

		// Dispatch event to stop signal lost effects
		window.dispatchEvent(new CustomEvent('universe-split-end'));

		// Select random response
		currentResult = magic8BallResponses[randomNum % magic8BallResponses.length];

		// Save state to URL
		const state: Magic8BallState = {
			type: 'magic8ball',
			response: currentResult,
			timestamp: Date.now()
		};
		setUrlState(state);

		universeWasSplitDialog.showModal();

		// Reset the teletype component for the new result
		if (teletypeRef) {
			teletypeRef.reset();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			askMagic8Ball();
		}
	}
</script>

<svelte:head>
	<title>Magic 8 Ball - Free Universe Splitter</title>
	<meta
		property="og:description"
		content="Quantum Magic 8 Ball: Let the Multiverse Answer Your Questions!"
	/>
</svelte:head>

<BackButton />

<div class="magic8ball-container">
	<div class="instruction">Think of a yes/no question and click the ball</div>

	<div class="magic8ball" on:click={askMagic8Ball} on:keydown={handleKeydown} tabindex="0">
		<div class="eight">8</div>
	</div>

	<div class="spinner-section">
		{#if isSpinning}
			<Spinner {processingMessage} {isSpinning} />
		{/if}
	</div>
</div>

<dialog bind:this={universeWasSplitDialog}>
	<div>The quantum magic 8 ball reveals:</div>
	<div style="font-size: 36pt; text-align: center; padding: 20px;">
		{#if currentResult}
			<TeletypeText bind:this={teletypeRef} text={currentResult} speed={30} delay={500} />
		{/if}
	</div>
	<ResultDialogButtons
		shareTitle="Magic 8 Ball Result"
		shareText={currentResult ? `The quantum magic 8 ball says: "${currentResult}"` : ''}
		onClose={() => universeWasSplitDialog.close()}
	/>
</dialog>

<style>
	.magic8ball-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		min-height: 400px;
		padding: 40px;
	}

	.magic8ball {
		width: 200px;
		height: 200px;
		min-width: 200px;
		min-height: 200px;
		max-width: 200px;
		max-height: 200px;
		background: radial-gradient(circle at 30% 30%, #333, #000);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30px;
		border: 3px solid #41ff00;
		box-shadow: 0 0 20px #41ff00;
		cursor: pointer;
		transition: transform 0.1s ease;
		flex-shrink: 0;
	}

	.magic8ball:hover {
		transform: scale(1.05);
	}

	.magic8ball:active {
		transform: scale(0.95);
	}

	.spinner-section {
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.eight {
		font-size: 48pt;
		font-weight: bold;
		color: #41ff00;
		text-shadow: 0 0 10px #41ff00;
		background: transparent;
	}

	.instruction {
		font-size: 18pt;
		text-align: center;
		margin-bottom: 20px;
		opacity: 0.9;
	}
</style>
