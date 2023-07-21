<script lang="ts">
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
	let selected: string = Object.keys(options)[1];
	$: console.log(selected);

	console.log(pl1.tracks);
</script>

<label for="compare_select">Property to Compare</label>
<select id="compare_select" bind:value={selected}>
	{#each Object.keys(options) as option}
		<option value={option}>{options[option].label}</option>
	{/each}
</select>
<table>
	<tr>
		<th>
			<PlaylistHeader pl={pl1} />
		</th>
		<th>compared to</th>
		<th>
			<PlaylistHeader pl={pl2} />
		</th>
	</tr>
	{#if selected == SONG_IDENTICAL}
		<tr>
			<td class="table-data">
				<table class="inner-table">
					{#each pl1.tracks as track}
						<td>
							<img src={track.track.album.images[2].url} />
							<p>{track.track.name} - {track.track.artists.map((artist) => artist.name).join(', ')}</p>
						</td>
					{/each}
				</table>
			</td>
			<td class="table-data">
				<table class="inner-table">
					{#each inter.song.identical as track}
						<td>
							<img src={track.track.album.images[2].url} />
							<p>{track.track.name} - {track.track.artists.map((artist) => artist.name).join(', ')}</p>
						</td>
					{/each}
				</table>
			</td>
			<td class="table-data">
				<table class="inner-table">
					{#each pl1.tracks as track}
						<td>
							<img src={track.track.album.images[2].url} />
							<p>{track.track.name} - {track.track.artists.map((artist) => artist.name).join(', ')}</p>
						</td>
					{/each}
				</table>
			</td>
		</tr>
	{:else if selected == SONG_SIMILAR}
		b
	{:else if selected == ARTIST_FULL}
		c
	{:else if selected == ARTIST_ONE}
		d
	{:else if selected == GENRE_ALBUM}
		e
	{:else if selected == GENRE_ARTIST}
		f
	{:else if selected == DATE_ADDED}
		g
	{/if}
</table>

<style lang="scss">
	.table-data {
		vertical-align: top;

		.inner-table {
			display: flex;
			flex-direction: column;
		}
	}
</style>
