<script lang="ts">
	import type { Playlist, PlaylistedTrack, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
	import type { PlaylistAreaType, PlaylistStore, PlaylistWithTracks, SpotifyStore } from '$lib/types';
	import { spotifyPlaylists, spotifyStore } from './stores';
	import TrackView from './common/TrackView.svelte';
	import Hr from './common/Hr.svelte';

	export let setPlaylist: (playlist: PlaylistWithTracks) => void;
	export let selectable: boolean;

	let playlist: PlaylistAreaType = null;
	let spotify: SpotifyStore;
	spotifyStore.subscribe((v) => {
		spotify = v;
	});
	let playlistsLastFetched: PlaylistStore | null;
	spotifyPlaylists.subscribe((v) => {
		playlistsLastFetched = v;
	});

	const getTracks = async (playlist: Playlist): Promise<PlaylistedTrack[]> => {
		const tracks: PlaylistedTrack[] = [];
		let offset = 0;
		while (true && spotify) {
			const newTracks = await spotify.sdk.playlists.getPlaylistItems(
				playlist.id,
				undefined,
				undefined,
				undefined,
				offset
			);
			if (newTracks) {
				offset += newTracks.limit;
				tracks.push(...newTracks.items);
			}
			console.log(tracks);
			if (!newTracks || newTracks.offset + newTracks.limit > newTracks.total) {
				break;
			}
		}
		return tracks;
	};

	const getPlaylists = async () => {
		playlist = 'loading';

		let userPlaylists: Playlist[] = [];
		if (!(playlistsLastFetched && playlistsLastFetched.fetched?.getTime() - new Date().getTime() < 60 * 1000)) {
			let offset = 0;
			while (true && spotify) {
				const newPlaylists = await spotify.sdk.playlists.getUsersPlaylists(spotify.profile.id, undefined, offset);
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
	<div>
		{#if !playlist}
			{#if selectable}
				<button class="playlist-area" on:click={getPlaylists}>
					<div class="plus">+</div>
				</button>
			{/if}
		{:else if playlist == 'loading'}
			<p>loading</p>
		{:else if playlist instanceof Array}
			<div class="playlist-list">
				{#each playlist as pl}
					<button
						class="playlist"
						on:click={async () => {
							playlist = { playlist: pl, tracks: await getTracks(pl) };
							setPlaylist(playlist);
						}}
					>
						<div>
							{#if pl.images.length > 0}<img src={pl.images[pl.images.length - 1].url} />{/if}
							<h3>{pl.name}</h3>
						</div>
						<div class="plus">+</div>
					</button>
				{/each}
			</div>
		{:else}
			<div class="playlist-tracks">
				<header>
					<h2>{playlist.playlist.name}</h2>
					<p>{@html playlist.playlist.description}</p>
					<Hr />
				</header>
				<div class="tracks">
					{#each playlist.tracks as track}
						<TrackView {track} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	::-webkit-scrollbar {
		display: none;
	}
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		max-width: 50vw;
		position: relative;

		& > div {
			overflow-y: scroll;
			width: 100%;
			height: 100%;
			& > button {
				width: 100%;
				height: 100%;
				border: 3px dashed black;
				border-radius: 6px;
			}

			& > .playlist-tracks {
				header {
					background-color: var(--c-green-20);
					padding: 2px 4px;
					p {
						color: var(--c-grey);
					}
				}
				.tracks {
					border: 1px dotted var(--c-green-100);
					padding: 4px;
					padding-top: 6px;
				}
			}
		}

		.playlist-area {
			border: 3px solid var(--c-green-60);
			border-radius: 6px;
			background-color: var(--c-green-20);
			cursor: pointer;
			.plus {
				font-size: 40px;
				color: var(--c-green-100);
			}
		}
		.playlist-list {
			border: 3px solid var(--c-green-60);
			border-radius: 6px;
			background-color: var(--c-green-20);

			.playlist {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				height: 60px;
				padding: 5px;
				border-bottom: 2px solid black;
				background-color: var(--c-green-20);
				border: none;
				border-top: 1px solid var(--c-background);
				border-bottom: 1px solid var(--c-background);
				color: var(--c-text);
				& > div {
					display: flex;
					height: 100%;
					gap: 10px;
					text-align: left;
				}
				&:hover {
				}

				.plus {
					width: 20px;
					height: 20px;
				}
			}
		}
	}
</style>
