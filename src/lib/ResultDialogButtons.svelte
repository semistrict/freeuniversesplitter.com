<script lang="ts">
	import { shareResult } from '$lib/urlState';

	export let shareTitle: string;
	export let shareText: string;
	export let onClose: () => void;

	async function handleShare() {
		await shareResult(shareTitle, shareText, window.location.href);
	}
</script>

<div style="text-align: center; width: 100%; text-decoration: underline">
	FreeUniverseSplitter.com
</div>
<div style="text-align: right; width: 100%; padding-top: 20px">
	<button on:click={handleShare}>Share</button>
	<button on:click={onClose}>OK</button>
</div>
