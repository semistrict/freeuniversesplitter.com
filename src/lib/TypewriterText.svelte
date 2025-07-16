<script lang="ts">
    import { onMount } from 'svelte';
    
    export let text: string = '';
    export let speed: number = 30; // characters per second
    export let delay: number = 0; // initial delay in ms
    
    let visibleCount = 0;
    let isTyping = false;
    let hasTyped = false;
    
    onMount(() => {
        if (text && !hasTyped) {
            typeText();
        }
    });
    
    async function typeText() {
        if (hasTyped) return;
        
        isTyping = true;
        hasTyped = true;
        visibleCount = 0;
        
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        const chars = text.split('');
        const intervalTime = 1000 / speed;
        
        for (let i = 0; i < chars.length; i++) {
            visibleCount = i + 1;
            await new Promise(resolve => setTimeout(resolve, intervalTime));
        }
        
        isTyping = false;
    }
    
    // Re-type when text changes (only if we haven't typed yet)
    $: if (text && !hasTyped) {
        typeText();
    }
</script>

<span class="typewriter-text">
    {#each text.split('') as char, i}
        <span class="char" class:visible={i < visibleCount}>{char}</span>
    {/each}
</span>

<style>
    .typewriter-text {
        display: inline;
    }
    
    .char:not(.visible) {
        color: transparent;
        background: transparent;
    }
    
    .char.visible {
        color: inherit;
        background: inherit;
    }
</style>