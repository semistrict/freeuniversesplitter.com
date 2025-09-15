<script>
	import CrtOverlay from '$lib/CrtOverlay.svelte';
</script>

<svelte:head>
	<meta name="theme-color" content="#000000" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<link rel="shortcut icon" type="image/png" href="/apple-touch-icon.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="application-name" content="Universe Splitter" />
	<meta name="mobile-web-app-capable" content="yes" />

	<meta name="apple-mobile-web-app-title" content="Univese Splitter" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
</svelte:head>

<CrtOverlay>
	<main>
		<h1>FreeUniverseSplitter.com</h1>
		<slot />
	</main>
</CrtOverlay>

<style>
	@font-face {
		font-family: 'LessPerfectDOSVGA';
		src: url('/LessPerfectDOSVGA.ttf');
	}
	:global(*) {
		font-family: 'LessPerfectDOSVGA', monospace;
		color: #41ff00;
		background-color: black;
		text-shadow: 0 0 5px #41ff00;
	}

	:global(body) {
		font-size: 18px;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		touch-action: pan-x pan-y;
		-webkit-touch-callout: none;
	}

	:global(html) {
		touch-action: pan-x pan-y;
		-webkit-touch-callout: none;
	}

	:global(button) {
		font-size: 20px;
		color: #41ff00;
		background-color: black;
		border: 1px solid #41ff00;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 100px;
		padding: 8px 12px;
		box-sizing: border-box;
	}

	:global(button:hover) {
		color: black;
		background-color: #41ff00;
	}

	main {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	h1 {
		color: black;
		background-color: #41ff00;
		text-align: center;
		font-size: clamp(12pt, 6vw, 28pt);
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
		max-width: 100%;
		box-sizing: border-box;
		text-shadow: 0 0 2px black;
		box-shadow: 0 0 5px #41ff00;
		margin-top: max(20px, env(safe-area-inset-top));
		white-space: nowrap;
		padding: 10px 20px;
	}
</style>
