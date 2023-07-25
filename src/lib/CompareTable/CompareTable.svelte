<script lang="ts">
	import Hr from '$lib/common/Hr.svelte';
	import TrackView from '$lib/common/TrackView.svelte';
	import type { PlaylistIntersections, PlaylistWithTracks } from '$lib/types';
	import { generateIntersections } from '$lib/util';
	import PlaylistHeader from './PlaylistHeader.svelte';
	export let pl1: PlaylistWithTracks;
	export let pl2: PlaylistWithTracks;
	let playlistIntersections: PlaylistIntersections = generateIntersections(pl1, pl2);
	const inter = playlistIntersections;

	const SONG_IDENTICAL = 'song.identical';
	const SONG_SIMILAR = 'song.similar';
	const ARTIST_FULL = 'artist.full';
	const ARTIST_ONE = 'artist.one';
	const ALBUM = 'album';
	const GENRE_ALBUM = 'genre.album';
	const GENRE_ARTIST = 'genre.artist';
	const DATE_ADDED = 'date.added';

	const options = {
		'song.identical': { label: 'Song (identical)', data: playlistIntersections.song.identical },
		'song.similar': {
			label: 'Song (similar) > e.g. differnet release of song',
			data: playlistIntersections.song.similar
		},
		'artist.full': { label: 'Artist (full)', data: playlistIntersections.artist.full },
		'artist.one': { label: 'Artist (one)', data: playlistIntersections.artist.one },
		album: { label: 'Album', data: playlistIntersections.album },
		'genre.album': { label: 'Genre (Album)', data: playlistIntersections.genre.album },
		'genre.artist': { label: 'Genre (Artist)', data: playlistIntersections.genre.artist },
		'date.added': { label: 'Date added', data: playlistIntersections.date_added }
	};
	let selected: string = SONG_IDENTICAL;
	$: console.log(selected);

	console.log(pl1.tracks);
</script>

<table>
	<tr class="table-head-row">
		<th>
			<PlaylistHeader pl={pl1} />
		</th>
		<th>
			<select id="compare_select" bind:value={selected}>
				{#each Object.keys(options) as option}
					<option value={option}>{options[option].label}</option>
				{/each}
			</select>
			<h2>compared to</h2>
			<div>
				{#if selected == SONG_IDENTICAL}
					{inter.song.identical.length} Songs
				{:else if selected == SONG_SIMILAR}
					{inter.song.similar.length} Songs
				{:else if selected == ARTIST_FULL}
					{inter.artist.full.length} Artists
				{:else if selected == ARTIST_ONE}
					{inter.artist.one.length} Artists
				{:else if selected == ALBUM}
					{inter.album.same.length} Albums
				{:else if selected == GENRE_ALBUM}
					{inter.genre.album.length} Genres
				{:else if selected == GENRE_ARTIST}
					{inter.genre.artist.length} Genres
				{:else if selected == DATE_ADDED}
					{inter.date_added.length}
				{/if}
			</div>
		</th>
		<th>
			<PlaylistHeader pl={pl2} />
		</th>
	</tr>
	<tr><td><Hr /></td><td><Hr /></td><td><Hr /></td></tr>
	{#if selected == SONG_IDENTICAL}
		<tr>
			<td class="table-data">
				<table class="inner-table">
					{#each pl1.tracks as track}
						<td>
							<TrackView {track} />
						</td>
					{/each}
				</table>
			</td>
			<td class="table-data">
				<table class="inner-table">
					{#each inter.song.identical as track}
						<td>
							<TrackView {track} />
						</td>
					{/each}
				</table>
			</td>
			<td class="table-data">
				<table class="inner-table">
					{#each pl2.tracks as track}
						<td>
							<TrackView {track} />
						</td>
					{/each}
				</table>
			</td>
		</tr>
	{:else if selected == SONG_SIMILAR}
		<tr>
			<td class="table-data">
				<table class="inner-table">
					{#each pl1.tracks as track}
						<td>
							<TrackView {track} />
						</td>
					{/each}
				</table>
			</td>
			<td class="table-data">
				<table class="inner-table">
					{#each inter.song.similar as track}
						<td>
							<TrackView {track} />
						</td>
					{/each}
				</table>
			</td>
			<td class="table-data">
				<table class="inner-table">
					{#each pl2.tracks as track}
						<td>
							<TrackView {track} />
						</td>
					{/each}
				</table>
			</td>
		</tr>
	{:else if selected == ARTIST_FULL}
		c
	{:else if selected == ARTIST_ONE}
		d
	{:else if selected == ALBUM}
		e
	{:else if selected == GENRE_ALBUM}
		f
	{:else if selected == GENRE_ARTIST}
		g
	{:else if selected == DATE_ADDED}
		h
	{/if}
</table>

<style lang="scss">
	table {
		border: none;
		border-collapse: collapse;

		th {
			padding: 4px 0;
		}
		th:nth-child(1),
		th:nth-child(3) {
			width: 35.5%;
		}
		th:nth-child(2) {
			width: 26%;
		}

		.table-head-row {
			background-color: var(--c-green-20);
		}
		.table-data {
			vertical-align: top;

			.inner-table {
				display: flex;
				flex-direction: column;
			}
		}
	}
</style>
