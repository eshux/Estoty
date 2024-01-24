<script>
	export let handleClick;
	export let selected;
</script>

<button class={selected ? 'selected' : ''} on:click={handleClick}>
	<slot />
</button>

<style>
	button {
		padding: 8px 24px;
    margin: 0 8px 8px 0;
		border: none;
		border-radius: 4px;
		background-color: #a5dfdf;
		color: #3b4e4e;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: 0.2s;
	}

	button:hover {
		background-color: #9bcfcf;
	}

	.selected {
		background-color: #86b4b4;
    color: #212c2c;
    cursor: default;
	}

  .selected:hover {
		background-color: #86b4b4;
    color: #212c2c;
	}
</style>
