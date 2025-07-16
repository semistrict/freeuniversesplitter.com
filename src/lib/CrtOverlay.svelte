<script lang="ts">
	import { onMount } from 'svelte';
	import { getRand } from '../random';

	// Signal disruption effect state
	let signalDisruptionState: 'normal' | 'disrupted' | 'signal-lost' | 'reconnecting' = 'normal';
	let currentDisruption: Promise<void> | null = null;

	// Listen for universe splitting events
	onMount(() => {
		const handleSplitStart = async () => {
			// Check if we're in development mode
			const isDev = import.meta.env.DEV;

			if (isDev) {
				// DEVELOPMENT: Always trigger signal disruption for testing
				console.log('Signal disruption: ALWAYS triggering (dev mode)');
				runSignalDisruption();
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
					runSignalDisruption();
				}
			}
		};

		const handleSplitEnd = () => {
			// Split end doesn't need to do anything - the async function will complete naturally
		};

		window.addEventListener('universe-split-start', handleSplitStart);
		window.addEventListener('universe-split-end', handleSplitEnd);

		return () => {
			window.removeEventListener('universe-split-start', handleSplitStart);
			window.removeEventListener('universe-split-end', handleSplitEnd);
		};
	});

	async function runSignalDisruption() {
		// Prevent multiple simultaneous disruptions
		if (currentDisruption) {
			return;
		}

		// Set the current disruption promise
		currentDisruption = executeSignalDisruption();
		return currentDisruption;
	}

	async function executeSignalDisruption() {
		try {
			// Flash "SIGNAL LOST" pattern for about 3-4 seconds
			const pattern = [400, 250, 700];

			for (let i = 0; i < pattern.length; i++) {
				// Show static background only
				signalDisruptionState = 'disrupted';
				await new Promise((resolve) => setTimeout(resolve, pattern[i]));

				// Show "SIGNAL LOST" text
				signalDisruptionState = 'signal-lost';
				await new Promise((resolve) => setTimeout(resolve, 300));
			}

			// Transition to reconnecting
			signalDisruptionState = 'reconnecting';

			// Show "RECONNECTED" for 800ms
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Return to normal
			signalDisruptionState = 'normal';
		} finally {
			// Always clean up
			currentDisruption = null;
			signalDisruptionState = 'normal';
		}
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
				</div>
			{/if}
			{#if signalDisruptionState === 'signal-lost'}
				<div class="static-background">
					<div class="signal-static" />
					<div class="signal-lost-text">SIGNAL LOST</div>
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
		background: radial-gradient(circle at center, #1a1a1a 0%, #0f0f0f 70%, #000000 100%);
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
		top: -60px;
		left: 0;
		right: 0;
		height: 80px;
		background: linear-gradient(
			to bottom,
			transparent,
			rgba(65, 255, 0, 0.02),
			rgba(65, 255, 0, 0.05),
			rgba(65, 255, 0, 0.08),
			rgba(65, 255, 0, 0.15),
			rgba(65, 255, 0, 0.15),
			rgba(65, 255, 0, 0.08),
			rgba(65, 255, 0, 0.05),
			rgba(65, 255, 0, 0.02),
			transparent
		);
		box-shadow: 0 0 20px rgba(65, 255, 0, 0.15);
		pointer-events: none;
		z-index: 11;
		animation: scan-down 4s infinite linear;
	}

	@keyframes scan-down {
		0% {
			top: -60px;
			opacity: 0;
		}
		5% {
			opacity: 1;
		}
		95% {
			opacity: 1;
		}
		100% {
			top: calc(100% + 20px);
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
				ellipse at center,
				transparent 0%,
				transparent 15%,
				rgba(0, 0, 0, 0.2) 35%,
				rgba(0, 0, 0, 0.5) 55%,
				rgba(0, 0, 0, 0.8) 75%,
				rgba(0, 0, 0, 0.95) 90%,
				rgba(0, 0, 0, 1) 100%
			),
			linear-gradient(
				to right,
				rgba(0, 0, 0, 0.4) 0%,
				transparent 15%,
				transparent 85%,
				rgba(0, 0, 0, 0.4) 100%
			),
			linear-gradient(
				to bottom,
				rgba(0, 0, 0, 0.4) 0%,
				transparent 15%,
				transparent 85%,
				rgba(0, 0, 0, 0.4) 100%
			);
		pointer-events: none;
		z-index: 12;
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
			padding: 0;
			background: none;
		}

		.crt-bezel {
			width: 100vw;
			height: 100vh;
			max-width: none;
			max-height: none;
			border-radius: 0;
			padding: 0;
		}

		.crt-content {
			border-radius: 0;
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
