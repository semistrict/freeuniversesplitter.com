<script lang="ts">
    export let href: string = "/";
</script>

<div class="back-link">
    <a {href}>← Back</a>
</div>

<style>
    .back-link {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 10;
    }
</style>