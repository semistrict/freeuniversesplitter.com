<script lang="ts">
    import { getRand } from "../random";
    import TeletypeText from "$lib/TeletypeText.svelte";
    import { setUrlState, getUrlState, type Magic8BallState } from "$lib/urlState";
    import { onMount } from "svelte";

    let universeWasSplitDialog: HTMLDialogElement;
    let isSpinning = false;
    let teletypeRef: any;
    let spinnerChar = 'Ψ';
    let processingMessage = '';
    let currentResult: string | undefined;

    // Magic 8 Ball responses
    const magic8BallResponses = [
        "It is certain",
        "Reply hazy, try again",
        "Don't count on it",
        "It is decidedly so",
        "Ask again later",
        "My reply is no",
        "Without a doubt",
        "Better not tell you now",
        "My sources say no",
        "Yes definitely",
        "Cannot predict now",
        "Outlook not so good",
        "You may rely on it",
        "Concentrate and ask again",
        "Very doubtful",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Yes",
        "Signs point to yes"
    ];

    // Spinner corruption characters
    const corruptChars = ['Ω', 'Φ', 'Θ', 'Λ', 'Π', 'Σ', 'Δ', '█', '▓', '▒', '░', '╬', '※', '◊', '●', '◢', '◤'];
    
    // Check for shared state on mount
    onMount(() => {
        const sharedState = getUrlState<Magic8BallState>();
        if (sharedState && sharedState.type === 'magic8ball') {
            currentResult = sharedState.response;
            universeWasSplitDialog.showModal();
        }
    });
    
    function startSpinnerEffects() {
        // Start with processing message
        processingMessage = 'PROCESSING QUANTUM DATA...';
        
        // Start corruption effects
        const corruptionInterval = setInterval(() => {
            if (Math.random() < 0.7) { // 70% chance to corrupt
                spinnerChar = corruptChars[Math.floor(Math.random() * corruptChars.length)];
                setTimeout(() => {
                    spinnerChar = 'Ψ'; // Reset to normal after brief corruption
                }, 200 + Math.random() * 400);
            }
        }, 150);
        
        // Clean up after spinning stops
        setTimeout(() => {
            clearInterval(corruptionInterval);
            spinnerChar = 'Ψ';
            processingMessage = '';
        }, 2100);
    }

    async function askMagic8Ball() {
        isSpinning = true;
        startSpinnerEffects();
        
        // Dispatch event to start signal lost effects
        window.dispatchEvent(new CustomEvent('universe-split-start'));
        
        let randomNum = await getRand();
        isSpinning = false;
        
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
</script>

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
        border: 3px solid #41FF00;
        box-shadow: 0 0 20px #41FF00;
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
        color: #41FF00;
        text-shadow: 0 0 10px #41FF00;
        background: transparent;
    }
    
    .instruction {
        font-size: 18pt;
        text-align: center;
        margin-bottom: 20px;
        opacity: 0.9;
    }
    
    .spinner-container {
        display: inline-block;
        width: 1.5em;
        height: 1.5em;
        position: relative;
        margin-left: 10px;
        vertical-align: middle;
    }
    
    .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        animation: spin 1s linear infinite;
        display: block;
        width: 1.5em;
        height: 1.5em;
        text-align: center;
        line-height: 1.5em;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        25% { transform: translate(-50%, -50%) rotate(90deg); }
        50% { transform: translate(-50%, -50%) rotate(180deg); }
        75% { transform: translate(-50%, -50%) rotate(270deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    button {
        font-size: 16pt;
        color: #41FF00;
        background-color: black;
        border-color: #41FF00;
    }
</style>

<svelte:head>
    <title>Magic 8 Ball - Free Universe Splitter</title>
    <meta property="og:description" content="Quantum Magic 8 Ball: Let the Multiverse Answer Your Questions!" />
</svelte:head>

<div style="text-align: left; padding: 10px 0 0 20px;">
    <a href="/">← Back</a>
</div>

<div class="magic8ball-container">
    <div class="instruction">
        Think of a yes/no question and click the ball
    </div>
    
    <div class="magic8ball" on:click={askMagic8Ball} on:keydown={(e) => e.key === 'Enter' && askMagic8Ball()} tabindex="0">
        <div class="eight">8</div>
    </div>
    
    <div class="spinner-section">
        {#if isSpinning}
            <div style="text-align: center; font-size: 18pt;">
                {#if processingMessage}
                    <div style="font-size: 14pt; margin-bottom: 10px; opacity: 0.8;">
                        {processingMessage}
                    </div>
                {/if}
                <span class="spinner-container">
                    <span class="spinner">{spinnerChar}</span>
                </span>
            </div>
        {/if}
    </div>
</div>

<dialog bind:this={universeWasSplitDialog}>
    <div>
        The quantum magic 8 ball reveals:
    </div>
    <div style="font-size: 36pt; text-align: center; padding: 20px;">
        {#if currentResult}
            <TeletypeText bind:this={teletypeRef} text={currentResult} speed={30} delay={500} />
        {/if}
    </div>
    <div style="text-align: center; width: 100%; text-decoration: underline">FreeUniverseSplitter.com</div>
    <div style="text-align: right; width: 100%">
        <button on:click={() => universeWasSplitDialog.close()}>OK</button>
    </div>
</dialog>

