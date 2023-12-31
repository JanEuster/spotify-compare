<script lang="ts">
	import type { Playlist, PlaylistedTrack } from '@spotify/web-api-ts-sdk';
	import type { PlaylistAreaType, PlaylistStore, PlaylistWithTracks, SpotifyStore } from '$lib/types';
	import { spotifyPlaylists, spotifyStore } from './stores';
	import TrackView from './common/TrackView.svelte';
	import Hr from './common/Hr.svelte';
	import EditButton from './common/buttons/EditButton.svelte';
	import ReloadButton from './common/buttons/ReloadButton.svelte';
	import GotoButton from './common/buttons/GotoButton.svelte';

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
		const tracks: PlaylistedTrack[] = await spotify!.sdk.playlists.getPlaylistItems(playlist.id);
		return tracks.filter((track) => track.track);
	};

	const getPlaylists = async () => {
		playlist = 'loading';

		let userPlaylists: Playlist[] = [];
		// use stored playlists, when last fetched <60s ago
		if (!(playlistsLastFetched && playlistsLastFetched.fetched?.getTime() - new Date().getTime() < 60 * 1000)) {
			userPlaylists = await spotify!.sdk.currentUser.getPlaylists();
		} else {
			console.log('skip fetch');
			userPlaylists = playlistsLastFetched.playlists;
		}

		console.log(userPlaylists);
		playlist = userPlaylists;
		spotifyPlaylists.set({ playlists: userPlaylists, fetched: new Date() });
	};

	const reload = async () => {
		const oldPlaylist = playlist as PlaylistWithTracks;
		playlist = 'loading';
		const tracks = await getTracks(oldPlaylist.playlist);
		playlist = { playlist: oldPlaylist.playlist, tracks: tracks };
		setPlaylist(playlist);
	};
	const edit = async () => {
		getPlaylists();
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
							playlist = 'loading';
							const tracks = await getTracks(pl);
							playlist = { playlist: pl, tracks: tracks };
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
					<div class="header-content">
						<div class="text">
							<h2>{playlist.playlist.name}</h2>
							<p>{@html playlist.playlist.description}</p>
							<h5>{playlist.tracks.length} tracks</h5>
						</div>
						<div class="buttons">
							<GotoButton href={playlist.playlist.external_urls.spotify} />
							<EditButton onEdit={edit} />
							<ReloadButton onReload={reload} />
						</div>
					</div>
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
					.header-content {
						display: flex;
						justify-content: space-between;
						width: 100%;

						.text {
							padding: 2px 4px;
							p {
								color: var(--c-grey);
							}
							h5 {
								margin-top: 10px;
							}
						}
						.buttons {
							display: flex;
							align-items: start;
							justify-content: end;
							flex-wrap: wrap;
							width: 15%;
							gap: 4px;
							padding: 4px 0;
						}
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
