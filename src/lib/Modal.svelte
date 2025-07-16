<script lang="ts">
	import { fade } from 'svelte/transition';

	export let isOpen = false;
	export let onClose: (() => void) | undefined = undefined;

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget && onClose) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && onClose) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="modal-backdrop"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		in:fade={{ duration: 0 }}
		out:fade={{ duration: 0 }}
	>
		<div class="modal-content">
			<slot />
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 20px;
		box-sizing: border-box;
	}

	.modal-content {
		background: black;
		color: #41ff00;
		border: 2px solid #41ff00;
		border-radius: 8px;
		padding: 20px;
		max-width: 90%;
		max-height: 80%;
		overflow-y: auto;
		position: relative;
		font-family: 'LessPerfectDOSVGA', monospace;
		text-shadow: 0 0 5px #41ff00;
	}
</style>
