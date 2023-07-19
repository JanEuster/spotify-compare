<script lang="ts">
	import type { Playlist, SpotifyApi } from '@spotify/web-api-ts-sdk';
	import type { PlaylistAreaType, PlaylistStore, SpotifyStore } from '$lib/types';
	import { spotifyPlaylists, spotifyStore } from './stores';

	export let setPlaylist: (playlist: Playlist) => void;
	export let sdk: SpotifyApi;

	let playlist: PlaylistAreaType = null;
	let spotify: SpotifyStore;
	spotifyStore.subscribe((v) => {
		spotify = v;
	});
	let playlistsLastFetched: PlaylistStore | null;
	spotifyPlaylists.subscribe((v) => {
		playlistsLastFetched = v;
	});

	const getPlaylists = async () => {
		playlist = 'loading';

		let userPlaylists: Playlist[] = [];
		if (
			!(
				playlistsLastFetched &&
				playlistsLastFetched.fetched?.getTime() - new Date().getTime() < 60 * 1000
			)
		) {
			let offset = 0;
			while (true && spotify) {
				const newPlaylists = await sdk!.playlists.getUsersPlaylists(
					spotify.profile.id,
					undefined,
					offset
				);
				console.log(newPlaylists.limit, newPlaylists.offset, newPlaylists.total);
				userPlaylists.push(...newPlaylists.items);
				if (newPlaylists.limit + newPlaylists.offset > newPlaylists.total) {
					break;
				}
				offset += newPlaylists.limit;
			}
		} else {
			console.log('skip fetch');
			userPlaylists = playlistsLastFetched.playlists;
		}
		console.log(userPlaylists);
		playlist = userPlaylists;
		spotifyPlaylists.set({ playlists: userPlaylists, fetched: new Date() });
	};
</script>

<div class="container">
	{#if !playlist}
		<button on:click={getPlaylists}>
			<div>+</div>
		</button>
	{:else if playlist == 'loading'}
		<p>loading</p>
	{:else if playlist instanceof Array}
		{#each playlist as pl}
			<div>
				<h3>{pl.name}</h3>
				<button on:click={() => (playlist = pl)}>+</button>
			</div>
		{/each}
	{:else}
		<div>
			<h2>{playlist.name}</h2>
			<p>{@html playlist.description}</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 50vw;

		& > button {
			width: 100%;
			height: 100%;
			border: 1px dashed black;
		}
	}
</style>
