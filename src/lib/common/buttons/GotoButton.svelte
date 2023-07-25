<script lang="ts">
	export let href: string;
</script>

<a {href} target="_blank"><img src="/goto.png" alt="goto" title="goto" /></a>

<style lang="scss">
	a {
		background-color: transparent;
		border: 2px dashed var(--c-green-100);
		width: 30px;
		height: 30px;
		padding: 2px;
		display: flex;
		opacity: 0.8;
		&:hover {
			opacity: 1;
		}
		img {
			width: 100%;
			height: 100%;
		}
	}
</style>
