<script lang="ts">
	import { onMount } from 'svelte';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import type { UserResponse } from '@spotify/web-api-ts-sdk';
	import type { PageData } from './$types';
	import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_TARGET_URL } from '$env/static/public';
	export let data: PageData;
	const sdk = SpotifyApi.withUserAuthorization(
		PUBLIC_SPOTIFY_CLIENT_ID,
		PUBLIC_TARGET_URL,
		data.scopes
	);
</script>

{#if !data.auth}
	<a href={'/auth/login'}>sign in</a>
{:else}
	<nav>
		<img src={data.profile?.images[0].url} />
		{data.profile?.display_name}
	</nav>
	<main>a</main>
{/if}
