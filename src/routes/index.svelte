<script lang="typescript">
    import { each } from "svelte/internal";

    let splits = [
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

    function splitUniverse() {
        alert('Coming soon!')
    }
</script>

<style>
.content {
    display: grid;
    grid-template-columns: 80% 10% 10%;
    grid-column-gap: 10px;
}
</style>

<h1>Let the Multiverse Decide!</h1>
<div class="content">
    <div>
    </div>
    <div>Weight</div>
    <div>Probability</div>
    {#each splits as split}
        <input type=text placeholder="In this universe I will..." bind:value={split.action} />
        <input type=number  min=1 bind:value={split.weight} />
        <div>
            {percentage(probability(split.weight))}
        </div>
    {/each}
    <button on:click={addSplit}>Add</button>
</div>

<div>
    <button on:click={splitUniverse}>Split Universe</button>
</div>
