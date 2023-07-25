<script lang="ts">
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import type { PageData } from './$types';
	import type { PlaylistWithTracks } from '$lib/types';
	import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
	import PlaylistArea from '$lib/PlaylistArea.svelte';
	import { spotifyStore } from '$lib/stores';
	import CompareTable from '$lib/CompareTable/CompareTable.svelte';
	import { makeSpotifyRequest } from '$lib/auth';
	import { onMount } from 'svelte';
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
	let compare = false;

	$: playlist2Selectable = Boolean(playlist1 && (playlist1 as PlaylistWithTracks).playlist.owner);
	$: console.log('playlist1', playlist1);
	$: console.log('playlist2', playlist2);
</script>

<div class="app">
	{#if data.auth && data.profile && sdk}
		<nav>
			<div>
				<img src={data.profile.images[data.profile.images.length - 1].url} alt="user profile" />
				<a href={data.profile.external_urls.spotify}><h3>{data.profile?.display_name}</h3></a>
			</div>
			<h1>Spotify-Compare</h1>
		</nav>
		<main>
			<div class="playlist-areas-container" style={compare ? 'display: none;' : ''}>
				<PlaylistArea selectable={true} setPlaylist={async (playlist) => (playlist1 = playlist)} />
				{#if playlist1 && playlist2}
					<button class="compare-now" on:click={() => (compare = true)}>compare now</button>
				{/if}
				<PlaylistArea
					selectable={playlist2Selectable}
					setPlaylist={async (playlist) => {
						playlist2 = playlist;
					}}
				/>
			</div>
			{#if playlist1 && playlist2}
				<div class="compare-table-wrapper" style={!compare ? 'display: none;' : ''}>
					<button on:click={() => (compare = false)}>Back</button>
					<CompareTable pl1={playlist1} pl2={playlist2} />
				</div>
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
			flex-direction: row;
			justify-content: space-between;
			height: 10%;
			div {
				display: flex;
				img {
					aspect-ratio: 1;
					min-width: 40px;
					min-height: 40px;
					width: 10vmin;
					height: 10vmin;
				}
			}
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
				gap: 2px;

				.compare-now {
					background-color: var(--c-green-20);
					border: 1px dotted var(--c-green-60);
					outline: 1px dotted var(--c-green-100);
					border-radius: 6px;
					max-height: 100px;
					min-width: 100px;
					color: var(--c-text);
				}
			}
			.compare-table-wrapper {
				button {
					width: 100%;
				}
			}
		}
	}
</style>
