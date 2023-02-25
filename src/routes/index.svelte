<script lang="ts">
    import {getRandom, type RandomResult} from "../random"

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
            action: 'Take a chance',
            weight: 1,
        },
        {
            action: 'Play it safe',
            weight: 1,
        }
    ];

    function probability(splits: Split[], weight: number) {
        let totalWeight = splits.reduce((total, s) => total + s.weight, 0)
        return percentage(weight / totalWeight)
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

        let {randomNum} = await getRandom()

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

    let lotteryNumbers = ''

    async function genLotteryNums() {
        let promises: Array<Promise<RandomResult>> = []
        lotteryNumbers = ''
        for (let i = 0; i < 6; i++) {
            promises.push(getRandom())
        }
        for (let i = 0; i < 5; i++) {
            lotteryNumbers += " " + ((await promises[i]).randomNum % 70 + 1)
        }
        lotteryNumbers += " " + ((await promises[5]).randomNum % 25 + 1)
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
    dialog::backdrop {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(4px) contrast(0.6);
        -webkit-backdrop-filter: blur(4px) contrast(0.6);
    }
</style>

<svelte:head>
    <title>Free Universe Splitter</title>
</svelte:head>

<h1>FreeUniverseSplitter.com</h1>

<div>
<p>
    Everything you enter here stays on your device.
</p>
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
    <div style="font-size: 36pt; text-align: center; text-decoration:underline; padding-top:20px; padding-bottom:20px">
        {currentResult?.selected.action}
    </div>
    <div style="text-align: right; width: 100%"><button on:click={() => universeWasSplitDialog.close()}>OK</button></div>
</dialog>

<dialog bind:this={confirmDialog}>
    <div>Selected splits:</div>
    <ul style="padding-top:20px; padding-bottom:20px">
    {#each splits as split}
        <li><span style="text-decoration: underline">{split.action}</span> - {probability(splits, splits[0].weight)} of universes</li>
    {/each}
    </ul>
    <div style="text-align: right; width: 100%">
        <button on:click={() => {confirmDialog.close(); splitUniverse(splits)}}>Proceed</button>
        <button on:click={() => confirmDialog.close()}>Cancel</button>
    </div>
</dialog>

<div class="content" bind:this={contentDiv}>
    <div>
    </div>
    <div>N</div>
    {#each splits as split, i}
        <input type=text autocapitalize=none enterkeyhint=next placeholder={placeholderText(splits, i)} bind:value={split.action} />
        <input type=number min=1 bind:value={split.weight} />
    {/each}
</div>

<div>
    <p>N = number of universes in this split</p>
</div>

<div style="text-align: center">
    <button class="splitButton" on:click={() => confirmDialog.showModal()}>Split Universe!</button>
</div>
</div>

<div class="bottom">
    made with &lt;3 by @semistrict
</div>
