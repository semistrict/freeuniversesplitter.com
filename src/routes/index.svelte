<script lang="ts">
    import { each, onMount } from "svelte/internal";

    const DEFAULT_ACTION = "take a chance"

    interface Split {
        action: string
        weight: number
    }

    let splits: Split[] = [
        {
            action: '',
            weight: 1,
        },
        {
            action: '',
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

        if (!window.confirm(splitSummary + "\nAre you sure you want to continue?\nRemember: you could end up in any of the universes!")
         || !window.confirm("Are you really, really sure?")) {
            window.alert("Universe split canceled.")
            return;
        }

        let resp = await fetch("https://api.freeuniversesplitter.com/split", {
            method: 'POST',
            cache: 'no-cache',
        })
        let body = await resp.json()
        if (!body.success) {
            window.alert(`Oh no! Something went wrong... (${resp.status})`)
            throw `request failed! ${resp.status}`
        }
        
        let randomNum = body.data[0]
        let totalWeight = splits.reduce((total, s) => total + s.weight, 0)

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

        window.alert(`Universe was split into ${totalWeight} branch universes.\nYou are in ${thisUniverse} in which you should:\n==> ${selected.action} <==\n\n(In other universes, you experienced a different outcome)`)
    }

    let contentDiv: Element

    onMount(() => {
        let text = contentDiv?.querySelector('input[type="text"]') as HTMLInputElement
        text?.focus()
    })

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
    * {
        font-family: monospace;
    }
    .content {
        display: grid;
        grid-template-columns: 80% 20%;
        grid-column-gap: 10px;
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

<h1>FreeUniverseSplitter.com</h1>
<h2>let the multiverse decide</h2>

<p>Instructions:</p>
<ol>
    <li>describe the outcomes in each split</li>
    <li>(optional) adjust the number universes where each outcome is selected</li>
    <li>click "Split Universe"</li>
    <li>marvel at the wisdom of the multiverse!</li>
</ol>

<p>
    NB: everything you enter here stays on your device. The only API call this website does it to fetch a quantum random number.
</p>

<p><a href="about">More info</a></p>

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

<div>
    <button on:click={() => splitUniverse(splits)}>Split Universe!</button>
</div>

