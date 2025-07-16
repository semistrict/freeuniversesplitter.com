<script lang="ts">
	import { getRand } from '../random';
	import TeletypeText from '$lib/TeletypeText.svelte';
	import Spinner from '$lib/Spinner.svelte';
	import { setUrlState, getUrlState, clearUrlState, type UniverseState } from '$lib/urlState';
	import ResultDialogButtons from '$lib/ResultDialogButtons.svelte';
	import Modal from '$lib/Modal.svelte';
	import { onMount } from 'svelte';

	let currentResult: SplitResult | undefined;
	let showResultModal = false;
	let showConfirmModal = false;
	let isSpinning = false;
	let teletypeRef: TeletypeText;
	let processingMessage = '';

	const DEFAULT_ACTION = 'take a chance';

	interface Split {
		action: string;
		weight: number;
	}

	interface SplitResult {
		branches: number;
		selected: Split;
	}

	function handleInputClick(e: Event) {
		const target = e.target as HTMLInputElement;
		target?.select();
	}

	let splits: Split[] = [
		{
			action: 'take a chance',
			weight: 1
		},
		{
			action: 'not take a chance',
			weight: 1
		}
	];

	// Check for shared state on mount
	onMount(() => {
		const sharedState = getUrlState<UniverseState>();
		if (sharedState && sharedState.type === 'universe') {
			// Restore the alternatives and weights
			splits = [
				{ action: sharedState.alternatives[0], weight: sharedState.weights[0] },
				{ action: sharedState.alternatives[1], weight: sharedState.weights[1] }
			];

			// Set the result - find the correct weight for the selected action
			const selectedWeight =
				sharedState.alternatives[0] === sharedState.result
					? sharedState.weights[0]
					: sharedState.weights[1];
			currentResult = {
				selected: { action: sharedState.result, weight: selectedWeight },
				branches: sharedState.weights[0] + sharedState.weights[1]
			};

			showResultModal = true;
		}
	});

	function pValue(splits: Split[], weight: number) {
		let totalWeight = splits.reduce((total, s) => total + s.weight, 0);
		return weight / totalWeight;
	}

	function probability(splits: Split[], weight: number) {
		return percentage(pValue(splits, weight));
	}

	function percentage(val: number): string {
		return new Intl.NumberFormat('default', {
			style: 'percent',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(val);
	}

	async function splitUniverse(splits: Split[]) {
		if (splits.length != 2) {
			throw 'we only support two splits now';
		}

		if (splits[0].action.length == 0) {
			splits[0].action = DEFAULT_ACTION;
		}
		if (splits[1].action.length == 0) {
			splits[1].action = `not ${splits[0].action}`;
		}

		let totalWeight = splits.reduce((total, s) => total + s.weight, 0);

		isSpinning = true;
		processingMessage = 'PROCESSING QUANTUM DATA...';

		// Dispatch event to start signal lost effects
		window.dispatchEvent(new CustomEvent('universe-split-start'));

		let randomNum = await getRand();
		isSpinning = false;
		processingMessage = '';

		// Dispatch event to stop signal lost effects
		window.dispatchEvent(new CustomEvent('universe-split-end'));

		let randomWeight = (randomNum % totalWeight) + 1;

		let selected = splits.find((split) => {
			randomWeight -= split.weight;
			return randomWeight <= 0;
		});

		if (!selected) {
			throw new Error('No split selected - this should never happen');
		}

		currentResult = {
			selected: selected,
			branches: totalWeight
		};

		// Save state to URL
		const state: UniverseState = {
			type: 'universe',
			alternatives: [splits[0].action, splits[1].action],
			weights: [splits[0].weight, splits[1].weight],
			result: selected.action,
			timestamp: Date.now()
		};
		setUrlState(state as unknown as Record<string, unknown>);

		showConfirmModal = false;
		showResultModal = true;

		// Reset the teletype component for the new result
		if (teletypeRef) {
			teletypeRef.reset();
		}
	}

	let contentDiv: Element;

	function placeholderText(splits: Split[], index: number) {
		let action = splits[0].action;
		if (action.length == 0) {
			action = DEFAULT_ACTION;
		}
		if (index == 1) {
			return `not ${action}`;
		} else {
			return DEFAULT_ACTION;
		}
	}
</script>

<svelte:head>
	<title>Free Universe Splitter</title>
	<meta property="og:description" content="Quantum Decision Maker: Let the Multiverse Decide!" />
	<meta property="og:image" content="https://freeuniversesplitter.com/icon_og.png" />
</svelte:head>

<h1>FreeUniverseSplitter.com</h1>

<div class="page-container">
	<div class="intro-section">
		<p>Enter two alternatives below. Universe will be split.</p>
		<p>Which universe you find yourself in is random, depending on the weights you enter.</p>
		<p>
			<a href="about">More info</a> | <a href="magic8ball">Magic 8 Ball</a> |
			<a href="ichingv2">I Ching</a>
		</p>
	</div>

	{#if showResultModal}
		<Modal isOpen={showResultModal} onClose={() => (showResultModal = false)}>
			<div>
				Universe was split into {currentResult?.branches} branch universes.
			</div>
			<div>
				You are in
				{#if currentResult?.selected.weight == 1}
					the universe
				{:else}
					one of the {currentResult?.selected.weight} universes
				{/if}
				in which you should:
			</div>
			<div style="font-size: 36pt; text-align: center; padding-top:20px;">
				{#if currentResult?.selected.action}
					<TeletypeText
						bind:this={teletypeRef}
						text={currentResult.selected.action}
						speed={30}
						delay={500}
					/>
				{/if}
			</div>
			<!--
	    <div style="text-align: center; padding-bottom:20px; font-style:italic">
	        {#if currentResult}
	        p={pValue(splits, currentResult.selected.weight)}
	        {/if}
	    </div>
	    -->
			<ResultDialogButtons
				shareTitle="Universe Splitter Result"
				shareText={currentResult
					? `The universe has decided: ${currentResult.selected.action}`
					: ''}
				onClose={() => {
					clearUrlState();
					showResultModal = false;
				}}
			/>
		</Modal>
	{/if}

	{#if showConfirmModal}
		<Modal isOpen={showConfirmModal} onClose={() => (showConfirmModal = false)}>
			<div>Selected splits:</div>
			<div style="padding-top:20px; padding-bottom:20px">
				{#each splits as split}
					<div>
						<span style="text-decoration: underline">{split.action}</span> - {probability(
							splits,
							split.weight
						)} of universes
					</div>
				{/each}
			</div>
			{#if isSpinning}
				<div style="text-align: center; padding: 20px;">
					<Spinner {processingMessage} {isSpinning} />
				</div>
			{:else}
				<div style="text-align: right; width: 100%">
					<button class="split-button" on:click={() => splitUniverse(splits)}
						>Split Universe!</button
					>
					<button on:click={() => (showConfirmModal = false)}>Cancel</button>
				</div>
			{/if}
		</Modal>
	{/if}

	<div class="main-content">
		<div class="content" bind:this={contentDiv}>
			<div />
			<div>Weight</div>
			{#each splits as split, i}
				<input
					type="text"
					autocapitalize="none"
					enterkeyhint="next"
					placeholder={placeholderText(splits, i)}
					bind:value={split.action}
					on:click={handleInputClick}
				/>
				<input type="number" min="1" bind:value={split.weight} on:click={handleInputClick} />
			{/each}
		</div>

		<div style="text-align: center; padding-top: 10px">
			<button class="splitButton" on:click={() => (showConfirmModal = true)}>Next</button>
		</div>
	</div>
</div>

<style>
	h1 {
		color: black;
		background-color: #41ff00;
		text-align: center;
		font-size: 20pt;
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
		max-width: 100%;
		box-sizing: border-box;
		text-shadow: 0 0 2px black;
		box-shadow: 0 0 5px #41ff00;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 16pt;
		}
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 14pt;
		}
	}
	.content {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-column-gap: 10px;
		grid-row-gap: 10px;
		width: 100%;
		max-width: 100%;
	}
	input {
		font-size: 16pt;
		color: #41ff00;
		background-color: black;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		border: none;
		border-bottom: 1px solid #41ff00;
		outline: none;
	}

	input[type='number'] {
		width: 80px;
		max-width: 80px;
		min-width: 60px;
	}

	.page-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: 100%;
	}

	.intro-section {
		flex-shrink: 0;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		min-height: 0;
		overflow: hidden;
		padding-top: 20px;
	}

	.split-button {
		display: inline-flex;
		align-items: center;
		min-width: 200px;
		justify-content: center;
	}
</style>
