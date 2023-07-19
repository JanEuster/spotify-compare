<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if !data.auth}
	<a href={'/auth/login'}>sign in</a>
{:else}
	{JSON.stringify(data.profile)}
{/if}
