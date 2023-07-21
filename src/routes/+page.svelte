<script lang="ts">
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import type { PageData } from './$types';
	import type { PlaylistWithTracks } from '$lib/types';
	import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
	import PlaylistArea from '$lib/PlaylistArea.svelte';
	import { spotifyStore } from '$lib/stores';
	import CompareTable from '$lib/CompareTable/CompareTable.svelte';
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
			<a href={data.profile.external_urls.spotify}><h3>{data.profile?.display_name}</h3></a>
		</nav>
		<main>
			{#if !(playlist1 && playlist2)}
				<div class="playlist-areas-container">
					<PlaylistArea
						selectable={true}
						setPlaylist={async (playlist) => (playlist1 = playlist)}
					/>
					<PlaylistArea
						selectable={playlist2Selectable}
						setPlaylist={async (playlist) => {
							playlist2 = playlist;
						}}
					/>
				</div>
			{:else}
				<CompareTable pl1={playlist1} pl2={playlist2} />
			{/if}
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
			flex-direction: column;
			width: 100vw;
			height: 90%;
			// min-height: 70vh;
			gap: 5px;
			padding: 10px;

			.playlist-areas-container {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: row;
			}
		}
	}
</style>
