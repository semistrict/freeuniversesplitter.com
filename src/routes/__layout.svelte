<script>
    import CrtOverlay from '$lib/CrtOverlay.svelte';
</script>

<style>
    @font-face {
        font-family: 'LessPerfectDOSVGA';
        src: url('/LessPerfectDOSVGA.ttf');
    }
    :global(*) {
        font-family: 'LessPerfectDOSVGA', monospace;
        color: #41FF00;
        background-color: black;
        text-shadow: 0 0 5px #41FF00;
    }

    :global(dialog::backdrop) {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
    }
    
    :global(dialog) {
        background: black;
        color: #41FF00;
        border: 2px solid #41FF00;
        border-radius: 8px;
        padding: 20px;
        max-width: 90%;
        max-height: 80%;
    }
    
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }
    
    main {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>

<svelte:head>
    <meta name="theme-color" content="#41FF00">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="shortcut icon" type="image/png" href="/apple-touch-icon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="application-name" content="Universe Splitter">
<meta name="mobile-web-app-capable" content="yes">

<meta
        name="viewport"
        content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-title" content="Univese Splitter">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
</svelte:head>

<CrtOverlay>
    <main>
        <slot/>
    </main>
</CrtOverlay>
