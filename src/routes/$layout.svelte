<script lang="ts">
	let ready: boolean = false;
</script>

<svelte:window on:sveltekit:start={() => (ready = true)} />

<div class="dragbar" />

{#if ready}
	<slot />
{/if}

<style>
	.dragbar {
		-webkit-app-region: drag;
		position: absolute;
		z-index: 100;
		height: 40px;
		width: 100%;
	}
</style>
