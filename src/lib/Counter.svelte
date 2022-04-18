<script lang="ts">
	import { getStore } from '$lib/utils/hmr-stores';

	export let id: string;
	export let agent: string;

	const count = getStore(id, 0);

	const handleClick = () => {
		$count += 1;
	};

	$: if (window.electron) {
		window.electron.send('to-main', $count);
	}
</script>

<button {id} on:click={handleClick}>
	Send Clicks to {agent}: {$count}
</button>

<style>
	button {
		font-family: inherit;
		font-size: inherit;
		padding: 1em 2em;
		color: #ff3e00;
		background-color: rgba(255, 62, 0, 0.1);
		border-radius: 2em;
		border: 2px solid rgba(255, 62, 0, 0);
		outline: none;
		width: 200px;
		font-variant-numeric: tabular-nums;
	}
	button:focus {
		border: 2px solid #ff3e00;
	}
	button:active {
		background-color: rgba(255, 62, 0, 0.2);
	}
</style>
