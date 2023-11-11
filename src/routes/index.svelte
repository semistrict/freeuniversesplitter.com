<script lang="ts">
    import {getRand} from "../random"

    let currentResult: SplitResult | undefined
    let universeWasSplitDialog: HTMLDialogElement
    let confirmDialog: HTMLDialogElement

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

        let randomNum = await getRand()


        let randomWeight = randomNum % totalWeight + 1

        let selected = splits.find(split => {
            randomWeight -= split.weight
            return randomWeight <= 0
        })!;

        currentResult = {
            selected: selected,
            branches: totalWeight
        }
        universeWasSplitDialog.showModal()
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
    }
    .content {
        display: grid;
        grid-template-columns: 80% 20%;
        grid-column-gap: 10px;
        grid-row-gap: 10px;
    }
    input {
        font-size: 16pt;
        color: #41FF00;
        background-color: black;
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
</style>

<svelte:head>
    <title>Free Universe Splitter</title>
    <meta property="og:description" content="Quantum Decision Maker: Let the Multiverse Decide!" />
    <meta property="og:image" content="https://freeuniversesplitter.com/icon_og.png" />
</svelte:head>

<h1>FreeUniverseSplitter.com</h1>

<div>
<p>Enter two alternatives below. Universe will be split.</p>
<p>Which universe you find yourself in is random, depending on the weights you enter.</p>
<p><a href="about">More info</a></p>

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
        {currentResult?.selected.action}
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
    <div style="text-align: right; width: 100%">
        <button on:click={() => {confirmDialog.close(); splitUniverse(splits)}}>Split Universe!</button>
        <button on:click={() => confirmDialog.close()}>Cancel</button>
    </div>
</dialog>

<div class="content" bind:this={contentDiv}>
    <div>
    </div>
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

<div class="bottom">
    made with &lt;3 by @semistrict
</div>
