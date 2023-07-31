<script lang="ts">
	import type { PlaylistedTrack, SimplifiedArtist } from '@spotify/web-api-ts-sdk';
	import TrackView from './TrackView.svelte';
	import type { MatchState } from '$lib/types';

	export let artist: SimplifiedArtist;
	export let tracks: PlaylistedTrack[] | null;
	export let tracksAB: { a: PlaylistedTrack[]; b: PlaylistedTrack[] } | null;
	if (!tracks && !tracksAB) {
		throw new Error('no tracks');
	}

	const trackIdsBoth: string[] = [];
	const trackIdsLeft: string[] = [];
	const trackIdsRight: string[] = [];
	const tracksBoth: PlaylistedTrack[] = [];
	const tracksLeft: PlaylistedTrack[] = [];
	const tracksRight: PlaylistedTrack[] = [];
	if (tracksAB) {
		const aTrackIds = tracksAB.a.map((track) => track.track.id);
		const bTrackIds = tracksAB.b.map((track) => track.track.id);
		trackIdsBoth.push(...aTrackIds.filter((trackId) => bTrackIds.includes(trackId)));
		trackIdsLeft.push(...aTrackIds.filter((trackId) => !trackIdsBoth.includes(trackId)));
		trackIdsRight.push(...bTrackIds.filter((trackId) => !trackIdsBoth.includes(trackId)));

		for (const id of trackIdsBoth) {
			for (const track of tracksAB.a) {
				if (track.track.id == id) {
					tracksBoth.push(track);
					break;
				}
			}
		}
		for (const id of trackIdsLeft) {
			for (const track of tracksAB.a) {
				if (track.track.id == id) {
					tracksLeft.push(track);
					break;
				}
			}
		}
		for (const id of trackIdsRight) {
			for (const track of tracksAB.b) {
				if (track.track.id == id) {
					tracksRight.push(track);
					break;
				}
			}
		}
	}

	const trackLength = tracks ? tracks.length : tracksBoth.length + tracksLeft.length + tracksRight.length;
	let showTracks = false;
</script>

<div class="artist-tracks-view">
	<h4>
		{artist.name}
	</h4>
	<div class="open-tracks">
		<button on:click={() => (showTracks = !showTracks)}>
			<img
				src="/arrow_down.png"
				style={!showTracks ? 'transform: rotate(180deg);' : ''}
				alt={showTracks ? 'close tracks' : 'open tracks'}
			/>
			<p>{trackLength} tracks</p>
		</button>
	</div>
	<div class="tracks" style={!showTracks ? 'max-height: 0px; padding: 0;' : ''}>
		{#if tracks}
			{#each tracks as track}
				<TrackView {track} />
			{/each}
		{:else if tracksAB}
			{#each tracksBoth as track}
				<TrackView {track} />
			{/each}
			{#each tracksLeft as track}
				<div class="track-with-arrow">
					<img src="/arrow_left.png" alt="arrow left" /><TrackView {track} />
					<div />
				</div>
			{/each}
			{#each tracksRight as track}
				<div class="track-with-arrow">
					<div />
					<TrackView {track} /><img src="/arrow_right.png" alt="arrow right" />
				</div>
			{/each}
		{/if}
	</div>
	<!-- show another close button below for long artist list -->
	<!-- {#if showTracks && allTracks.length > 6}
		<div class="open-tracks">
			<button on:click={() => (showTracks = false)}>
				<img src="/arrow_down.png" style={'transform: rotate(180deg);'} alt={'close tracks'} />
				<p>close tracks</p>
			</button>
		</div>
	{/if} -->
</div>

<style lang="scss">
	.artist-tracks-view {
		padding: 6px 1px;
		padding-bottom: 12px;
		margin: 7px 3px;
		background-image: url('/bg_striped.png');
		border-radius: 15px;

		h4 {
			padding: 6px 6px;
		}

		.open-tracks {
			margin-left: 4px;
			button {
				display: flex;
				justify-content: start;
				align-items: center;
				background: none;
				border: none;

				img {
					height: 16px;
				}
				p {
					margin-left: 4px;
					color: var(--c-white);
				}
			}

			margin-left: 10px;
		}

		.tracks {
			border-radius: 10px 0 0 10px;
			background-color: var(--c-background);
			margin-left: 10px;
			padding: 6px 6px;
			overflow: hidden;
			overflow-y: scroll;
			max-height: max(300px, 60vh);
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}
	.track-with-arrow {
		display: flex;
		align-items: center;
		:global(.track) {
			width: 100%;
		}
		img {
			width: 32px;
			height: 32px;
		}
		:global(track) {
			width: 100%;
		}
	}
</style>
