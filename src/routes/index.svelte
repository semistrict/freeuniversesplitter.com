<script lang="ts">
    import {getRand} from "../random"
    import TeletypeText from "$lib/TeletypeText.svelte"
    import { setUrlState, getUrlState, type UniverseState } from "$lib/urlState"
    import { onMount } from "svelte"

    let currentResult: SplitResult | undefined
    let universeWasSplitDialog: HTMLDialogElement
    let confirmDialog: HTMLDialogElement
    let isSpinning = false
    let teletypeRef: any
    let spinnerChar = 'Ψ'
    let processingMessage = ''

    const DEFAULT_ACTION = "take a chance"
    let nextNumber = 0

    interface Split {
        action: string
        weight: number
    }

    interface SplitResult {
        branches: number
        selected: Split
    }

    let splits: Split[] = [
        {
            action: 'take a chance',
            weight: 1,
        },
        {
            action: 'not take a chance',
            weight: 1,
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
            const selectedWeight = sharedState.alternatives[0] === sharedState.result ? 
                sharedState.weights[0] : sharedState.weights[1];
            currentResult = {
                selected: { action: sharedState.result, weight: selectedWeight },
                branches: sharedState.weights[0] + sharedState.weights[1]
            };
            
            universeWasSplitDialog.showModal();
        }
    });

    function pValue(splits: Split[], weight: number) {
        let totalWeight = splits.reduce((total, s) => total + s.weight, 0)
        return weight / totalWeight;
    }

    function probability(splits: Split[], weight: number) {
        return percentage(pValue(splits, weight));
    }

    function percentage(val: number): string {
        return new Intl.NumberFormat('default', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val);
    }

    // Spinner corruption characters
    const corruptChars = ['Ω', 'Φ', 'Θ', 'Λ', 'Π', 'Σ', 'Δ', '█', '▓', '▒', '░', '╬', '※', '◊', '●', '◢', '◤'];
    
    function startSpinnerEffects() {
        // Start with processing message
        processingMessage = 'PROCESSING QUANTUM DATA...';
        
        // Start corruption effects - more frequent and longer lasting
        const corruptionInterval = setInterval(() => {
            if (Math.random() < 0.7) { // 70% chance to corrupt
                spinnerChar = corruptChars[Math.floor(Math.random() * corruptChars.length)];
                setTimeout(() => {
                    spinnerChar = 'Ψ'; // Reset to normal after brief corruption
                }, 200 + Math.random() * 400); // Longer corruption duration
            }
        }, 150); // More frequent corruption
        
        // Clean up after spinning stops
        setTimeout(() => {
            clearInterval(corruptionInterval);
            spinnerChar = 'Ψ';
            processingMessage = '';
        }, 2100); // Slightly longer than minimum delay
    }

    async function splitUniverse(splits: Split[]) {
        if (splits.length != 2) {
            throw "we only support two splits now";
        }

        if (splits[0].action.length == 0) {
            splits[0].action = DEFAULT_ACTION
        }
        if (splits[1].action.length == 0) {
            splits[1].action = `not ${splits[0].action}`
        }

        let totalWeight = splits.reduce((total, s) => total + s.weight, 0)

        isSpinning = true;
        startSpinnerEffects();
        
        // Dispatch event to start signal lost effects
        window.dispatchEvent(new CustomEvent('universe-split-start'));
        
        let randomNum = await getRand()
        isSpinning = false;
        
        // Dispatch event to stop signal lost effects
        window.dispatchEvent(new CustomEvent('universe-split-end'));

        let randomWeight = randomNum % totalWeight + 1

        let selected = splits.find(split => {
            randomWeight -= split.weight
            return randomWeight <= 0
        })!;

        currentResult = {
            selected: selected,
            branches: totalWeight
        }
        
        // Save state to URL
        const state: UniverseState = {
            type: 'universe',
            alternatives: [splits[0].action, splits[1].action],
            weights: [splits[0].weight, splits[1].weight],
            result: selected.action,
            timestamp: Date.now()
        };
        setUrlState(state);
        
        confirmDialog.close();
        universeWasSplitDialog.showModal();
        
        // Reset the teletype component for the new result
        if (teletypeRef) {
            teletypeRef.reset();
        }
    }

    let contentDiv: Element

    function placeholderText(splits: Split[], index: number) {
        let action = splits[0].action
        if (action.length == 0) {
            action = DEFAULT_ACTION
        }
        if (index == 1) {
            return `not ${action}`
        } else {
            return DEFAULT_ACTION
        }
    }
</script>

<style>
    h1 {
        color: black;
        background-color: #41FF00;
        text-align: center;
        font-size: 20pt;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        max-width: 100%;
        box-sizing: border-box;
        text-shadow: 0 0 2px black;
        box-shadow: 0 0 5px #41FF00;
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
        color: #41FF00;
        background-color: black;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        border: none;
        border-bottom: 1px solid #41FF00;
        outline: none;
    }
    
    input[type="number"] {
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
    button {
        font-size: 16pt;
        color: #41FF00;
        background-color: black;
        border-color: #41FF00;
    }
    .bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding-bottom: 1em;
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
    
    .split-button {
        display: inline-flex;
        align-items: center;
        min-width: 200px;
        justify-content: center;
    }
</style>

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
<p><a href="about">More info</a> | <a href="magic8ball">Magic 8 Ball</a> | <a href="ichingv2">I Ching</a></p>
</div>

<dialog bind:this={universeWasSplitDialog}>
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
            <TeletypeText bind:this={teletypeRef} text={currentResult.selected.action} speed={30} delay={500} />
        {/if}
    </div>
    <!--
    <div style="text-align: center; padding-bottom:20px; font-style:italic">
        {#if currentResult}
        p={pValue(splits, currentResult.selected.weight)}
        {/if}
    </div>
    -->
    <div style="text-align: center; width: 100%; text-decoration: underline">FreeUniverseSplitter.com</div>
    <div style="text-align: right; width: 100%"><button on:click={() => universeWasSplitDialog.close()}>OK</button></div>
</dialog>

<dialog bind:this={confirmDialog}>
    <div>Selected splits:</div>
    <div style="padding-top:20px; padding-bottom:20px">
    {#each splits as split}
        <div><span style="text-decoration: underline">{split.action}</span> - {probability(splits, split.weight)} of universes</div>
    {/each}
    </div>
    {#if isSpinning}
        <div style="text-align: center; padding: 20px; font-size: 18pt;">
            {#if processingMessage}
                <div style="font-size: 14pt; margin-bottom: 10px; opacity: 0.8;">
                    {processingMessage}
                </div>
            {/if}
            <span class="spinner-container">
                <span class="spinner">{spinnerChar}</span>
            </span>
        </div>
    {:else}
        <div style="text-align: right; width: 100%">
            <button class="split-button" on:click={() => splitUniverse(splits)}>Split Universe!</button>
            <button on:click={() => confirmDialog.close()}>Cancel</button>
        </div>
    {/if}
</dialog>

<div class="main-content">
    <div class="content" bind:this={contentDiv}>
        <div></div>
        <div>Weight</div>
        {#each splits as split, i}
            <input type=text autocapitalize=none enterkeyhint=next
                placeholder={placeholderText(splits, i)}
                bind:value={split.action}
                on:click={(e) => e.target?.select() }
            />
            <input type=number min=1 bind:value={split.weight} on:click={(e) => e.target?.select() } />
        {/each}
    </div>

    <div style="text-align: center; padding-top: 10px">
        <button class="splitButton" on:click={() => confirmDialog.showModal()}>Next</button>
    </div>
</div>
</div>
