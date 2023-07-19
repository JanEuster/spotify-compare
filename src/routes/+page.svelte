<script lang="ts">
	import { onMount } from 'svelte';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import type { Playlist, UserResponse } from '@spotify/web-api-ts-sdk';
	import type { PageData } from './$types';
	import type { PlaylistAreaType } from '$lib/types';
	import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_TARGET_URL } from '$env/static/public';
	import PlaylistArea from '$lib/PlaylistArea.svelte';
	import { spotifyStore } from '$lib/stores';
	export let data: PageData;

	let sdk: SpotifyApi | undefined = undefined;
	if (data.accessToken) {
		sdk = SpotifyApi.withAccessToken(PUBLIC_SPOTIFY_CLIENT_ID, data.accessToken);
		spotifyStore.set({ sdk: sdk, profile: data.profile });
	}

	let playlist1: PlaylistAreaType;
	let playlist2: PlaylistAreaType;
</script>

{#if data.auth && data.profile && sdk}
	<nav>
		<img src={data.profile.images[0].url} />
		{data.profile?.display_name}
	</nav>
	<main>
		<PlaylistArea {sdk} setPlaylist={(playlist) => (playlist1 = playlist)} />
		<PlaylistArea {sdk} setPlaylist={(playlist) => (playlist2 = playlist)} />
	</main>
{:else}
	<a href={'/auth/login'}>sign in</a>
{/if}

<style lang="scss">
	main {
		display: flex;
		width: 100vw;
		min-height: 70vh;
		gap: 5px;
		padding: 10px;
	}
</style>
