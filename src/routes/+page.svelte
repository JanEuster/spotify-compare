<script lang="ts">
	import { onMount } from 'svelte';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import type {
		Playlist,
		PlaylistedTrack,
		Track,
		Tracks,
		UserResponse
	} from '@spotify/web-api-ts-sdk';
	import type { PageData } from './$types';
	import type { PlaylistAreaType, PlaylistWithTracks } from '$lib/types';
	import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_TARGET_URL } from '$env/static/public';
	import PlaylistArea from '$lib/PlaylistArea.svelte';
	import { spotifyStore } from '$lib/stores';
	export let data: PageData;

	let sdk: SpotifyApi | undefined = undefined;
	if (data.accessToken) {
		sdk = SpotifyApi.withAccessToken(PUBLIC_SPOTIFY_CLIENT_ID, data.accessToken);
		spotifyStore.set({ sdk: sdk, profile: data.profile });
		console.log(data.accessToken);
	}

	let playlist1: PlaylistWithTracks | null = null;
	let playlist2: PlaylistWithTracks | null = null;
	let playlist2Selectable = false;

	$: playlist2Selectable = Boolean(playlist1 && (playlist1 as PlaylistWithTracks).playlist.owner);
	$: console.log(playlist1);
</script>

<div class="app">
	{#if data.auth && data.profile && sdk}
		<nav>
			<img src={data.profile.images[0].url} alt="user profile" />
			<a href={'https://open.spotify.com/user/' + data.profile.id}
				><h3>{data.profile?.display_name}</h3></a
			>
		</nav>
		<main>
			<PlaylistArea selectable={true} setPlaylist={async (playlist) => (playlist1 = playlist)} />
			<PlaylistArea
				selectable={playlist2Selectable}
				setPlaylist={async (playlist) => (playlist2 = playlist)}
			/>
		</main>
	{:else}
		<a href={'/auth/login'}>sign in</a>
	{/if}
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		nav {
			display: flex;
			height: 10%;
		}
		main {
			display: flex;
			width: 100vw;
			height: 90%;
			// min-height: 70vh;
			gap: 5px;
			padding: 10px;
		}
	}
</style>
