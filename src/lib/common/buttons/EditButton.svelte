<script lang="ts">
	export let onEdit: () => void;
</script>

<button on:click={onEdit}>
	<img src="/edit_.png" alt="edit" title="change" />
</button>

<style lang="scss">
	button {
		background-color: transparent;
		border: 2px dashed var(--c-green-100);
		width: 30px;
		height: 30px;
		padding: 2px;
		display: flex;
		img {
			width: 100%;
			height: 100%;
		}
	}
</style>
