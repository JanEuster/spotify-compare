<script lang="ts">
	import type { Playlist, PlaylistedTrack, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
	import type {
		PlaylistAreaType,
		PlaylistStore,
		PlaylistWithTracks,
		SpotifyStore
	} from '$lib/types';
	import { spotifyPlaylists, spotifyStore } from './stores';

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
		if (
			!(
				playlistsLastFetched &&
				playlistsLastFetched.fetched?.getTime() - new Date().getTime() < 60 * 1000
			)
		) {
			let offset = 0;
			while (true && spotify) {
				const newPlaylists = await spotify.sdk.playlists.getUsersPlaylists(
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
						<h3>{pl.name}</h3>
						<div class="plus">+</div>
					</button>
				{/each}
			</div>
		{:else}
			<div class="playlist">
				<h2>{playlist.playlist.name}</h2>
				<p>{@html playlist.playlist.description}</p>
				<hr />
				<div class="tracks">
					{#each playlist.tracks as track}
						<div class="track">
							{#if track.track.album}
								<!-- this info can only be displayed when the item is a track, not an episode => track.track.track = true && track.track.episode = false -->
								<img src={track.track.album.images[2].url} />
								<h4>
									<b>{track.track.name}</b>{#if track.track.album.album_type != 'single'}
										- {track.track.album.name}{/if}
								</h4>
								<ul>
									{#each track.track.artists as artist}
										<li><h5>{artist.name}</h5></li>
									{/each}
								</ul>
							{/if}
						</div>
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
		}

		.playlist-area {
			border: 3px solid black;
			border-radius: 6px;
			.plus {
				font-size: 40px;
			}
		}
		.playlist-list {
			border: 3px solid black;
			border-radius: 6px;

			.playlist {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				padding: 5px;
				border-bottom: 2px solid black;

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
