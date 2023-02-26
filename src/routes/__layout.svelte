<style>
    @font-face {
        font-family: 'LessPerfectDOSVGA';
        src: url('/LessPerfectDOSVGA.ttf');
    }
    :global(*) {
        font-family: 'LessPerfectDOSVGA', monospace;
        color: #41FF00;
        background-color: black;
    }

    :global(dialog::backdrop) {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(4px) contrast(0.6);
        -webkit-backdrop-filter: blur(4px) contrast(0.6);
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

<main>
    <slot/>
</main>
