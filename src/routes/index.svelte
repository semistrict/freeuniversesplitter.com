<script lang="ts">
    import { each } from "svelte/internal";

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

    function addSplit() {
        splits.push({action: '', weight: 1})
        splits = splits // update UI
    }

    function probability(weight: number) {
        let totalWeight = splits.reduce((total, s) => total + s.weight, 0)
        return weight / totalWeight
    }

    function percentage(val: number): string {
        return new Intl.NumberFormat('default', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val);
    }

    function removeSplit(i: number) {
        if (splits.length <= 2) {
            return
        }
        splits.splice(i, 1)
        splits = splits
    }

    async function splitUniverse(splits: Split[]) {
        let resp = await fetch("split")
        let body = await resp.json()
        if (!body.success) {
            throw `request failed! ${resp.status}`
        }
        let randomNum = body.data[0]
        let totalWeight = splits.reduce((total, s) => total + s.weight, 0)
        let randomWeight = randomNum % totalWeight + 1
        let selected = splits.find(split => {
            randomWeight -= split.weight
            return randomWeight <= 0
        });
        alert(`You are in the universe in which you should ${selected?.action}!`)
    }
</script>

<style>
    * {
        font-family: monospace;
    }
    .content {
        display: grid;
        grid-template-columns: 70% 10% 10% 10%;
        grid-column-gap: 10px;
    }
</style>

<svelte:head>
    <meta
        name="viewport"
        content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
</svelte:head>

<h1>Let the Multiverse Decide!</h1>
<div class="content">
    <div>
    </div>
    <div>Weight</div>
    <div>Probability</div>
    <div></div>
    {#each splits as split, i}
        <input type=text placeholder="In this universe I will..." bind:value={split.action} />
        <input type=number  min=1 bind:value={split.weight} />
        <div>
            {percentage(probability(split.weight))}
        </div>
        <button on:click={() => removeSplit(i)}>-</button>
    {/each}
    <button on:click={addSplit}>Add</button>
</div>

<div>
    <button on:click={() => splitUniverse(splits)}>Split Universe!</button>
</div>
