<script lang="ts">
	import { onMount } from 'svelte';
	import { getRand } from '../random';

	// Single state for signal disruption effect
	let signalDisruptionState: 'normal' | 'disrupted' | 'reconnecting' = 'normal';
	let showSignalLostText = false; // Controls the flashing "SIGNAL LOST" text
	let signalLostInterval: { clear: () => void } | null = null;

	// Listen for universe splitting events
	onMount(() => {
		const handleSplitStart = async () => {
			// Check if we're in development mode
			const isDev = import.meta.env.DEV;

			if (isDev) {
				// DEVELOPMENT: Always trigger signal disruption for testing
				console.log('Signal disruption: ALWAYS triggering (dev mode)');
				startSignalDisruption();
			} else {
				// PRODUCTION: Use quantum randomness to decide if signal disruption should happen (1/π probability)
				const quantumRandom = await getRand();
				const probability = 1 / Math.PI; // approximately 0.318 or 31.8%

				// Use modulo to get a value between 0-999, then check if it's < probability * 1000
				const normalizedRandom = quantumRandom % 1000;
				const threshold = probability * 1000; // approximately 318
				const shouldDisrupt = normalizedRandom < threshold;

				console.log('Signal disruption check:', {
					quantumRandom,
					normalizedRandom,
					threshold,
					shouldDisrupt
				});

				if (shouldDisrupt) {
					startSignalDisruption();
				}
			}
		};

		const handleSplitEnd = () => {
			endSignalDisruption();
		};

		window.addEventListener('universe-split-start', handleSplitStart);
		window.addEventListener('universe-split-end', handleSplitEnd);

		return () => {
			window.removeEventListener('universe-split-start', handleSplitStart);
			window.removeEventListener('universe-split-end', handleSplitEnd);
			if (signalLostInterval) {
				signalLostInterval.clear();
				signalLostInterval = null;
			}
		};
	});

	function startSignalDisruption() {
		// Enter disrupted state
		signalDisruptionState = 'disrupted';
		showSignalLostText = false; // Start with text hidden

		// Deterministic pattern: show signal lost at specific intervals (reduced timing)
		const pattern = [400, 600, 200, 800, 300]; // Reduced from longer intervals
		let patternIndex = 0;
		let nextTimeout: ReturnType<typeof setTimeout>;

		function scheduleNext() {
			nextTimeout = setTimeout(() => {
				// Show "SIGNAL LOST" text
				showSignalLostText = true;

				// Hide it after 300ms and schedule next
				setTimeout(() => {
					showSignalLostText = false;
					patternIndex = (patternIndex + 1) % pattern.length;
					scheduleNext();
				}, 300); // Show "SIGNAL LOST" for 300ms
			}, pattern[patternIndex]);
		}

		scheduleNext();

		// Store timeout reference for cleanup
		signalLostInterval = { clear: () => clearTimeout(nextTimeout) };
	}

	function endSignalDisruption() {
		// Only proceed if we're actually in a disrupted state
		if (signalDisruptionState === 'normal') {
			return; // No disruption was active, nothing to end
		}

		// Clear the signal lost interval
		if (signalLostInterval) {
			signalLostInterval.clear();
			signalLostInterval = null;
		}

		// Hide the signal lost text and transition to reconnecting state
		showSignalLostText = false;
		signalDisruptionState = 'reconnecting';

		// After showing reconnected message, return to normal
		setTimeout(() => {
			signalDisruptionState = 'normal';
		}, 800);
	}
</script>

<div class="crt-screen">
	<div class="crt-bezel">
		<div class="crt-content">
			<div class="content-area">
				<slot />
			</div>
			<div class="scanlines" />
			<div class="scanning-beam" />
			<div class="vignette" />
			<div class="flicker" />
			{#if signalDisruptionState === 'disrupted'}
				<div class="static-background">
					<div class="signal-static" />
					{#if showSignalLostText}
						<div class="signal-lost-text">SIGNAL LOST</div>
					{/if}
				</div>
			{/if}
			{#if signalDisruptionState === 'reconnecting'}
				<div class="static-background">
					<div class="reconnected-text">RECONNECTED</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.crt-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.crt-bezel {
		width: min(90vw, 80vh * 4/3);
		height: min(90vw * 3/4, 80vh);
		max-width: 1200px;
		max-height: 900px;
		background: linear-gradient(45deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
		border-radius: 60px;
		padding: 40px;
		box-sizing: border-box;
		position: relative;
		box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8), 0 0 100px rgba(0, 0, 0, 0.5);
	}

	@media (max-width: 768px) {
		.crt-bezel {
			width: 95vw;
			height: 85vh;
			max-width: none;
			max-height: none;
			border-radius: 30px;
			padding: 20px;
		}
	}

	.crt-content {
		width: 100%;
		height: 100%;
		background: radial-gradient(
			circle at center,
			transparent 0%,
			transparent 70%,
			rgba(0, 0, 0, 0.1) 85%,
			rgba(0, 0, 0, 0.4) 100%
		);
		border-radius: 40px;
		position: relative;
		overflow: hidden;
	}

	.crt-content::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.15) 0%,
			transparent 30%,
			transparent 70%,
			rgba(255, 255, 255, 0.08) 100%
		);
		z-index: 100;
		pointer-events: none;
	}

	.crt-content::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
				ellipse 200px 300px at 20% 20%,
				rgba(255, 255, 255, 0.2) 0%,
				transparent 50%
			),
			radial-gradient(ellipse 150px 200px at 80% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
		z-index: 101;
		pointer-events: none;
	}

	.content-area {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 5;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 30px;
		box-sizing: border-box;
		contain: layout;
	}

	.scanlines {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.4) 3px,
			rgba(0, 0, 0, 0.4) 4px
		);
		pointer-events: none;
		z-index: 10;
		animation: scanline-flicker 6s infinite linear;
	}

	@keyframes scanline-flicker {
		0% {
			opacity: 0.7;
		}
		25% {
			opacity: 0.9;
		}
		50% {
			opacity: 0.8;
		}
		75% {
			opacity: 1;
		}
		100% {
			opacity: 0.7;
		}
	}

	.scanning-beam {
		position: absolute;
		top: -15px;
		left: 0;
		right: 0;
		height: 20px;
		background: linear-gradient(
			to bottom,
			transparent,
			rgba(65, 255, 0, 0.05),
			rgba(65, 255, 0, 0.1),
			rgba(65, 255, 0, 0.15),
			rgba(65, 255, 0, 0.1),
			rgba(65, 255, 0, 0.05),
			transparent
		);
		box-shadow: 0 0 8px rgba(65, 255, 0, 0.1);
		pointer-events: none;
		z-index: 11;
		animation: scan-down 4s infinite linear;
	}

	@keyframes scan-down {
		0% {
			top: -15px;
			opacity: 0;
		}
		5% {
			opacity: 1;
		}
		95% {
			opacity: 1;
		}
		100% {
			top: calc(100% + 10px);
			opacity: 0;
		}
	}

	.vignette {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			circle at center,
			transparent 0%,
			transparent 50%,
			rgba(0, 0, 0, 0.2) 80%,
			rgba(0, 0, 0, 0.6) 100%
		);
		pointer-events: none;
		z-index: 4;
	}

	.flicker {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(65, 255, 0, 0.02);
		pointer-events: none;
		z-index: 5;
		animation: flicker 2s infinite;
	}

	@keyframes flicker {
		0%,
		50%,
		100% {
			opacity: 0.8;
		}
		25% {
			opacity: 0.9;
		}
		75% {
			opacity: 0.85;
		}
	}

	.signal-lost-text {
		font-size: 32pt;
		color: #ff0000;
		font-weight: bold;
		text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
		z-index: 201;
		animation: signalLostPulse 0.2s infinite;
	}

	@keyframes signalLostPulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.crt-bezel::before {
		content: '';
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
		bottom: 20px;
		border-radius: 50px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.crt-screen {
			padding: 1vh 1vw;
		}

		.crt-content {
			border-radius: 20px;
		}

		.signal-lost-text {
			font-size: 24pt;
		}

		.reconnected-text {
			font-size: 20pt;
		}
	}

	.reconnected-text {
		font-size: 28pt;
		color: #00ff00;
		font-weight: bold;
		text-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;
		z-index: 201;
		animation: reconnectedGlow 0.3s ease-in-out;
	}

	.static-background {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: signalLostFlicker 0.1s infinite;
	}

	.signal-static {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
				0deg,
				rgba(255, 255, 255, 0.3) 0px,
				rgba(255, 255, 255, 0.3) 2px,
				transparent 2px,
				transparent 4px
			),
			repeating-linear-gradient(
				90deg,
				rgba(255, 255, 255, 0.2) 0px,
				rgba(255, 255, 255, 0.2) 1px,
				transparent 1px,
				transparent 3px
			);
		animation: staticNoise 0.05s infinite;
	}

	@keyframes signalLostFlicker {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes staticNoise {
		0% {
			transform: translateX(0px) translateY(0px);
			opacity: 1;
		}
		20% {
			transform: translateX(-2px) translateY(2px);
			opacity: 0.8;
		}
		40% {
			transform: translateX(3px) translateY(-1px);
			opacity: 0.9;
		}
		60% {
			transform: translateX(-1px) translateY(-2px);
			opacity: 0.7;
		}
		80% {
			transform: translateX(2px) translateY(1px);
			opacity: 0.85;
		}
		100% {
			transform: translateX(-3px) translateY(3px);
			opacity: 1;
		}
	}

	@keyframes reconnectedGlow {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
