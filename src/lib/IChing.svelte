<script lang="ts">
    import TeletypeText from "$lib/TeletypeText.svelte";
    import { generateHexagram, type Hexagram } from "$lib/ichingLib";
    import { setUrlState, getUrlState, type IChingState } from "$lib/urlState";
    import ResultDialogButtons from "$lib/ResultDialogButtons.svelte";
    import BackButton from "$lib/BackButton.svelte";
    import { onMount } from "svelte";

    let universeWasSplitDialog: HTMLDialogElement;
    let isSpinning = false;
    let teletypeRef: any;
    let spinnerChar = 'Ψ';
    let processingMessage = '';
    let currentResult: Hexagram | undefined;
    let textPhase = false;
    let tabletPhase = false;
    
    const sentences = [
        "Quiet your mind.",
        "Contemplate your situation.",
        "When ready,",
        "seek guidance from the ancient oracle."
    ];
    
    let visibleSentences = new Array(sentences.length).fill(false);

    // Spinner corruption characters
    const corruptChars = ['Ω', 'Φ', 'Θ', 'Λ', 'Π', 'Σ', 'Δ', '█', '▓', '▒', '░', '╬', '※', '◊', '●', '◢', '◤'];
    
    // Fade in animation sequence
    onMount(() => {
        // Check for shared state first
        const sharedState = getUrlState<IChingState>();
        if (sharedState && sharedState.type === 'iching') {
            // Look up hexagram data by number
            import("$lib/hexagrams.json").then(hexagramsData => {
                const hexData = hexagramsData.hexagrams[sharedState.hexagramNumber.toString()];
                if (hexData) {
                    currentResult = {
                        number: sharedState.hexagramNumber,
                        name: hexData.name,
                        reading: hexData.reading,
                        symbol: hexData.symbol,
                        lines: [] // We don't store lines for sharing, just the result
                    };
                    universeWasSplitDialog.showModal();
                }
            });
            return;
        }
        
        // Normal animation sequence
        textPhase = true;
        // Show each sentence with 2-second intervals
        sentences.forEach((_, index) => {
            setTimeout(() => {
                visibleSentences[index] = true;
                visibleSentences = [...visibleSentences]; // Trigger reactivity
            }, 500 + index * 2000);
        });
        
        // Fade out all text after all sentences have appeared
        const fadeOutDelay = 500 + sentences.length * 2000 + 2000;
        setTimeout(() => {
            visibleSentences = new Array(sentences.length).fill(false);
            // End text phase and start tablet phase
            setTimeout(() => {
                textPhase = false;
                tabletPhase = true;
            }, 1000);
        }, fadeOutDelay);
    });
    
    function startSpinnerEffects() {
        // Start with processing message
        processingMessage = 'CONSULTING THE ANCIENT ORACLE...';
        
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

    async function castIChingReading() {
        isSpinning = true;
        startSpinnerEffects();
        
        // Generate hexagram using proper yarrow stick method
        currentResult = await generateHexagram();
        isSpinning = false;
        
        // Save state to URL
        const state: IChingState = {
            type: 'iching',
            hexagramNumber: currentResult.number,
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
    
    .text-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 80px 40px 40px 40px;
        box-sizing: border-box;
    }
    
    .tablet-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 20px 40px 40px 40px;
        box-sizing: border-box;
    }
    
    
    .oracle-tablet:hover {
        transform: scale(1.05);
    }
    
    .oracle-tablet:active {
        transform: scale(0.95);
    }
    
    .trigrams {
        font-size: 36pt;
        color: #41FF00;
        text-shadow: 0 0 10px #41FF00;
        text-align: center;
        line-height: 1.1;
    }
    
    .oracle-text {
        font-size: 10pt;
        color: #41FF00;
        text-align: center;
        margin-top: 8px;
        opacity: 0.8;
        font-style: italic;
    }
    
    .instruction {
        font-size: 16pt;
        text-align: center;
        max-width: 600px;
        line-height: 1.4;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .sentence {
        opacity: 0;
        transition: opacity 1s ease-in-out;
        margin-bottom: 8px;
    }
    
    .sentence.show {
        opacity: 0.9;
    }
    
    .oracle-tablet {
        width: 280px;
        height: 200px;
        min-width: 280px;
        min-height: 200px;
        max-width: 280px;
        max-height: 200px;
        background: linear-gradient(135deg, #1a4a1a, #000, #1a4a1a);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        border: 3px solid #41FF00;
        box-shadow: 0 0 20px #41FF00;
        cursor: pointer;
        transition: transform 0.1s ease;
        flex-shrink: 0;
        padding: 20px;
        box-sizing: border-box;
    }
    
    .spinner-section {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
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
    
    
    .hexagram-display {
        font-size: 64pt;
        margin-bottom: 20px;
        text-align: center;
    }
    
    .hexagram-name {
        font-size: 24pt;
        margin-bottom: 15px;
        text-align: center;
        text-decoration: underline;
    }
</style>

<svelte:head>
    <title>I Ching - Free Universe Splitter</title>
    <meta property="og:description" content="Quantum I Ching: Ancient Wisdom Through the Multiverse!" />
</svelte:head>

<BackButton />

{#if textPhase}
    <div class="text-container">
        <div class="instruction">
            {#each sentences as sentence, index}
                <div class="sentence" class:show={visibleSentences[index]}>{sentence}</div>
            {/each}
        </div>
    </div>
{/if}

{#if tabletPhase}
    <div class="tablet-container">
        <div class="oracle-tablet" on:click={castIChingReading} on:keydown={(e) => e.key === 'Enter' && castIChingReading()} tabindex="0">
            <div class="trigrams">
                ☰<br>
                ☷
            </div>
            <div class="oracle-text">Heaven & Earth</div>
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
{/if}

<dialog bind:this={universeWasSplitDialog}>
    <div>
        The ancient oracle speaks:
    </div>
    
    {#if currentResult}
        <div class="hexagram-display">{currentResult.symbol}</div>
        <div class="hexagram-name">#{currentResult.number} - {currentResult.name}</div>
        <div style="font-size: 18pt; text-align: center; padding: 20px;">
            <TeletypeText bind:this={teletypeRef} text={currentResult.reading} speed={30} delay={500} />
        </div>
    {/if}
    
    <ResultDialogButtons 
        shareTitle="I Ching Reading"
        shareText={currentResult ? `The ancient oracle speaks: #${currentResult.number} - ${currentResult.name}: ${currentResult.reading}` : ""}
        onClose={() => universeWasSplitDialog.close()}
    />
</dialog>