<script lang="ts">
    import MeditationTimer from "../components/MeditationTimer.svelte";
    import { each, onMount } from "svelte/internal";
    import {getRandom, type RandomResult} from "../random"

    let isInstagramBrowser = false

    onMount(() => {
        const ua = (window.navigator.userAgent || window.navigator.vendor).toLowerCase()
        isInstagramBrowser = ua.indexOf("instagram") > 0 || ua.indexOf("facebook") > 0
    })

    const DEFAULT_ACTION = "take a chance"
    let nextNumber = 0

    interface Split {
        action: string
        weight: number
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

    function summary(splits: Split[]) {
        return `Selected splits:\n` +
            `- ${splits[0].action} (${probability(splits, splits[0].weight)} of universes)\n` +
            `- ${splits[1].action} (${probability(splits, splits[1].weight)} of universes)`
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

        let splitSummary = summary(splits)

        if (!window.confirm(splitSummary + "\nContinue?")) {
            window.alert("Universe split canceled.")
            return;
        }

        let totalWeight = splits.reduce((total, s) => total + s.weight, 0)

        let {randomNum, fake} = await getRandom()

        let randomWeight = randomNum % totalWeight + 1

        let selected = splits.find(split => {
            randomWeight -= split.weight
            return randomWeight <= 0
        })!;

        let thisUniverse
        if (selected.weight == 1) {
            if (totalWeight == 2) {
                thisUniverse = "the universe"
            } else {
                thisUniverse = `the one universe`
            }
        } else {
            thisUniverse = `one of the ${selected.weight} universes`
        }

        let universeWasSplit = "Universe was split"
        if (fake) {
            universeWasSplit = "Universe was split (NOT REALLY)"
        }

        window.alert(`${universeWasSplit} into ${totalWeight} branch universes.\nYou are in ${thisUniverse} in which you should:\n==> ${selected.action} <==\n\n(In other universes, you experienced a different outcome)`)
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
    @font-face {
        font-family: 'LessPerfectDOSVGA';
        src: url('/LessPerfectDOSVGA.ttf');
    }
    :global(*) {
        font-family: 'LessPerfectDOSVGA', monospace;
        color: #41FF00;
        background-color: black;
    }
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
    .splitButton {
        font-size: 16pt;
        color: #41FF00;
        background-color: black;
        border-color: #41FF00;
    }
    h2 {
        font-style: italic;
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
    <meta
        name="viewport"
        content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-title" content="Univese Splitter">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
</svelte:head>

{#if isInstagramBrowser}

<h1>This site doesn't work on Instagram or Facebook, please open in your system browser.</h1>

{:else}

<h1>FreeUniverseSplitter.com</h1>

<div>
<p>
    Everything you enter here stays on your device. The only API call this website does it to fetch a quantum random number.
</p>

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
    <button class="splitButton" on:click={() => splitUniverse(splits)}>Split Universe!</button>
</div>
</div>

<div>
    <button on:click={genLotteryNums}>Lottery Numbers</button>
    {lotteryNumbers}
</div>

<p><a href="about">More info</a></p>

<div class="bottom">
    made with &lt;3 by @semistrict
</div>

{/if}